import React, { useState } from 'react';
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
import { Game, GameExpansion, GameCharacter } from '@/types';
import { BGGGame } from '@/services/bggApi';
import BottomNavigation from './BottomNavigation';
import AddGameDialog from '@/components/games/AddGameDialog';
import EditGameDialog from '@/components/games/EditGameDialog';
import DeleteGameDialog from '@/components/games/DeleteGameDialog';

interface FormData {
  name: string
  image: string
  min_players: number
  max_players: number
  description: string
  duration: string
  difficulty: string
  category: string
  year_published: number
  publisher: string
  designer: string
  bgg_rating: number
  weight: number
  age_min: number
  expansions: GameExpansion[]
  characters: GameCharacter[]
  has_expansion: boolean
  has_characters: boolean
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean
  bgg_id?: number
}

interface GamesPageProps {
  games: Game[]
  onNavigation: (view: string, gameId?: number, source?: string) => void
  onAddGame: (game: Omit<Game, 'game_id' | 'players'>) => void
  onUpdateGame: (gameId: number, game: Partial<Game>) => void
  onDeleteGame: (gameId: number) => void
  onAddExpansion?: (gameId: number, expansion: any) => void
  onUpdateExpansion?: (expansionId: number, expansion: any) => void
  onDeleteExpansion?: (expansionId: number) => void
  onAddCharacter?: (gameId: number, character: any) => void
  onUpdateCharacter?: (characterId: number, character: any) => void
  onDeleteCharacter?: (characterId: number) => void
  currentView?: string
}

