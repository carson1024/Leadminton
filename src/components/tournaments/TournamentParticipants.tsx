import React from 'react';
import { X, Trophy, Users } from 'lucide-react';
import { Tournament } from '../../types/tournament';
import { formatDate } from '../../utils/dateFormatter';

interface TournamentParticipantsProps {
  tournament: Tournament;
  onClose: () => void;
}

export default function TournamentParticipants({ tournament, onClose }: TournamentParticipantsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold">{tournament.name}</h3>
            <p className="text-sm text-gray-600">
              {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>{tournament.currentParticipants}/{tournament.maxParticipants} Participants</span>
          </div>
        </div>

        {tournament.registeredPlayers && tournament.registeredPlayers.length > 0 ? (
          <div className="space-y-3">
            {tournament.registeredPlayers.map((player, index) => (
              <div
                key={player.playerId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{player.playerName}</div>
                  <div className="text-sm text-gray-600">{player.clubName}</div>
                </div>
                <div className="text-sm text-gray-500">
                  Registered: {formatDate(player.registered)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No participants registered yet</p>
          </div>
        )}
      </div>
    </div>
  );
}