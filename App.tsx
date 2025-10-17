import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Team, GameMode } from './types.ts';
import type { RoundData, Scores, Teams } from './types.ts';
import { fetchRoundData, resetUsedWords, testGeminiConnection } from './services/geminiService.ts';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './constants/teamSetup.ts';

import GameSetup from './components/GameSetup.tsx';
import TeamSetupScreen from './components/TeamSetupScreen.tsx';
import RoundStart from './components/RoundStart.tsx';
import DrawingActivity from './components/TracingActivity.tsx';
import QuizActivity from './components/QuizActivity.tsx';
import GameEnd from './components/GameEnd.tsx';
import GameHeader from './components/GameHeader.tsx';

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
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [tracingTimer, setTracingTimer] = useState<number>(0);
  const [showTracingTimer, setShowTracingTimer] = useState<boolean>(false);
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));

  // 브라우저 크기에 맞춰 스케일 계산
  useEffect(() => {
    const calculateScale = () => {
      const newScale = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
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
    setGameState(GameState.TEAM_SETUP);
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

  const handlePause = () => {
    setIsPaused(true);
  }

  const handleResume = () => {
    setIsPaused(false);
  }

  const handleOpenMenu = () => {
    setShowMenu(true);
  }

  const handleCloseMenu = () => {
    setShowMenu(false);
  }

  const handleEndGame = () => {
    setGameState(GameState.GAME_END);
    setShowMenu(false);
  }

  const handleExit = () => {
    setGameState(GameState.SETUP);
    setShowMenu(false);
  }

  const handleTracingTimerChange = (timeLeft: number) => {
    setTracingTimer(timeLeft);
    setShowTracingTimer(timeLeft > 0);
  }

  const handleShuffleTeams = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStartFromTeamSetup = () => {
    setGameState(GameState.ROUND_START);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  // 게임 상태가 변경될 때 타이머 표시 초기화
  useEffect(() => {
    if (gameState !== GameState.TRACING) {
      setShowTracingTimer(false);
      setTracingTimer(0);
    }
  }, [gameState]);

  // API 연결 테스트
  useEffect(() => {
    const testAPI = async () => {
      console.log("🚀 Starting API connection test...");
      const isConnected = await testGeminiConnection();
      if (isConnected) {
        console.log("🎉 Gemini API is working perfectly!");
      } else {
        console.log("⚠️ Gemini API connection failed - game will use local data");
      }
    };
    
    testAPI();
  }, []);

  const getHeaderTitle = () => {
    return 'Word Race';
  }

  const shouldShowPause = gameState === GameState.TRACING || gameState === GameState.QUIZ;
  const shouldShowMenu = gameState === GameState.TRACING || gameState === GameState.QUIZ;
  const shouldShowExit = gameState === GameState.SETUP || gameState === GameState.TEAM_SETUP || gameState === GameState.GAME_END;

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
      
      case GameState.TEAM_SETUP:
        return (
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffleTeams}
            onStart={handleStartFromTeamSetup}
            onTeamsChange={handleTeamsChange}
          />
        );
      
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
              isPaused={gameState === GameState.ROUND_START || isPaused}
              onTimerChange={handleTracingTimerChange}
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
    <div className="w-full h-screen bg-background overflow-hidden flex items-start justify-center">
      <main 
        id="stage"
        className="relative flex flex-col bg-light-bg text-primary-text"
        style={{
          width: '1280px !important',
          height: '800px !important',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0
        }}
      >
        {gameState !== GameState.SETUP && gameState !== GameState.TEAM_SETUP && (
          <GameHeader
            title={getHeaderTitle()}
            currentRound={showTracingTimer ? undefined : (gameState !== GameState.GAME_END ? currentRound : undefined)}
            onPause={handlePause}
            showPause={shouldShowPause}
            isPaused={isPaused}
            onOpenMenu={handleOpenMenu}
            showMenuButton={shouldShowMenu}
            onExit={handleExit}
            showExitButton={shouldShowExit}
            buttonsDisabled={isPaused || showMenu}
            showTimer={showTracingTimer}
            timerValue={tracingTimer}
          />
        )}
        
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-4xl font-display text-primary-text mb-6">PAUSED</h2>
              <button
                onClick={handleResume}
                className="px-8 py-4 text-2xl font-display text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Game Menu Modal */}
        {showMenu && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h2 className="text-4xl font-display text-primary-text mb-6">Game Menu</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCloseMenu}
                  className="px-8 py-4 text-2xl font-display text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  Resume
                </button>
                <button
                  onClick={handleEndGame}
                  className="px-8 py-4 text-2xl font-display text-white bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  End Game
                </button>
                <button
                  onClick={handleExit}
                  className="px-8 py-4 text-2xl font-display text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Score Display */}
        {gameState !== GameState.SETUP && gameState !== GameState.TEAM_SETUP && (
          <div className="flex justify-between items-center p-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 p-2 pl-4 text-2xl font-bold text-white bg-team-a rounded-r-full">
              <span className="font-display">Team A</span>
              <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                <span>{scores[Team.A]}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-2 pr-4 text-2xl font-bold text-white bg-team-b rounded-l-full">
              <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                <span>{scores[Team.B]}</span>
              </div>
              <span className="font-display">Team B</span>
            </div>
          </div>
        )}

        <div className="flex-grow overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;