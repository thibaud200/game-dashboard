import React from 'react';
import {
  TrendUp,
  Users,
  GameController,
  Gear,
  ChartLineUp
} from '@phosphor-icons/react';

interface BottomNavigationProps {
  currentView: string
  onNavigation: (view: string) => void
  showStats?: boolean
}

export default function BottomNavigation({ currentView, onNavigation, showStats = true }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'dashboard',
      icon: TrendUp,
      label: 'Dashboard'
    },
    {
      id: 'players',
      icon: Users,
      label: 'Players'
    },
    {
      id: 'games',
      icon: GameController,
      label: 'Games'
    }
  ];

  if (showStats) {
    navItems.push({
      id: 'stats',
      icon: ChartLineUp,
      label: 'Stats'
    });
  }

  navItems.push({
    id: 'settings',
    icon: Gear,
    label: 'Settings'
  });

  const handleNavigation = (view: string) => {
    if (view === 'stats') {
      onNavigation('stats');
    } else {
      onNavigation(view);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-white/10">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'stats' && (currentView === 'player-stats' || currentView === 'game-stats' || currentView === 'stats'));
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center p-3 transition-colors ${
                isActive
                  ? 'text-teal-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}