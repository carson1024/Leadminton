import React, { useState, useEffect } from "react";
import { Trophy, Filter, CodeSquare, CopyMinus } from "lucide-react";
import TournamentList from "../components/tournaments/TournamentList";
import TournamentBracket from "../components/tournaments/TournamentBracket";
import QuickMatchResult from "../components/tournaments/QuickMatchResult";
import { MOCK_TOURNAMENTS } from "../data/tournaments";
import { TournamentTier, Tournament } from "../types/tournament";
import { Resources, Player } from "../types/game";
import { simulateMatch } from "../utils/tournamentSimulator";
import { useGame } from "@/contexts/GameContext";
import { recordInjuriesChange } from "@/lib/gameActions";

interface TournamentsPageProps {
  players: Player[];
  resources: Resources;
  onRegister: (tournamentId: string, playerIds: string[]) => void;
}

export default function TournamentsPage() {
  const {
    gameState,
    // tournaments,
    // setTournaments,
    updateResources,
    dispatchGameState,
  } = useGame();

  const [selectedTier, setSelectedTier] = useState<TournamentTier | "all">(
    "all"
  );
  const [currentPlayer, setCurrentPlayer] = useState<string>();
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>(
    MOCK_TOURNAMENTS.filter((t) => !t.isQuickTournament)
  );
  const [matchResult, setMatchResult] = useState<any>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(
    null
  );

  const tiers: { value: TournamentTier | "all"; label: string }[] = [
    { value: "all", label: "All Tournaments" },
    { value: "local", label: "Local" },
    { value: "regional", label: "Regional" },
    { value: "national", label: "National" },
    { value: "international", label: "International" },
    { value: "premier", label: "Premier" },
  ];

  useEffect(() => {}, [tournaments]);

  useEffect(() => {
    if (!selectedTournament || currentMatchIndex === null) return;

    const tournament = tournaments.find((t) => t.id === selectedTournament.id);
    if (!tournament || !tournament.rounds) return;

    let currentRound = 0;
    let matchFound = false;
    let match = null;

    // looking for current round -> match
    for (let i = 0; i < tournament.rounds.length; i++) {
      const roundMatch = tournament.rounds[i].matches.find(
        (m) => !m.completed && m.players.some((p) => p?.id === currentPlayer)
      );
      if (roundMatch) {
        currentRound = i;
        match = roundMatch;
        matchFound = true;
        break;
      }
    }
    // match player with opponent
    if (!matchFound || !match) return;
    const opponent = match.players.find((p) => p?.id !== currentPlayer);
    const player = match.players.find((p) => p?.id === currentPlayer);
    if (!opponent) return;

    const result = simulateMatch(player, opponent);
    if (
      gameState.players.some((pl, index) => pl.id == player?.id) ||
      gameState.players.some((pl, index) => pl.id == opponent.id)
    )
      setMatchResult(result);

    // apply injury player
    if (result.newInjury && !player?.id.includes("cpu")) {
      dispatchGameState({
        type: "ADD_INJURY",
        payload: { playerId: player.id, injury: result.newInjury },
      });
      // console.log(player?.injuries);
      recordInjuriesChange(player, [
        ...(player.injuries || []),
        result.newInjury,
      ]);
    }
    // opponent
    if (result.newInjury1 && !opponent.id.includes("cpu")) {
      dispatchGameState({
        type: "ADD_INJURY",
        payload: { playerId: opponent.id, injury: result.newInjury1 },
      });
      recordInjuriesChange(opponent, [
        ...(opponent.injuries || []),
        result.newInjury1,
      ]);
    }

    // receive prize
    if (gameState.players.some((pl, index) => pl.id == result.winner.id)) {
      let reward: Partial<Record<keyof Resources, number>> = { coins: 200 };
      updateResources("tournament_reward", reward);
    }
    if (gameState.players.some((pl, index) => pl.id == result.loser.id)) {
      let reward: Partial<Record<keyof Resources, number>> = { coins: 200 };
      updateResources("tournament_reward", reward);
    }

    // update tournament with match result
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournament.id) return t;

        const updatedRounds = t.rounds!.map((round, roundIndex) => {
          // set current round -> match as completed
          if (roundIndex === currentRound) {
            const updatedMatches = round.matches.map((m) => {
              if (m.id === match!.id) {
                return {
                  ...m,
                  winner: result.winner,
                  score: result.score,
                  completed: true,
                };
              }
              return m;
            });
            return { ...round, matches: updatedMatches };
          }
          // set win player -> next round -> match
          if (roundIndex === currentRound + 1) {
            const nextMatchIndex = Math.floor((currentMatchIndex - 1) / 2);
            const updatedMatches = round.matches.map((m, idx) => {
              if (idx === nextMatchIndex) {
                const updatedPlayers = [...m.players];
                const playerPosition = (currentMatchIndex - 1) % 2;
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
      })
    );
  }, [currentMatchIndex]);

  useEffect(() => {
    if (tournaments.length > 0 && selectedTournament)
      setSelectedTournament(
        tournaments.find((t) => t.id === selectedTournament.id)
      );
  }, [tournaments]);

  const handleMatchClose = () => {
    setMatchResult(null);
    setCurrentMatchIndex(null);
    /* if (matchResult && matchResult.winner.id !== gameState.players[0]?.id) {
      setSelectedTournament(null);
    } else {
      setCurrentMatchIndex((prev) =>
        prev !== null ? Math.floor(prev / 2) : null
      );
    } */
  };

  useEffect(() => {}, [currentMatchIndex]);

  const handleRegistration = (tournamentId: string, playerIds: string[]) => {
    // onRegister(tournamentId, playerIds);
    // console.log("on register", playerIds);
    if (playerIds.length === 0 || playerIds.length > 1) return;
    setCurrentPlayer(playerIds[0]);
    const tournament = tournaments.find((t) => t.id === tournamentId);
    // console.log(tournament);
    const newPlayerState = gameState.players.find(
      (player) => player.id == playerIds[0]
    );
    if (tournament) {
      const updatedTournament = {
        ...tournament,
        rounds: tournament.rounds?.map((round, roundIndex) => {
          if (roundIndex === 0) {
            return {
              ...round,
              matches: round.matches.map((match) => {
                if (match.players.some((p) => !p)) {
                  return {
                    ...match,
                    players: match.players.map((p) => p || newPlayerState),
                  };
                }
                return match;
              }),
            };
          }
          return round;
        }),
      };
      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? updatedTournament : t))
      );
      // console.log("this is updated tournament ", updatedTournament);
      console.log("this is updatedTournament", updatedTournament);
      setSelectedTournament(updatedTournament);

      const firstRoundMatch = updatedTournament.rounds?.[0].matches.findIndex(
        (m) => m.players.some((p) => p?.id === newPlayerState?.id)
      );

      /* if (firstRoundMatch !== -1) {
        setCurrentMatchIndex(
          firstRoundMatch === undefined ? null : firstRoundMatch
        );
      } */
    }
  };

  const filteredTournaments = tournaments.filter(
    (tournament) => selectedTier === "all" || tournament.tier === selectedTier
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
            onChange={(e) =>
              setSelectedTier(e.target.value as TournamentTier | "all")
            }
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tiers.map((tier) => (
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
            coins:
              matchResult.winner.id === gameState.players[0]?.id ? 200 : 50,
            diamonds:
              matchResult.winner.id === gameState.players[0]?.id ? 1 : 0,
          }}
          onClose={handleMatchClose}
        />
      )}

      {selectedTournament && selectedTournament.rounds ? (
        <TournamentBracket
          rounds={selectedTournament.rounds}
          currentPlayerId={currentPlayer}
          startTime={selectedTournament.startDate}
          onMatchSelect={setCurrentMatchIndex}
          onStartMatch={setCurrentPlayer}
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
