# 🎮 Team Setup 컴포넌트 재사용 가이드

이 가이드는 Reference 폴더의 Team Setup 화면을 다른 게임에 재사용하는 방법을 설명합니다.

## 📁 파일 구조

```
reference/
├── TeamSetupScreen.tsx          # 메인 컴포넌트 (업데이트됨)
├── team-setup-types.ts          # 타입 정의 및 유틸리티 (확장됨)
├── TeamSetupExample.tsx         # 다양한 사용 예시 (확장됨)
├── TeamSetupScreen-Reference.md # 기존 참조 문서
└── TeamSetupUsageGuide.md       # 이 파일 (새로 추가)
```

## 🚀 빠른 시작

### 1. 기본 사용법

```tsx
import TeamSetupScreen from './reference/TeamSetupScreen';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './reference/team-setup-types';
import type { Teams } from './reference/team-setup-types';

function MyGame() {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));
  const [showSetup, setShowSetup] = useState(false);

  const handleShuffle = () => {
    setTeams(shuffleTeams(teams));
  };

  const handleStart = () => {
    console.log('게임 시작:', teams);
    setShowSetup(false);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  return (
    <div>
      {showSetup && (
        <div className="absolute inset-0 bg-white z-50">
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffle}
            onStart={handleStart}
            onTeamsChange={handleTeamsChange}
            onClose={() => setShowSetup(false)}
          />
        </div>
      )}
      <button onClick={() => setShowSetup(true)}>
        팀 설정 열기
      </button>
    </div>
  );
}
```

### 2. 커스터마이징된 설정

```tsx
<TeamSetupScreen
  teams={teams}
  onShuffle={handleShuffle}
  onStart={handleStart}
  onTeamsChange={handleTeamsChange}
  title="토너먼트 설정"
  maxPlayersPerTeam={6}
  validationRules={{
    minTotalPlayers: 4,
    maxTeamDifference: 2
  }}
  teamNames={{
    blue: "알파 팀",
    red: "베타 팀"
  }}
  buttonTexts={{
    shuffle: "랜덤 배치",
    start: "토너먼트 시작!",
    close: "취소"
  }}
/>
```

## 🛠️ 주요 기능

### ✨ 드래그 앤 드롭
- 플레이어를 마우스로 드래그하여 팀 간 이동
- 직관적인 그리드 기반 배치 시스템
- 실시간 팀 구성 업데이트

### 🎲 팀 셔플
- 원클릭으로 팀 자동 재배치
- 균등한 분배 보장

### ✅ 유효성 검사
- 최소 플레이어 수 확인
- 팀 밸런스 검증
- 사용자 친화적인 오류 메시지

### 🎨 완전 커스터마이징
- 제목, 팀명, 버튼 텍스트 변경
- 검증 규칙 조정
- 최대 팀원 수 설정
- 모달 닫기 기능

## 📋 Props API

### TeamSetupScreen Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `teams` | `Teams` | - | 현재 팀 구성 |
| `onShuffle` | `() => void` | - | 팀 셔플 콜백 |
| `onStart` | `() => void` | - | 게임 시작 콜백 |
| `onTeamsChange` | `(teams: Teams) => void` | - | 팀 변경 콜백 |
| `onClose` | `() => void` | - | 닫기 콜백 (선택사항) |
| `title` | `string` | "Team Setup" | 화면 제목 |
| `maxPlayersPerTeam` | `number` | 8 | 팀당 최대 플레이어 수 |
| `validationRules` | `object` | `{minTotalPlayers: 2, maxTeamDifference: 1}` | 검증 규칙 |
| `teamNames` | `object` | `{blue: "Team A", red: "Team B"}` | 팀 이름 |
| `buttonTexts` | `object` | `{shuffle: "Shuffle Teams", start: "Start Game!", close: "Close"}` | 버튼 텍스트 |

### Teams 타입

```tsx
interface Teams {
  blue: Player[];
  red: Player[];
}

interface Player {
  id: string;
  name: string;
  avatarEmoji: string;
  team: TeamColor;
}
```

## 🔧 유틸리티 함수

### `initializeTeams(players?, teamASize?)`
팀을 초기화합니다.

```tsx
const teams = initializeTeams(MOCK_PLAYERS, 6);
```

### `shuffleTeams(teams)`
팀을 랜덤하게 재배치합니다.

```tsx
const shuffledTeams = shuffleTeams(teams);
```

### `validateTeamSetup(teams, minTotalPlayers?, maxTeamDifference?)`
팀 설정의 유효성을 검사합니다.

```tsx
const validation = validateTeamSetup(teams, 4, 2);
if (!validation.isValid) {
  console.log('오류:', validation.errors);
}
```

### `checkTeamBalance(teams)`
팀 밸런스를 확인합니다.

```tsx
const balance = checkTeamBalance(teams);
console.log(`총 플레이어: ${balance.totalPlayers}`);
console.log(`팀 차이: ${balance.teamDifference}`);
console.log(`균형 상태: ${balance.isBalanced}`);
```

