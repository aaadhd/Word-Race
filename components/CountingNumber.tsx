import React, { useEffect, useState, useRef } from 'react';

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
    const timePerStep = duration / Math.abs(difference);
    let currentValue = from;
    const direction = difference > 0 ? 1 : -1;
    let timerId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    // 카지노 틱틱 사운드 함수 - 점점 높아지는 소리
    const playTickSound = (currentStep: number, totalSteps: number) => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 진행도에 따라 점점 높아지는 음
        const progress = currentStep / totalSteps;
        const frequency = 800 + (progress * 600); // 800Hz에서 1400Hz로 점점 높아짐
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.025);

        oscillator.type = 'sine'; // sine으로 부드럽게
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.025);
      } catch (error) {
        console.log('Audio not supported');
      }
    };

    // 카운팅 완료 사운드 (띠링!) - 더 명확하고 기분 좋은 소리
    const playCompleteSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // 성공 사운드 - 올라가는 아르페지오
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          const startTime = audioContext.currentTime + index * 0.06;
          oscillator.frequency.setValueAtTime(freq, startTime);
          gainNode.gain.setValueAtTime(0.2, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

          oscillator.type = 'sine';
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.4);
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
        playTickSound(stepCount, totalSteps);
      }

      if (currentValue !== to) {
        timerId = setTimeout(stepToNextNumber, timePerStep);
      } else {
        // 카운팅 완료 시 띠링 소리 (약간의 딜레이 후)
        if (playSound) {
          setTimeout(() => {
            playCompleteSound();
          }, 50);
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
