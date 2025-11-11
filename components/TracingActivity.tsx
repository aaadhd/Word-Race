import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { RoundData, TracingResult } from '../types.ts';
import { Team, GameMode } from '../types.ts';
import DrawingCanvas from './TracingCanvas.tsx';
import RoundResult from './RoundResult.tsx';
import { StarIcon } from './icons/StarIcon.tsx';
import { recognizeHandwriting } from '../services/geminiService.ts';
import CountingNumber from './CountingNumber.tsx';
import RoundLoading from './RoundLoading.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { RESULT_MODAL_DISPLAY_TIME, LOADING_SCREEN_TIME } from '../constants/gameConstants.ts';

const RESULT_DISPLAY_TIME = RESULT_MODAL_DISPLAY_TIME; // 점수판 모달 유지 시간을 더 늘려 충분한 확인 시간 제공

interface DrawingActivityProps {
  roundData: RoundData;
  onComplete: (winner: Team | null, results?: any) => void;
  gameMode: GameMode;
  isPaused: boolean;
  onTimerChange?: (timeLeft: number) => void;
  hideResultModal?: boolean;
  resetActivity?: boolean;
  currentRound?: number;
  isQuizMode?: boolean; // 퀴즈 모드 여부
  quizIncluded?: boolean;
  onQuizStart?: (winner: Team) => void;
  previousTeamAScore?: number;
  previousTeamBScore?: number;
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


const DrawingActivity: React.FC<DrawingActivityProps> = ({ roundData, onComplete, gameMode, isPaused, onTimerChange, hideResultModal = false, resetActivity = false, currentRound = 1, isQuizMode = false, quizIncluded = false, onQuizStart, previousTeamAScore = 0, previousTeamBScore = 0 }) => {
  console.log('TracingActivity - gameMode received:', gameMode);
  const [teamADone, setTeamADone] = useState(false);
  const [teamBDone, setTeamBDone] = useState(false);
  const [teamARawResult, setTeamARawResult] = useState<RawResult | null>(null);
  const [teamBRawResult, setTeamBRawResult] = useState<RawResult | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalResults, setFinalResults] = useState<TracingResult[] | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [calculatedScores, setCalculatedScores] = useState({ teamA: 0, teamB: 0 });
  const [roundStartAtMs, setRoundStartAtMs] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  // Portal 루트: 활동 영역(#stage)로 우선 포털, 없으면 body로 폴백
  const portalRoot = typeof document !== 'undefined' ? (document.getElementById('stage') || document.body) : null;

  // 라운드 시작시각을 isPaused가 풀리는 순간 동기화하여 설정
  useEffect(() => {
    if (!isPaused && roundStartAtMs == null) {
      setRoundStartAtMs(Date.now());
    }
  }, [isPaused, roundStartAtMs]);

  // 새로운 라운드 시작 시 모든 상태 초기화
  const prevWordRef = useRef(roundData.word);
  useEffect(() => {
    // word가 변경된 경우에만 초기화 (resetActivity는 이제 무시)
    if (prevWordRef.current !== roundData.word) {
      console.log('🔄 새 라운드 감지 - 상태 초기화:', { 이전: prevWordRef.current, 새로운: roundData.word });
      setTeamADone(false);
      setTeamBDone(false);
      setTeamARawResult(null);
      setTeamBRawResult(null);
      setIsScoring(false);
      setShowResultModal(false);
      setFinalResults(null);
      setWinner(null);
      setShowScoreModal(false);
      setRoundStartAtMs(null);
      setVideoEnded(false);
      setVideosLoaded(false);
      prevWordRef.current = roundData.word;
    }
  }, [roundData.word]);
  
  // 모든 라운드에서 즉시 게임 시작
  useEffect(() => {
    setVideoEnded(true);
  }, [currentRound]);

  // 비디오 로직 제거 - 이미지만 사용
  useEffect(() => {
    setVideosLoaded(true);
  }, [currentRound]);

