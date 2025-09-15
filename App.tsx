import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Team, GameMode } from './types.ts';
import type { RoundData, Scores } from './types.ts';
import { fetchRoundData, resetUsedWords } from './services/geminiService.ts';

import GameSetup from './components/GameSetup.tsx';
import RoundStart from './components/RoundStart.tsx';
import DrawingActivity from './components/TracingActivity.tsx';
import Scoreboard from './components/Scoreboard.tsx';
import QuizActivity from './components/QuizActivity.tsx';
import GameEnd from './components/GameEnd.tsx';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.TRACE);
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [scores, setScores] = useState<Scores>({ [Team.A]: 0, [Team.B]: 0 });
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizTaker, setQuizTaker] = useState<Team | null>(null);
  const [isBonusRound, setIsBonusRound] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  // 브라우저 크기에 맞춰 스케일 계산
  useEffect(() => {
    const calculateScale = () => {
      const scaleX = window.innerWidth / 1280;
      const scaleY = window.innerHeight / 800;
      const newScale = Math.min(scaleX, scaleY, 1); // 최대 1배까지만
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const loadNextRoundData = useCallback(async () => {
    setIsLoading(true);
    // 25% chance of a bonus round
    setIsBonusRound(Math.random() < 0.25); 
    const data = await fetchRoundData();
    if (data) {
      setRoundData(data);
    } else {
      // Handle error case where data couldn't be fetched
      console.error("Failed to fetch round data. Ending game.");
      setGameState(GameState.GAME_END);
    }
    setIsLoading(false);
  }, []);

  const goToNextRound = useCallback(() => {
    if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setRoundData(null);
        setQuizTaker(null);
        setGameState(GameState.ROUND_START);
    } else {
        setGameState(GameState.GAME_END);
    }
  }, [currentRound, totalRounds]);

  const startGame = (rounds: number, mode: GameMode) => {
    resetUsedWords(); // Reset word list for a new game
    setTotalRounds(rounds);
    setGameMode(mode);
    setCurrentRound(1);
    setScores({ [Team.A]: 0, [Team.B]: 0 });
    setGameState(GameState.ROUND_START);
  };

  useEffect(() => {
    if ((gameState === GameState.TRACING || gameState === GameState.ROUND_START) && !roundData) {
      loadNextRoundData();
    }
  }, [gameState, roundData, loadNextRoundData]);

  const handleRoundComplete = (winner: Team | null) => {
    if (winner) {
      setQuizTaker(winner);
      setGameState(GameState.QUIZ);
    } else {
      goToNextRound();
    }
  };
  
  const handleQuizComplete = (isCorrect: boolean) => {
    if (quizTaker) {
        const points = isCorrect ? 2 : 1;
        const finalPoints = isBonusRound ? points * 2 : points;

        setScores(prevScores => ({
            ...prevScores,
            [quizTaker]: prevScores[quizTaker] + finalPoints,
        }));
    }
    goToNextRound();
  };

  const handlePlayAgain = () => {
    setGameState(GameState.SETUP);
    setRoundData(null);
  }

  const renderContent = () => {
    if (isLoading && gameState !== GameState.SETUP && gameState !== GameState.GAME_END) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-primary-text">
                <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-accent-yellow"></div>
                <p className="mt-4 text-3xl font-display">Getting next round ready...</p>
            </div>
        );
    }

    switch (gameState) {
      case GameState.SETUP:
        return <GameSetup onStart={startGame} />;
      
      case GameState.ROUND_START:
      case GameState.TRACING:
        if (!roundData) return null;
        return (
          <>
            <DrawingActivity
              roundData={roundData}
              onComplete={handleRoundComplete}
              isBonusRound={isBonusRound}
              gameMode={gameMode}
              isPaused={gameState === GameState.ROUND_START}
            />
            {gameState === GameState.ROUND_START && (
              <RoundStart
                currentRound={currentRound}
                onStart={() => setGameState(GameState.TRACING)}
              />
            )}
          </>
        );

      case GameState.QUIZ:
        return roundData && quizTaker && <QuizActivity quiz={roundData.quiz} playingTeam={quizTaker} onComplete={handleQuizComplete} isBonusRound={isBonusRound} />;
      case GameState.GAME_END:
        return <GameEnd scores={scores} onPlayAgain={handlePlayAgain} />;
      default:
        return null;
    }
  };

  return (
    <main 
      id="stage"
      className="relative flex flex-col w-screen h-screen bg-light-bg text-primary-text overflow-hidden"
      style={{
        padding: scale < 1 ? '8px' : '32px'
      }}
    >
      {gameState !== GameState.SETUP && <Scoreboard scores={scores} currentRound={currentRound} totalRounds={totalRounds} />}
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;