import React from 'react';
import { Trophy } from 'lucide-react';
import { PlayerScore } from '../../types/game';

interface PlayerDetailsProps {
  playerScore: PlayerScore;
  showDetails: boolean;
  onToggleDetails: () => void;
}

export default function PlayerDetails({ playerScore, showDetails, onToggleDetails }: PlayerDetailsProps) {
  return (
    <div className="flex items-center space-x-2 mt-1">
      <Trophy className="w-4 h-4 text-yellow-500" />
      <span className="text-sm text-gray-600">Score: {playerScore.score}</span>
      <button
        onClick={onToggleDetails}
        className="text-xs text-blue-500 hover:text-blue-600"
      >
        {showDetails ? 'Hide details' : 'Show details'}
      </button>

      {showDetails && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="space-y-1">
            <p>Base Score: {playerScore.details.baseScore}</p>
            <p>Balance Multiplier: {playerScore.details.balanceScore}x</p>
            <p>Physical Score: {playerScore.details.physicalScore}</p>
            <p>Technical Score: {playerScore.details.technicalScore}</p>
            {playerScore.details.specialization.length > 0 && (
              <p>Specializations: {playerScore.details.specialization.join(', ')}</p>
            )}
            {playerScore.details.weaknesses.length > 0 && (
              <p className="text-red-500">Weaknesses: {playerScore.details.weaknesses.join(', ')}</p>
            )}
            {Object.keys(playerScore.details.equipmentBonuses).length > 0 && (
              <div>
                <p className="font-medium mt-2">Equipment Bonuses:</p>
                {Object.entries(playerScore.details.equipmentBonuses).map(([stat, bonus]) => (
                  <p key={stat} className="text-green-600">+{bonus} {stat}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}