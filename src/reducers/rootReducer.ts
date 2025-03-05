import { GameState } from '../types/game';
import { playerReducer } from './playerReducer';
import { facilityReducer } from './facilityReducer';
import { managerReducer } from './managerReducer';
import { initialState } from '@/utils/initialState';

export type GameAction =
  | { type: 'SET_GAME_STATE'; payload: {
    state: GameState
  } }
  | { type: string; payload?: any }; // Pour les autres actions spécifiques aux reducers

export function rootReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.payload?.state;
    default:
      return {
        ...state,
        players: playerReducer(state.players, action as any),
        facilities: facilityReducer(state.facilities, action as any),
        managers: managerReducer(state.managers, action as any),
      };
  }
}