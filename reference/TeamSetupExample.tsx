import React, { useState } from 'react';
import TeamSetupScreen from './TeamSetupScreen';
import { initializeTeams, shuffleTeams, MOCK_PLAYERS } from './team-setup-types';
import type { Teams } from './team-setup-types';

// 팀 세팅 화면 사용 예제
const TeamSetupExample: React.FC = () => {
  const [teams, setTeams] = useState<Teams>(() => initializeTeams(MOCK_PLAYERS));

  const handleShuffle = () => {
    const shuffledTeams = shuffleTeams(teams);
    setTeams(shuffledTeams);
  };

  const handleStart = () => {
    console.log('게임 시작!', teams);
    // 여기에 게임 시작 로직 추가
  };

  const handleTeamsChange = (newTeams: Teams) => {
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <TeamSetupScreen
        teams={teams}
        onShuffle={handleShuffle}
        onStart={handleStart}
        onTeamsChange={handleTeamsChange}
      />
    </div>
  );
};

export default TeamSetupExample;
