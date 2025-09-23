import React from 'react';
import { SettingsPageView } from '@/views/SettingsPageView';
import { useSettingsPage, SettingsPageData } from '@/hooks/useSettingsPage';
import { NavigationHandler } from '@/types';

interface SettingsPageProps {
  onNavigation: NavigationHandler;
  currentView: string;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

export default function SettingsPage(props: SettingsPageProps) {
  const settingsPageData: SettingsPageData = {
    onNavigation: props.onNavigation,
    currentView: props.currentView,
    darkMode: props.darkMode,
    setDarkMode: props.setDarkMode
  };

  const logic = useSettingsPage(settingsPageData);

  return <SettingsPageView {...logic} />;
}