import React, { useState, useEffect } from 'react';
import type { QuizAttempt, QuizData } from '../../types';
import { playSound } from '../../services/soundService';

interface QuizReviewModalProps {
  history: QuizAttempt[];
  onClose: () => void;
}

const QuizReviewModal: React.FC<QuizReviewModalProps> = ({ history, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
    const attempt = history[currentIndex];

    // Reset state when question changes
    useEffect(() => {
        setUserAnswer(null);
        setIsLocked(false);
        setFeedback(null);
    }, [currentIndex]);

    if (!attempt) return null;

    const { quiz } = attempt;

    const handleNext = () => {
        playSound('click');
        setCurrentIndex(prev => Math.min(prev + 1, history.length - 1));
    };

    const handlePrev = () => {
        playSound('click');
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const handleAnswerClick = (option: typeof quiz.options[0]) => {
        if (isLocked) return;
        setUserAnswer(option.text);
        setIsLocked(true);
        
        const isCorrect = option.isCorrect;
        playSound(isCorrect ? 'correct' : 'incorrect');

        setFeedback({
            text: isCorrect ? 'Correct!' : 'Incorrect!',
            color: isCorrect ? '#3B82F6' : '#EF4444'
        });

        setTimeout(() => setFeedback(null), 1500);
    };

    const renderStimulus = (stimulus: QuizData['stimulus']) => {
        return (
            <div className={`flex-grow flex items-center justify-center mb-8`}>
                {stimulus?.imageUrl && <img src={stimulus.imageUrl} alt="Quiz stimulus" className={`max-h-48 rounded-lg mx-auto`} />}
                {stimulus?.sentence && <p className="text-5xl text-center" dangerouslySetInnerHTML={{ __html: stimulus.sentence.replace('___', '<span class="inline-block w-24 border-b-4 border-gray-400"></span>')}}></p>}
            </div>
        );
    };

    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center z-[60] animate-pop-in" onClick={onClose}>
            <style>{`
                @keyframes pop-in-large {
                    0% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    70% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-pop-in-large {
                    animation: pop-in-large 0.5s ease-out forwards;
                }
            `}</style>
            <div className="flex items-center justify-center w-full max-w-[95%]">
                {/* Prev Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={currentIndex === 0}
                    className="bg-white/80 hover:bg-white text-gray-800 rounded-full w-16 h-16 flex items-center justify-center text-4xl transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg mr-4 flex-shrink-0"
                    aria-label="Previous question"
                >
                    &lt;
                </button>
                
                {/* Main Modal Content */}
                <div 
                    className={`w-[90%] max-w-6xl h-[640px] bg-white rounded-2xl shadow-2xl flex flex-col p-10 relative border-8 ${isLocked ? 'quiz-locked' : ''}`} 
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center mb-4">
                        <h2 className="text-3xl font-bold text-gray-700" style={{ fontFamily: "'Fredoka One', cursive" }}>Quiz Review</h2>
                    </div>
                    
                    <div className="flex flex-col flex-grow justify-center">
                        <h2 className="text-5xl font-bold text-center text-gray-800 mb-4">{quiz.questionText}</h2>
                        
                        {renderStimulus(quiz.stimulus)}

                        <div className="grid grid-cols-2 gap-4">
                            {quiz.options.map(opt => (
                                <button 
                                    key={opt.text} 
                                    className={`quiz-btn ${isLocked ? (opt.isCorrect ? 'correct-answer' : (userAnswer === opt.text ? 'incorrect-answer' : '')) : ''}`} 
                                    onClick={() => handleAnswerClick(opt)}
                                    disabled={isLocked}
                                >
                                    {opt.text}
                                </button>
                             ))}
                        </div>
                    </div>
                    <button className="absolute top-2 right-2 text-white text-2xl" onClick={onClose}>✖️</button>
                    
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

                {/* Next Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    disabled={currentIndex === history.length - 1}
                    className="bg-white/80 hover:bg-white text-gray-800 rounded-full w-16 h-16 flex items-center justify-center text-4xl transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg ml-4 flex-shrink-0"
                    aria-label="Next question"
                >
                    &gt;
                </button>
            </div>
            <div className="text-center flex-shrink-0 mt-2 mb-2">
                <p className="text-2xl text-white font-bold" style={{fontFamily: "'Fredoka One', cursive"}}>{currentIndex + 1} / {history.length}</p>
            </div>
        </div>
    );
};

export default QuizReviewModal;