import { useState, useEffect, useMemo } from 'react';
import { Game, NavigationHandler, GameFormData } from '@/types';

export interface GamesPageData {
  games: Game[];
  onNavigation: NavigationHandler;
  onAddGame: (game: Partial<Game>) => void;
  onUpdateGame: (gameId: number, game: Partial<Game>) => void;
  onDeleteGame: (gameId: number) => void;
  onAddExpansion: (gameId: number, expansion: any) => void;
  onUpdateExpansion: (expansionId: number, expansion: any) => void;
  onDeleteExpansion: (expansionId: number) => void;
  onAddCharacter: (gameId: number, character: any) => void;
  onUpdateCharacter: (characterId: number, character: any) => void;
  onDeleteCharacter: (characterId: number) => void;
  currentView?: string;
}

export const useGamesPage = (data: GamesPageData) => {
  const {
    games,
    onNavigation,
    onAddGame,
    onUpdateGame,
    onDeleteGame,
    onAddExpansion,
    onUpdateExpansion,
    onDeleteExpansion,
    onAddCharacter,
    onUpdateCharacter,
    onDeleteCharacter,
    currentView = 'games'
  } = data;

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<GameFormData & { expansions: any[], characters: any[] }>({
    name: '',
    description: '',
    image: '',
    min_players: 1,
    max_players: 4,
    duration: '',
    difficulty: '',
    category: '',
    year_published: new Date().getFullYear(),
    publisher: '',
    designer: '',
    bgg_rating: 0,
    weight: 0,
    age_min: 8,
    supports_cooperative: false,
    supports_competitive: true,
    supports_campaign: false,
    supports_hybrid: false,
    has_expansion: false,
    has_characters: false,
    bgg_id: undefined,
    expansions: [],
    characters: []
  });

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Computed values
  const filteredAndSortedGames = useMemo(() => {
    const safeGames = games || [];
    const filtered = safeGames.filter(game => {
      const matchesSearch = (game.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (game.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || game.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || game.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort games
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'year':
          comparison = (a.year_published || 0) - (b.year_published || 0);
          break;
        case 'rating':
          comparison = (a.bgg_rating || 0) - (b.bgg_rating || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [games, searchQuery, categoryFilter, difficultyFilter, sortBy, sortOrder]);

  const categories = useMemo(() => {
    const safeGames = games || [];
    const cats = [...new Set(safeGames.map(g => g.category).filter(Boolean))];
    return cats.sort();
  }, [games]);

  const difficulties = useMemo(() => {
    const safeGames = games || [];
    const diffs = [...new Set(safeGames.map(g => g.difficulty).filter(Boolean))];
    return diffs.sort();
  }, [games]);

  const safeGames = games || [];
  const totalGames = safeGames.length;
  const averageRating = safeGames.length > 0 
    ? safeGames.reduce((sum, g) => sum + (g.bgg_rating || 0), 0) / safeGames.length
    : 0;

  // Form management
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      min_players: 1,
      max_players: 4,
      duration: '',
      difficulty: '',
      category: '',
      year_published: new Date().getFullYear(),
      publisher: '',
      designer: '',
      bgg_rating: 0,
      weight: 0,
      age_min: 8,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: false,
      has_expansion: false,
      has_characters: false,
      bgg_id: undefined,
      expansions: [],
      characters: []
    });
  };

  // Navigation handlers
  const handleBackClick = () => {
    onNavigation('dashboard');
  };

  const handleGameStatsClick = () => {
    onNavigation('game-stats');
  };

  // Dialog handlers
  const handleAddDialogOpen = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEditDialogOpen = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      resetForm();
      setEditingGame(null);
    }
  };

  // Game actions
  const handleAddGame = () => {
    if (formData.name.trim()) {
      const now = new Date();
      const gameData = {
        ...formData,
        players: `${formData.min_players}-${formData.max_players}`,
        created_at: now,
        expansions: [],
        characters: []
      };
      onAddGame(gameData);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      description: game.description,
      image: game.image,
      min_players: game.min_players,
      max_players: game.max_players,
      duration: game.duration,
      difficulty: game.difficulty,
      category: game.category,
      year_published: game.year_published,
      publisher: game.publisher,
      designer: game.designer,
      bgg_rating: game.bgg_rating,
      weight: game.weight,
      age_min: game.age_min,
      supports_cooperative: game.supports_cooperative,
      supports_competitive: game.supports_competitive,
      supports_campaign: game.supports_campaign,
      supports_hybrid: game.supports_hybrid,
      has_expansion: game.has_expansion,
      has_characters: game.has_characters,
      bgg_id: game.bgg_id,
      expansions: game.expansions || [],
      characters: game.characters || []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGame = () => {
    if (editingGame && formData.name.trim()) {
      const now = new Date();
      const gameData = {
        ...formData,
        players: `${formData.min_players}-${formData.max_players}`,
        updated_at: now
      };
      onUpdateGame(editingGame.game_id, gameData);
      resetForm();
      setEditingGame(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteGame = (gameId: number) => {
    onDeleteGame(gameId);
  };

  const handleViewGameDetail = (gameId: number) => {
    onNavigation('game-detail', gameId);
  };

  const handleViewGameStats = (gameId: number) => {
    onNavigation('stats', gameId, 'games');
  };

  const handleManageExpansions = (gameId: number) => {
    onNavigation('game-expansions', gameId, 'games');
  };

  const handleManageCharacters = (gameId: number) => {
    onNavigation('game-characters', gameId, 'games');
  };

  // BGG Search
  const handleBGGSearch = (bggGame: any) => {
    setFormData(prev => ({
      ...prev,
      name: bggGame.name,
      description: bggGame.description || '',
      image: bggGame.image || bggGame.thumbnail || '',
      min_players: bggGame.min_players || 1,
      max_players: bggGame.max_players || 4,
      duration: bggGame.playing_time ? `${bggGame.playing_time} min` : '',
      year_published: bggGame.year_published || new Date().getFullYear(),
      publisher: bggGame.publishers?.[0] || '',
      designer: bggGame.designers?.[0] || '',
      bgg_rating: bggGame.rating || 0,
      weight: bggGame.weight || 0,
      difficulty: bggGame.difficulty || '', // Now mapped from BGG weight
      age_min: bggGame.min_age || 8,
      bgg_id: bggGame.id,
      category: bggGame.categories?.[0] || '',
      has_expansion: (bggGame.expansions?.length || 0) > 0,
      has_characters: (bggGame.characters?.length || 0) > 0, // Auto-detect from BGG data
      expansions: bggGame.expansions || [],
      characters: bggGame.characters || [], // Use BGG generated characters
      // Set game modes based on BGG data
      supports_competitive: bggGame.supports_competitive ?? true,
      supports_cooperative: bggGame.supports_cooperative ?? false,
      supports_campaign: bggGame.supports_campaign ?? false,
      supports_hybrid: bggGame.supports_hybrid ?? false
    }));
  };

  return {
    // Data
    games: filteredAndSortedGames,
    currentView,
    
    // Computed
    totalGames,
    averageRating,
    categories,
    difficulties,
    isMobile,
    
    // Form state
    formData,
    setFormData,
    editingGame,
    
    // Dialog state
    isAddDialogOpen,
    isEditDialogOpen,
    
    // Filters and search
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    
    // Handlers
    handleBackClick,
    handleGameStatsClick,
    handleAddDialogOpen,
    handleEditDialogOpen,
    handleAddGame,
    handleEditGame,
    handleUpdateGame,
    handleDeleteGame,
    handleViewGameDetail,
    handleViewGameStats,
    handleManageExpansions,
    handleManageCharacters,
    handleBGGSearch,
    resetForm,
    onNavigation,
    
    // Pass-through handlers
    onAddExpansion,
    onUpdateExpansion,
    onDeleteExpansion,
    onAddCharacter,
    onUpdateCharacter,
    onDeleteCharacter
  };
};