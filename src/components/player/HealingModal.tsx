import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Heart, Ban as Bandage, ChevronFirst as FirstAid } from 'lucide-react';
import { Player, Resources } from '../../types/game';

interface HealingModalProps {
  player: Player;
  onClose: () => void;
  onHeal: (itemId: string, recoveryReduction: number) => void;
  resources: Resources;
}

const HEALING_ITEMS = [
  {
    id: 'bandage',
    name: 'Bandage',
    description: 'Reduces recovery time by 30%',
    icon: Bandage,
    cost: 2,
    recoveryReduction: 0.3,
    color: 'bg-green-100 text-green-800',
    forSeverity: ['minor'] as ('minor' | 'moderate' | 'severe')[],
  },
  {
    id: 'first-aid-kit',
    name: 'First Aid Kit',
    description: 'Reduces recovery time by 50%',
    icon: FirstAid,
    cost: 4,
    recoveryReduction: 0.5,
    color: 'bg-blue-100 text-blue-800',
    forSeverity: ['minor', 'moderate'] as ('minor' | 'moderate' | 'severe')[],
  },
  {
    id: 'medical-kit',
    name: 'Medical Kit',
    description: 'Reduces recovery time by 70%',
    icon: Heart,
    cost: 8,
    recoveryReduction: 0.7,
    color: 'bg-purple-100 text-purple-800',
    forSeverity: ['minor', 'moderate', 'severe'] as ('minor' | 'moderate' | 'severe')[],
  },
];

export default function HealingModal({ player, onClose, onHeal, resources }: HealingModalProps) {
  const [time, setTime] = useState(Date.now()); // State to trigger updates
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now()); // Update time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  const formatTime = useCallback((timestamp: number): string => {
    const timeLeft = Math.max(0, timestamp - time);
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft / 1000) % 60);
    
    if (minutes === 0) {
      return `${seconds} seconds`;
    }
    
    return `${minutes} minutes ${seconds} seconds`;
  }, [time]);

  if (!player.injuries || player.injuries.length === 0) return null;

  const activeInjuries = useMemo(() =>player.injuries.filter(injury => injury.recoveryEndTime > time), [player.injuries, time]);

  return (activeInjuries.length > 0 &&
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">Heal Injuries</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {activeInjuries.map((injury, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                injury.severity === 'minor' ? 'bg-yellow-50' :
                injury.severity === 'moderate' ? 'bg-orange-50' :
                'bg-red-50'
              }`}
            >
              <h3 className="font-medium mb-2">{player.name}'s Injury</h3>
              <p className="text-sm text-gray-600">
                {injury.type} ({injury.severity})
              </p>
              <p className="text-sm text-gray-500">
                Recovery time: {formatTime(injury.recoveryEndTime)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {HEALING_ITEMS
            .filter(item => activeInjuries.some(injury => item.forSeverity.includes(injury.severity)))
            .map(item => (
              <button
                key={item.id}
                onClick={() => onHeal(item.id, item.recoveryReduction)}
                disabled={resources.diamonds < item.cost}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-between ${
                  resources.diamonds >= item.cost
                    ? `${item.color} hover:bg-opacity-80`
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm">{item.description}</div>
                  </div>
                </div>
                <div className="font-medium">{item.cost} 💎</div>
              </button>
            ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Your diamonds: {resources.diamonds} 💎
        </div>
      </div>
    </div>
  );
}