import React from 'react';
import { useGameDetail, UseGameDetailProps } from '@/hooks/games/useGameDetail';
import GameDetailView from '@/views/games/GameDetailView';

interface GameDetailPageProps extends UseGameDetailProps {
  currentView: string;
}

export default function GameDetailPage(props: GameDetailPageProps & { darkMode: boolean }) {
  const hookData = useGameDetail(props);
  return <GameDetailView {...hookData} darkMode={!!props.darkMode} />;
}