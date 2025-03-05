import React from 'react';
import { Layout, Users, Trophy, Building2, ShoppingBag, Swords, Flag } from 'lucide-react';

interface NavigationProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  onOpenShop: () => void;
}

export default function Navigation({ selectedSection, onSectionChange, onOpenShop }: NavigationProps) {
  const sections = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'club', icon: Users, label: 'My Club' },
    { id: 'tournaments', icon: Trophy, label: 'Tournaments' },
    { id: 'quick-match', icon: Swords, label: 'Quick Match' },
    { id: 'interclub', icon: Flag, label: 'Interclubs' },
    { id: 'facilities', icon: Building2, label: 'Facilities' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="flex justify-around max-w-2xl mx-auto">
        {sections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              selectedSection === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm mt-1">{label}</span>
          </button>
        ))}
        <button
          onClick={onOpenShop}
          className="flex flex-col items-center p-2 rounded-lg transition-colors text-purple-600 hover:bg-purple-50"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-sm mt-1">Shop</span>
        </button>
      </div>
    </nav>
  );
}