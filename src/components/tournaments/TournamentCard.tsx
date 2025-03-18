import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Tournament } from "../../types/tournament";
import { Player } from "../../types/game";
import { getTierColor, getTierLabel } from "../../utils/tournamentUtils";
import { useCountdown } from "../../hooks/useCountdown";
import TournamentRegistration from "./TournamentRegistration";
import TournamentParticipants from "./TournamentParticipants";

interface TournamentCardProps {
  tournament: Tournament;
  onRegister: (tournamentId: string, playerIds: string[]) => void;
  availablePlayers: Player[];
  onSelectTournament: (tournament: Tournament) => void;
}

export default function TournamentCard({
  tournament,
  onRegister,
  availablePlayers,
  onSelectTournament,
}: TournamentCardProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [currentState, setCurrentState] = useState("Upcoming");
  const tierColor = getTierColor(tournament.tier);
  const tierLabel = getTierLabel(tournament.tier);
  const timeLeft = useCountdown(tournament.startDate, tournament.endDate);

  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  useEffect(() => {
    // console.log(timeLeft);
    const tmp = Math.floor((timeLeft + 999) / 1000);
    if (tmp == 0) {
      tournament.status = "completed";
      setCurrentState("Completed");
    } else if (tmp < 0) {
      tournament.status = "ongoing";
      setCurrentState("ongoing");
    }
  }, [timeLeft]);

  const handleRegister = (playerIds: string[]) => {
    if (tournament.isQuickTournament) {
      onRegister(tournament.id, playerIds);
    } else {
      onRegister(tournament.id, playerIds);
      // onSelectTournament(tournament);
    }
    setShowRegistration(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{tournament.name}</h3>
            {tournament.isQuickTournament && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                Quick Tournament
              </span>
            )}
          </div>
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm ${tierColor} mt-1`}
          >
            {tierLabel}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {
            /* tournament.isQuickTournament &&  */ timeLeft > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Starts in {formatTimeLeft(timeLeft)}
              </span>
            )
          }
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              tournament.status === "upcoming"
                ? "bg-green-100 text-green-800"
                : tournament.status === "ongoing"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {currentState}
          </span>
          <button
            onClick={() => setShowParticipants(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Participants"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Entry Fee
            </h4>
            <div className="space-y-1">
              {Object.entries(tournament.entryFee).map(
                ([resource, amount]) =>
                  amount > 0 && (
                    <div key={resource} className="text-sm">
                      {amount} {resource}
                    </div>
                  )
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Prize Pool
            </h4>
            <div className="space-y-1">
              {Object.entries(tournament.prizePool).map(([place, rewards]) => (
                <div key={place} className="text-sm">
                  {place}:{" "}
                  {Object.entries(rewards)
                    .map(([resource, amount]) => `${amount} ${resource}`)
                    .join(", ")}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Min. Level: {tournament.minPlayerLevel}
          </div>
          <button
            onClick={() => setShowRegistration(true)}
            disabled={tournament.status !== "upcoming"}
            className={`px-4 py-2 rounded-lg ${
              tournament.status === "upcoming"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {showRegistration && (
        <TournamentRegistration
          tournament={tournament}
          availablePlayers={availablePlayers}
          onRegister={handleRegister}
          onClose={() => setShowRegistration(false)}
        />
      )}

      {showParticipants && (
        <TournamentParticipants
          tournament={tournament}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  );
}
