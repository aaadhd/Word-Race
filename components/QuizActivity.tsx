import React, { useState, useEffect } from 'react';
import type { Quiz } from '../types.ts';
import { Team } from '../types.ts';
import QuizPopup, { QuizData } from './QuizPopup.tsx';
import QuizResultModal from './QuizResultModal.tsx';

interface QuizActivityProps {
  quiz: Quiz;
  playingTeam: Team;
  onComplete: (isCorrect: boolean) => void;
  isBonusRound: boolean;
  onTimerChange?: (timeLeft: number) => void;
}

const QUIZ_TIME_SECONDS = 15;
const FEEDBACK_DISPLAY_TIME = 1000; // 1초
const RESULT_DISPLAY_TIME = 1200; // 1.2초 (20% 증가)

type QuizResult = {
  isCorrect: boolean;
  status: 'success' | 'failed' | 'times_up';
};

const QuizActivity: React.FC<QuizActivityProps> = ({ quiz, playingTeam, onComplete, isBonusRound, onTimerChange }) => {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [hideQuizModal, setHideQuizModal] = useState(false);
  const [feedbackFading, setFeedbackFading] = useState(false);
  const [resultFading, setResultFading] = useState(false);
  const [quizModalExiting, setQuizModalExiting] = useState(false);
  const [resultModalEntering, setResultModalEntering] = useState(false);

  const teamName = playingTeam === Team.A ? 'Team A' : 'Team B';
  const points = isBonusRound ? { correct: 4, incorrect: 2 } : { correct: 2, incorrect: 1 };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    const status = isCorrect ? 'success' : 'failed';
    setQuizResult({ isCorrect, status });
    setShowFeedback(true);
  };

  const handleTimeout = () => {
    setQuizResult({ isCorrect: false, status: 'times_up' });
    setShowFeedback(true);
  };

  // 1-2단계: 피드백 표시 및 종료
  useEffect(() => {
    if (!showFeedback || !quizResult) return;

    console.log('QuizActivity - 피드백 시퀀스 시작', { showFeedback, quizResult });

    // 1단계: 피드백 페이드아웃 (800ms 후)
    const fadeOutTimer = setTimeout(() => {
      setFeedbackFading(true);
    }, FEEDBACK_DISPLAY_TIME - 200);

    // 2단계: 피드백 종료, 퀴즈 모달 페이드아웃 시작 (1초 후)
    const feedbackTimer = setTimeout(() => {
      console.log('QuizActivity - 피드백 종료, 퀴즈 모달 페이드아웃 시작');
      setShowFeedback(false);
      setFeedbackFading(false);
      setQuizModalExiting(true);
      
      // 3단계 준비: 퀴즈 모달 닫기 (300ms 후)
      setTimeout(() => {
        console.log('QuizActivity - 퀴즈 모달 닫기, 결과 모달 표시');
        setHideQuizModal(true);
      }, 300);
    }, FEEDBACK_DISPLAY_TIME);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(feedbackTimer);
    };
  }, [showFeedback, quizResult]);

  // 3단계: 퀴즈 모달이 닫힌 후 결과 모달 표시
  useEffect(() => {
    if (!hideQuizModal || !quizResult) return;

    console.log('QuizActivity - 3단계: 결과 모달 표시');
    
    setQuizModalExiting(false);
    setShowResultModal(true);
    setResultModalEntering(true);
    
    // 결과 모달 애니메이션 완료
    setTimeout(() => {
      setResultModalEntering(false);
    }, 300);
  }, [hideQuizModal, quizResult]);

  // 4단계: 결과 모달 표시 후 1초 뒤 다음 라운드로 진행
  useEffect(() => {
    if (!showResultModal || !quizResult) return;

    console.log('QuizActivity - 4단계: 결과 모달 자동 진행 타이머 시작', { showResultModal, quizResult });

    // 결과 모달 페이드아웃 시작 (800ms 후)
    const fadeOutTimer = setTimeout(() => {
      console.log('QuizActivity - 4단계: 결과 모달 페이드아웃 시작');
      setResultFading(true);
    }, RESULT_DISPLAY_TIME - 200);

    // 결과 모달 완전 종료 및 다음 라운드 진행 (1초 후)
    const resultTimer = setTimeout(() => {
      console.log('QuizActivity - 4단계: 결과 모달 종료, 다음 라운드 진행');
      setShowResultModal(false);
      setResultFading(false);
      onComplete(quizResult.isCorrect);
    }, RESULT_DISPLAY_TIME);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(resultTimer);
    };
  }, [showResultModal, quizResult, onComplete]);

  // 기존 Quiz 타입을 QuizData 타입으로 변환
  const quizData: QuizData = {
    quizId: `quiz-${Date.now()}`,
    quizType: 'multipleChoice',
    questionText: quiz.question,
    options: quiz.options.map(option => ({
      text: option,
      isCorrect: option === quiz.correctAnswer
    }))
  };

  return (
    <>
      {/* 퀴즈와 결과 모달 (딤 레이어는 App.tsx에서 처리) */}
      {(quizResult || !hideQuizModal || showResultModal) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          {/* 퀴즈 모달 - 숨김 상태가 아닐 때 표시 */}
          {!hideQuizModal && (
            <div className={`${quizModalExiting ? 'animate-slide-out' : ''}`}>
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
              />
            </div>
          )}

           {/* 점수 결과 모달 - 퀴즈 모달이 숨겨진 후 표시 */}
           {showResultModal && quizResult && (
             <div className={`${resultModalEntering ? 'animate-slide-in' : ''}`}>
               {console.log('QuizActivity - 결과 모달 렌더링 중', { showResultModal, quizResult, resultModalEntering })}
               <QuizResultModal
                 status={quizResult.status}
                 teamName={teamName}
                 points={quizResult.isCorrect ? points.correct : points.incorrect}
                 isFading={resultFading}
               />
             </div>
           )}
        </div>
      )}
      
      {/* 정오답 피드백 */}
      {showFeedback && quizResult && (
        <FeedbackToast 
          status={quizResult.status} 
          isFading={feedbackFading}
        />
      )}
      
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
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[80]">
      <div 
        className={`px-12 py-6 rounded-full text-7xl font-black text-white ${color} ${isFading ? 'animate-feedback-fadeout' : 'animate-feedback-pop'}`}
        style={{
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
          animationFillMode: isFading ? 'forwards' : 'none'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default QuizActivity;