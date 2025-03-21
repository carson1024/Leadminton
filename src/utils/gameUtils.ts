import { supabase } from "@/lib/supabase";
import { Facility, GameState, Manager, Player, Resources } from "@/types/game";
import { generateInitialStatLevels, generateInitialStats, generateInitialStrategy, generateNewPlayer, initialFacilities, initialManagers, initialState } from "./initialState";
import { EQUIPMENT_DATA } from "@/data/equipment";
import { Equipment } from "@/types/equipment";
import { Tournament, TournamentRound, Match } from "@/types/tournament";

export const loadResources = async (userId: string): Promise<Resources | null> => {
  const resources: Resources = {
    shuttlecocks: 10,
    meals: 10,
    coins: 200,
    diamonds: 9999999,
  }
  const { data: user_balances, error } = await supabase.from("user_resource_balances").select("*").eq("user_id", userId);
  if (error) return null;

  (user_balances || []).map((user_balance) => {
    resources[user_balance.resource_type as keyof Resources] += user_balance.balance;
  })
  return resources;
}

export const loadGameState = async (): Promise<GameState> => {
  let state: GameState = {
    players: [],
    facilities: [],
    managers: initialManagers
  };

  const { data: players_db } = await supabase.from("players").select("*").order('created_at', { ascending: true });
  const { data: player_stats } = await supabase.from("player_stats").select("*");
  const { data: player_levels } = await supabase.from("player_levels").select("*");
  const { data: player_strategies } = await supabase.from("player_strategy").select("*");
  const { data: facilities_db } = await supabase.from("facilities").select("*").order('created_at', { ascending: true });
  const { data: managers_db } = await supabase.from("managers").select("*").order('created_at', { ascending: true });

  state.facilities = (facilities_db || []).map((facility_db: any): Facility => ({
    id: facility_db.id,
    name: facility_db.name,
    type: facility_db.type,
    level: facility_db.level,
    productionRate: facility_db.production_rate,
    resourceType: facility_db.resource_type,
    maxPlayers: facility_db.max_players,
    upgradeCost: facility_db.upgrade_cost,
    upgrading: facility_db.upgrading,
  }));

  state.managers = (managers_db || []).map((manager_db: any): Manager => ({
    id: manager_db.id,
    name: manager_db.name,
    facilityType: manager_db.facility_type,
    productionBonus: manager_db.production_bonus,
    active: manager_db.active,
    imageUrl: manager_db.image_url,
    cost: manager_db.cost,
    purchasing: manager_db.purchasing
  }));

  let players: Player[] = [];
  (players_db || []).map((player_db: any) => {
    let equipment_id_map: {
      [key: string]: string
    } = player_db.equipment;
    let equiment: {
      [key: string]: Equipment
    } = {};
    equipment_id_map && Object.entries(equipment_id_map).map(([type, id]) => {
      equiment[type] = EQUIPMENT_DATA.find((equiment) => equiment.id == id) as Equipment;
    });
    let player: Player = {
      id: player_db.id,
      gender: player_db.gender,
      name: player_db.name,
      stats: generateInitialStats(),
      statLevels: generateInitialStatLevels(),
      level: player_db.level,
      maxLevel: player_db.max_level,
      rank: player_db.rank,
      training: player_db.training,
      equipment: equiment,
      injuries: (player_db.injuries || []),
      strategy: generateInitialStrategy()
    };

    const player_stat = (player_stats || []).find(({ player_id }) => player_id == player_db.id);
    player_stat && (player.stats = {
      endurance: player_stat.endurance,
      strength: player_stat.strength,
      agility: player_stat.agility,
      speed: player_stat.speed,
      explosiveness: player_stat.explosiveness,
      injuryPrevention: player_stat.injury_prevention,
      smash: player_stat.smash,
      defense: player_stat.defense,
      serve: player_stat.serve,
      stick: player_stat.stick,
      slice: player_stat.slice,
      drop: player_stat.drop,
    });

    const player_level = (player_levels || []).find(({ player_id }) => player_id == player_db.id);
    player_level && (player.statLevels = {
      endurance: player_level.endurance,
      strength: player_level.strength,
      agility: player_level.agility,
      speed: player_level.speed,
      explosiveness: player_level.explosiveness,
      injuryPrevention: player_level.injury_prevention,
      smash: player_level.smash,
      defense: player_level.defense,
      serve: player_level.serve,
      stick: player_level.stick,
      slice: player_level.slice,
      drop: player_level.drop,
    });

    const player_strategy = (player_strategies || []).find(({ player_id }) => player_id == player_db.id);
    player_strategy && (player.strategy = {
      physicalCommitment: player_strategy.physical_commitment,
      playStyle: player_strategy.play_style,
      movementSpeed: player_strategy.movement_speed,
      fatigueManagement: player_strategy.fatigue_management,
      rallyConsistency: player_strategy.rally_consistency,
      riskTaking: player_strategy.risk_taking,
      attack: player_strategy.attack,
      softAttack: player_strategy.soft_attack,
      serving: player_strategy.serving,
      courtDefense: player_strategy.court_defense,
      mentalToughness: player_strategy.mental_toughness,
      selfConfidence: player_strategy.self_confidence,
    });

    players.push(player);
  });

  state.players = players;
  return state;
};

