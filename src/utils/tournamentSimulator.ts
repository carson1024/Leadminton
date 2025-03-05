import { Player } from '../types/game';
import { calculatePlayerStrength } from './playerUtils';
import { generateMatchSummary } from './matchUtils';
import { checkForInjury } from './injuryUtils';
import { generateRandomName } from './nameGenerator';
import { generateInitialStrategy } from './initialState';

function createCpuOpponent(playerLevel: number): Player {
  return {
    id: `cpu-${Date.now()}`,
    name: generateRandomName('male'),
    level: playerLevel,
    maxLevel: playerLevel + 10,
    stats: {
      endurance: Math.floor(Math.random() * 20) + 40,
      strength: Math.floor(Math.random() * 20) + 40,
      agility: Math.floor(Math.random() * 20) + 40,
      speed: Math.floor(Math.random() * 20) + 40,
      explosiveness: Math.floor(Math.random() * 20) + 40,
      injuryPrevention: Math.floor(Math.random() * 20) + 40,
      smash: Math.floor(Math.random() * 20) + 40,
      defense: Math.floor(Math.random() * 20) + 40,
      serve: Math.floor(Math.random() * 20) + 40,
      stick: Math.floor(Math.random() * 20) + 40,
      slice: Math.floor(Math.random() * 20) + 40,
      drop: Math.floor(Math.random() * 20) + 40,
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
    rank: 12,
    training: undefined,
    strategy: generateInitialStrategy(),
    equipment: {},
    injuries: []
  };
}

/**
 * Simulate match againt two players
 * @param player1 
 * @param player2 
 * @returns 
 */
export function simulateMatch(player1: Player, player2: Player) {
  const player1Strength = calculatePlayerStrength(player1);
  const player2Strength = calculatePlayerStrength(player2);
  
  const totalStrength = player1Strength + player2Strength;
  const player1WinProbability = player1Strength / totalStrength;
  
  const sets = [0, 0];
  const points = [];
  
  // Simulate 3 sets
  for (let set = 0; set < 3; set++) {
    let player1Points = 0;
    let player2Points = 0;
    
    // Count random win points of players
    while ((player1Points < 21 && player2Points < 21) || Math.abs(player1Points - player2Points) < 2) {
      if (Math.random() < player1WinProbability) {
        player1Points++;
      } else {
        player2Points++;
      }
    }
    
    points.push(`${player1Points}-${player2Points}`);
    if (player1Points > player2Points) {
      sets[0]++;
    } else {
      sets[1]++;
    }
    
    // if one player wins twice, finish match
    if (sets[0] === 2 || sets[1] === 2) break;
  }
  
  const winner = sets[0] > sets[1] ? player1 : player2;
  const loser = sets[0] > sets[1] ? player2 : player1;
  const score = points.join(', ');
  
  // Increase the chances of injury for the loser
  const injury = checkForInjury(player1);
  console.log('Match result:', { winner: winner.name, injury });

  return {
    players: [player1, player2],
    winner,
    loser,
    score,
    summary: generateMatchSummary(winner, loser, score),
    newInjury: injury
  };
}

/**
 * Simulate match player vs cpu
 * @param player 
 * @returns 
 */
export function simulateQuickTournament(player: Player) {
  // create random player
  const cpuOpponent = createCpuOpponent(player.level);
  return simulateMatch(player, cpuOpponent);
}