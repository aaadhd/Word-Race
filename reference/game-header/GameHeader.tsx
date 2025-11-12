import React from 'react';

interface GameHeaderProps {
  title: string;
  currentRound?: number;
  onPause?: () => void;
  showPause?: boolean;
  isPaused?: boolean;
  onOpenMenu?: () => void;
  showMenuButton?: boolean;
  onExit?: () => void;
  showExitButton?: boolean;
  buttonsDisabled?: boolean;
  showTimer?: boolean;
  timerValue?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  currentRound,
  onPause,
  showPause = false,
  isPaused = false,
  onOpenMenu,
  showMenuButton = false,
  onExit,
  showExitButton = false,
  buttonsDisabled = false,
  showTimer = false,
  timerValue = 0,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <header className="w-full p-3 bg-yellow-400 shadow-md flex justify-between items-center z-50 h-[70px]">
      {/* Left: Title */}
      <div className="w-1/3">
        <h1
          className="text-4xl font-bold text-white"
          style={{
            fontFamily: "'Luckiest Guy', cursive",
            WebkitTextStroke: '2px #ca8a04',
            paintOrder: 'stroke fill',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Center: Round Info or Timer */}
      <div className="w-1/3 flex justify-center items-center">
        {showTimer ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-inner border-2 border-yellow-500 flex items-center gap-2 h-[48px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#ca8a04"
                d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16m0 2a10 10 0 1 1 0-20a10 10 0 0 1 0 20M12.5 7v5.5l4.5 2.5l-.75 1.23l-5.25-3.1V7z"
              />
            </svg>
            <h2
              className="text-3xl font-bold text-yellow-800"
              style={{
                fontFamily:
                  'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
              }}
            >
              {formatTime(timerValue)}
            </h2>
          </div>
        ) : currentRound ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-inner border-2 border-yellow-500 flex items-center justify-center h-[48px] px-8">
            <h2
              className="text-2xl font-bold text-yellow-800"
              style={{
                fontFamily:
                  'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
              }}
            >
              Round {currentRound}
            </h2>
          </div>
        ) : null}
      </div>

      {/* Right: Buttons */}
      <div className="w-1/3 flex justify-end items-center gap-4">
        {showPause && onPause && (
          <button
            onClick={onPause}
            disabled={buttonsDisabled}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Pause Game"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
              />
            </svg>
          </button>
        )}
        {showMenuButton && onOpenMenu && (
          <button
            onClick={onOpenMenu}
            disabled={buttonsDisabled}
            className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Open Game Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"
              />
            </svg>
          </button>
        )}
        {showExitButton && onExit && (
          <button
            onClick={onExit}
            className="w-14 h-14 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
            aria-label="Exit Activity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default GameHeader;

