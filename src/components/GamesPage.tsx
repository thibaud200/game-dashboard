import React, { useState } from 'react';
import { BGGGame } from '@/types';
import { useGamesPage, GamesPageData } from '@/hooks/useGamesPage';
import { GamesPageView } from '@/views/GamesPageView';


export default function GamesPage({
  games: gamesProp,
  onNavigation: onNavigationProp,
  onAddGame,
  onUpdateGame,
  onDeleteGame,
  onAddExpansion,
  onUpdateExpansion,
  onDeleteExpansion,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  currentView: currentViewProp
}) {
  const [expandedGame, setExpandedGame] = useState<number | null>(null);
  const [isBGGSearchOpen, setIsBGGSearchOpen] = useState(false);

  // Prepare data for the hook
  const hookData: GamesPageData = {
    games: gamesProp,
    onNavigation: onNavigationProp,
    onAddGame,
    onUpdateGame,
    onDeleteGame,
    onAddExpansion: onAddExpansion || (() => {}),
    onUpdateExpansion: onUpdateExpansion || (() => {}),
    onDeleteExpansion: onDeleteExpansion || (() => {}),
    onAddCharacter: onAddCharacter || (() => {}),
    onUpdateCharacter: onUpdateCharacter || (() => {}),
    onDeleteCharacter: onDeleteCharacter || (() => {}),
    currentView: currentViewProp
  };

  const {
    totalGames,
    averageRating,
    formData,
    editingGame,
    isAddDialogOpen,
    isEditDialogOpen,
    searchQuery,
    setSearchQuery,
    _handleBackClick,
    _handleGameStatsClick,
    handleAddDialogOpen,
    handleEditDialogOpen,
    handleAddGame,
    handleEditGame,
    handleUpdateGame,
    handleDeleteGame,
    _handleViewGameDetail,
    _handleViewGameStats,
    _handleManageExpansions,
    _handleManageCharacters,
    handleBGGSearch,
    resetForm,
    setFormData
  } = useGamesPage(hookData);

  const handleFormDataChange = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleBGGGameSelect = (bggGame: BGGGame) => {
    handleBGGSearch(bggGame);
    setIsBGGSearchOpen(false);
  };


  return (
  <GamesPageView
    games={gamesProp}
    currentView={currentViewProp || 'games'}
    totalGames={totalGames}
    averageRating={averageRating}
    formData={formData}
    editingGame={editingGame}
    isAddDialogOpen={isAddDialogOpen}
    isEditDialogOpen={isEditDialogOpen}
    isBGGSearchOpen={isBGGSearchOpen}
    expandedGame={expandedGame}
    searchQuery={searchQuery}
    onNavigation={onNavigationProp}
    onSearchChange={setSearchQuery}
    onFormDataChange={handleFormDataChange}
    onBGGGameSelect={handleBGGGameSelect}
    onAddGame={handleAddGame}
    onResetForm={resetForm}
    onEditGame={handleEditGame}
    onUpdateGame={handleUpdateGame}
    onDeleteGame={handleDeleteGame}
    setBGGSearchOpen={setIsBGGSearchOpen}
    setExpandedGame={setExpandedGame}
    setAddDialogOpen={handleAddDialogOpen}
    setEditDialogOpen={handleEditDialogOpen}
  />
  );
}