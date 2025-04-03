import { calculateTrainingTime } from '@/utils/timeCalculator';
import { Player, PlayerStrategy } from '../types/game';
import { Equipment } from '@/types/equipment';

type PlayerAction =
  | { type: 'ADD_PLAYER'; payload: { player: Player } }
  | { type: 'START_TRAINING'; payload: { playerId: string; stat: keyof Player['stats'] } }
  | { type: 'COMPLETE_TRAINING'; payload: { playerId: string } }
  | { type: 'EQUIP_ITEM'; payload: { playerId: string; equipment: Equipment } }
  | { type: 'UPDATE_STRATEGY'; payload: { playerId: string; strategy: PlayerStrategy } }
  | { type: 'UPDATE_PLAYER_NAME'; payload: { playerId: string; name: string } }
  | { type: 'ADD_INJURY'; payload: { playerId: string; injury: any } }
  | { type: 'UPDATE_RANK'; payload: { playerId: string; rank: number } }
  | { type: 'HEAL_INJURY'; payload: { playerId: string; injuryId: string } }
  | { type: 'UPDATE_BEST'; payload: { playerId: string; best } };

export function playerReducer(players: Player[], action: PlayerAction): Player[] {
  switch (action.type) {
    case 'ADD_PLAYER':
      return [
        ...players,
        action.payload.player
      ]
    case 'START_TRAINING':
      return players.map(player =>
        player.id === action.payload.playerId
          ? {
            ...player,
            training: {
              stat: action.payload.stat,
              startTime: Date.now(),
              period: calculateTrainingTime(player.statLevels[action.payload.stat]),
            },
          }
          : player
      );

    case 'COMPLETE_TRAINING':
      return players.map(player =>
        player.id === action.payload.playerId && player.training
          ? {
            ...player,
            stats: {
              ...player.stats,
              [player.training.stat]: player.stats[player.training.stat] + 5,
            },
            statLevels: {
              ...player.statLevels,
              [player.training.stat]: player.statLevels[player.training.stat] + 1,
            },
            level: player.level + 1,
            training: undefined,
          }
          : player
      );

    case 'UPDATE_STRATEGY':
      return players.map(player =>
        player.id === action.payload.playerId
          ? {
            ...player,
            strategy: action.payload.strategy,
          }
          : player
      );
    case 'EQUIP_ITEM':
      return players.map(player =>
        player.id === action.payload.playerId
          ? {
            ...player,
            equipment: {
              ...player.equipment,
              [action.payload.equipment.type]: action.payload.equipment,
            },
          }
          : player
      );

    case 'UPDATE_PLAYER_NAME':
      return players.map(player =>
        player.id === action.payload.playerId
          ? { ...player, name: action.payload.name }
          : player
      );

    case 'UPDATE_RANK':
      return players.map(player => player.id === action.payload.playerId ? { ...player, rank: action.payload.rank } : player)

    case 'UPDATE_BEST':
      return players.map(player => player.id === action.payload.playerId ? { ...player, best: action.payload.best } : player)

    case 'ADD_INJURY':
      return players.map(player =>
        player.id === action.payload.playerId
          ? {
            ...player,
            injuries: [...(player.injuries || []), action.payload.injury],
          }
          : player
      );

    case 'HEAL_INJURY':
      return players.map(player =>
        player.id === action.payload.playerId
          ? {
            ...player,
            injuries: player.injuries.filter(injury => injury.id !== action.payload.injuryId),
          }
          : player
      );

    default:
      return players;
  }
}