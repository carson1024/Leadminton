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

export interface PlayHistory {
  result: boolean;
  level1: number;
  level2: number;
}

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

export interface MatchHistory {
  opponent_id: number;
  opponent_rank: number;
  match_date: Date;
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
  best: MatchHistory[];
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
  seasons: Season[];
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

export interface Season {
  id: string;
  entryFee: {
    player: number;
    coins: number;
    shuttlecocks: number;
    meals: number;
    diamonds: number;
  },
  prizePool: {
    [key: string]: {
      coins: number;
      diamonds: number;
    }
  },
  match_days: Array<Date>;
  type: number;
}