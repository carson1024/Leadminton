import React from 'react';
import { Trophy, X, AlertTriangle } from 'lucide-react';
import { Player, Resources } from '../../types/game';

interface QuickMatchResultProps {
  matchResult: {
    players: Player[];
    winner: Player;
    loser: Player;
    score: string;
    summary: string[];
    newInjury?: {
      player: Player;
      type: string;
      severity: 'minor' | 'moderate' | 'severe';
      recoveryTime: number;
      recoveryEndTime: number;
      affectedStats?: Partial<Record<string, number>>;
    };
  };
  rewards: {
    coins: number;
    diamonds: number;
  };
  onClose: (rewards: Partial<Record<keyof Resources, number>>) => void;
}

export default function QuickMatchResult({ matchResult, rewards, onClose }: QuickMatchResultProps) {
  if (!matchResult || !matchResult.winner || !matchResult.loser) {
    console.error('Invalid match result:', matchResult);
    return null;
  }

  const { winner, loser, score, summary, newInjury } = matchResult;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'text-yellow-600 bg-yellow-50';
      case 'moderate':
        return 'text-orange-600 bg-orange-50';
      case 'severe':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleClose = () => {
    try {
      onClose(rewards);
    } catch (error) {
      console.error('Error closing match result:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Match Results</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <Trophy className={`w-12 h-12 mx-auto mb-3 ${
              winner.id.startsWith('cpu') ? 'text-gray-400' : 'text-yellow-500'
            }`} />
            <h4 className="text-lg font-semibold mb-1">
              {winner.name} defeats {loser.name}
            </h4>
            <p className="text-gray-600">Score: {score}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium mb-3">Match Summary:</h5>
            <div className="space-y-2">
              {summary.map((line, index) => (
                <p key={index} className="text-gray-600 text-sm">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {newInjury && (
            <div className="space-y-3">
              <h5 className="font-medium">Injury Report:</h5>
              <div 
                className={`rounded-lg p-4 ${getSeverityColor(newInjury.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="space-y-1 text-sm">
                      <p>Player: {matchResult.players[0].name}</p>
                      <p>Injury: {newInjury.type}</p>
                      <p>Severity: {newInjury.severity}</p>
                      <p>Recovery Time: {Math.ceil(newInjury.recoveryTime / 60)} minutes</p>
                      {newInjury.affectedStats && Object.keys(newInjury.affectedStats).length > 0 && (
                        <p>Affected Stats: {Object.keys(newInjury.affectedStats).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium mb-2">Rewards:</h5>
            <div className="space-y-1">
              {rewards.coins > 0 && (
                <div className="text-yellow-600">+{rewards.coins} coins</div>
              )}
              {rewards.diamonds > 0 && (
                <div className="text-purple-600">+{rewards.diamonds} diamonds</div>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}