import React, { useState } from 'react';
import {
  GameSettings,
  GameSettingsModalProps,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_LESSONS,
  DEFAULT_LEARNING_FOCUS,
  createSettingsUpdater,
  validateGameSettings
} from './game-settings-types';

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  onStart,
  onBack,
  gameTitle = 'Game Settings',
  gameImage = '/stopandgo.png',
  gameGuideText = 'Game Guide',
  availableLessons = DEFAULT_LESSONS,
  availableLearningFocus = DEFAULT_LEARNING_FOCUS,
  maxRounds = 10,
  maxTime = 60,
  disabledLessons = [],
  customStyles = {}
}) => {
  const [settings, setSettings] = useState<GameSettings>({
    ...DEFAULT_GAME_SETTINGS,
    selectedLessons: availableLessons.length > 0 ? [availableLessons[0]] : [1],
    learningFocus: availableLearningFocus.length > 0 ? [availableLearningFocus[0]] : ['Vocabulary']
  });

  const {
    toggleLesson,
    toggleLearningFocus,
    updateRounds,
    updateTotalTime
  } = createSettingsUpdater();

  const handleLessonToggle = (lesson: number) => {
    setSettings(prev => toggleLesson(lesson, prev, disabledLessons));
  };

  const handleLearningFocusToggle = (focus: string) => {
    setSettings(prev => toggleLearningFocus(focus, prev));
  };

  const handleRoundsUpdate = (delta: number) => {
    setSettings(prev => updateRounds(delta, prev, maxRounds));
  };

  const handleTotalTimeUpdate = (delta: number) => {
    setSettings(prev => updateTotalTime(delta, prev, maxTime));
  };

  const handleStart = () => {
    const validation = validateGameSettings(settings);
    if (validation.isValid) {
      onStart(settings);
    } else {
      // 에러 처리 (alert 또는 toast 등)
      alert(validation.errors.join('\n'));
    }
  };

  // 커스텀 스타일 적용
  const getPrimaryColor = () => {
    const colorMap: { [key: string]: string } = {
      purple: 'purple',
      blue: 'blue',
      green: 'green',
      red: 'red',
      indigo: 'indigo'
    };
    return colorMap[customStyles.primaryColor || 'purple'];
  };

  const getSecondaryColor = () => {
    const colorMap: { [key: string]: string } = {
      cyan: 'cyan',
      green: 'green',
      blue: 'blue',
      red: 'red',
      yellow: 'yellow'
    };
    return colorMap[customStyles.secondaryColor || 'cyan'];
  };

  const primaryColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();
  const backgroundColor = customStyles.backgroundColor || 'purple-50';
  const buttonColor = customStyles.buttonColor || 'cyan-500';

  return (
    <div className={`absolute inset-0 bg-gradient-to-b from-${backgroundColor} to-${backgroundColor} flex flex-col z-50`}>
      {/* Header with Navigation Buttons - Fixed */}
      <div className={`flex justify-between items-center p-4 pl-6 pr-6 z-10`}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`w-10 h-10 bg-${primaryColor}-300 text-white rounded-full flex items-center justify-center hover:bg-${primaryColor}-400 transition-all shadow-sm`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Right Side Buttons */}
        <div className="flex gap-3">
          {/* Info Button */}
          <button className={`w-10 h-10 bg-${primaryColor}-300 text-white rounded-full flex items-center justify-center hover:bg-${primaryColor}-400 transition-all shadow-sm`}>
            <span className="text-sm font-bold">i</span>
          </button>
          
          {/* Close Button */}
          <button
            onClick={onBack}
            className={`w-10 h-10 bg-white text-${primaryColor}-600 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border border-${primaryColor}-200`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content Area - Scrollable */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`w-1/3 bg-gradient-to-b from-${backgroundColor} to-${backgroundColor} flex flex-col items-center justify-start`}>
          <div className="text-center mb-8 p-2 pl-6 pr-6">
            <div className="w-96 h-64 mb-6 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={gameImage}
                alt={gameTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <button className={`bg-${primaryColor}-200 text-${primaryColor}-800 px-6 py-3 rounded-full font-semibold`}>
              {gameGuideText}
            </button>
          </div>
        </div>

        {/* Right Panel - Scrollable */}
        <div className={`w-2/3 bg-gradient-to-b from-${backgroundColor} to-${backgroundColor} overflow-hidden flex flex-col`}>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-2 pr-6">
            <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Choose Range */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Choose Range</h3>
                <p className={`text-xs text-${primaryColor}-600`}>(Multiple selection allowed)</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {availableLessons.map(lesson => (
                  <button
                    key={lesson}
                    onClick={() => handleLessonToggle(lesson)}
                    disabled={disabledLessons.includes(lesson)}
                    className={`px-2 py-1 rounded-lg font-semibold text-base transition-all h-[54px] flex items-center justify-center ${
                      disabledLessons.includes(lesson)
                        ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                        : settings.selectedLessons.includes(lesson)
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                    }`}
                  >
                    Lesson {lesson}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Learning Focus */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Choose Learning Focus</h3>
                <p className={`text-xs text-${primaryColor}-600`}>(Multiple selection allowed)</p>
              </div>
              <div className="flex gap-3">
                {/* Learning Focus Options Grid - 2x3 */}
                <div className="grid grid-cols-3 grid-rows-2 gap-3 flex-1">
                  {availableLearningFocus.map(focus => (
                    <button
                      key={focus}
                      onClick={() => handleLearningFocusToggle(focus)}
                      className={`px-2 py-1 rounded-lg font-semibold text-base transition-all h-[54px] flex items-center justify-center ${
                      settings.learningFocus.includes(focus)
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
                
                {/* Vertical Divider */}
                <div className="flex items-center justify-center">
                  <div className={`w-px h-[112px] bg-${primaryColor}-200`}></div>
                </div>
                
                {/* Preview Button - Full Height */}
                <button className={`bg-white text-${primaryColor}-700 border border-${primaryColor}-300 px-3 py-1 rounded-lg font-semibold text-base hover:bg-${primaryColor}-50 h-[112px] flex flex-col items-center justify-center gap-2`}>
                  <div className="text-lg">🔍</div>
                  <div>Preview</div>
                </button>
              </div>
            </div>

            {/* Game Settings Grid - 2x2 Layout */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Game Mode */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Game Mode</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, gameMode: 'teams' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.gameMode === 'teams'
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                    }`}
                  >
                    <div className="text-center flex flex-col justify-center h-full">
                      <div className="font-bold text-base leading-tight">Teams</div>
                      <div className="text-xs opacity-75 leading-tight">(Smartboard)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, gameMode: 'solo' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.gameMode === 'solo'
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                    }`}
                  >
                    <div className="text-center flex flex-col justify-center h-full">
                      <div className="font-bold text-base leading-tight">Solo</div>
                      <div className="text-xs opacity-75 leading-tight">(Tablet)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Question Order */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Question Order</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, questionOrder: 'same' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.questionOrder === 'same'
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">Same for All</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, questionOrder: 'randomized' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.questionOrder === 'randomized'
                        ? `bg-${primaryColor}-600 text-white shadow-sm`
                        : `bg-white text-${primaryColor}-700 border border-${primaryColor}-300 hover:bg-${primaryColor}-50`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">Randomized</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Rounds */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Rounds</h3>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleRoundsUpdate(-1)}
                    className={`w-10 h-10 bg-${primaryColor}-200 text-${primaryColor}-800 rounded-full font-bold text-lg hover:bg-${primaryColor}-300 transition-all border-0`}
                  >
                    -
                  </button>
                  <div className={`bg-white border border-${primaryColor}-300 rounded-xl px-6 py-1 text-center font-bold text-lg text-${primaryColor}-800 min-w-[80px]`}>
                    {settings.rounds}
                  </div>
                  <button
                    onClick={() => handleRoundsUpdate(1)}
                    className={`w-10 h-10 bg-${primaryColor}-200 text-${primaryColor}-800 rounded-full font-bold text-lg hover:bg-${primaryColor}-300 transition-all border-0`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Game Time */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">Total Game Time</h3>
                  <span className={`text-xs text-${primaryColor}-600`}>(minutes)</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleTotalTimeUpdate(-1)}
                    disabled={settings.totalTime <= 0}
                    className={`w-10 h-10 rounded-full font-bold text-lg transition-all border-0 ${
                      settings.totalTime <= 0
                        ? 'bg-gray-200 text-white cursor-not-allowed'
                        : `bg-${primaryColor}-200 text-${primaryColor}-800 hover:bg-${primaryColor}-300`
                    }`}
                  >
                    -
                  </button>
                  <div className={`bg-white border border-${primaryColor}-300 rounded-xl px-6 py-1 text-center font-bold text-lg text-${primaryColor}-800 min-w-[80px]`}>
                    {settings.totalTime || '-'}
                  </div>
                  <button
                    onClick={() => handleTotalTimeUpdate(1)}
                    className={`w-10 h-10 bg-${primaryColor}-200 text-${primaryColor}-800 rounded-full font-bold text-lg hover:bg-${primaryColor}-300 transition-all border-0`}
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
            </div>
          </div>
          
          {/* Fixed Play Button Area */}
          <div className="flex justify-center items-center p-2 pb-6">
            <div className="max-w-4xl w-full flex justify-end pr-6">
              <button
                onClick={handleStart}
                className={`px-8 py-3 bg-${buttonColor} text-white rounded-lg font-bold text-lg hover:bg-${buttonColor.replace('500', '600')} shadow-lg`}
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsModal;
