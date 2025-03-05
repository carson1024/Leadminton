import React from 'react';
import { Equipment } from '../../types/equipment';
import { Resources } from '../../types/game';

interface EquipmentCardProps {
  equipment: Equipment;
  isEquipped: boolean;
  onEquip: (equipment: Equipment) => void;
  canAfford: boolean;
}

export default function EquipmentCard({ equipment, isEquipped, onEquip, canAfford }: EquipmentCardProps) {
  const RARITY_COLORS = {
    common: 'text-gray-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-yellow-500',
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="aspect-w-1 aspect-h-1 mb-4">
        <img
          src={equipment.imageUrl}
          alt={equipment.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <h3 className={`font-bold ${RARITY_COLORS[equipment.rarity]}`}>
        {equipment.name}
      </h3>
      <div className="mt-2 space-y-1 text-sm">
        {Object.entries(equipment.stats).map(([stat, bonus]) => (
          <div key={stat} className="text-gray-600">
            +{bonus} {stat}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm">
          <div className="text-yellow-500">{equipment.price.coins} coins</div>
          <div className="text-purple-500">{equipment.price.diamonds} diamonds</div>
        </div>
        <button
          onClick={() => onEquip(equipment)}
          disabled={!canAfford || isEquipped}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isEquipped
              ? 'bg-green-500 text-white cursor-default'
              : canAfford
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isEquipped ? 'Equipped' : canAfford ? 'Equip' : 'Cannot Afford'}
        </button>
      </div>
    </div>
  );
}