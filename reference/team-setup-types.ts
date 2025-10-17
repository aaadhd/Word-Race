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

// 팀 초기화 유틸리티 함수 (Team A: 6명, Team B: 5명)
export const initializeTeams = (players: Omit<Player, 'team'>[]) => {
  const blue: Player[] = [];
  const red: Player[] = [];
  
  // Team A (blue)에 처음 6명 배치
  players.slice(0, 6).forEach((player) => {
    blue.push({ ...player, team: 'blue' });
  });
  
  // Team B (red)에 나머지 5명 배치
  players.slice(6).forEach((player) => {
    red.push({ ...player, team: 'red' });
  });
  
  return { blue, red };
};

// 팀 셔플 유틸리티 함수
export const shuffleTeams = (teams: Teams) => {
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
