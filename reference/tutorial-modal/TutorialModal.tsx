import React, { useState, useEffect } from 'react';

interface TutorialStep {
  image: string;
  title: string;
  description: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    image: '/tutorial/1.jpg',
    title: 'Team Up!',
    description:
      "It's Team A vs Team B! Both teams try to win in each round!",
  },
  {
    image: '/tutorial/2.jpg',
    title: 'Two Ways to Play!',
    description:
      'There are two ways to play: Trace Mode and Draw Mode. Let me show you both!',
  },
  {
    image: '/tutorial/3.jpg',
    title: 'Trace Mode',
    description:
      'Follow the dotted lines with your finger. Write the word nicely on the lines!',
  },
  {
    image: '/tutorial/4.jpg',
    title: 'Draw Mode',
    description:
      'Look at the picture. Think of the word and write it by yourself!',
  },
  {
    image: '/tutorial/5.jpg',
    title: 'Do Your Best!',
    description:
      'Write well to win! Try your best!',
  },
  {
    image: '/tutorial/6.jpg',
    title: 'Answer the Quiz!',
    description:
      'The winning team gets a quiz! Answer it right to get more points!',
  },
  {
    image: '/tutorial/7.jpg',
    title: 'Get Points & Win!',
    description:
      'Play all the rounds and answer the quiz. The team with more points wins!',
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * 'global'  - viewport 전체를 덮는 레이어 (예: 세팅 화면)
   * 'stage'   - 1280×800 등 고정 스테이지 내부에만 표시할 때 사용
   */
  variant?: 'global' | 'stage';
}

const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  variant = 'global',
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const step: TutorialStep = TUTORIAL_STEPS[currentStep];
  const totalSteps = TUTORIAL_STEPS.length;
  const stepNumber = currentStep + 1;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const wrapperPositionClass =
    variant === 'stage' ? 'absolute inset-0' : 'fixed inset-0';

  return (
    <div
      className={`${wrapperPositionClass} bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4`}
    >
      <button
        onClick={onClose}
        className="absolute focus:outline-none"
        style={{ top: '20px', right: '48px', width: '40px', height: '40px' }}
        aria-label="Close tutorial"
      >
        <img src="/button/close.png" alt="Close" className="w-full h-full" />
      </button>

      <div
        className="mx-auto flex flex-col rounded-[32px] border border-white/40 bg-gradient-to-br from-white via-white to-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.35)] transform transition-all duration-300 animate-modal-enter overflow-hidden font-[Pretendard]"
        style={{ width: '1000px', minHeight: '640px', padding: '28px 32px 32px 32px' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-32 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-start gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-slate-900">How to Play</h1>
            <p className="sr-only">Step {stepNumber} of {totalSteps}</p>
            <p className="sr-only">팀 버거 챌린지를 빠르게 익혀보세요!</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center flex-1 mt-2">
          <div className="relative w-full flex-1 mt-3">
            <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-[0_25px_45px_rgba(59,130,246,0.18)] px-8 py-8">
              <img
                src={step.image}
                alt={step.title}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <h2 className="mt-[14px] text-[46px] font-bold text-slate-800">{step.title}</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            {step.description}
          </p>
        </div>

        <div className="relative z-10 mt-auto flex items-center gap-8 border-t border-white/60 pt-6">
          <div className="flex flex-1 justify-start">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`rounded-full px-8 py-3 text-base font-semibold transition-all ${
                currentStep > 0
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              Back
            </button>
          </div>
          <div className="flex items-center justify-center gap-3">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  index === currentStep ? 'scale-110 bg-blue-500' : 'bg-slate-300/80'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex flex-1 justify-end">
            <button
              onClick={handleNext}
              className="rounded-full bg-yellow-400 px-10 py-3 text-base font-bold text-amber-900 hover:bg-yellow-500 focus:outline-none"
            >
              {isLastStep ? 'Close' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TutorialModal;

