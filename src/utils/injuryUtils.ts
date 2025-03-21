import { Player, PlayerStats, Injury } from '../types/game';

interface InjuryType {
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  recovery: number; // minutes
  affectedStats?: Array<keyof PlayerStats>;
  statPenalty?: number;
}

const INJURIES: InjuryType[] = [
  {
    type: 'Ankle sprain',
    severity: 'minor',
    recovery: 30,
    affectedStats: ['speed', 'agility'],
    statPenalty: 20
  },
  {
    type: 'Muscle strain',
    severity: 'minor',
    recovery: 45,
    affectedStats: ['strength', 'explosiveness'],
    statPenalty: 25
  },
  {
    type: 'Knee pain',
    severity: 'moderate',
    recovery: 60,
    affectedStats: ['speed', 'agility', 'explosiveness'],
    statPenalty: 30
  },
  {
    type: 'Wrist sprain',
    severity: 'moderate',
    recovery: 90,
    affectedStats: ['smash', 'defense', 'serve'],
    statPenalty: 35
  },
  {
    type: 'Back injury',
    severity: 'severe',
    recovery: 120,
    affectedStats: ['endurance', 'strength', 'agility', 'speed', 'explosiveness'],
    statPenalty: 40
  },
];

function calculateInjuryRisk(player: Player): number {
  // Increase the base probability for more injuries
  const baseRisk = 0.8; // 80% basic luck
  const preventionBonus = (player.stats.injuryPrevention / 200); // Reduce the effect of prevention
  return Math.max(0.3, baseRisk - preventionBonus); // Minimum 30% chance
}

export function checkForInjury(player: Player): Injury | null {
  const injuryRisk = calculateInjuryRisk(player);

  // Force an injury for the test
  const roll = Math.random();

  if (roll < injuryRisk) {
    const injuryType = INJURIES[Math.floor(Math.random() * INJURIES.length)];
    const now = Date.now();

    let affectedStats: Partial<PlayerStats> | undefined;
    if (injuryType.affectedStats && injuryType.statPenalty) {
      affectedStats = {};
      injuryType.affectedStats.forEach(stat => {
        const currentValue = player.stats[stat];
        affectedStats![stat] = Math.max(0, currentValue - injuryType.statPenalty!);
      });
    }

    /* console.log('Creating injury:', {
      type: injuryType.type,
      severity: injuryType.severity,
      affectedStats
    }); */

    return {
      id: `injury-${now}-${Math.random().toString(36).substr(2, 9)}`,
      type: injuryType.type,
      severity: injuryType.severity,
      recoveryTime: (injuryType.recovery * 60 * 1000),
      recoveryEndTime: now + (injuryType.recovery * 60 * 1000),
      affectedStats,
      createdAt: now
    };
  }
  return null;
}

export function getActiveInjuries(player: Player): Injury[] {
  const now = Date.now();
  return (player.injuries || []).filter(injury => injury.recoveryEndTime > now);
}

export function isPlayerAvailable(player: Player): boolean {
  return getActiveInjuries(player).length === 0;
}

export function calculateTotalInjuryEffect(player: Player): Partial<PlayerStats> {
  const activeInjuries = getActiveInjuries(player);
  if (activeInjuries.length === 0) return {};

  const totalEffect: Partial<PlayerStats> = {};
  activeInjuries.forEach(injury => {
    if (injury.affectedStats) {
      Object.entries(injury.affectedStats).forEach(([stat, value]) => {
        const typedStat = stat as keyof PlayerStats;
        if (totalEffect[typedStat] === undefined || value < totalEffect[typedStat]!) {
          totalEffect[typedStat] = value;
        }
      });
    }
  });

  return totalEffect;
}