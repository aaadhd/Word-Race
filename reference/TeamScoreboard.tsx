import React from 'react';
import {
  TeamScoreboardProps,
  ScoreDisplayProps,
  Team,
  TEAM_COLORS,
  getRotatedPlayers,
  getCurrentPlayer
} from './team-scoreboard-types';

// 개별 팀 점수 표시 컴포넌트
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  team, 
  score, 
  teamName,
  customStyles 
}) => {
  const color = TEAM_COLORS[team];
  const displayTeamName = teamName || (team === 'red' ? 'Team A' : 'Team B');
  
  const backgroundColor = customStyles?.backgroundColor || color.bgLight;
  const textColor = customStyles?.textColor || color.text;
  const scoreColor = customStyles?.scoreColor || 'text-yellow-600';
  
  return (
    <div className={`text-4xl font-bold py-2 px-5 rounded-2xl ${backgroundColor}`}>
      <span className={textColor}>{displayTeamName}</span>
      <span className="text-gray-800">: </span>
      <span className={`${scoreColor} font-black`}>{score}</span>
    </div>
  );
};

// 팀 플레이어 리스트 컴포넌트
interface TeamPlayerListProps {
  teams: TeamScoreboardProps['teams'];
  currentRound: number;
  maxPlayersToShow?: number;
  showCurrentPlayer?: boolean;
  customStyles?: {
    teamAColor?: string;
    teamBColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

const TeamPlayerList: React.FC<TeamPlayerListProps> = ({
  teams,
  currentRound,
  maxPlayersToShow = 3,
  showCurrentPlayer = true,
  customStyles
}) => {
  const teamAColor = customStyles?.teamAColor || 'rgba(8, 145, 178, 0.6)';
  const teamBColor = customStyles?.teamBColor || 'rgba(147, 51, 234, 0.6)';
  const backgroundColor = customStyles?.backgroundColor || 'rgba(255,255,255,0.2)';
  const textColor = customStyles?.textColor || 'text-white';

  const renderTeamPlayers = (team: Team) => {
    const teamPlayers = teams[team];
    const rotatedPlayers = getRotatedPlayers(teamPlayers, currentRound);
    const playersToShow = rotatedPlayers.slice(0, maxPlayersToShow);
    
    const teamStyle = team === 'red' ? teamAColor : teamBColor;
    
    return (
      <div 
        key={team}
        className="px-4 py-3 rounded-lg"
        style={{
          background: teamStyle,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `2px solid ${backgroundColor}`,
          backdropFilter: 'blur(6px)',
          minWidth: '120px',
          textAlign: 'center'
        }}
      >
        <div className={`${textColor} space-y-1`}>
          {playersToShow.map((player, index) => {
            const isCurrentPlayer = showCurrentPlayer && index === 0;
            return (
              <div 
                key={player.id}
                className={isCurrentPlayer ? "font-black text-yellow-300 drop-shadow-lg" : ""}
                style={isCurrentPlayer ? { 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: '17px'
                } : {
                  fontSize: '17px'
                }}
              >
                {player.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-6 left-6 right-6 flex justify-between">
      {renderTeamPlayers('red')}
      {renderTeamPlayers('blue')}
    </div>
  );
};

// 메인 팀 점수판 컴포넌트
const TeamScoreboard: React.FC<TeamScoreboardProps> = ({
  scores,
  currentRound,
  timeLeft,
  teams,
  playerStatus,
  showTimeLeft = true,
  showPlayerList = true,
  maxPlayersToShow = 3,
  customStyles
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const primaryColor = customStyles?.primaryColor || 'red';
  const backgroundColor = customStyles?.backgroundColor || 'bg-gradient-to-b from-blue-50 to-purple-50';
  const textColor = customStyles?.textColor || 'text-gray-800';
  const borderColor = customStyles?.borderColor || 'border-gray-200';

  return (
    <div className={`w-full ${backgroundColor} border-b ${borderColor}`}>
      {/* 상단 플레이어 리스트 */}
      {showPlayerList && (
        <TeamPlayerList
          teams={teams}
          currentRound={currentRound}
          maxPlayersToShow={maxPlayersToShow}
          showCurrentPlayer={true}
          customStyles={customStyles}
        />
      )}

      {/* 메인 점수판 영역 */}
      <div className="flex justify-center items-center py-4">
        <div className="flex items-center gap-8">
          {/* Team A 점수 */}
          <ScoreDisplay 
            team="red" 
            score={scores.red}
            customStyles={customStyles}
          />
          
          {/* 중앙 정보 (라운드, 시간) */}
          <div className="flex flex-col items-center gap-2">
            <div className={`text-2xl font-bold ${textColor}`}>
              Round {currentRound}
            </div>
            {showTimeLeft && timeLeft !== undefined && (
              <div className={`text-lg font-semibold ${textColor}`}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          
          {/* Team B 점수 */}
          <ScoreDisplay 
            team="blue" 
            score={scores.blue}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamScoreboard;