export default function GamesPage({ 
  games, 
  onNavigation, 
  onAddGame, 
  onUpdateGame,
  onDeleteGame,
  onAddExpansion,
  onUpdateExpansion,
  onDeleteExpansion,
  currentView = 'games'
}: GamesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBGGSearchOpen, setIsBGGSearchOpen] = useState(false);
  const [expandedGame, setExpandedGame] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    image: '',
    min_players: 2,
    max_players: 4,
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    year_published: new Date().getFullYear(),
    publisher: '',
    designer: '',
    bgg_rating: 0,
    weight: 0,
    age_min: 8,
    expansions: [],
    characters: [],
    has_expansion: false,
    has_characters: false,
    supports_cooperative: false,
    supports_competitive: true,
    supports_campaign: false,
    supports_hybrid: false,
    bgg_id: undefined
  });

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      min_players: 2,
      max_players: 4,
      description: '',
      duration: '',
      difficulty: 'Beginner',
      category: '',
      year_published: new Date().getFullYear(),
      publisher: '',
      designer: '',
      bgg_rating: 0,
      weight: 0,
      age_min: 8,
      expansions: [],
      characters: [],
      has_expansion: false,
      has_characters: false,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: false,
      bgg_id: undefined
    });
  };

  const handleBGGGameSelect = (bggGame: BGGGame) => {
    setFormData({
      name: bggGame.name,
      image: bggGame.image,
      min_players: bggGame.min_players,
      max_players: bggGame.max_players,
      description: bggGame.description,
      duration: `${bggGame.min_playtime}-${bggGame.max_playtime} min`,
      difficulty: bggGame.weight > 3.5 ? 'Expert' : bggGame.weight > 2.5 ? 'Intermediate' : 'Beginner',
      category: bggGame.categories[0] || 'General',
      year_published: bggGame.year_published,
      publisher: bggGame.publishers[0] || 'Unknown',
      designer: bggGame.designers[0] || 'Unknown',
      bgg_rating: bggGame.rating,
      weight: bggGame.weight,
      age_min: bggGame.min_age,
      expansions: bggGame.expansions,
      characters: bggGame.characters,
      has_expansion: bggGame.expansions.length > 0,
      has_characters: bggGame.characters.length > 0,
      supports_cooperative: bggGame.supports_cooperative,
      supports_competitive: bggGame.supports_competitive,
      supports_campaign: bggGame.supports_campaign,
      supports_hybrid: bggGame.supports_hybrid,
      bgg_id: bggGame.id
    });
    setIsBGGSearchOpen(false);
  };

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleAddGame = () => {
    if (formData.name.trim()) {
      const now = new Date();
      onAddGame({
        name: formData.name,
        image: formData.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
        min_players: formData.min_players,
        max_players: formData.max_players,
        description: formData.description || 'A fun board game experience.',
        duration: formData.duration || '30-60 min',
        difficulty: formData.difficulty,
        category: formData.category || 'General',
        year_published: formData.year_published,
        publisher: formData.publisher || 'Unknown',
        designer: formData.designer || 'Unknown',
        bgg_rating: formData.bgg_rating,
        weight: formData.weight,
        age_min: formData.age_min,
        expansions: formData.expansions,
        characters: formData.characters,
        has_expansion: formData.has_expansion,
        has_characters: formData.has_characters,
        supports_cooperative: formData.supports_cooperative,
        supports_competitive: formData.supports_competitive,
        supports_campaign: formData.supports_campaign,
        supports_hybrid: formData.supports_hybrid,
        bgg_id: formData.bgg_id,
        created_at: now
      });
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      image: game.image,
      min_players: game.min_players,
      max_players: game.max_players,
      description: game.description,
      duration: game.duration,
      difficulty: game.difficulty,
      category: game.category,
      year_published: game.year_published,
      publisher: game.publisher,
      designer: game.designer,
      bgg_rating: game.bgg_rating,
      weight: game.weight,
      age_min: game.age_min,
      expansions: game.expansions || [],
      characters: game.characters || [],
      has_expansion: game.has_expansion || false,
      has_characters: game.has_characters || false,
      supports_cooperative: game.supports_cooperative || false,
      supports_competitive: game.supports_competitive || true,
      supports_campaign: game.supports_campaign || false,
      supports_hybrid: game.supports_hybrid || false,
      bgg_id: game.bgg_id
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGame = () => {
    if (editingGame && formData.name.trim()) {
      const now = new Date();
      onUpdateGame(editingGame.game_id, {
        ...formData,
        updated_at: now
      });
      resetForm();
      setEditingGame(null);
      setIsEditDialogOpen(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'expert': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getGameModesBadges = (game: Game) => {
    const modes = [];
    
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
              onOpenChange={setIsAddDialogOpen}
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onBGGGameSelect={handleBGGGameSelect}
              onAddGame={handleAddGame}
              onResetForm={resetForm}
              isBGGSearchOpen={isBGGSearchOpen}
              onBGGSearchToggle={setIsBGGSearchOpen}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsAddDialogOpen(true)}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, designers, publishers..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Games Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-emerald-400">{games.length}</div>
            <div className="text-xs text-white/80">Total Games</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-400">
              {[...new Set(games.map(g => g.category))].length}
            </div>
            <div className="text-xs text-white/80">Categories</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-400">
              {games.length > 0 ? (games.reduce((sum, g) => sum + g.bgg_rating, 0) / games.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-white/80">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 pb-32">
        <div className="grid grid-cols-1 gap-4">
          {filteredGames.map((game) => (
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
                                  value={game.expansions.map(exp => 
                                    `${exp.name}${exp.year_published > 0 ? ` (${exp.year_published})` : ''}`
                                  ).join(', ')}
                                  onChange={(e) => {
                                    const expansionTexts = e.target.value.split(',').map(text => text.trim()).filter(text => text);
                                    const parsedExpansions = expansionTexts.map((text, index) => {
                                      const match = text.match(/^(.+?)\s*\((\d{4})\)$/);
                                      if (match) {
                                        return {
                                          id: `exp_${index}`,
                                          name: match[1].trim(),
                                          year_published: parseInt(match[2])
                                        };
                                      } else {
                                        return {
                                          id: `exp_${index}`,
                                          name: text,
                                          year_published: 0
                                        };
                                      }
                                    });
                                    
                                    onUpdateGame(game.game_id, { ...game, expansions: parsedExpansions });
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
                                  {game.characters.map((character) => (
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
                                onClick={() => handleEditGame(game)}
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
                                onClick={() => handleEditGame(game)}
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
        
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No games found</p>
          </div>
        )}
      </div>

      {/* Edit Game Dialog */}
      <EditGameDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingGame={editingGame}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onUpdateGame={handleUpdateGame}
        onResetForm={() => {
          resetForm();
          setEditingGame(null);
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
    </div>
  );
}