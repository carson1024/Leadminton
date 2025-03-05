import React from 'react';
import { Users } from 'lucide-react';
import { GameState, Resources, Player, PlayerStrategy } from '../types/game';
import PlayerCard from '../components/player/PlayerCard';
import RecruitButton from '../components/club/RecruitButton';
import { calculateTrainingCost, calculateSpeedUpCost, calculateNewPlayerCost } from '../utils/costCalculator';
import { calculateTrainingTime } from '../utils/timeCalculator';
import { generateRandomName } from '../utils/nameGenerator';
import { generateInitialStats, generateInitialStatLevels } from '@/utils/initialState';
import { recordTrainingStart, recordTrainingComplete, recordEquipmentChange, recordPlayerStrategyChange } from '../lib/gameActions';
import { Equipment } from '../types/equipment';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { createPlayer, updateName } from '@/utils/gameUtils';

export default function ClubPage() {
  
  const { resources, gameState, updateResources, dispatchGameState, setGameState } = useGame();
  const { user } = useAuth();

  const handleNameChange = async (playerId: string, newName: string) => {
    updateName(playerId, newName);
    dispatchGameState({ type: 'UPDATE_PLAYER_NAME', payload: { playerId, name: newName } })
  }

  const handleStartTraining = async (playerId: string, stat: keyof Player['stats']) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player || player.training || player.level >= player.maxLevel) return;

    const trainingCost = calculateTrainingCost(player, stat);
    const canAfford = Object.entries(trainingCost).every(
      ([resource, cost]) => resources[resource as keyof Resources] >= cost
    );

    if (!canAfford) return;

    await recordTrainingStart(player, stat, trainingCost);

    updateResources("training_cost", trainingCost, false);

    dispatchGameState({type: 'START_TRAINING', payload: {playerId, stat}});
  };

  const handleUpdateStrategy = async (playerId: string, strategy: PlayerStrategy) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    if (player.strategy == strategy) return;

    await recordPlayerStrategyChange(playerId, strategy);

    dispatchGameState({type: 'UPDATE_STRATEGY', payload: {playerId, strategy}});
  }

  const handleSpeedUpTraining = async (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player?.training) return;

    const timeLeft = player.training.startTime + player.training.period - Date.now();
    const diamondCost = calculateSpeedUpCost(timeLeft);

    if (resources.diamonds < diamondCost) return;

    updateResources("training_cost", {
      diamonds: -diamondCost
    });

    const newStatValue = Math.min(100, player.stats[player.training.stat] + 5);
    await recordTrainingComplete(player, player.training.stat, newStatValue);

    dispatchGameState({ type: 'COMPLETE_TRAINING', payload: { playerId } });
  };

  const handleEquipItem = async (playerId: string, equipment: Equipment) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    await recordEquipmentChange(player, equipment, 'equip');

    dispatchGameState({ type: 'EQUIP_ITEM', payload: { playerId } });
  };

  const handleRecruitPlayer = async () => {
    const cost = calculateNewPlayerCost(gameState.players.length);
    const maxPlayers = gameState.facilities.find(f => f.type === 'training-center')?.maxPlayers || 1;

    if (gameState.players.length >= maxPlayers || resources.coins < cost) return;

    updateResources("training_cost", {
      coins: -cost
    });

    if (user?.id) {
      const player = await createPlayer(user.id);
      dispatchGameState({ type: 'ADD_PLAYER', payload: { player } });
    }
  };

  const handleHeal = (playerId: string, itemId: string, recoveryReduction: number) => {
    const HEALING_ITEMS = {
      'bandage': 2,
      'first-aid-kit': 4,
      'medical-kit': 8
    };

    const cost = HEALING_ITEMS[itemId as keyof typeof HEALING_ITEMS];
    if (!cost || resources.diamonds < cost) return;

    updateResources("training_cost", {
      diamonds: -cost
    });

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => {
        if (player.id === playerId && player.injuries) {
          const now = Date.now();
          // Appliquer la réduction à toutes les blessures actives
          const updatedInjuries = player.injuries.map(injury => {
            if (injury.recoveryEndTime > now) {
              const remainingTime = injury.recoveryEndTime - now;
              const reducedTime = remainingTime * (1 - recoveryReduction);
              return {
                ...injury,
                recoveryEndTime: now + reducedTime
              };
            }
            return injury;
          });

          return {
            ...player,
            injuries: updatedInjuries
          };
        }
        return player;
      })
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">My Club</h1>
        </div>
        <RecruitButton
          currentPlayers={gameState.players.length}
          maxPlayers={gameState.facilities.find(f => f.type === 'training-center')?.maxPlayers || 1}
          coins={resources.coins}
          onRecruit={handleRecruitPlayer}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameState.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onStartTraining={handleStartTraining}
            calculateTrainingCost={calculateTrainingCost}
            canAffordTraining={(cost) => 
              Object.entries(cost).every(
                ([resource, amount]) => resources[resource as keyof Resources] >= amount
              )
            }
            onNameChange={handleNameChange}
            onUpdateStrategy={handleUpdateStrategy}
            onSpeedUpTraining={handleSpeedUpTraining}
            canAffordSpeedUp={(diamondCost) => resources.diamonds >= diamondCost}
            resources={resources}
            onEquipItem={handleEquipItem}
            onHeal={handleHeal}
          />
        ))}
      </div>
    </div>
  );
}