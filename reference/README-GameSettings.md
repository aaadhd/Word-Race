# Game Settings Modal - 재사용 가능한 게임 설정 컴포넌트

🎮 **다양한 게임에서 재사용 가능한 설정 화면 컴포넌트**

Game Settings Modal은 Stop & Go 게임에서 사용되는 설정 화면을 완전히 재사용 가능한 컴포넌트로 리팩토링한 것입니다. 게임별 특성에 맞게 완전히 커스터마이징 가능하며, 타입 안전성을 보장합니다.

## ✨ 주요 특징

- 🔄 **완전 재사용 가능**: 다양한 게임에서 즉시 사용 가능
- 🎨 **완전 커스터마이징**: 색상, 이미지, 옵션 등 모든 요소 커스터마이징
- 📱 **반응형 디자인**: 모든 화면 크기에서 최적화된 레이아웃
- 🛡️ **타입 안전성**: TypeScript로 완전한 타입 지원
- ✅ **자동 검증**: 설정값 자동 검증 및 에러 처리
- 🎯 **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 📦 파일 구성

```
reference/
├── GameSettingsModal.tsx          # 메인 컴포넌트
├── game-settings-types.ts         # 타입 정의 및 유틸리티
├── GameSettingsExamples.tsx       # 다양한 사용 예제
├── GameSettingsUsageGuide.md      # 상세 사용 가이드
└── README-GameSettings.md         # 이 문서
```

## 🚀 빠른 시작

### 1. 기본 사용법

```tsx
import GameSettingsModal from './reference/GameSettingsModal';

const MyGame = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button onClick={() => setShowSettings(true)}>
        게임 설정 열기
      </button>
      
      {showSettings && (
        <GameSettingsModal
          onStart={(settings) => {
            console.log('게임 시작:', settings);
            setShowSettings(false);
          }}
          onBack={() => setShowSettings(false)}
        />
      )}
    </>
  );
};
```

### 2. 게임별 커스터마이징

```tsx
import { GAME_CUSTOMIZATIONS } from './reference/game-settings-types';

// Stop & Go 게임
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.stopAndGo}
/>

// 수학 퀴즈 게임
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.mathQuiz}
/>
```

## 🎨 커스터마이징 옵션

### 색상 테마

| 게임 | Primary | Secondary | Background | Button |
|------|---------|-----------|------------|--------|
| **Stop & Go** | Purple | Cyan | Purple-50 | Cyan-500 |
| **Math Quiz** | Blue | Green | Blue-50 | Green-500 |
| **Science Quiz** | Indigo | Yellow | Indigo-50 | Yellow-500 |

### 설정 옵션

- **레슨 범위**: 사용 가능한 레슨 목록 커스터마이징
- **학습 포커스**: 게임별 학습 영역 설정
- **게임 모드**: Teams/Solo 모드 지원
- **문제 순서**: 동일 순서/랜덤 순서 선택
- **라운드 수**: 최대 라운드 수 제한
- **게임 시간**: 총 게임 시간 설정

## 📋 설정 데이터 구조

```tsx
interface GameSettings {
  selectedLessons: number[];           // 선택된 레슨들 [1, 2, 3]
  learningFocus: string[];             // 학습 포커스 ['Vocabulary', 'Reading']
  gameMode: 'teams' | 'solo';         // 게임 모드
  questionOrder: 'same' | 'randomized'; // 문제 순서
  rounds: number;                      // 라운드 수 (1-15)
  totalTime: number;                   // 총 시간 분 (0-120)
}
```

## 🎯 사용 예제

### 1. 기본 예제

```tsx
import { BasicGameSettingsExample } from './reference/GameSettingsExamples';

// 기본 설정으로 게임 설정 모달 사용
<BasicGameSettingsExample />
```

### 2. 게임 통합 예제

```tsx
import { GameIntegrationExample } from './reference/GameSettingsExamples';

// 완전한 게임 플로우 (메뉴 → 설정 → 게임 → 결과)
<GameIntegrationExample />
```

### 3. 커스텀 게임 예제

```tsx
import { CustomGameExample } from './reference/GameSettingsExamples';

// 완전히 커스터마이징된 게임 설정
<CustomGameExample />
```

