import React from 'react';

interface QuizResultModalProps {
  status: 'success' | 'failed' | 'times_up';
  teamName: string;
  points: number;
  onContinue: () => void;
}

const QuizResultModal: React.FC<QuizResultModalProps> = ({ status, teamName, points, onContinue }) => {
  let title: string;
  let message: string;
  let titleColor: string;

  switch (status) {
    case 'success':
      title = 'Quiz Success!';
      message = `${teamName} gets a point! (+${points} point${points > 1 ? 's' : ''})`;
      titleColor = 'text-correct';
      break;
    case 'failed':
      title = 'Quiz Failed!';
      // According to App.tsx logic, a point is still awarded for a wrong answer.
      message = `Oops! Better luck next time! (+${points} point${points > 1 ? 's' : ''})`;
      titleColor = 'text-incorrect';
      break;
    case 'times_up':
      title = "Time's Up!";
      message = `Better luck next time! (+${points} point${points > 1 ? 's' : ''})`;
      titleColor = 'text-primary-text';
      break;
    default:
      title = '';
      message = '';
      titleColor = 'text-primary-text';
  }

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-lg transform transition-all animate-fade-in-up">
        <h2 className={`text-5xl font-display mb-4 ${titleColor}`}>{title}</h2>
        <p className="text-2xl text-secondary-text mb-8 min-h-[32px]">{message}</p>
        <button
          onClick={onContinue}
          className="px-12 py-4 text-3xl font-display text-white bg-correct rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Next Round
        </button>
      </div>
    </div>
  );
};

export default QuizResultModal;
