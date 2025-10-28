import React, { useRef, useEffect, useState } from 'react';
import { playRoundStart, playButtonClick } from '../utils/soundEffects.ts';

interface RoundStartProps {
  currentRound: number;
  onStart: () => void;
}

const RoundStart: React.FC<RoundStartProps> = ({ currentRound, onStart }) => {
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // 각 라운드별 배경 비디오 자동 재생
  useEffect(() => {
    setVideoLoaded(false); // 라운드 변경 시 로딩 상태 리셋
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play().catch(console.error);
    }
  }, [currentRound]);

  // 라운드 시작 사운드 재생
  useEffect(() => {
    // 모달이 나타난 후 사운드 재생 (3초 딜레이)
    const timer = setTimeout(() => {
      playRoundStart();
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentRound]);

  // 비디오 로딩 완료 감지
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // 각 라운드별 배경 비디오 소스 반환
  const getBackgroundVideoSrc = () => {
    const cycleRound = currentRound <= 4 ? currentRound : ((currentRound - 1) % 4) + 1;
    
    switch(cycleRound) {
      case 1:
        return '/videos/alpaca_bg.mp4';
      case 2:
        return '/videos/panda_bg.mp4';
      case 3:
        return '/videos/koala_bg.mp4';
      case 4:
        return '/videos/bigcat_bg.mp4';
      default:
        return '/videos/alpaca_bg.mp4';
    }
  };

  const getBackgroundConfig = () => {
    switch(currentRound) {
      case 1:
        return {
          bgColor: '#ffe0f0',
          gradients: [
            'rgba(255, 0, 100, 0.25)',
            'rgba(255, 150, 0, 0.25)',
            'rgba(0, 150, 255, 0.25)',
            'rgba(255, 100, 150, 0.25)'
          ],
          pawColors: ['#ff1493', '#ff6347']
        };
      case 2:
        return {
          bgColor: '#e0f0ff',
          gradients: [
            'rgba(0, 150, 255, 0.3)',
            'rgba(0, 255, 150, 0.3)',
            'rgba(255, 200, 0, 0.25)',
            'rgba(150, 0, 255, 0.25)'
          ],
          pawColors: ['#1e90ff', '#00fa9a']
        };
      case 3:
        return {
          bgColor: '#e0ffe0',
          gradients: [
            'rgba(0, 255, 100, 0.3)',
            'rgba(255, 255, 0, 0.25)',
            'rgba(0, 200, 255, 0.25)',
            'rgba(100, 255, 100, 0.3)'
          ],
          pawColors: ['#00ff7f', '#ffd700']
        };
      case 4:
        return {
          bgColor: '#f0e0ff',
          gradients: [
            'rgba(150, 0, 255, 0.3)',
            'rgba(255, 0, 150, 0.3)',
            'rgba(0, 100, 255, 0.25)',
            'rgba(255, 100, 255, 0.25)'
          ],
          pawColors: ['#9370db', '#ff1493']
        };
      case 5:
        return {
          bgColor: '#fff0e0',
          gradients: [
            'rgba(255, 150, 0, 0.3)',
            'rgba(255, 50, 50, 0.3)',
            'rgba(255, 200, 0, 0.3)',
            'rgba(255, 100, 100, 0.3)'
          ],
          pawColors: ['#ff8c00', '#ff4500']
        };
      default:
        return {
          bgColor: '#ffe0f0',
          gradients: [
            'rgba(255, 0, 100, 0.25)',
            'rgba(255, 150, 0, 0.25)',
            'rgba(0, 150, 255, 0.25)',
            'rgba(255, 100, 150, 0.25)'
          ],
          pawColors: ['#ff1493', '#ff6347']
        };
    }
  };
  
  const bgConfig = getBackgroundConfig();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-modal="true"
      role="dialog"
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)',
        zIndex: 1
      }}
    >
      {/* 배경 이미지 - 비디오 로딩 전 또는 fallback */}
      <img
        src="/images/background.png"
        alt="background"
        className="absolute transition-opacity duration-1000"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          left: 0,
          top: 0,
          zIndex: 1,
          opacity: videoLoaded ? 0 : 1,
          pointerEvents: 'none'
        }}
      />

      {/* 각 라운드별 배경 비디오 */}
      <video
        ref={backgroundVideoRef}
        className="absolute transition-opacity duration-1000"
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          left: 0,
          top: 0,
          zIndex: 1,
          opacity: videoLoaded ? 1 : 0,
          pointerEvents: 'none'
        }}
      >
        <source src={getBackgroundVideoSrc()} type="video/mp4" />
      </video>

      {/* 딤 레이어 (배경과 모달 사이) - 흰색 딤 20% */}
      <div
        className="absolute inset-0 bg-white/20"
        style={{
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          zIndex: 2
        }}
      />

      {/* 콘텐츠 레이어 */}
      <div
        className="bg-gradient-to-br from-yellow-300 via-orange-200 to-pink-300 rounded-3xl shadow-2xl p-6 text-center w-full max-w-xs pointer-events-auto relative border-6 border-white"
        style={{
          opacity: 0,
          transform: 'scale(0.9)',
          animation: 'modalAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          animationDelay: '3s',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 8px rgba(255,255,255,0.1)',
          zIndex: 3
        }}
      >
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-3 mb-5">
          <h1 className="text-5xl font-display bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Round {currentRound}
          </h1>
        </div>

        <button
          onClick={() => {
            playButtonClick();
            onStart();
          }}
          className="relative px-10 py-3 text-2xl font-display text-white bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 ease-out border-4 border-white transform hover:rotate-1"
          style={{
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4), inset 0 -4px 0 rgba(0,0,0,0.1)'
          }}
        >
          <span className="drop-shadow-md">START! 🚀</span>
        </button>
      </div>
    </div>
  );
};

export default RoundStart;