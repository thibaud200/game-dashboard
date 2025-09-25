import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendUp } from '@phosphor-icons/react';
import PlayerStatsPage from './PlayerStatsPage';
import GameStatsPage from './GameStatsPage';
import { Player, Game } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTheme } from '@/theme/ThemeProvider';

interface StatsPageProps {
  players: Player[];
  games: Game[];
  onNavigation: (view: string, id?: number, source?: string) => void;
  _currentView: string;
  selectedPlayerId?: number;
  selectedGameId?: number;
  navigationContext?: {
    id?: number;
    source?: string;
    initialTab?: 'players' | 'games';
  };
}

export default function StatsPage({
  players,
  games,
  onNavigation,
  _currentView,
  selectedPlayerId,
  selectedGameId,
  navigationContext
}: Omit<StatsPageProps, 'darkMode'>) {
  const { darkMode } = useTheme();
  // Determine initial tab based on navigation context
  let initialTab: 'players' | 'games' = 'players';
  if (navigationContext?.initialTab) {
    initialTab = navigationContext.initialTab;
  } else if (selectedGameId || navigationContext?.source === 'games') {
    initialTab = 'games';
  } else if (navigationContext?.source === 'players') {
    initialTab = 'players';
  }

  const [activeTab, setActiveTab] = useState<'players' | 'games'>(initialTab);

  // Update active tab when navigation context changes
  useEffect(() => {
    let newTab: 'players' | 'games' = 'players';
    if (navigationContext?.initialTab) {
      newTab = navigationContext.initialTab;
    } else if (selectedGameId || navigationContext?.source === 'games') {
      newTab = 'games';
    } else if (navigationContext?.source === 'players') {
      newTab = 'players';
    }
    setActiveTab(newTab);
  }, [navigationContext, selectedGameId, selectedPlayerId]);

  const handleBackNavigation = () => {
    // Go back to the appropriate page based on context
    if (navigationContext?.source === 'players') {
      onNavigation('players');
    } else if (navigationContext?.source === 'games') {
      onNavigation('games');
    } else if (selectedPlayerId) {
      onNavigation('players');
    } else if (selectedGameId) {
      onNavigation('games');
    } else {
      onNavigation('dashboard');
    }
  };

  // Classes dynamiques gérées dans les vues enfants
  const mainClass = "min-h-screen";
  const cardClass = "rounded-2xl p-4 border shadow-xl";
  // Styles harmonisés avec GameDetailView
  const tabsListClass = darkMode
    ? "grid w-full grid-cols-2 bg-slate-800/80 border-b-4 border-primary/70 shadow-lg rounded-t-lg overflow-hidden h-16 min-h-[4rem]"
    : "grid w-full grid-cols-2 bg-white border-b-4 border-primary/70 shadow-lg rounded-t-lg overflow-hidden h-16 min-h-[4rem]";
  const tabsTriggerClass = darkMode
    ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white font-semibold border-b-2 border-primary data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-primary/80 data-[state=inactive]:bg-slate-800/70 data-[state=inactive]:text-white/60 px-6 py-4 text-lg flex items-center justify-center gap-2 text-center h-16 min-h-[4rem] leading-tight"
    : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-slate-900 font-semibold border-b-2 border-primary data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-primary/80 data-[state=inactive]:bg-white data-[state=inactive]:text-slate-400 px-6 py-4 text-lg flex items-center justify-center gap-2 text-center h-16 min-h-[4rem] leading-tight";

  return (
    <div className={mainClass}>
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackNavigation}
            className="p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Tab Navigation harmonisée */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value === 'players' ? 'players' : 'games')}
          className="w-full"
        >
          <TabsList className={tabsListClass}>
            <TabsTrigger value="players" className={tabsTriggerClass}>
              <Users className="w-5 h-5" />
              <span>Player Stats</span>
            </TabsTrigger>
            <TabsTrigger value="games" className={tabsTriggerClass} style={{ textAlign: 'center' }}>
              <TrendUp className="w-5 h-5" />
              <span>Game Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content harmonisé */}
          <TabsContent value="players" className="mt-8">
            <div className="px-4 space-y-6 pb-32">
              <div className={cardClass}>
                <PlayerStatsPage
                  players={players}
                  games={games}
                  onNavigation={onNavigation}
                  currentView="player-stats"
                  selectedPlayerId={navigationContext?.source === 'players' ? navigationContext?.id : selectedPlayerId}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="games" className="mt-8">
            <div className="px-4 space-y-6 pb-32">
              <div className={cardClass}>
                <GameStatsPage
                  games={games}
                  players={players}
                  onNavigation={onNavigation}
                  currentView="game-stats"
                  selectedCircleId={navigationContext?.source === 'games' ? navigationContext?.id : selectedGameId}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}