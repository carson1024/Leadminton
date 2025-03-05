import React from 'react';
import { Clock } from 'lucide-react';

interface SpeedUpButtonProps {
  timeLeft: number;
  onSpeedUp: () => void;
  disabled: boolean;
}

export default function SpeedUpButton({ timeLeft, onSpeedUp, disabled }: SpeedUpButtonProps) {
  const DIAMOND_COST = Math.ceil(timeLeft / 10000); // 1 diamond per 10 seconds

  return (
    <button
      onClick={onSpeedUp}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>Speed up ({DIAMOND_COST} 💎)</span>
    </button>
  );
}