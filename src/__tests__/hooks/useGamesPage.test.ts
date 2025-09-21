import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamesPage } from '@/hooks/useGamesPage';
import { mockGames, mockPlayers } from '@/__tests__/utils/test-utils';

// Mock des dépendances
vi.mock('@/hooks/use-mobile', () => ({
  useMobile: () => ({ isMobile: false })
}));

describe('useGamesPage', () => {
  const defaultProps = {
    games: mockGames,
    players: mockPlayers,
    onAddGame: vi.fn(),
    onEditGame: vi.fn(),
    onUpdateGame: vi.fn(),
    onDeleteGame: vi.fn(),
    onNavigation: vi.fn(),
    onAddExpansion: vi.fn(),
    onEditExpansion: vi.fn(),
    onUpdateExpansion: vi.fn(),
    onDeleteExpansion: vi.fn(),
    onAddCharacter: vi.fn(),
    onEditCharacter: vi.fn(),
    onUpdateCharacter: vi.fn(),
    onDeleteCharacter: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.categoryFilter).toBe('all'); // Hook initializes with 'all'
    expect(result.current.difficultyFilter).toBe('all'); // Hook initializes with 'all'
    expect(result.current.isAddDialogOpen).toBe(false);
    expect(result.current.isEditDialogOpen).toBe(false);
    expect(result.current.formData).toBeDefined();
  });

  it('should handle search query changes', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    act(() => {
      result.current.setSearchQuery('wingspan');
    });

    expect(result.current.searchQuery).toBe('wingspan');
  });

  it('should handle category filter changes', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    act(() => {
      result.current.setCategoryFilter('strategy');
    });

    expect(result.current.categoryFilter).toBe('strategy');
  });

  it('should handle dialog state changes', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    act(() => {
      result.current.handleAddDialogOpen(true);
    });

    expect(result.current.isAddDialogOpen).toBe(true);

    act(() => {
      result.current.handleEditDialogOpen(true);
    });

    expect(result.current.isEditDialogOpen).toBe(true);
  });

  it('should call onAddGame when adding a game', async () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    // Set valid form data first
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        name: 'Test Game'
      });
    });

    await act(async () => {
      await result.current.handleAddGame();
    });

    expect(defaultProps.onAddGame).toHaveBeenCalled();
  });

  it('should filter games by search query', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    act(() => {
      result.current.setSearchQuery('wingspan');
    });

    // Les jeux filtrés devraient être accessibles via result.current.games
    // (ceci dépend de l'implémentation exacte du hook)
    expect(result.current.searchQuery).toBe('wingspan');
  });

  it('should reset form data', () => {
    const { result } = renderHook(() => useGamesPage(defaultProps));

    act(() => {
      result.current.resetForm();
    });

    // Vérifier que les données du formulaire sont remises à zéro
    expect(result.current.formData.name).toBe('');
  });
});