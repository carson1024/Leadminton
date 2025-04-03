import { Facility, Manager } from '../types/game';

export function getUpgradedFacility(facility: Facility): Partial<Facility> {
  // Calculate new production rate
  const newProductionRate = calculateBaseProductionRate(facility, facility.level + 1);

  // Calculate new max players for training center
  const newMaxPlayers = facility.type === 'training-center'
    ? facility.maxPlayers + 1
    : facility.maxPlayers;

  // Calculate next level's upgrade cost
  const nextLevel = facility.level + 1;
  const nextUpgradeCost = calculateUpgradeCost(facility.type, nextLevel + 1);

  return {
    level: nextLevel,
    productionRate: newProductionRate,
    maxPlayers: newMaxPlayers,
    upgradeCost: nextUpgradeCost,
    upgrading: undefined,
  };
}

// Calcule le taux de production de base sans bonus de manager
function calculateBaseProductionRate(facility: Facility, level: number): number {
  if (facility.type === 'training-center') return 0;

  // Base rates for each facility type
  const baseRates = {
    'shuttlecock-machine': 1,
    'canteen': 1,
    'sponsors': 2,
  };

  // Get base rate for this facility type
  const baseRate = baseRates[facility.type as keyof typeof baseRates] || 1;

  // Production increases by 50% per level
  return Math.ceil(baseRate * (1 + (level - 1) * 0.5));
}

// Calcule le taux de production final avec bonus de manager
export function calculateProductionRate(
  facility: Facility,
  level = facility.level,
  activeManagers: Manager[] = []
): number {
  if (facility.type === 'training-center') return 0;

  // Calculer d'abord le taux de base pour ce niveau
  const baseRate = calculateBaseProductionRate(facility, level);

  // Trouver le manager actif pour cette installation
  const manager = activeManagers.find(m => m.facilityType === facility.type && m.active);

  // Appliquer le bonus du manager si présent
  const finalRate = manager
    ? Math.ceil(baseRate * (1 + manager.productionBonus))
    : baseRate;


  return finalRate;
}

function calculateUpgradeCost(facilityType: string, level: number) {
  // Base cost starts at 100 and doubles each level
  const baseCost = 100 * Math.pow(2, level - 1);

  return {
    coins: Math.floor(baseCost),
    shuttlecocks: facilityType === 'training-center' ? Math.floor(baseCost / 4) : 0,
    meals: facilityType === 'training-center' ? Math.floor(baseCost / 4) : 0,
    diamonds: 0
  };
}

export function getInitialUpgradeCost(facility: Facility) {
  return calculateUpgradeCost(facility.type, facility.level + 1);
}