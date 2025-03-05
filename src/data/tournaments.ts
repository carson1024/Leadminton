import { Tournament } from '../types/tournament';
import { generateRandomName } from '../utils/nameGenerator';

const createCpuPlayer = (id: number, baseLevel: number = 1) => ({
  id: `cpu-${id}`,
  name: generateRandomName('male'),
  level: Math.max(1, baseLevel + Math.floor(Math.random() * 3) - 1),
  stats: {
    endurance: 50,
    strength: 50,
    agility: 50,
    speed: 50,
    explosiveness: 50,
    injuryPrevention: 50,
    smash: 50,
    defense: 50,
    serve: 50,
    stick: 50,
    slice: 50,
    drop: 50,
  },
  statLevels: {
    endurance: 0,
    strength: 0,
    agility: 0,
    speed: 0,
    explosiveness: 0,
    injuryPrevention: 0,
    smash: 0,
    defense: 0,
    serve: 0,
    stick: 0,
    slice: 0,
    drop: 0,
  },
  equipment: {}
});

const cpuPlayers = Array(7).fill(null).map((_, i) => createCpuPlayer(i + 1));

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'local-1',
    name: 'City Championship',
    tier: 'local',
    status: 'upcoming',
    startDate: Date.now() + 10000,
    endDate: Date.now() + (24 * 60 * 60 * 1000),
    entryFee: {
      coins: 500,
      shuttlecocks: 10
    },
    prizePool: {
      first: { coins: 2000, diamonds: 5 },
      second: { coins: 1000, diamonds: 2 },
      third: { coins: 500, diamonds: 1 }
    },
    minPlayerLevel: 1,
    maxParticipants: 8,
    currentParticipants: 7,
    rounds: [
      {
        name: "Quarts de finale",
        matches: [
          {
            id: '1',
            players: [null, cpuPlayers[0]],
            completed: false
          },
          {
            id: '2',
            players: [cpuPlayers[1], cpuPlayers[2]],
            completed: false
          },
          {
            id: '3',
            players: [cpuPlayers[3], cpuPlayers[4]],
            completed: false
          },
          {
            id: '4',
            players: [cpuPlayers[5], cpuPlayers[6]],
            completed: false
          }
        ]
      },
      {
        name: "Demi-finales",
        matches: [
          { id: '5', players: [null, null], completed: false },
          { id: '6', players: [null, null], completed: false }
        ]
      },
      {
        name: "Finale",
        matches: [
          { id: '7', players: [null, null], completed: false }
        ]
      }
    ],
    registeredPlayers: cpuPlayers.map(player => ({
      playerId: player.id,
      playerName: player.name,
      clubId: 'cpu',
      clubName: 'CPU Club',
      registered: Date.now() - Math.random() * 3600000
    }))
  }
];