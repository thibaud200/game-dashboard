// Frontend Exports Index
// Centralisation des exports principaux

// ============= MAIN COMPONENTS =============
export { default as Dashboard } from './components/Dashboard';
export { default as PlayersPage } from './components/PlayersPage';
export { default as GamesPage } from './components/GamesPage';
export { default as NewGamePage } from './components/NewGamePage';
export { default as SettingsPage } from './components/SettingsPage';
export { default as BottomNavigation } from './components/BottomNavigation';

// ============= MAIN HOOKS =============
export { useDashboard } from './hooks/useDashboard';
export { usePlayersPage } from './hooks/usePlayersPage';
export { useGamesPage } from './hooks/useGamesPage';
export { useNewGamePage } from './hooks/useNewGamePage';
export { useSettingsPage } from './hooks/useSettingsPage';

// ============= MAIN VIEWS =============
export { DashboardView } from './views/DashboardView';

// ============= SERVICES =============
export { default as ApiService } from './services/ApiService';

// ============= TYPES =============
export * from './types';

// ============= UTILS =============
export { cn } from './lib/utils';