export enum GameState {
  SETUP = 'SETUP',
  ROUND_START = 'ROUND_START',
  TRACING = 'TRACING',
  QUIZ = 'QUIZ',
  GAME_END = 'GAME_END',
}

export enum Team {
  A = 'A',
  B = 'B',
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