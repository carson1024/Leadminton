import React, { useState, useEffect, useRef } from "react";
import { Trophy, Timer } from "lucide-react";
import { Match, TournamentRound } from "../../types/tournament";
import { RegisteredPlayer } from "../../types/tournament";
import { createCpuPlayer } from "@/data/tournaments";
// import { Bracket } from "react-tournament-bracket";
import { single, double } from "../data";
import TournamentABracket from "react-svg-tournament-bracket";
// import { SingleEliminationBracket } from "react-tournament-brackets";

const myMatches = [
  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },

  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },
  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },

  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },
  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },

  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },
  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },

  {
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    round: 1,
    matchNumber: 1,
  },
  {
    homeTeamName: "Team C",
    awayTeamName: "Team D",
    round: 1,
    matchNumber: 2,
  },
  {
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    round: 1,
    matchNumber: 3,
  },
  {
    homeTeamName: "Team G",
    awayTeamName: "Team H",
    round: 1,
    matchNumber: 4,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 1",
    awayTeamName: "Winner Match 2",
    round: 2,
    matchNumber: 5,
  },
  {
    homeTeamName: "Winner Match 3",
    awayTeamName: "Winner Match 4",
    round: 2,
    matchNumber: 6,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 3,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 4,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 4,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 4,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 4,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 5,
    matchNumber: 7,
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 5,
    matchNumber: "asdfdsafd",
  },
  {
    homeTeamName: "Winner Match 5",
    awayTeamName: "Winner Match 6",
    round: 6,
    matchNumber: 7,
  },
];
interface TournamentBracketProps {
  tournamentName: string;
  rounds: TournamentRound[];
  currentPlayerId: string;
  registeredPLayers: RegisteredPlayer[];
  startTime: number;
  onMatchSelect: (matchIndex: number) => void;
  fillWithCPU: () => void;
  onStartMatch: (playderId: string) => void;
  setSelectedTournament: () => void;
  // finishTournament: () => void;
}
export default function TournamentBracket({
  tournamentName,
  setSelectedTournament,
  rounds,
  currentPlayerId,
  registeredPLayers,
  startTime,
  onMatchSelect,
  fillWithCPU,
  onStartMatch,
}: // finishTournament,
TournamentBracketProps) {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor((startTime - Date.now()) / 1000))
  );
  // console.log("this is round bracket", rounds);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const parentDiv = useRef();
  const [clientWidth, setclientWidth] = useState();
  const [realMatch, setRealMatch] = useState([]);
  useEffect(() => {
    // console.log("changing the rounds ", rounds);
  }, [rounds]);

  const handleResize = () => {
    if (parentDiv.current) {
      setclientWidth(parentDiv.current.offsetWidth);
    }
  };

  const resizeObserver = new ResizeObserver(handleResize);

  if (parentDiv.current) {
    resizeObserver.observe(parentDiv.current);
  }

  useEffect(() => {
    if (rounds) {
      // setRealMatch(new Array(Math.pow(2, rounds.length) - 1));
      let result = new Array();
      result = rounds.flatMap((round, index) =>
        round.matches.map((match, idx) => ({
          homeTeamName: match.players[0]?.name || "...",
          awayTeamName: match.players[1]?.name || "...",
          round: index + 1,
          matchNumber: round.name + index + "-" + idx,
          matchComplete: match.completed,
          matchAccepted: match.completed,
          homeTeamScore: match.winner?.id == match.players[0]?.id ? 2 : 1,
          awayTeamScore: match.winner?.id == match.players[0]?.id ? 1 : 2,
        }))
      );

      setRealMatch(result);
    }
  }, [rounds]);
  useEffect(() => {}, [rounds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      let currentRound = rounds.find((round) =>
        round.matches.some((match) => match.completed === false)
      );
      // console.log("timer reached to zero, ", currentRound);
      if (!currentRound) return;
      if (currentRound.level == 0) {
        currentRound = fillWithCPU();
        // setTimeLeft(timeLeft - 1);
      }
      // Function to process matches
      const processMatches = async () => {
        if (currentRound?.matches) {
          for (const match of currentRound.matches) {
            onMatchSelect(parseInt(match.id));
            onStartMatch(match.players[0]?.id);
            await delay(400); // Wait for 400 milliseconds
            onStartMatch(currentPlayerId);
            /* if (currentRound?.matches?.length == 1) {
              finishTournament(
                currentRound?.matches?.[currentRound?.matches?.length - 1]
                  .players[0],
                currentRound?.matches?.[currentRound?.matches?.length - 1]
                  .players[1]
              );
            } */
          }
        }
      };

      // Call the function
      processMatches();
      if (
        rounds.findIndex((round) =>
          round.matches.some((match) => match.completed === false)
        ) !=
        rounds.length - 1
      )
        setTimeLeft(15);
      else {
      }
      // setTimeLeft(10);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleMatchClick = (roundIndex: number, matchIndex: number) => {
    const match = rounds[roundIndex].matches[matchIndex];
    if (
      match.players.some((p) => p?.id === currentPlayerId) &&
      !match.completed
    ) {
      onMatchSelect(matchIndex);
    }
  };

  const getRoundPrefix = (
    round: TournamentRound,
    index: Number,
    prev: Boolean
  ) => {
    // console.log(round);
    if (round?.matches[0]?.completed) return "(complted)";
    else if (!prev) return "(upcoming)";
    else {
      return `(${formatTimeLeft(timeLeft * 1000)} left)`;
    }
  };

  const formatTimeLeft = (ms: number): string => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`); // Include hours if days are present
    } else if (hours > 0) {
      parts.push(`${hours}h`); // Include hours if no days
    }

    if (minutes > 0) {
      parts.push(`${minutes}m`);
    } else if (parts.length > 0) {
      parts.push(`0m`); // Show 0m if there are higher units
    }

    if (seconds > 0) {
      parts.push(`${seconds}s`);
    } else if (parts.length > 0) {
      parts.push(`0s`); // Show 0s if there are higher units
    }

    return parts.join(" ");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold">{tournamentName}</h2>
        </div>
        {timeLeft > 0 && (
          <div className="flex items-center space-x-2 px-6 py-3 bg-blue-100 rounded-full">
            <Timer className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-blue-600 font-medium">
              Tournament starts in: {formatTimeLeft(timeLeft * 1000)}
            </span>
          </div>
        )}

        <button
          onClick={() => setSelectedTournament(null)}
          className={`px-4 py-2 rounded-lg ${"bg-gray-400 !important text-white hover:bg-blue-300"}`}
        >
          Back
        </button>
      </div>

      <div className="flex justify-between px-4 text-sm font-medium text-gray-600 mb-4">
        {rounds.map((round, i) => (
          <div key={i} className="flex-1 text-center">
            {round.name +
              getRoundPrefix(
                round,
                i,
                i - 1 >= 0 ? rounds[i - 1].matches[0]?.completed : true
              )}
          </div>
        ))}
      </div>

      <div className="relative">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {rounds.map((round, roundIndex) =>
            round.matches.map((match, matchIndex) => {
              if (roundIndex < rounds.length - 1) {
                const startX = (roundIndex + 1) * (100 / rounds.length);
                const startY = matchIndex * 160 + 60;
                const endX = (roundIndex + 2) * (100 / rounds.length);
                const endY = Math.floor(matchIndex / 2) * 160 + 60;

                return (
                  <path
                    key={`line-${roundIndex}-${matchIndex}`}
                    d={`M ${startX}% ${startY} H ${
                      (startX + endX) / 2
                    } V ${endY} H ${endX}%`}
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              }
              return null;
            })
          )}
        </svg>

        <div ref={parentDiv} className="relative flex">
          <TournamentABracket
            height={rounds.length > 4 ? 1200 : 800}
            matchHeight={90}
            width={clientWidth}
            matches={realMatch}
            hidePKs={true}
            popColor={"red"}
            secondaryFinal={{
              homeTeamName:
                rounds[rounds?.length - 1].matches[0].winner?.name || "....",
              awayTeamName: " ",
              title: "Today's Champion",
            }}
          />
        </div>
      </div>
    </div>
  );
}
