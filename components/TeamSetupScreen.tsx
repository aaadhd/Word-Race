import React, { useState } from 'react';
import type { Teams, Player, TeamColor, DragItem } from '../types/team-setup-types';
import { playButtonClick } from '../utils/soundEffects.ts';
import RippleButton from './RippleButton.tsx';

// 재사용 가능한 Team Setup 컴포넌트
interface TeamSetupScreenProps {
  teams: Teams;
  onShuffle: () => void;
  onStart: () => void;
  onTeamsChange: (teams: Teams) => void;
  onClose?: () => void; // 모달 닫기 기능 추가
  title?: string; // 커스터마이징 가능한 제목
  maxPlayersPerTeam?: number; // 팀당 최대 플레이어 수
  validationRules?: {
    minTotalPlayers?: number;
    maxTeamDifference?: number;
  };
  teamNames?: {
    blue: string;
    red: string;
  };
  buttonTexts?: {
    shuffle: string;
    start: string;
    close?: string;
  };
}

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
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
      className={`flex flex-col items-center cursor-move transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95 rotate-12' : ''
      }`}
      style={{
        animation: isDragging ? 'none' : 'float 3s ease-in-out infinite',
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-white to-gray-50 flex justify-center items-center text-6xl border-4 shadow-xl transition-all duration-300 ${
        isDragging ? 'border-yellow-500 scale-110' : 'border-gray-300'
      }`}
        style={{
          animation: isDragging ? 'none' : 'wiggle 4s ease-in-out infinite',
          animationDelay: `${index * 0.15}s`
        }}
      >
        <img
          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(player.name)}`}
          alt={`${player.name} avatar`}
          className="w-24 h-24 rounded-full"
          draggable={false}
        />
      </div>
      <span className="mt-2 text-gray-700 font-sans font-bold text-base">{player.name}</span>
    </div>
  );
};

const TeamBox: React.FC<TeamBoxProps> = ({
  title,
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

  // Team A (blue) -> #3b82f6, Team B (red) -> #ef4444
  const borderColorClass = team === 'blue' ? 'border-team-a' : 'border-team-b';
  const textColorClass = team === 'blue' ? 'text-team-a' : 'text-team-b';

  return (
    <div
      className={`bg-white/95 pt-3 px-3 pb-3 rounded-3xl shadow-2xl text-center border-t-8 ${borderColorClass}`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      <h3 className={`${textColorClass} text-4xl font-display mb-2 flex items-center justify-center gap-3`}>
        {title}
      </h3>
      <div className="grid grid-cols-4 grid-rows-2 gap-6 p-4 bg-gray-200/50 rounded-2xl">
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

const TeamSetupScreen: React.FC<TeamSetupScreenProps> = ({ 
  teams, 
  onShuffle, 
  onStart, 
  onTeamsChange,
  onClose,
  title = "Team Setup",
  maxPlayersPerTeam = 8,
  validationRules = {
    minTotalPlayers: 2,
    maxTeamDifference: 1
  },
  teamNames = {
    blue: "Team A",
    red: "Team B"
  },
  buttonTexts = {
    shuffle: "Shuffle Teams",
    start: "Start Game!",
    close: "Close"
  }
}) => {
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

    // 총 플레이어가 최소 요구사항 미만인 경우
    if (totalPlayers < (validationRules.minTotalPlayers || 2)) {
      setAlertMessage(`At least ${validationRules.minTotalPlayers || 2} players are required\nto start the game.`);
      return;
    }

    // 팀원 차이가 허용 범위를 초과하는 경우
    const teamDifference = Math.abs(teamACount - teamBCount);
    if (teamDifference > (validationRules.maxTeamDifference || 1)) {
      setAlertMessage(`Team size difference\nmust be ${validationRules.maxTeamDifference || 1} player or less.`);
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

    // 최대 팀원 수 제한
    if (newTeams[targetTeam].length > maxPlayersPerTeam) {
      newTeams[targetTeam] = newTeams[targetTeam].slice(0, maxPlayersPerTeam);
    }

    onTeamsChange(newTeams);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative">
      <img
        src="/images/background.png"
        alt="background"
        className="absolute"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          left: 0,
          top: 0,
          zIndex: -1
        }}
      />
      {alertMessage && <AlertModal message={alertMessage} onClose={handleCloseAlert} />}

      <div className="flex items-center justify-center w-full max-w-6xl mb-8 relative z-10 pt-16" style={{ marginTop: '3%' }}>
        <h1 className="text-6xl font-display text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.5)' }}>{title}</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 px-6 py-3 text-xl font-display text-white bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            {buttonTexts.close}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl items-center pb-32" style={{ marginTop: '2%' }}>
        <TeamBox
          title={teamNames.blue}
          players={teams.blue}
          team="blue"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <TeamBox
          title={teamNames.red}
          players={teams.red}
          team="red"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
      
      <div className="fixed bottom-8 left-8 right-8 flex justify-between z-50">
        <RippleButton
          onClick={() => {
            playButtonClick();
            onShuffle();
          }}
          className="px-10 py-4 text-3xl font-display text-white bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-2xl active:scale-90 transition-transform duration-200 border-4 border-white"
        >
          {buttonTexts.shuffle}
        </RippleButton>
        <RippleButton
          onClick={() => {
            playButtonClick();
            handleStartGame();
          }}
          className="px-10 py-4 text-3xl font-display text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-2xl active:scale-90 transition-transform duration-200 border-4 border-white"
        >
          {buttonTexts.start}
        </RippleButton>
      </div>
    </div>
  );
};

export default TeamSetupScreen;