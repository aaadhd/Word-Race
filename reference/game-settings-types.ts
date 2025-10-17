// Game Settings 관련 타입 정의
export interface GameSettings {
  selectedLessons: number[];
  learningFocus: string[];
  gameMode: 'teams' | 'solo';
  questionOrder: 'same' | 'randomized';
  rounds: number;
  totalTime: number;
}

export interface GameSettingsModalProps {
  onStart: (settings: GameSettings) => void;
  onBack: () => void;
  // 게임별 커스터마이징 옵션
  gameTitle?: string;
  gameImage?: string;
  gameGuideText?: string;
  availableLessons?: number[];
  availableLearningFocus?: string[];
  maxRounds?: number;
  maxTime?: number;
  disabledLessons?: number[];
  customStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    buttonColor?: string;
  };
}

// 기본 설정값
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  selectedLessons: [1],
  learningFocus: ['Vocabulary'],
  gameMode: 'teams',
  questionOrder: 'same',
  rounds: 6,
  totalTime: 0
};

// 기본 옵션들
export const DEFAULT_LESSONS = [1, 2, 3, 4, 5, 6, 7, 8];
export const DEFAULT_LEARNING_FOCUS = ['Vocabulary', 'Reading', 'Speaking', 'Grammar', 'Writing', 'Action Learning'];

// 게임별 커스터마이징 설정 예시
export const GAME_CUSTOMIZATIONS = {
  // Stop & Go 게임 설정
  stopAndGo: {
    gameTitle: 'Stop & Go Race',
    gameImage: '/stopandgo.png',
    gameGuideText: 'Game Guide',
    availableLessons: DEFAULT_LESSONS,
    availableLearningFocus: DEFAULT_LEARNING_FOCUS,
    disabledLessons: [8], // Lesson 8 비활성화
    maxRounds: 10,
    maxTime: 60,
    customStyles: {
      primaryColor: 'purple',
      secondaryColor: 'cyan',
      backgroundColor: 'purple-50',
      buttonColor: 'cyan-500'
    }
  },
  
  // 다른 게임 예시
  mathQuiz: {
    gameTitle: 'Math Quiz',
    gameImage: '/math-quiz.png',
    gameGuideText: 'Math Guide',
    availableLessons: [1, 2, 3, 4, 5],
    availableLearningFocus: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
    disabledLessons: [],
    maxRounds: 15,
    maxTime: 45,
    customStyles: {
      primaryColor: 'blue',
      secondaryColor: 'green',
      backgroundColor: 'blue-50',
      buttonColor: 'green-500'
    }
  }
};

// 설정 유효성 검사 함수
export const validateGameSettings = (settings: GameSettings): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (settings.selectedLessons.length === 0) {
    errors.push('최소 하나의 레슨을 선택해야 합니다.');
  }
  
  if (settings.learningFocus.length === 0) {
    errors.push('최소 하나의 학습 포커스를 선택해야 합니다.');
  }
  
  if (settings.rounds < 1 || settings.rounds > 15) {
    errors.push('라운드 수는 1-15 사이여야 합니다.');
  }
  
  if (settings.totalTime < 0 || settings.totalTime > 120) {
    errors.push('총 게임 시간은 0-120분 사이여야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 설정 초기화 함수
export const initializeGameSettings = (
  customConfig?: Partial<GameSettingsModalProps>
): GameSettings => {
  const config = customConfig || {};
  
  return {
    selectedLessons: config.availableLessons ? [config.availableLessons[0]] : [1],
    learningFocus: config.availableLearningFocus ? [config.availableLearningFocus[0]] : ['Vocabulary'],
    gameMode: 'teams',
    questionOrder: 'same',
    rounds: 6,
    totalTime: 0
  };
};

// 설정 업데이트 헬퍼 함수들
export const createSettingsUpdater = () => {
  const toggleLesson = (lesson: number, currentSettings: GameSettings, disabledLessons: number[] = []) => {
    if (disabledLessons.includes(lesson)) return currentSettings;
    
    return {
      ...currentSettings,
      selectedLessons: currentSettings.selectedLessons.includes(lesson)
        ? currentSettings.selectedLessons.filter(l => l !== lesson)
        : [...currentSettings.selectedLessons, lesson]
    };
  };
  
  const toggleLearningFocus = (focus: string, currentSettings: GameSettings) => {
    return {
      ...currentSettings,
      learningFocus: currentSettings.learningFocus.includes(focus)
        ? currentSettings.learningFocus.filter(f => f !== focus)
        : [...currentSettings.learningFocus, focus]
    };
  };
  
  const updateRounds = (delta: number, currentSettings: GameSettings, maxRounds: number = 10) => {
    return {
      ...currentSettings,
      rounds: Math.max(1, Math.min(maxRounds, currentSettings.rounds + delta))
    };
  };
  
  const updateTotalTime = (delta: number, currentSettings: GameSettings, maxTime: number = 60) => {
    return {
      ...currentSettings,
      totalTime: Math.max(0, Math.min(maxTime, currentSettings.totalTime + delta))
    };
  };
  
  return {
    toggleLesson,
    toggleLearningFocus,
    updateRounds,
    updateTotalTime
  };
};
