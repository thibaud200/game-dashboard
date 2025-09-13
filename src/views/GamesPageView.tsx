import React from 'react';
import {
  Star,
  Plus,
  ArrowLeft,
  MagnifyingGlass,
  Trash,
  Users,
  PencilSimple,
  Eye,
  Clock,
  Target,
  Calendar,
  Shield,
  Sword,
  Crown,
  CaretDown,
  CaretUp,
  ChartLineUp,
  DotsThree
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Game } from '@/types';
import { AddGameDialog, EditGameDialog, DeleteGameDialog } from '@/components/dialogs';

interface GamesPageViewProps {
  // Data
  games: Game[];
  currentView: string;
  totalGames: number;
  averageRating: number;
  
  // Form state
  formData: any;
  editingGame: Game | null;
  
  // Dialog state
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isBGGSearchOpen: boolean;
  expandedGame: number | null;
  
  // Search and filters
  searchQuery: string;
  
  // Handlers
  onNavigation: (view: string, gameId?: number, source?: string) => void;
  onSearchChange: (query: string) => void;
  onAddDialogToggle: () => void;
  onFormDataChange: (data: any) => void;
  onBGGGameSelect: (bggGame: any) => void;
  onAddGame: () => void;
  onResetForm: () => void;
  onEditGame: (game: Game) => void;
  onUpdateGame: () => void;
  onDeleteGame: (gameId: number) => void;
  setBGGSearchOpen: (open: boolean) => void;
  setExpandedGame: (gameId: number | null) => void;
  setEditDialogOpen: (open: boolean) => void;
}

