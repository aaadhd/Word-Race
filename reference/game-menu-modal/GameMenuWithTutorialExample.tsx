import React, { useState } from 'react';
import GameMenuModal from './GameMenuModal';
import TutorialModal from './TutorialModal';

const GameMenuWithTutorialExample: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
    <div className="relative" style={{ width: 1280, height: 800 }}>
      <button onClick={openMenu}>Open Menu</button>
      {isPaused && <div>PAUSED</div>}

      <GameMenuModal
        isOpen={showMenu}
        onClose={closeMenu}
        onOpenGuide={openGuide}
        onEndGame={() => console.log('End Game')}
        onExit={() => console.log('Exit Game')}
      />

      <TutorialModal
        isOpen={showTutorial}
        onClose={closeGuide}
        variant="stage"
      />
    </div>
  );
};

export default GameMenuWithTutorialExample;

