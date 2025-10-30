import React, { useEffect } from 'react';
import { Team } from '../types.ts';
import type { Scores } from '../types.ts';
import Confetti from './Confetti.tsx';
import { playGameEnd, playWinnerAnnounce, playButtonClick } from '../utils/soundEffects.ts';

interface GameEndProps {
  scores: Scores;
  onPlayAgain: () => void;
}

const GameEnd: React.FC<GameEndProps> = ({ scores, onPlayAgain }) => {
  const winner = scores[Team.A] > scores[Team.B] ? Team.A : (scores[Team.B] > scores[Team.A] ? Team.B : null);

  // 게임 종료 사운드 재생
  useEffect(() => {
    playGameEnd();
    // 승자 발표 사운드는 약간 딜레이 후 재생
    const timer = setTimeout(() => {
      playWinnerAnnounce();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const winnerMessage = () => {
    if (winner === Team.A) {
      return (
        <div className="flex items-center flex-col text-team-a">
          <h2 className="text-8xl font-display">Team A Wins!</h2>
          <p className="text-3xl mt-2">Congratulations!</p>
        </div>
      );
    }
    if (winner === Team.B) {
      return (
        <div className="flex items-center flex-col text-team-b">
          <h2 className="text-8xl font-display">Team B Wins!</h2>
          <p className="text-3xl mt-2">Congratulations!</p>
        </div>
      );
    }
    return <h2 className="text-7xl font-display text-accent-yellow">It's a Tie!</h2>;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center animate-fade-in py-8 overflow-y-auto">
      <img
        src="/images/background.png"
        alt="background"
        className="absolute"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          left: 0,
          top: 0,
          zIndex: -1
        }}
      />
      {winner && <Confetti />}
      {/* Local animated styles (no icons) */}
      <style>
        {`
          @keyframes titleGradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          @keyframes beamSweep { 0%{transform:translate3d(-120%,0,0) skewX(-20deg); opacity:0} 30%{opacity:.35} 60%{opacity:.15} 100%{transform:translate3d(180%,0,0) skewX(-20deg); opacity:0} }
          @keyframes cardGlowPulse { 0%,100%{box-shadow:0 0 0 rgba(255,255,255,0)} 50%{box-shadow:0 0 36px rgba(255,255,255,.35)} }
          @keyframes numberPop { 0%{transform:scale(1)} 40%{transform:scale(1.08)} 100%{transform:scale(1)} }
          @keyframes ribbonWave { 0%{background-position:0 0} 100%{background-position:400% 0} }
        `}
      </style>
      <h1
        className="text-5xl font-display mb-6"
        style={{
          backgroundImage: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f59e0b, #22d3ee)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '300% 300%',
          animation: 'titleGradientShift 3.2s ease-in-out infinite',
          textShadow: '0 6px 18px rgba(0,0,0,0.55)'
        }}
      >
        Game Over!
      </h1>
      {/* Winner banner without icons */}
      <div className="relative flex items-center justify-center gap-6 px-8 py-6 bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-400 overflow-hidden">
        {/* moving sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ overflow: 'hidden', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', top: '-20%', left: 0, width: '45%', height: '140%', background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)', filter: 'blur(6px)', animation: 'beamSweep 2.2s ease-in-out 0.2s infinite' }} />
        </div>
        {winnerMessage()}
      </div>

      <div className="flex justify-center w-full max-w-3xl mt-6 mb-6 gap-6 px-4">
        <div className="relative flex flex-col items-center bg-white/95 p-6 rounded-3xl shadow-2xl border-4 border-team-a flex-1 max-w-[240px]" style={{ animation: (scores[Team.A] >= scores[Team.B]) ? 'cardGlowPulse 1.6s ease-in-out infinite' : undefined }}>
            <h3 className="text-4xl font-display text-team-a mb-1">Team A</h3>
            <p className="text-8xl font-display my-3 text-gray-800" style={{ animation: (scores[Team.A] >= scores[Team.B]) ? 'numberPop 0.7s ease' : undefined }}>{scores[Team.A]}</p>
            <p className="text-2xl font-semibold text-gray-600">Points</p>
            {/* sheen */}
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ overflow: 'hidden', borderRadius: '18px' }}>
              <div style={{ position: 'absolute', top: '-25%', left: 0, width: '50%', height: '150%', background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)', filter: 'blur(6px)', animation: 'beamSweep 2.4s ease-in-out 0.4s infinite' }} />
            </div>
        </div>
        <div className="relative flex flex-col items-center bg-white/95 p-6 rounded-3xl shadow-2xl border-4 border-team-b flex-1 max-w-[240px]" style={{ animation: (scores[Team.B] >= scores[Team.A]) ? 'cardGlowPulse 1.6s ease-in-out infinite' : undefined }}>
            <h3 className="text-4xl font-display text-team-b mb-1">Team B</h3>
            <p className="text-8xl font-display my-3 text-gray-800" style={{ animation: (scores[Team.B] >= scores[Team.A]) ? 'numberPop 0.7s ease' : undefined }}>{scores[Team.B]}</p>
            <p className="text-2xl font-semibold text-gray-600">Points</p>
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ overflow: 'hidden', borderRadius: '18px' }}>
              <div style={{ position: 'absolute', top: '-25%', left: 0, width: '50%', height: '150%', background: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)', filter: 'blur(6px)', animation: 'beamSweep 2.4s ease-in-out 0.4s infinite' }} />
            </div>
        </div>
      </div>

      {/* subtle animated ribbon background under the banner */}
      <div aria-hidden className="absolute top-[140px] left-1/2 -translate-x-1/2 w-[820px] h-[10px] rounded-full" style={{ backgroundImage: 'linear-gradient(90deg, rgba(34,211,238,.25), rgba(167,139,250,.35), rgba(245,158,11,.25), rgba(34,211,238,.25))', backgroundSize: '400% 100%', filter: 'blur(12px)', animation: 'ribbonWave 6s linear infinite' }} />

      <button
        onClick={() => {
          playButtonClick();
          onPlayAgain();
        }}
        className="px-16 py-5 text-4xl font-display text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-4 border-white"
        style={{
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.5), inset 0 -4px 0 rgba(0,0,0,0.2)'
        }}
      >
        Play Again
      </button>
    </div>
  );
};

export default GameEnd;