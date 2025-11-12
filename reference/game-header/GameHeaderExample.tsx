import React, { useState } from 'react';
import GameHeader from './GameHeader';
import GameMenuModal from '../game-menu-modal/GameMenuModal';
import TutorialModal from '../tutorial-modal/TutorialModal';

const GameHeaderExample: React.FC = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handlePause = () => {
    setIsPaused(prev => !prev);
  };

  const openMenu = () => {
    setShowMenu(true);
    setIsPaused(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setIsPaused(false);
  };

  const openGuide = () => {
    setShowMenu(false);
    setShowTutorial(true);
  };

  const closeGuide = () => {
    setShowTutorial(false);
    setIsPaused(false);
    setShowMenu(false);
  };

  return (
    <div
      className="relative bg-slate-100"
      style={{ width: 1280, height: 800, overflow: 'hidden' }}
    >
      <GameHeader
        title="Word Race"
        currentRound={currentRound}
        showPause
        onPause={handlePause}
        showMenuButton
        onOpenMenu={openMenu}
        showExitButton
        onExit={() => console.log('Exit pressed')}
        buttonsDisabled={showMenu}
      />

      <div className="p-8">
        <p className="text-lg font-semibold">
          헤더 아래에 게임 화면이 들어갑니다. (예시 영역)
        </p>
        <button
          className="mt-6 px-6 py-3 rounded-full bg-yellow-400 font-bold text-white shadow"
          onClick={() => setCurrentRound(r => r + 1)}
        >
          Next Round
        </button>
      </div>

      <GameMenuModal
        isOpen={showMenu}
        onClose={closeMenu}
        onOpenGuide={openGuide}
        onEndGame={() => console.log('End Game')}
        onExit={() => console.log('Exit')}
      />

      <TutorialModal
        isOpen={showTutorial}
        onClose={closeGuide}
        variant="stage"
      />
    </div>
  );
};

export default GameHeaderExample;

