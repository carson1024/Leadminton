import React from "react";
import { X } from "lucide-react";
import { Player, PlayerStrategy } from "../../types/game";
import StrategySlider from "./StrategySlider";

interface PlayerStrategyModalProps {
  player: Player;
  onClose: () => void;
  onUpdateStrategy: (playerId: string, strategy: PlayerStrategy) => void;
}

export default function PlayerStrategyModal({
  player,
  onClose,
  onUpdateStrategy,
}: PlayerStrategyModalProps) {
  const [strategy, setStrategy] = React.useState<PlayerStrategy>(
    player.strategy
  );

  const handleStrategyChange = (key: keyof PlayerStrategy, value: number) => {
    const newStrategy = { ...strategy, [key]: value };
    setStrategy(newStrategy);
    // onUpdateStrategy(player.id, newStrategy);
  };

  const strategyFields = [
    {
      key: "physicalCommitment",
      label: "Implication Physique",
      description: "Endurance et puissance",
    },
    {
      key: "playStyle",
      label: "Style de Frappe",
      description: "Puissance des frappes",
    },
    {
      key: "movementSpeed",
      label: "Vitesse de Déplacement",
      description: "Agilité sur le terrain",
    },
    {
      key: "fatigueManagement",
      label: "Gestion de la Fatigue",
      description: "Potentiel physique",
    },
    {
      key: "rallyConsistency",
      label: "Consistance Échanges",
      description: "Régularité",
    },
    {
      key: "riskTaking",
      label: "Prise de Risque",
      description: "Impact/Précision",
    },
    { key: "attack", label: "Attaque", description: "Smash (10/10)" },
    {
      key: "softAttack",
      label: "Soft Attaque",
      description: "Drop shot (10/10)",
    },
    { key: "serving", label: "Mise en Jeu", description: "Service (10/10)" },
    {
      key: "courtDefense",
      label: "Protection Terrain",
      description: "Défense (10/10)",
    },
    {
      key: "mentalToughness",
      label: "Résilience Mentale",
      description: "Service",
    },
    {
      key: "selfConfidence",
      label: "Confiance en Soi",
      description: "Smash + Défense",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => {
        onUpdateStrategy(player.id, strategy);
        onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Stratégie de {player.name}</h2>
            <p className="text-sm text-gray-600">
              Ajustez les curseurs pour définir la stratégie du joueur
            </p>
          </div>
          <button
            onClick={() => {
              onUpdateStrategy(player.id, strategy);
              onClose();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {strategyFields.map(({ key, label, description }) => (
            <StrategySlider
              key={key}
              label={label}
              description={description}
              value={strategy[key as keyof PlayerStrategy]}
              onChange={(value) =>
                handleStrategyChange(key as keyof PlayerStrategy, value)
              }
            />
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">
            Priorités pour le calcul des matchs
          </h3>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>Score: 60%</li>
            <li>Stratégie: 30%</li>
            <li>Classement: 10%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
