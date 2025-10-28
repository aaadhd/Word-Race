import React from 'react';

interface RoundLoadingProps {
  nextRound: number;
}

const RoundLoading: React.FC<RoundLoadingProps> = ({ nextRound }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Starting Quiz와 동일한 스타일 - 딤은 상위에서 제공 */}
      <div className="flex items-center justify-center gap-3 text-white">
        <div className="w-7 h-7 border-4 border-dashed rounded-full animate-spin border-white"></div>
        <p className="text-2xl font-bold">Next Round...</p>
      </div>
    </div>
  );
};

export default RoundLoading;
