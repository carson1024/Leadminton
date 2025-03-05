import { Player, Resources } from './game';

export type TournamentTier = 'local' | 'regional' | 'national' | 'international' | 'premier';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Match {
  id: string;
  players: (Player | null)[];
  winner?: Player;
  score?: string;
  startTime?: number;
  completed: boolean;
}

export interface TournamentRound {
  name: string;
  matches: Match[];
}

export interface Tournament {
  id: string;
  name: string;
  tier: TournamentTier;
  status: TournamentStatus;
  startDate: number;
  endDate: number;
  entryFee: Partial<Resources>;
  prizePool: {
    first: Partial<Resources>;
    second: Partial<Resources>;
    third: Partial<Resources>;
  };
  minPlayerLevel: number;
  maxParticipants: number;
  currentParticipants: number;
  registeredPlayers?: RegisteredPlayer[];
  isQuickTournament?: boolean;
  rounds?: TournamentRound[];
}

export interface RegisteredPlayer {
  playerId: string;
  playerName: string;
  clubId: string;
  clubName: string;
  registered: number;
}

export interface TournamentResult {
  tournamentId: string;
  playerId: string;
  position: number;
  reward: Partial<Resources>;
  date: number;
}