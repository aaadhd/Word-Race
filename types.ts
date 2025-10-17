export enum GameState {
  SETUP = 'SETUP',
  TEAM_SETUP = 'TEAM_SETUP',
  ROUND_START = 'ROUND_START',
  TRACING = 'TRACING',
  QUIZ = 'QUIZ',
  GAME_END = 'GAME_END',
}

export enum Team {
  A = 'A',
  B = 'B',
}

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

export enum GameMode {
  TRACE = 'TRACE',
  DRAW = 'DRAW',
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface RoundData {
  word: string;
  quiz: Quiz;
  wordImage?: string; // Optional: base64 string for the word's image
}

export interface Scores {
  [Team.A]: number;
  [Team.B]: number;
}

export interface TracingResult {
  team: Team;
  accuracy: number;
  finishTime: number; // Timestamp of when the tracing was completed
  hasDrawn: boolean;
}