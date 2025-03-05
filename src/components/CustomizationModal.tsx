import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Equipment, EquipmentType, PlayerEquipment } from '../types/equipment';
import { EQUIPMENT_DATA } from '../data/equipment';
import { Resources } from '../types/game';
import EquipmentCard from './equipment/EquipmentCard';

interface CustomizationModalProps {
  onClose: () => void;
  playerEquipment: PlayerEquipment;
  onEquip: (equipment: Equipment) => void;
  resources: Resources;
}

const EQUIPMENT_TYPES: { type: EquipmentType; label: string }[] = [
  { type: 'shoes', label: 'Shoes' },
  { type: 'racket', label: 'Racket' },
  { type: 'strings', label: 'Strings' },
  { type: 'shirt', label: 'Shirt' },
  { type: 'shorts', label: 'Shorts' },
];

export default function CustomizationModal({
  onClose,
  playerEquipment,
  onEquip,
  resources,
}: CustomizationModalProps) {
  const [selectedType, setSelectedType] = useState<EquipmentType>('shoes');

  const filteredEquipment = EQUIPMENT_DATA.filter(
    (equipment) => equipment.type === selectedType
  );

  const canAfford = (equipment: Equipment): boolean => {
    if (!resources) return false;
    return (
      resources.coins >= equipment.price.coins &&
      resources.diamonds >= equipment.price.diamonds
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Equipment Shop</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {EQUIPMENT_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              isEquipped={playerEquipment[equipment.type]?.id === equipment.id}
              onEquip={onEquip}
              canAfford={canAfford(equipment)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}