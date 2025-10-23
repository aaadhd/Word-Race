import React, { useState, useEffect, useRef, useCallback } from 'react';

// ===== Types =====
export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizStimulus {
  imageUrl?: string;
  sentence?: string;
}

export interface QuizData {
  quizId: string;
  quizType: 'multipleChoice';
  questionText: string;
  options: QuizOption[];
  stimulus?: QuizStimulus;
}

// ===== Reusable Quiz Popup Component =====
interface QuizPopupProps {
  quiz: QuizData;
  team: 'A' | 'B';
  onAnswer: (isCorrect: boolean, selectedOptionText: string) => void;
  isPaused: boolean;
  // Customization props
  timeLimit?: number; // Default: 10 seconds
  teamColors?: {
    A: { name: string; line: string };
    B: { name: string; line: string };
  };
  customStyles?: {
    modalBackground?: string; // Default: 'bg-black/60'
    modalContainer?: string; // Default: 'bg-white rounded-2xl shadow-2xl'
    questionText?: string; // Default: 'text-5xl font-bold text-center text-gray-800'
    optionButton?: string; // Default button styles
    headerText?: string; // Default: 'text-2xl font-bold'
    timerText?: string; // Default: 'text-2xl font-bold text-cyan-500'
  };
  showTimer?: boolean; // Default: true
  showTeamName?: boolean; // Default: true
  feedbackDuration?: number; // Default: 1500ms
  exitDelay?: number; // Default: 500ms
  onTimerChange?: (timeLeft: number) => void; // 타이머 변경 콜백
  onTimeout?: () => void; // 시간 초과 콜백
}

// ===== Default Constants =====
const DEFAULT_TEAM_COLORS = {
  A: {
    name: 'text-cyan-600',
    line: 'bg-cyan-600',
  },
  B: {
    name: 'text-purple-600',
    line: 'bg-purple-600',
  },
};

const DEFAULT_CUSTOM_STYLES = {
  modalBackground: 'bg-black/60 backdrop-blur-sm',
  modalContainer: 'bg-white rounded-2xl shadow-2xl',
  questionText: 'text-5xl font-bold text-center text-gray-800 leading-tight',
  headerText: 'text-2xl font-bold',
  timerText: 'text-2xl font-bold text-cyan-500',
};

// ===== Sound Service =====
const soundCache: Record<string, HTMLAudioElement> = {};

const loadSound = (name: string, url: string) => {
  if (!soundCache[name]) {
    soundCache[name] = new Audio(url);
    soundCache[name].preload = 'auto';
  }
};

const playSound = (name: string) => {
  if (soundCache[name]) {
    soundCache[name].currentTime = 0;
    soundCache[name].play().catch(err => console.warn('Sound play failed:', err));
  }
};

// Preload sounds
loadSound('correct', '/sound-effect/correct.mp3');
loadSound('incorrect', '/sound-effect/incorrect.mp3');

