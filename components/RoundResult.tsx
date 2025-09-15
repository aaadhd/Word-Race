import React, { useEffect } from 'react';
import type { TracingResult } from '../types.ts';
import { Team, GameMode } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';
import { CheckIcon } from './icons/CheckIcon.tsx';
import { XIcon } from './icons/XIcon.tsx';

interface RoundResultProps {
  winner: Team | null;
  results: TracingResult[];
  onContinue: () => void;
  gameMode: GameMode;
  word: string;
  wordImage?: string;
}

// AI returns a score of 10 or less if the word is spelled incorrectly.
const CORRECT_SPELLING_THRESHOLD = 10;

const RoundResult: React.FC<RoundResultProps> = ({ winner, results, onContinue, gameMode, word, wordImage }) => {
  const teamAResult = results.find(r => r.team === Team.A);
  const teamBResult = results.find(r => r.team === Team.B);

  const teamASpelledCorrectly = teamAResult ? teamAResult.accuracy > CORRECT_SPELLING_THRESHOLD : false;
  const teamBSpelledCorrectly = teamBResult ? teamBResult.accuracy > CORRECT_SPELLING_THRESHOLD : false;

  const showAccuracy = gameMode === GameMode.TRACE || (gameMode === GameMode.DRAW && teamASpelledCorrectly && teamBSpelledCorrectly);
  const bothIncorrectInDrawMode = gameMode === GameMode.DRAW && !teamASpelledCorrectly && !teamBSpelledCorrectly;

  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        onContinue();
      }, 2000); // 2-second delay before auto-advancing

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [winner, onContinue]);
  
  const renderTeamResult = (team: Team, result: TracingResult | undefined, spelledCorrectly: boolean) => {
    const isWinner = winner === team;
    const teamName = team === Team.A ? 'Blue Team' : 'Red Team';

    const teamColorClass = team === Team.A ? 'text-team-a' : 'text-team-b';
    const teamBgClass = team === Team.A ? 'bg-team-a/10' : 'bg-team-b/10';
    const winnerClass = isWinner ? `border-yellow-400 ${teamBgClass}` : 'border-transparent';

    return (
        <div className={`flex flex-col items-center p-6 rounded-2xl border-4 transition-all duration-500 ${winnerClass}`}>
            <h2 className={`text-4xl font-display ${teamColorClass}`}>{teamName}</h2>
            {showAccuracy ? (
                <>
                    <p className="text-7xl font-display my-2">{result?.accuracy ?? 0}%</p>
                    <p className="text-xl">Accuracy</p>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center my-2 h-28 w-40 text-center">
                    {!result?.hasDrawn ? (
                        <p className="text-2xl font-bold text-secondary-text">Did not draw</p>
                    ) : spelledCorrectly ? (
                        <div className="flex flex-col items-center gap-2 text-correct">
                            <CheckIcon className="w-12 h-12" />
                            <p className="text-3xl font-display">Correct!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-incorrect">
                            <XIcon className="w-12 h-12" />
                            <p className="text-3xl font-display">Incorrect</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };


  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-4xl transform transition-all animate-fade-in-up">
        <h1 className="text-7xl font-display text-accent-yellow drop-shadow-lg">
          {gameMode === GameMode.TRACE ? 'Tracing Result!' : 'Drawing Result!'}
        </h1>

        {gameMode === GameMode.DRAW && (
          <div className="flex flex-col items-center justify-center mt-4">
            {bothIncorrectInDrawMode && wordImage && (
              <img src={wordImage} alt={word} className="w-40 h-40 object-contain rounded-xl bg-slate-100 p-2 shadow-inner mb-4" />
            )}
            <div className="flex items-baseline justify-center gap-3">
              <p className="text-3xl text-secondary-text">The word was:</p>
              <p className="text-8xl font-display text-team-a drop-shadow">
                {word}
              </p>
            </div>
          </div>
        )}
        
        {!bothIncorrectInDrawMode && (
          <div className="my-4 min-h-[210px] flex items-center justify-center">
            <div className="flex justify-around w-full">
              {renderTeamResult(Team.A, teamAResult, teamASpelledCorrectly)}
              {renderTeamResult(Team.B, teamBResult, teamBSpelledCorrectly)}
            </div>
          </div>
        )}
        
        <div className="mt-4 min-h-[60px] flex items-center justify-center">
          {winner === null ? (
              <p className="text-4xl font-display text-primary-text">
                It's a tie! No quiz this round.
              </p>
          ) : (
              <div className="flex items-center justify-center gap-4">
                <StarIcon className="w-10 h-10 text-yellow-400" />
                <p className={`text-4xl font-display ${winner === Team.A ? 'text-team-a' : 'text-team-b'}`}>
                  {winner === Team.A ? 'Blue Team' : 'Red Team'} wins the quiz chance!
                </p>
                <StarIcon className="w-10 h-10 text-yellow-400" />
              </div>
          )}
        </div>
        
        <div className="mt-4 min-h-[76px] flex items-center justify-center">
          {winner === null ? (
            <button
              onClick={onContinue}
              className="px-12 py-4 text-3xl font-display text-white bg-correct rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Next Round
            </button>
          ) : (
            <div className="flex items-center justify-center gap-3 text-secondary-text">
              <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-slate-400"></div>
              <p className="text-2xl font-bold">Starting quiz...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RoundResult;