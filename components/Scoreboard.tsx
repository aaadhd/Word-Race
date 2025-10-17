import React from 'react';
import type { Scores } from '../types.ts';
import { Team } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';

interface ScoreboardProps {
  scores: Scores;
  currentRound: number;
  totalRounds: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scores, currentRound, totalRounds }) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-white/50 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-4 p-2 pl-4 text-3xl font-bold text-white bg-team-a rounded-r-full">
        <span className="font-display">Team A</span>
        <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
          <StarIcon className="w-8 h-8 text-yellow-300" />
          <span>{scores[Team.A]}</span>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-4xl font-display text-accent-yellow">
            Round {currentRound} / {totalRounds}
        </h2>
      </div>

      <div className="flex items-center gap-4 p-2 pr-4 text-3xl font-bold text-white bg-team-b rounded-l-full">
        <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
          <StarIcon className="w-8 h-8 text-yellow-300" />
          <span>{scores[Team.B]}</span>
        </div>
        <span className="font-display">Team B</span>
      </div>
    </div>
  );
};

export default Scoreboard;