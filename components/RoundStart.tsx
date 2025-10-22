import React from 'react';

interface RoundStartProps {
  currentRound: number;
  onStart: () => void;
}

const RoundStart: React.FC<RoundStartProps> = ({ currentRound, onStart }) => {
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
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out"
      aria-modal="true"
      role="dialog"
      style={{
        animation: 'fadeIn 0.3s ease-out',
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {/* 딤 레이어 (영상과 모달 사이) - 약간 어둡게 */}
      <div
        className="absolute inset-0 bg-black/20 z-10"
        style={{
          animation: 'fadeIn 0.3s ease-out',
          willChange: 'opacity',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* 콘텐츠 레이어 */}
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-lg transform transition-all duration-500 ease-out pointer-events-auto z-50 relative"
        style={{
          animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      >
        <h1 className="text-6xl font-display text-accent-yellow drop-shadow-md">
          Round {currentRound} Start!
        </h1>
        <p className="mt-4 text-2xl text-secondary-text font-sans">
          Write it right, write it fast!
        </p>
        
        <button 
          onClick={onStart}
          className="mt-8 px-12 py-4 text-3xl font-display text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 ease-out"
        >
          Ready, Set, Go!
        </button>
      </div>
    </div>
  );
};

export default RoundStart;