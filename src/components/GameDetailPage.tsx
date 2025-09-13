import React from 'react';
import { useGameDetail, UseGameDetailProps } from '@/hooks/games/useGameDetail';
import { TooltipProvider } from '@/components/ui/tooltip';
import GameDetailView from '@/views/games/GameDetailView';
import { Game } from '@/types';

interface GameDetailPageProps extends UseGameDetailProps {
  currentView: string;
}

export default function GameDetailPage(props: GameDetailPageProps) {
  const hookData = useGameDetail(props);
  
  return (
    <TooltipProvider>
      <GameDetailView {...hookData} />
    </TooltipProvider>
  );
}