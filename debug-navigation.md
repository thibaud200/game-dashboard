# Navigation Debug

### From GameDetailPage mo

### From GameDetailPage mobile context menu:
1. User clicks "Gérer les extensions" → calls `onNavigation('game-expansions', game.game_id, 'game-detail')`
2. App.tsx handleNavigation receives: view='game-expansions', gameId=X, source='game-detail'
3. App.tsx sets: currentView='game-expansions', navigationSource='game-detail'
- When accessing expansions/characters from games list, back button shoul
### Current Implementation:











