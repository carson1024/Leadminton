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
    const load = async () => {
      const newResources = await loadResources(user.id);
      newResources && setResources(newResources);
    };

    const timer = setInterval(load, 60000);
    load();
    
    return () => clearInterval(timer);
  }, [user]); // Ajout de managers dans les dépendances

  return { resources, setResources, updateResources };
}