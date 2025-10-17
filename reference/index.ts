// Game Settings Modal & Team Scoreboard - 재사용 가능한 게임 컴포넌트들
// 모든 exports를 한 곳에서 관리

// ===== Game Settings Modal =====
export { default as GameSettingsModal } from './GameSettingsModal';
export {
  GameSettings,
  GameSettingsModalProps,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_LESSONS,
  DEFAULT_LEARNING_FOCUS,
  GAME_CUSTOMIZATIONS,
  validateGameSettings,
  initializeGameSettings,
  createSettingsUpdater
} from './game-settings-types';
export {
  BasicGameSettingsExample,
  StopAndGoGameExample,
  MathQuizGameExample,
  CustomGameExample,
  GameIntegrationExample
} from './GameSettingsExamples';

// ===== Team Scoreboard & Player List =====
export { default as TeamScoreboard } from './TeamScoreboard';
export { default as TeamPlayerList } from './TeamPlayerList';
export {
  Team,
  TeamColor,
  Player,
  Teams,
  TeamScores,
  PlayerStatus,
  TeamScoreboardProps,
  TeamPlayerListProps,
  ScoreDisplayProps,
  DragItem,
  TEAM_COLORS,
  createPlayer,
  initializeTeams,
  shuffleTeams,
  checkTeamBalance,
  validateTeamSetup,
  createCustomTeamSetup,
  updateTeamScore,
  resetTeamScores,
  getWinningTeam,
  getTeamLeader,
  getRotatedPlayers,
  getCurrentPlayer,
  DEFAULT_TEAM_SCORES,
  DEFAULT_PLAYER_STATUS,
  SAMPLE_PLAYERS,
  DEFAULT_TEAM_CONFIG
} from './team-scoreboard-types';
export {
  BasicTeamScoreboardExample,
  TeamPlayerListOnlyExample,
  CustomStyledTeamScoreboardExample,
  DynamicTeamScoreboardExample,
  CompleteGameIntegrationExample
} from './TeamScoreboardExamples';

// ===== Team Setup (기존) =====
export { default as TeamSetupScreen } from './TeamSetupScreen';
export {
  TeamSetupScreenProps,
  PlayerCardProps,
  TeamBoxProps,
  TeamSetupConfig,
  DEFAULT_TEAM_SETUP_CONFIG
} from './team-setup-types';
export {
  BasicTeamSetupExample,
  CustomizedTeamSetupExample,
  GameIntegrationExample as TeamSetupGameIntegrationExample,
  useTeamSetup
} from './TeamSetupExample';

// ===== Quiz Popup =====
export { default as QuizPopup } from './QuizPopup';
export {
  QuizOption,
  QuizStimulus,
  QuizData
} from './QuizPopup';
export {
  BasicQuizExample,
  CustomStyledQuizExample,
  ImageQuizExample,
  SentenceQuizExample,
  NoTimerQuizExample,
  GameIntegrationExample as QuizGameIntegrationExample,
  createQuiz,
  createMultipleChoiceQuiz,
  QUIZ_PRESETS
} from './QuizPopupExamples';

// 타입 별칭들 (편의를 위해)
export type { GameSettings as Settings } from './game-settings-types';
export type { GameSettingsModalProps as Props } from './game-settings-types';
export type { TeamScoreboardProps as ScoreboardProps } from './team-scoreboard-types';
export type { TeamPlayerListProps as PlayerListProps } from './team-scoreboard-types';
export type { QuizData as Quiz } from './QuizPopup';
