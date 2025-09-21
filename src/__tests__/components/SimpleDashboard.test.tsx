import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils';
import SimpleDashboard from '@/components/SimpleDashboard';

describe('SimpleDashboard', () => {
  it('should render dashboard title', () => {
    render(<SimpleDashboard />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('should display stats cards', () => {
    render(<SimpleDashboard />);
    
    // Vérifier la présence d'éléments de statistiques
    expect(screen.getByText(/games/i)).toBeInTheDocument();
    expect(screen.getByText(/players/i)).toBeInTheDocument();
    
    // Vérifier les valeurs par défaut
    expect(screen.getAllByText('0')).toHaveLength(2);
  });
});