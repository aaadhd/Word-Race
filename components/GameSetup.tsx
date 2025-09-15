import React, { useState } from 'react';
import { GameMode } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';

interface GameSetupProps {
  onStart: (rounds: number, mode: GameMode) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [rounds, setRounds] = useState(3);
  const [mode, setMode] = useState<GameMode>(GameMode.TRACE);

  const increment = () => setRounds(r => Math.min(r + 1, 10));
  const decrement = () => setRounds(r => Math.max(r - 1, 1));

  const modeButtonClasses = (buttonMode: GameMode) => 
    `w-1/2 py-4 text-3xl font-display rounded-full transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
      mode === buttonMode 
      ? 'bg-accent-cyan text-white shadow-lg scale-105' 
      : 'bg-slate-200 text-secondary-text hover:bg-slate-300'
    }`;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-primary-text animate-fade-in">
      <div className="flex items-center gap-4">
        <StarIcon className="w-16 h-16 text-yellow-400" />
        <h1 className="text-8xl font-display text-accent-yellow drop-shadow-lg">Word Race</h1>
        <StarIcon className="w-16 h-16 text-yellow-400" />
      </div>
      <p className="mt-4 text-2xl text-secondary-text">An English adventure for young learners!</p>
      
      <div className="mt-12 bg-sky-100/50 p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-4xl font-display text-accent-cyan mb-6">Game Mode</h2>
        <div className="flex w-full p-2 space-x-2 bg-slate-100 rounded-full">
            <button onClick={() => setMode(GameMode.TRACE)} className={modeButtonClasses(GameMode.TRACE)}>
                Trace
            </button>
            <button onClick={() => setMode(GameMode.DRAW)} className={modeButtonClasses(GameMode.DRAW)}>
                Draw
            </button>
        </div>

        <h2 className="text-4xl font-display text-accent-cyan mt-8">Select Rounds</h2>
        <div className="flex items-center justify-center gap-8 mt-6">
          <button onClick={decrement} className="w-20 h-20 text-6xl font-bold text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:scale-110">-</button>
          <span className="text-9xl font-display w-32 text-center">{rounds}</span>
          <button onClick={increment} className="w-20 h-20 text-6xl font-bold text-white bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110">+</button>
        </div>
      </div>

      <button 
        onClick={() => onStart(rounds, mode)}
        className="mt-12 px-16 py-6 text-5xl font-display text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        Start Game!
      </button>
    </div>
  );
};

export default GameSetup;
