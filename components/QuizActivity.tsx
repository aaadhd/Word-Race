import React, { useState, useEffect } from 'react';
import type { Quiz } from '../types.ts';
import { Team } from '../types.ts';
import QuizPopup, { QuizData } from './QuizPopup.tsx';
import QuizResultModal from './QuizResultModal.tsx';
import { playCorrectAnswer, playWrongAnswer } from '../utils/soundEffects.ts';

interface QuizActivityProps {
  quiz: Quiz;
  playingTeam: Team;
  onComplete: (isCorrect: boolean, newTeamAScore: number, newTeamBScore: number) => void;
  onTimerChange?: (timeLeft: number) => void;
  previousTeamAScore: number;
  previousTeamBScore: number;
  onFadeOutStart?: () => void;
}

const QUIZ_TIME_SECONDS = 15;
const FEEDBACK_DISPLAY_TIME = 1200; // 1.2초 - 피드백 토스트 표시 시간
const QUIZ_MODAL_DISPLAY_TIME = 3000; // 3초 - 퀴즈 모달(정답/오답 색상) 유지 시간
const RESULT_DISPLAY_TIME = 3200; // 퀴즈 결과(점수 상승) 모달 표시 시간을 연장하여 충분히 확인 가능하게 함

type QuizResult = {
  isCorrect: boolean;
  status: 'success' | 'failed' | 'times_up';
};

