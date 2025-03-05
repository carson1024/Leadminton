import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { GameState, Resources, Player, Equipment } from '../types/game';
import { initialState } from '../utils/initialState';
import { useResourceProduction } from '../hooks/useResourceProduction';
import { rootReducer, GameAction } from '../reducers/rootReducer';
import { recordTrainingStart, recordTrainingComplete, recordEquipmentChange, recordResourceUpdate } from '../lib/gameActions';
import { calculateSpeedUpCost, calculateTrainingCost } from '../utils/costCalculator';
import { useAuth } from './AuthContext';
import { loadGameState, loadResources } from '@/utils/gameUtils';

interface GameContextType {
  gameState: GameState;
  resources: Resources;
  updateResources: (source: string, changes: Partial<Record<keyof Resources, number>>, isAdd?: boolean) => void;
  setGameState: (callback: (prev: GameState) => GameState) => void;
  dispatchGameState: React.Dispatch<GameAction>;
  equipItem: (playerId: string, equipment: Equipment) => void;
  updatePlayerName: (playerId: string, name: string) => void;
  healInjury: (playerId: string, injuryId: string, recoveryReduction: number) => void;
  handleQuickMatch: (playerId: string, updatedPlayer: Player) => void;
  purchaseResources: (
    resource: keyof Resources,
    amount: number,
    cost: number
  ) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, dispatch] = useReducer(rootReducer, initialState);
  const { resources, setResources, updateResources } = useResourceProduction(gameState.facilities, gameState.managers);
  const { isLogin, user } = useAuth();
  const loadState = async () => {
    if (!user || !user.email) {
      dispatch({ type: 'SET_GAME_STATE', payload: {state: initialState} });
      return;
    }
    setResources(await loadResources(user.id));
    const state = await loadGameState();
    dispatch({ type: 'SET_GAME_STATE', payload: {state: state} });
  };

  useEffect(() => {
    if (!isLogin) return;
    loadState();
  }, [isLogin]);

  const equipItem = async (playerId: string, equipment: Equipment) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    try {
      await recordEquipmentChange(player, equipment, 'equip');
      dispatch({ type: 'EQUIP_ITEM', payload: { playerId, equipment } });
    } catch (error) {
      console.error('Failed to equip item:', error);
    }
  };

  const updatePlayerName = (playerId: string, name: string) => {
    dispatch({ type: 'UPDATE_PLAYER_NAME', payload: { playerId, name } });
  };

  const healInjury = (playerId: string, injuryId: string, recoveryReduction: number) => {
    dispatch({ type: 'HEAL_INJURY', payload: { playerId, injuryId } });
  };

  const handleQuickMatch = (playerId: string, updatedPlayer: Player) => {
    // setGameState(prev => ({
    //   ...prev,
    //   players: prev.players.map(p => 
    //     p.id === playerId ? updatedPlayer : p
    //   )
    // }));
  };

  const purchaseResources = (
    resource: keyof Resources,
    amount: number,
    cost: number
  ) => {
    if (resources.diamonds < cost) return;

    updateResources("shop_purchase", {
      [resource]: amount,
      diamonds: -cost
    })
  };

  const setGameState = (callback: (prev: GameState) => GameState) => {
    dispatch({type: 'SET_GAME_STATE', payload: {state: callback(gameState)}});
  }

  const value = {
    gameState,
    resources,
    updateResources,
    setGameState,
    dispatchGameState: dispatch,
    equipItem,
    updatePlayerName,
    healInjury,
    handleQuickMatch,
    purchaseResources
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}