## 🔧 고급 기능

### 설정 검증

```tsx
import { validateGameSettings } from './reference/game-settings-types';

const validation = validateGameSettings(settings);
if (!validation.isValid) {
  console.error('설정 오류:', validation.errors);
}
```

### 설정 업데이트 헬퍼

```tsx
import { createSettingsUpdater } from './reference/game-settings-types';

const { toggleLesson, updateRounds } = createSettingsUpdater();

// 레슨 토글
const newSettings = toggleLesson(5, currentSettings, [8]);

// 라운드 업데이트
const newSettings = updateRounds(1, currentSettings, 15);
```

## 🎮 게임별 사전 설정

### Stop & Go 게임

```tsx
const stopAndGoConfig = {
  gameTitle: 'Stop & Go Race',
  gameImage: '/stopandgo.png',
  gameGuideText: 'Game Guide',
  availableLessons: [1, 2, 3, 4, 5, 6, 7, 8],
  availableLearningFocus: ['Vocabulary', 'Reading', 'Speaking', 'Grammar', 'Writing', 'Action Learning'],
  disabledLessons: [8], // Lesson 8 비활성화
  maxRounds: 10,
  maxTime: 60,
  customStyles: {
    primaryColor: 'purple',
    secondaryColor: 'cyan',
    backgroundColor: 'purple-50',
    buttonColor: 'cyan-500'
  }
};
```

### 수학 퀴즈 게임

```tsx
const mathQuizConfig = {
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
};
```

## 📱 반응형 디자인

- **데스크톱 (1024px+)**: 좌우 패널 레이아웃
- **태블릿 (768px-1023px)**: 적응형 그리드 레이아웃
- **모바일 (768px 미만)**: 세로 스택 레이아웃

## 🛡️ 타입 안전성

모든 props와 설정값이 TypeScript로 완전히 타입 정의되어 있어 컴파일 타임에 오류를 방지합니다.

```tsx
// 타입 안전한 설정 업데이트
const updateSettings = (settings: GameSettings, updates: Partial<GameSettings>): GameSettings => {
  return { ...settings, ...updates };
};
```

## 🔍 검증 및 에러 처리

### 자동 검증 항목

- ✅ 최소 하나의 레슨 선택
- ✅ 최소 하나의 학습 포커스 선택
- ✅ 라운드 수 범위 (1-15)
- ✅ 총 게임 시간 범위 (0-120분)

### 에러 처리 예제

```tsx
const handleStart = (settings: GameSettings) => {
  const validation = validateGameSettings(settings);
  
  if (!validation.isValid) {
    // 사용자에게 에러 표시
    showErrorDialog(validation.errors.join('\n'));
    return;
  }
  
  // 게임 시작
  startGameWithSettings(settings);
};
```

## 🚀 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **상태 최적화**: 필요한 상태만 업데이트
- **이미지 최적화**: 적절한 크기와 형식 사용
- **번들 크기**: 트리 쉐이킹 지원

## 🔄 확장 가능성

### 새로운 게임 타입 추가

```tsx
// game-settings-types.ts에 추가
export const GAME_CUSTOMIZATIONS = {
  // ... 기존 게임들
  newGameType: {
    gameTitle: 'New Game',
    gameImage: '/new-game.png',
    availableLessons: [1, 2, 3],
    availableLearningFocus: ['Option1', 'Option2'],
    // ... 기타 설정
  }
};
```

### 커스텀 필드 확장

필요시 `GameSettings` 타입을 확장하여 새로운 설정 필드를 추가할 수 있습니다.

## 📝 의존성

- **React**: 16.8+ (Hooks 지원)
- **TypeScript**: 4.0+
- **Tailwind CSS**: 3.0+

## 🎯 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📖 상세 문서

더 자세한 사용법과 예제는 [GameSettingsUsageGuide.md](./GameSettingsUsageGuide.md)를 참고하세요.

## 🤝 기여하기

1. 새로운 게임 타입 추가
2. 새로운 커스터마이징 옵션 추가
3. 접근성 개선
4. 성능 최적화

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Game Settings Modal**로 더욱 쉽고 빠르게 게임 설정 화면을 구현하세요! 🎮✨
