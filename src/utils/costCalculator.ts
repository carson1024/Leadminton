import { Player } from '../types/game';
import { STAT_WEIGHTS } from './playerScore';

const BASE_TRAINING_COST = {
  physical: {
    shuttlecocks: 5,
    meals: 3,
    coins: 50,
  },
  technical: {
    shuttlecocks: 8,
    meals: 4,
    coins: 75,
  }
};

const PHYSICAL_STATS = ['endurance', 'strength', 'agility', 'speed', 'explosiveness', 'injuryPrevention'] as const;
const TECHNICAL_STATS = ['smash', 'defense', 'serve', 'stick', 'slice', 'drop'] as const;

export function calculateTrainingCost(player: Player, stat: keyof Player['stats']) {
  const statLevel = player.statLevels[stat];
  const baseCosts = PHYSICAL_STATS.includes(stat as any) 
    ? BASE_TRAINING_COST.physical 
    : BASE_TRAINING_COST.technical;

  return {
    shuttlecocks: Math.round(baseCosts.shuttlecocks * Math.pow(1.5, statLevel) * STAT_WEIGHTS[stat]),
    meals: Math.round(baseCosts.meals * Math.pow(1.5, statLevel) * STAT_WEIGHTS[stat]),
    coins: Math.round(baseCosts.coins * Math.pow(1.5, statLevel) * STAT_WEIGHTS[stat]),
  };
}

export function calculateSpeedUpCost(timeLeft: number): number {
  return Math.max(1, Math.ceil(timeLeft / 10000));
}

export const NEW_PLAYER_BASE_COST = 100;

export function calculateNewPlayerCost(currentPlayerCount: number): number {
  return NEW_PLAYER_BASE_COST * Math.pow(2, currentPlayerCount - 1);
}