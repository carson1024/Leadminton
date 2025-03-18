import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Dumbbell, Brain, Shirt, Heart, Settings } from "lucide-react";
import { Player, PlayerStrategy } from "../../types/game";
import { Equipment } from "../../types/equipment";
import { Resources } from "../../types/game";
import TrainingModal from "../training/TrainingModal";
import CustomizationModal from "../equipment/CustomizationModal";
import SpeedUpButton from "../common/SpeedUpButton";
import { useProgress } from "../../hooks/useProgress";
import { calculatePlayerScore } from "../../utils/playerScore";
import PlayerStats from "./PlayerStats";
import HealingModal from "./HealingModal";
import { calculateTotalInjuryEffect } from "../../utils/injuryUtils";
import PlayerStrategyModal from "./PlayerStrategyModal";
import { formatTime } from "@/utils/dateFormatter";
import RankBar from "../common/RankBar";

interface PlayerCardProps {
  player: Player;
  onStartTraining: (playerId: string, stat: keyof Player["stats"]) => void;
  calculateTrainingCost: (
    player: Player,
    stat: keyof Player["stats"]
  ) => Omit<Resources, "diamonds">;
  canAffordTraining: (cost: Omit<Resources, "diamonds">) => boolean;
  onNameChange: (playerId: string, newName: string) => void;
  onSpeedUpTraining: (playerId: string) => void;
  canAffordSpeedUp: (diamondCost: number) => boolean;
  resources: Resources;
  onEquipItem: (playerId: string, equipment: Equipment) => void;
  onHeal?: (
    playerId: string,
    itemId: string,
    recoveryReduction: number
  ) => void;
  onUpdateStrategy: (playerId: string, strategy: PlayerStrategy) => void;
}

