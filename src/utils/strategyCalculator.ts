import { Player, PlayerStrategy } from '../types/game';
import { calculatePlayerScore } from './playerScore';

interface StrategyScore {
  total: number;
  details: {
    physicalScore: number;
    technicalScore: number;
    mentalScore: number;
    styleScore: number;
  };
}

// Calcule l'impact de la stratégie sur les performances du joueur
export function calculateStrategyImpact(player: Player): StrategyScore {
  const { strategy } = player;
  const baseScore = calculatePlayerScore(player);

  // Score physique basé sur l'implication physique et la gestion de fatigue
  const physicalScore = calculatePhysicalScore(strategy, baseScore.details.physicalScore);

  // Score technique basé sur les choix tactiques
  const technicalScore = calculateTechnicalScore(strategy, baseScore.details.technicalScore);

  // Score mental basé sur la résilience et la confiance
  const mentalScore = calculateMentalScore(strategy);

  // Score de style de jeu
  const styleScore = calculateStyleScore(strategy);

  // Score total pondéré
  const total = (
    physicalScore * 0.3 +
    technicalScore * 0.3 +
    mentalScore * 0.2 +
    styleScore * 0.2
  );

  return {
    total,
    details: {
      physicalScore,
      technicalScore,
      mentalScore,
      styleScore,
    },
  };
}

function calculatePhysicalScore(strategy: PlayerStrategy, basePhysicalScore: number): number {
  const commitmentBonus = (strategy.physicalCommitment / 10) * 0.2;
  const fatigueManagementBonus = (strategy.fatigueManagement / 10) * 0.15;
  const movementBonus = (strategy.movementSpeed / 10) * 0.15;

  return basePhysicalScore * (1 + commitmentBonus + fatigueManagementBonus + movementBonus);
}

function calculateTechnicalScore(strategy: PlayerStrategy, baseTechnicalScore: number): number {
  const attackBonus = (strategy.attack / 10) * 0.15;
  const defenseBonus = (strategy.courtDefense / 10) * 0.15;
  const consistencyBonus = (strategy.rallyConsistency / 10) * 0.1;
  const serveBonus = (strategy.serving / 10) * 0.1;

  return baseTechnicalScore * (1 + attackBonus + defenseBonus + consistencyBonus + serveBonus);
}

function calculateMentalScore(strategy: PlayerStrategy): number {
  return (
    strategy.mentalToughness * 0.4 +
    strategy.selfConfidence * 0.4 +
    strategy.riskTaking * 0.2
  ) * 10;
}

function calculateStyleScore(strategy: PlayerStrategy): number {
  // Calculer la cohérence du style de jeu
  const offensiveStats = [strategy.attack, strategy.softAttack, strategy.riskTaking];
  const defensiveStats = [strategy.courtDefense, strategy.rallyConsistency];
  
  const offensiveAverage = offensiveStats.reduce((a, b) => a + b, 0) / offensiveStats.length;
  const defensiveAverage = defensiveStats.reduce((a, b) => a + b, 0) / defensiveStats.length;
  
  // Bonus pour un style de jeu bien défini (soit offensif, soit défensif)
  const styleDifference = Math.abs(offensiveAverage - defensiveAverage);
  const styleBonus = styleDifference * 5; // Plus la différence est grande, plus le style est marqué
  
  return (
    (offensiveAverage + defensiveAverage) * 5 + // Score de base
    styleBonus // Bonus pour un style bien défini
  );
}

// Calcule l'efficacité d'une stratégie contre une autre
export function calculateStrategyMatchup(player1: Player, player2: Player): number {
  const p1Strategy = calculateStrategyImpact(player1);
  const p2Strategy = calculateStrategyImpact(player2);
  
  // Calculer les avantages stratégiques
  const p1Advantage = calculateAdvantage(player1.strategy, player2.strategy);
  const p2Advantage = calculateAdvantage(player2.strategy, player1.strategy);
  
  // Retourner un multiplicateur entre 0.8 et 1.2
  return 1 + ((p1Advantage - p2Advantage) * 0.2);
}

function calculateAdvantage(strategy1: PlayerStrategy, strategy2: PlayerStrategy): number {
  let advantage = 0;
  
  // Avantage offensif vs défensif
  if (strategy1.attack > strategy2.courtDefense) {
    advantage += 0.1;
  }
  
  // Avantage en endurance
  if (strategy1.fatigueManagement > strategy2.fatigueManagement) {
    advantage += 0.05;
  }
  
  // Avantage mental
  if (strategy1.mentalToughness > strategy2.mentalToughness) {
    advantage += 0.05;
  }
  
  // Avantage tactique
  if (strategy1.rallyConsistency > strategy2.riskTaking) {
    advantage += 0.05;
  }
  
  return advantage;
}