import { useState, useRef } from "react";
import { Info } from "lucide-react";
import { MatchHistory, Player } from "@/types/game";

const RankBar = ({
  rank,
  players,
  name,
  best,
}: {
  rank: number;
  name: string;
  players: Player[];
  best: MatchHistory[];
}) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const barRef = useRef<HTMLDivElement>(null);

  // ✅ Progress width calculation remains the same
  const progressWidth = Math.floor((rank * 100) / 450);

  // Rank Levels & Their Ranges
  const rankLevels: { [key: string]: [number, number] } = {
    P12: [0, 20],
    P11: [21, 40],
    P10: [41, 70],
    D9: [71, 100],
    D8: [101, 130],
    D7: [131, 160],
    R6: [161, 200],
    R5: [201, 250],
    R4: [251, 300],
    N3: [301, 370],
    N2: [371, 450],
    N1: [451, 451],
  };

  const getRankLevel = (rank: number): string => {
    return (
      Object.keys(rankLevels).find((level) => {
        const [min, max] = rankLevels[level];
        return rank >= min && rank <= max;
      }) || "N/A"
    );
  };

  const rankPoints = Object.keys(rankLevels);

  // Cumulative weight mapping for red line positioning
  const cumulativeWeights: { [key: string]: number } = {};
  let accumulated = 0;
  rankPoints.forEach((rank) => {
    const [min, max] = rankLevels[rank];
    cumulativeWeights[rank] = (min / 450) * 100;
    accumulated += ((max - min) / 450) * 100;
  });

  // Calculate the next rank & position
  const nextRank = rankPoints.find((level) => rankLevels[level][0] > rank);
  const nextRankPosition = nextRank ? cumulativeWeights[nextRank] : 100;
  const nextRankName = nextRank || "N/A";

  // ✅ Modified Tooltip Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      // Calculate points needed to reach the next level
      let nextLevelPoints = 0;
      for (const [level, range] of Object.entries(rankLevels)) {
        if (rank >= range[0] && rank <= range[1]) {
          nextLevelPoints = range[1];
          break;
        }
      }

      setTooltip({
        visible: true,
        x: relativeX,
        y: -30,
        content: `${rank} / ${nextLevelPoints}`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className="relative w-full bg-gray-300 rounded-md"
      style={{ height: "5px" }}
    >
      {/* ✅ Blue Progress Bar */}
      <div
        ref={barRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full bg-blue-500 transition-all duration-500 rounded-md"
        style={{ width: `${progressWidth > 100 ? 100 : progressWidth}%` }}
      />

      {/* 🔴 Red Line at Next Rank */}
      <div
        className="absolute top-0 h-full w-[2px] bg-red-500"
        style={{
          left: `${nextRankPosition}%`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Next Level Name above Red Line */}
      {/* <span
        className="absolute text-xs text-center text-black font-semibold"
        style={{
          left: `${nextRankPosition}%`,
          top: "-20px",
          transform: "translateX(-50%)",
        }}
      >
        {nextRankName}
      </span> */}

      {/* ! at right top */}
      <div className="relative group ml-auto">
        <span
          className="absolute text-xs text-center text-black font-semibold"
          style={{
            right: "-5%",
            top: "-25px",
            transform: "translateX(-50%)",
          }}
        >
          <Info className="w-5 h-5 text-blue-500" />
        </span>

        {/* Tooltip - Positioned to the Right */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {best?.map((match, index) => (
            <div key={index} className="mb-2">
              {new Date(match["match_date"]).toLocaleDateString()} :
              {match["opponent_id"] != null
                ? players.find((player) => player.id === match["opponent_id"])
                    ?.name
                : "CPU player"}{" "}
              {`${match.opponent_rank}(${getRankLevel(match.opponent_rank)})`}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-black text-white text-sm px-2 py-1 rounded pointer-events-none"
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default RankBar;