const QuizActivity: React.FC<QuizActivityProps> = ({
  quiz,
  playingTeam,
  onComplete,
  onTimerChange,
  previousTeamAScore,
  previousTeamBScore,
  onFadeOutStart
}) => {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [hideQuizModal, setHideQuizModal] = useState(false);
  const [feedbackFading, setFeedbackFading] = useState(false);
  const [quizModalExiting, setQuizModalExiting] = useState(false);
  const [resultModalFading, setResultModalFading] = useState(false);
  
  // 완료 시 사용할 최종 점수를 저장하는 ref
  const finalScoresRef = React.useRef({ teamAScore: 0, teamBScore: 0 });

  const teamName = playingTeam === Team.A ? 'Team A' : 'Team B';
  // 정답 30점, 오답 10점 고정
  const points = { correct: 30, incorrect: 10 };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log('🎮 QuizActivity handleAnswer:', { isCorrect, selectedOptionText });

    const status = isCorrect ? 'success' : 'failed';
    const earnedPoints = isCorrect ? points.correct : points.incorrect;
    
    // 최종 점수 즉시 계산하고 ref에 저장
    const newTeamAScore = playingTeam === Team.A ? previousTeamAScore + earnedPoints : previousTeamAScore;
    const newTeamBScore = playingTeam === Team.B ? previousTeamBScore + earnedPoints : previousTeamBScore;
    finalScoresRef.current = { teamAScore: newTeamAScore, teamBScore: newTeamBScore };
    
    console.log('💰 최종 점수 ref에 저장:', finalScoresRef.current);
    
    setQuizResult({ isCorrect, status });
    setShowFeedback(true);

    console.log('  ✅ quizResult 설정:', { isCorrect, status });
    console.log('  ✅ showFeedback: true');

    // 정답/오답 사운드 재생
    if (isCorrect) {
      playCorrectAnswer();
    } else {
      playWrongAnswer();
    }
  };

  const handleTimeout = () => {
    console.log('⏰ QuizActivity handleTimeout');
    const earnedPoints = points.incorrect; // 시간 초과는 incorrect 점수
    
    // 최종 점수 즉시 계산하고 ref에 저장
    const newTeamAScore = playingTeam === Team.A ? previousTeamAScore + earnedPoints : previousTeamAScore;
    const newTeamBScore = playingTeam === Team.B ? previousTeamBScore + earnedPoints : previousTeamBScore;
    finalScoresRef.current = { teamAScore: newTeamAScore, teamBScore: newTeamBScore };
    
    console.log('💰 최종 점수 ref에 저장 (timeout):', finalScoresRef.current);
    
    setQuizResult({ isCorrect: false, status: 'times_up' });
    setShowFeedback(true);
    playWrongAnswer(); // 시간 초과도 오답 사운드
  };

  // 결과에 따라 새 점수 계산 - useMemo로 최적화하고 의존성 명확히
  const newScores = React.useMemo(() => {
    if (!quizResult) {
      console.log('⚠️ newScores 계산: quizResult 없음, 이전 점수 반환');
      return {
        teamAScore: previousTeamAScore,
        teamBScore: previousTeamBScore
      };
    }
    
    const earnedPoints = quizResult.isCorrect ? points.correct : points.incorrect;
    console.log('💰 newScores 계산 시작:', {
      '결과': quizResult.status,
      '정답여부': quizResult.isCorrect,
      '획득점수': earnedPoints,
      '득점팀': playingTeam === Team.A ? 'Team A' : 'Team B',
      '이전 Team A': previousTeamAScore,
      '이전 Team B': previousTeamBScore
    });
    
    if (playingTeam === Team.A) {
      const result = {
        teamAScore: previousTeamAScore + earnedPoints,
        teamBScore: previousTeamBScore
      };
      console.log('💰 newScores 결과 (Team A 득점):', result);
      return result;
    } else {
      const result = {
        teamAScore: previousTeamAScore,
        teamBScore: previousTeamBScore + earnedPoints
      };
      console.log('💰 newScores 결과 (Team B 득점):', result);
      return result;
    }
  }, [quizResult, points, playingTeam, previousTeamAScore, previousTeamBScore]);

  // 1-2단계: 피드백 표시 및 종료
  useEffect(() => {
    if (!showFeedback || !quizResult) return;

    console.log('QuizActivity - 피드백 시퀀스 시작', { showFeedback, quizResult });

    let closeTimer: NodeJS.Timeout;

    // 1단계: 피드백은 즉시 표시, 퀴즈 모달과 함께 사라짐
    // 피드백을 별도로 관리하지 않고 퀴즈 모달과 함께 처리

    // 2단계: 퀴즈 모달 + 정오답 표기 동시 페이드아웃 시작
    console.log('⏰ 퀴즈 모달 타이머 설정, 대기 시간:', QUIZ_MODAL_DISPLAY_TIME, 'ms');
    const quizModalExitTimer = setTimeout(() => {
      console.log('✅ QuizActivity - 퀴즈 모달 페이드아웃 시작');
      setQuizModalExiting(true);
      // 피드백도 함께 페이드아웃
      setFeedbackFading(true);

      // 3단계: 퀴즈 모달 + 피드백 동시 종료 (300ms 후)
      closeTimer = setTimeout(() => {
        console.log('✅ QuizActivity - setHideQuizModal(true) 호출!');
        setHideQuizModal(true);
        // 피드백도 함께 사라짐
        setShowFeedback(false);
        setFeedbackFading(false);
      }, 300);
    }, QUIZ_MODAL_DISPLAY_TIME);

    return () => {
      clearTimeout(quizModalExitTimer);
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
    };
  }, [showFeedback, quizResult]);

  // 결과 모달 표시 시 모든 점수 고정 (리렌더링으로 인한 깜박임 방지)
  const [frozenPreviousScores, setFrozenPreviousScores] = React.useState({ 
    teamAScore: previousTeamAScore, 
    teamBScore: previousTeamBScore 
  });
  const [frozenNewScores, setFrozenNewScores] = React.useState({ 
    teamAScore: previousTeamAScore, 
    teamBScore: previousTeamBScore 
  });

  // 3단계: 퀴즈 모달이 닫힌 후 결과 모달 표시
  useEffect(() => {
    console.log('🔍 3단계 useEffect 체크:', { hideQuizModal, quizResult, quizResultType: typeof quizResult, quizResultKeys: quizResult ? Object.keys(quizResult) : 'null' });
    if (!hideQuizModal || !quizResult) {
      console.log('❌ 3단계 useEffect skip:', { hideQuizModal, quizResult: !!quizResult });
      return;
    }

    console.log('✅ QuizActivity - 3단계: setShowResultModal(true) 호출!');

    // 점수 완전 고정 - 이후 리렌더링에도 절대 변경되지 않음
    setFrozenPreviousScores({ teamAScore: previousTeamAScore, teamBScore: previousTeamBScore });
    setFrozenNewScores(newScores);
    
    // ref에도 저장
    finalScoresRef.current = newScores;

    setQuizModalExiting(false);
    setShowResultModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideQuizModal, quizResult]);

  // 완료 플래그로 중복 호출 방지
  const completedRef = React.useRef(false);

  // 4단계: 결과 모달 표시 후 다음 라운드로 진행
  useEffect(() => {
    console.log('🔍 4단계 useEffect 체크:', { showResultModal, quizResult, completed: completedRef.current });
    if (!showResultModal || !quizResult) return;
    if (completedRef.current) return;

    console.log('QuizActivity - 4단계: 결과 모달 자동 진행 타이머 시작', { showResultModal, quizResult });

    // 결과 모달 fade-out 시작 (RESULT_DISPLAY_TIME - 400ms 시점)
    const fadeTimer = setTimeout(() => {
      console.log('QuizActivity - 4단계: 결과 모달 fade-out 시작');
      setResultModalFading(true);
      // 이전 라운드 화면도 함께 fade-out 시작
      onFadeOutStart?.();
    }, RESULT_DISPLAY_TIME - 400);

    // 결과 모달 표시 후 다음 라운드 진행
    // 기존: RESULT_DISPLAY_TIME + 400 (fade-out 완료 시점)
    // 조정: fade-out 시작과 동시에 다음 라운드 진행을 트리거하여 Next Round를 더 일찍 표시
    const resultTimer = setTimeout(() => {
      if (completedRef.current) return;
      console.log('QuizActivity - 4단계: 결과 모달 종료, 다음 라운드 진행');
      completedRef.current = true;
      // ref에 저장된 최종 점수 사용
      const scores = finalScoresRef.current;
      console.log('QuizActivity - 최종 점수:', scores);
      onComplete(quizResult.isCorrect, scores.teamAScore, scores.teamBScore);
    }, RESULT_DISPLAY_TIME - 400); // fade-out 시작 시점에 onComplete 호출

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(resultTimer);
    };
  }, [showResultModal, quizResult, onComplete]);

  // 안전장치: 모든 단계 합산 시간 이후에도 진행되지 않으면 강제 진행
  useEffect(() => {
    if (!quizResult) return;
    if (completedRef.current) return;

    const watchdogDelay = FEEDBACK_DISPLAY_TIME + QUIZ_MODAL_DISPLAY_TIME + RESULT_DISPLAY_TIME + 500; // 총 약 7.2초
    console.log('⏱️ Watchdog 시작, 타임아웃:', watchdogDelay);
    
    const watchdog = setTimeout(() => {
      if (completedRef.current) {
        console.log('⏱️ Watchdog - 이미 완료되어 skip');
        return;
      }
      console.warn('⏱️ Watchdog: 결과 진행이 지연되어 강제 onComplete 실행');
      completedRef.current = true;
      const scores = finalScoresRef.current;
      onComplete(quizResult.isCorrect, scores.teamAScore, scores.teamBScore);
    }, watchdogDelay);

    return () => clearTimeout(watchdog);
  }, [quizResult, onComplete]);

  // 기존 Quiz 타입을 QuizData 타입으로 변환 (useMemo로 메모이제이션)
  const quizData: QuizData = React.useMemo(() => ({
    quizId: `quiz-${quiz.question}`, // Date.now() 대신 question으로 고정
    quizType: 'multipleChoice',
    questionText: quiz.question,
    options: quiz.options.map(option => ({
      text: option,
      isCorrect: option === quiz.correctAnswer
    }))
  }), [quiz]);

  return (
    <>
      {/* 퀴즈와 결과 모달 (딤 레이어는 App.tsx에서 처리) */}
      {(quizResult || !hideQuizModal || showResultModal) ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-[1004]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* 퀴즈 모달 - 숨김 상태가 아닐 때 표시 */}
          {!hideQuizModal && (
            <div style={{ 
              transition: quizModalExiting ? 'opacity 0.3s ease-out, transform 0.3s ease-out' : 'none',
              opacity: quizModalExiting ? 0 : 1,
              transform: quizModalExiting ? 'scale(0.9)' : 'scale(1)'
            }}>
              <QuizPopup
                quiz={quizData}
                team={playingTeam === Team.A ? 'A' : 'B'}
                onAnswer={handleAnswer}
                isPaused={false}
                timeLimit={QUIZ_TIME_SECONDS}
                teamColors={{
                  A: { name: 'text-team-a', line: 'bg-team-a' },
                  B: { name: 'text-team-b', line: 'bg-team-b' }
                }}
                customStyles={{
                  modalBackground: '', // 딤 제거 (외부에서 처리)
                  modalContainer: 'bg-white rounded-2xl shadow-2xl',
                  questionText: 'text-5xl font-bold text-center text-gray-800 leading-tight',
                  headerText: 'text-2xl font-bold',
                  timerText: 'text-2xl font-bold text-cyan-500',
                }}
                showTimer={true}
                showTeamName={true}
                feedbackDuration={0}
                exitDelay={0}
                onTimerChange={onTimerChange}
                onTimeout={handleTimeout}
                disableFeedback={true}
              />
            </div>
          )}

          {/* 정오답 피드백 - 퀴즈 모달 위에 표시 */}
          {showFeedback && quizResult && !hideQuizModal && (
            <FeedbackToast
              key={`feedback-${quizResult.status}-${quizResult.isCorrect}`}
              status={quizResult.status}
              isFading={feedbackFading || quizModalExiting}
            />
          )}

           {/* 점수 결과 모달 - 퀴즈 모달이 숨겨진 후 표시 */}
           {showResultModal && quizResult && (
             <div className="flex items-center justify-center z-[220]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
               {console.log('QuizActivity - 결과 모달 렌더링 중', {
                 showResultModal,
                 quizResult,
                 resultModalFading,
                 frozenPreviousScores,
                 frozenNewScores
               })}
               <QuizResultModal
                 status={quizResult.status}
                 teamName={teamName}
                 points={quizResult.isCorrect ? points.correct : points.incorrect}
                 isFading={resultModalFading}
                 teamAScore={frozenNewScores.teamAScore}
                 teamBScore={frozenNewScores.teamBScore}
                 previousTeamAScore={frozenPreviousScores.teamAScore}
                 previousTeamBScore={frozenPreviousScores.teamBScore}
                 winningTeam={playingTeam === Team.A ? 'A' : 'B'}
               />
             </div>
           )}
        </div>
      ) : null}
      
      
    </>
  );
};

// 피드백 토스트 컴포넌트
const FeedbackToast: React.FC<{ 
  status: QuizResult['status'];
  isFading?: boolean;
}> = ({ status, isFading = false }) => {
  const getFeedbackConfig = () => {
    switch (status) {
      case 'success': return { text: 'Correct!', color: 'bg-blue-500' };
      case 'failed': return { text: 'Incorrect!', color: 'bg-red-500' };
      case 'times_up': return { text: "Time's up!", color: 'bg-amber-500' };
    }
  };

  const { text, color } = getFeedbackConfig();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div
        className={`px-12 py-6 rounded-full text-7xl font-black text-white ${color}`}
        style={{
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default QuizActivity;