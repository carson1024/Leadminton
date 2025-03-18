import React from "react";
import { Tournament } from "../../types/tournament";
import TournamentCard from "./TournamentCard";
import { Player } from "../../types/game";

interface TournamentListProps {
  tournaments: Tournament[];
  onRegister: (tournamentId: string, playerIds: string[]) => void;
  availablePlayers: Player[];
  onSelectTournament: (tournament: Tournament) => void;
}

export default function TournamentList({
  tournaments,
  onRegister,
  availablePlayers,
  onSelectTournament,
}: TournamentListProps) {
  const sortedTournaments = [...tournaments].sort(
    (a, b) => a.startDate - b.startDate
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedTournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onRegister={onRegister}
          availablePlayers={availablePlayers}
          onSelectTournament={onSelectTournament}
        />
      ))}
    </div>
  );
}
