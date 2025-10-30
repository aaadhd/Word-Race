import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Team, GameMode } from './types.ts';
import type { RoundData, Scores, Teams } from './types.ts';
import { fetchRoundData, resetUsedWords, testGeminiConnection } from './services/geminiService.ts';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './constants/teamSetup.ts';
import type { Teams as TeamSetupTeams } from './types/team-setup-types.ts';
import { preloadNextRoundImages, preloadAllGameImages } from './utils/imagePreloader.ts';

import GameSetup from './components/GameSetup.tsx';
import GameTitleScreen from './components/GameTitleScreen.tsx';
import TeamSetupScreen from './components/TeamSetupScreen.tsx';
import RoundStart from './components/RoundStart.tsx';
import DrawingActivity from './components/TracingActivity.tsx';
import QuizActivity from './components/QuizActivity.tsx';
import RoundResult from './components/RoundResult.tsx';
import GameEnd from './components/GameEnd.tsx';
import GameHeader from './components/GameHeader.tsx';
import CaptureMode from './components/CaptureMode.tsx';
import PageTransition from './components/PageTransition.tsx';
import BGMPlayer from './components/BGMPlayer.tsx';
import RoundLoading from './components/RoundLoading.tsx';
import { ensureAudioUnlocked } from './utils/soundEffects.ts';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.TRACE);
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [scores, setScores] = useState<Scores>({ [Team.A]: 0, [Team.B]: 0 });
  const [previousScores, setPreviousScores] = useState<Scores>({ [Team.A]: 0, [Team.B]: 0 });
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [quizTaker, setQuizTaker] = useState<Team | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [tracingTimer, setTracingTimer] = useState<number>(0);
  const [showTracingTimer, setShowTracingTimer] = useState<boolean>(false);
  const [quizIncluded, setQuizIncluded] = useState<boolean>(true);
  const [teams, setTeams] = useState<TeamSetupTeams>(initializeTeams(MOCK_PLAYERS));
  const [isCaptureMode, setIsCaptureMode] = useState<boolean>(false);
  const [isLoadingNextRound, setIsLoadingNextRound] = useState<boolean>(false);
  const [isFadingOutPreviousRound, setIsFadingOutPreviousRound] = useState<boolean>(false);

  // 브라우저 크기에 맞춰 스케일 계산
  useEffect(() => {
    // 오디오 자동재생 정책 우회: 첫 사용자 입력에서 AudioContext resume
    ensureAudioUnlocked();

    const calculateScale = () => {
      const newScale = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const loadNextRoundData = useCallback(async () => {
    // 백그라운드에서 데이터 로드 (로딩 화면 표시 안 함)
    const data = await fetchRoundData();
    if (data) {
      setRoundData(data);
    } else {
      // Handle error case where data couldn't be fetched
      console.error("Failed to fetch round data. Ending game.");
      setGameState(GameState.GAME_END);
    }
  }, []);

  const goToNextRound = useCallback(async () => {
    const nextRound = currentRound + 1;

    if (nextRound <= totalRounds) {
        // 백그라운드에서 데이터 로드 (로딩 화면 표시 안 함)
        const data = await fetchRoundData();

        if (data) {
          // 한 번에 모든 상태 업데이트
          setCurrentRound(nextRound);
          setQuizTaker(null);
          setRoundData(data);
          // 상태 전환
          setGameState(GameState.ROUND_START);
        } else {
          console.error("Failed to fetch round data. Ending game.");
          setGameState(GameState.GAME_END);
        }
    } else {
        setGameState(GameState.GAME_END);
    }
  }, [currentRound, totalRounds]);

  const startGame = async (rounds: number, mode: GameMode, includeQuiz: boolean = true) => {
    console.log('App - startGame called with:', { rounds, mode, includeQuiz });
    resetUsedWords(); // Reset word list for a new game

    // Preload all game images
    preloadAllGameImages().catch(err => {
      console.warn('Some images failed to preload:', err);
    });

    setTotalRounds(rounds);
    setGameMode(mode);
    setQuizIncluded(includeQuiz);
    setCurrentRound(1);
    setScores({ [Team.A]: 0, [Team.B]: 0 });
    setPreviousScores({ [Team.A]: 0, [Team.B]: 0 }); // previousScores도 초기화
    setTeams(initializeTeams(MOCK_PLAYERS)); // 기본 팀 설정
    setGameState(GameState.TITLE_SCREEN); // 게임 대문 화면으로 이동
  };

  useEffect(() => {
    if ((gameState === GameState.TRACING || gameState === GameState.ROUND_START) && !roundData) {
      loadNextRoundData();
    }
  }, [gameState, roundData, loadNextRoundData]);

  // Preload next round images when a round starts
  useEffect(() => {
    if (gameState === GameState.TRACING && currentRound < totalRounds) {
      // Preload images for next round in the background
      preloadNextRoundImages(currentRound).catch(err => {
        console.warn('Failed to preload next round images:', err);
      });
    }
  }, [gameState, currentRound, totalRounds]);

  const handleRoundComplete = (winner: Team | null, results?: any) => {
    console.log('handleRoundComplete called:', { winner, results, quizIncluded, currentRound, totalRounds });

    // 퀴즈 미포함 모드에서 점수 업데이트
    if (!quizIncluded && results && Array.isArray(results)) {
      console.log('퀴즈 미포함 모드 - 점수 업데이트 시작');
      let teamAScore = 0;
      let teamBScore = 0;
      
      results.forEach((result: any) => {
        if (result.team === Team.A) {
          teamAScore = result.points || 0;
        } else if (result.team === Team.B) {
          teamBScore = result.points || 0;
        }
      });
      
      console.log('점수 업데이트:', { teamAScore, teamBScore });
      setScores(prev => ({
        [Team.A]: prev[Team.A] + teamAScore,
        [Team.B]: prev[Team.B] + teamBScore
      }));
      
      console.log('✅ 점수 업데이트 완료 (함수형 업데이트 적용)');
    }

    // Quiz가 포함되어 있고 winner가 있으면 Quiz로 이동
    if (winner && quizIncluded) {
      console.log('Quiz로 이동:', winner);
      // previousScores는 onQuizStart에서 설정됨 (중복 제거)
      setQuizTaker(winner);
      setGameState(GameState.QUIZ);
    } else {
      // Quiz가 없거나 winner가 없으면 다음 라운드로 이동
      console.log('다음 라운드로 이동');
      goToNextRound();
    }
  };

  
  const handleQuizComplete = async (isCorrect: boolean, newTeamAScore: number, newTeamBScore: number) => {
    console.log('✅ handleQuizComplete 호출됨:', { isCorrect, currentRound, quizTaker, newTeamAScore, newTeamBScore });

    // QuizActivity에서 이미 계산된 점수를 받아서 직접 설정
    // 중복 계산 방지
    console.log('🎯 점수 업데이트 (QuizActivity에서 계산된 값):', { newTeamAScore, newTeamBScore });
    setScores({
      [Team.A]: newTeamAScore,
      [Team.B]: newTeamBScore
    });

    // 다음 라운드 준비
    const nextRound = currentRound + 1;
    const shouldContinue = nextRound <= totalRounds;

    // 퀴즈 미포함 모드: 이전 라운드 페이드아웃 시작
    if (!quizIncluded) {
      setIsFadingOutPreviousRound(true);
      // 페이드아웃 시간에 맞춰 로딩 시작 (동시에 페이드아웃 시작)
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // 로딩 화면을 즉시 표시 (모달은 이미 완전히 사라진 상태)
    setIsLoadingNextRound(true);
    setIsFadingOutPreviousRound(false); // 리셋

    // 로딩 화면이 나타나는 동안 Quiz 제거
    await new Promise(resolve => setTimeout(resolve, 100));
    setQuizTaker(null);

    // 로딩 화면 표시 시간 (약간 단축 가능)
    await new Promise(resolve => setTimeout(resolve, 350));

    // 백그라운드에서 데이터 로드
    if (shouldContinue) {
        const data = await fetchRoundData();

        // 최소 로딩 시간 보장 (0.5초로 단축)
        await new Promise(resolve => setTimeout(resolve, 500));

        if (data) {
          // 다음 라운드 데이터로 업데이트 (상태 변경 전에 준비)
          setRoundData(data);
          setCurrentRound(nextRound);

          // 게임 상태를 먼저 변경하여 RoundStart 준비
          setGameState(GameState.ROUND_START);

          // RoundStart가 렌더링된 후 딤 제거 (딤이 RoundStart와 겹치도록)
          await new Promise(resolve => setTimeout(resolve, 400));
          setIsLoadingNextRound(false);
        } else {
          setGameState(GameState.GAME_END);
          await new Promise(resolve => setTimeout(resolve, 400));
          setIsLoadingNextRound(false);
        }
    } else {
        setGameState(GameState.GAME_END);
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsLoadingNextRound(false);
    }
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
    // Preload Round 1 video before transitioning
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = '/videos/alpaca_bg.mp4';
    video.load();

    setGameState(GameState.ROUND_START);
  };

  const handleTeamsChange = (newTeams: TeamSetupTeams) => {
    setTeams(newTeams);
  };

  const toggleCaptureMode = () => {
    setIsCaptureMode(!isCaptureMode);
  };

  // 게임 상태가 변경될 때 타이머 표시 초기화
  useEffect(() => {
    if (gameState !== GameState.TRACING) {
      setShowTracingTimer(false);
      setTracingTimer(0);
    }
  }, [gameState]);

  // API 연결 테스트 (수동 실행)
  const testGeminiAPI = async () => {
    console.log("🚀 Testing Gemini API connection...");
    const isConnected = await testGeminiConnection();
    if (isConnected) {
      console.log("🎉 Gemini API is working perfectly!");
      alert("✅ Gemini API 연결 성공!");
    } else {
      console.log("⚠️ Gemini API connection failed - game will use local data");
      alert("❌ Gemini API 연결 실패 - 로컬 데이터 사용");
    }
  };
  
  // 키보드로 API 테스트 가능 (F12를 누른 후 Console에서 호출)
  (window as any).testGeminiAPI = testGeminiAPI;

  // 캡쳐 모드 토글 키보드 단축키 (Ctrl + Shift + C)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        toggleCaptureMode();
        console.log('캡쳐 모드 토글:', !isCaptureMode ? '활성화' : '비활성화');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCaptureMode]);

  const getHeaderTitle = () => {
    return 'Word Race';
  }

  const shouldShowPause = gameState === GameState.TRACING || gameState === GameState.QUIZ;
  const hideHud = (isLoadingNextRound || isFadingOutPreviousRound) && gameState === GameState.TRACING && !quizIncluded;
  const shouldShowMenu = gameState === GameState.TRACING || gameState === GameState.QUIZ;
  const shouldShowExit = gameState === GameState.SETUP || gameState === GameState.TITLE_SCREEN || gameState === GameState.TEAM_SETUP || gameState === GameState.GAME_END;

  const renderContent = () => {
    // 캡쳐 모드일 때는 배경과 동물만 표시
    if (isCaptureMode) {
      return <CaptureMode currentRound={currentRound} />;
    }

    switch (gameState) {
      case GameState.SETUP:
        return <GameSetup onStart={(rounds, mode, includeQuiz) => startGame(rounds, mode, includeQuiz)} />;

      case GameState.TITLE_SCREEN:
        return (
          <PageTransition transitionKey="title" type="zoom">
            <GameTitleScreen onComplete={() => setGameState(GameState.TEAM_SETUP)} />
          </PageTransition>
        );

      case GameState.TEAM_SETUP:
        return (
          <PageTransition transitionKey="team-setup" type="fade">
            <TeamSetupScreen
              teams={teams}
              onShuffle={handleShuffleTeams}
              onStart={handleStartFromTeamSetup}
              onTeamsChange={handleTeamsChange}
            />
          </PageTransition>
        );

      case GameState.ROUND_START:
        if (!roundData) return null;
        return (
          <PageTransition transitionKey={`round-${currentRound}-start`} type="fade">
            <RoundStart
              currentRound={currentRound}
              onStart={() => setGameState(GameState.TRACING)}
            />
          </PageTransition>
        );

      case GameState.TRACING:
      case GameState.QUIZ:
        if (!roundData) return null;
        // PageTransition 제거 - 게임 상태 변경에도 화면 유지
        // 게임 상태가 변경되어도 동일한 컴포넌트를 유지
        return (
          <div style={{ width: '100%', height: '100%' }} key={`round-${currentRound}`}>
            <DrawingActivity
              roundData={roundData}
              onComplete={handleRoundComplete}
              gameMode={gameMode}
              isPaused={gameState === GameState.QUIZ}
              onTimerChange={handleTracingTimerChange}
              resetActivity={false}
              currentRound={currentRound}
              quizIncluded={quizIncluded}
              hideResultModal={gameState === GameState.QUIZ}
              isQuizMode={gameState === GameState.QUIZ}
              previousTeamAScore={scores[Team.A]}
              previousTeamBScore={scores[Team.B]}
              onQuizStart={(winner) => {
                // Quiz 시작 시 현재 점수를 이전 점수로 즉시 저장
                console.log('🎬 Quiz 시작 - 이전 점수 저장:', { 
                  scores, 
                  winner,
                  'Team A 점수': scores[Team.A],
                  'Team B 점수': scores[Team.B]
                });
                const currentScoresSnapshot = { ...scores };
                setPreviousScores(currentScoresSnapshot);
                console.log('📌 previousScores 설정 완료:', currentScoresSnapshot);
                setQuizTaker(winner);
                setGameState(GameState.QUIZ);
              }}
            />
          </div>
        );
      case GameState.GAME_END:
        return (
          <PageTransition transitionKey="game-end" type="slideUp">
            <GameEnd scores={scores} onPlayAgain={handlePlayAgain} />
          </PageTransition>
        );
      default:
        return null;
    }
  };

  // TITLE_SCREEN부터 BGM 재생 여부
  const shouldPlayBGM = gameState !== GameState.SETUP;

  return (
    <div className="w-full h-screen bg-background overflow-hidden flex items-start justify-center">
      {/* BGM Player - 타이틀 화면부터 재생, Fade in 효과 적용 */}
      {shouldPlayBGM && (
        <BGMPlayer
          volume={0.25}
          startTime={0}
          loop={true}
          autoPlay={true}
          fadeInDuration={3.0}
        />
      )}
      
      <main
        id="stage"
        className="relative flex flex-col text-primary-text"
        style={{
          width: '1280px !important',
          height: '800px !important',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* 기본 배경 이미지 - TITLE_SCREEN 제외하고 표시 */}
        {gameState !== GameState.TITLE_SCREEN && (
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
              zIndex: -1,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* 기본 딤 레이어 - TITLE_SCREEN 제외하고 적용 */}
        {gameState !== GameState.TITLE_SCREEN && (
          <div
            className="absolute inset-0 bg-white/20"
            style={{
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        )}

        {gameState !== GameState.SETUP && gameState !== GameState.TITLE_SCREEN && gameState !== GameState.TEAM_SETUP && !isCaptureMode && !hideHud && (
          <GameHeader
            title={getHeaderTitle()}
            currentRound={showTracingTimer ? undefined : (gameState !== GameState.GAME_END ? currentRound : undefined)}
            onPause={handlePause}
            showPause={shouldShowPause && gameState !== GameState.QUIZ}
            isPaused={isPaused}
            onOpenMenu={handleOpenMenu}
            showMenuButton={shouldShowMenu && gameState !== GameState.QUIZ}
            onExit={handleExit}
            showExitButton={shouldShowExit && gameState !== GameState.QUIZ}
            buttonsDisabled={(isPaused || showMenu) && gameState !== GameState.QUIZ}
            showTimer={showTracingTimer && gameState !== GameState.QUIZ}
            timerValue={tracingTimer}
          />
        )}
        
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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
        {gameState !== GameState.SETUP && gameState !== GameState.TITLE_SCREEN && gameState !== GameState.TEAM_SETUP && gameState !== GameState.ROUND_START && !isCaptureMode && !hideHud && (
          <>
            <div className="absolute top-[88px] left-4 z-10">
              <div className="flex items-center gap-4 p-2 pl-4 text-2xl font-bold text-white bg-team-a rounded-r-full">
                <span className="font-display">Team A</span>
                <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                  <span style={{ minWidth: '3ch', textAlign: 'right' }}>{scores[Team.A]}</span>
                </div>
              </div>
            </div>

            <div className="absolute top-[88px] right-4 z-10">
              <div className="flex items-center gap-4 p-2 pr-4 text-2xl font-bold text-white bg-team-b rounded-l-full">
                <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                  <span style={{ minWidth: '3ch', textAlign: 'right' }}>{scores[Team.B]}</span>
                </div>
                <span className="font-display">Team B</span>
              </div>
            </div>
          </>
        )}

        <div className="flex-grow overflow-hidden relative" style={{ backgroundColor: 'transparent' }}>
          <AnimatePresence mode="wait">
            {!isLoadingNextRound && !isFadingOutPreviousRound && (
              <motion.div
                key={`content-${currentRound}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {renderContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quiz Overlay - QUIZ 상태이거나 로딩 중일 때 딤 유지 */}
        {/* AnimatePresence로 fade 효과 적용 */}
        <AnimatePresence>
          {((gameState === GameState.QUIZ && roundData && quizTaker) || (isLoadingNextRound && (gameState === GameState.QUIZ || gameState === GameState.TRACING))) && (
            <motion.div
              key="quiz-overlay-dim"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              {/* 헤더 - 딤 아래 */}
              <div className="absolute top-0 left-0 right-0 z-[50] pointer-events-auto">
                <GameHeader
                  title={getHeaderTitle()}
                  currentRound={currentRound}
                  onPause={handlePause}
                  showPause={false}
                  isPaused={isPaused}
                  onOpenMenu={handleOpenMenu}
                  showMenuButton={true}
                  onExit={handleExit}
                  showExitButton={false}
                  buttonsDisabled={true}
                  showTimer={false}
                  timerValue={0}
                />
              </div>

              {/* 점수판 - 딤 아래 */}
              <div className="absolute top-[88px] left-4 z-[50]">
                <div className="flex items-center gap-4 p-2 pl-4 text-2xl font-bold text-white bg-team-a rounded-r-full">
                  <span className="font-display">Team A</span>
                <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                  <span style={{ minWidth: '3ch', textAlign: 'right' }}>{previousScores[Team.A]}</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-[88px] right-4 z-[50]">
                <div className="flex items-center gap-4 p-2 pr-4 text-2xl font-bold text-white bg-team-b rounded-l-full">
                <div className="flex items-center gap-2 px-4 py-1 bg-white/30 rounded-full">
                  <span style={{ minWidth: '3ch', textAlign: 'right' }}>{previousScores[Team.B]}</span>
                  </div>
                  <span className="font-display">Team B</span>
                </div>
              </div>

              {/* 전체 화면 딤 레이어 - 항상 불투명하게 유지 */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[55]"
                style={{
                  opacity: 1,
                  willChange: 'auto'
                }}
              />

              {/* 퀴즈 모달을 딤 위에 표시 - 로딩 중에는 숨김 */}
              {!isLoadingNextRound && gameState === GameState.QUIZ && roundData && quizTaker && (
                <div
                  className="absolute inset-0 z-[200] pointer-events-none"
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                  <QuizActivity
                    quiz={roundData.quiz}
                    playingTeam={quizTaker}
                    onComplete={handleQuizComplete}
                    previousTeamAScore={previousScores[Team.A]}
                    previousTeamBScore={previousScores[Team.B]}
                    onFadeOutStart={() => setIsFadingOutPreviousRound(true)}
                  />
                </div>
              )}

              {/* Round Loading - 퀴즈 모드 */}
              <AnimatePresence>
                {isLoadingNextRound && gameState === GameState.QUIZ ? (
                  <motion.div
                    key="quiz-round-loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute inset-0 z-[300]"
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }}
                  >
                    <RoundLoading nextRound={currentRound + 1} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 퀴즈 미포함 모드 - 별도 로딩 화면 및 딤 */}
        <AnimatePresence>
          {(isLoadingNextRound || isFadingOutPreviousRound) && gameState === GameState.TRACING && !quizIncluded && (
            <motion.div
              key="no-quiz-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 100000
              }}
            >
              {/* 딤 레이어 */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100001]" />
              
              {/* 로딩 화면 */}
              <div className="absolute inset-0 z-[100002] flex items-center justify-center">
                <RoundLoading nextRound={currentRound + 1} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;