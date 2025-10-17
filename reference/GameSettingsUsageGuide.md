# Game Settings Modal 사용 가이드

Game Settings Modal은 다양한 게임에서 재사용 가능한 설정 화면 컴포넌트입니다. 완전히 커스터마이징 가능하며, 게임별 특성에 맞게 조정할 수 있습니다.

## 📁 파일 구조

```
reference/
├── GameSettingsModal.tsx          # 메인 컴포넌트
├── game-settings-types.ts         # 타입 정의 및 유틸리티
├── GameSettingsExamples.tsx       # 사용 예제들
└── GameSettingsUsageGuide.md      # 이 가이드 문서
```

## 🚀 빠른 시작

### 1. 기본 사용법

```tsx
import GameSettingsModal from './reference/GameSettingsModal';

const MyGame = () => {
  const [showSettings, setShowSettings] = useState(false);

  const handleStart = (settings) => {
    console.log('Game settings:', settings);
    setShowSettings(false);
    // 게임 시작 로직
  };

  return (
    <>
      <button onClick={() => setShowSettings(true)}>
        게임 설정
      </button>
      
      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={() => setShowSettings(false)}
        />
      )}
    </>
  );
};
```

### 2. 게임별 커스터마이징

```tsx
import GameSettingsModal from './reference/GameSettingsModal';
import { GAME_CUSTOMIZATIONS } from './reference/game-settings-types';

const StopAndGoGame = () => {
  return (
    <GameSettingsModal
      onStart={handleStart}
      onBack={handleBack}
      {...GAME_CUSTOMIZATIONS.stopAndGo}
    />
  );
};
```

## 🎨 커스터마이징 옵션

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onStart` | `(settings: GameSettings) => void` | **필수** | 게임 시작 콜백 |
| `onBack` | `() => void` | **필수** | 뒤로가기 콜백 |
| `gameTitle` | `string` | `'Game Settings'` | 게임 제목 |
| `gameImage` | `string` | `'/stopandgo.png'` | 게임 이미지 경로 |
| `gameGuideText` | `string` | `'Game Guide'` | 게임 가이드 버튼 텍스트 |
| `availableLessons` | `number[]` | `[1,2,3,4,5,6,7,8]` | 사용 가능한 레슨 목록 |
| `availableLearningFocus` | `string[]` | `['Vocabulary', 'Reading', ...]` | 학습 포커스 옵션 |
| `maxRounds` | `number` | `10` | 최대 라운드 수 |
| `maxTime` | `number` | `60` | 최대 게임 시간 (분) |
| `disabledLessons` | `number[]` | `[]` | 비활성화할 레슨 목록 |
| `customStyles` | `object` | `{}` | 커스텀 스타일 설정 |

### 커스텀 스타일 옵션

```tsx
const customStyles = {
  primaryColor: 'purple',      // 주 색상 (purple, blue, green, red, indigo)
  secondaryColor: 'cyan',      // 보조 색상 (cyan, green, blue, red, yellow)
  backgroundColor: 'purple-50', // 배경색 (Tailwind 색상 클래스)
  buttonColor: 'cyan-500'      // 플레이 버튼 색상 (Tailwind 색상 클래스)
};
```

## 📋 GameSettings 타입

```tsx
interface GameSettings {
  selectedLessons: number[];           // 선택된 레슨들
  learningFocus: string[];             // 선택된 학습 포커스들
  gameMode: 'teams' | 'solo';         // 게임 모드
  questionOrder: 'same' | 'randomized'; // 문제 순서
  rounds: number;                      // 라운드 수
  totalTime: number;                   // 총 게임 시간 (분)
}
```

## 🎯 사용 예제

### 1. Stop & Go 게임

```tsx
import { GAME_CUSTOMIZATIONS } from './reference/game-settings-types';

<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.stopAndGo}
/>
```

### 2. 수학 퀴즈 게임

```tsx
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.mathQuiz}
/>
```

### 3. 완전 커스터마이징

```tsx
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  gameTitle="Science Quiz"
  gameImage="/science-quiz.png"
  gameGuideText="Science Guide"
  availableLessons={[1, 2, 3, 4, 5]}
  availableLearningFocus={['Biology', 'Chemistry', 'Physics']}
  disabledLessons={[5]}
  maxRounds={15}
  maxTime={45}
  customStyles={{
    primaryColor: 'blue',
    secondaryColor: 'green',
    backgroundColor: 'blue-50',
    buttonColor: 'green-500'
  }}
