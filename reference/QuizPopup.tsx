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

// ===== Constants =====
const TEAM_COLORS = {
  A: {
    name: 'text-cyan-600',
    line: 'bg-cyan-600',
  },
  B: {
    name: 'text-purple-600',
    line: 'bg-purple-600',
  },
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

// ===== Component =====
interface QuizPopupProps {
    quiz: QuizData;
    team: 'A' | 'B';
    onAnswer: (isCorrect: boolean, selectedOptionText: string) => void;
    isPaused: boolean;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ quiz, team, onAnswer, isPaused }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const timerIntervalRef = useRef<number | null>(null);
    
    const [userAnswer, setUserAnswer] = useState<string | null>(null);

    const teamColors = TEAM_COLORS[team];
    
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
        setTimeout(() => onAnswer(isCorrect, selectedOptionText), 500); // Faster exit
    }, [onAnswer]);

    const handleTimeout = useCallback(() => {
        setIsLocked(true);
        showFeedbackToast('timeout');
        triggerExit(false, '');
    }, [triggerExit]);

    useEffect(() => {
        setTimeLeft(10);
        setFeedback(null);
        setIsLocked(false);
        setIsExiting(false);
        setUserAnswer(null);
        
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [quiz]);

    useEffect(() => {
        if (isLocked || isPaused || isExiting) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return;
        }

        timerIntervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
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
        setTimeout(() => triggerExit(isCorrect, selectedOptionText), 1500); // Give time to see feedback
    };

    const renderStimulus = (stimulus: QuizData['stimulus']) => {
        return (
            <div className={`flex-grow flex items-center justify-center mb-8`}>
                {stimulus?.imageUrl && <img src={stimulus.imageUrl} alt="Quiz Image" className={`max-h-48 rounded-lg mx-auto`} />}
                {stimulus?.sentence && <p className="text-5xl text-center" dangerouslySetInnerHTML={{ __html: stimulus.sentence.replace('___', '<span class="inline-block w-24 border-b-4 border-gray-400"></span>')}}></p>}
            </div>
        );
    };

    return (
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`w-[90%] max-w-6xl min-h-[80%] bg-white rounded-2xl shadow-2xl flex flex-col p-10 relative transition-transform duration-500 ${isExiting ? 'scale-90' : 'scale-100'} animate-pop-in ${isLocked ? 'quiz-locked' : ''}`}>
                <div className="absolute top-6 right-10 flex items-center gap-2 text-3xl font-bold text-amber-500">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                     <span className="w-12 text-left">{timeLeft}</span>
                </div>

                <div className={`text-3xl font-bold text-center mb-4 ${teamColors.name}`} style={{ fontFamily: "'Fredoka One', cursive" }}>
                    Team {team}'s Quiz!
                </div>

                <h2 className="text-5xl font-bold text-center text-gray-800 mb-4">{quiz.questionText}</h2>
                
                {renderStimulus(quiz.stimulus)}

                <div className="grid grid-cols-2 gap-4">
                    {quiz.options.map(opt => (
                        <button 
                            key={opt.text} 
                            className={`quiz-btn ${isLocked ? (opt.isCorrect ? 'correct-answer' : (userAnswer === opt.text ? 'incorrect-answer' : '')) : ''}`} 
                            onClick={() => handleAnswerClick(opt.isCorrect, opt.text)}
                            disabled={isLocked}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
                
                {feedback && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
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
