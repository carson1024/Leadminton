import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatBarProps {
  stat: string;
  baseValue: number;
  effectiveValue: number;
  bonus: number;
  Icon: LucideIcon;
  label: string;
  color: string;
  level: number;
  isAffectedByInjury: boolean;
}

export default function StatBar({
  stat,
  baseValue,
  effectiveValue,
  bonus,
  Icon,
  label,
  color,
  level,
  isAffectedByInjury
}: StatBarProps) {
  const totalValue = effectiveValue + bonus;

  return (
    <div className="flex items-center space-x-2">
      <Icon className={`w-4 h-4 ${isAffectedByInjury ? 'text-red-500' : 'text-gray-600'}`} />
      <div className="flex-1">
        <div className="flex justify-between">
          <div className={`text-xs ${isAffectedByInjury ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            {label}
          </div>
          <div className="text-xs text-gray-500">Level {level}</div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
          {/* Base stat bar */}
          <div
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${effectiveValue}%` }}
          />
          {/* Equipment bonus bar */}
          {bonus > 0 && (
            <div
              className="h-full bg-green-500 absolute top-0 left-0 opacity-50"
              style={{ width: `${totalValue}%` }}
            />
          )}
          {/* Original value indicator if injured */}
          {isAffectedByInjury && (
            <div
              className="h-full border-r-2 border-red-400 absolute top-0"
              style={{ left: `${baseValue}%` }}
            />
          )}
        </div>
      </div>
      <div className={`text-sm font-medium ${isAffectedByInjury ? 'text-red-600' : ''}`}>
        {effectiveValue}
        {bonus > 0 && <span className="text-green-600 ml-1">+{bonus}</span>}
        {isAffectedByInjury && <span className="text-gray-400 ml-1">({baseValue})</span>}
      </div>
    </div>
  );
}