export const loadTournaments = async (players: Player[]): Promise<Tournament[]> => {
  console.log("loading tournaments ");
  let tournaments: Tournament[] = [];
  // const { data: tournaments_db } = await supabase.from("tournament_list").select("*").order('start_date', { ascending: true });
  const { data: tournaments_db } = await supabase.rpc("get_tournaments_with_rounds_matches");
  console.log("this is getting tournament function from db", tournaments_db);
  // console.log("this is loaded tournaments from database ", tournaments_db);

  const normalizeRound = (rounds, tier) => {
    let totalLength = rounds?.length;
    let matchtemplate: Match = {
      id: "0",
      players: [null, null],
      completed: false
    }
    return rounds?.map((round, index) => {
      // round?.matches.length
      if (round?.matches?.length < Math.pow(2, (totalLength - index - 1))) {
        let result: Match[] = [];
        for (let p = 0; p < Math.pow(2, (totalLength - index - 1)); p++) {
          let newMatch = { ...matchtemplate };
          newMatch.id = "" + (p + 1);
          result.push(newMatch);
        }
        round?.matches?.map((match, index) => {
          // console.log(match?.players);
          result[parseInt(match.id) - 1] = {
            ...match, players: match?.players?.map((player, idx) => {
              if (player) {
                return players.find(p => p.id == player);
              }
              else return null;
            })
          };
        });
        return { ...round, matches: result };
      }
    });
    // return "";/
  }

  (tournaments_db || [])?.map(async (tournament_db, index) => {

    let tiers = ['local', 'regional', 'national', 'international', 'premier'];
    let tournament: Tournament = {
      id: tournament_db.id,
      startDate: /* tournament_db.start_date */ Date.now() + 15 * 1000,
      endDate: /* tournament_db.end_date */ Date.now() + 60000 * 1000,
      prizePool: tournament_db.prizePool,
      entryFee: tournament_db.entryFee,
      minPlayerLevel: tournament_db.min_PlayerLevel,
      maxParticipants: tournament_db.max_participants,
      status: tournament_db.status == 0 ? 'upcoming' : tournament_db.status == 1 ? 'ongoing' : 'completed',
      tier: tiers[tournament_db.tier],
      currentParticipants: tournament_db.current_Participants,
      isQuickTournament: false,
      rounds: normalizeRound(tournament_db.rounds, tiers[tournament_db.tier]) /* tournament_db.rounds */ /* [{},{},{},{}] */,
      registeredPlayers: tournament_db.registeredPlayers,
    };
    tournaments.push(tournament);
  });
  console.log("this is calculated", tournaments)
  return tournaments;
};

export const updateName = async (playerId: string, newName: string): Promise<void> => {
  await supabase
    .from('players')
    .update({
      name: newName
    })
    .eq('id', playerId)
    .select('*');
}

export const createPlayer = async (userId: string): Promise<Player | null> => {
  let newPlayer = generateNewPlayer();
  const maxLevel = Math.floor(Math.random() * 50) + 150;
  const { error, data } = await supabase
    .from('players')
    .insert({
      user_id: userId,
      gender: newPlayer.gender,
      name: newPlayer.name,
      level: newPlayer.level,
      rank: newPlayer.rank,
      max_level: newPlayer.maxLevel
    })
    .select('id, name')
    .single();
  if (error) {
    console.error({ error });
    return null;
  }

  if (!data || !data.id) return null;

  await supabase.from('player_stats').insert({
    player_id: data.id,
    endurance: newPlayer.stats.endurance,
    strength: newPlayer.stats.strength,
    agility: newPlayer.stats.agility,
    speed: newPlayer.stats.speed,
    explosiveness: newPlayer.stats.explosiveness,
    injury_prevention: newPlayer.stats.injuryPrevention,
    smash: newPlayer.stats.smash,
    defense: newPlayer.stats.defense,
    serve: newPlayer.stats.serve,
    stick: newPlayer.stats.stick,
    slice: newPlayer.stats.slice,
    drop: newPlayer.stats.drop,
  });
  await supabase.from('player_levels').insert({
    player_id: data.id
  });
  await supabase.from('player_strategy').insert({
    player_id: data.id
  });

  newPlayer.id = data.id;
  return newPlayer;
}