import React, { useState, useEffect } from 'react';
import CountingNumber from './CountingNumber.tsx';
import Confetti from './Confetti.tsx';

interface QuizResultModalProps {
  status: 'success' | 'failed' | 'times_up';
  teamName: string;
  points: number;
  isFading?: boolean;
  teamAScore: number;
  teamBScore: number;
  previousTeamAScore: number;
  previousTeamBScore: number;
  winningTeam: 'A' | 'B';
}

const QuizResultModalComponent: React.FC<QuizResultModalProps> = ({
  status,
  teamName,
  points,
  isFading = false,
  teamAScore,
  teamBScore,
  previousTeamAScore,
  previousTeamBScore,
  winningTeam
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrateAnimation, setCelebrateAnimation] = useState('');

  useEffect(() => {
    if (status === 'success') {
      setShowConfetti(true);
      setCelebrateAnimation('celebrate-success 0.8s ease-out');
      setTimeout(() => {
        setShowConfetti(false);
        setCelebrateAnimation('');
      }, 4000);
    }
  }, [status]);

  console.log('🏆 QuizResultModal 렌더링:', {
    teamAScore,
    teamBScore,
    previousTeamAScore,
    previousTeamBScore,
    winningTeam,
    points,
    '카운팅 방향': {
      teamA: `${previousTeamAScore} → ${teamAScore}`,
      teamB: `${previousTeamBScore} → ${teamBScore}`
    }
  });

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
    <>
      {showConfetti && <Confetti trigger={showConfetti} type={status === 'success' ? 'success' : 'error'} />}
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-2xl transform smooth-transition`}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translate3d(0, -30px, 0) scale(0.9)' : 'translate3d(0, 0, 0) scale(1)',
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 1, 1), transform 0.4s cubic-bezier(0.4, 0, 1, 1)',
          animation: !isFading ? celebrateAnimation : 'none'
        }}
      >
      <h2 className={`text-5xl font-display mb-4 ${titleColor}`}>{title}</h2>
      <p className="text-2xl text-secondary-text mb-6 min-h-[32px]">{message}</p>

      {/* 팀 점수판 */}
      <div className="flex justify-center gap-8 mt-8">
        {/* Team A */}
        <div className={`flex flex-col items-center p-6 rounded-2xl border-4 min-w-[180px] ${
          winningTeam === 'A' ? 'border-team-a bg-team-a/10 scale-105' : 'border-gray-300 bg-gray-50'
        } transition-all duration-300`}>
          <h3 className="text-2xl font-display text-team-a mb-2">Team A</h3>
          <div className="text-6xl font-display text-team-a tabular-nums">
            <CountingNumber
              key={`teamA-${previousTeamAScore}-${teamAScore}`}
              from={previousTeamAScore}
              to={teamAScore}
              duration={800}
              playSound={true}
            />
          </div>
          {winningTeam === 'A' && (
            <div className="mt-2 text-lg font-display text-green-600 animate-bounce">
              +{points} pts!
            </div>
          )}
        </div>

        {/* Team B */}
        <div className={`flex flex-col items-center p-6 rounded-2xl border-4 min-w-[180px] ${
          winningTeam === 'B' ? 'border-team-b bg-team-b/10 scale-105' : 'border-gray-300 bg-gray-50'
        } transition-all duration-300`}>
          <h3 className="text-2xl font-display text-team-b mb-2">Team B</h3>
          <div className="text-6xl font-display text-team-b tabular-nums">
            <CountingNumber
              key={`teamB-${previousTeamBScore}-${teamBScore}`}
              from={previousTeamBScore}
              to={teamBScore}
              duration={800}
              playSound={true}
            />
          </div>
          {winningTeam === 'B' && (
            <div className="mt-2 text-lg font-display text-green-600 animate-bounce">
              +{points} pts!
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
const QuizResultModal = React.memo(QuizResultModalComponent);

export default QuizResultModal;
