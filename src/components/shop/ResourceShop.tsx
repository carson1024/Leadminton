import React, { useState } from 'react';
import { ShoppingBag, X, Diamond, Shirt, Crown, Coins, Feather, UtensilsCrossed } from 'lucide-react';
import { Resources } from '../../types/game';
import { useGame } from '@/contexts/GameContext';

interface ResourceShopProps {
  onClose: () => void;
}

const FEATURED_PACKS = [
  {
    id: 'specialist-pack',
    name: 'Pack Diamants + Spécialiste',
    description: 'Obtenez 1000 diamants et débloquez un spécialiste exclusif',
    price: '89€',
    originalPrice: '99€',
    icon: Diamond,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:bg-purple-600'
  },
  {
    id: 'tshirt-pack',
    name: 'T-Shirt Officiel',
    description: 'T-shirt exclusif du jeu + 500 diamants offerts',
    price: '79€',
    icon: Shirt,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:bg-blue-600'
  },
  {
    id: 'master-pack',
    name: 'Master Gem Pack',
    description: 'Pack ultime avec 5000 diamants et bonus exclusifs',
    price: '299€',
    originalPrice: '399€',
    icon: Crown,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
    hoverColor: 'hover:bg-yellow-600'
  }
];

const DIAMOND_PACKS = [
  { id: 'diamonds-1', amount: 100, price: '9€', color: 'bg-purple-500' },
  { id: 'diamonds-2', amount: 250, price: '19€', color: 'bg-purple-500' },
  { id: 'diamonds-3', amount: 650, price: '49€', color: 'bg-purple-500' },
  { id: 'diamonds-4', amount: 1400, price: '79€', color: 'bg-purple-500' },
  { id: 'diamonds-5', amount: 3000, price: '149€', color: 'bg-purple-500' },
  { id: 'diamonds-6', amount: 7000, price: '299€', color: 'bg-purple-500' }
];

const RESOURCE_PRICES = {
  shuttlecocks: {
    icon: Feather,
    color: 'text-blue-500',
    packs: [
      { amount: 50, cost: 1 },
      { amount: 150, cost: 2 },
      { amount: 500, cost: 5 },
      { amount: 1000, cost: 8 }
    ]
  },
  meals: {
    icon: UtensilsCrossed,
    color: 'text-green-500',
    packs: [
      { amount: 30, cost: 1 },
      { amount: 100, cost: 2 },
      { amount: 300, cost: 5 },
      { amount: 600, cost: 8 }
    ]
  },
  coins: {
    icon: Coins,
    color: 'text-yellow-500',
    packs: [
      { amount: 1000, cost: 1 },
      { amount: 3000, cost: 2 },
      { amount: 10000, cost: 5 },
      { amount: 25000, cost: 10 }
    ]
  }
};

type ShopTab = 'main' | 'resources';

export default function ResourceShop({ onClose }: ResourceShopProps) {

  const { resources, purchaseResources } = useGame();
  const [activeTab, setActiveTab] = useState<ShopTab>('main');

  const renderMainShop = () => (
    <>
      {/* Featured Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {FEATURED_PACKS.map((pack) => (
          <div 
            key={pack.id}
            className={`relative border ${pack.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}
          >
            {pack.originalPrice && (
              <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                -25%
              </div>
            )}
            <div className={`w-12 h-12 ${pack.color} rounded-lg flex items-center justify-center mb-4`}>
              <pack.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">{pack.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold">{pack.price}</span>
              {pack.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{pack.originalPrice}</span>
              )}
            </div>
            <button 
              className={`mt-4 w-full py-2 ${pack.color} text-white rounded-lg ${pack.hoverColor} transition-colors`}
            >
              Acheter
            </button>
          </div>
        ))}
      </div>

      {/* Diamond Packs */}
      <h3 className="text-xl font-bold mb-6">Packs de Diamants</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {DIAMOND_PACKS.map((pack) => (
          <div 
            key={pack.id}
            className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center mb-3">
              <Diamond className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg mb-1">{pack.amount}</div>
              <div className="text-gray-600 text-sm mb-3">Diamants</div>
              <button className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                {pack.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderResourceShop = () => (
    <div className="space-y-8">
      {Object.entries(RESOURCE_PRICES).map(([resource, { icon: Icon, color, packs }]) => (
        <div key={resource} className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icon className={`w-6 h-6 ${color}`} />
            <h3 className="text-lg font-bold capitalize">{resource}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {packs.map(({ amount, cost }, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-3">
                  <div className="font-bold text-xl mb-1">{amount}</div>
                  <div className="text-sm text-gray-600 capitalize">{resource}</div>
                </div>
                <button
                  onClick={() => purchaseResources(resource as keyof Omit<Resources, 'diamonds'>, amount, cost)}
                  disabled={resources.diamonds < cost}
                  className={`w-full py-2 rounded-lg flex items-center justify-center space-x-2 ${
                    resources.diamonds >= cost
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{cost}</span>
                  <Diamond className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center text-sm text-gray-600 bg-purple-50 p-4 rounded-lg">
        Vos diamants disponibles: <span className="font-bold">{resources.diamonds}</span> 💎
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-purple-500" />
            <h2 className="text-2xl font-bold">Boutique</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'main'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Boutique
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'resources'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ressources
          </button>
        </div>

        {activeTab === 'main' ? renderMainShop() : renderResourceShop()}
      </div>
    </div>
  );
}