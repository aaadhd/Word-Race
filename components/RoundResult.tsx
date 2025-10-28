import React, { useEffect } from 'react';
import type { TracingResult } from '../types.ts';
import { Team, GameMode } from '../types.ts';
import { StarIcon } from './icons/StarIcon.tsx';
import { CheckIcon } from './icons/CheckIcon.tsx';
import { XIcon } from './icons/XIcon.tsx';
import { CORRECT_SPELLING_THRESHOLD, ROUND_RESULT_AUTO_ADVANCE_DELAY } from '../constants/gameConstants.ts';

interface RoundResultProps {
  winner: Team | null;
  results: TracingResult[];
  onContinue: () => void;
  gameMode: GameMode;
  word: string;
  wordImage?: string;
  showButton?: boolean;
  noQuiz?: boolean;
}

const RoundResult: React.FC<RoundResultProps> = ({ winner, results, onContinue, gameMode, word, wordImage, showButton = true, noQuiz = false }) => {
  const teamAResult = results.find(r => r.team === Team.A);
  const teamBResult = results.find(r => r.team === Team.B);

  // draw 모드에서는 100점이 맞음, 0점이 틀림
  const teamASpelledCorrectly = teamAResult ? (gameMode === GameMode.DRAW ? teamAResult.accuracy === 100 : teamAResult.accuracy > CORRECT_SPELLING_THRESHOLD) : false;
  const teamBSpelledCorrectly = teamBResult ? (gameMode === GameMode.DRAW ? teamBResult.accuracy === 100 : teamBResult.accuracy > CORRECT_SPELLING_THRESHOLD) : false;

  const showAccuracy = gameMode === GameMode.TRACE; // draw 모드에서는 항상 O/X 표시
  const bothIncorrectInDrawMode = gameMode === GameMode.DRAW && !teamASpelledCorrectly && !teamBSpelledCorrectly;

  useEffect(() => {
    // 승자가 있거나, noQuiz이거나, 퀴즈 미포함 모드(!showButton)일 때 자동으로 진행
    if (winner || noQuiz || !showButton) {
      const timer = setTimeout(() => {
        onContinue();
      }, ROUND_RESULT_AUTO_ADVANCE_DELAY);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [winner, noQuiz, showButton, onContinue]);

  const renderTeamResult = (team: Team, result: TracingResult | undefined, spelledCorrectly: boolean) => {
    const isWinner = winner === team;
    const teamName = team === Team.A ? 'Team A' : 'Team B';

    const teamColorClass = team === Team.A ? 'text-team-a' : 'text-team-b';
    const teamBgClass = team === Team.A ? 'bg-team-a/10' : 'bg-team-b/10';
    const winnerClass = isWinner ? `border-yellow-400 ${teamBgClass}` : 'border-transparent';

    return (
        <div className={`flex flex-col items-center p-5 rounded-2xl border-4 min-h-[200px] shadow-md ${winnerClass}`} style={{ transition: 'border-color 0.5s ease, background-color 0.5s ease' }}>
            <h2 className={`text-3xl font-display ${teamColorClass} mb-1`}>{teamName}</h2>
            {showAccuracy ? (
                <>
                    <p
                      className="text-6xl font-display my-2 tabular-nums min-w-[180px]"
                      style={{
                        willChange: 'auto',
                        backfaceVisibility: 'hidden',
                        transform: 'translate3d(0, 0, 0)',
                        WebkitFontSmoothing: 'antialiased'
                      }}
                    >
                      {result?.accuracy ?? 0}%
                    </p>
                    <p className="text-lg font-semibold text-gray-600">Accuracy</p>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center my-2 h-24 w-32 text-center">
                    {!result?.hasDrawn ? (
                        <p className="text-xl font-bold text-secondary-text">Did not draw</p>
                    ) : spelledCorrectly ? (
                        <div className="flex flex-col items-center gap-1 text-correct">
                            <p className="text-6xl font-display">O</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-incorrect">
                            <p className="text-6xl font-display">X</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };


  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-10 text-center w-full max-w-2xl transform transition-all animate-fade-in-up"
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          boxShadow: '0 25px 70px rgba(0,0,0,0.3)'
        }}
      >
        <h1 className="text-5xl font-display text-accent-yellow drop-shadow-lg mb-4">
          {gameMode === GameMode.TRACE ? 'Tracing Result!' : 'Drawing Result!'}
        </h1>

        {gameMode === GameMode.DRAW && (
          <div className="flex flex-col items-center justify-center mt-4">
            {bothIncorrectInDrawMode && wordImage && (
              <img src={wordImage} alt={word} className="w-[312px] h-[234px] object-cover rounded-2xl bg-slate-100 p-2 shadow-lg mb-4" />
            )}
            <div className="flex items-baseline justify-center gap-3">
              <p className="text-2xl font-semibold text-gray-600">The word was:</p>
              <p className="text-6xl font-display text-team-a drop-shadow-lg">
                {word}
              </p>
            </div>
          </div>
        )}

        {!bothIncorrectInDrawMode && (
          <div className="my-3 min-h-[180px] flex items-center justify-center">
            <div className="flex justify-around w-full gap-6">
              {renderTeamResult(Team.A, teamAResult, teamASpelledCorrectly)}
              {renderTeamResult(Team.B, teamBResult, teamBSpelledCorrectly)}
            </div>
          </div>
        )}

        {winner !== null && (
          <div className="mt-4 min-h-[60px] flex items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              <StarIcon className="w-10 h-10 text-yellow-400 animate-pulse" />
              <p className={`text-3xl font-display ${winner === Team.A ? 'text-team-a' : 'text-team-b'}`}>
                {winner === Team.A ? 'Team A' : 'Team B'} wins!
              </p>
              <StarIcon className="w-10 h-10 text-yellow-400 animate-pulse" />
            </div>
          </div>
        )}

        {showButton && (
          <div className="mt-4 min-h-[76px] flex items-center justify-center">
            <p className="text-2xl font-display text-gray-600 animate-pulse">
              {noQuiz ? 'No quiz for this round.' : 'Preparing quiz...'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoundResult;