// ===== Main Component =====
const QuizPopup: React.FC<QuizPopupProps> = ({ 
  quiz, 
  team, 
  onAnswer, 
  isPaused,
  timeLimit = 10,
  teamColors = DEFAULT_TEAM_COLORS,
  customStyles = DEFAULT_CUSTOM_STYLES,
  showTimer = true,
  showTeamName = true,
  feedbackDuration = 1500,
  exitDelay = 500,
  onTimerChange,
  onTimeout
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const teamColor = teamColors[team];
  
  const showFeedbackToast = (status: 'correct' | 'incorrect' | 'timeout') => {
    let text: string, color: string;
    if (status === 'correct') {
      text = 'Correct!';
      color = '#3B82F6'; // Blue-500
      playSound('correct');
    } else if (status === 'incorrect') {
      text = 'Incorrect!';
      color = '#EF4444'; // Red
      playSound('incorrect');
    } else {
      text = "Time's up!";
      color = '#F59E0B'; // Amber
      playSound('incorrect');
    }
    setFeedback({ text, color });
  };

  const triggerExit = useCallback((isCorrect: boolean, selectedOptionText: string) => {
    setIsExiting(true);
    setTimeout(() => onAnswer(isCorrect, selectedOptionText), exitDelay);
  }, [onAnswer, exitDelay]);

  const handleTimeout = useCallback(() => {
    setIsLocked(true);
    showFeedbackToast('timeout');
    if (onTimeout) {
      onTimeout();
    }
    triggerExit(false, '');
  }, [triggerExit, onTimeout]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setFeedback(null);
    setIsLocked(false);
    setIsExiting(false);
    setUserAnswer(null);
    
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [quiz, timeLimit]);

  useEffect(() => {
    if (isLocked || isPaused || isExiting) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        if (onTimerChange) {
          onTimerChange(newTime);
        }
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          handleTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isLocked, isPaused, isExiting, handleTimeout]);
  
  const handleAnswerClick = (isCorrect: boolean, selectedOptionText: string) => {
    if(isLocked) return;
    setUserAnswer(selectedOptionText);
    setIsLocked(true);
    showFeedbackToast(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => triggerExit(isCorrect, selectedOptionText), feedbackDuration);
  };

  const renderStimulus = (stimulus: QuizData['stimulus']) => {
    if (!stimulus) return null;
    
    return (
      <div className="flex-grow flex items-center justify-center mb-8">
        {stimulus.imageUrl && (
          <img 
            src={stimulus.imageUrl} 
            alt="Quiz Image" 
            className="max-h-48 rounded-lg mx-auto" 
          />
        )}
        {stimulus.sentence && (
          <p 
            className="text-5xl text-center" 
            dangerouslySetInnerHTML={{ 
              __html: stimulus.sentence.replace(
                '___', 
                '<span class="inline-block w-24 border-b-4 border-gray-400"></span>'
              )
            }}
          />
        )}
      </div>
    );
  };

  const getOptionButtonClass = (opt: QuizOption) => {
    const baseClass = "px-6 py-4 text-xl font-semibold rounded-xl border-2 transition-colors duration-200 min-h-[60px] flex items-center justify-center";
    
    if (isLocked) {
      if (opt.isCorrect) {
        return `${baseClass} bg-green-100 border-green-500 text-green-700`;
      } else if (userAnswer === opt.text) {
        return `${baseClass} bg-red-100 border-red-500 text-red-700`;
      } else {
        return `${baseClass} bg-gray-50 border-gray-300 text-gray-600`;
      }
    } else {
      if (userAnswer === opt.text) {
        return `${baseClass} bg-blue-50 border-blue-500 text-blue-700`;
      } else {
        return `${baseClass} bg-white border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-gray-50`;
      }
    }
  };

  return (
    <div className={`${customStyles.modalBackground ? 'absolute inset-0' : 'contents'} ${customStyles.modalBackground} ${customStyles.modalBackground ? 'backdrop-blur-sm' : ''} flex justify-center items-center ${customStyles.modalBackground ? 'z-[60]' : ''} transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`w-[1120px] h-[640px] ${customStyles.modalContainer} flex flex-col p-10 relative transition-transform duration-500 ${isExiting ? 'scale-90' : 'scale-100'} animate-pop-in ${isLocked ? 'quiz-locked' : ''}`}>
        
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-8">
          {showTeamName && (
            <div className={`${customStyles.headerText} ${teamColor.name}`}>
              Team {team}'s Chance!
            </div>
          )}
          {showTimer && (
            <div className={`flex items-center gap-2 ${customStyles.timerText}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="w-8 text-left">{timeLeft}</span>
            </div>
          )}
        </div>

        {/* 문제 영역 - 넓게 잡아서 공간 효율적으로 사용 */}
        <div className="flex-1 flex flex-col justify-center mb-8">
          <h2 className={`${customStyles.questionText} mb-8`}>
            {quiz.questionText}
          </h2>
          
          {/* Stimulus 영역 */}
          {renderStimulus(quiz.stimulus)}
        </div>
        
        {/* 보기 영역 - 하단에 고정 */}
        <div className="mt-auto">
          <div className="grid grid-cols-2 gap-6 h-[120px]">
            {quiz.options.map(opt => (
              <button 
                key={opt.text} 
                className={getOptionButtonClass(opt)}
                onClick={() => handleAnswerClick(opt.isCorrect, opt.text)}
                disabled={isLocked}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
        
        {/* 피드백 토스트 */}
        {feedback && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[70]">
            <div
              style={{ backgroundColor: feedback.color }}
              className="px-12 py-6 rounded-full text-7xl font-black text-white animate-pop-in-large"
            >
              {feedback.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPopup;
