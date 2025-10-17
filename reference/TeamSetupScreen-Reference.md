# 팀 세팅 화면 컴포넌트 참조 가이드 (Updated)

## 개요
Word Race 게임의 개선된 팀 세팅 화면을 다른 게임에서 재사용할 수 있도록 정리한 참조 문서입니다.

## 주요 기능

### 1. 드래그 앤 드롭
- 플레이어를 드래그하여 팀 간 이동 가능
- 같은 팀 내에서 순서 변경 가능
- 4x2 그리드 레이아웃 (팀당 최대 8명)

### 2. 팀 유효성 검사
- 최소 2명 이상의 플레이어 필요
- 팀 간 인원 차이는 최대 1명까지만 허용
- 게임 내 디자인된 모달로 안내 메시지 표시

### 3. 팀 셔플 기능
- 모든 플레이어를 랜덤하게 재배치
- 팀 간 균등 분배

## 컴포넌트 구조

### 1. TeamSetupScreen.tsx
메인 팀 세팅 화면 컴포넌트입니다.

**Props 인터페이스:**
```typescript
interface TeamSetupScreenProps {
  teams: Teams;
  onShuffle: () => void;
  onStart: () => void;
  onTeamsChange: (teams: Teams) => void; // 드래그 앤 드롭으로 팀 구성 변경 시 호출
}
```

### 2. AlertModal 컴포넌트
유효성 검사 실패 시 표시되는 모달입니다.

**특징:**
- 게임 내 디자인 일관성 유지
- ⚠️ 아이콘과 명확한 메시지
- OK 버튼으로 닫기

### 3. PlayerCard 컴포넌트
드래그 가능한 플레이어 카드입니다.

**특징:**
- 아바타 이모지 표시
- 플레이어 이름 표시
- 드래그 시 시각적 피드백 (투명도, 스케일)
- 호버 시 확대 효과

### 4. TeamBox 컴포넌트
팀별 플레이어 그룹을 표시하는 컨테이너입니다.

**Props:**
- `title`: 팀 이름 (예: "Team A")
- `teamColor`: 팀 색상 (예: "blue")
- `players`: 팀원 목록
- `team`: 팀 타입 ('blue' | 'red')
- `onDrop`: 드롭 이벤트 핸들러
- `onDragOver`: 드래그 오버 이벤트 핸들러
- `onDragStart`: 드래그 시작 핸들러
- `onDragEnd`: 드래그 종료 핸들러

## 필요한 타입 정의

### types.ts에 추가해야 할 부분:

```typescript
// 팀 세팅 관련 타입 정의
export type TeamColor = 'blue' | 'red';

export interface Player {
  id: string;
  name: string;
  avatarEmoji: string;
  team: TeamColor;
}

export interface Teams {
  blue: Player[];
  red: Player[];
}

// 드래그 앤 드롭 관련 타입
export interface DragItem {
  player: Player;
  sourceTeam: TeamColor;
  sourceIndex: number;
}

// GameState에 추가
export enum GameState {
  SETUP = 'SETUP',
  TEAM_SETUP = 'TEAM_SETUP', // 추가
  // ... 기타 상태들
}
```

### constants/teamSetup.ts (새로 생성):

```typescript
export const TEAM_MASCOTS: { [key in TeamColor]: string } = {
  blue: '🐻', // Bear
  red: '🦊'   // Fox
};

export const MOCK_PLAYERS: Omit<Player, 'team'>[] = [
  { id: 'p1', name: 'Emily', avatarEmoji: '👩‍🦰' },
  { id: 'p2', name: 'John', avatarEmoji: '👨‍🦱' },
  // ... 총 11명
];

export const initializeTeams = (players: Omit<Player, 'team'>[]) => {
  // Team A: 6명, Team B: 5명으로 초기화
  // 구현 내용은 team-setup-types.ts 참조
};

export const shuffleTeams = (teams: Teams) => {
  // 모든 플레이어를 랜덤하게 섞어서 재배치
  // 구현 내용은 team-setup-types.ts 참조
};
```

## 사용 방법

### 1. 기본 사용법

```tsx
import TeamSetupScreen from './components/TeamSetupScreen';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './constants/teamSetup';
import type { Teams } from './types';

const MyGame = () => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));

  const handleShuffle = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStart = () => {
    // 게임 시작 로직
    setGameState(GameState.ROUND_START);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  return (
    <TeamSetupScreen
      teams={teams}
      onShuffle={handleShuffle}
      onStart={handleStart}
      onTeamsChange={handleTeamsChange}
    />
  );
};
```

### 2. App.tsx에 통합하기

```tsx
import TeamSetupScreen from './components/TeamSetupScreen';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './constants/teamSetup';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));

  const startGame = (rounds: number, mode: GameMode) => {
    // 게임 설정 후 팀 세팅 화면으로 이동
    setGameState(GameState.TEAM_SETUP);
  };

  const handleShuffleTeams = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStartFromTeamSetup = () => {
    setGameState(GameState.ROUND_START);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.SETUP:
        return <GameSetup onStart={startGame} />;
      
      case GameState.TEAM_SETUP:
        return (
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffleTeams}
            onStart={handleStartFromTeamSetup}
            onTeamsChange={handleTeamsChange}
          />
        );
      
      // ... 기타 상태들
    }
  };

  return (
    <div className="w-full h-screen">
      {renderContent()}
    </div>
  );
};
```

