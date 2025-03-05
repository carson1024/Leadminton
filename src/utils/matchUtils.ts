import { Player } from '../types/game';

export function generateMatchSummary(
  winner: Player, 
  loser: Player, 
  score: string,
  injuries?: Array<{
    player: Player;
    type: string;
    severity: 'minor' | 'moderate' | 'severe';
  }>
): string[] {
  const summary = [];
  const [set1, set2, set3] = score.split(', ');
  const sets = [set1, set2, set3].filter(Boolean);
  
  // Initial summary
  summary.push(`${winner.name} faced off against ${loser.name} in an intense match.`);
  
  // Analyze each set
  sets.forEach((set, index) => {
    const [winnerScore, loserScore] = set.split('-').map(Number);
    const setNumber = index + 1;
    
    if (winnerScore - loserScore > 5) {
      summary.push(`Set ${setNumber}: A dominant performance with a score of ${set}.`);
      if (winner.stats.smash > 70) {
        summary.push(`${winner.name}'s powerful smashes were unstoppable.`);
      }
    } else if (winnerScore - loserScore <= 2) {
      summary.push(`Set ${setNumber}: A nail-biting set ending ${set}.`);
      if (winner.stats.endurance > loser.stats.endurance) {
        summary.push(`${winner.name}'s superior endurance made the difference.`);
      }
    } else {
      summary.push(`Set ${setNumber}: A solid set victory with ${set}.`);
      if (winner.stats.agility > 65) {
        summary.push(`${winner.name}'s agility on the court was remarkable.`);
      }
    }
  });
  
  // Add technical analysis
  if (winner.stats.serve > 60) {
    summary.push(`${winner.name}'s serves were particularly effective.`);
  }
  if (winner.stats.defense > 65) {
    summary.push(`Some impressive defense shots from ${winner.name}.`);
  }
  
  // Add injury information to the summary
  if (injuries && injuries.length > 0) {
    injuries.forEach(injury => {
      const severityText = {
        minor: 'minor',
        moderate: 'concerning',
        severe: 'serious'
      }[injury.severity];
      
      summary.push(`During the match, ${injury.player.name} suffered a ${severityText} ${injury.type}.`);
    });
  }
  
  // Final summary
  if (sets.length === 2) {
    summary.push(`${winner.name} secured a straight-sets victory.`);
  } else {
    summary.push(`${winner.name} emerged victorious in a full three-set match.`);
  }
  
  return summary;
}