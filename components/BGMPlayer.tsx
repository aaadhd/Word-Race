import React, { useRef, useEffect, useState } from 'react';

interface BGMPlayerProps {
  volume?: number; // 0.0 ~ 1.0
  startTime?: number; // 시작 시간 (초)
  loop?: boolean;
  autoPlay?: boolean;
  fadeInDuration?: number; // 페이드인 지속시간 (초)
}

const BGMPlayer: React.FC<BGMPlayerProps> = ({ 
  volume = 0.3, 
  startTime = 0, 
  loop = true, 
  autoPlay = true,
  fadeInDuration = 2.0
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 시작 시간 설정
    if (startTime > 0) {
      audio.currentTime = startTime;
    }

    // 로딩 완료 이벤트
    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        // 페이드인 효과로 시작
        audio.volume = 0;
        setIsFadingIn(true);
        audio.play().then(() => {
          setIsPlaying(true);
          // 페이드인 애니메이션
          fadeIn(audio, volume, fadeInDuration);
        }).catch((error) => {
          console.log('BGM 자동 재생 실패:', error);
        });
      }
    };

    // 재생 시작 이벤트
    const handlePlay = () => {
      setIsPlaying(true);
    };

    // 재생 일시정지 이벤트
    const handlePause = () => {
      setIsPlaying(false);
    };

    // 재생 종료 이벤트
    const handleEnded = () => {
      setIsPlaying(false);
      if (loop) {
        audio.currentTime = startTime;
        audio.play();
      }
    };

    // 에러 이벤트
    const handleError = (error: Event) => {
      console.error('BGM 재생 오류:', error);
    };

    // 이벤트 리스너 등록
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [startTime, loop, autoPlay, volume, fadeInDuration]);

  // 페이드인 함수
  const fadeIn = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const startVolume = 0;
    const startTime = Date.now();
    
    const fadeInInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      audio.volume = startVolume + (targetVolume - startVolume) * progress;
      
      if (progress >= 1) {
        clearInterval(fadeInInterval);
        setIsFadingIn(false);
      }
    }, 50);
  };

  // 볼륨 변경 시 업데이트 (페이드인 중이 아닐 때만)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !isFadingIn) {
      audio.volume = volume;
    }
  }, [volume, isFadingIn]);

  // 시작 시간 변경 시 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isLoaded) {
      audio.currentTime = startTime;
    }
  }, [startTime, isLoaded]);

  return (
    <audio
      ref={audioRef}
      src="/musics/bgm.mp3"
      preload="auto"
      loop={loop}
      style={{ display: 'none' }}
    />
  );
};

export default BGMPlayer;
