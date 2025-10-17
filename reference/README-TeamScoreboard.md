# Team Scoreboard & Player List - 재사용 가능한 팀 관리 컴포넌트

🏆 **다양한 게임에서 재사용 가능한 팀 점수판 및 플레이어 관리 시스템**

Team Scoreboard & Player List는 Stop & Go 게임에서 사용되는 팀 점수판과 플레이어 리스트를 완전히 재사용 가능한 컴포넌트로 리팩토링한 것입니다. 팀 기반 게임에서 점수 관리, 플레이어 상태 표시, 팀 회전 등의 기능을 제공합니다.

## ✨ 주요 특징

- 🏆 **팀 점수 관리**: 실시간 점수 업데이트 및 표시
- 👥 **플레이어 관리**: 팀별 플레이어 목록 및 상태 표시
- 🔄 **플레이어 회전**: 라운드별 플레이어 순서 회전
- 🎨 **완전 커스터마이징**: 색상, 레이아웃, 스타일 완전 조정 가능
- 📱 **반응형 디자인**: 모든 화면 크기에서 최적화된 레이아웃
- 🛡️ **타입 안전성**: TypeScript로 완전한 타입 지원
- ⚡ **실시간 업데이트**: 게임 상태에 따른 동적 업데이트
- 🎯 **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 📦 파일 구성

```
reference/
├── TeamScoreboard.tsx              # 메인 팀 점수판 컴포넌트
├── TeamPlayerList.tsx              # 팀 인원 리스트 컴포넌트
├── team-scoreboard-types.ts        # 타입 정의 및 유틸리티
├── TeamScoreboardExamples.tsx      # 다양한 사용 예제
├── TeamScoreboardUsageGuide.md     # 상세 사용 가이드
└── README-TeamScoreboard.md        # 이 문서
```

## 🚀 빠른 시작

### 1. 기본 팀 점수판

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
    />
  );
};
```

### 2. 팀 인원 리스트

```tsx
import TeamPlayerList from './reference/TeamPlayerList';

const PlayerManagement = () => {
  const [teams, setTeams] = useState(() => initializeTeams(SAMPLE_PLAYERS));

  return (
    <TeamPlayerList
      teams={teams}
      currentRound={1}
      showCurrentPlayer={true}
    />
  );
};
```

## 🎨 컴포넌트 기능

### TeamScoreboard

- **실시간 점수 표시**: 팀별 점수를 실시간으로 업데이트
- **시간 카운트다운**: 게임 시간 표시 및 카운트다운
- **플레이어 회전**: 라운드별 플레이어 순서 자동 회전
- **상태 표시**: 방패, 승자 등 플레이어 상태 표시
- **커스텀 스타일링**: 팀 색상, 배경, 텍스트 등 완전 커스터마이징

### TeamPlayerList

- **팀별 플레이어 목록**: 각 팀의 플레이어를 그리드로 표시
- **현재 플레이어 강조**: 현재 차례인 플레이어 하이라이트
- **상태 아이콘**: 방패, 승자 등 상태를 시각적으로 표시
- **드래그 앤 드롭**: 플레이어 간 팀 이동 (선택사항)
- **반응형 레이아웃**: 화면 크기에 따른 적응형 배치

## 📋 데이터 구조

### 팀 정보

```tsx
interface Teams {
  blue: Player[];  // Team A (파란색)
  red: Player[];   // Team B (빨간색)
}

