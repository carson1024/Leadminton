import { PlayerEquipment } from "./equipment";

export type PlayerGender = 'male' | 'female';

export interface Injury {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  recoveryTime: number;
  recoveryEndTime: number;
  affectedStats?: Partial<PlayerStats>;
  createdAt: number;
}

<<<<<<< HEAD
export interface PlayHistory {
  result: boolean;
  level1: number;
  level2: number;
}

=======
>>>>>>> a3ea31750ecc8a976cbd0e7d918482a143f70c3d
export interface PlayerStrategy {
  physicalCommitment: number;  // Implication physique
  playStyle: number;           // Style de frappe
  movementSpeed: number;       // Vitesse de déplacement
  fatigueManagement: number;   // Gestion de la fatigue
  rallyConsistency: number;    // Consistance dans les échanges
  riskTaking: number;          // Prise de risque
  attack: number;              // Attaque (smash)
  softAttack: number;          // Soft attaque (drop shot)
  serving: number;             // Mise en jeu
  courtDefense: number;        // Protection du terrain
  mentalToughness: number;     // Résilience mentale
  selfConfidence: number;      // Confiance en soi
}

export interface Player {
  id: string;
  name: string;
  gender?: PlayerGender;
  stats: PlayerStats;
  statLevels: Record<keyof PlayerStats, number>;
  level: number;
  maxLevel: number;
  rank: number;
  equipment: PlayerEquipment;
  training?: {
    stat: keyof PlayerStats;
    startTime: number;
    period: number;
  };
  injuries: Injury[];
  strategy: PlayerStrategy;
}

export interface PlayerStats {
  endurance: number;
  strength: number;
  agility: number;
  speed: number;
  explosiveness: number;
  injuryPrevention: number;
  smash: number;
  defense: number;
  serve: number;
  stick: number;
  slice: number;
  drop: number;
}

export interface Resources {
  shuttlecocks: number;
  meals: number;
  coins: number;
  diamonds: number;
}

export interface GameState {
  players: Player[];
  facilities: Facility[];
  managers: Manager[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'shuttlecock-machine' | 'canteen' | 'sponsors' | 'training-center';
  level: number;
  productionRate: number;
  resourceType?: keyof Omit<Resources, 'diamonds'>;
  maxPlayers: number;
  upgradeCost: {
    coins: number;
    shuttlecocks: number;
    meals: number;
    diamonds: number;
  };
  upgrading?: {
    startTime: number;
    period: number;
  };
}

export interface Manager {
  id: string;
  name: string;
  facilityType: 'shuttlecock-machine' | 'canteen' | 'sponsors';
  productionBonus: number;
  active: boolean;
  imageUrl: string;
  cost: number;
  purchasing?: {
    startTime: number;
    period: number;
  };
}