export default function GamesPageView({
  games,
  currentView,
  totalGames,
  averageRating,
  formData,
  editingGame,
  isAddDialogOpen,
  isEditDialogOpen,
  isBGGSearchOpen,
  expandedGame,
  searchQuery,
  onNavigation,
  onSearchChange,
  onAddDialogToggle,
  onFormDataChange,
  onBGGGameSelect,
  onAddGame,
  onResetForm,
  onEditGame,
  onUpdateGame,
  onDeleteGame,
  setBGGSearchOpen,
  setExpandedGame,
  setEditDialogOpen
}: GamesPageViewProps) {
  
  // Safety check for games array
  const safeGames = games || [];
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'expert': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getGameModesBadges = (game: Game): React.ReactElement[] => {
    const modes: React.ReactElement[] = [];
    
    if (game.supports_competitive) {
      modes.push(
        <Badge key="competitive" variant="outline" className="border-red-400/30 text-red-400 text-xs">
          <Sword className="w-3 h-3 mr-1" />
          Compétitif
        </Badge>
      );
    }
    
    if (game.supports_cooperative) {
      modes.push(
        <Badge key="cooperative" variant="outline" className="border-blue-400/30 text-blue-400 text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Coopératif
        </Badge>
      );
    }
    
    if (game.supports_campaign) {
      modes.push(
        <Badge key="campaign" variant="outline" className="border-purple-400/30 text-purple-400 text-xs">
          <Crown className="w-3 h-3 mr-1" />
          Campagne
        </Badge>
      );
    }
    
    if (game.supports_hybrid) {
      modes.push(
        <Badge key="hybrid" variant="outline" className="border-orange-400/30 text-orange-400 text-xs">
          <Target className="w-3 h-3 mr-1" />
          Hybride
        </Badge>
      );
    }
    
    return modes;
  };

  const getWeightStars = (weight: number) => {
    const stars = Math.round(weight);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onNavigation('dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Dashboard</p>
            </TooltipContent>
          </Tooltip>
          <h1 className="text-2xl font-bold">Games</h1>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onNavigation('game-stats')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChartLineUp className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Game Stats</p>
              </TooltipContent>
            </Tooltip>
            
            <AddGameDialog
              isOpen={isAddDialogOpen}
              onOpenChange={onAddDialogToggle}
              formData={formData}
              onFormDataChange={onFormDataChange}
              onBGGGameSelect={onBGGGameSelect}
              onAddGame={onAddGame}
              onResetForm={onResetForm}
              isBGGSearchOpen={isBGGSearchOpen}
              onBGGSearchToggle={setBGGSearchOpen}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={onAddDialogToggle}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Game</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games, designers, publishers..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Games Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-emerald-400">{totalGames}</div>
            <div className="text-xs text-white/80">Total Games</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-400">
              {[...new Set(safeGames.map(g => g.category || 'Unknown'))].length}
            </div>
            <div className="text-xs text-white/80">Categories</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-400">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-white/80">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 pb-32">
        <div className="grid grid-cols-1 gap-4">
          {safeGames.map((game) => (
            <Card key={game.game_id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-l-lg flex-shrink-0"
                  />
                  <div className="flex-1 p-3 sm:p-4 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-white mb-1 truncate">{game.name}</h3>
                        <p className="text-sm text-white/70 mb-2 line-clamp-2">{game.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-teal-600/20 text-teal-300 text-xs">
                            {game.category}
                          </Badge>
                          {getGameModesBadges(game).map((badge, index) => (
                            <React.Fragment key={index}>
                              {badge}
                            </React.Fragment>
                          ))}
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            {game.min_players === game.max_players ? `${game.min_players}` : `${game.min_players}-${game.max_players}`} players
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {game.duration}
                          </Badge>
                          <Badge variant="outline" className={`border-white/20 text-xs ${getDifficultyColor(game.difficulty)}`}>
                            <Target className="w-3 h-3 mr-1" />
                            {game.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/60">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{game.year_published}</span>
                            </span>
                            {game.bgg_rating > 0 && (
                              <span className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span>{game.bgg_rating.toFixed(1)}</span>
                              </span>
                            )}
                            {game.weight > 0 && (
                              <div className="flex items-center space-x-1">
                                <span>Weight:</span>
                                <div className="flex">
                                  {getWeightStars(game.weight)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {(game.designer !== 'Unknown' || game.publisher !== 'Unknown') && (
                          <div className="mt-1 text-xs text-white/50">
                            {game.designer !== 'Unknown' && `By ${game.designer}`}
                            {game.designer !== 'Unknown' && game.publisher !== 'Unknown' && ' • '}
                            {game.publisher !== 'Unknown' && game.publisher}
                          </div>
                        )}
                        
                        {/* Expansions and Characters Preview */}
                        {(game.expansions?.length > 0 || game.characters?.length > 0) && (
                          <div className="mt-2 flex items-center space-x-2 text-xs">
                            {game.expansions?.length > 0 && (
                              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                                {game.expansions.length} expansion{game.expansions.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {game.characters?.length > 0 && (
                              <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                                {game.characters.length} character{game.characters.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedGame(expandedGame === game.game_id ? null : game.game_id);
                              }}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              {expandedGame === game.game_id ? (
                                <CaretUp className="w-4 h-4" />
                              ) : (
                                <CaretDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        )}
                        
                        {/* Expanded Details */}
                        {expandedGame === game.game_id && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                            {game.expansions && game.expansions.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-purple-300 mb-1">Expansions</h4>
                                <Textarea
                                  value={(game.expansions || []).map(exp => 
                                    `${exp.name}${exp.year_published > 0 ? ` (${exp.year_published})` : ''}`
                                  ).join(', ')}
                                  onChange={(e) => {
                                    const expansionTexts = e.target.value.split(',').map(text => text.trim()).filter(text => text);
                                    const parsedExpansions = expansionTexts.map((text, index) => {
                                      const match = text.match(/^(.+?)\s*\((\d{4})\)$/);
                                      if (match) {
                                        return {
                                          expansion_id: `exp_${index}`,
                                          game_id: game.game_id,
                                          name: match[1].trim(),
                                          year_published: parseInt(match[2]),
                                          description: '',
                                          bgg_expansion_id: 0
                                        };
                                      } else {
                                        return {
                                          expansion_id: `exp_${index}`,
                                          game_id: game.game_id,
                                          name: text,
                                          year_published: 0,
                                          description: '',
                                          bgg_expansion_id: 0
                                        };
                                      }
                                    });
                                    
                                    // This should be handled by parent component
                                    // onUpdateGame(game.game_id, { ...game, expansions: parsedExpansions });
                                  }}
                                  placeholder="Format: Extension 1 (2023), Extension 2 (2024), ..."
                                  className="min-h-[60px] bg-white/5 border-white/10 text-white text-xs resize-none"
                                />
                              </div>
                            )}
                            
                            {game.characters && game.characters.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-orange-300 mb-1">Characters/Roles</h4>
                                <div className="space-y-1">
                                  {(game.characters || []).map((character) => (
                                    <div key={character.character_key} className="text-xs text-white/70 bg-white/5 rounded p-2">
                                      <div className="font-medium">{character.name}</div>
                                      {character.description && (
                                        <div className="text-white/50 mb-1">{character.description}</div>
                                      )}
                                      {character.abilities && character.abilities.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {character.abilities.filter(ability => ability.trim()).map((ability, index) => (
                                            <Badge 
                                              key={index}
                                              variant="outline" 
                                              className="border-orange-500/30 text-orange-200 text-xs h-5"
                                            >
                                              {ability}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions - Desktop buttons / Mobile contextual menu */}
                      <div className="ml-2 flex-shrink-0">
                        {/* Desktop Actions - Direct buttons */}
                        <div className="hidden sm:flex items-center space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => onNavigation('game-detail', game.game_id, 'games')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                aria-label="View game details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => onNavigation('game-stats', game.game_id)}
                                className="p-2 hover:bg-teal-500/20 rounded-lg transition-colors text-teal-400 hover:text-teal-300"
                                aria-label="View game stats"
                              >
                                <ChartLineUp className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Game Stats</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => onEditGame(game)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                aria-label="Edit game"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Game</p>
                            </TooltipContent>
                          </Tooltip>
                          <DeleteGameDialog
                            game={game}
                            onDeleteGame={onDeleteGame}
                            trigger={
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                    aria-label="Delete game"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Game</p>
                                </TooltipContent>
                              </Tooltip>
                            }
                          />
                        </div>

                        {/* Mobile Actions - Contextual menu */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button 
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 border border-white/20 shadow-lg"
                                aria-label="Game options menu"
                              >
                                <DotsThree className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                              <DropdownMenuItem 
                                onClick={() => onNavigation('game-detail', game.game_id, 'games')}
                                className="hover:bg-slate-700 cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onNavigation('game-stats', game.game_id)}
                                className="hover:bg-teal-500/20 cursor-pointer text-teal-400"
                              >
                                <ChartLineUp className="w-4 h-4 mr-2" />
                                View Stats
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onEditGame(game)}
                                className="hover:bg-slate-700 cursor-pointer"
                              >
                                <PencilSimple className="w-4 h-4 mr-2" />
                                Edit Game
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onNavigation('game-expansions', game.game_id, 'games')}
                                className="hover:bg-slate-700 cursor-pointer"
                              >
                                <Crown className="w-4 h-4 mr-2" />
                                Manage Expansions
                              </DropdownMenuItem>
                              {(game.has_characters || game.characters?.length > 0) && (
                                <DropdownMenuItem 
                                  onClick={() => onNavigation('game-characters', game.game_id, 'games')}
                                  className="hover:bg-slate-700 cursor-pointer"
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  Manage Characters
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-slate-600" />
                              <DeleteGameDialog
                                game={game}
                                onDeleteGame={onDeleteGame}
                                trigger={
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="hover:bg-red-500/20 cursor-pointer text-red-400"
                                  >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Delete Game
                                  </DropdownMenuItem>
                                }
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {games.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No games found</p>
          </div>
        )}
      </div>

      {/* Edit Game Dialog */}
      <EditGameDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingGame={editingGame}
        formData={formData}
        onFormDataChange={onFormDataChange}
        onUpdateGame={onUpdateGame}
        onResetForm={() => {
          onResetForm();
        }}
      />

    </div>
  );
}