interface Player {
  id: string;
  name: string;
  avatarEmoji: string;
  team?: TeamColor;
}
```

### 점수 정보

```tsx
interface TeamScores {
  red: number;   // Team A 점수
  blue: number;  // Team B 점수
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

## 🎯 사용 예제

### 1. 기본 점수판 예제

```tsx
import { BasicTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 자동 시간 카운트다운과 점수 업데이트가 포함된 기본 점수판
<BasicTeamScoreboardExample />
```

### 2. 플레이어 리스트 예제

```tsx
import { TeamPlayerListOnlyExample } from './reference/TeamScoreboardExamples';

// 팀 셔플, 라운드 변경, 방패 토글 기능이 포함된 플레이어 리스트
<TeamPlayerListOnlyExample />
```

### 3. 커스텀 스타일링 예제

```tsx
import { CustomStyledTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 녹색-파란색 테마로 커스터마이징된 점수판
<CustomStyledTeamScoreboardExample />
```

### 4. 동적 업데이트 예제

```tsx
import { DynamicTeamScoreboardExample } from './reference/TeamScoreboardExamples';

// 실시간으로 점수와 상태가 업데이트되는 점수판
<DynamicTeamScoreboardExample />
```

### 5. 완전한 게임 통합 예제

```tsx
import { CompleteGameIntegrationExample } from './reference/TeamScoreboardExamples';

// 설정 → 게임 → 결과의 전체 게임 플로우
<CompleteGameIntegrationExample />
```

## 🔧 유틸리티 함수

### 팀 관리

```tsx
import {
  initializeTeams,
  shuffleTeams,
  checkTeamBalance,
  validateTeamSetup
} from './reference/team-scoreboard-types';

// 팀 초기화
const teams = initializeTeams(players, 6); // Team A에 6명

// 팀 셔플
const shuffledTeams = shuffleTeams(teams);

// 팀 밸런스 확인
const { isBalanced, difference } = checkTeamBalance(teams);

// 팀 설정 검증
const { isValid, errors } = validateTeamSetup(teams);
```

### 점수 관리

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

### 플레이어 회전

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

| 팀 | Primary | Background | Text | Border |
|----|---------|------------|------|--------|
| **Team A (Red)** | #0891b2 (Cyan) | #ecfeff | text-[#0891b2] | border-[#0891b2] |
| **Team B (Blue)** | #9333ea (Purple) | #faf5ff | text-[#9333ea] | border-[#9333ea] |

### 커스텀 색상 테마

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

- **데스크톱 (1024px+)**: 좌우 팀 배치, 큰 점수 표시
- **태블릿 (768px-1023px)**: 적응형 그리드 레이아웃
- **모바일 (768px 미만)**: 세로 스택 레이아웃

## 🎮 게임 통합 패턴

### 상태 관리

```tsx
const [gameState, setGameState] = useState({
  teams: initializeTeams(players),
  scores: { red: 0, blue: 0 },
  currentRound: 1,
  timeLeft: 300,
  playerStatus: DEFAULT_PLAYER_STATUS
});
```

### 점수 업데이트

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

### 플레이어 회전

```tsx
const handleNextPlayer = () => {
  setCurrentRound(prev => prev + 1);
  
  // 현재 플레이어 변경 알림
  const currentPlayer = getCurrentPlayer(teams.red, currentRound + 1);
  showNotification(`${currentPlayer.name}의 차례입니다!`);
};
```

## 🛡️ 타입 안전성

모든 props와 데이터가 TypeScript로 완전히 타입 정의되어 있어 컴파일 타임에 오류를 방지합니다.

```tsx
// 타입 안전한 점수 업데이트
const updateScore = (scores: TeamScores, team: Team, points: number): TeamScores => {
  return updateTeamScore(scores, team, points);
};
```

## 🔍 검증 및 에러 처리

### 자동 검증 항목

- ✅ 최소 팀 인원 확인
- ✅ 팀 밸런스 검사
- ✅ 점수 범위 검증
- ✅ 플레이어 데이터 무결성

### 에러 처리 예제

```tsx
const validation = validateTeamSetup(teams);
if (!validation.isValid) {
  validation.errors.forEach(error => {
    showError(error);
  });
  return;
}
```

## 🚀 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **상태 최적화**: 필요한 상태만 업데이트
- **메모이제이션**: 계산 비용이 큰 작업 캐싱
- **번들 크기**: 트리 쉐이킹 지원

## 🔄 확장 가능성

### 새로운 팀 상태 추가

```tsx
interface ExtendedPlayerStatus extends PlayerStatus {
  red: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
    hasBonus?: boolean; // 새로운 상태
  };
  blue: {
    hasShield: boolean;
    isWinner: boolean;
    position?: number;
    hasBonus?: boolean; // 새로운 상태
  };
}
```

### 커스텀 플레이어 카드

```tsx
const CustomPlayerCard = ({ player, status }) => (
  <div className="custom-player-card">
    {/* 커스텀 디자인 */}
  </div>
);
```

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

더 자세한 사용법과 예제는 [TeamScoreboardUsageGuide.md](./TeamScoreboardUsageGuide.md)를 참고하세요.

## 🤝 기여하기

1. 새로운 팀 상태 추가
2. 새로운 스타일링 옵션 추가
3. 접근성 개선
4. 성능 최적화
5. 새로운 유틸리티 함수 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Team Scoreboard & Player List**로 더욱 쉽고 빠르게 팀 기반 게임을 구현하세요! 🏆✨
