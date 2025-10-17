import React, { useState } from 'react';
import GameSettingsModal from './GameSettingsModal';
import {
  GameSettings,
  GameSettingsModalProps,
  GAME_CUSTOMIZATIONS,
  DEFAULT_GAME_SETTINGS
} from './game-settings-types';

// 기본 사용 예제
export const BasicGameSettingsExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  const handleStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowSettings(false);
    console.log('Game started with settings:', settings);
    // 여기서 실제 게임을 시작하는 로직을 구현
  };

  const handleBack = () => {
    setShowSettings(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Game Settings Example</h1>
      
      <button
        onClick={() => setShowSettings(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
      >
        Open Game Settings
      </button>

      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={handleBack}
        />
      )}

      {/* 현재 설정 표시 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Current Settings:</h3>
        <pre className="text-sm">{JSON.stringify(gameSettings, null, 2)}</pre>
      </div>
    </div>
  );
};

// Stop & Go 게임 커스터마이징 예제
export const StopAndGoGameExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  const handleStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowSettings(false);
    console.log('Stop & Go game started with settings:', settings);
  };

  const handleBack = () => {
    setShowSettings(false);
  };

  const stopAndGoConfig = GAME_CUSTOMIZATIONS.stopAndGo;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stop & Go Game Example</h1>
      
      <button
        onClick={() => setShowSettings(true)}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
      >
        Open Stop & Go Settings
      </button>

      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={handleBack}
          gameTitle={stopAndGoConfig.gameTitle}
          gameImage={stopAndGoConfig.gameImage}
          gameGuideText={stopAndGoConfig.gameGuideText}
          availableLessons={stopAndGoConfig.availableLessons}
          availableLearningFocus={stopAndGoConfig.availableLearningFocus}
          disabledLessons={stopAndGoConfig.disabledLessons}
          maxRounds={stopAndGoConfig.maxRounds}
          maxTime={stopAndGoConfig.maxTime}
          customStyles={stopAndGoConfig.customStyles}
        />
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Stop & Go Settings:</h3>
        <pre className="text-sm">{JSON.stringify(gameSettings, null, 2)}</pre>
      </div>
    </div>
  );
};

// 수학 퀴즈 게임 커스터마이징 예제
export const MathQuizGameExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  const handleStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowSettings(false);
    console.log('Math Quiz game started with settings:', settings);
  };

  const handleBack = () => {
    setShowSettings(false);
  };

  const mathQuizConfig = GAME_CUSTOMIZATIONS.mathQuiz;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Math Quiz Game Example</h1>
      
      <button
        onClick={() => setShowSettings(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
      >
        Open Math Quiz Settings
      </button>

      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={handleBack}
          gameTitle={mathQuizConfig.gameTitle}
          gameImage={mathQuizConfig.gameImage}
          gameGuideText={mathQuizConfig.gameGuideText}
          availableLessons={mathQuizConfig.availableLessons}
          availableLearningFocus={mathQuizConfig.availableLearningFocus}
          disabledLessons={mathQuizConfig.disabledLessons}
          maxRounds={mathQuizConfig.maxRounds}
          maxTime={mathQuizConfig.maxTime}
          customStyles={mathQuizConfig.customStyles}
        />
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Math Quiz Settings:</h3>
        <pre className="text-sm">{JSON.stringify(gameSettings, null, 2)}</pre>
      </div>
    </div>
  );
};

// 완전 커스터마이징 예제
export const CustomGameExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  const handleStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowSettings(false);
    console.log('Custom game started with settings:', settings);
  };

  const handleBack = () => {
    setShowSettings(false);
  };

  // 완전히 커스터마이징된 설정
  const customConfig: Partial<GameSettingsModalProps> = {
    gameTitle: 'Science Quiz',
    gameImage: '/science-quiz.png',
    gameGuideText: 'Science Guide',
    availableLessons: [1, 2, 3, 4, 5, 6],
    availableLearningFocus: ['Biology', 'Chemistry', 'Physics', 'Earth Science'],
    disabledLessons: [6], // 6번 레슨 비활성화
    maxRounds: 20,
    maxTime: 90,
    customStyles: {
      primaryColor: 'indigo',
      secondaryColor: 'yellow',
      backgroundColor: 'indigo-50',
      buttonColor: 'yellow-500'
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Game Example</h1>
      
      <button
        onClick={() => setShowSettings(true)}
        className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600"
      >
        Open Custom Game Settings
      </button>

      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={handleBack}
          {...customConfig}
        />
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Custom Game Settings:</h3>
        <pre className="text-sm">{JSON.stringify(gameSettings, null, 2)}</pre>
      </div>
    </div>
  );
};

// 게임 통합 예제 - 실제 게임 플로우
export const GameIntegrationExample: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'settings' | 'playing' | 'gameOver'>('menu');
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setGameState('playing');
    console.log('Starting game with settings:', settings);
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const handleOpenSettings = () => {
    setGameState('settings');
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {gameState === 'menu' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Game Menu</h1>
          <button
            onClick={handleOpenSettings}
            className="bg-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 mr-4"
          >
            Start Game
          </button>
          <button className="bg-gray-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-600">
            Exit
          </button>
        </div>
      )}

      {gameState === 'settings' && (
        <GameSettingsModal
          onStart={handleStartGame}
          onBack={handleBackToMenu}
          {...GAME_CUSTOMIZATIONS.stopAndGo}
        />
      )}

      {gameState === 'playing' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Playing Game...</h1>
          <p className="text-lg mb-4">Game settings applied:</p>
          <pre className="text-sm bg-white p-4 rounded-lg mb-4 text-left">
            {JSON.stringify(gameSettings, null, 2)}
          </pre>
          <button
            onClick={handleGameOver}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            End Game
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Game Over!</h1>
          <p className="text-lg mb-4">Thanks for playing!</p>
          <button
            onClick={handleBackToMenu}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};
