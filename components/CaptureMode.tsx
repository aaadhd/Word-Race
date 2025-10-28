import React from 'react';
import { ANIMAL_CONFIGS } from '../constants/animalConfig.ts';

interface CaptureModeProps {
  currentRound: number;
}

const CaptureMode: React.FC<CaptureModeProps> = ({ currentRound }) => {
  // 현재 라운드의 사이클 계산 (1-4 반복)
  const cycleRound = currentRound <= 4 ? currentRound : ((currentRound - 1) % 4) + 1;

  // 각 라운드별 동물 스타일 설정
  const getAnimalStyles = () => {
    switch(cycleRound) {
      case 1:
        return {
          teamA: {
            src: '/images/alpaca.png',
            alt: 'alpaca',
            height: '740px',
            transform: 'translate3d(0, 0, 0) scaleX(1.1)',
            transformOrigin: 'left center'
          },
          teamB: {
            src: '/images/chick.png',
            alt: 'chick',
            height: '740px',
            transform: 'translate3d(0, 0, 0) scaleX(1.07)',
            transformOrigin: 'right center'
          }
        };
      case 2:
        return {
          teamA: {
            src: '/images/panda.png',
            alt: 'panda',
            height: '740px',
            transform: 'translate3d(2%, -2%, 0) scaleX(0.95)',
            transformOrigin: 'left center'
          },
          teamB: {
            src: '/images/sloth.png',
            alt: 'sloth',
            height: '740px',
            transform: 'translate3d(-3%, 0, 0) scaleX(1.05)',
            transformOrigin: 'right center'
          }
        };
      case 3:
        return {
          teamA: {
            src: '/images/koala.png',
            alt: 'koala',
            height: '740px',
            transform: 'translate3d(3%, 0, 0)',
            transformOrigin: 'left center'
          },
          teamB: {
            src: '/images/tiger.png',
            alt: 'tiger',
            height: '740px',
            transform: 'translate3d(-3%, 0, 0)',
            transformOrigin: 'right center'
          }
        };
      case 4:
        return {
          teamA: {
            src: '/images/bigcat.png',
            alt: 'bigcat',
            height: '760px',
            transform: 'translate3d(0, 0, 0) scaleX(0.95)',
            transformOrigin: 'left center'
          },
          teamB: {
            src: '/images/capybara.png',
            alt: 'capybara',
            height: '760px',
            transform: 'translate3d(0, 0, 0) scaleX(0.95)',
            transformOrigin: 'right center'
          }
        };
      default:
        return {
          teamA: {
            src: '/images/alpaca.png',
            alt: 'alpaca',
            height: '740px',
            transform: 'translate3d(0, 0, 0) scaleX(1.1)',
            transformOrigin: 'left center'
          },
          teamB: {
            src: '/images/chick.png',
            alt: 'chick',
            height: '740px',
            transform: 'translate3d(0, 0, 0) scaleX(1.07)',
            transformOrigin: 'right center'
          }
        };
    }
  };

  const animalStyles = getAnimalStyles();

  return (
    <div
      className="relative h-full w-full"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#87CEEB', // 하늘색 배경 (이미지 로드 실패시 대체)
        backgroundImage: 'url(./images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* 왼쪽 동물 (Team A) */}
      <div 
        className="absolute left-0 w-1/2 flex items-end justify-start pointer-events-none z-0" 
        style={{ bottom: '-2%' }}
      >
        <img
          src={animalStyles.teamA.src}
          alt={animalStyles.teamA.alt}
          className="w-auto"
          style={{
            height: animalStyles.teamA.height,
            objectFit: 'contain',
            objectPosition: 'left bottom',
            transform: animalStyles.teamA.transform,
            transformOrigin: animalStyles.teamA.transformOrigin,
            willChange: 'auto',
            backfaceVisibility: 'hidden'
          }}
        />
      </div>

      {/* 오른쪽 동물 (Team B) */}
      <div 
        className="absolute right-0 w-1/2 flex items-end justify-end pointer-events-none z-0" 
        style={{ bottom: '-2%' }}
      >
        <img
          src={animalStyles.teamB.src}
          alt={animalStyles.teamB.alt}
          className="w-auto"
          style={{
            height: animalStyles.teamB.height,
            objectFit: 'contain',
            objectPosition: 'right bottom',
            transform: animalStyles.teamB.transform,
            transformOrigin: animalStyles.teamB.transformOrigin,
            willChange: 'auto',
            backfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

export default CaptureMode;
