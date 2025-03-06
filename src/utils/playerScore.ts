import { Player } from '../types/game';
import { calculateTotalInjuryEffect } from './injuryUtils';

export const STAT_WEIGHTS = {
  // Physical stats
  endurance: 1.0,     // Base multiplier for endurance
  strength: 1.2,      // Slightly higher for strength
  agility: 1.3,       // Important for court movement
  speed: 1.2,         // Key for court coverage
  explosiveness: 1.1,  // For quick actions
  injuryPrevention: 1.0, // Base multiplier for prevention
  // Technical stats
  smash: 1.4,         // Main offensive weapon
  defense: 1.2,      // Essential technique
  serve: 1.3,         // Important for points
  stick: 1.1,         // Defensive skill
  slice: 1.2,         // Tactical skill
  drop: 1.3,          // Finishing skill
};

function calculateEquipmentBonuses(player: Player): Partial<Record<string, number>> {
  const bonuses: Partial<Record<string, number>> = {};
  
  if (player.equipment) {
    Object.values(player.equipment).forEach((item) => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, bonus]) => {
          bonuses[stat] = (bonuses[stat] || 0) + (bonus as number);
        });
      }
    });
  }
  
  return bonuses;
}

export function calculatePlayerScore(player: Player) {
  if (!player || !player.stats || !player.statLevels) {
    return {
      score: 0,
      details: {
        baseScore: 0,
        balanceScore: 1,
        specialization: [],
        weaknesses: [],
        physicalScore: 0,
        technicalScore: 0,
        equipmentBonuses: {},
      },
    };
  }

  const equipmentBonuses = calculateEquipmentBonuses(player);
  const injuryEffects = calculateTotalInjuryEffect(player);
  
  const physicalStats = ['endurance', 'strength', 'agility', 'speed', 'explosiveness', 'injuryPrevention'];
  const technicalStats = ['smash', 'defense', 'serve', 'stick', 'slice', 'drop'];
  
  // Apply equipment bonuses and injury effects to stats for score calculation
  const enhancedStats = { ...player.stats };
  Object.entries(equipmentBonuses).forEach(([stat, bonus]) => {
    if (stat in enhancedStats) {
      enhancedStats[stat as keyof typeof enhancedStats] += bonus || 0;
    }
  });

  // Apply injury effects
  Object.entries(injuryEffects).forEach(([stat, value]) => {
    if (stat in enhancedStats) {
      enhancedStats[stat as keyof typeof enhancedStats] = value;
    }
  });

  // Calculate physical and technical scores with level multipliers
  const physicalScore = physicalStats.reduce((total, stat) => {
    const baseValue = enhancedStats[stat as keyof typeof enhancedStats] || 0;
    const levelMultiplier = 1 + ((player.statLevels[stat as keyof typeof player.statLevels] || 0) * 0.1);
    return total + baseValue * levelMultiplier * (STAT_WEIGHTS[stat as keyof typeof STAT_WEIGHTS] || 1);
  }, 0);

  const technicalScore = technicalStats.reduce((total, stat) => {
    const baseValue = enhancedStats[stat as keyof typeof enhancedStats] || 0;
    const levelMultiplier = 1 + ((player.statLevels[stat as keyof typeof player.statLevels] || 0) * 0.1);
    return total + baseValue * levelMultiplier * (STAT_WEIGHTS[stat as keyof typeof STAT_WEIGHTS] || 1);
  }, 0);

  const baseScore = physicalScore + technicalScore;

  // Analyze specialization and weaknesses with adjusted thresholds
  const statLevels = Object.values(player.statLevels).filter(level => typeof level === 'number');
  const avgStatLevel = statLevels.length > 0 
    ? statLevels.reduce((a, b) => a + b, 0) / statLevels.length 
    : 0;

  const specialization = Object.entries(player.statLevels)
    .filter(([_, level]) => typeof level === 'number' && level > avgStatLevel * 1.3)
    .map(([stat]) => stat);

  const weaknesses = Object.entries(player.statLevels)
    .filter(([_, level]) => typeof level === 'number' && level < avgStatLevel * 0.7)
    .map(([stat]) => stat);

  // Calculate balance score with reduced penalties
  const IMBALANCE_PENALTY = 0.05; // Reduced penalty per weakness
  const balanceScore = Math.max(0.8, 1 - (weaknesses.length * IMBALANCE_PENALTY)); // Minimum 0.8x multiplier

  // Calculate final score
  const finalScore = Math.round(baseScore * balanceScore);

  return {
    score: finalScore,
    details: {
      baseScore: Math.round(baseScore),
      balanceScore: Number(balanceScore.toFixed(2)),
      specialization,
      weaknesses,
      physicalScore: Math.round(physicalScore),
      technicalScore: Math.round(technicalScore),
      equipmentBonuses,
    },
  };
}