/>
```

## 🔧 유틸리티 함수

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

## 🎮 게임 통합 패턴

### 1. 상태 관리

```tsx
const [gameState, setGameState] = useState('menu');
const [gameSettings, setGameSettings] = useState(DEFAULT_GAME_SETTINGS);

const handleStartGame = (settings) => {
  setGameSettings(settings);
  setGameState('playing');
};
```

### 2. 게임 플로우

```tsx
{gameState === 'menu' && <MenuScreen onStart={openSettings} />}
{gameState === 'settings' && <GameSettingsModal onStart={handleStartGame} onBack={backToMenu} />}
{gameState === 'playing' && <GameScreen settings={gameSettings} />}
```

## 🎨 스타일링 가이드

### 색상 팔레트

| 색상 | Primary | Secondary | Background | Button |
|------|---------|-----------|------------|--------|
| **Purple** | purple | cyan | purple-50 | cyan-500 |
| **Blue** | blue | green | blue-50 | green-500 |
| **Green** | green | yellow | green-50 | yellow-500 |
| **Red** | red | orange | red-50 | orange-500 |
| **Indigo** | indigo | yellow | indigo-50 | yellow-500 |

### 레이아웃 특징

- **반응형 디자인**: 모든 화면 크기에서 최적화
- **고정 헤더/푸터**: 네비게이션과 플레이 버튼 고정
- **스크롤 가능 콘텐츠**: 설정 메뉴만 스크롤
- **균형잡힌 여백**: 일관된 패딩과 마진
- **접근성**: 키보드 네비게이션 지원

## 🔍 검증 및 에러 처리

### 자동 검증

컴포넌트는 다음을 자동으로 검증합니다:

- 최소 하나의 레슨 선택
- 최소 하나의 학습 포커스 선택
- 라운드 수 범위 (1-15)
- 총 게임 시간 범위 (0-120분)

### 에러 처리 예제

```tsx
const handleStart = (settings) => {
  const validation = validateGameSettings(settings);
  
  if (!validation.isValid) {
    // 에러 표시 (toast, alert 등)
    showError(validation.errors.join('\n'));
    return;
  }
  
  // 게임 시작
  startGame(settings);
};
```

## 📱 반응형 동작

- **데스크톱**: 좌우 패널 레이아웃
- **태블릿**: 적응형 그리드 레이아웃
- **모바일**: 세로 스택 레이아웃

## 🚀 성능 최적화

- **메모이제이션**: React.memo 사용
- **상태 최적화**: 필요한 상태만 업데이트
- **이미지 최적화**: 적절한 크기와 형식
- **번들 크기**: 트리 쉐이킹 지원

## 🔄 확장 가능성

### 새로운 게임 타입 추가

```tsx
// game-settings-types.ts에 추가
export const GAME_CUSTOMIZATIONS = {
  // ... 기존 게임들
  newGame: {
    gameTitle: 'New Game',
    gameImage: '/new-game.png',
    // ... 기타 설정
  }
};
```

### 커스텀 필드 추가

필요시 `GameSettings` 타입을 확장하여 새로운 설정 필드를 추가할 수 있습니다.

## 📝 주의사항

1. **Tailwind CSS**: 모든 스타일이 Tailwind CSS 클래스 기반
2. **이미지 경로**: 게임 이미지는 public 폴더에 위치
3. **색상 클래스**: Tailwind CSS 색상 클래스만 사용 가능
4. **반응형**: 모든 브레이크포인트에서 테스트 필요

## 🆘 문제 해결

### 자주 발생하는 문제

1. **이미지가 표시되지 않음**
   - 이미지 경로가 올바른지 확인
   - public 폴더에 이미지가 있는지 확인

2. **색상이 적용되지 않음**
   - Tailwind CSS 색상 클래스가 올바른지 확인
   - 지원되는 색상만 사용

3. **스타일이 깨짐**
   - Tailwind CSS가 제대로 로드되었는지 확인
   - 커스텀 스타일 클래스가 올바른지 확인

### 디버깅 팁

```tsx
// 설정 값 확인
console.log('Current settings:', settings);

// 검증 결과 확인
const validation = validateGameSettings(settings);
console.log('Validation:', validation);
```

이제 Game Settings Modal을 다른 게임에서 쉽게 재사용할 수 있습니다! 🎮✨
