import React, { useEffect, useState, useRef } from 'react';
import { ensureAudioUnlocked } from '../utils/soundEffects.ts';

interface CountingNumberProps {
  from: number;
  to: number;
  duration?: number; // milliseconds
  onComplete?: () => void;
  playSound?: boolean; // 사운드 재생 여부 (기본값: true)
}

const CountingNumber: React.FC<CountingNumberProps> = ({ from, to, duration = 800, onComplete, playSound = true }) => {
  const [count, setCount] = useState(from);
  const [isPulsing, setIsPulsing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTickAtRef = useRef<number>(0);

  // Counting 전 오디오 컨텍스트가 잠겨있지 않도록 보장
  useEffect(() => {
    ensureAudioUnlocked();
  }, []);

  // 이 컴포넌트 전용 오디오 컨텍스트 재사용(브라우저 정책 친화적)
  const getCtx = () => {
    // 전역 unlock이 된 뒤 생성하는 것이 안전
    try {
      // 단일 인스턴스 보장
      if (!(window as any).__countingAudioCtx) {
        (window as any).__countingAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return (window as any).__countingAudioCtx as AudioContext;
    } catch {
      return null;
    }
  };

  const resumeCtxIfNeeded = async (ctx: AudioContext | null) => {
    if (!ctx) return;
    try {
      if (ctx.state !== 'running') {
        await ctx.resume();
      }
    } catch {}
  };

  useEffect(() => {
    console.log('🔢 CountingNumber 시작:', { from, to, duration });
    
    // 초기값 설정
    setCount(from);

    // 카운팅 애니메이션 - 각 숫자를 순차적으로 표시 (카지노 스타일)
    const difference = to - from;

    if (difference === 0) {
      return;
    }

    // 각 숫자당 표시 시간 (ms)
    const timePerStepRaw = duration / Math.abs(difference);
    const timePerStep = Math.max(50, timePerStepRaw); // 최소 50ms로 상향하여 안정적 재생 보장
    let currentValue = from;
    const direction = difference > 0 ? 1 : -1;
    let timerId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    // 카지노 틱틱 사운드 함수 - 점점 높아지는 소리
    const playTickSound = async (currentStep: number, totalSteps: number) => {
      try {
        const audioContext = getCtx();
        if (!audioContext) return;
        await resumeCtxIfNeeded(audioContext);

        // 너무 촘촘한 호출은 스킵 (동시 생성/드랍 방지)
        const nowMs = performance.now();
        if (nowMs - lastTickAtRef.current < 55) {
          return; // 최소 간격 55ms
        }
        lastTickAtRef.current = nowMs;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 진행도에 따라 점점 높아지는 음
        const progress = currentStep / Math.max(1, totalSteps);
        const frequency = 900 + (progress * 700); // 900Hz → 1600Hz로 점점 높아짐
        
        const startAt = audioContext.currentTime + 0.005; // 오디오 타임라인에 살짝 여유
        const dur = 0.07; // 약간 더 길게
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gainNode.gain.setValueAtTime(0.18, startAt);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startAt + dur);

        oscillator.type = 'triangle'; // tick이 더 잘 들리도록
        oscillator.start(startAt);
        oscillator.stop(startAt + dur);
        oscillator.onended = () => {
          try {
            oscillator.disconnect();
            gainNode.disconnect();
          } catch {}
        };
      } catch (error) {
        console.log('Audio not supported');
      }
    };

    // 카운팅 완료 사운드 (띠링!) - 더 명확하고 기분 좋은 소리
    const playCompleteSound = async () => {
      try {
        const audioContext = getCtx();
        if (!audioContext) return;
        await resumeCtxIfNeeded(audioContext);

        // 성공 사운드 - 올라가는 아르페지오
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          const startTime = audioContext.currentTime + index * 0.06;
          oscillator.frequency.setValueAtTime(freq, startTime);
          gainNode.gain.setValueAtTime(0.28, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

          oscillator.type = 'sine';
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.4);
          oscillator.onended = () => {
            try {
              oscillator.disconnect();
              gainNode.disconnect();
            } catch {}
          };
        });
      } catch (error) {
        console.log('Audio not supported');
      }
    };

    let stepCount = 0;
    const totalSteps = Math.abs(difference);

    const stepToNextNumber = () => {
      if (isCancelled) return;

      currentValue += direction;
      setCount(currentValue);
      stepCount++;

      // 펄스 효과 트리거
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 100);

      // 숫자가 바뀔 때마다 틱 소리 (진행도에 따라 음이 높아짐)
      if (playSound) {
        void playTickSound(stepCount, totalSteps);
      }

      if (currentValue !== to) {
        timerId = setTimeout(stepToNextNumber, timePerStep);
      } else {
        // 카운팅 완료 시 띠링 소리 (약간의 딜레이 후)
        if (playSound) {
          setTimeout(() => { void playCompleteSound(); }, 50);
        }
        // 완료 시 최종 펄스 효과
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 500);
        if (onComplete) onComplete();
      }
    };

    // 첫 번째 단계 즉시 시작 (지연 없이)
    stepToNextNumber();

    // Cleanup function
    return () => {
      isCancelled = true;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [from, to, duration, onComplete, playSound]);

  return (
    <span
      className={`inline-block tabular-nums transition-all duration-100 ${isPulsing ? 'number-pop' : ''}`}
      style={{ minWidth: '3ch' }}
    >
      {count}
    </span>
  );
};

export default CountingNumber;
