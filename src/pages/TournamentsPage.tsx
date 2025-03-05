import React, { useState, useEffect } from 'react';
import { Trophy, Filter } from 'lucide-react';
import TournamentList from '../components/tournaments/TournamentList';
import TournamentBracket from '../components/tournaments/TournamentBracket';
import QuickMatchResult from '../components/tournaments/QuickMatchResult';
import { MOCK_TOURNAMENTS } from '../data/tournaments';
import { TournamentTier, Tournament } from '../types/tournament';
import { Resources, Player } from '../types/game';
import { simulateMatch } from '../utils/tournamentSimulator';
import { useGame } from '@/contexts/GameContext';

interface TournamentsPageProps {
  players: Player[];
  resources: Resources;
  onRegister: (tournamentId: string, playerIds: string[]) => void;
}

export default function TournamentsPage() {
  
  const { gameState } = useGame();

  const [selectedTier, setSelectedTier] = useState<TournamentTier | 'all'>('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS.filter(t => !t.isQuickTournament));
  const [matchResult, setMatchResult] = useState<any>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(null);

  const tiers: { value: TournamentTier | 'all'; label: string }[] = [
    { value: 'all', label: 'All Tournaments' },
    { value: 'local', label: 'Local' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'international', label: 'International' },
    { value: 'premier', label: 'Premier' }
  ];

  useEffect(() => {
    if (!selectedTournament || currentMatchIndex === null) return;

    const tournament = tournaments.find(t => t.id === selectedTournament.id);
    if (!tournament || !tournament.rounds) return;

    let currentRound = 0;
    let matchFound = false;
    let match = null;

    for (let i = 0; i < tournament.rounds.length; i++) {
      const roundMatch = tournament.rounds[i].matches.find(
        m => !m.completed && m.players.some(p => p?.id === gameState.players[0]?.id)
      );
      if (roundMatch) {
        currentRound = i;
        match = roundMatch;
        matchFound = true;
        break;
      }
    }

    if (!matchFound || !match) return;

    const opponent = match.players.find(p => p?.id !== gameState.players[0]?.id);
    if (!opponent) return;

    const result = simulateMatch(gameState.players[0], opponent);
    setMatchResult(result);

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournament.id) return t;

      const updatedRounds = t.rounds!.map((round, roundIndex) => {
        if (roundIndex === currentRound) {
          const updatedMatches = round.matches.map(m => {
            if (m.id === match!.id) {
              return {
                ...m,
                winner: result.winner,
                score: result.score,
                completed: true
              };
            }
            return m;
          });
          return { ...round, matches: updatedMatches };
        }

        if (roundIndex === currentRound + 1 && result.winner.id === gameState.players[0]?.id) {
          const nextMatchIndex = Math.floor(currentMatchIndex / 2);
          const updatedMatches = round.matches.map((m, idx) => {
            if (idx === nextMatchIndex) {
              const updatedPlayers = [...m.players];
              const playerPosition = currentMatchIndex % 2;
              updatedPlayers[playerPosition] = result.winner;
              return { ...m, players: updatedPlayers };
            }
            return m;
          });
          return { ...round, matches: updatedMatches };
        }

        return round;
      });

      return { ...t, rounds: updatedRounds };
    }));
  }, [currentMatchIndex]);

  const handleMatchClose = () => {
    setMatchResult(null);
    if (matchResult && matchResult.winner.id !== gameState.players[0]?.id) {
      setSelectedTournament(null);
    } else {
      setCurrentMatchIndex(prev => prev !== null ? Math.floor(prev / 2) : null);
    }
  };

  const handleRegistration = (tournamentId: string, playerIds: string[]) => {
    // onRegister(tournamentId, playerIds);
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      const updatedTournament = {
        ...tournament,
        rounds: tournament.rounds?.map((round, roundIndex) => {
          if (roundIndex === 0) {
            return {
              ...round,
              matches: round.matches.map(match => {
                if (match.players.some(p => !p)) {
                  return {
                    ...match,
                    players: match.players.map(p => p || gameState.players[0])
                  };
                }
                return match;
              })
            };
          }
          return round;
        })
      };

      setTournaments(prev => 
        prev.map(t => t.id === tournamentId ? updatedTournament : t)
      );
      
      setSelectedTournament(updatedTournament);
      
      const firstRoundMatch = updatedTournament.rounds?.[0].matches.findIndex(
        m => m.players.some(p => p?.id === gameState.players[0]?.id)
      );
      
      if (firstRoundMatch !== -1) {
        setCurrentMatchIndex(firstRoundMatch === undefined ? null : firstRoundMatch);
      }
    }
  };

  const filteredTournaments = tournaments.filter(
    tournament => selectedTier === 'all' || tournament.tier === selectedTier
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold">Tournaments</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as TournamentTier | 'all')}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tiers.map(tier => (
              <option key={tier.value} value={tier.value}>
                {tier.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {matchResult && (
        <QuickMatchResult
          matchResult={matchResult}
          rewards={{
            coins: matchResult.winner.id === gameState.players[0]?.id ? 200 : 50,
            diamonds: matchResult.winner.id === gameState.players[0]?.id ? 1 : 0
          }}
          onClose={handleMatchClose}
        />
      )}

      {selectedTournament && selectedTournament.rounds ? (
        <TournamentBracket
          rounds={selectedTournament.rounds}
          currentPlayerId={gameState.players[0]?.id || ''}
          startTime={selectedTournament.startDate}
          onMatchSelect={setCurrentMatchIndex}
        />
      ) : (
        <TournamentList
          tournaments={filteredTournaments}
          onRegister={handleRegistration}
          availablePlayers={gameState.players}
          onSelectTournament={setSelectedTournament}
        />
      )}
    </div>
  );
}