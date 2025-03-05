import { LucideIcon } from 'lucide-react';
import { PlayerStats } from './game';

export interface StatConfig {
  stat: keyof PlayerStats;
  icon: LucideIcon;
  label: string;
  color: string;
}