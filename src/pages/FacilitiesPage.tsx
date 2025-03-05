import React from 'react';
import { Building2 } from 'lucide-react';
import { GameState, Resources } from '../types/game';
import FacilityCard from '../components/facility/FacilityCard';
import ManagerCard from '../components/facility/ManagerCard';
import { calculateSpeedUpCost } from '../utils/costCalculator';
import { calculateUpgradeTime } from '../utils/timeCalculator';
import { recordFacilityUpgradeStart, recordFacilityUpgradeComplete, recordHireManager } from '../lib/gameActions';
import { getInitialUpgradeCost, getUpgradedFacility } from '../utils/facilityUtils';
import { useGame } from '@/contexts/GameContext';

export default function FacilitiesPage() {
  const { resources, gameState, updateResources, dispatchGameState } = useGame();

  const handleUpgradeFacility = async (facilityId: string) => {
    const facility = gameState.facilities.find(f => f.id === facilityId);
    if (!facility || facility.upgrading) return;

    const upgradeCost = facility.upgradeCost || getInitialUpgradeCost(facility);
    const canAfford = Object.entries(upgradeCost).every(
      ([resource, cost]) => resources[resource as keyof Resources] >= cost
    );

    if (!canAfford) return;

    
    updateResources("facility_production", upgradeCost, false);

    const upgradedFacility = getUpgradedFacility(facility);
    dispatchGameState({type: "START_FACILITY_UPGRADE", payload: { facilityId, upgradedFacility }});
    await recordFacilityUpgradeStart(facility, upgradeCost);
  };

  const handleSpeedUpFacility = async (facilityId: string) => {
    const facility = gameState.facilities.find(f => f.id === facilityId);
    if (!facility?.upgrading) return;

    const timeLeft = facility.upgrading.startTime + facility.upgrading.period - Date.now();
    const diamondCost = calculateSpeedUpCost(timeLeft);

    if (resources.diamonds < diamondCost) return;

    updateResources("facility_production", {
      diamonds: -diamondCost
    });
    
    const upgradedFacility = getUpgradedFacility(facility);
    dispatchGameState({type: "SPEED_UP_FACILITY", payload: { facilityId, upgradedFacility }});
    await recordFacilityUpgradeComplete(facility, upgradedFacility);
  };

  const handleHireManager = async (managerId: string) => {
    const manager = gameState.managers.find(m => m.id === managerId);
    if (!manager || manager.active || resources.diamonds < manager.cost) return;

    // Déduire le coût en diamants
    updateResources("facility_production", {
      diamonds: -manager.cost
    });

    dispatchGameState({type: "HIRE_MANAGER", payload: { managerId }});
    await recordHireManager(managerId);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Building2 className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">Installations</h1>
      </div>

      {/* Installations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameState.facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onUpgrade={handleUpgradeFacility}
            onSpeedUp={handleSpeedUpFacility}
            canAfford={Object.entries(facility.upgradeCost).every(
              ([resource, cost]) => resources[resource as keyof Resources] >= cost
            )}
            canAffordSpeedUp={(diamondCost) => resources.diamonds >= diamondCost}
          />
        ))}
      </div>

      {/* Managers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Managers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameState.managers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onHire={handleHireManager}
              canAfford={resources.diamonds >= manager.cost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}