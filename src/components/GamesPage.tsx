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

export default function GamesPage(props: GamesPageProps) {
  const [expandedGame, setExpandedGame] = useState<number | null>(null);
  const [isBGGSearchOpen, setIsBGGSearchOpen] = useState(false);

  // Prepare data for the hook
  const hookData: GamesPageData = {
    games: props.games,
    onNavigation: props.onNavigation,
    onAddGame: props.onAddGame,
    onUpdateGame: props.onUpdateGame,
    onDeleteGame: props.onDeleteGame,
    onAddExpansion: props.onAddExpansion || (() => {}),
    onUpdateExpansion: props.onUpdateExpansion || (() => {}),
    onDeleteExpansion: props.onDeleteExpansion || (() => {}),
    onAddCharacter: props.onAddCharacter || (() => {}),
    onUpdateCharacter: props.onUpdateCharacter || (() => {}),
    onDeleteCharacter: props.onDeleteCharacter || (() => {}),
    currentView: props.currentView
  };

  const {
    games,
    currentView,
    totalGames,
    averageRating,
    formData,
    editingGame,
    isAddDialogOpen,
    isEditDialogOpen,
    searchQuery,
    setSearchQuery,
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
    setFormData
  } = useGamesPage(hookData);

  const handleFormDataChange = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleBGGGameSelect = (bggGame: BGGGame) => {
    handleBGGSearch(bggGame);
    setIsBGGSearchOpen(false);
  };

  const onAddDialogToggle = () => {
    handleAddDialogOpen(!isAddDialogOpen);
  };

  return (
    <GamesPageView
      games={games}
      currentView={currentView || 'games'}
      totalGames={totalGames}
      averageRating={averageRating}
      formData={formData}
      editingGame={editingGame}
      isAddDialogOpen={isAddDialogOpen}
      isEditDialogOpen={isEditDialogOpen}
      isBGGSearchOpen={isBGGSearchOpen}
      expandedGame={expandedGame}
      searchQuery={searchQuery}
      onNavigation={onNavigation}
      onSearchChange={setSearchQuery}
      onAddDialogToggle={onAddDialogToggle}
      onFormDataChange={handleFormDataChange}
      onBGGGameSelect={handleBGGGameSelect}
      onAddGame={handleAddGame}
      onResetForm={resetForm}
      onEditGame={handleEditGame}
      onUpdateGame={handleUpdateGame}
      onDeleteGame={handleDeleteGame}
      setBGGSearchOpen={setIsBGGSearchOpen}
      setExpandedGame={setExpandedGame}
      setEditDialogOpen={handleEditDialogOpen}
    />
  );
}