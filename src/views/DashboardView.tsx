import React from 'react';
// Annulation de l'import Button
import {
  Users,
  GameController,
  TrendUp,
  Gear,
  Plus,
  Play,
  ArrowLeft
} from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Player, Game, NavigationHandler } from '@/types';

interface DashboardViewProps {
  stats: {
    playersCount: number,
    gamesCount: number,
    loading: boolean,
    error: null | string
  },
  recentPlayers: Player[],
  recentGames: Game[],
  currentView: string,
  hasPlayers: boolean,
  hasGames: boolean,
  handleBackClick: () => void,
  handleSettingsClick: () => void,
  handlePlayersClick: () => void,
  handleGamesClick: () => void,
  handlePlayerStatsClick: (playerId: number) => void,
  handleGameStatsClick: (gameId: number) => void,
  handleNewGameClick: () => void,
  handleActivityClick: () => void,
  onNavigation: NavigationHandler,
  darkMode: boolean
}

export function DashboardView({
  stats,
  recentPlayers,
  recentGames,
  hasPlayers,
  hasGames,
  handleBackClick,
  handleSettingsClick,
  handlePlayersClick,
  handleGamesClick,
  handlePlayerStatsClick,
  handleGameStatsClick,
  handleNewGameClick,
  handleActivityClick,
  onNavigation: _onNavigation,
  darkMode
}: DashboardViewProps) {
  // Classes dynamiques
  const mainClass = darkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white"
    : "min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900";
  // Classes dynamiques pour cards, titres, textes
  const cardClass = darkMode
    ? "bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl"
    : "bg-white rounded-2xl p-4 border border-slate-300 shadow-xl";
  const titleClass = darkMode
    ? "text-lg font-semibold text-white"
    : "text-lg font-semibold text-slate-900";
  const labelClass = darkMode
    ? "font-medium text-white"
    : "font-medium text-slate-900";
  const descClass = darkMode
    ? "text-white/60 text-sm"
    : "text-slate-500 text-sm";

  return (
    <div className={mainClass}>
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go Back</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSettingsClick}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Gear className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Stats circulaires */}
        <div className="flex justify-center space-x-8 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlayersClick}
                className="group relative"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-xs text-white/80">Players</div>
                    <div className="text-lg font-bold text-white">
                      {stats.playersCount}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View All Players</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleGamesClick}
                className="group relative"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-xs text-white/80">Games</div>
                    <div className="text-lg font-bold text-white">
                      {stats.gamesCount}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View All Games</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 space-y-6 pb-32">
        {/* Section Joueurs */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={titleClass}>Player Statistics</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePlayersClick}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <TrendUp className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View All Players</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {hasPlayers ? (
              recentPlayers.map((player) => (
                <button
                  key={player.player_id}
                  onClick={() => handlePlayerStatsClick(player.player_id)}
                  className="group w-full"
                >
                  <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 hover:shadow-lg hover:scale-105">
                    <img
                      src={player.avatar}
                      alt={player.player_name}
                      className="w-8 h-8 rounded-full mb-2 mx-auto object-cover"
                    />
                    <div className="text-center">
                      <div className={labelClass + " truncate"}>
                        {player.player_name}
                      </div>
                      <div className={descClass}>{player.stats}</div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-4">
                <div className={descClass}>No players yet</div>
                <button
                  onClick={handlePlayersClick}
                  className="text-teal-400 hover:text-teal-300 text-sm mt-1 transition-colors"
                >
                  Add your first player
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Jeux récents */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={titleClass}>Recent Games</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleGamesClick}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <GameController className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View All Games</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {hasGames ? (
              recentGames.map((game) => (
                <button
                  key={game.game_id}
                  onClick={() => handleGameStatsClick(game.game_id)}
                  className="group w-full"
                >
                  <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 hover:shadow-lg hover:scale-105">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-16 object-cover"
                    />
                    <div className="p-2">
                      <div className={labelClass + " truncate"}>
                        {game.name}
                      </div>
                      <div className={descClass}>
                        {game.players} players
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center py-4">
                <div className={descClass}>No games yet</div>
                <button
                  onClick={handleGamesClick}
                  className="text-teal-400 hover:text-teal-300 text-sm mt-1 transition-colors"
                >
                  Add your first game
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={cardClass}>
          <h2 className={titleClass + " mb-4"}>Recent Activity</h2>
          <div className="space-y-3">
            <button
              onClick={handleActivityClick}
              className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className={labelClass}>New game started</div>
                <div className={descClass}>5 minutes ago</div>
              </div>
            </button>
            <button
              onClick={handleActivityClick}
              className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className={labelClass}>Player joined</div>
                <div className={descClass}>12 minutes ago</div>
              </div>
            </button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNewGameClick}
                className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 flex flex-col items-center justify-center hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Play className="w-8 h-8 mb-2" />
                <span className="font-medium">New Game</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a New Game Session</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePlayersClick}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">Add Player</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Players Page</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}