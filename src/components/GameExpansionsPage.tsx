import React from 'react';
import GameExpansionsView from '@/views/games/GameExpansionsView';
import { Game, GameExpansion } from '@/types/index';

interface GameExpansionsPageProps {
  game: Game
  onNavigation: (view: string, gameId?: number, source?: string) => void
  navigationSource?: string
  onAddExpansion: (gameId: number, expansionData: any) => Promise<GameExpansion>
  onUpdateExpansion: (expansionId: number, expansionData: any) => Promise<void>
  onDeleteExpansion: (expansionId: number) => Promise<void>
  embedded?: boolean
}

export default function GameExpansionsPage(props: GameExpansionsPageProps) {
  return <GameExpansionsView {...props} />;
}