export default function PlayerCard({
  player,
  onStartTraining,
  calculateTrainingCost,
  canAffordTraining,
  onNameChange,
  onSpeedUpTraining,
  canAffordSpeedUp,
  resources,
  onEquipItem,
  onHeal,
  onUpdateStrategy,
}: PlayerCardProps) {
  const [showPhysicalTraining, setShowPhysicalTraining] = useState(false);
  const [showTechnicalTraining, setShowTechnicalTraining] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showHealing, setShowHealing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const [showStrategy, setShowStrategy] = useState(false);
  const handleSpeedUp = useCallback(() => {
    if (player.training) {
      onSpeedUpTraining(player.id);
    }
  }, [player]);
  const { progress, timeLeft } = useProgress(
    player.training?.startTime,
    player.training?.period,
    handleSpeedUp
  );
  const [time, setTime] = useState(Date.now()); // State to trigger updates

  const getRank = (rankPoint) => {
    if (rankPoint <= 20) return 12;
    else if (rankPoint <= 40) return 11;
    else if (rankPoint <= 70) return 10;
    else if (rankPoint < 100) return 9;
    else if (rankPoint < 130) return 8;
    else if (rankPoint < 160) return 7;
    else if (rankPoint < 200) return 6;
    else if (rankPoint < 250) return 5;
    else if (rankPoint < 300) return 4;
    else if (rankPoint < 370) return 3;
    else if (rankPoint < 450) return 2;
    else if (rankPoint > 450) return 1;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now()); // Update time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const playerScore = useMemo(() => calculatePlayerScore(player), [player]);
  const canTrain = useMemo(
    () => player.level < player.maxLevel && !player.training,
    [player]
  );
  const activeInjuries = useMemo(
    () =>
      player.injuries?.filter((injury) => injury.recoveryEndTime > time) || [],
    [player.injuries, time]
  );
  const isInjured = useMemo(() => activeInjuries.length > 0, [activeInjuries]);

  const genderDetails = useMemo(
    () => ({
      emoji: player.gender === "male" ? "♂️" : "♀️",
      color: player.gender === "male" ? "text-blue-500" : "text-pink-500",
    }),
    [player.gender]
  );

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onNameChange(player.id, tempName.trim());
      setIsEditingName(false);
    }
  };

  const getSeverityColor = (
    severity: "minor" | "moderate" | "severe"
  ): string => {
    switch (severity) {
      case "minor":
        return "bg-yellow-50 text-yellow-700";
      case "moderate":
        return "bg-orange-50 text-orange-700";
      case "severe":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {isEditingName ? (
                <form
                  onSubmit={handleNameSubmit}
                  className="flex items-center space-x-2"
                >
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
                <div className="flex items-center space-x-2">
                  <span className={`text-lg ${genderDetails.color}`}>
                    {genderDetails.emoji}
                  </span>
                  <h3 className="text-lg font-semibold">{player.name}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              )}
              <span className={`badge-rank-${getRank(player.rank)}`}></span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Level {player.level}/{player.maxLevel}
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPhysicalTraining(true)}
              disabled={!canTrain}
              className={`p-2 rounded-lg ${
                canTrain
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              title="Physical Training"
            >
              <Dumbbell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowTechnicalTraining(true)}
              disabled={!canTrain}
              className={`p-2 rounded-lg ${
                canTrain
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              title="Technical Training"
            >
              <Brain className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCustomization(true)}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              title="Customize Equipment"
            >
              <Shirt className="w-4 h-4" />
            </button>
            {isInjured && (
              <button
                onClick={() => setShowHealing(true)}
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                title="Heal Injury"
              >
                <Heart className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowStrategy(true)}
              className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
              title="Stratégie"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold">
              Score: {playerScore.score}
            </div>
            <div className="text-sm text-gray-600">
              Physical: {playerScore.details.physicalScore} | Technical:{" "}
              {playerScore.details.technicalScore}
            </div>
          </div>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="mb-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Score Details
                </h4>
                <div className="space-y-1 text-sm">
                  <p>Base Score: {playerScore.details.baseScore}</p>
                  <p>Balance Multiplier: {playerScore.details.balanceScore}x</p>
                  {playerScore.details.specialization.length > 0 && (
                    <p>
                      Specializations:{" "}
                      {playerScore.details.specialization.join(", ")}
                    </p>
                  )}
                  {playerScore.details.weaknesses.length > 0 && (
                    <p className="text-red-500">
                      Weaknesses: {playerScore.details.weaknesses.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rank</h4>
                <RankBar rank={player.rank} name={getRank(player.rank)} />
                <div className="flex justify-between w-full">
                  <span>P12</span>
                  <span>N1</span>
                </div>
                {Object.keys(playerScore.details.equipmentBonuses).length >
                  0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Equipment Bonuses
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(playerScore.details.equipmentBonuses).map(
                        ([stat, bonus]) => (
                          <p key={stat} className="text-green-600">
                            +{bonus} {stat}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <PlayerStats
          player={player}
          equipmentBonuses={playerScore.details.equipmentBonuses}
          injuryEffects={calculateTotalInjuryEffect(player)}
        />

        {/* Training Progress Section */}
        {player.training && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-600">
                  Training {player.training.stat}...
                </p>
                <SpeedUpButton
                  timeLeft={timeLeft * 1000}
                  onSpeedUp={handleSpeedUp}
                  disabled={!canAffordSpeedUp(Math.ceil(timeLeft / 10))}
                />
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                {formatTime(timeLeft)} remaining
              </div>
            </div>
          </div>
        )}

        {/* Injuries Section */}
        {isInjured && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <h4 className="font-medium text-gray-700">Active Injuries:</h4>
            {activeInjuries.map((injury, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${getSeverityColor(
                  injury.severity
                )}`}
              >
                <div className="font-medium mb-1">{injury.type}</div>
                <div className="text-sm space-y-1">
                  <div>
                    Recovery time:{" "}
                    {formatTime(
                      Math.max(
                        0,
                        Math.floor((injury.recoveryEndTime - time) / 1000)
                      )
                    )}
                  </div>
                  {injury.affectedStats && (
                    <div>
                      Affected stats:{" "}
                      {Object.keys(injury.affectedStats).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPhysicalTraining && (
        <TrainingModal
          player={player}
          onClose={() => setShowPhysicalTraining(false)}
          onStartTraining={(stat) => {
            onStartTraining(player.id, stat);
            setShowPhysicalTraining(false);
          }}
          calculateTrainingCost={calculateTrainingCost}
          canAffordTraining={canAffordTraining}
          type="physical"
        />
      )}

      {showTechnicalTraining && (
        <TrainingModal
          player={player}
          onClose={() => setShowTechnicalTraining(false)}
          onStartTraining={(stat) => {
            onStartTraining(player.id, stat);
            setShowTechnicalTraining(false);
          }}
          calculateTrainingCost={calculateTrainingCost}
          canAffordTraining={canAffordTraining}
          type="technical"
        />
      )}

      {showCustomization && (
        <CustomizationModal
          onClose={() => setShowCustomization(false)}
          playerEquipment={player.equipment}
          onEquip={(equipment: Equipment) => {
            onEquipItem(player.id, equipment);
            setShowCustomization(false);
          }}
          resources={resources}
        />
      )}

      {showHealing && isInjured && (
        <HealingModal
          player={player}
          onClose={() => setShowHealing(false)}
          onHeal={(itemId, reduction) => {
            onHeal?.(player.id, itemId, reduction);
            setShowHealing(false);
          }}
          resources={resources}
        />
      )}

      {showStrategy && (
        <PlayerStrategyModal
          player={player}
          onClose={() => setShowStrategy(false)}
          onUpdateStrategy={onUpdateStrategy}
        />
      )}
    </>
  );
}
