import React, { useState, useEffect } from 'react';
import TeamScoreboard from './TeamScoreboard';
import TeamPlayerList from './TeamPlayerList';
import {
  Teams,
  TeamScores,
  PlayerStatus,
  SAMPLE_PLAYERS,
  initializeTeams,
  shuffleTeams,
  updateTeamScore,
  resetTeamScores,
  DEFAULT_TEAM_SCORES,
  DEFAULT_PLAYER_STATUS
} from './team-scoreboard-types';

// 기본 팀 점수판 사용 예제
export const BasicTeamScoreboardExample: React.FC = () => {
  const [teams] = useState<Teams>(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 8)));
  const [scores, setScores] = useState<TeamScores>(DEFAULT_TEAM_SCORES);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300); // 5분

  // 시간 카운트다운
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 시간 종료 시 다음 라운드
          setCurrentRound(prev => prev + 1);
          return 300; // 5분으로 리셋
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScoreUpdate = (team: 'red' | 'blue') => {
    setScores(prev => updateTeamScore(prev, team, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TeamScoreboard
        scores={scores}
        currentRound={currentRound}
        timeLeft={timeLeft}
        teams={teams}
        showTimeLeft={true}
        showPlayerList={true}
        maxPlayersToShow={3}
      />
      
      {/* 점수 업데이트 버튼들 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => handleScoreUpdate('red')}
          className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600"
        >
          Team A +1
        </button>
        <button
          onClick={() => handleScoreUpdate('blue')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
        >
          Team B +1
        </button>
        <button
          onClick={() => setScores(resetTeamScores())}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
        >
          점수 리셋
        </button>
      </div>
    </div>
  );
};

// 팀 플레이어 리스트만 표시하는 예제
export const TeamPlayerListOnlyExample: React.FC = () => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 10)));
  const [currentRound, setCurrentRound] = useState(1);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(DEFAULT_PLAYER_STATUS);

  const handleShuffle = () => {
    setTeams(shuffleTeams(teams));
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
  };

  const handleToggleShield = (team: 'red' | 'blue') => {
    setPlayerStatus(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        hasShield: !prev[team].hasShield
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TeamPlayerList
        teams={teams}
        currentRound={currentRound}
        playerStatus={playerStatus}
        showCurrentPlayer={true}
        customStyles={{
          backgroundColor: 'bg-gradient-to-b from-blue-50 to-purple-50',
          textColor: 'text-gray-800'
        }}
      />
      
      {/* 컨트롤 버튼들 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleShuffle}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          팀 셔플
        </button>
        <button
          onClick={handleNextRound}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          다음 라운드
        </button>
        <button
          onClick={() => handleToggleShield('red')}
          className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600"
        >
          Team A 방패 토글
        </button>
        <button
          onClick={() => handleToggleShield('blue')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
        >
          Team B 방패 토글
        </button>
      </div>
    </div>
  );
};

// 커스텀 스타일링 예제
export const CustomStyledTeamScoreboardExample: React.FC = () => {
  const [teams] = useState<Teams>(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 6)));
  const [scores, setScores] = useState<TeamScores>({ red: 15, blue: 12 });
  const [currentRound] = useState(3);
  const [timeLeft] = useState(180);

  const customStyles = {
    primaryColor: 'blue' as const,
    backgroundColor: 'bg-gradient-to-b from-green-50 to-blue-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    teamAColor: 'rgba(34, 197, 94, 0.6)', // Green
    teamBColor: 'rgba(59, 130, 246, 0.6)', // Blue
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TeamScoreboard
        scores={scores}
        currentRound={currentRound}
        timeLeft={timeLeft}
        teams={teams}
        showTimeLeft={true}
        showPlayerList={true}
        maxPlayersToShow={3}
        customStyles={customStyles}
      />
      
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">커스텀 스타일링 예제</h2>
        <p className="text-gray-600">
          녹색과 파란색 테마로 커스터마이징된 팀 점수판입니다.
        </p>
      </div>
    </div>
  );
};

// 게임 상태에 따른 동적 업데이트 예제
export const DynamicTeamScoreboardExample: React.FC = () => {
  const [teams] = useState<Teams>(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 8)));
  const [scores, setScores] = useState<TeamScores>(DEFAULT_TEAM_SCORES);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(DEFAULT_PLAYER_STATUS);
  const [gamePhase, setGamePhase] = useState<'playing' | 'paused' | 'finished'>('playing');

  // 게임 로직 시뮬레이션
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const interval = setInterval(() => {
      // 랜덤하게 점수 업데이트
      if (Math.random() > 0.7) {
        const team = Math.random() > 0.5 ? 'red' : 'blue';
        setScores(prev => updateTeamScore(prev, team, 1));
      }

      // 시간 업데이트
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentRound(round => round + 1);
          return 60; // 1분으로 리셋
        }
        return prev - 1;
      });

      // 플레이어 상태 랜덤 업데이트
      if (Math.random() > 0.8) {
        setPlayerStatus(prev => ({
          red: {
            ...prev.red,
            hasShield: Math.random() > 0.5
          },
          blue: {
            ...prev.blue,
            hasShield: Math.random() > 0.5
          }
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase]);

  const handleGamePhaseChange = (phase: 'playing' | 'paused' | 'finished') => {
    setGamePhase(phase);
  };

  const handleReset = () => {
    setScores(DEFAULT_TEAM_SCORES);
    setCurrentRound(1);
    setTimeLeft(60);
    setPlayerStatus(DEFAULT_PLAYER_STATUS);
    setGamePhase('playing');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TeamScoreboard
        scores={scores}
        currentRound={currentRound}
        timeLeft={timeLeft}
        teams={teams}
        playerStatus={playerStatus}
        showTimeLeft={true}
        showPlayerList={true}
        maxPlayersToShow={3}
      />
      
      {/* 게임 컨트롤 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => handleGamePhaseChange(gamePhase === 'playing' ? 'paused' : 'playing')}
          className={`px-6 py-3 rounded-lg font-semibold ${
            gamePhase === 'playing' 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {gamePhase === 'playing' ? '일시정지' : '재개'}
        </button>
        <button
          onClick={() => handleGamePhaseChange('finished')}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          게임 종료
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
        >
          리셋
        </button>
      </div>

      {/* 게임 상태 표시 */}
      <div className="text-center mt-4">
        <span className={`px-4 py-2 rounded-full font-semibold ${
          gamePhase === 'playing' ? 'bg-green-100 text-green-800' :
          gamePhase === 'paused' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          상태: {
            gamePhase === 'playing' ? '게임 진행 중' :
            gamePhase === 'paused' ? '일시정지' :
            '게임 종료'
          }
        </span>
      </div>
    </div>
  );
};

// 완전한 게임 통합 예제
export const CompleteGameIntegrationExample: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(SAMPLE_PLAYERS.slice(0, 8)));
  const [scores, setScores] = useState<TeamScores>(DEFAULT_TEAM_SCORES);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(DEFAULT_PLAYER_STATUS);

  const handleStartGame = () => {
    setGameState('playing');
    setScores(DEFAULT_TEAM_SCORES);
    setCurrentRound(1);
    setTimeLeft(300);
  };

  const handleFinishGame = () => {
    setGameState('finished');
    // 승자 결정
    const winner = scores.red > scores.blue ? 'red' : scores.blue > scores.red ? 'blue' : null;
    if (winner) {
      setPlayerStatus(prev => ({
        ...prev,
        [winner]: { ...prev[winner], isWinner: true }
      }));
    }
  };

  const handleScoreUpdate = (team: 'red' | 'blue') => {
    setScores(prev => updateTeamScore(prev, team, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {gameState === 'setup' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">게임 설정</h1>
            <div className="mb-8">
              <TeamPlayerList
                teams={teams}
                currentRound={currentRound}
                playerStatus={playerStatus}
                showCurrentPlayer={false}
              />
            </div>
            <button
              onClick={handleStartGame}
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600"
            >
              게임 시작
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <TeamScoreboard
            scores={scores}
            currentRound={currentRound}
            timeLeft={timeLeft}
            teams={teams}
            playerStatus={playerStatus}
            showTimeLeft={true}
            showPlayerList={true}
            maxPlayersToShow={3}
          />
          
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handleScoreUpdate('red')}
              className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600"
            >
              Team A +1
            </button>
            <button
              onClick={() => handleScoreUpdate('blue')}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
            >
              Team B +1
            </button>
            <button
              onClick={handleFinishGame}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
            >
              게임 종료
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">게임 종료!</h1>
            <div className="text-2xl mb-8">
              <p className="mb-2">Team A: {scores.red}점</p>
              <p className="mb-4">Team B: {scores.blue}점</p>
              <p className="font-bold text-green-600">
                승자: {scores.red > scores.blue ? 'Team A' : scores.blue > scores.red ? 'Team B' : '무승부'}
              </p>
            </div>
            <button
              onClick={() => setGameState('setup')}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
