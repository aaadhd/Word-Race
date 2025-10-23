import React, { useState, useEffect, useRef } from 'react';
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
  hideResultModal?: boolean;
  resetActivity?: boolean;
  currentRound?: number;
  isQuizMode?: boolean; // 퀴즈 모드 여부
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


const DrawingActivity: React.FC<DrawingActivityProps> = ({ roundData, onComplete, isBonusRound, gameMode, isPaused, onTimerChange, hideResultModal = false, resetActivity = false, currentRound = 1, isQuizMode = false }) => {
  console.log('TracingActivity - gameMode received:', gameMode);
  const alpacaVideoRef = useRef<HTMLVideoElement>(null);
  const catVideoRef = useRef<HTMLVideoElement>(null);
  const chickVideoRef = useRef<HTMLVideoElement>(null);
  const pandaVideoRef = useRef<HTMLVideoElement>(null);
  const slothVideoRef = useRef<HTMLVideoElement>(null);
  const koalaVideoRef = useRef<HTMLVideoElement>(null);
  const tigerVideoRef = useRef<HTMLVideoElement>(null);
  const capybaraVideoRef = useRef<HTMLVideoElement>(null);
  const bigcatVideoRef = useRef<HTMLVideoElement>(null);
  const [teamADone, setTeamADone] = useState(false);
  const [teamBDone, setTeamBDone] = useState(false);
  const [teamARawResult, setTeamARawResult] = useState<RawResult | null>(null);
  const [teamBRawResult, setTeamBRawResult] = useState<RawResult | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalResults, setFinalResults] = useState<TracingResult[] | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const [roundStartAtMs, setRoundStartAtMs] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);

  // 라운드 시작시각을 isPaused가 풀리는 순간 동기화하여 설정
  useEffect(() => {
    if (!isPaused && roundStartAtMs == null) {
      setRoundStartAtMs(Date.now());
    }
  }, [isPaused, roundStartAtMs]);

  // 새로운 라운드 시작 시 모든 상태 초기화
  useEffect(() => {
    if (resetActivity) {
      setTeamADone(false);
      setTeamBDone(false);
      setTeamARawResult(null);
      setTeamBRawResult(null);
      setIsScoring(false);
      setShowResultModal(false);
      setFinalResults(null);
      setWinner(null);
      setRoundStartAtMs(null);
      setVideoEnded(false);
      setVideosLoaded(false);
    }
  }, [resetActivity, roundData.word]); // roundData.word를 의존성에 추가하여 새 라운드 감지
  
  // 모든 라운드에서 즉시 게임 시작
  useEffect(() => {
    setVideoEnded(true);
  }, [currentRound]);

  // 비디오 로직 제거 - 이미지만 사용
  useEffect(() => {
    setVideosLoaded(true);
  }, [currentRound]);

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


  // 현재 라운드의 사이클 계산 (1-4 반복)
  const cycleRound = currentRound <= 4 ? currentRound : ((currentRound - 1) % 4) + 1;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)',
        opacity: videosLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {/* 전체 라운드 배경 이미지 - 라운드 시작 상태가 아닐 때만 표시 */}
      {!isPaused || isQuizMode ? (
        <div 
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage: 'url(/images/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : null}
      
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
      {videoEnded && !isPaused && (
        <div className="absolute top-[63px] left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-50">
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
          <p className="text-xl text-secondary-text font-bold">
            {gameMode === GameMode.DRAW ? 'What is this? Write the word!' : ''}
          </p>
        </div>
      )}
      
      {/* Drawing Canvas Container - 절대 위치 */}
      {videoEnded && (!isPaused || isQuizMode) && (
        <>
          {/* Team A - 왼쪽 영상 영역 중앙 */}
          <div className={`absolute top-[336px] left-0 w-1/2 flex justify-start items-center transition-opacity duration-500 z-20`}>
            <div className="flex justify-center items-center" style={{ width: '740px', marginLeft: '0px', transform: 'translateX(-3%)' }}>
              <DrawingCanvas 
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
          <div className={`absolute top-[336px] right-0 w-1/2 flex justify-end items-center transition-opacity duration-500 z-20`}>
            <div className="flex justify-center items-center" style={{ width: '740px', marginRight: '0px', transform: 'translateX(3%)' }}>
              <DrawingCanvas 
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

      {/* Result Modal */}
      {showResultModal && finalResults && !hideResultModal && (
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