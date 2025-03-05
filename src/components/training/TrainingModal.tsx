import React from 'react';
import { X } from 'lucide-react';
import { Player } from '../../types/game';
import { PHYSICAL_STATS, TECHNICAL_STATS } from '../../constants/stats';
import { Resources } from '../../types/game';

interface TrainingModalProps {
  player: Player;
  onClose: () => void;
  onStartTraining: (stat: keyof Player['stats']) => void;
  calculateTrainingCost: (player: Player, stat: keyof Player['stats']) => Omit<Resources, 'diamonds'>;
  canAffordTraining: (cost: Omit<Resources, 'diamonds'>) => boolean;
  type: 'physical' | 'technical';
}

export default function TrainingModal({
  player,
  onClose,
  onStartTraining,
  calculateTrainingCost,
  canAffordTraining,
  type,
}: TrainingModalProps) {
  const stats = type === 'physical' ? PHYSICAL_STATS : TECHNICAL_STATS;
  const title = `${type === 'physical' ? 'Physical' : 'Technical'} Training`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title} - {player.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((statConfig) => {
              const cost = calculateTrainingCost(player, statConfig.stat);
              const canAfford = canAffordTraining(cost);
              
              return (
                <button
                  key={statConfig.stat}
                  onClick={() => onStartTraining(statConfig.stat)}
                  disabled={!canAfford || !!player.training}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    canAfford && !player.training
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <statConfig.icon className={`w-4 h-4 ${statConfig.color}`} />
                    <span className="font-medium">{statConfig.label}</span>
                  </div>
                  <div className="text-sm mt-1">Current: {player.stats[statConfig.stat]}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Cost:
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(cost).map(([resource, amount]) => (
                        amount > 0 && (
                          <div key={resource}>
                            {resource}: {amount}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}