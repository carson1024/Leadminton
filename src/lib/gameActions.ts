// Local game actions without database
import { calculateTrainingTime, calculateUpgradeTime } from '@/utils/timeCalculator';
import { Player, Facility, Equipment, PlayerStrategy, Resources } from '../types/game';
import { supabase } from './supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUpgradedFacility } from '@/utils/facilityUtils';

export async function recordResourceUpdate(userId: string | undefined, source: string, changes: Partial<Record<keyof Resources, number>>, isAdd: boolean = true) {
  if (!changes || !source || !userId) return;
  const data = Object.entries(changes).map(([resource, amount]) => ({
    resource_type: resource,
    amount: isAdd ? amount : -amount,
    source: source
  }));

  await supabase.rpc("batch_resource_transactions", {p_user_id: userId, p_transactions: data});

}

export async function recordTrainingStart(
  player: Player,
  stat: keyof Player['stats'],
  costs: { shuttlecocks: number; meals: number; coins: number }
) {
  if (!player.id) return;
  // Local implementation - no database needed
  await supabase
    .from('players')
    .update({
      training: {
        stat,
        startTime: Date.now(),
        period: calculateTrainingTime(player.statLevels[stat])
      }
    })
    .eq('id', player.id);
  console.log('Training started:', { player: player.name, stat, costs });
}

export async function recordTrainingComplete(
  player: Player,
  stat: keyof Player['stats'],
  newValue: number
) {
  if (!player.id) return;
  await supabase
    .from('players')
    .update({
      training: null,
      level: player.level + 1
    })
    .eq('id', player.id);
  await supabase
    .from('player_stats')
    .update({
      [stat]: newValue
    })
    .eq('player_id', player.id);
  await supabase
    .from('player_levels')
    .update([{
      [stat]: player.statLevels[stat] + 1
    }])
    .eq('player_id', player.id);
  // Local implementation - no database needed
  console.log('Training completed:', { player: player.name, stat, newValue });
}

export async function recordPlayerStrategyChange(playerId: string, strategy: PlayerStrategy) {
  if (!playerId) return;
  await supabase
    .from('player_strategy')
    .update([{
      physical_commitment: strategy.physicalCommitment,
      play_style: strategy.playStyle,
      movement_speed: strategy.movementSpeed,
      fatigue_management: strategy.fatigueManagement,
      rally_consistency: strategy.rallyConsistency,
      risk_taking: strategy.riskTaking,
      attack: strategy.attack,
      soft_attack: strategy.softAttack,
      serving: strategy.serving,
      court_defense: strategy.courtDefense,
      mental_toughness: strategy.mentalToughness,
      self_confidence: strategy.selfConfidence,
    }])
    .eq('player_id', playerId);
}

export async function recordHireManagerComplete(
  managerId: string,
) {
  await supabase
    .from('managers')
    .update([{
      active: false,
      purchasing: null
    }])
    .eq('id', managerId);
}

export async function recordHireManager(
  managerId: string,
) {
  await supabase
    .from('managers')
    .update([{
      active: true,
      purchasing: {
        startTime: Date.now(),
        period: (5 * 24 * 60 * 60 * 1000), // 5 days
      }
    }])
    .eq('id', managerId);
}

export async function recordFacilityUpgradeStart(
  facility: Facility,
  costs: { coins: number; shuttlecocks: number; meals: number }
) {
  await supabase
    .from('facilities')
    .update([{
      upgrading: {
        startTime: Date.now(),
        period: calculateUpgradeTime(facility.level),
      }
    }])
    .eq('id', facility.id);
  console.log('Facility upgrade started:', { facility: facility.name, costs });
}

export async function recordFacilityUpgradeComplete(facility: Facility, upgradedFacility: Partial<Facility>) {
  await supabase
    .from('facilities')
    .update([{
      level: upgradedFacility.level,
      production_rate: upgradedFacility.productionRate,
      max_players: upgradedFacility.maxPlayers,
      upgrade_cost: upgradedFacility.upgradeCost,
      upgrading: upgradedFacility.upgrading || null,
    }])
    .eq('id', facility.id);
  // Local implementation - no database needed
  console.log('Facility upgrade completed:', facility.name);
}

export function recordEquipmentChange(
  player: Player,
  equipment: Equipment,
  action: 'purchase' | 'equip' | 'unequip',
  costs?: { coins: number; diamonds: number }
) {
  // Local implementation - no database needed
  console.log('Equipment change:', { 
    player: player.name, 
    equipment: equipment.name, 
    action,
    costs 
  });
}