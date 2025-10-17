import React, { useState } from 'react';
import TeamSetupScreen from './TeamSetupScreen';
import { 
  initializeTeams, 
  shuffleTeams, 
  MOCK_PLAYERS,
  DEFAULT_TEAM_SETUP_CONFIG,
  validateTeamSetup,
  createPlayer,
  type Teams 
} from './team-setup-types';

// 예시 1: 기본 사용법
export const BasicTeamSetupExample: React.FC = () => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));
  const [showTeamSetup, setShowTeamSetup] = useState(false);

  const handleShuffle = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStart = () => {
    console.log('게임 시작!', teams);
    setShowTeamSetup(false);
    // 여기에 게임 시작 로직 추가
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      {showTeamSetup && (
        <div className="absolute inset-0 bg-white z-50">
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffle}
            onStart={handleStart}
            onTeamsChange={handleTeamsChange}
            onClose={() => setShowTeamSetup(false)}
          />
        </div>
      )}
      
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-white">Team Setup Example</h1>
        <button
          onClick={() => setShowTeamSetup(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Open Team Setup
        </button>
      </div>
    </div>
  );
};

// 예시 2: 커스터마이징된 설정
export const CustomizedTeamSetupExample: React.FC = () => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));
  const [showTeamSetup, setShowTeamSetup] = useState(false);

  const handleShuffle = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStart = () => {
    console.log('커스텀 게임 시작!', teams);
    setShowTeamSetup(false);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-600">
      {showTeamSetup && (
        <div className="absolute inset-0 bg-white z-50">
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffle}
            onStart={handleStart}
            onTeamsChange={handleTeamsChange}
            onClose={() => setShowTeamSetup(false)}
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
        </div>
      )}
      
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-white">Customized Team Setup</h1>
        <button
          onClick={() => setShowTeamSetup(true)}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Open Custom Team Setup
        </button>
      </div>
    </div>
  );
};

// 예시 3: 게임 통합 예시
export const GameIntegrationExample: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<'menu' | 'team-setup' | 'playing' | 'game-over'>('menu');
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));
  const [gameScore, setGameScore] = useState({ blue: 0, red: 0 });

  const handleShuffle = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStartGame = () => {
    setGamePhase('playing');
    console.log('Starting game with teams:', teams);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  const handleBackToMenu = () => {
    setGamePhase('menu');
  };

  const handleEndGame = () => {
    setGamePhase('game-over');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
      {gamePhase === 'menu' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8 text-white">My Awesome Game</h1>
            <button
              onClick={() => setGamePhase('team-setup')}
              className="px-8 py-4 text-2xl bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Start New Game
            </button>
          </div>
        </div>
      )}

      {gamePhase === 'team-setup' && (
        <div className="absolute inset-0 bg-white z-50">
          <TeamSetupScreen
            teams={teams}
            onShuffle={handleShuffle}
            onStart={handleStartGame}
            onTeamsChange={handleTeamsChange}
            onClose={handleBackToMenu}
            title="Game Setup"
            teamNames={{
              blue: "Blue Team",
              red: "Red Team"
            }}
            buttonTexts={{
              shuffle: "Shuffle",
              start: "Start Game!",
              close: "Back to Menu"
            }}
          />
        </div>
      )}

      {gamePhase === 'playing' && (
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-white">Game in Progress</h1>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Blue Team Score: {gameScore.blue}</h2>
              <ul>
                {teams.blue.map(player => (
                  <li key={player.id}>{player.avatarEmoji} {player.name}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Red Team Score: {gameScore.red}</h2>
              <ul>
                {teams.red.map(player => (
                  <li key={player.id}>{player.avatarEmoji} {player.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={handleEndGame}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            End Game
          </button>
        </div>
      )}

      {gamePhase === 'game-over' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8 text-white">Game Over!</h1>
            <div className="text-2xl mb-8 text-white">
              <p>Blue Team: {gameScore.blue} points</p>
              <p>Red Team: {gameScore.red} points</p>
            </div>
            <button
              onClick={() => {
                setGamePhase('menu');
                setGameScore({ blue: 0, red: 0 });
              }}
              className="px-8 py-4 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 예시 4: 훅으로 분리한 사용법
export const useTeamSetup = (initialPlayers = MOCK_PLAYERS) => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(initialPlayers));
  const [showSetup, setShowSetup] = useState(false);

  const shuffleTeams = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const updateTeams = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  const openSetup = () => setShowSetup(true);
  const closeSetup = () => setShowSetup(false);

  const TeamSetupComponent: React.FC<{
    onStart: () => void;
    config?: any;
  }> = ({ onStart, config = {} }) => {
    if (!showSetup) return null;

    return (
      <div className="absolute inset-0 bg-white z-50">
        <TeamSetupScreen
          teams={teams}
          onShuffle={shuffleTeams}
          onStart={() => {
            onStart();
            closeSetup();
          }}
          onTeamsChange={updateTeams}
          onClose={closeSetup}
          {...config}
        />
      </div>
    );
  };

  return {
    teams,
    showSetup,
    openSetup,
    closeSetup,
    shuffleTeams,
    updateTeams,
    TeamSetupComponent
  };
};

// 기본 export (기존 호환성 유지)
const TeamSetupExample: React.FC = () => {
  return <BasicTeamSetupExample />;
};

export default TeamSetupExample;
