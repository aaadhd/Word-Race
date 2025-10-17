import React, { useState } from 'react';
import type { Teams, Player, TeamColor, DragItem } from '../types';

interface TeamSetupScreenProps {
  teams: Teams;
  onShuffle: () => void;
  onStart: () => void;
  onTeamsChange: (teams: Teams) => void;
}

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center w-full max-w-lg transform transition-all animate-fade-in-up">
        <div className="text-7xl mb-6">⚠️</div>
        <p className="text-3xl font-display text-primary-text leading-relaxed whitespace-pre-line mb-8">
          {message}
        </p>
        
        <button 
          onClick={onClose}
          className="px-16 py-5 text-3xl font-display text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-2xl hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

interface PlayerCardProps {
  player: Player;
  team: TeamColor;
  index: number;
  onDragStart: (dragItem: DragItem) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
}

interface TeamBoxProps {
  title: string;
  teamColor: string;
  players: Player[];
  team: TeamColor;
  onDrop: (targetTeam: TeamColor, targetIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (dragItem: DragItem) => void;
  onDragEnd: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  team, 
  index, 
  onDragStart, 
  onDragEnd,
  isDragging = false 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    onDragStart({ player, sourceTeam: team, sourceIndex: index });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`flex flex-col items-center cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      <div className="w-28 h-28 rounded-full bg-white flex justify-center items-center text-6xl border-4 border-gray-300 shadow-md">
        {player.avatarEmoji}
      </div>
      <span className="mt-2 text-gray-700 font-sans font-bold text-base">{player.name}</span>
    </div>
  );
};

const TeamBox: React.FC<TeamBoxProps> = ({ 
  title, 
  teamColor, 
  players, 
  team, 
  onDrop, 
  onDragOver,
  onDragStart,
  onDragEnd
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 그리드 위치 계산 (4x2 그리드)
    const gridWidth = rect.width;
    const gridHeight = rect.height;
    const colWidth = gridWidth / 4;
    const rowHeight = gridHeight / 2;
    
    const col = Math.floor(x / colWidth);
    const row = Math.floor(y / rowHeight);
    const targetIndex = Math.min(row * 4 + col, 7); // 최대 인덱스 7 (8명)
    
    onDrop(team, targetIndex);
  };

  return (
    <div 
      className={`bg-white/80 p-6 rounded-3xl shadow-xl text-center border-t-8 border-${teamColor}-400`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      <h3 className={`text-${teamColor}-600 text-5xl font-display mb-4 flex items-center justify-center gap-3`}>
        {title}
      </h3>
      <div className="grid grid-cols-4 grid-rows-2 gap-6 p-6 bg-gray-200/50 rounded-2xl min-h-[280px]">
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            team={team}
            index={index}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

const TeamSetupScreen: React.FC<TeamSetupScreenProps> = ({ teams, onShuffle, onStart, onTeamsChange }) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDragStart = (dragItem: DragItem) => {
    setDraggedItem(dragItem);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleStartGame = () => {
    const teamACount = teams.blue.length;
    const teamBCount = teams.red.length;
    const totalPlayers = teamACount + teamBCount;

    // 총 플레이어가 2명 미만인 경우
    if (totalPlayers < 2) {
      setAlertMessage('At least 2 players are required\nto start the game.');
      return;
    }

    // 팀원 차이가 1명을 초과하는 경우
    const teamDifference = Math.abs(teamACount - teamBCount);
    if (teamDifference > 1) {
      setAlertMessage('Team size difference\nmust be 1 player or less.');
      return;
    }

    // 유효성 검사 통과 시 게임 시작
    onStart();
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  const handleDrop = (targetTeam: TeamColor, targetIndex: number) => {
    if (!draggedItem) return;

    const newTeams = { ...teams };
    
    // 소스 팀에서 플레이어 제거
    newTeams[draggedItem.sourceTeam] = newTeams[draggedItem.sourceTeam].filter(
      (_, index) => index !== draggedItem.sourceIndex
    );

    // 타겟 팀에 플레이어 추가
    const playerWithNewTeam = { ...draggedItem.player, team: targetTeam };
    newTeams[targetTeam].splice(targetIndex, 0, playerWithNewTeam);

    // 최대 8명 제한
    if (newTeams[targetTeam].length > 8) {
      newTeams[targetTeam] = newTeams[targetTeam].slice(0, 8);
    }

    onTeamsChange(newTeams);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-4 pt-16 relative">
      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />}
      
      <h1 className="text-6xl font-display text-accent-yellow drop-shadow-lg mb-16">Team Setup</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <TeamBox 
          title="Team A" 
          teamColor="blue" 
          players={teams.blue} 
          team="blue"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <TeamBox 
          title="Team B" 
          teamColor="red" 
          players={teams.red} 
          team="red"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
      <div className="absolute bottom-8 left-8 right-8 flex justify-between">
        <button
          onClick={onShuffle}
          className="px-10 py-4 text-3xl font-display text-white bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          Shuffle Teams
        </button>
        <button
          onClick={handleStartGame}
          className="px-10 py-4 text-3xl font-display text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          Start Game!
        </button>
      </div>
    </div>
  );
};

export default TeamSetupScreen;
