import React from "react";
import { Player } from "../../types/game";

interface TournamentResultProps {
  matchResult: Player[];
  onClose: () => void;
}

export default function TournamentResult({
  matchResult,
  onClose,
}: TournamentResultProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Tournament Results</h1>
        <ul className="list-decimal pl-5 mb-4">
          {matchResult?.map((player, index) => (
            <li key={player.id} className="mb-2">
              {player.name}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onClose(false)}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
