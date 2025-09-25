import React from 'react';
import { SettingsPageView } from '@/views/SettingsPageView';
import { useSettingsPage, SettingsPageData } from '@/hooks/useSettingsPage';
import { NavigationHandler } from '@/types';
import { useTheme } from '@/theme/ThemeProvider';

interface SettingsPageProps {
  onNavigation: NavigationHandler;
  currentView: string;
}

export default function SettingsPage(props: SettingsPageProps) {
  const { darkMode, setDarkMode } = useTheme();
  const settingsPageData: SettingsPageData = {
    onNavigation: props.onNavigation,
    currentView: props.currentView,
    darkMode,
    setDarkMode
  };

  const logic = useSettingsPage(settingsPageData);

  return <SettingsPageView {...logic} />;
}