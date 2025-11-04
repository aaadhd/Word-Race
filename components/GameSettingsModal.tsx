import React, { useState } from 'react';
import {
  GameSettings,
  GameSettingsModalProps,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_LESSONS,
  DEFAULT_LEARNING_FOCUS,
  createSettingsUpdater,
  validateGameSettings
} from '../types/game-settings-types';

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  onStart,
  onBack,
  gameTitle = 'Game Settings',
  gameImage = '/stopandgo.png',
  gameGuideText = 'Game Guide',
  availableLessons = DEFAULT_LESSONS,
  availableLearningFocus = DEFAULT_LEARNING_FOCUS,
  maxRounds = 12,
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
    updateRounds
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


  const handleStart = () => {
    const validation = validateGameSettings(settings);
    if (validation.isValid) {
      onStart(settings);
    } else {
      // 에러 처리 (alert 또는 toast 등)
      console.error('GameSettingsModal - validation errors:', validation.errors);
      alert(validation.errors.join('\n'));
    }
  };

  // 커스텀 스타일 적용 - Tailwind 정적 클래스 맵
  const getColorClasses = () => {
    const color = customStyles.primaryColor || 'purple';

    const colorMap: { [key: string]: {
      bg50: string;
      bg200: string;
      bg300: string;
      bg400: string;
      bg600: string;
      text600: string;
      text700: string;
      text800: string;
      border200: string;
      border300: string;
      hover50: string;
    }} = {
      purple: {
        bg50: 'bg-purple-50',
        bg200: 'bg-purple-200',
        bg300: 'bg-purple-300',
        bg400: 'bg-purple-400',
        bg600: 'bg-purple-600',
        text600: 'text-purple-600',
        text700: 'text-purple-700',
        text800: 'text-purple-800',
        border200: 'border-purple-200',
        border300: 'border-purple-300',
        hover50: 'hover:bg-purple-50',
      },
      blue: {
        bg50: 'bg-blue-50',
        bg200: 'bg-blue-200',
        bg300: 'bg-blue-300',
        bg400: 'bg-blue-400',
        bg600: 'bg-blue-600',
        text600: 'text-blue-600',
        text700: 'text-blue-700',
        text800: 'text-blue-800',
        border200: 'border-blue-200',
        border300: 'border-blue-300',
        hover50: 'hover:bg-blue-50',
      },
      green: {
        bg50: 'bg-green-50',
        bg200: 'bg-green-200',
        bg300: 'bg-green-300',
        bg400: 'bg-green-400',
        bg600: 'bg-green-600',
        text600: 'text-green-600',
        text700: 'text-green-700',
        text800: 'text-green-800',
        border200: 'border-green-200',
        border300: 'border-green-300',
        hover50: 'hover:bg-green-50',
      },
      red: {
        bg50: 'bg-red-50',
        bg200: 'bg-red-200',
        bg300: 'bg-red-300',
        bg400: 'bg-red-400',
        bg600: 'bg-red-600',
        text600: 'text-red-600',
        text700: 'text-red-700',
        text800: 'text-red-800',
        border200: 'border-red-200',
        border300: 'border-red-300',
        hover50: 'hover:bg-red-50',
      },
      indigo: {
        bg50: 'bg-indigo-50',
        bg200: 'bg-indigo-200',
        bg300: 'bg-indigo-300',
        bg400: 'bg-indigo-400',
        bg600: 'bg-indigo-600',
        text600: 'text-indigo-600',
        text700: 'text-indigo-700',
        text800: 'text-indigo-800',
        border200: 'border-indigo-200',
        border300: 'border-indigo-300',
        hover50: 'hover:bg-indigo-50',
      }
    };

    return colorMap[color];
  };

  const getButtonColorClasses = () => {
    const color = customStyles.buttonColor || 'cyan-500';
    const buttonMap: { [key: string]: { bg: string; hover: string } } = {
      'cyan-500': { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600' },
      'blue-500': { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
      'green-500': { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
      'red-500': { bg: 'bg-red-500', hover: 'hover:bg-red-600' },
      'purple-500': { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    };
    return buttonMap[color] || buttonMap['cyan-500'];
  };

  const colors = getColorClasses();
  const buttonColors = getButtonColorClasses();

  return (
    <div className={`absolute inset-0 ${colors.bg50} flex flex-col z-50`}>
      {/* Header with Navigation Buttons - Fixed */}
      <div className={`flex justify-between items-center p-4 pl-6 pr-6 z-10`}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`w-10 h-10 ${colors.bg300} ${colors.bg400.replace('bg-', 'hover:bg-')} text-white rounded-full flex items-center justify-center transition-all shadow-sm`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Side Buttons */}
        <div className="flex gap-3">
          {/* Info Button */}
          <button className={`w-10 h-10 ${colors.bg300} ${colors.bg400.replace('bg-', 'hover:bg-')} text-white rounded-full flex items-center justify-center transition-all shadow-sm`}>
            <span className="text-sm font-bold">i</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onBack}
            className={`w-10 h-10 bg-white ${colors.text600} rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm border ${colors.border200}`}
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
        <div className={`w-1/3 ${colors.bg50} flex flex-col items-center justify-start`}>
          <div className="text-center mb-8 p-2 pl-6 pr-6">
            <div className="w-96 h-64 mb-6 rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/bg_with_title.png"
                alt={gameTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <button className={`${colors.bg200} ${colors.text800} px-6 py-3 rounded-full font-semibold`}>
              {gameGuideText}
            </button>
          </div>
        </div>

        {/* Right Panel - Scrollable */}
        <div className={`w-2/3 ${colors.bg50} overflow-hidden flex flex-col`}>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-2 pr-6">
            <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Choose Range */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Select Range</h3>
                <p className={`text-xs ${colors.text600}`}>(Multiple selection allowed)</p>
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
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
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
                <h3 className="text-lg font-bold text-gray-800">Select Learning Focus</h3>
                <p className={`text-xs ${colors.text600}`}>(Multiple selection allowed)</p>
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
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>

                {/* Vertical Divider */}
                <div className="flex items-center justify-center">
                  <div className={`w-px h-[112px] ${colors.bg200}`}></div>
                </div>

                {/* Preview Button - Full Height */}
                <button className={`bg-white ${colors.text700} border ${colors.border300} px-3 py-1 rounded-lg font-semibold text-base ${colors.hover50} h-[112px] flex flex-col items-center justify-center gap-2`}>
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
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                    }`}
                  >
                    <div className="text-center flex flex-col justify-center h-full">
                      <div className="font-bold text-base leading-tight">Teams</div>
                      <div className="text-xs opacity-75 leading-tight">(Smartboard)</div>
                    </div>
                  </button>
                  <button
                    disabled
                    className="flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
                  >
                    <div className="text-center flex flex-col justify-center h-full">
                      <div className="font-bold text-base leading-tight">Solo</div>
                      <div className="text-xs opacity-75 leading-tight">(Tablet)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Play Type */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Play Type</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, playType: 'trace' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.playType === 'trace'
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">Trace</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, playType: 'draw' }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.playType === 'draw'
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">Draw</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quiz Included */}
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">With Quiz</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, quizIncluded: true }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.quizIncluded === true
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">Yes</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, quizIncluded: false }))}
                    className={`flex-1 px-3 py-1 rounded-xl font-semibold text-base transition-all h-[54px] ${
                      settings.quizIncluded === false
                        ? `${colors.bg600} text-white shadow-sm`
                        : `bg-white ${colors.text700} border ${colors.border300} ${colors.hover50}`
                    }`}
                  >
                    <div className="text-center flex items-center justify-center h-full">
                      <div className="font-bold">No</div>
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
                    disabled={settings.rounds <= 1}
                    className={`w-10 h-10 rounded-full font-bold text-lg transition-all border-0 ${
                      settings.rounds <= 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : `${colors.bg200} ${colors.text800} ${colors.bg300.replace('bg-', 'hover:bg-')}`
                    }`}
                  >
                    -
                  </button>
                  <div className={`bg-white border ${colors.border300} rounded-xl px-6 py-1 text-center font-bold text-lg ${colors.text800} min-w-[80px]`}>
                    {settings.rounds}
                  </div>
                  <button
                    onClick={() => handleRoundsUpdate(1)}
                    disabled={settings.rounds >= maxRounds}
                    className={`w-10 h-10 rounded-full font-bold text-lg transition-all border-0 ${
                      settings.rounds >= maxRounds
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : `${colors.bg200} ${colors.text800} ${colors.bg300.replace('bg-', 'hover:bg-')}`
                    }`}
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
                className={`px-8 py-3 ${buttonColors.bg} text-white rounded-lg font-bold text-lg ${buttonColors.hover} shadow-lg`}
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
