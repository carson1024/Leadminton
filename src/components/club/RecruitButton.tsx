import React from 'react';
import { UserPlus } from 'lucide-react';
import { calculateNewPlayerCost } from '../../utils/costCalculator';

interface RecruitButtonProps {
  currentPlayers: number;
  maxPlayers: number;
  coins: number;
  onRecruit: () => void;
}

export default function RecruitButton({
  currentPlayers,
  maxPlayers,
  coins,
  onRecruit,
}: RecruitButtonProps) {
  const cost = calculateNewPlayerCost(currentPlayers);
  const canRecruit = currentPlayers < maxPlayers && coins >= cost;

  return (
    <>
      {currentPlayers < maxPlayers && (
        <button
          onClick={onRecruit}
          disabled={!canRecruit}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            canRecruit
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Recruit Player ({cost} coins)</span>
        </button>
      )}
    </>
  );
}