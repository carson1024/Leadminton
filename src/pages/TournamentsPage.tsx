import React, { useState, useEffect } from "react";
import { Trophy, Filter, CodeSquare, CopyMinus } from "lucide-react";
import TournamentList from "../components/tournaments/TournamentList";
import TournamentBracket from "../components/tournaments/TournamentBracket";
import QuickMatchResult from "../components/tournaments/QuickMatchResult";
import { createCpuPlayer, MOCK_TOURNAMENTS } from "../data/tournaments";
import { TournamentTier, Tournament } from "../types/tournament";
import { Resources, Player, PlayHistory } from "../types/game";
import { simulateMatch } from "../utils/tournamentSimulator";
import { useGame } from "@/contexts/GameContext";
import {
  recordInjuriesChange,
  recordMatch,
  updatePlayerRank,
} from "@/lib/gameActions";
import TournamentResult from "@/components/tournaments/TournamentResult";
interface TournamentsPageProps {
  players: Player[];
  resources: Resources;
  onRegister: (tournamentId: string, playerIds: string[]) => void;
}

export default function TournamentsPage() {
  const {
    gameState,
    tournaments,
    setTournaments,
    updateResources,
    dispatchGameState,
  } = useGame();

  const [selectedTier, setSelectedTier] = useState<TournamentTier | "all">(
    "all"
  );
  // const [registeredPlayers, setRegisteredPlayers] = useState<string[]>();
  const [currentPlayer, setCurrentPlayer] = useState<string>();
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  /* const [tournaments, setTournaments] = useState<Tournament[]>(
    MOCK_TOURNAMENTS.filter((t) => !t.isQuickTournament)
  ); */
  const [tournamentFinished, setTournamentFinished] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(
    null
  );
  const [resultPlayerRank, setResultPlayerRank] = useState([]);

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
    // console.log(currentMatchIndex);
    if (!selectedTournament || currentMatchIndex === null) return;

    const tournament = tournaments.find((t) => t.id === selectedTournament.id);
    if (!tournament || !tournament.rounds) return;

    let currentRound = 0;
    let matchFound = false;
    let match = null;

    // looking for current round -> match
    for (let i = 0; i < tournament.rounds.length; i++) {
      const roundMatch = tournament.rounds[i].matches?.find(
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
    if (currentMatchIndex == 10) console.log("ten for --- ", player, opponent);
    if (!opponent || !player) return;

    // console.log(player, opponent);
    const result = simulateMatch(player, opponent);
    if (
      gameState.players.some((pl, index) => pl.id == player?.id) ||
      gameState.players.some((pl, index) => pl.id == opponent.id)
    ) {
      console.log("before saving");
      const recordAndUpdate = async () => {
        await recordMatch(player, opponent, {
          result: result.winner.id == player.id,
          level1: player.rank,
          level2: opponent.rank,
        });
        // setMatchResult(result);
        let newRank = await updatePlayerRank(
          gameState.players.some((p1, ind) => p1.id == player?.id)
            ? player.id
            : opponent.id
        );
        console.log("this is new rank ", newRank);
        dispatchGameState({
          type: "UPDATE_RANK",
          payload: { playerId: player.id, rank: newRank },
        });
      };
      recordAndUpdate();
    }

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
    /* if (gameState.players.some((pl, index) => pl.id == result.winner.id)) {
      let reward: Partial<Record<keyof Resources, number>> = { coins: 200 };
      updateResources("tournament_reward", reward);
    }
    if (gameState.players.some((pl, index) => pl.id == result.loser.id)) {
      let reward: Partial<Record<keyof Resources, number>> = { coins: 200 };
      updateResources("tournament_reward", reward);
    } */

    // win last currentRound
    console.log("currentRound.name", currentRound);
    if (currentRound == selectedTournament.rounds?.length - 1) {
      /* shuttlecocks: number;
      meals: number;
      coins: number;
      diamonds: number; */
      // selectedTournament.prizePool.first.diamonds
      let reward: Partial<Record<keyof Resources, number>> = {
        diamonds: selectedTournament.prizePool.first.diamonds || 0,
        coins: selectedTournament.prizePool.first.coins || 0,
        meals: selectedTournament.prizePool.first.meals || 0,
        shuttlecocks: selectedTournament.prizePool.first.shuttlecocks || 0,
      };
      console.log("reward ", reward);
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

        if (currentRound == tournament?.rounds.length - 1) {
          console.log("before finishing");
          finishTournament({ ...selectedTournament, rounds: updatedRounds });
        }
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

  const fillWithCpu = () => {
    if (!selectedTournament) return;
    const tournament = tournaments.find((t) => t.id === selectedTournament.id);
    if (!tournament || !tournament.rounds) return;
    console.log("this is fill with cpu function ");

    // fill blanks with cpu
    let currentCPUindex = 0;
    let currentRound = { ...tournament?.rounds?.[0] };
    const cpuPlayers = Array(currentRound?.matches?.length * 2 || 16)
      .fill(null)
      .map((_, i) => createCpuPlayer(i + 1));
    let registeredPlayers = tournament.registeredPlayers;
    const newRound = {
      ...currentRound,
      matches: currentRound?.matches?.map((match, index) => {
        return {
          ...match,
          players: match.players?.map((player, ind) => {
            if (!player) {
              console.log(currentCPUindex, cpuPlayers[currentCPUindex]);
              registeredPlayers?.push({
                clubId: `cpu-club-${currentCPUindex}`,
                clubName: "cpu-club",
                playerId: cpuPlayers[currentCPUindex].id,
                playerName: cpuPlayers[currentCPUindex].name,
                registered: Date.now(),
              });
              return cpuPlayers[currentCPUindex++];
            } else return player;
          }),
        };
      }),
    };

    console.log("this is updated round before update ", newRound);
    let updatedTournament: Tournament = {
      ...tournament,
      rounds: tournament?.rounds?.map((round, index) => {
        if (index == 0) return newRound;
        else return round;
      }),
      registeredPlayers: registeredPlayers,
      currentParticipants: tournament.currentParticipants + currentCPUindex - 1,
    };
    console.log("this is updated Tournament ", updatedTournament);
    setTournaments((prev) =>
      prev.map((t) => (t.id === selectedTournament.id ? updatedTournament : t))
    );
    setSelectedTournament(updatedTournament);
    return newRound;
  };

  const handleRegistration = (tournamentId: string, playerIds: string[]) => {
    // onRegister(tournamentId, playerIds);
    // console.log("on register", playerIds);
    if (playerIds.length === 0 /*  || playerIds.length > 1 */) return;
    setCurrentPlayer(playerIds[0]);

    const genFromId = (playerId: string[]) => {
      /* {
        playerId: player.id,
        playerName: player.name,
        clubId: 'cpu',
        clubName: 'CPU Club',
        registered: Date.now() - Math.random() * 3600000
      } */
      // console.log("this is pure player id", playerId);
      return playerId.map((id, idx) => {
        let pp = gameState.players.find((p) => p.id == id);
        return {
          playerId: pp.id,
          playerName: pp.name,
          clubId: "club ",
          clubName: "My Club",
          registered: Date.now(),
        };
      });
    };
    // f(playerIds);
    const tournament = tournaments.find((t) => t.id === tournamentId);
    // console.log(tournament);
    // console.log("newPlayerState ", playerIds);
    const newPlayerState = gameState.players.filter((player) => {
      if (
        tournament?.registeredPlayers?.some(
          (pl, idx) => pl.playerId == player.id
        )
      )
        return false;
      return playerIds.includes(player.id);
    });
    // console.log("newPlayerState ", newPlayerState);

    if (tournament) {
      const updatedTournament = {
        ...tournament,
        rounds: tournament.rounds?.map((round, roundIndex) => {
          // console.log(roundIndex, round);
          if (roundIndex === 0) {
            // console.log(round);
            return {
              ...round,
              matches: (() => {
                const newMatches = round.matches.map((match) => ({
                  ...match,
                  players: [...match.players],
                }));

                // Collect all empty player positions
                const availablePositions = [];

                newMatches.forEach((match, matchIndex) => {
                  match.players.forEach((player, playerIndex) => {
                    if (!player)
                      availablePositions.push({ matchIndex, playerIndex });
                  });
                });

                // Shuffle both available positions and new players randomly
                const shuffledPositions = availablePositions.sort(
                  () => Math.random() - 0.5
                );
                const shuffledPlayers = [...newPlayerState].sort(
                  () => Math.random() - 0.5
                );

                // Assign shuffled players to **random** positions
                shuffledPositions.forEach(({ matchIndex, playerIndex }, i) => {
                  if (i < shuffledPlayers.length) {
                    newMatches[matchIndex].players[playerIndex] =
                      shuffledPlayers[i]; // Place player in a random slot
                  }
                });

                // Return or update state with the **new randomized matches**
                return newMatches;
              })(),
            };
          }
          return round;
        }),
        registeredPlayers: Array.from(
          new Set(
            (tournament.registeredPlayers || [])
              .concat(genFromId(playerIds) || [])
              .map((player) => player.playerId)
          )
        ).map(
          (id) =>
            (tournament.registeredPlayers || []).find(
              (player) => player.playerId === id
            ) ||
            (genFromId(playerIds) || []).find(
              (player) => player.playerId === id
            )
        ),
        currentParticipants: tournament.currentParticipants + playerIds.length,
      };
      // console.log("this is updated tour ", updatedTournament);
      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? updatedTournament : t))
      );
      // console.log("updated tou", updatedTournament);
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

  const getPlayersRank = (tournament: Tournament) => {
    const ranking: string[] = []; // Stores player IDs in ranked order

    // Traverse rounds from last to first to determine ranking
    for (let i = tournament.rounds.length - 1; i >= 0; i--) {
      const round = tournament.rounds[i];

      round.matches.forEach((match) => {
        const winner = match.winner;

        if (!winner) return; // Skip if there's no winner

        // Ensure winner is ranked first in the match
        const [firstPlayer, secondPlayer] = match.players;

        if (!firstPlayer || !secondPlayer) return; // Skip if players are missing

        if (winner.id === firstPlayer.id) {
          if (!ranking.includes(firstPlayer.id)) ranking.push(firstPlayer.id);
          if (!ranking.includes(secondPlayer.id)) ranking.push(secondPlayer.id);
        } else {
          if (!ranking.includes(secondPlayer.id)) ranking.push(secondPlayer.id);
          if (!ranking.includes(firstPlayer.id)) ranking.push(firstPlayer.id);
        }
      });
    }

    // Convert player IDs to actual player objects
    const sortedPlayers = ranking
      .map((playerId) =>
        tournament.rounds[0].matches
          .flatMap((match) => match.players)
          .find((p) => p?.id === playerId)
      )
      .filter(Boolean); // Remove any undefined values

    return sortedPlayers;
  };

  const finishTournament = (tournament: Tournament) => {
    // console.log("tournament finished");
    const players = getPlayersRank(tournament);
    // console.log("this is tournament result ", players);
    setResultPlayerRank(players);
    setTournamentFinished(true);
  };

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

      {tournamentFinished && (
        <TournamentResult
          tournament={selectedTournament}
          matchResult={resultPlayerRank}
          onClose={setTournamentFinished}
        ></TournamentResult>
      )}

      {selectedTournament && selectedTournament.rounds ? (
        <TournamentBracket
          tournamentName={selectedTournament.name}
          rounds={selectedTournament.rounds}
          currentPlayerId={currentPlayer}
          registeredPLayers={selectedTournament.registeredPlayers}
          startTime={selectedTournament.startDate}
          onMatchSelect={setCurrentMatchIndex}
          onStartMatch={setCurrentPlayer}
          fillWithCPU={fillWithCpu}
          setSelectedTournament={setSelectedTournament}
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
