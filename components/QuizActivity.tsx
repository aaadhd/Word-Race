import React, { useState, useEffect, useRef } from 'react';
import type { Quiz } from '../types.ts';
import { Team } from '../types.ts';
import QuizResultModal from './QuizResultModal.tsx';

interface QuizActivityProps {
  quiz: Quiz;
  playingTeam: Team;
  onComplete: (isCorrect: boolean) => void;
  isBonusRound: boolean;
}

const QUIZ_TIME_SECONDS = 15;

const QuizActivity: React.FC<QuizActivityProps> = ({ quiz, playingTeam, onComplete, isBonusRound }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ status: 'success' | 'failed' | 'times_up', isCorrect: boolean } | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);

  const teamName = playingTeam === Team.A ? 'Blue Team' : 'Red Team';
  const timerRef = useRef<number | null>(null);
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setModalInfo({ status: 'times_up', isCorrect: false });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, []);

  const handleAnswer = (option: string) => {
    if (answered) return;

    stopTimer();
    setAnswered(true);
    setSelectedAnswer(option);
    const isCorrect = option === quiz.correctAnswer;
    
    setTimeout(() => {
      setModalInfo({
        status: isCorrect ? 'success' : 'failed',
        isCorrect: isCorrect,
      });
    }, 1200); // Allow time to see the button color change
  };

  const handleContinue = () => {
    if (modalInfo) {
      onComplete(modalInfo.isCorrect);
    }
  };

  const getButtonClass = (option: string) => {
    if (!answered) {
      if (playingTeam === Team.A) {
        return 'bg-slate-200 text-primary-text hover:bg-team-a hover:text-white';
      }
      return 'bg-slate-200 text-primary-text hover:bg-team-b hover:text-white';
    }
    if (option === quiz.correctAnswer) {
      return 'bg-correct text-white scale-105';
    }
    if (option === selectedAnswer && option !== quiz.correctAnswer) {
      return 'bg-incorrect text-white';
    }
    return 'bg-slate-300/70 text-primary-text opacity-70';
  };

  const points = isBonusRound ? { correct: 4, incorrect: 2 } : { correct: 2, incorrect: 1 };
  
  const timerColorClass = timeLeft > 10 ? 'text-green-500' : timeLeft > 5 ? 'text-yellow-500' : 'text-red-500 animate-pulse';


  return (
    <div className="flex flex-col items-center justify-center h-full pt-16 animate-fade-in">
      <div className={`absolute top-28 text-6xl font-display transition-colors ${timerColorClass}`}>
        {timeLeft}
      </div>

      <h2 className={`text-4xl font-display mb-4 ${playingTeam === Team.A ? 'text-team-a' : 'text-team-b'}`}>{teamName}'s turn!</h2>
      <div className="w-full max-w-4xl p-8 bg-sky-100/50 rounded-2xl text-center">
        <p className="text-5xl font-bold leading-tight">{quiz.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10 w-full max-w-5xl">
        {quiz.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={`p-6 text-4xl font-display rounded-2xl shadow-lg transition-all transform disabled:cursor-not-allowed ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {modalInfo && (
        <QuizResultModal 
          status={modalInfo.status}
          teamName={teamName}
          points={modalInfo.isCorrect ? points.correct : points.incorrect}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default QuizActivity;