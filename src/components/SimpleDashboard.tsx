import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

export default function SimpleDashboard() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "min-h-screen bg-slate-900 text-white" : "min-h-screen bg-slate-100 text-slate-900"}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={darkMode ? "text-3xl font-bold text-center mb-8" : "text-3xl font-bold text-center mb-8 text-primary"}>Board Game Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className={darkMode ? "bg-slate-800 rounded-lg p-6 text-center" : "bg-white rounded-lg p-6 text-center border border-slate-200"}>
            <h2 className={darkMode ? "text-xl font-semibold mb-2 text-primary" : "text-xl font-semibold mb-2 text-blue-700"}>Players</h2>
            <p className={darkMode ? "text-3xl font-bold text-white" : "text-3xl font-bold text-blue-700"}>0</p>
          </div>
          <div className={darkMode ? "bg-slate-800 rounded-lg p-6 text-center" : "bg-white rounded-lg p-6 text-center border border-slate-200"}>
            <h2 className={darkMode ? "text-xl font-semibold mb-2 text-primary" : "text-xl font-semibold mb-2 text-emerald-700"}>Games</h2>
            <p className={darkMode ? "text-3xl font-bold text-white" : "text-3xl font-bold text-emerald-700"}>0</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>Your gaming companion is ready!</p>
        </div>
      </div>
    </div>
  );
}