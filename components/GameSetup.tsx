import React, { useState } from 'react';
import GameSettingsModal from './GameSettingsModal';
import { GameSettings, GAME_CUSTOMIZATIONS } from '../types/game-settings-types';
import { GameMode } from '../types.ts';

interface GameSetupProps {
  onStart: (rounds: number, mode: GameMode, includeQuiz: boolean) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const handleStart = (settings: GameSettings) => {
    // GameSettings의 playType을 GameMode로 변환하고 quizIncluded 전달
    const mode = settings.playType === 'trace' ? GameMode.TRACE : GameMode.DRAW;
    console.log('GameSetup - Starting game with settings:', {
      playType: settings.playType,
      gameMode: mode,
      rounds: settings.rounds,
      quizIncluded: settings.quizIncluded
    });
    onStart(settings.rounds, mode, settings.quizIncluded);
  };

  const handleBack = () => {
    // 뒤로가기 기능 (필요시 구현)
  };

  return (
    <GameSettingsModal
      onStart={handleStart}
      onBack={handleBack}
      {...GAME_CUSTOMIZATIONS.wordRace}
    />
  );
};

export default GameSetup;