### `createPlayer(id, name, avatarEmoji, team?)`
새 플레이어를 생성합니다.

```tsx
const newPlayer = createPlayer('p12', 'New Player', '🎮', 'blue');
```

### `createCustomTeamSetup(players, teamNames?, initialDistribution?)`
커스텀 팀 설정을 생성합니다.

```tsx
const customTeams = createCustomTeamSetup(
  players,
  { blue: "Alpha", red: "Beta" },
  { blue: 5, red: 6 }
);
```

## 🎯 게임 통합 예시

### 1. 게임 상태와 통합

```tsx
function MyGame() {
  const [gameState, setGameState] = useState('menu');
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));

  const handleStartGame = () => {
    setGameState('playing');
    // 게임 로직 시작
  };

  return (
    <div>
      {gameState === 'team-setup' && (
        <div className="absolute inset-0 bg-white z-50">
          <TeamSetupScreen
            teams={teams}
            onShuffle={() => setTeams(shuffleTeams(teams))}
            onStart={handleStartGame}
            onTeamsChange={setTeams}
            onClose={() => setGameState('menu')}
          />
        </div>
      )}
    </div>
  );
}
```

### 2. 커스텀 훅 사용

```tsx
import { useTeamSetup } from './reference/TeamSetupExample';

function MyGame() {
  const { teams, openSetup, TeamSetupComponent } = useTeamSetup();

  const handleStart = () => {
    console.log('게임 시작:', teams);
  };

  return (
    <div>
      <button onClick={openSetup}>팀 설정</button>
      <TeamSetupComponent 
        onStart={handleStart}
        config={{
          title: "My Game Setup",
          teamNames: { blue: "Team A", red: "Team B" }
        }}
      />
    </div>
  );
}
```

## 🎨 스타일링

컴포넌트는 Tailwind CSS를 사용합니다. 다음 클래스들이 사용됩니다:

- `text-accent-yellow`: 제목 색상
- `bg-gradient-to-r from-blue-400 to-blue-500`: 파란색 그라데이션
- `bg-gradient-to-r from-red-400 to-red-500`: 빨간색 그라데이션
- `hover:scale-105`: 호버 효과

커스텀 스타일을 적용하려면 CSS 클래스를 오버라이드하거나 props를 통해 스타일을 전달할 수 있습니다.

## 🔍 디버깅

### 일반적인 문제들

1. **타입 오류**: TypeScript 타입을 올바르게 import했는지 확인
2. **스타일 문제**: Tailwind CSS가 올바르게 설정되었는지 확인
3. **이벤트 핸들러**: 콜백 함수들이 올바르게 전달되었는지 확인

### 개발자 도구

```tsx
// 팀 상태 디버깅
console.log('Current teams:', teams);

// 검증 결과 확인
const validation = validateTeamSetup(teams);
console.log('Validation result:', validation);

// 팀 밸런스 확인
const balance = checkTeamBalance(teams);
console.log('Team balance:', balance);
```

## 📚 사용 예시

Reference 폴더의 `TeamSetupExample.tsx` 파일에서 다양한 사용 예시를 확인할 수 있습니다:

1. **BasicTeamSetupExample**: 기본 사용법
2. **CustomizedTeamSetupExample**: 커스터마이징된 설정
3. **GameIntegrationExample**: 게임 통합 예시
4. **useTeamSetup**: 커스텀 훅 사용법

## 🚀 마이그레이션 가이드

기존 Team Setup을 사용하고 있다면:

1. **Props 업데이트**: 새로운 선택적 props들을 활용
2. **타입 import 변경**: `./team-setup-types`에서 import
3. **유틸리티 함수 활용**: 새로 추가된 헬퍼 함수들 사용

```tsx
// 기존
import { initializeTeams, shuffleTeams } from './constants/teamSetup';

// 새로운 방식
import { 
  initializeTeams, 
  shuffleTeams,
  validateTeamSetup,
  checkTeamBalance 
} from './reference/team-setup-types';
```

## 🤝 확장 가능성

이 컴포넌트는 다음과 같이 확장할 수 있습니다:

1. **더 많은 팀**: 3팀 이상으로 확장
2. **플레이어 수 조정**: 팀당 최대 인원 변경
3. **커스텀 아바타**: 이미지나 아이콘으로 변경
4. **저장/불러오기**: 팀 구성을 로컬 스토리지에 저장
5. **다국어 지원**: i18n 라이브러리와 통합

## 📋 체크리스트

다른 게임에 적용할 때 확인사항:

- [ ] Tailwind CSS 설정 확인
- [ ] TypeScript 타입 정의 확인
- [ ] 필요한 props 전달 확인
- [ ] 이벤트 핸들러 구현 확인
- [ ] 스타일링 커스터마이징 확인
- [ ] 검증 규칙 설정 확인
- [ ] 팀 데이터 구조 확인

---

이 가이드를 통해 Team Setup 컴포넌트를 다양한 게임에 성공적으로 통합할 수 있습니다! 🎮✨
