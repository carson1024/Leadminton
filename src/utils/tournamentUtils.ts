import { TournamentTier } from '../types/tournament';

export function getTierColor(tier: TournamentTier): string {
  switch (tier) {
    case 'local':
      return 'bg-gray-100 text-gray-800';
    case 'regional':
      return 'bg-green-100 text-green-800';
    case 'national':
      return 'bg-blue-100 text-blue-800';
    case 'international':
      return 'bg-purple-100 text-purple-800';
    case 'premier':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getTierLabel(tier: TournamentTier): string {
  switch (tier) {
    case 'local':
      return 'Local Tournament';
    case 'regional':
      return 'Regional Tournament';
    case 'national':
      return 'National Tournament';
    case 'international':
      return 'International Tournament';
    case 'premier':
      return 'Premier Tournament';
    default:
      return 'Tournament';
  }
}