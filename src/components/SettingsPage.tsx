import React from 'react';
import {
  ArrowLeft,
  Settings,
  User,
  Database,
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  Trash
} from '@phosphor-icons/react';
import BottomNavigation from './BottomNavigation';

interface SettingsPageProps {
  onNavigation: (view: string) => void
  currentView: string
}

export default function SettingsPage({ onNavigation, currentView }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigation('dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-32">
        {/* Profile Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Edit Profile</div>
              <div className="text-white/60 text-sm">Update your name and avatar</div>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Preferences</div>
              <div className="text-white/60 text-sm">Game preferences and favorites</div>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-secondary" />
            <h2 className="text-lg font-semibold">Data Management</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <Download className="w-4 h-4" />
                <div>
                  <div className="font-medium">Export Data</div>
                  <div className="text-white/60 text-sm">Download your games and players data</div>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <Upload className="w-4 h-4" />
                <div>
                  <div className="font-medium">Import Data</div>
                  <div className="text-white/60 text-sm">Import games and players from file</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-accent" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Theme</div>
              <div className="text-white/60 text-sm">Currently: Dark Theme</div>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Display Options</div>
              <div className="text-white/60 text-sm">Cards layout, density, and animations</div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Game Reminders</div>
              <div className="text-white/60 text-sm">Get notified about game sessions</div>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Achievement Alerts</div>
              <div className="text-white/60 text-sm">Celebrate milestones and wins</div>
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Data Privacy</div>
              <div className="text-white/60 text-sm">Control what data is shared</div>
            </button>
            <button className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="font-medium">Backup Settings</div>
              <div className="text-white/60 text-sm">Automatic backup frequency</div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Trash className="w-6 h-6 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20">
              <div className="font-medium text-red-400">Clear All Data</div>
              <div className="text-red-300/60 text-sm">Remove all games, players, and session data</div>
            </button>
            <button className="w-full text-left p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20">
              <div className="font-medium text-red-400">Reset Application</div>
              <div className="text-red-300/60 text-sm">Reset all settings to default</div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <div className="space-y-2 text-white/60">
            <div>Board Game Dashboard v1.0.0</div>
            <div>Built with React and love for board games</div>
            <div className="text-xs pt-2">© 2024 Board Game Dashboard</div>
          </div>
        </div>
      </div>

      <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
    </div>
  );
}