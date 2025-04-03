import { Tournament } from '../types/tournament';
import { generateRandomName } from '../utils/nameGenerator';

export const createCpuPlayer = (id: number, baseLevel: number = 1) => ({
  id: `cpu-${id}`,
  name: generateRandomName('male'),
  rank: Math.floor(Math.random() * 450),
  level: Math.max(1, baseLevel + Math.floor(Math.random() * 3) - 1),
  statLevels: {
    endurance: Math.floor(Math.random() * 100),
    strength: Math.floor(Math.random() * 100),
    agility: Math.floor(Math.random() * 100),
    speed: Math.floor(Math.random() * 100),
    explosiveness: Math.floor(Math.random() * 100),
    injuryPrevention: Math.floor(Math.random() * 100),
    smash: Math.floor(Math.random() * 100),
    defense: Math.floor(Math.random() * 100),
    serve: Math.floor(Math.random() * 100),
    stick: Math.floor(Math.random() * 100),
    slice: Math.floor(Math.random() * 100),
    drop: Math.floor(Math.random() * 100),
  },
  stats: {
    endurance: Math.floor(Math.random() * 250),
    strength: Math.floor(Math.random() * 250),
    agility: Math.floor(Math.random() * 250),
    speed: Math.floor(Math.random() * 250),
    explosiveness: Math.floor(Math.random() * 250),
    injuryPrevention: Math.floor(Math.random() * 250),
    smash: Math.floor(Math.random() * 250),
    defense: Math.floor(Math.random() * 250),
    serve: Math.floor(Math.random() * 250),
    stick: Math.floor(Math.random() * 250),
    slice: Math.floor(Math.random() * 250),
    drop: Math.floor(Math.random() * 250),
  },
  equipment: {}
});

const cpuPlayers = Array(16).fill(null).map((_, i) => createCpuPlayer(i + 1));

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'local-1',
    name: 'City Championship',
    tier: 'local',
    status: 'upcoming',
    isQuickTournament: false,
    startDate: Date.now() + 15 * 1000,
    endDate: Date.now() + (25 * 1000),
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
          { id: '1', players: [null, null], completed: false },
          { id: '2', players: [null, null], completed: false }
        ]
      },
      {
        name: "Finale",
        matches: [
          { id: '1', players: [null, null], completed: false }
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
  }, {
    id: 'local-2',
    name: 'Town Championship',
    tier: 'local',
    status: 'upcoming',
    startDate: Date.now() + 1000 * 1000,
    endDate: Date.now() + (24 * 60 * 60 * 1000),
    isQuickTournament: false,
    entryFee: {
      coins: 500,
      shuttlecocks: 10
    },
    prizePool: {
      first: { coins: 20000, diamonds: 5 },
      second: { coins: 10000, diamonds: 2 },
      third: { coins: 5000, diamonds: 1 }
    },
    minPlayerLevel: 1,
    maxParticipants: 16,
    currentParticipants: 15,
    rounds: [
      {
        name: "First de finale",
        matches: [
          {
            id: '1',
            players: [cpuPlayers[0], cpuPlayers[1]],
            completed: false
          },
          {
            id: '2',
            players: [null, cpuPlayers[2]],
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
          },
          {
            id: '5',
            players: [cpuPlayers[7], cpuPlayers[8]],
            completed: false
          },
          {
            id: '6',
            players: [cpuPlayers[9], cpuPlayers[10]],
            completed: false
          },
          {
            id: '7',
            players: [cpuPlayers[11], cpuPlayers[12]],
            completed: false
          },
          {
            id: '8',
            players: [cpuPlayers[13], cpuPlayers[14]],
            completed: false
          },
        ]
      },
      {
        name: "Quarts de finale",
        matches: [
          {
            id: '1',
            players: [null, null],
            completed: false
          },
          {
            id: '2',
            players: [null, null],
            completed: false
          },
          {
            id: '3',
            players: [null, null],
            completed: false
          },
          {
            id: '4',
            players: [null, null],
            completed: false
          }
        ]
      },
      {
        name: "Demi-finales",
        matches: [
          { id: '1', players: [null, null], completed: false },
          { id: '2', players: [null, null], completed: false }
        ]
      },
      {
        name: "Finale",
        matches: [
          { id: '1', players: [null, null], completed: false }
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