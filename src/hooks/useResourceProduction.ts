import { useState, useEffect, useCallback } from 'react';
import { Resources, Facility, Manager } from '../types/game';
import { calculateProductionRate } from '../utils/facilityUtils';
import { recordResourceUpdate } from '@/lib/gameActions';
import { useAuth } from '@/contexts/AuthContext';
import { loadResources } from '@/utils/gameUtils';

export function useResourceProduction(facilities: Facility[], managers: Manager[]) {
  const [lastProductionTime, setLastProductionTime] = useState(Date.now());
  const { user } = useAuth();
  const [resources, setResources] = useState<Resources>({
    shuttlecocks: 10,
    meals: 10,
    coins: 200,
    diamonds: 9999999,
  });

  const updateResources = useCallback(async (source: string, changes: Partial<Record<keyof Resources, number>>, isAdd: boolean = true) => {
    await recordResourceUpdate(user?.id, source, changes, isAdd);
    setResources(prev => {
      let newResources: Resources = { ...prev };
      Object.entries(changes).map(([resource, amount]) => {
        newResources[resource as keyof Resources] += isAdd ? amount : -amount;
      });
      return newResources;
    });
  }, [resources, user]);
  
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(async () => {
      const newResources = await loadResources(user.id);
      newResources && setResources(newResources);
      // const now = Date.now();
      // const timeDiff = now - lastProductionTime;
      // if (timeDiff >= 60000) { // Production every minute
      //   const newChanges: Partial<Record<keyof Resources, number>> = {};

      //   facilities.forEach((facility) => {
      //     // Ne produire que si l'installation n'est pas en cours d'amélioration
      //     if (facility.resourceType && !facility.upgrading) {
      //       // Passer les managers actifs pour calculer le bonus
      //       const activeManagers = managers.filter(m => m.active);
      //       const productionRate = calculateProductionRate(facility, facility.level, activeManagers);
            
      //       console.log(`${facility.name} producing ${productionRate} ${facility.resourceType}`, {
      //         hasActiveManager: activeManagers.some(m => m.facilityType === facility.type),
      //         baseRate: facility.productionRate,
      //         finalRate: productionRate
      //       });
            
      //       newChanges[facility.resourceType] = productionRate;
      //     }
      //   });

      //   updateResources("facility_production", newChanges);

      //   setLastProductionTime(now);
      // }
    }, 30000);

    return () => clearInterval(timer);
  }, [user]); // Ajout de managers dans les dépendances

  return { resources, setResources, updateResources };
}