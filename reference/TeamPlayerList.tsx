import React from 'react';
import {
  TeamPlayerListProps,
  Team,
  TEAM_COLORS,
  getRotatedPlayers,
  getCurrentPlayer
} from './team-scoreboard-types';

// 개별 플레이어 카드 컴포넌트
interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatarEmoji: string;
  };
  isCurrentPlayer?: boolean;
  isWinner?: boolean;
  hasShield?: boolean;
  customStyles?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    highlightColor?: string;
  };
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer = false,
  isWinner = false,
  hasShield = false,
  customStyles
}) => {
  const backgroundColor = customStyles?.backgroundColor || 'bg-white';
  const textColor = customStyles?.textColor || 'text-gray-700';
  const borderColor = customStyles?.borderColor || 'border-gray-300';
  const highlightColor = customStyles?.highlightColor || 'bg-yellow-100';

  return (
    <div className={`
      flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
      ${backgroundColor} ${borderColor}
      ${isCurrentPlayer ? `${highlightColor} shadow-lg scale-105` : 'hover:shadow-md'}
      ${isWinner ? 'ring-2 ring-yellow-400' : ''}
    `}>
      {/* 아바타 */}
      <div className={`
        w-12 h-12 rounded-full flex justify-center items-center text-2xl mb-2
        ${hasShield ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'}
      `}>
        {hasShield && <span className="absolute -top-1 -right-1 text-lg">🛡️</span>}
        {player.avatarEmoji}
      </div>
      
      {/* 이름 */}
      <span className={`
        font-semibold text-center text-sm
        ${textColor}
        ${isCurrentPlayer ? 'font-bold' : ''}
        ${isWinner ? 'text-yellow-600' : ''}
      `}>
        {player.name}
      </span>
      
      {/* 상태 표시 */}
      <div className="flex gap-1 mt-1">
        {isCurrentPlayer && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">현재</span>}
        {isWinner && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">승자</span>}
        {hasShield && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">방패</span>}
      </div>
    </div>
  );
};

// 팀별 플레이어 리스트 컴포넌트
interface TeamPlayersSectionProps {
  team: Team;
  players: any[];
  currentRound: number;
  playerStatus?: {
    red: { hasShield: boolean; isWinner: boolean; position?: number };
    blue: { hasShield: boolean; isWinner: boolean; position?: number };
  };
  showRotation?: boolean;
  maxPlayersToShow?: number;
  customStyles?: {
    teamColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const TeamPlayersSection: React.FC<TeamPlayersSectionProps> = ({
  team,
  players,
  currentRound,
  playerStatus,
  showRotation = true,
  maxPlayersToShow = 8,
  customStyles
}) => {
  const color = TEAM_COLORS[team];
  const teamName = team === 'red' ? 'Team A' : 'Team B';
  
  const teamColor = customStyles?.teamColor || color.primary;
  const backgroundColor = customStyles?.backgroundColor || color.bg;
  const textColor = customStyles?.textColor || color.text;
  const borderColor = customStyles?.borderColor || color.primary;

  // 회전된 플레이어 목록 가져오기
  const displayPlayers = showRotation 
    ? getRotatedPlayers(players, currentRound)
    : players;

  const playersToShow = displayPlayers.slice(0, maxPlayersToShow);
  const currentPlayer = showRotation ? getCurrentPlayer(players, currentRound) : null;

  return (
    <div 
      className="p-4 rounded-xl shadow-lg"
      style={{ 
        backgroundColor,
        borderTop: `4px solid ${borderColor}`
      }}
    >
      {/* 팀 제목 */}
      <h3 className={`text-xl font-bold mb-4 text-center ${textColor}`}>
        {teamName}
      </h3>
      
      {/* 플레이어 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {playersToShow.map((player, index) => {
          const isCurrentPlayer = showRotation && currentPlayer?.id === player.id;
          const teamStatus = playerStatus?.[team];
          const isWinner = teamStatus?.isWinner || false;
          const hasShield = teamStatus?.hasShield || false;
          
          return (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={isCurrentPlayer}
              isWinner={isWinner}
              hasShield={hasShield}
              customStyles={{
                backgroundColor: 'bg-white',
                textColor: 'text-gray-700',
                borderColor: 'border-gray-200',
                highlightColor: 'bg-yellow-100'
              }}
            />
          );
        })}
      </div>
      
      {/* 추가 정보 */}
      {showRotation && currentPlayer && (
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-600">
            현재 차례: <span className="font-semibold">{currentPlayer.name}</span>
          </span>
        </div>
      )}
    </div>
  );
};

// 메인 팀 플레이어 리스트 컴포넌트
const TeamPlayerList: React.FC<TeamPlayerListProps> = ({
  teams,
  currentRound,
  playerStatus,
  showCurrentPlayer = true,
  customStyles
}) => {
  const containerStyle = customStyles?.backgroundColor || 'bg-gradient-to-b from-blue-50 to-purple-50';
  const textColor = customStyles?.textColor || 'text-gray-800';

  return (
    <div className={`w-full ${containerStyle} p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold ${textColor} mb-2`}>
            팀 구성
          </h2>
          <p className={`text-lg ${textColor}`}>
            Round {currentRound}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team A */}
          <TeamPlayersSection
            team="red"
            players={teams.red}
            currentRound={currentRound}
            playerStatus={playerStatus}
            showRotation={showCurrentPlayer}
            customStyles={{
              teamColor: '#0891b2',
              backgroundColor: '#ecfeff',
              textColor: 'text-[#0891b2]',
              borderColor: '#0891b2'
            }}
          />
          
          {/* Team B */}
          <TeamPlayersSection
            team="blue"
            players={teams.blue}
            currentRound={currentRound}
            playerStatus={playerStatus}
            showRotation={showCurrentPlayer}
            customStyles={{
              teamColor: '#9333ea',
              backgroundColor: '#faf5ff',
              textColor: 'text-[#9333ea]',
              borderColor: '#9333ea'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPlayerList;
