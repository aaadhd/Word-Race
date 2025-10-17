import React, { useState, useEffect } from 'react';
import type { RoundData, TracingResult } from '../types.ts';
import { Team, GameMode } from '../types.ts';
import DrawingCanvas from './TracingCanvas.tsx';
import RoundResult from './RoundResult.tsx';
import { StarIcon } from './icons/StarIcon.tsx';
import { recognizeHandwriting } from '../services/geminiService.ts';

interface DrawingActivityProps {
  roundData: RoundData;
  onComplete: (winner: Team | null) => void;
  isBonusRound: boolean;
  gameMode: GameMode;
  isPaused: boolean;
  onTimerChange?: (timeLeft: number) => void;
}

interface RawResult {
    hasDrawn: boolean;
    accuracy: number;
    canvasDataUrl: string;
    finishTime: number;
}

/**
 * Uses the browser's built-in Web Speech API to speak a word.
 * @param word The word to be spoken.
 */
const speakWord = (word: string) => {
  if ('speechSynthesis' in window && word) {
    // Cancel any ongoing speech to prevent overlap from rapid clicks
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // Set language for authentic pronunciation
    utterance.rate = 0.9; // Slightly slower rate for better clarity for young learners
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Text-to-Speech is not supported in this browser or the word is missing.');
  }
};


