import React from 'react';

export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Board Game Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">Players</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">Games</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-slate-400">Your gaming companion is ready!</p>
        </div>
      </div>
    </div>
  );
}