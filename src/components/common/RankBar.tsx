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
  const progressWidth = Math.floor((rank * 100) / 450); // Active area width

  const rankPoints: { [key: number]: string } = {
    0: "P12",
    1: "P11",
    2: "P10",
    3: "D9",
    4: "D8",
    5: "D7",
    6: "R6",
    7: "R5",
    8: "R4",
    9: "N3",
    10: "N2",
    11: "N1",
  };

  const totalRanks = 12;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left; // Mouse position relative to the bar
      const widthPerRank = rect.width / totalRanks; // Divide bar into 12 sections
      const hoveredRank = Math.min(
        Math.floor(relativeX / widthPerRank),
        totalRanks - 1
      ); // Determine hovered rank

      let tooltipText;
      if (relativeX <= (progressWidth / 100) * rect.width) {
        // Cursor is inside the active progress area → Show rank score
        tooltipText = "P" + name;
      } else {
        // Cursor is in the remaining bar area → Show rank name
        tooltipText = rankPoints[hoveredRank] || "Unknown Rank";
      }

      setTooltip({
        visible: true,
        x: relativeX,
        y: -30,
        content: tooltipText,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className="relative w-full h-6 bg-gray-300 rounded-md"
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: "5px" }}
    >
      {/* Active Progress Area */}
      <div
        className="h-full bg-blue-500 transition-all duration-500 rounded-md"
        style={{ width: `${progressWidth}%` }}
      />

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
