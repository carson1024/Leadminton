import React, { useEffect, useMemo, useState } from 'react';
import { Manager } from '../../types/game';
import { Power, Diamond } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { recordHireManagerComplete } from '@/lib/gameActions';

interface ManagerCardProps {
  manager: Manager;
  onHire: (managerId: string) => void;
  canAfford: boolean;
}

export default function ManagerCard({ manager, onHire, canAfford }: ManagerCardProps) {

  const { dispatchGameState } = useGame();

  const facilityNames = {
    'shuttlecock-machine': 'Machine à volants',
    'canteen': 'Cantine',
    'sponsors': 'Sponsors'
  };

  const [timeLeft, setTimeLeft] = useState(0);
  const days = useMemo(() => Math.floor(timeLeft / (24 * 3600)), [timeLeft]);
  const hours = useMemo(() => Math.floor((timeLeft % (24 * 3600)) / 3600), [timeLeft]);
  const minutes = useMemo(() => Math.floor((timeLeft % 3600) / 60), [timeLeft]);

  useEffect(() => {
    const updateTimeLeft = () => {
      const leftTime = manager.purchasing ? Math.max(0, Math.floor((manager.purchasing.startTime + manager.purchasing.period - Date.now()) / 1000)) : 0;
      setTimeLeft(leftTime);
      if (!leftTime) {
        dispatchGameState({type: "COMPLETE_MANAGER_DURATION", payload: { managerId: manager.id }});
        recordHireManagerComplete(manager.id);
      }
    }
    const timer = setInterval(updateTimeLeft, 10000);

    updateTimeLeft();

    return () => clearInterval(timer);
  }, [manager.purchasing]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center space-x-4">
        <img
          src={manager.imageUrl}
          alt={manager.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{manager.name}</h3>
          <p className="text-sm text-gray-600">
            {facilityNames[manager.facilityType]}
          </p>
          <p className="text-sm text-green-600">
            +{manager.productionBonus * 100}% de production
          </p>
          {manager.active && timeLeft > 0 && (
            <p className="text-sm text-blue-600">
              Temps restant: {days}j {hours}h {minutes}m
            </p>
          )}
        </div>
        <button
          onClick={() => onHire(manager.id)}
          disabled={manager.active || !canAfford}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            manager.active
              ? 'bg-green-500 text-white cursor-default'
              : canAfford
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {manager.active ? (
            <span>Actif</span>
          ) : (
            <>
              <Diamond className="w-4 h-4" />
              <span>{manager.cost}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}