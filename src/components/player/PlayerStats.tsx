import React, { useState } from 'react';
import { Player, PlayerStats as PlayerStatsType } from '../../types/game';
import { PHYSICAL_STATS, TECHNICAL_STATS } from '../../constants/stats';
import StatBar from './StatBar';

interface PlayerStatsProps {
  player: Player;
  equipmentBonuses: Partial<Record<string, number>>;
  injuryEffects: Partial<PlayerStatsType>;
}

function getStatColor(stat: string, isPhysical: boolean): string {
  return isPhysical ? "bg-blue-500" : "bg-purple-500";
}

export default function PlayerStats({ player, equipmentBonuses, injuryEffects }: PlayerStatsProps) {
  const [showPhysical, setShowPhysical] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  const getEffectiveStatValue = (stat: keyof PlayerStatsType) => {
    const baseValue = player.stats[stat];
    const injuryEffect = injuryEffects[stat];
    return injuryEffect !== undefined ? injuryEffect : baseValue;
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setShowPhysical(!showPhysical)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            showPhysical ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {showPhysical ? 'Hide Physical Stats' : 'Show Physical Stats'}
        </button>
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            showTechnical ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {showTechnical ? 'Hide Technical Stats' : 'Show Technical Stats'}
        </button>
      </div>

      {showPhysical && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Physical Stats</h4>
          {PHYSICAL_STATS.map((statConfig) => {
            const isAffected = statConfig.stat in injuryEffects;
            const baseValue = player.stats[statConfig.stat];
            const effectiveValue = getEffectiveStatValue(statConfig.stat);
            
            return (
              <StatBar
                key={statConfig.stat}
                stat={statConfig.stat}
                baseValue={baseValue}
                effectiveValue={effectiveValue}
                bonus={equipmentBonuses[statConfig.stat] || 0}
                Icon={statConfig.icon}
                label={statConfig.label}
                color={getStatColor(statConfig.stat, true)}
                level={player.statLevels[statConfig.stat] || 0}
                isAffectedByInjury={isAffected}
              />
            );
          })}
        </div>
      )}

      {showTechnical && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Technical Stats</h4>
          {TECHNICAL_STATS.map((statConfig) => {
            const isAffected = statConfig.stat in injuryEffects;
            const baseValue = player.stats[statConfig.stat];
            const effectiveValue = getEffectiveStatValue(statConfig.stat);
            
            return (
              <StatBar
                key={statConfig.stat}
                stat={statConfig.stat}
                baseValue={baseValue}
                effectiveValue={effectiveValue}
                bonus={equipmentBonuses[statConfig.stat] || 0}
                Icon={statConfig.icon}
                label={statConfig.label}
                color={getStatColor(statConfig.stat, false)}
                level={player.statLevels[statConfig.stat] || 0}
                isAffectedByInjury={isAffected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}