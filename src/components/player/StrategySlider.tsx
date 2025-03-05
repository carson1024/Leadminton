import React from 'react';
import { Info } from 'lucide-react';

interface StrategySliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export default function StrategySlider({
  label,
  description,
  value,
  onChange,
}: StrategySliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">{label}</label>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48">
              {description}
            </div>
          </div>
        </div>
        <span className="text-sm font-medium">{value}/10</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-blue-500 rounded-l-lg pointer-events-none"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}