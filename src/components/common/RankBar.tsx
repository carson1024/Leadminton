import { useState, useRef } from "react";

const RankBar = ({ rank, name }: { rank: number; name: string }) => {
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

  // ✅ Calculate the progress width for the current rank (normal calculation)
  const progressWidth = Math.floor((rank * 100) / 450);

  // Rank Weights for Tooltip Hover
  const rankWeights: { [key: string]: number } = {
    P12: 5,
    P11: 2.67,
    P10: 5,
    D9: 5,
    D8: 5,
    D7: 5,
    R6: 6.66,
    R5: 8.33,
    R4: 8.33,
    N3: 9.66,
    N2: 15.66,
    N1: 16,
  };

  const rankPoints = Object.keys(rankWeights);
  const totalWeight = Object.values(rankWeights).reduce((acc, w) => acc + w, 0);

  // Cumulative weight mapping
  const cumulativeWeights: { [key: string]: number } = {};
  let accumulated = 0;
  rankPoints.forEach((rank) => {
    cumulativeWeights[rank] = accumulated;
    accumulated += (rankWeights[rank] / totalWeight) * 100;
  });

  // Calculate the current rank's position
  const currentRankPosition = (rank / 450) * 100;

  // Find the next level's starting position and name
  const nextRank = rankPoints.find(
    (rank) => cumulativeWeights[rank] > currentRankPosition
  );
  const nextRankPosition = nextRank ? cumulativeWeights[nextRank] : 100; // Default to 100 if there's no next rank
  const nextRankName = nextRank || "N/A"; // Default to "N/A" if there's no next rank

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;

      let hoveredRank = "Unknown Rank";
      for (let i = 0; i < rankPoints.length; i++) {
        if (percentage >= cumulativeWeights[rankPoints[i]]) {
          hoveredRank = rankPoints[i];
        }
      }

      setTooltip({
        visible: true,
        x: relativeX,
        y: -30,
        content: hoveredRank,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className="relative w-full bg-gray-300 rounded-md"
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: "5px" }}
    >
      {/* ✅ Blue Progress Bar (Primary Rank Progress) */}
      <div
        className="h-full bg-blue-500 transition-all duration-500 rounded-md"
        style={{ width: `${progressWidth > 100 ? 100 : progressWidth}%` }}
      />

      {/* 🔴 Red Line at the Next Rank Level Position */}
      <div
        className="absolute top-0 h-full w-[2px] bg-red-500"
        style={{
          left: `${nextRankPosition}%`, // Position the red line at the next level's progress
          transform: "translateX(-50%)",
        }}
      />

      {/* Next Level Name above the red line */}
      <span
        className="absolute text-xs text-center text-black font-semibold"
        style={{
          left: `${nextRankPosition}%`, // Align the text above the red line
          top: "-20px", // Position it just above the red line
          transform: "translateX(-50%)",
        }}
      >
        {nextRankName}
      </span>

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