  // (제거) 와! 효과음은 사용하지 않음

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
      // 라운드 시작 상태이거나 리셋 중일 때는 결과 처리하지 않음
      if (resetActivity) return;
      
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
  }, [teamADone, teamBDone, teamARawResult, teamBRawResult, gameMode, roundData.word, resetActivity]);
  
  const handleContinueFromModal = () => {
    console.log('handleContinueFromModal called:', { winner, finalResults, quizIncluded });
    if (winner && quizIncluded && onQuizStart) {
      // 퀴즈 포함 모드: 승자가 있으면 퀴즈 시작
      onQuizStart(winner);
    } else if (winner === null && quizIncluded) {
      // 퀴즈 포함 모드: 승자가 없으면 (No quiz) 로딩 화면 표시 후 다음 라운드
      setShowResultModal(false);
      setShowLoadingScreen(true);

      setTimeout(() => {
        setShowLoadingScreen(false);
        onComplete(null, finalResults);
      }, LOADING_SCREEN_TIME);
    } else if (!quizIncluded) {
      // 퀴즈 미포함 모드: 점수를 직접 계산하고 점수 모달 표시
      const teamAWin = winner === Team.A;
      const teamBWin = winner === Team.B;

      let teamAScore = 0;
      let teamBScore = 0;

      if (gameMode === GameMode.TRACE) {
        // TRACE 모드: 일치율이 높은 팀이 30점, 낮은 팀은 0점
        if (finalResults) {
          const teamAResult = finalResults.find(r => r.team === Team.A)!;
          const teamBResult = finalResults.find(r => r.team === Team.B)!;
          teamAScore = teamAResult.accuracy > teamBResult.accuracy ? 30 : 0;
          teamBScore = teamBResult.accuracy > teamAResult.accuracy ? 30 : 0;
        }
      } else if (gameMode === GameMode.DRAW) {
        // DRAW 모드: 맞춘 팀이 30점, 틀린 팀은 0점
        teamAScore = teamAWin ? 30 : 0;
        teamBScore = teamBWin ? 30 : 0;
      }

      console.log('퀴즈 미포함 모드 - 점수 계산:', { teamAScore, teamBScore, winner, gameMode });

      // 상태 업데이트는 비동기이므로, 이후 타이머 콜백에서 사용할 수 있도록
      // 로컬 상수로 고정해 두고 이를 참조한다 (stale state 방지)
      const localScores = { teamA: teamAScore, teamB: teamBScore };
      setCalculatedScores(localScores);
      setShowResultModal(false);
      setShowScoreModal(true);

      // 타이머로 자동 닫기 (퀴즈 포함 모드와 동일하게)
      setTimeout(() => {
        setShowScoreModal(false);

        // 로딩 화면 표시
        setShowLoadingScreen(true);

        // 로딩 화면 후 다음 라운드로 이동
        setTimeout(() => {
          setShowLoadingScreen(false);

          // 현재 점수를 포함한 결과를 생성 (stale state 대신 localScores 사용)
          const resultsWithScores = finalResults?.map(result => ({
            ...result,
            points: result.team === Team.A ? localScores.teamA : localScores.teamB
          }));

          onComplete(winner, resultsWithScores);
        }, LOADING_SCREEN_TIME);
      }, RESULT_DISPLAY_TIME);
    }
  };



  if (isScoring) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-primary-text">
            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-accent-cyan"></div>
            <p className="mt-4 text-3xl font-display">Checking your writing...</p>
        </div>
    );
  }


  // 현재 라운드의 사이클 계산 (1-4 반복)
  const cycleRound = currentRound <= 4 ? currentRound : ((currentRound - 1) % 4) + 1;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)',
        opacity: 1
      }}
    >
      {/* 전체 라운드 배경 이미지 */}
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
          zIndex: -1
        }}
      />

       {/* 동물 영상/이미지 레이어 - 현재 라운드에 맞는 영상만 렌더링 */}
       {/* Round 1 or 5, 9, 13... */}
       {cycleRound === 1 && (
        <>
          {/* 왼쪽 (Team A) - alpaca */}
          <div className="absolute left-0 w-1/2 flex items-end justify-start pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/alpaca.png"
              alt="alpaca"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'left bottom',
                transform: 'translate3d(0, 0, 0) scaleX(1.1)',
                transformOrigin: 'left center',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
          {/* 오른쪽 (Team B) - chick */}
          <div className="absolute right-0 w-1/2 flex items-end justify-end pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/chick.png"
              alt="chick"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                transform: 'translate3d(0, 0, 0) scaleX(1.07)',
                transformOrigin: 'right center',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        </>
      )}

       {/* Round 2 or 6, 10, 14... */}
       {cycleRound === 2 && (
        <>
          {/* 왼쪽 (Team A) - panda */}
          <div className="absolute left-0 w-1/2 flex items-end justify-start pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/panda.png"
              alt="panda"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'left bottom',
                transform: 'translate3d(2%, -2%, 0) scaleX(0.95)',
                transformOrigin: 'left center',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
          {/* 오른쪽 (Team B) - sloth */}
          <div className="absolute right-0 w-1/2 flex items-end justify-end pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/sloth.png"
              alt="sloth"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                transform: 'translate3d(-3%, 0, 0) scaleX(1.05)',
                transformOrigin: 'right center',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        </>
      )}

       {/* Round 3 or 7, 11, 15... */}
       {cycleRound === 3 && (
        <>
          {/* 왼쪽 (Team A) - koala */}
          <div className="absolute left-0 w-1/2 flex items-end justify-start pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/koala.png"
              alt="koala"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'left bottom',
                transform: 'translate3d(3%, 0, 0)',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
          {/* 오른쪽 (Team B) - tiger */}
          <div className="absolute right-0 w-1/2 flex items-end justify-end pointer-events-none z-0" style={{ bottom: '-2%' }}>
            <img
              src="/images/tiger.png"
              alt="tiger"
              className="w-auto"
              style={{
                height: '740px',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                transform: 'translate3d(-3%, 0, 0)',
                willChange: 'auto',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        </>
      )}

       {/* Round 4 or 8, 12, 16... */}
       {cycleRound === 4 && (
         <>
           {/* 왼쪽 (Team A) - bigcat */}
           <div className="absolute left-0 w-1/2 flex items-end justify-start pointer-events-none z-0" style={{ bottom: '-2%' }}>
             <img
               src="/images/bigcat.png"
               alt="bigcat"
               className="w-auto"
               style={{
                 height: '760px',
                 objectFit: 'contain',
                 objectPosition: 'left bottom',
                 transform: 'translate3d(0, 0, 0) scaleX(0.95)',
                 transformOrigin: 'left center',
                 willChange: 'auto',
                 backfaceVisibility: 'hidden'
               }}
             />
           </div>
           {/* 오른쪽 (Team B) - capybara */}
           <div className="absolute right-0 w-1/2 flex items-end justify-end pointer-events-none z-0" style={{ bottom: '-2%' }}>
             <img
               src="/images/capybara.png"
               alt="capybara"
               className="w-auto"
               style={{
                 height: '760px',
                 objectFit: 'contain',
                 objectPosition: 'right bottom',
                 transform: 'translate3d(0, 0, 0) scaleX(0.95)',
                 transformOrigin: 'right center',
                 willChange: 'auto',
                 backfaceVisibility: 'hidden'
               }}
             />
           </div>
         </>
       )}

      {/* Image Container - 절대 위치 */}
      {videoEnded && (
        <div className="absolute top-[63px] left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-10">
          {roundData.wordImage && (
              <div 
                className="bg-slate-100 p-1 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-100"
                onClick={() => speakWord(roundData.word)}
                role="button"
                aria-label={`Hear the word: ${roundData.word}`}
                tabIndex={0}
              >
                  <img src={roundData.wordImage} alt={gameMode === GameMode.TRACE ? roundData.word : 'Guess the word'} className="w-[274px] h-[188px] object-cover rounded-xl" />
              </div>
          )}
          <p className="text-xl text-white font-bold">
            {gameMode === GameMode.DRAW ? 'What is this? Write the word!' : ''}
          </p>
        </div>
      )}
      
      {/* Drawing Canvas Container - 절대 위치 */}
      {videoEnded && (
        <>
          {/* Team A - 왼쪽 영상 영역 중앙 */}
          <div className={`absolute top-[346px] left-0 w-1/2 flex justify-start items-center transition-opacity duration-500 z-20`}>
            <div className="flex justify-center items-center" style={{ width: '740px', marginLeft: '0px', transform: 'translateX(-3%)' }}>
              <DrawingCanvas
                key={`teamA-${currentRound}`}
                word={roundData.word}
                strokeColor="#3b82f6"
                onDone={handleTeamADone}
                mode={gameMode}
                isPaused={isPaused || showResultModal}
                startAtMs={roundStartAtMs}
                onTimerChange={onTimerChange}
                currentRound={currentRound}
                playAnimation={videoEnded && !isPaused}
              />
            </div>
          </div>

          {/* Team B - 오른쪽 영상 영역 중앙 */}
          <div className={`absolute top-[346px] right-0 w-1/2 flex justify-end items-center transition-opacity duration-500 z-20`}>
            <div className="flex justify-center items-center" style={{ width: '740px', marginRight: '0px', transform: 'translateX(3%)' }}>
              <DrawingCanvas 
                key={`teamB-${currentRound}`}
                word={roundData.word} 
                strokeColor="#ef4444" 
                onDone={handleTeamBDone} 
                mode={gameMode}
                isPaused={isPaused || showResultModal}
                startAtMs={roundStartAtMs}
                onTimerChange={onTimerChange}
                currentRound={currentRound}
                playAnimation={videoEnded && !isPaused}
              />
            </div>
          </div>
        </>
      )}

      {/* 통합 딤 레이어 - Result Modal 또는 Score Modal이 표시될 때 (전역 오버레이로 승격) */}
      {portalRoot && ((finalResults && !hideResultModal && !isQuizMode && showResultModal) || (!quizIncluded && showScoreModal)) && (
        createPortal(
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[99999]"
            style={{ position: 'absolute' }}
          />,
          portalRoot
        )
      )}

      {/* Result Modal - 퀴즈 모드에서는 숨김 */}
      {portalRoot && finalResults && !hideResultModal && !isQuizMode && showResultModal && (
        createPortal(
          <div className="absolute inset-0 z-[100000] flex items-center justify-center" style={{ position: 'absolute' }}>
            <RoundResult
              winner={winner}
              results={finalResults}
              onContinue={handleContinueFromModal}
              gameMode={gameMode}
              word={roundData.word}
              wordImage={roundData.wordImage}
              showButton={quizIncluded}
              noQuiz={winner === null && quizIncluded}
            />
          </div>,
          portalRoot
        )
      )}

      {/* Score Modal - 퀴즈 미포함 모드에서만 표시 */}
      {portalRoot && !quizIncluded && showScoreModal && (
        createPortal(
          <div className="absolute inset-0 z-[100000] flex items-center justify-center pointer-events-none" style={{ position: 'absolute' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center w-full max-w-2xl pointer-events-auto">
              <h1 className="text-5xl font-display text-accent-yellow drop-shadow-lg mb-4">
                Points Earned!
              </h1>
              
              <div className="flex justify-center gap-8 mt-8">
                {/* Team A Score */}
                <div className={`flex flex-col items-center p-6 rounded-2xl border-4 min-w-[180px] ${
                  calculatedScores.teamA > calculatedScores.teamB ? 'border-team-a bg-team-a/10 scale-105' : 'border-gray-300 bg-gray-50'
                } transition-all duration-300`}>
                  <h3 className="text-2xl font-display text-team-a mb-2">Team A</h3>
                  <div className="text-6xl font-display text-team-a tabular-nums">
                    <CountingNumber
                      key={`teamA-${previousTeamAScore}-${previousTeamAScore + calculatedScores.teamA}`}
                      from={previousTeamAScore}
                      to={previousTeamAScore + calculatedScores.teamA}
                      duration={800}
                      playSound={true}
                    />
                  </div>
                  {calculatedScores.teamA > 0 && (
                    <div className="mt-2 text-lg font-display text-green-600 animate-bounce">
                      +{calculatedScores.teamA} pts!
                    </div>
                  )}
                </div>

                {/* Team B Score */}
                <div className={`flex flex-col items-center p-6 rounded-2xl border-4 min-w-[180px] ${
                  calculatedScores.teamB > calculatedScores.teamA ? 'border-team-b bg-team-b/10 scale-105' : 'border-gray-300 bg-gray-50'
                } transition-all duration-300`}>
                  <h3 className="text-2xl font-display text-team-b mb-2">Team B</h3>
                  <div className="text-6xl font-display text-team-b tabular-nums">
                    <CountingNumber
                      key={`teamB-${previousTeamBScore}-${previousTeamBScore + calculatedScores.teamB}`}
                      from={previousTeamBScore}
                      to={previousTeamBScore + calculatedScores.teamB}
                      duration={800}
                      playSound={true}
                    />
                  </div>
                  {calculatedScores.teamB > 0 && (
                    <div className="mt-2 text-lg font-display text-green-600 animate-bounce">
                      +{calculatedScores.teamB} pts!
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>,
          portalRoot
        )
      )}

      {/* Loading Screen - No quiz 후 다음 라운드 전환 시 표시 */}
      <AnimatePresence mode="wait">
        {showLoadingScreen && (
          <motion.div
            key="round-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-[1010]"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="absolute inset-0 z-[1011]">
              <RoundLoading nextRound={currentRound + 1} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrawingActivity;