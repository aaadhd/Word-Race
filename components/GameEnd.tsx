import React from 'react';
import { Team } from '../types.ts';
import type { Scores } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';
import Confetti from './Confetti.tsx';

interface GameEndProps {
  scores: Scores;
  onPlayAgain: () => void;
}

const GameEnd: React.FC<GameEndProps> = ({ scores, onPlayAgain }) => {
  const winner = scores[Team.A] > scores[Team.B] ? Team.A : (scores[Team.B] > scores[Team.A] ? Team.B : null);

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
    <div
      className="relative flex flex-col items-center justify-center h-full text-center animate-fade-in py-8 overflow-y-auto"
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {winner && <Confetti />}
      <h1 className="text-5xl font-display text-primary-text mb-6 drop-shadow-lg">Game Over!</h1>
      <div className="flex items-center justify-center gap-6 p-6 bg-sky-100/50 rounded-2xl">
        <StarIcon className="w-20 h-20 text-yellow-400 animate-pulse" />
        {winnerMessage()}
        <StarIcon className="w-20 h-20 text-yellow-400 animate-pulse" />
      </div>

      <div className="flex justify-around w-full mt-8 mb-8">
        <div className="flex flex-col items-center">
            <h3 className="text-4xl font-display text-team-a">Team A</h3>
            <p className="text-8xl font-display my-2">{scores[Team.A]}</p>
            <p className="text-2xl">Points</p>
        </div>
        <div className="flex flex-col items-center">
            <h3 className="text-4xl font-display text-team-b">Team B</h3>
            <p className="text-8xl font-display my-2">{scores[Team.B]}</p>
            <p className="text-2xl">Points</p>
        </div>
      </div>
      
      <button 
        onClick={onPlayAgain}
        className="px-16 py-6 text-5xl font-display text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameEnd;