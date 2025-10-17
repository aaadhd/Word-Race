# Team Scoreboard & Player List 사용 가이드

팀 점수판과 팀 인원 리스트 컴포넌트는 다양한 게임에서 팀 기반 점수 관리와 플레이어 상태 표시를 위한 재사용 가능한 컴포넌트입니다.

## 📁 파일 구조

```
reference/
├── TeamScoreboard.tsx              # 메인 팀 점수판 컴포넌트
├── TeamPlayerList.tsx              # 팀 인원 리스트 컴포넌트
├── team-scoreboard-types.ts        # 타입 정의 및 유틸리티
├── TeamScoreboardExamples.tsx      # 사용 예제들
└── TeamScoreboardUsageGuide.md     # 이 가이드 문서
```

## 🚀 빠른 시작

### 1. 기본 팀 점수판 사용법

```tsx
import TeamScoreboard from './reference/TeamScoreboard';
import { initializeTeams, SAMPLE_PLAYERS } from './reference/team-scoreboard-types';

const MyGame = () => {
  const [teams] = useState(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 8)));
  const [scores, setScores] = useState({ red: 0, blue: 0 });
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);

  return (
    <TeamScoreboard
      scores={scores}
      currentRound={currentRound}
      timeLeft={timeLeft}
      teams={teams}
      showTimeLeft={true}
      showPlayerList={true}
    />
  );
};
```

### 2. 팀 인원 리스트만 사용법

```tsx
import TeamPlayerList from './reference/TeamPlayerList';

const PlayerManagement = () => {
  const [teams, setTeams] = useState(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 10)));

  return (
    <TeamPlayerList
      teams={teams}
      currentRound={1}
      showCurrentPlayer={true}
    />
  );
};
```

## 🎨 컴포넌트 API

### TeamScoreboard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `scores` | `TeamScores` | **필수** | 팀별 점수 `{red: number, blue: number}` |
| `currentRound` | `number` | **필수** | 현재 라운드 번호 |
| `teams` | `Teams` | **필수** | 팀별 플레이어 목록 |
| `timeLeft` | `number` | `undefined` | 남은 시간 (초) |
| `playerStatus` | `PlayerStatus` | `undefined` | 플레이어 상태 정보 |
| `showTimeLeft` | `boolean` | `true` | 시간 표시 여부 |
| `showPlayerList` | `boolean` | `true` | 플레이어 리스트 표시 여부 |
| `maxPlayersToShow` | `number` | `3` | 표시할 최대 플레이어 수 |
| `customStyles` | `object` | `{}` | 커스텀 스타일 설정 |

### TeamPlayerList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `teams` | `Teams` | **필수** | 팀별 플레이어 목록 |
| `currentRound` | `number` | **필수** | 현재 라운드 번호 |
| `playerStatus` | `PlayerStatus` | `undefined` | 플레이어 상태 정보 |
| `showCurrentPlayer` | `boolean` | `true` | 현재 플레이어 강조 표시 |
| `customStyles` | `object` | `{}` | 커스텀 스타일 설정 |

## 📋 타입 정의

### 기본 타입들

```tsx
type Team = 'red' | 'blue';
type TeamColor = 'blue' | 'red';

interface Player {
  id: string;
  name: string;
  avatarEmoji: string;
  team?: TeamColor;
}

interface Teams {
  blue: Player[];
  red: Player[];
}

interface TeamScores {
  red: number;
  blue: number;
}

interface PlayerStatus {
  red: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
  };
  blue: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
  };
}
```

### 커스텀 스타일 타입

```tsx
interface CustomStyles {
  primaryColor?: 'red' | 'blue';
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  teamAColor?: string;    // Team A 배경색
  teamBColor?: string;    // Team B 배경색
  highlightColor?: string; // 현재 플레이어 강조색
}
```

## 🎯 사용 예제

### 1. 기본 점수판

```tsx
import { BasicTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 자동 시간 카운트다운과 점수 업데이트가 포함된 기본 점수판
<BasicTeamScoreboardExample />
```

### 2. 플레이어 리스트만

```tsx
import { TeamPlayerListOnlyExample } from './reference/TeamScoreboardExamples';

// 팀 셔플, 라운드 변경, 방패 토글 기능이 포함된 플레이어 리스트
<TeamPlayerListOnlyExample />
```

### 3. 커스텀 스타일링

```tsx
import { CustomStyledTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 녹색-파란색 테마로 커스터마이징된 점수판
<CustomStyledTeamScoreboardExample />
```

### 4. 동적 업데이트

```tsx
import { DynamicTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 실시간으로 점수와 상태가 업데이트되는 점수판
<DynamicTeamScoreboardExample />
```

### 5. 완전한 게임 통합

```tsx
import { CompleteGameIntegrationExample } from './reference/TeamScoreboardExamples';

// 설정 → 게임 → 결과의 전체 게임 플로우
<CompleteGameIntegrationExample />
```

## 🔧 유틸리티 함수들

### 팀 관리 함수

```tsx
import {
  initializeTeams,
  shuffleTeams,
  checkTeamBalance,
  validateTeamSetup,
  createCustomTeamSetup
} from './reference/team-scoreboard-types';

// 팀 초기화
const teams = initializeTeams(players, teamASize);

// 팀 셔플
const shuffledTeams = shuffleTeams(teams);

// 팀 밸런스 확인
const balance = checkTeamBalance(teams);
console.log(balance.isBalanced, balance.difference);

// 팀 설정 검증
const validation = validateTeamSetup(teams);
if (!validation.isValid) {
  console.error(validation.errors);
}

// 커스텀 팀 설정
const customTeams = createCustomTeamSetup(players, [0, 1, 2, 3, 4, 5]);
```

### 점수 관리 함수

```tsx
import {
  updateTeamScore,
  resetTeamScores,
  getWinningTeam,
  getTeamLeader
} from './reference/team-scoreboard-types';

// 점수 업데이트
const newScores = updateTeamScore(scores, 'red', 5);

// 점수 리셋
const resetScores = resetTeamScores();

// 승자 확인
const winner = getWinningTeam(scores);

// 리더 확인
const leader = getTeamLeader(scores);
```

### 플레이어 회전 함수

```tsx
import {
  getRotatedPlayers,
  getCurrentPlayer
} from './reference/team-scoreboard-types';

// 회전된 플레이어 목록
const rotatedPlayers = getRotatedPlayers(teamPlayers, currentRound);

// 현재 플레이어
const currentPlayer = getCurrentPlayer(teamPlayers, currentRound);
```

## 🎨 스타일링 가이드

### 기본 색상 팔레트

```tsx
const TEAM_COLORS = {
  red: {
    primary: '#0891b2',    // Cyan
    bg: '#ecfeff',
    text: 'text-[#0891b2]',
    bgClass: 'bg-[#0891b2]',
    bgLight: 'bg-[#ecfeff]',
    border: 'border-[#0891b2]'
  },
  blue: {
    primary: '#9333ea',    // Purple
    bg: '#faf5ff',
    text: 'text-[#9333ea]',
    bgClass: 'bg-[#9333ea]',
    bgLight: 'bg-[#faf5ff]',
    border: 'border-[#9333ea]'
  }
};
```

### 커스텀 색상 테마 예제

```tsx
// 녹색-파란색 테마
const greenBlueTheme = {
  primaryColor: 'blue',
  backgroundColor: 'bg-gradient-to-b from-green-50 to-blue-50',
  textColor: 'text-green-800',
  borderColor: 'border-green-200',
  teamAColor: 'rgba(34, 197, 94, 0.6)',
  teamBColor: 'rgba(59, 130, 246, 0.6)'
};

// 빨간색-주황색 테마
const redOrangeTheme = {
  primaryColor: 'red',
  backgroundColor: 'bg-gradient-to-b from-red-50 to-orange-50',
  textColor: 'text-red-800',
  borderColor: 'border-red-200',
  teamAColor: 'rgba(239, 68, 68, 0.6)',
  teamBColor: 'rgba(249, 115, 22, 0.6)'
};
```

## 📱 반응형 디자인

### 화면 크기별 동작

- **데스크톱 (1024px+)**: 좌우 팀 배치, 큰 점수 표시
- **태블릿 (768px-1023px)**: 적응형 그리드 레이아웃
- **모바일 (768px 미만)**: 세로 스택 레이아웃

### 반응형 설정

```tsx
<TeamScoreboard
  // ... 기타 props
  maxPlayersToShow={window.innerWidth > 768 ? 3 : 2} // 화면 크기에 따라 조정
/>
```

## 🎮 게임 통합 패턴

### 1. 상태 관리

