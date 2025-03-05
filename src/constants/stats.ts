import { 
  Activity, Heart, Zap, Wind, Flame, Shield,
  Swords, Shield as Defense, Rocket, Target, Scissors, Feather
} from 'lucide-react';
import { PlayerStats } from '../types/game';
import { StatConfig } from '../types/stats';

export const PHYSICAL_STATS: StatConfig[] = [
  { stat: 'endurance' as keyof PlayerStats, icon: Heart, label: 'Endurance', color: 'text-red-500' },
  { stat: 'strength' as keyof PlayerStats, icon: Activity, label: 'Strength', color: 'text-orange-500' },
  { stat: 'agility' as keyof PlayerStats, icon: Wind, label: 'Agility', color: 'text-green-500' },
  { stat: 'speed' as keyof PlayerStats, icon: Zap, label: 'Speed', color: 'text-yellow-500' },
  { stat: 'explosiveness' as keyof PlayerStats, icon: Flame, label: 'Explosiveness', color: 'text-purple-500' },
  { stat: 'injuryPrevention' as keyof PlayerStats, icon: Shield, label: 'Injury Prevention', color: 'text-blue-500' },
];

export const TECHNICAL_STATS: StatConfig[] = [
  { stat: 'smash' as keyof PlayerStats, icon: Swords, label: 'Smash', color: 'text-red-500' },
  { stat: 'defense' as keyof PlayerStats, icon: Defense, label: 'Defense', color: 'text-orange-500' },
  { stat: 'serve' as keyof PlayerStats, icon: Rocket, label: 'Serve', color: 'text-green-500' },
  { stat: 'stick' as keyof PlayerStats, icon: Target, label: 'Stick', color: 'text-yellow-500' },
  { stat: 'slice' as keyof PlayerStats, icon: Scissors, label: 'Slice', color: 'text-purple-500' },
  { stat: 'drop' as keyof PlayerStats, icon: Feather, label: 'Drop Shot', color: 'text-blue-500' },
];