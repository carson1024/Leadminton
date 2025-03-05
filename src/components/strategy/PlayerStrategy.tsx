import React from 'react';
import { Settings } from 'lucide-react';
import { Player, PlayerStrategy } from '../../types/game';
import { calculateStrategyImpact } from '../../utils/strategyCalculator';

interface PlayerStrategyProps {
  player: Player;
  onUpdateStrategy: (playerId: string, strategy: PlayerStrategy) => void;
}

export default function PlayerStrategy({ player, onUpdateStrategy }: PlayerStrategyProps) {
  const strategyScore = calculateStrategyImpact(player);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h3 className="font-medium">Stratégie</h3>
        </div>
        <div className="text-sm text-gray-600">
          Score: {Math.round(strategyScore.total)}
        </div>
      </div>

      <div className="space-y-4">
        {/* Score Physique */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Score Physique</span>
            <span>{Math.round(strategyScore.details.physicalScore)}</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(strategyScore.details.physicalScore / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score Technique */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Score Technique</span>
            <span>{Math.round(strategyScore.details.technicalScore)}</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${(strategyScore.details.technicalScore / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score Mental */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Score Mental</span>
            <span>{Math.round(strategyScore.details.mentalScore)}</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(strategyScore.details.mentalScore / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score de Style */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Score de Style</span>
            <span>{Math.round(strategyScore.details.styleScore)}</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${(strategyScore.details.styleScore / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="text-sm">
          <div className="font-medium">Style Offensif</div>
          <div className="text-gray-600">
            {Math.round((player.strategy.attack + player.strategy.softAttack) / 2)}/10
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Style Défensif</div>
          <div className="text-gray-600">
            {Math.round((player.strategy.courtDefense + player.strategy.rallyConsistency) / 2)}/10
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Endurance</div>
          <div className="text-gray-600">
            {Math.round((player.strategy.physicalCommitment + player.strategy.fatigueManagement) / 2)}/10
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Mental</div>
          <div className="text-gray-600">
            {Math.round((player.strategy.mentalToughness + player.strategy.selfConfidence) / 2)}/10
          </div>
        </div>
      </div>
    </div>
  );
}