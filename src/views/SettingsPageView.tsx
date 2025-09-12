import React from 'react';
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Save,
  HelpCircle,
  Download,
  Upload,
  Trash2
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNavigation from '@/components/BottomNavigation';

interface SettingsPageViewProps {
  currentView: string;
  notifications: boolean;
  darkMode: boolean;
  language: string;
  autoSave: boolean;
  showTooltips: boolean;
  handleBackClick: () => void;
  onNavigation: (view: string) => void;
  handleNotificationsChange: (enabled: boolean) => void;
  handleDarkModeChange: (enabled: boolean) => void;
  handleLanguageChange: (lang: string) => void;
  handleAutoSaveChange: (enabled: boolean) => void;
  handleShowTooltipsChange: (enabled: boolean) => void;
  handleExportData: () => void;
  handleImportData: () => void;
  handleResetData: () => void;
}

export function SettingsPageView(props: SettingsPageViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={props.handleBackClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-32">
        {/* Preferences */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-white/60 text-sm">Get notified about game updates</div>
                </div>
              </div>
              <Switch 
                checked={props.notifications} 
                onCheckedChange={props.handleNotificationsChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-white/60 text-sm">Use dark theme</div>
                </div>
              </div>
              <Switch 
                checked={props.darkMode} 
                onCheckedChange={props.handleDarkModeChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium">Language</div>
                  <div className="text-white/60 text-sm">Choose your language</div>
                </div>
              </div>
              <Select value={props.language} onValueChange={props.handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Save className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="font-medium">Auto Save</div>
                  <div className="text-white/60 text-sm">Automatically save changes</div>
                </div>
              </div>
              <Switch 
                checked={props.autoSave} 
                onCheckedChange={props.handleAutoSaveChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-medium">Show Tooltips</div>
                  <div className="text-white/60 text-sm">Display helpful tooltips</div>
                </div>
              </div>
              <Switch 
                checked={props.showTooltips} 
                onCheckedChange={props.handleShowTooltipsChange}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          <div className="space-y-3">
            <Button 
              onClick={props.handleExportData}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <Button 
              onClick={props.handleImportData}
              className="w-full justify-start"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>

            <Button 
              onClick={props.handleResetData}
              className="w-full justify-start"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-2 text-white/80">
            <div>Board Game Dashboard v1.0.0</div>
            <div className="text-sm text-white/60">
              A modern dashboard for tracking your board game sessions and player statistics.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentView={props.currentView} onNavigation={props.onNavigation} />
    </div>
  );
}