## 스타일링

### Tailwind CSS 클래스 사용
- `font-display`: 제목 및 버튼용 폰트 (Fredoka One)
- `font-sans`: 일반 텍스트용 폰트
- `bg-gradient-to-r`: 그라디언트 배경
- `rounded-full`: 완전히 둥근 버튼
- `shadow-2xl`: 큰 그림자 효과
- `hover:scale-105`: 호버 시 확대 효과
- `transition-transform`: 부드러운 변환 애니메이션

### 반응형 디자인
- `grid-cols-4 grid-rows-2`: 4x2 그리드 레이아웃
- `gap-6`: 그리드 간격
- `max-w-6xl`: 최대 너비 제한
- `pt-16`: 상단 패딩으로 콘텐츠 위치 조정

## 유효성 검사

### 1. 최소 플레이어 수
```typescript
if (totalPlayers < 2) {
  setAlertMessage('At least 2 players are required\nto start the game.');
  return;
}
```

### 2. 팀 균형
```typescript
const teamDifference = Math.abs(teamACount - teamBCount);
if (teamDifference > 1) {
  setAlertMessage('Team size difference\nmust be 1 player or less.');
  return;
}
```

## 드래그 앤 드롭 구현

### 1. 드래그 시작
```typescript
const handleDragStart = (e: React.DragEvent) => {
  e.dataTransfer.effectAllowed = 'move';
  onDragStart({ player, sourceTeam: team, sourceIndex: index });
};
```

### 2. 드롭 처리
```typescript
const handleDrop = (targetTeam: TeamColor, targetIndex: number) => {
  // 1. 소스 팀에서 플레이어 제거
  // 2. 타겟 팀에 플레이어 추가
  // 3. 최대 8명 제한 체크
  // 4. 상태 업데이트
};
```

### 3. 그리드 위치 계산
```typescript
// 드롭 위치에 따라 인덱스 계산
const col = Math.floor(x / colWidth);
const row = Math.floor(y / rowHeight);
const targetIndex = Math.min(row * 4 + col, 7);
```

## 커스터마이징 옵션

### 1. 팀 색상 변경
버튼 색상을 변경하려면:
```tsx
// Shuffle Teams 버튼
className="... bg-gradient-to-r from-yellow-400 to-orange-400 ..."

// Start Game 버튼
className="... bg-gradient-to-r from-green-400 to-emerald-500 ..."
```

### 2. 플레이어 아바타 변경
```typescript
export const MOCK_PLAYERS: Omit<Player, 'team'>[] = [
  { id: 'p1', name: 'Player1', avatarEmoji: '🎮' },
  { id: 'p2', name: 'Player2', avatarEmoji: '🎯' },
  // ...
];
```

### 3. 그리드 레이아웃 변경
현재는 4x2 (최대 8명)이지만, 변경 가능:
```tsx
// 5x2로 변경 (최대 10명)
<div className="grid grid-cols-5 grid-rows-2 gap-6 ...">
```

### 4. 메시지 텍스트 변경
```typescript
// 한글로 변경
setAlertMessage('최소 2명 이상의 플레이어가\n필요합니다.');

// 영문 (기본값)
setAlertMessage('At least 2 players are required\nto start the game.');
```

## 의존성

### 필수 의존성:
- React 18+
- TypeScript
- Tailwind CSS

### 필수 CSS 클래스:
- `font-display`: Fredoka One 폰트
- `font-sans`: 기본 산세리프 폰트
- `text-primary-text`: 주요 텍스트 색상
- `text-accent-yellow`: 강조 노란색
- `animate-fade-in`: 페이드 인 애니메이션
- `animate-fade-in-up`: 페이드 인 + 위로 이동 애니메이션

## 파일 구조
```
components/
├── TeamSetupScreen.tsx    # 메인 컴포넌트
constants/
├── teamSetup.ts          # 상수 및 유틸리티 함수
types.ts                  # 타입 정의
```

## 주의사항

1. **Tailwind CSS 설정**: 프로젝트에 Tailwind CSS가 설정되어 있어야 합니다.
2. **타입 안전성**: TypeScript를 사용하여 타입 안전성을 보장합니다.
3. **드래그 앤 드롭**: HTML5 드래그 앤 드롭 API를 사용합니다.
4. **최대 인원**: 팀당 최대 8명으로 제한되어 있습니다 (변경 가능).
5. **유효성 검사**: 게임 시작 전 팀 구성 유효성을 반드시 검사합니다.

## 개선 사항 (v2)

### 기존 대비 변경점:
1. **드래그 앤 드롭 추가**: 플레이어를 자유롭게 이동 가능
2. **유효성 검사**: 최소 인원 및 팀 균형 체크
3. **커스텀 모달**: 게임 내 디자인 일관성 유지
4. **개선된 UI**: 더 큰 플레이어 카드, 명확한 레이아웃
5. **영문 메시지**: 국제화 대응

## 확장 가능성

1. **더 많은 팀**: 3팀 이상으로 확장 가능
2. **플레이어 수 조정**: 팀당 최대 인원 변경 가능
3. **커스텀 아바타**: 이미지나 아이콘으로 변경 가능
4. **팀 이름 커스터마이징**: 하드코딩된 팀 이름을 props로 받도록 수정 가능
5. **저장/불러오기**: 팀 구성을 로컬 스토리지에 저장 가능
