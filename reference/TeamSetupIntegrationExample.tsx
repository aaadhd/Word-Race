import React, { useState } from 'react';
import TeamSetupScreen from './TeamSetupScreen';
import { 
  initializeTeams, 
  shuffleTeams, 
  MOCK_PLAYERS,
  createPlayer,
  validateTeamSetup,
  checkTeamBalance,
  type Teams 
} from './team-setup-types';

// 다른 게임에서 Team Setup을 통합하는 완전한 예시

// 게임 상태 타입 정의
type GamePhase = 'menu' | 'settings' | 'team-setup' | 'playing' | 'paused' | 'game-over';

// 게임 설정 타입
interface GameSettings {
  gameMode: 'classic' | 'tournament' | 'custom';
  rounds: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 게임 점수 타입
interface GameScore {
  blue: number;
  red: number;
  round: number;
  winner: 'blue' | 'red' | null;
}

// 메인 게임 컴포넌트
export const TeamSetupIntegrationExample: React.FC = () => {
  // 게임 상태 관리
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gameMode: 'classic',
    rounds: 3,
    timeLimit: 60,
    difficulty: 'medium'
  });
  const [gameScore, setGameScore] = useState<GameScore>({
    blue: 0,
    red: 0,
    round: 1,
    winner: null
  });

  // 팀 설정 관련 핸들러
  const handleShuffleTeams = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  const handleStartGameFromTeamSetup = () => {
    // 팀 설정 검증
    const validation = validateTeamSetup(teams);
    if (!validation.isValid) {
      console.error('팀 설정이 유효하지 않습니다:', validation.errors);
      return;
    }

    // 팀 밸런스 확인
    const balance = checkTeamBalance(teams);
    console.log('팀 밸런스:', balance);

    // 게임 시작
    setGamePhase('playing');
    console.log('게임 시작! 팀 구성:', teams);
  };

  const handleBackToMenu = () => {
    setGamePhase('menu');
  };

  // 게임 설정 관련 핸들러
  const handleGameModeChange = (mode: GameSettings['gameMode']) => {
    setGameSettings(prev => ({ ...prev, gameMode: mode }));
  };

  const handleRoundsChange = (rounds: number) => {
    setGameSettings(prev => ({ ...prev, rounds }));
  };

  const handleDifficultyChange = (difficulty: GameSettings['difficulty']) => {
    setGameSettings(prev => ({ ...prev, difficulty }));
  };

  // 게임 플레이 관련 핸들러
  const handleEndRound = (winner: 'blue' | 'red') => {
    setGameScore(prev => ({
      ...prev,
      [winner]: prev[winner] + 1,
      winner
    }));

    if (gameScore.round >= gameSettings.rounds) {
      setGamePhase('game-over');
    } else {
      setGameScore(prev => ({ ...prev, round: prev.round + 1 }));
    }
  };

  const handlePauseGame = () => {
    setGamePhase('paused');
  };

  const handleResumeGame = () => {
    setGamePhase('playing');
  };

  const handleEndGame = () => {
    setGamePhase('game-over');
  };

  const handleResetGame = () => {
    setGameScore({ blue: 0, red: 0, round: 1, winner: null });
    setTeams(initializeTeams(MOCK_PLAYERS));
    setGamePhase('menu');
  };

  // 플레이어 추가/제거 (고급 기능)
  const handleAddPlayer = () => {
    const newPlayer = createPlayer(
      `p${Date.now()}`,
      `Player ${teams.blue.length + teams.red.length + 1}`,
      '🎮'
    );
    
    // 팀에 자동 배치 (더 적은 팀에)
    const newTeams = { ...teams };
    if (newTeams.blue.length <= newTeams.red.length) {
      newTeams.blue.push({ ...newPlayer, team: 'blue' });
    } else {
      newTeams.red.push({ ...newPlayer, team: 'red' });
    }
    
    setTeams(newTeams);
  };

  // 렌더링 함수들
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="text-center bg-white/90 p-12 rounded-3xl shadow-2xl">
        <h1 className="text-6xl font-bold mb-8 text-gray-800">My Awesome Game</h1>
        <div className="space-y-4">
          <button
            onClick={() => setGamePhase('settings')}
            className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            게임 설정
          </button>
          <button
            onClick={() => setGamePhase('team-setup')}
            className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            팀 설정
          </button>
          <button
            onClick={() => setGamePhase('team-setup')}
            className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            바로 시작
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
      <div className="bg-white/90 p-12 rounded-3xl shadow-2xl max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-8 text-center">게임 설정</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">게임 모드</label>
            <select
              value={gameSettings.gameMode}
              onChange={(e) => handleGameModeChange(e.target.value as GameSettings['gameMode'])}
              className="w-full p-3 border rounded-lg text-lg"
            >
              <option value="classic">클래식</option>
              <option value="tournament">토너먼트</option>
              <option value="custom">커스텀</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">라운드 수: {gameSettings.rounds}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={gameSettings.rounds}
              onChange={(e) => handleRoundsChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">난이도</label>
            <div className="flex space-x-4">
              {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyChange(difficulty)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    gameSettings.difficulty === difficulty
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {difficulty === 'easy' ? '쉬움' : difficulty === 'medium' ? '보통' : '어려움'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBackToMenu}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            뒤로
          </button>
          <button
            onClick={() => setGamePhase('team-setup')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            팀 설정으로
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamSetup = () => (
    <div className="absolute inset-0 bg-white z-50">
      <TeamSetupScreen
        teams={teams}
        onShuffle={handleShuffleTeams}
        onStart={handleStartGameFromTeamSetup}
        onTeamsChange={handleTeamsChange}
        onClose={handleBackToMenu}
        title={`${gameSettings.gameMode === 'classic' ? '클래식' : gameSettings.gameMode === 'tournament' ? '토너먼트' : '커스텀'} 모드`}
        maxPlayersPerTeam={gameSettings.gameMode === 'tournament' ? 6 : 8}
        validationRules={{
          minTotalPlayers: gameSettings.gameMode === 'tournament' ? 4 : 2,
          maxTeamDifference: gameSettings.gameMode === 'tournament' ? 2 : 1
        }}
        teamNames={{
          blue: "블루 팀",
          red: "레드 팀"
        }}
        buttonTexts={{
          shuffle: "팀 섞기",
          start: "게임 시작!",
          close: "메뉴로"
        }}
      />
    </div>
  );

  const renderPlaying = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">게임 진행 중</h1>
          <div className="flex space-x-4">
            <button
              onClick={handlePauseGame}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              일시정지
            </button>
            <button
              onClick={handleEndGame}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              게임 종료
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-100 p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              블루 팀 ({teams.blue.length}명) - {gameScore.blue}점
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {teams.blue.map(player => (
                <div key={player.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                  <span className="text-2xl">{player.avatarEmoji}</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-100 p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              레드 팀 ({teams.red.length}명) - {gameScore.red}점
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {teams.red.map(player => (
                <div key={player.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                  <span className="text-2xl">{player.avatarEmoji}</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white/90 p-6 rounded-2xl inline-block">
            <h3 className="text-2xl font-bold mb-4">라운드 {gameScore.round} / {gameSettings.rounds}</h3>
            <div className="space-x-4">
              <button
                onClick={() => handleEndRound('blue')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                블루 팀 승리
              </button>
              <button
                onClick={() => handleEndRound('red')}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                레드 팀 승리
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaused = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
      <div className="text-center bg-white/90 p-12 rounded-3xl shadow-2xl">
        <h1 className="text-6xl font-bold mb-8 text-gray-800">게임 일시정지</h1>
        <div className="space-y-4">
          <button
            onClick={handleResumeGame}
            className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            게임 재개
          </button>
          <button
            onClick={handleBackToMenu}
            className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            메뉴로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => {
    const finalWinner = gameScore.blue > gameScore.red ? 'blue' : 
                       gameScore.red > gameScore.blue ? 'red' : 'tie';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
        <div className="text-center bg-white/90 p-12 rounded-3xl shadow-2xl">
          <h1 className="text-6xl font-bold mb-8 text-gray-800">게임 종료!</h1>
          
          <div className="text-3xl mb-8">
            {finalWinner === 'tie' ? (
              <p className="text-gray-600">무승부!</p>
            ) : (
              <p className={finalWinner === 'blue' ? 'text-blue-600' : 'text-red-600'}>
                {finalWinner === 'blue' ? '블루 팀' : '레드 팀'} 승리!
              </p>
            )}
          </div>

          <div className="text-2xl mb-8 space-y-2">
            <p className="text-blue-600">블루 팀: {gameScore.blue}점</p>
            <p className="text-red-600">레드 팀: {gameScore.red}점</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleResetGame}
              className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              다시 플레이
            </button>
            <button
              onClick={() => setGamePhase('menu')}
              className="block w-full px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              메뉴로
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 메인 렌더링
  switch (gamePhase) {
    case 'menu':
      return renderMenu();
    case 'settings':
      return renderSettings();
    case 'team-setup':
      return renderTeamSetup();
    case 'playing':
      return renderPlaying();
    case 'paused':
      return renderPaused();
    case 'game-over':
      return renderGameOver();
    default:
      return renderMenu();
  }
};

export default TeamSetupIntegrationExample;
