import React, { useEffect, useState } from 'react';

interface GameTitleScreenProps {
  onComplete: () => void;
}

const GameTitleScreen: React.FC<GameTitleScreenProps> = ({ onComplete }) => {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // 0.5초 후에 타이틀 텍스트가 나타나도록
    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    // 4초 후에 다음 화면으로 이동
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-white"
      style={{
        backgroundImage: 'url(/images/title_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 타이틀 텍스트 */}
      <div
        className={`transition-all duration-1000 ease-out ${
          showTitle 
            ? 'opacity-100 scale-100 transform translate-y-0' 
            : 'opacity-0 scale-75 transform translate-y-8'
        }`}
        style={{
          animation: showTitle ? 'bounceIn 1s ease-out' : 'none'
        }}
      >
        <img
          src="/images/titletext.png"
          alt="Word Race"
          className="w-auto h-auto max-w-5xl"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
            transform: 'scale(1.3)'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95) translateY(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default GameTitleScreen;
