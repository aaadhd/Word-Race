import React from 'react';

interface QuizResultModalProps {
  status: 'success' | 'failed' | 'times_up';
  teamName: string;
  points: number;
  isFading?: boolean;
}

const QuizResultModal: React.FC<QuizResultModalProps> = ({ status, teamName, points, isFading = false }) => {
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
    <div className={`bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-lg transform transition-all animate-fade-in-up smooth-transition ${isFading ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <h2 className={`text-5xl font-display mb-4 ${titleColor}`}>{title}</h2>
      <p className="text-2xl text-secondary-text mb-8 min-h-[32px]">{message}</p>
    </div>
  );
};

export default QuizResultModal;
