import React from 'react';

interface RoundStartProps {
  currentRound: number;
  onStart: () => void;
}

const RoundStart: React.FC<RoundStartProps> = ({ currentRound, onStart }) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-lg transform transition-all animate-fade-in-up">
        <h1 className="text-6xl font-display text-accent-yellow drop-shadow-md">
          Round {currentRound} Start!
        </h1>
        <p className="mt-4 text-2xl text-secondary-text font-sans">
          Write it right, write it fast!
        </p>
        
        <button 
          onClick={onStart}
          className="mt-8 px-12 py-4 text-3xl font-display text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          Ready, Set, Go!
        </button>
      </div>
    </div>
  );
};

export default RoundStart;