import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useState } from 'react';
import { GameState, Resources, Player } from '../types/game';
import { initialState } from '../utils/initialState';
import { rootReducer, GameAction } from '../reducers/rootReducer';
import { recordEquipmentChange, recordResourceUpdate } from '../lib/gameActions';
import { useAuth } from './AuthContext';
import { loadGameState, loadResources } from '@/utils/gameUtils';
import { Equipment } from '@/types/equipment';

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
  const { isLogin, user } = useAuth();
  const [resources, setResources] = useState<Resources>({
    shuttlecocks: 10,
    meals: 10,
    coins: 200,
    diamonds: 9999999,
  });

  const updateResources = useCallback(async (source: string, changes: Partial<Record<keyof Resources, number>>, isAdd: boolean = true) => {
    await recordResourceUpdate(user?.id, source, changes, isAdd);
    setResources(prev => {
      let newResources: Resources = { ...prev };
      Object.entries(changes).map(([resource, amount]) => {
        newResources[resource as keyof Resources] += isAdd ? amount : -amount;
      });
      return newResources;
    });
  }, [resources, user]);
  
  const loadState = async () => {
    if (!user || !user.email) {
      dispatch({ type: 'SET_GAME_STATE', payload: {state: initialState} });
      return;
    }

    const state = await loadGameState();
    dispatch({ type: 'SET_GAME_STATE', payload: {state: state} });
    
  };

  useEffect(() => {
    if (!user) return;
    console.log("User Loaded");

    const loadResource = async () => {
      const newResources = await loadResources(user.id);
      newResources && setResources(newResources);
    };

    const timer = setInterval(loadResource, 60000);
    loadResource();
    loadState();

    return () => clearInterval(timer);
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