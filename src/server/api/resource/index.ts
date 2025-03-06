import { Facility, Manager, Resources } from "@/types/game";
import { calculateProductionRate } from "@/utils/facilityUtils";
import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL as string, import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string);

export const POST = async (req: Request, res: Response, next: NextFunction) => {
  const { data: facilities_db } = await supabase.from("facilities").select("*");
  const { data: managers_db } = await supabase.from("managers").select("*");
  let users: string[] = [];
  let facilities_map: {
    [key: string]: Facility[]
  } = {};
  let managers_map: {
    [key: string]: Manager[]
  } = {};
  (facilities_db || []).map(facility_db => {
    const user_id = facility_db.user_id;
    if (users.indexOf(user_id) == -1) {
      users.push(user_id);
    }
    if (!facilities_map[user_id]) {
      facilities_map[user_id] = [];
    }
    facilities_map[user_id].push({
      id: facility_db.id,
      name: facility_db.name,
      type: facility_db.type,
      level: facility_db.level,
      productionRate: facility_db.production_rate,
      resourceType: facility_db.resource_type,
      maxPlayers: facility_db.max_players,
      upgradeCost: facility_db.upgrade_cost,
      upgrading: facility_db.upgrading,
    });
  });
  (managers_db || []).map(manager_db => {
    const user_id = manager_db.user_id;
    if (users.indexOf(user_id) == -1) {
      users.push(user_id);
    }
    if (!managers_map[user_id]) {
      managers_map[user_id] = [];
    }
    managers_map[user_id].push({
      id: manager_db.id,
      name: manager_db.name,
      facilityType: manager_db.facility_type,
      productionBonus: manager_db.production_bonus,
      active: manager_db.active,
      imageUrl: manager_db.image_url,
      cost: manager_db.cost,
      purchasing: manager_db.purchasing
    });
  });

  users.map(async (user) => {
    let facilities: Facility[] = facilities_map[user];
    let managers: Manager[] = managers_map[user];
    if (!facilities || !managers) return;

    const newChanges: Partial<Record<keyof Resources, number>> = {};
    facilities.forEach((facility) => {
      // Ne produire que si l'installation n'est pas en cours d'amélioration
      if (facility.resourceType && !facility.upgrading) {
        // Passer les managers actifs pour calculer le bonus
        const activeManagers = managers.filter(m => m.active);
        const productionRate = calculateProductionRate(facility, facility.level, activeManagers);
        
        console.log(`${facility.name} producing ${productionRate} ${facility.resourceType}`, {
          hasActiveManager: activeManagers.some(m => m.facilityType === facility.type),
          baseRate: facility.productionRate,
          finalRate: productionRate
        });
        
        newChanges[facility.resourceType] = productionRate;
      }
    });

    const data = Object.entries(newChanges).map(([resource, amount]) => ({
        resource_type: resource,
        amount: amount,
        source: "facility_production"
      }));
    
    await supabase.rpc("batch_resource_transactions", {p_user_id: user, p_transactions: data});
  });

  res.status(200).json({});
}