import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import { Player, Resources } from '../types/game';
import MatchLoading from '../components/tournaments/MatchLoading';
import QuickMatchResult from '../components/tournaments/QuickMatchResult';
import { simulateQuickTournament } from '../utils/tournamentSimulator';
import { useGame } from '@/contexts/GameContext';

interface QuickMatchPageProps {
  players: Player[];
  onRegister: (playerId: string, updatedPlayer: Player) => void;
}

export default function QuickMatchPage() {
  const { gameState, updateResources } = useGame();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSimulatingMatch, setIsSimulatingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Start quick match with selected player
  const handleStartMatch = (playerId: string) => {
    setIsSimulatingMatch(true);
    setMatchResult(null); // Reset match result
    
    setTimeout(() => {
      const player = gameState.players.find((p: Player) => p.id === playerId);
      if (player) {
        try {
          // do a quick match with player and cpu.
          const result = simulateQuickTournament(player);
          console.log('Match result:', result); // Debug log
        
          setMatchResult(result);
        } catch (error) {
          console.error('Error simulating match:', error);
        }
      }
      setIsSimulatingMatch(false);
    }, 10000);
  };

  const handleCloseResult = async (rewards: Partial<Record<keyof Resources, number>>) => {
    setMatchResult(null);
    setSelectedPlayerId(null);
    setIsSimulatingMatch(false);
    // update resources after finishing quick match
    updateResources("tournament_reward", rewards);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Swords className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Quick Match</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Start a Quick Match</h2>
          <p className="text-gray-600 mb-6">
            Challenge an opponent to a quick match and earn rewards instantly! 
            Select your player and get ready for an exciting match.
          </p>

          <div className="space-y-3 mb-6">
            {gameState.players.map((player: Player) => (
              <label
                key={player.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                  selectedPlayerId === player.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <input
                  type="radio"
                  checked={selectedPlayerId === player.id}
                  onChange={() => setSelectedPlayerId(player.id)}
                  className="w-4 h-4 text-blue-500"
                />
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-gray-600">Level {player.level}</div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => selectedPlayerId && handleStartMatch(selectedPlayerId)}
            disabled={!selectedPlayerId || isSimulatingMatch}
            className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 ${
              selectedPlayerId && !isSimulatingMatch
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Swords className="w-5 h-5" />
            <span>Start Quick Match</span>
          </button>
        </div>
      </div>

      {isSimulatingMatch && <MatchLoading />}
      
      {matchResult && !isSimulatingMatch && (
        <QuickMatchResult
          matchResult={matchResult}
          rewards={{
            coins: matchResult.winner.id === selectedPlayerId ? 200 : 50,
            diamonds: matchResult.winner.id === selectedPlayerId ? 1 : 0
          }}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}