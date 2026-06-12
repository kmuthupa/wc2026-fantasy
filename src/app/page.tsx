'use client';

import React from 'react';
import { useFantasyStore } from '@/lib/store';
import { TabNavigation, TabId } from '@/components/TabNavigation';
import { Leaderboard } from '@/components/Leaderboard';
import { PlayersTab } from '@/components/PlayersTab';
import { PicksTab } from '@/components/PicksTab';
import { RulesTab } from '@/components/RulesTab';
import { AdminTab } from '@/components/AdminTab';

export default function Home() {
  const store = useFantasyStore();

  if (!store.isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading league…</p>
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
            onGoToPicks={() => store.setActiveTab('picks')}
          />
        );
      case 'picks':
        return (
          <PicksTab
            players={store.players}
            updatePlayerPicks={store.updatePlayerPicks}
            onAddPlayers={() => store.setActiveTab('players')}
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
            importData={store.importData}
            state={{ players: store.players, results: store.results, activeTab: store.activeTab }}
          />
        );
      default:
        return <Leaderboard players={store.players} results={store.results} />;
    }
  };

  return (
    <main className="min-h-screen pb-24 sm:pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12">
        <header className="mb-8 sm:mb-10">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Sawgrass League</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)] text-balance">
            WC2026 Fantasy
          </h1>
          <p className="mt-2 text-sm text-[var(--text-tertiary)]">
            Local data only · no tracking
          </p>
        </header>

        <div className="mb-8">
          <TabNavigation
            activeTab={store.activeTab}
            setActiveTab={store.setActiveTab as (tab: TabId) => void}
          />
        </div>

        <div className="animate-fade-up">{renderActiveTab()}</div>

        <footer className="mt-16 pt-8 border-t border-[var(--border-subtle)] text-center hidden sm:block">
          <p className="text-xs text-[var(--text-tertiary)]">
            USA · Mexico · Canada 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
