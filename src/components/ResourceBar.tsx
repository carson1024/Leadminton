import React from 'react';
import { Feather, UtensilsCrossed, Coins, Diamond } from 'lucide-react';
import { Resources } from '../types/game';

interface ResourceBarProps {
  resources: Resources;
}

export default function ResourceBar({ resources }: ResourceBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center space-x-8 z-50">
      <div className="flex items-center space-x-2">
        <Feather className="w-5 h-5 text-blue-500" />
        <span className="font-medium">{resources.shuttlecocks}</span>
      </div>
      <div className="flex items-center space-x-2">
        <UtensilsCrossed className="w-5 h-5 text-green-500" />
        <span className="font-medium">{resources.meals}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="font-medium">{resources.coins}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Diamond className="w-5 h-5 text-purple-500" />
        <span className="font-medium">{resources.diamonds}</span>
      </div>
    </div>
  );
}