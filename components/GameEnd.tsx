import React, { useEffect } from 'react';
import { Team } from '../types.ts';
import type { Scores } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';
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
      <h1 className="text-5xl font-display text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.6)' }}>Game Over!</h1>
      <div className="flex items-center justify-center gap-6 px-6 py-5 bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-400">
        <StarIcon className="w-16 h-16 text-yellow-400 animate-pulse drop-shadow-lg" />
        {winnerMessage()}
        <StarIcon className="w-16 h-16 text-yellow-400 animate-pulse drop-shadow-lg" />
      </div>

      <div className="flex justify-center w-full max-w-3xl mt-6 mb-6 gap-6 px-4">
        <div className="flex flex-col items-center bg-white/95 p-6 rounded-3xl shadow-2xl border-4 border-team-a flex-1 max-w-[240px]">
            <h3 className="text-4xl font-display text-team-a mb-1">Team A</h3>
            <p className="text-8xl font-display my-3 text-gray-800">{scores[Team.A]}</p>
            <p className="text-2xl font-semibold text-gray-600">Points</p>
        </div>
        <div className="flex flex-col items-center bg-white/95 p-6 rounded-3xl shadow-2xl border-4 border-team-b flex-1 max-w-[240px]">
            <h3 className="text-4xl font-display text-team-b mb-1">Team B</h3>
            <p className="text-8xl font-display my-3 text-gray-800">{scores[Team.B]}</p>
            <p className="text-2xl font-semibold text-gray-600">Points</p>
        </div>
      </div>

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