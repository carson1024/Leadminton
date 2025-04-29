import { Player } from '../types/game';

/**
 * Calculate player's strength
 * @param player 
 * @returns 
 */
export function calculatePlayerStrength(player: Player): number {
  // Calculate base strength from stats
  const physicalScore = Object.entries(player.stats)
    .filter(([stat]) => ['endurance', 'strength', 'agility', 'speed', 'explosiveness'].includes(stat))
    .reduce((sum, [_, value]) => sum + value, 0);

  const technicalScore = Object.entries(player.stats)
    .filter(([stat]) => ['smash', 'defense', 'serve', 'stick', 'slice', 'drop'].includes(stat))
    .reduce((sum, [_, value]) => sum + value, 0);


  // Equipment bonuses
  let equipmentBonus = 0;
  if (player.equipment) {
    Object.values(player.equipment).forEach(item => {
      if (item) {
        Object.values(item.stats).forEach((bonus: any) => {
          equipmentBonus += bonus;
        });
      }
    });
  }

  // Level bonus (5% per level)
  const levelBonus = player.level * 5;
  return (physicalScore + technicalScore + equipmentBonus) * (1 + levelBonus / 100);
}