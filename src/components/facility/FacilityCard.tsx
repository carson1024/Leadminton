import React, { useCallback } from 'react';
import { Building2, ArrowUp } from 'lucide-react';
import { Facility } from '../../types/game';
import { useProgress } from '../../hooks/useProgress';
import SpeedUpButton from '../common/SpeedUpButton';
import { getInitialUpgradeCost } from '../../utils/facilityUtils';

interface FacilityCardProps {
  facility: Facility;
  onUpgrade: (facilityId: string) => void;
  onSpeedUp: (facilityId: string) => void;
  canAfford: boolean;
  canAffordSpeedUp: (diamondCost: number) => boolean;
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default function FacilityCard({ 
  facility, 
  onUpgrade, 
  onSpeedUp,
  canAfford,
  canAffordSpeedUp
}: FacilityCardProps) {
  const handleSpeedUp = useCallback(() => {
    if (facility.upgrading) {
      onSpeedUp(facility.id);
    }
  }, [facility]);

  const { progress, timeLeft } = useProgress(facility.upgrading?.startTime, facility.upgrading?.period, handleSpeedUp);

  // Get the current upgrade cost
  const upgradeCost = facility.upgradeCost || getInitialUpgradeCost(facility);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">{facility.name}</h3>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          Level {facility.level}
        </div>
      </div>

      <div className="space-y-3">
        {facility.type === 'training-center' ? (
          <div className="text-sm text-gray-600">
            Max Players: {facility.maxPlayers}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            Production Rate: {facility.productionRate}/min
          </div>
        )}
        
        {facility.upgrading ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-600">Upgrading...</div>
              <SpeedUpButton
                timeLeft={timeLeft * 1000}
                onSpeedUp={handleSpeedUp}
                disabled={!canAffordSpeedUp(Math.ceil(timeLeft / 10))}
              />
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {formatTime(timeLeft)} remaining
            </div>
          </div>
        ) : (
          <>
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Upgrade Cost:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(upgradeCost).map(([resource, cost]) => (
                  cost > 0 && (
                    <div key={resource} className="flex items-center space-x-1">
                      <span className="text-gray-600">{resource}:</span>
                      <span className="font-medium">{cost}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            <button
              onClick={() => onUpgrade(facility.id)}
              disabled={!canAfford || facility.upgrading}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                canAfford && !facility.upgrading
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}