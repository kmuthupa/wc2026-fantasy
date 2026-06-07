'use client';

import React from 'react';
import { useFantasyStore } from '@/lib/store';
import { TabNavigation } from '@/components/TabNavigation';
import { Leaderboard } from '@/components/Leaderboard';
import { PlayersTab } from '@/components/PlayersTab';
import { GroupsTab } from '@/components/GroupsTab';
import { PicksTab } from '@/components/PicksTab';
import { RulesTab } from '@/components/RulesTab';
import { AdminTab } from '@/components/AdminTab';

export default function Home() {
  const store = useFantasyStore();

  if (!store.isLoaded) {
    return (
      <div className="min-h-screen bg-[#1a472a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-8 border-white border-t-[#ffd700] rounded-full animate-spin"></div>
          <p className="text-white font-black uppercase tracking-[0.2em] animate-bounce">Mowing the pitch...</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (store.activeTab) {
      case 'leaderboard':
        return <Leaderboard players={store.players} results={store.results} />;
      case 'players':
        return (
          <PlayersTab
            players={store.players}
            addPlayer={store.addPlayer}
            deletePlayer={store.deletePlayer}
          />
        );
      case 'groups':
        return <GroupsTab />;
      case 'picks':
        return (
          <PicksTab
            players={store.players}
            updatePlayerPicks={store.updatePlayerPicks}
          />
        );
      case 'rules':
        return <RulesTab />;
      case 'admin':
        return (
          <AdminTab
            results={store.results}
            setResults={store.setResults}
            clearAllData={store.clearAllData}
            state={{ players: store.players, results: store.results }}
          />
        );
      default:
        return <Leaderboard players={store.players} results={store.results} />;
    }
  };

  return (
    <main className="min-h-screen pb-20 selection:bg-[#ffd700] selection:text-[#1a472a]">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <header className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2d5a27]/30 to-transparent -z-10"></div>
          <h1 className="text-6xl sm:text-7xl font-[900] text-[#1a472a] tracking-tighter mb-1 uppercase drop-shadow-sm inline-block bg-transparent px-8">
            WC2026
          </h1>
          <div className="flex flex-col items-center">
             <span className="bg-[#1a472a] text-[#ffd700] px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-3 shadow-lg">
               Fantasy League
             </span>
             <p className="text-sm font-bold text-[#4b5563] uppercase tracking-widest opacity-80">
               Neighborhood Championship Edition
             </p>
          </div>
        </header>

        <TabNavigation
          activeTab={store.activeTab}
          setActiveTab={store.setActiveTab}
        />

        <div className="mt-12 relative">
          {renderActiveTab()}
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-200 text-center">
          <div className="flex justify-center gap-4 mb-4 grayscale opacity-40">
            <span className="text-2xl">🇺🇸</span>
            <span className="text-2xl">🇲🇽</span>
            <span className="text-2xl">🇨🇦</span>
          </div>
          <p className="font-black text-[#1a472a] uppercase tracking-tighter text-sm">
            © 2026 Neighbor League Pitch Side
          </p>
          <p className="mt-1 text-[#4b5563] font-medium text-xs opacity-60">
            Local Data Only • Privacy First • No Tracking
          </p>
        </footer>
      </div>
    </main>
  );
}
