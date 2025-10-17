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

// 팀 마스코트 정의
export const TEAM_MASCOTS: { [key in TeamColor]: string } = {
  blue: '🐻', // Bear
  red: '🦊'   // Fox
};

// 목업 플레이어 데이터 (총 11명: Team A 6명, Team B 5명)
export const MOCK_PLAYERS: Omit<Player, 'team'>[] = [
  { id: 'p1', name: 'Emily', avatarEmoji: '👩‍🦰' },
  { id: 'p2', name: 'John', avatarEmoji: '👨‍🦱' },
  { id: 'p3', name: 'Olivia', avatarEmoji: '👩🏻‍🦱' },
  { id: 'p4', name: 'Mike', avatarEmoji: '👨🏼‍🦳' },
  { id: 'p5', name: 'James', avatarEmoji: '👨🏽‍🦱' },
  { id: 'p6', name: 'Lily', avatarEmoji: '👩🏻‍🦳' },
  { id: 'p7', name: 'Jacob', avatarEmoji: '🧑🏾‍🦱' },
  { id: 'p8', name: 'Bella', avatarEmoji: '👱‍♀️' },
  { id: 'p9', name: 'David', avatarEmoji: '🧑🏻‍🦰' },
  { id: 'p10', name: 'Tom', avatarEmoji: '👨🏻‍🎤' },
  { id: 'p11', name: 'Alice', avatarEmoji: '👩🏼‍🎤' }
];

// 팀 초기화 유틸리티 함수 (커스터마이징 가능)
export const initializeTeams = (
  players: Omit<Player, 'team'>[] = MOCK_PLAYERS,
  teamASize: number = 6
): Teams => {
  const blue: Player[] = [];
  const red: Player[] = [];
  
  // Team A (blue)에 지정된 수만큼 배치
  players.slice(0, teamASize).forEach((player) => {
    blue.push({ ...player, team: 'blue' });
  });
  
  // Team B (red)에 나머지 배치
  players.slice(teamASize).forEach((player) => {
    red.push({ ...player, team: 'red' });
  });
  
  return { blue, red };
};

// 팀 셔플 유틸리티 함수
export const shuffleTeams = (teams: Teams): Teams => {
  const allPlayers = [...teams.blue, ...teams.red].sort(() => Math.random() - 0.5);
  const blue: Player[] = [];
  const red: Player[] = [];
  
  allPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      blue.push({ ...player, team: 'blue' });
    } else {
      red.push({ ...player, team: 'red' });
    }
  });
  
  return { blue, red };
};

// 플레이어 생성 헬퍼 함수
export const createPlayer = (
  id: string, 
  name: string, 
  avatarEmoji: string, 
  team: TeamColor = 'blue'
): Player => ({
  id,
  name,
  avatarEmoji,
  team
});

// 팀 밸런스 체크 함수
export const checkTeamBalance = (teams: Teams): {
  isBalanced: boolean;
  teamDifference: number;
  totalPlayers: number;
} => {
  const teamACount = teams.blue.length;
  const teamBCount = teams.red.length;
  const totalPlayers = teamACount + teamBCount;
  const teamDifference = Math.abs(teamACount - teamBCount);
  
  return {
    isBalanced: teamDifference <= 1,
    teamDifference,
    totalPlayers
  };
};

// 팀 설정 검증 함수
export const validateTeamSetup = (
  teams: Teams,
  minTotalPlayers: number = 2,
  maxTeamDifference: number = 1
): {
  isValid: boolean;
  errors: string[];
} => {
  const { totalPlayers, teamDifference } = checkTeamBalance(teams);
  const errors: string[] = [];
  
  if (totalPlayers < minTotalPlayers) {
    errors.push(`At least ${minTotalPlayers} players are required`);
  }
  
  if (teamDifference > maxTeamDifference) {
    errors.push(`Team size difference must be ${maxTeamDifference} player or less`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 커스텀 팀 설정 생성 함수
export const createCustomTeamSetup = (
  players: Omit<Player, 'team'>[],
  teamNames: { blue: string; red: string } = { blue: "Team A", red: "Team B" },
  initialDistribution?: { blue: number; red: number }
): Teams => {
  if (initialDistribution) {
    const blue: Player[] = [];
    const red: Player[] = [];
    
    // 지정된 분배에 따라 팀 구성
    players.slice(0, initialDistribution.blue).forEach((player) => {
      blue.push({ ...player, team: 'blue' });
    });
    
    players.slice(initialDistribution.blue, initialDistribution.blue + initialDistribution.red).forEach((player) => {
      red.push({ ...player, team: 'red' });
    });
    
    return { blue, red };
  }
  
  // 기본 균등 분배
  return initializeTeams(players, Math.ceil(players.length / 2));
};

// 기본 설정 상수들
export const DEFAULT_TEAM_SETUP_CONFIG = {
  maxPlayersPerTeam: 8,
  validationRules: {
    minTotalPlayers: 2,
    maxTeamDifference: 1
  },
  teamNames: {
    blue: "Team A",
    red: "Team B"
  },
  buttonTexts: {
    shuffle: "Shuffle Teams",
    start: "Start Game!",
    close: "Close"
  }
} as const;