```tsx
const [gameState, setGameState] = useState({
  teams: initializeTeams(players),
  scores: { red: 0, blue: 0 },
  currentRound: 1,
  timeLeft: 300,
  playerStatus: DEFAULT_PLAYER_STATUS
});
```

### 2. 점수 업데이트 로직

```tsx
const handleScoreUpdate = (team: Team, points: number) => {
  setScores(prev => updateTeamScore(prev, team, points));
  
  // 특정 점수 도달 시 이벤트
  const newScore = scores[team] + points;
  if (newScore >= 10) {
    handleRoundEnd();
  }
};
```

### 3. 플레이어 회전 로직

```tsx
const handleNextPlayer = () => {
  setCurrentRound(prev => prev + 1);
  
  // 현재 플레이어 변경 알림
  const currentPlayer = getCurrentPlayer(teams.red, currentRound + 1);
  showNotification(`${currentPlayer.name}의 차례입니다!`);
};
```

## 🔍 검증 및 에러 처리

### 팀 설정 검증

```tsx
const validation = validateTeamSetup(teams);
if (!validation.isValid) {
  // 에러 표시
  validation.errors.forEach(error => {
    showError(error);
  });
  return;
}
```

### 점수 범위 검증

```tsx
const isValidScore = (score: number) => {
  return score >= 0 && score <= 999;
};

const handleScoreUpdate = (team: Team, points: number) => {
  const newScore = scores[team] + points;
  if (!isValidScore(newScore)) {
    showError('점수 범위를 초과했습니다.');
    return;
  }
  setScores(prev => updateTeamScore(prev, team, points));
};
```

## 🚀 성능 최적화

### 메모이제이션

```tsx
import React, { useMemo } from 'react';

const MemoizedTeamScoreboard = React.memo(TeamScoreboard);

// 또는 특정 props만 메모이제이션
const memoizedScores = useMemo(() => scores, [scores.red, scores.blue]);
```

### 상태 최적화

```tsx
// 불필요한 리렌더링 방지
const handleScoreUpdate = useCallback((team: Team, points: number) => {
  setScores(prev => updateTeamScore(prev, team, points));
}, []);
```

## 🔄 확장 가능성

### 새로운 팀 상태 추가

```tsx
interface ExtendedPlayerStatus extends PlayerStatus {
  red: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
    hasBonus?: boolean; // 새로운 상태 추가
  };
  blue: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
    hasBonus?: boolean; // 새로운 상태 추가
  };
}
```

### 커스텀 플레이어 카드

```tsx
const CustomPlayerCard = ({ player, status }) => (
  <div className="custom-player-card">
    {/* 커스텀 플레이어 카드 디자인 */}
  </div>
);

// TeamPlayerList에 커스텀 컴포넌트 전달
<TeamPlayerList
  teams={teams}
  currentRound={currentRound}
  customPlayerCard={CustomPlayerCard}
/>
```

## 📝 주의사항

1. **Tailwind CSS**: 모든 스타일이 Tailwind CSS 클래스 기반
2. **이미지 경로**: 아바타는 이모지 문자열로 표시
3. **색상 클래스**: Tailwind CSS 색상 클래스만 사용 가능
4. **반응형**: 모든 브레이크포인트에서 테스트 필요

## 🆘 문제 해결

### 자주 발생하는 문제

1. **플레이어가 표시되지 않음**
   - `teams` 데이터가 올바른 형식인지 확인
   - `Player` 인터페이스의 필수 필드가 모두 있는지 확인

2. **점수가 업데이트되지 않음**
   - `scores` 상태가 올바르게 업데이트되는지 확인
   - `updateTeamScore` 함수가 올바르게 호출되는지 확인

3. **스타일이 적용되지 않음**
   - Tailwind CSS가 제대로 로드되었는지 확인
   - 커스텀 스타일 클래스가 올바른지 확인

### 디버깅 팁

```tsx
// 상태 값 확인
console.log('Current teams:', teams);
console.log('Current scores:', scores);
console.log('Current round:', currentRound);

// 유틸리티 함수 결과 확인
const validation = validateTeamSetup(teams);
console.log('Team validation:', validation);

const balance = checkTeamBalance(teams);
console.log('Team balance:', balance);
```

이제 팀 점수판과 팀 인원 리스트를 다른 게임에서 쉽게 재사용할 수 있습니다! 🎮✨