const DrawingActivity: React.FC<DrawingActivityProps> = ({ roundData, onComplete, isBonusRound, gameMode, isPaused, onTimerChange }) => {
  const [teamADone, setTeamADone] = useState(false);
  const [teamBDone, setTeamBDone] = useState(false);
  const [teamARawResult, setTeamARawResult] = useState<RawResult | null>(null);
  const [teamBRawResult, setTeamBRawResult] = useState<RawResult | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalResults, setFinalResults] = useState<TracingResult[] | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const [roundStartAtMs, setRoundStartAtMs] = useState<number | null>(null);

  // 라운드 시작시각을 isPaused가 풀리는 순간 동기화하여 설정
  useEffect(() => {
    if (!isPaused && roundStartAtMs == null) {
      setRoundStartAtMs(Date.now());
    }
  }, [isPaused, roundStartAtMs]);

  const handleTeamADone = (hasDrawn: boolean, accuracy: number, canvasDataUrl: string) => {
    if (teamADone) return;
    setTeamARawResult({ hasDrawn, accuracy, canvasDataUrl, finishTime: Date.now() });
    setTeamADone(true);
  };

  const handleTeamBDone = (hasDrawn: boolean, accuracy: number, canvasDataUrl: string) => {
    if (teamBDone) return;
    setTeamBRawResult({ hasDrawn, accuracy, canvasDataUrl, finishTime: Date.now() });
    setTeamBDone(true);
  };

  useEffect(() => {
    const processResults = async () => {
      if (teamADone && teamBDone && teamARawResult && teamBRawResult) {
        let finalAccuracyA = teamARawResult.accuracy;
        let finalAccuracyB = teamBRawResult.accuracy;

        if (gameMode === GameMode.DRAW) {
          setIsScoring(true);
          
          const scoringPromises: Promise<boolean>[] = [];

          if (teamARawResult.hasDrawn) {
            scoringPromises.push(recognizeHandwriting(roundData.word, teamARawResult.canvasDataUrl));
          } else {
            scoringPromises.push(Promise.resolve(false));
          }

          if (teamBRawResult.hasDrawn) {
            scoringPromises.push(recognizeHandwriting(roundData.word, teamBRawResult.canvasDataUrl));
          } else {
            scoringPromises.push(Promise.resolve(false));
          }
          
          const [teamACorrect, teamBCorrect] = await Promise.all(scoringPromises);
          
          // 맞음/틀림 결과를 정확도로 변환 (맞음: 100, 틀림: 0)
          finalAccuracyA = teamACorrect ? 100 : 0;
          finalAccuracyB = teamBCorrect ? 100 : 0;
          
          // 디버깅을 위한 로그 출력
          console.log(`채점 결과 - 단어: "${roundData.word}"`);
          console.log(`Team A: ${teamACorrect ? '맞음' : '틀림'} (그림 여부: ${teamARawResult.hasDrawn})`);
          console.log(`Team B: ${teamBCorrect ? '맞음' : '틀림'} (그림 여부: ${teamBRawResult.hasDrawn})`);
          
          setIsScoring(false);
        }

        const results: TracingResult[] = [
          { team: Team.A, accuracy: finalAccuracyA, finishTime: teamARawResult.finishTime, hasDrawn: teamARawResult.hasDrawn },
          { team: Team.B, accuracy: finalAccuracyB, finishTime: teamBRawResult.finishTime, hasDrawn: teamBRawResult.hasDrawn },
        ];
        
        const teamAResult = results.find(r => r.team === Team.A)!;
        const teamBResult = results.find(r => r.team === Team.B)!;
        const CORRECT_SPELLING_THRESHOLD = 30;
        const teamASuccess = gameMode === GameMode.TRACE 
          ? teamAResult.hasDrawn 
          : teamAResult.accuracy > CORRECT_SPELLING_THRESHOLD;
        const teamBSuccess = gameMode === GameMode.TRACE
          ? teamBResult.hasDrawn
          : teamBResult.accuracy > CORRECT_SPELLING_THRESHOLD;
          
        // 성공/실패 판정 로그
        if (gameMode === GameMode.DRAW) {
          console.log(`최종 판정:`);
          console.log(`Team A: ${teamASuccess ? '성공' : '실패'} (${teamAResult.accuracy === 100 ? '맞음' : '틀림'})`);
          console.log(`Team B: ${teamBSuccess ? '성공' : '실패'} (${teamBResult.accuracy === 100 ? '맞음' : '틀림'})`);
        }

        let tracingWinner: Team | null = null;
        if (teamASuccess && !teamBSuccess) {
          tracingWinner = Team.A;
        } else if (!teamASuccess && teamBSuccess) {
          tracingWinner = Team.B;
        } else if (teamASuccess && teamBSuccess) {
          if (teamAResult.accuracy > teamBResult.accuracy) {
            tracingWinner = Team.A;
          } else if (teamBResult.accuracy > teamAResult.accuracy) {
            tracingWinner = Team.B;
          } else {
            tracingWinner = teamAResult.finishTime < teamBResult.finishTime ? Team.A : Team.B;
          }
        }
        
        setWinner(tracingWinner);
        setFinalResults(results);
        setShowResultModal(true);
      }
    };
    processResults();
  }, [teamADone, teamBDone, teamARawResult, teamBRawResult, gameMode, roundData.word]);
  
  const handleContinueFromModal = () => {
    onComplete(winner);
  };


  if (isScoring) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-primary-text">
            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-accent-cyan"></div>
            <p className="mt-4 text-3xl font-display">Checking your writing...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4 pb-8 animate-fade-in overflow-auto">
      
      {isBonusRound && (
        <div className="flex items-center gap-4 px-6 py-2 bg-yellow-400 text-slate-900 rounded-full shadow-lg animate-bounce z-20 mb-4">
          <StarIcon className="w-8 h-8"/>
          <h2 className="text-3xl font-display">DOUBLE POINTS!</h2>
          <StarIcon className="w-8 h-8"/>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        {roundData.wordImage && (
            <div 
              className="bg-slate-100 p-2 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-100"
              onClick={() => speakWord(roundData.word)}
              role="button"
              aria-label={`Hear the word: ${roundData.word}`}
              tabIndex={0}
            >
                <img src={roundData.wordImage} alt={gameMode === GameMode.TRACE ? roundData.word : 'Guess the word'} className="w-32 h-32 object-contain rounded-xl" />
            </div>
        )}
        <p className="text-xl text-secondary-text font-bold">
          {gameMode === GameMode.DRAW ? 'What is this? Write the word!' : ''}
        </p>
      </div>
      
      <div className="flex w-full justify-around items-center gap-8 px-4 flex-1 min-h-0">
        {/* Team A */}
        <div className={`flex flex-col items-center transition-opacity duration-500 ${teamADone ? 'opacity-50' : ''}`}>
          <DrawingCanvas 
            word={roundData.word} 
            strokeColor="#3b82f6" 
            onDone={handleTeamADone} 
            mode={gameMode}
            isPaused={isPaused || showResultModal}
            startAtMs={roundStartAtMs}
            onTimerChange={onTimerChange}
          />
        </div>

        {/* Team B */}
        <div className={`flex flex-col items-center transition-opacity duration-500 ${teamBDone ? 'opacity-50' : ''}`}>
          <DrawingCanvas 
            word={roundData.word} 
            strokeColor="#ef4444" 
            onDone={handleTeamBDone} 
            mode={gameMode}
            isPaused={isPaused || showResultModal}
            startAtMs={roundStartAtMs}
            onTimerChange={onTimerChange}
          />
        </div>
      </div>

      {showResultModal && finalResults && (
        <RoundResult
          winner={winner}
          results={finalResults}
          onContinue={handleContinueFromModal}
          gameMode={gameMode}
          word={roundData.word}
          wordImage={roundData.wordImage}
        />
      )}
    </div>
  );
};

export default DrawingActivity;