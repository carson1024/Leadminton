import React from 'react';
import { Layout } from 'lucide-react';
import { Facility, GameState, Resources } from '../types/game';
import { calculateProductionRate } from '../utils/facilityUtils';
import { useGame } from '@/contexts/GameContext';

export default function DashboardPage() {
  const {resources, gameState} = useGame();

  const getProductionInfo = (facility: Facility) => {
    if (facility.type === 'training-center') {
      return {
        current: facility.maxPlayers,
        bonus: 0,
        total: facility.maxPlayers
      };
    }

    const activeManagers = gameState.managers.filter(m => m.active);
    const baseRate = calculateProductionRate(facility, facility.level, []);
    const totalRate = calculateProductionRate(facility, facility.level, activeManagers);
    const bonus = totalRate - baseRate;

    return {
      current: baseRate,
      bonus,
      total: totalRate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Layout className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble du club</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="space-y-2">
              <p>Joueurs totaux: {gameState.players.length}/{gameState.facilities.find(f => f.id === 'training-center')?.maxPlayers || 1}</p>
              <p>Installations totales: {gameState.facilities.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Production</h2>
          {gameState.facilities.map((facility) => {
            const production = getProductionInfo(facility);
            const manager = gameState.managers.find(m => m.facilityType === facility.type && m.active);

            return (
              <div key={facility.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{facility.name}</h3>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Niveau {facility.level}
                  </div>
                </div>

                {facility.type === 'training-center' ? (
                  <p className="text-gray-600">
                    Capacité maximale: {facility.maxPlayers} joueurs
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Production de base:</span>
                      <span>{production.current} {facility.resourceType}/min</span>
                    </div>
                    
                    {manager && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">Bonus ({manager.name}):</span>
                        <span className="text-green-600">+{production.bonus} {facility.resourceType}/min</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between font-medium pt-2 border-t">
                      <span>Production totale:</span>
                      <span>{production.total} {facility.resourceType}/min</span>
                    </div>

                    {facility.upgrading && (
                      <div className="mt-2 py-2 px-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                        Amélioration en cours...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}