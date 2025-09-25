import React from 'react';
import { useGameDetail, UseGameDetailProps } from '@/hooks/games/useGameDetail';
import GameDetailView from '@/views/games/GameDetailView';

interface GameDetailPageProps extends UseGameDetailProps {
  currentView: string;
}

export default function GameDetailPage(props: GameDetailPageProps) {
  const hookData = useGameDetail(props);
  return <GameDetailView {...hookData} />;
}