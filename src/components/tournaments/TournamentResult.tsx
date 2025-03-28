import React from "react";
import { Player } from "../../types/game";
import { Tournament } from "../../types/tournament";
import { Feather, UtensilsCrossed, Coins, Diamond } from "lucide-react"; // Your icons

interface TournamentResultProps {
  matchResult: Player[];
  onClose: () => void;
  tournament: Tournament;
}

export default function TournamentResult({
  matchResult,
  onClose,
  tournament,
}: TournamentResultProps) {
  // Prize pool mapping
  const prizeRanks = ["first", "second", "third"];
  const prizePool = tournament.prizePool;

  // Resource Icons Mapping
  const resourceIcons: { [key: string]: JSX.Element } = {
    diamonds: <Diamond className="w-5 h-5 text-purple-500" />,
    shuttlecocks: <Feather className="w-5 h-5 text-blue-500" />,
    meals: <UtensilsCrossed className="w-5 h-5 text-green-500" />,
    coins: <Coins className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Tournament Results</h1>
        <ul className="list-decimal pl-5 mb-4 w-full">
          {matchResult?.map((player, index) => {
            // Assign prizes only to the top 3 players
            const prizeCategory = prizeRanks[index];
            const prize = prizeCategory ? prizePool?.[prizeCategory] : null;

            return (
              <li key={player.id} className="mb-2 flex items-center">
                {/* Player name */}
                <span className="font-semibold">
                  {index + 1}. {player.name}
                </span>

                {/* Display prizes with icons next to the player name */}
                {prize && (
                  <span className="text-sm text-gray-700 ml-2 flex items-center gap-2">
                    {Object.entries(prize)
                      .filter(([_, value]) => value > 0) // Remove items with 0 value
                      .map(([key, value]) => (
                        <span key={key} className="flex items-center gap-1">
                          {resourceIcons[key] || null} {value}
                        </span>
                      ))}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => onClose()}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
