import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomNavigation from '../../components/BottomNavigation';

describe('BottomNavigation', () => {
  const mockOnNavigation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all navigation items', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation} 
      />
    );
    
    // Vérifier la présence des éléments de navigation
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/games/i)).toBeInTheDocument();
    expect(screen.getByText(/players/i)).toBeInTheDocument();
    expect(screen.getByText(/stats/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should highlight the current view', () => {
    render(
      <BottomNavigation 
        currentView="games" 
        onNavigation={mockOnNavigation} 
      />
    );
    
    const gamesButton = screen.getByText(/games/i).closest('button');
    
    // L'élément actif devrait avoir la classe CSS text-teal-400
    expect(gamesButton).toHaveClass('text-teal-400');
  });

  it('should call onNavigation when item is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation} 
      />
    );
    
    const playersButton = screen.getByText(/players/i);
    await user.click(playersButton);
    
    expect(mockOnNavigation).toHaveBeenCalledWith('players');
  });

  it('should render all items when showStats is true', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation}
        showStats={true}
      />
    );
    
    // Tous les éléments devraient être présents
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/players/i)).toBeInTheDocument();
    expect(screen.getByText(/games/i)).toBeInTheDocument();
    expect(screen.getByText(/stats/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should hide stats when showStats is false', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation}
        showStats={false}
      />
    );
    
    // Stats ne devrait pas être présent
    expect(screen.queryByText(/stats/i)).not.toBeInTheDocument();
    
    // Les autres éléments devraient toujours être présents
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/players/i)).toBeInTheDocument();
    expect(screen.getByText(/games/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation} 
      />
    );
    
    // Vérifier que tous les boutons sont accessibles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Chaque bouton devrait avoir un nom accessible
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <BottomNavigation 
        currentView="dashboard" 
        onNavigation={mockOnNavigation} 
      />
    );
    
    const dashboardButton = screen.getByText(/dashboard/i).closest('button');
    const playersButton = screen.getByText(/players/i).closest('button');
    
    // Focus sur le premier bouton
    await user.tab();
    expect(dashboardButton).toHaveFocus();
    
    // Naviguer avec Tab vers le bouton suivant
    await user.tab();
    expect(playersButton).toHaveFocus();
    
    // Activer avec Enter
    await user.keyboard('{Enter}');
    expect(mockOnNavigation).toHaveBeenCalledWith('players');
  });

  it('should work with different currentView values', () => {
    const views = ['dashboard', 'players', 'games', 'stats', 'settings'];
    
    views.forEach(view => {
      const { unmount } = render(
        <BottomNavigation 
          currentView={view} 
          onNavigation={mockOnNavigation} 
        />
      );
      
      const activeButton = screen.getByText(new RegExp(view, 'i')).closest('button');
      expect(activeButton).toHaveClass('text-teal-400');
      
      unmount();
    });
  });
});