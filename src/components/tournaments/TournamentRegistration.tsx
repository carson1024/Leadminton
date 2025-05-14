import React, { useState } from "react";
import { X } from "lucide-react";
import { Tournament } from "../../types/tournament";
import { Player } from "../../types/game";

interface TournamentRegistrationProps {
  tournament: Tournament;
  availablePlayers: Player[];
  onRegister: (playerIds: string[]) => void;
  onClose: () => void;
}

export default function TournamentRegistration({
  tournament,
  availablePlayers,
  onRegister,
  onClose,
}: TournamentRegistrationProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const eligiblePlayers = availablePlayers.filter(
    (player) => player.level >= tournament.minPlayerLevel
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length === 0) return;

    onRegister(selectedPlayers);
    onClose();
  };

  const togglePlayer = (playerId: string) => {
    // console.log("this is toggle Player");
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }

      if (
        prev.length >=
          tournament.maxParticipants - tournament.currentParticipants ||
        prev.length >= 2
      ) {
        return prev;
      }

      return [...prev, playerId];
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Tournament Registration</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {eligiblePlayers.length === 0 ? (
          <p className="text-center text-gray-600">
            No eligible players available. Players must be at least level{" "}
            {tournament.minPlayerLevel}.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {eligiblePlayers.map((player) => (
                <label
                  key={player.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedPlayers.includes(player.id)
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => togglePlayer(player.id)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      Level {player.level}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedPlayers.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  selectedPlayers.length > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Register for Tournament
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
