import React from 'react';
import GameCharactersView from '@/views/games/GameCharactersView';
import { Game, GameCharacter } from '@/types';

interface GameCharactersPageProps {
  game: Game
  onNavigation: (view: string, gameId?: number, source?: string) => void
  navigationSource?: string
  onAddCharacter: (gameId: number, characterData: any) => Promise<GameCharacter>
  onUpdateCharacter: (characterId: number, characterData: any) => Promise<void>
  onDeleteCharacter: (characterId: number) => Promise<void>
  embedded?: boolean
}

export default function GameCharactersPage(props: GameCharactersPageProps) {
  return <GameCharactersView {...props} />;
}