import React from "react";
import { Player, PlayerStrategy } from "../../types/game";
import { useGame } from "@/contexts/GameContext";
import { supabase } from "@/lib/supabase";

interface PlayerStrategyModalProps {
  player: Player;
  onClose: () => void;
  //   onUpdateStrategy: (playerId: string, strategy: PlayerStrategy) => void;
}

export default function PlayerDeleteModal({
  player,
  onClose,
}: PlayerStrategyModalProps) {
  const { resources, gameState, updateResources, dispatchGameState } =
    useGame();

  const removePlayer = async (playerid: string) => {
    // let data, error;
    {
      const { data, error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerid);
      if (error) return false;
    }
    {
      const { data, error } = await supabase
        .from("player_stats")
        .delete()
        .eq("player_id", playerid);
      if (error) return false;
    }
    {
      const { data, error } = await supabase
        .from("player_levels")
        .delete()
        .eq("player_id", playerid);
      if (error) return false;
    }
    {
      const { data, error } = await supabase
        .from("player_strategy")
        .delete()
        .eq("player_id", playerid);
      if (error) return false;
    }
    return true;
  };

  const handleRemove = async () => {
    // onUpdateStrategy(player.id, strategy);
    const cost = 100000;
    if (resources.coins < cost) return;

    if (!(await removePlayer(player.id))) return;

    updateResources("coins", { coins: -cost });
    dispatchGameState({
      type: "REMOVE_PLAYER",
      payload: { player },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <h1>{"Remove " + player?.name}</h1> */}
        <span className="text-xl">Remove</span> <span>{player.name}</span>
        <br></br>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleRemove}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            Ok
          </button>
          <button
            onClick={() => {
              onClose();
            }}
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
