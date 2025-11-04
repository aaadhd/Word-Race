# Game Settings Quick Start Guide

다른 게임에 세팅 화면을 붙이는 빠른 가이드입니다.

## 📦 파일 구조

```
reference/
├── GameSettingsModal.tsx          # 메인 컴포넌트
├── game-settings-types.ts         # 타입 정의
├── GameSettingsExamples.tsx       # 사용 예제
├── SETTINGS-QUICK-START.md        # 이 파일
├── README-GameSettings.md         # 상세 문서
└── GameSettingsUsageGuide.md      # 사용 가이드
```

## 🚀 5분 안에 시작하기

### 1단계: 파일 복사

reference 폴더에서 다음 파일들을 게임 폴더로 복사:

```
GameSettingsModal.tsx
game-settings-types.ts
```

### 2단계: Import 및 사용

```tsx
import GameSettingsModal from '../reference/GameSettingsModal';
import { GAME_CUSTOMIZATIONS } from '../reference/game-settings-types';

const YourGame = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button onClick={() => setShowSettings(true)}>
        게임 설정
      </button>
      
      {showSettings && (
        <GameSettingsModal
          onStart={(settings) => {
            console.log('게임 시작:', settings);
            setShowSettings(false);
            // 여기서 게임 시작 로직
          }}
          onBack={() => setShowSettings(false)}
        />
      )}
    </>
  );
};
```

### 3단계: 게임별 커스터마이징

```tsx
import { GAME_CUSTOMIZATIONS } from '../reference/game-settings-types';

// Stop & Go 게임 스타일
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.stopAndGo}
/>

// Word Race 게임 스타일
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  {...GAME_CUSTOMIZATIONS.wordRace}
/>
```

## 🎨 빠른 커스터마이징

### 색상만 변경

```tsx
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  customStyles={{
    primaryColor: 'purple',  // purple, blue, green, red, indigo
    buttonColor: 'cyan-500'  // cyan-500, blue-500, green-500 등
  }}
/>
```

### 게임 제목/이미지만 변경

```tsx
<GameSettingsModal
  onStart={handleStart}
  onBack={handleBack}
  gameTitle="My Awesome Game"
  gameImage="/my-game-image.png"
  gameGuideText="How to Play"
/>
```

## 📋 기본 설정 옵션

| Prop | 기본값 | 설명 |
|------|--------|------|
| `onStart` | 필수 | 게임 시작 콜백 |
| `onBack` | 필수 | 뒤로가기 콜백 |
| `gameTitle` | 'Game Settings' | 게임 제목 |
| `gameImage` | '/stopandgo.png' | 게임 이미지 |
| `gameGuideText` | 'Game Guide' | 가이드 버튼 텍스트 |
| `availableLessons` | [1-8] | 레슨 목록 |
| `availableLearningFocus` | ['Vocabulary', ...] | 학습 포커스 |
| `maxRounds` | 10 | 최대 라운드 |
| `maxTime` | 60 | 최대 시간 |
| `disabledLessons` | [] | 비활성화 레슨 |
| `customStyles` | {} | 스타일 설정 |

## 🎮 설정 데이터 구조

```tsx
interface GameSettings {
  selectedLessons: number[];        // 선택된 레슨 [1, 2, 3]
  learningFocus: string[];          // 학습 포커스 ['Vocabulary']
  gameMode: 'teams' | 'solo';       // 게임 모드
  playType: 'trace' | 'draw';       // 플레이 타입
  quizIncluded: boolean;             // 퀴즈 포함
  rounds: number;                    // 라운드 수
  totalTime: number;                 // 총 시간
}
```

## 📝 완전한 예제

```tsx
import { useState } from 'react';
import GameSettingsModal from '../reference/GameSettingsModal';
import { GAME_CUSTOMIZATIONS } from '../reference/game-settings-types';

const MyGame = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(null);

  const handleStart = (gameSettings) => {
    setSettings(gameSettings);
    setShowSettings(false);
    console.log('게임 시작!', gameSettings);
    // 게임 시작 로직
  };

  return (
    <div>
      {!settings && (
        <button onClick={() => setShowSettings(true)}>
          Start Game
        </button>
      )}

      {showSettings && (
        <GameSettingsModal
          onStart={handleStart}
          onBack={() => setShowSettings(false)}
          gameTitle="My Game"
          gameImage="/my-game.png"
          availableLessons={[1, 2, 3, 4, 5]}
          maxRounds={15}
          customStyles={{
            primaryColor: 'blue',
            buttonColor: 'blue-500'
          }}
        />
      )}

      {settings && (
        <div>
          <h2>Playing Game...</h2>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyGame;
```

## 🎯 주요 기능

✅ **자동 검증**: 필수 설정 자동 확인  
✅ **반응형 디자인**: 모든 화면 크기 지원  
✅ **타입 안전성**: TypeScript 완전 지원  
✅ **커스터마이징**: 색상, 옵션 모두 변경 가능  
✅ **재사용 가능**: 여러 게임에서 즉시 사용  

## 📚 더 자세한 정보

- [README-GameSettings.md](./README-GameSettings.md) - 전체 기능 설명
- [GameSettingsUsageGuide.md](./GameSettingsUsageGuide.md) - 상세 사용 가이드
- [GameSettingsExamples.tsx](./GameSettingsExamples.tsx) - 다양한 예제

## 🆘 문제 해결

### 이미지가 보이지 않음
```tsx
// public 폴더에 이미지 위치 확인
gameImage="/images/my-game.png"  // ✅ 올바름
gameImage="../images/my-game.png"  // ❌ 오류
```

### 색상이 적용되지 않음
```tsx
// 지원되는 색상만 사용
primaryColor: 'purple'  // ✅ purple, blue, green, red, indigo
primaryColor: 'pink'    // ❌ 지원 안됨
```

## ✅ 체크리스트

게임에 세팅 화면 붙이기:

- [ ] GameSettingsModal.tsx 복사
- [ ] game-settings-types.ts 복사
- [ ] import 문 추가
- [ ] onStart 콜백 구현
- [ ] onBack 콜백 구현
- [ ] 게임 제목/이미지 설정
- [ ] 색상 커스터마이징 (선택)
- [ ] 테스트 실행

---

**이제 다른 게임에 세팅 화면을 쉽게 붙일 수 있습니다!** 🎉

