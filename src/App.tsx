import React, { useState, useEffect } from 'react';
import PlayersPage from '@/components/PlayersPa
import SettingsPage from '@/components/SettingsPage
import NewGamePage from '@/components/NewGamePa
import GameExpansionsPage from '@/components/GameExpa
import BottomNavigation from '@/components/Bott
import { Player, Game } from '@/types';
// Mock data (extended with all required fields)
  playersCount: 426,
  players: [
      player_id: 1,
      avatar: 'https://images.unsplash.com/photo-149479010
      games_played: 15,

      created_at: new Date(),
    },
      player_id: 2,
      avatar: 'htt
      games_
     
      created_at: n
    },
      player_id: 3,
      avatar: 'https://im
      games_played: 10,
      total_sc
      created_at: new Da
    }
  games: [
      game_id: 1,
      
     
      duration: '90
      category: 'Strategy',
      publisher: 'Game Co',
      bgg_rating: 7.5,
      age_min: 12,
      supports
      supports_hybrid: f
      has_characters: fal
      expansions: [],
      players: '2-4'
    {
     
      image: 'https
      max_players: 6,
      difficulty: 'Easy',
      year_published: 201
      designer: 'Jane S
      weight: 
      supports_cooperati
      supports_campaign: 
      has_expansion: false,
      created_at: new Date(),
     
    
      game
     
      min_players
      duration: '30-45 minu
      category: 'Puzzle',
      publisher: 'Mind Co',
      bgg_rating: 8.2
      age_min: 14,
      supports_competitive: true,
      supports_hybrid: true
      has_characters: false
      expansions: [],
      players: '2-8'
    {
      name: 'Pandemic 
      image: 'http
      max_players:
      difficulty: 'Medium',
      year_published: 2015,
      designer: 'Matt Leacock',
      weight: 2.8,
      supports_cooperative
      supports_campaign: tru
      has_expansion: true,
      created_at: new
      characters: [],
    }
};
expor
    playersCount:
    loading: true,
  });
  const [games, setGames] = useState<Game[]>([]);
  const [navigationCo
  useEffect(() => {
    setTimeout(() => {
        playersCount: moc
        loading: false,
      });
      setGames(mockData.games);
  }, []);
  const handleNavigati
    
    if (view === '
      let initialTab: 'players' | 
        initialTab = 'games';
        initialTab = 'players';
      setNavigationContext({ 
      setNavigationContext(
  };
  // Handler functions for da
    const newPlayer: 
      player_id: Math
      games_played: 
      
     
    setPlayers([.

    setPlayers((players || []).map(p => p.p

    setPlayers((playe

    const newGame: Game = {
      game_id: Math.max(.
      expansions: [],
      players: `${gameData.
    setGames([...(games || 

    setGames((games ||

    setGames((game

    // Implementation for creatin
  };
  const renderCurrentView = 
      case 'dashboard':
          <Dashboard
            recentPlayers={pl
            currentVi
          />
      case 'players'
      
     
            onUpd
            currentView={curre
        );
        return (
            games={ga
            onAddGame
            onDeleteGame={handle
        );
        return <SettingsPage o
      case 'game-stats':
        return (
            players={players} 
            currentVie
            select
            naviga
        );
      case 'new-game':
          <NewGamePage
            players={players}
            onNavigation={
          />
      case 'game-detail': {
        return game ?
            game={gam
            onNaviga
     
   
  

            navigationSource={n
            onUpdateExpansion={async (
          />
      }
        const char
          <Game
     
            onAddCharacter={async () => ({ character_id
            onDeleteCharacter={async () => {}}
        ) : null;
      default:

            recentP
            currentView={cur
          />
    }

    return (
        <div className=
    );

    <TooltipProvider>
        {renderCurrentView()}
      </div>
  );
































































































































































































