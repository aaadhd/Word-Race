// 팀 점수판 및 팀 인원 리스트 관련 타입 정의
export type Team = 'red' | 'blue';

export type TeamColor = 'blue' | 'red';

export interface Player {
  id: string;
  name: string;
  avatarEmoji: string;
  team?: TeamColor;
}

export interface Teams {
  blue: Player[];
  red: Player[];
}

export interface TeamScores {
  red: number;
  blue: number;
}

export interface PlayerStatus {
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

// 팀 색상 정의
export const TEAM_COLORS = {
  red: {
    primary: '#0891b2', // Cyan 색상
    bg: '#ecfeff',
    text: 'text-[#0891b2]',
    bgClass: 'bg-[#0891b2]',
    bgLight: 'bg-[#ecfeff]',
    border: 'border-[#0891b2]',
    hoverBgLight: 'hover:bg-[#ecfeff]',
    hoverBorder: 'hover:border-[#0891b2]',
  },
  blue: {
    primary: '#9333ea', // Purple 색상
    bg: '#faf5ff',
    text: 'text-[#9333ea]',
    bgClass: 'bg-[#9333ea]',
    bgLight: 'bg-[#faf5ff]',
    border: 'border-[#9333ea]',
    hoverBgLight: 'hover:bg-[#faf5ff]',
    hoverBorder: 'hover:border-[#9333ea]',
  },
};

// 컴포넌트 Props 타입들
export interface TeamScoreboardProps {
  scores: TeamScores;
  currentRound: number;
  timeLeft?: number;
  teams: Teams;
  playerStatus?: PlayerStatus;
  showTimeLeft?: boolean;
  showPlayerList?: boolean;
  maxPlayersToShow?: number;
  customStyles?: {
    primaryColor?: 'red' | 'blue';
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export interface TeamPlayerListProps {
  teams: Teams;
  currentRound: number;
  playerStatus?: PlayerStatus;
  maxPlayersToShow?: number;
  showCurrentPlayer?: boolean;
  customStyles?: {
    teamAColor?: string;
    teamBColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface ScoreDisplayProps {
  team: Team;
  score: number;
  teamName?: string;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    scoreColor?: string;
  };
}

// 드래그 앤 드롭 관련 타입
export interface DragItem {
  player: Player;
  sourceTeam: TeamColor;
  sourceIndex: number;
}

// 팀 관련 유틸리티 함수들
export const createPlayer = (id: string, name: string, avatarEmoji: string): Player => ({
  id,
  name,
  avatarEmoji
});

export const initializeTeams = (players: Omit<Player, 'team'>[], teamASize?: number): Teams => {
  const totalPlayers = players.length;
  const defaultTeamASize = teamASize || Math.ceil(totalPlayers / 2);
  
  const blue: Player[] = [];
  const red: Player[] = [];
  
  // Team A (blue)에 지정된 수만큼 배치
  players.slice(0, defaultTeamASize).forEach((player) => {
    blue.push({ ...player, team: 'blue' });
  });
  
  // Team B (red)에 나머지 배치
  players.slice(defaultTeamASize).forEach((player) => {
    red.push({ ...player, team: 'red' });
  });
  
  return { blue, red };
};

export const shuffleTeams = (teams: Teams): Teams => {
  const allPlayers = [...teams.blue, ...teams.red];
  
  // Fisher-Yates 셔플 알고리즘
  for (let i = allPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
  }
  
  // 팀 재배치 (기존 비율 유지)
  const teamASize = teams.blue.length;
  const newBlue = allPlayers.slice(0, teamASize).map(player => ({ ...player, team: 'blue' as TeamColor }));
  const newRed = allPlayers.slice(teamASize).map(player => ({ ...player, team: 'red' as TeamColor }));
  
  return { blue: newBlue, red: newRed };
};

export const checkTeamBalance = (teams: Teams): { isBalanced: boolean; difference: number } => {
  const teamASize = teams.blue.length;
  const teamBSize = teams.red.length;
  const difference = Math.abs(teamASize - teamBSize);
  
  return {
    isBalanced: difference <= 1, // 1명 차이까지는 균형잡힌 것으로 간주
    difference
  };
};

export const validateTeamSetup = (teams: Teams): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (teams.blue.length === 0) {
    errors.push('Team A에 최소 1명의 플레이어가 필요합니다.');
  }
  
  if (teams.red.length === 0) {
    errors.push('Team B에 최소 1명의 플레이어가 필요합니다.');
  }
  
  if (teams.blue.length + teams.red.length < 2) {
    errors.push('최소 2명의 플레이어가 필요합니다.');
  }
  
  const balance = checkTeamBalance(teams);
  if (!balance.isBalanced) {
    errors.push(`팀 밸런스가 맞지 않습니다. (${balance.difference}명 차이)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createCustomTeamSetup = (
  players: Omit<Player, 'team'>[],
  teamADistribution: number[]
): Teams => {
  const blue: Player[] = [];
  const red: Player[] = [];
  
  teamADistribution.forEach((playerIndex, teamAIndex) => {
    if (playerIndex < players.length) {
      const player = players[playerIndex];
      blue.push({ ...player, team: 'blue' });
    }
  });
  
  // 나머지 플레이어들을 Team B에 배치
  const usedIndices = new Set(teamADistribution);
  players.forEach((player, index) => {
    if (!usedIndices.has(index)) {
      red.push({ ...player, team: 'red' });
    }
  });
  
  return { blue, red };
};

// 점수 관련 유틸리티 함수들
export const updateTeamScore = (scores: TeamScores, team: Team, points: number): TeamScores => {
  return {
    ...scores,
    [team]: scores[team] + points
  };
};

export const resetTeamScores = (): TeamScores => ({
  red: 0,
  blue: 0
});

export const getWinningTeam = (scores: TeamScores): Team | null => {
  if (scores.red > scores.blue) return 'red';
  if (scores.blue > scores.red) return 'blue';
  return null;
};

export const getTeamLeader = (scores: TeamScores): { team: Team; score: number } | null => {
  const winner = getWinningTeam(scores);
  if (!winner) return null;
  
  return {
    team: winner,
    score: scores[winner]
  };
};

// 플레이어 회전 관련 유틸리티
export const getRotatedPlayers = (team: Player[], currentRound: number): Player[] => {
  const rotationOffset = (currentRound - 1) % team.length;
  return [...team.slice(rotationOffset), ...team.slice(0, rotationOffset)];
};

export const getCurrentPlayer = (team: Player[], currentRound: number): Player => {
  const rotatedPlayers = getRotatedPlayers(team, currentRound);
  return rotatedPlayers[0];
};

// 기본 설정값들
export const DEFAULT_TEAM_SCORES: TeamScores = {
  red: 0,
  blue: 0
};

export const DEFAULT_PLAYER_STATUS: PlayerStatus = {
  red: {
    hasShield: false,
    isWinner: false
  },
  blue: {
    hasShield: false,
    isWinner: false
  }
};

// 샘플 플레이어 데이터
export const SAMPLE_PLAYERS: Omit<Player, 'team'>[] = [
  { id: 'p1', name: 'Emily', avatarEmoji: '👩‍🦰' },
  { id: 'p2', name: 'John', avatarEmoji: '👨‍🦱' },
  { id: 'p3', name: 'Sarah', avatarEmoji: '👩‍🦳' },
  { id: 'p4', name: 'Mike', avatarEmoji: '👨‍💼' },
  { id: 'p5', name: 'Lisa', avatarEmoji: '👩‍🎓' },
  { id: 'p6', name: 'David', avatarEmoji: '👨‍🔬' },
  { id: 'p7', name: 'Anna', avatarEmoji: '👩‍⚕️' },
  { id: 'p8', name: 'Tom', avatarEmoji: '👨‍🚀' },
  { id: 'p9', name: 'Kate', avatarEmoji: '👩‍🎨' },
  { id: 'p10', name: 'Ben', avatarEmoji: '👨‍🍳' },
  { id: 'p11', name: 'Alice', avatarEmoji: '👩🏼‍🎤' }
];

// 팀별 기본 설정
export const DEFAULT_TEAM_CONFIG = {
  maxPlayersPerTeam: 8,
  defaultTeamASize: 6,
  defaultTeamBSize: 5,
  rotationEnabled: true,
  scoreDisplayEnabled: true,
  playerListEnabled: true
};
