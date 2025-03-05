import React, { useState } from 'react';
import { Player } from '../../types/game';
import { Pencil, Trophy } from 'lucide-react';

interface PlayerHeaderProps {
  player: Player;
  onNameChange: (playerId: string, newName: string) => void;
  score: number;
}

export default function PlayerHeader({ player, onNameChange, score }: PlayerHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onNameChange(player.id, tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div>
      {isEditingName ? (
        <form onSubmit={handleNameSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="px-2 py-1 border rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onBlur={handleNameSubmit}
          />
        </form>
      ) : (
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{player.name}</h3>
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Score: {score}</span>
          </div>
        </div>
      )}
    </div>
  );
}