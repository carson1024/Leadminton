import { GameState, Player, PlayerStrategy } from '../types/game';
import { generateRandomName, generateRandomGender } from './nameGenerator';

export function generateInitialStats() {
  return {
    endurance: Math.floor(Math.random() * 20) + 40,
    strength: Math.floor(Math.random() * 20) + 40,
    agility: Math.floor(Math.random() * 20) + 40,
    speed: Math.floor(Math.random() * 20) + 40,
    explosiveness: Math.floor(Math.random() * 20) + 40,
    injuryPrevention: Math.floor(Math.random() * 20) + 40,
    smash: Math.floor(Math.random() * 20) + 40,
    defense: Math.floor(Math.random() * 20) + 40,
    serve: Math.floor(Math.random() * 20) + 40,
    stick: Math.floor(Math.random() * 20) + 40,
    slice: Math.floor(Math.random() * 20) + 40,
    drop: Math.floor(Math.random() * 20) + 40,
  };
}

export function generateInitialStatLevels() {
  return {
    endurance: 0,
    strength: 0,
    agility: 0,
    speed: 0,
    explosiveness: 0,
    injuryPrevention: 0,
    smash: 0,
    defense: 0,
    serve: 0,
    stick: 0,
    slice: 0,
    drop: 0,
  };
}

export function generateInitialStrategy(): PlayerStrategy {
  return {
    physicalCommitment: 5,
    playStyle: 5,
    movementSpeed: 5,
    fatigueManagement: 5,
    rallyConsistency: 5,
    riskTaking: 5,
    attack: 5,
    softAttack: 5,
    serving: 5,
    courtDefense: 5,
    mentalToughness: 5,
    selfConfidence: 5,
  };
}

export const initialFacilities = [
  {
    id: 'shuttlecock-machine',
    name: 'Machine à volants',
    type: 'shuttlecock-machine' as const,
    level: 1,
    productionRate: 1,
    resourceType: 'shuttlecocks' as const,
    maxPlayers: 0,
    upgradeCost: {
      coins: 100,
      shuttlecocks: 0,
      meals: 0,
      diamonds: 0
    }
  },
  {
    id: 'canteen',
    name: 'Cantine',
    type: 'canteen' as const,
    level: 1,
    productionRate: 1,
    resourceType: 'meals' as const,
    maxPlayers: 0,
    upgradeCost: {
      coins: 150,
      shuttlecocks: 0,
      meals: 0,
      diamonds: 0
    }
  },
  {
    id: 'sponsors',
    name: 'Sponsors',
    type: 'sponsors' as const,
    level: 1,
    productionRate: 2,
    resourceType: 'coins' as const,
    maxPlayers: 0,
    upgradeCost: {
      coins: 200,
      shuttlecocks: 0,
      meals: 0,
      diamonds: 0
    }
  },
  {
    id: 'training-center',
    name: 'Centre d\'entraînement',
    type: 'training-center' as const,
    level: 1,
    productionRate: 0,
    resourceType: undefined,
    maxPlayers: 2,
    upgradeCost: {
      coins: 300,
      shuttlecocks: 50,
      meals: 50,
      diamonds: 0
    }
  }
];

export const initialManagers = [
  {
    id: 'manager-1',
    name: 'José',
    facilityType: 'shuttlecock-machine' as const,
    productionBonus: 0.5,
    active: false,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    cost: 50
  },
  {
    id: 'manager-2',
    name: 'Gordon Ramsay',
    facilityType: 'canteen' as const,
    productionBonus: 0.5,
    active: false,
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c',
    cost: 50
  },
  {
    id: 'manager-3',
    name: 'Ronald Dump',
    facilityType: 'sponsors' as const,
    productionBonus: 0.5,
    active: false,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    cost: 50
  }
];

export function generateNewPlayer(): Player {
  const gender = generateRandomGender();
  return {
    id: '',
    name: generateRandomName(gender),
    gender,
    stats: generateInitialStats(),
    statLevels: generateInitialStatLevels(),
    strategy: generateInitialStrategy(),
    rank: 12,
    level: 1,
    training: undefined,
    maxLevel: Math.floor(Math.random() * 50) + 150,
    equipment: {},
    injuries: []
  };
}

export const initialState: GameState = {
  players: [],
  facilities: [],
  managers: []
};