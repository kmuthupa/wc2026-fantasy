'use client';

import { useState, useEffect } from 'react';
import { Player, Results, INITIAL_RESULTS } from './data';

interface AppState {
  players: Player[];
  results: Results;
  activeTab: string;
}

const STORAGE_KEY = 'wc2026-fantasy-v1';

export function useFantasyStore() {
  const [state, setState] = useState<AppState>({
    players: [],
    results: INITIAL_RESULTS,
    activeTab: 'leaderboard',
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setPlayers = (players: Player[]) => setState((s) => ({ ...s, players }));
  const setResults = (results: Results) => setState((s) => ({ ...s, results }));
  const setActiveTab = (activeTab: string) => setState((s) => ({ ...s, activeTab }));

  const addPlayer = (name: string, championPick: string) => {
    if (state.players.length >= 25) return;
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      championPick,
      picks: {
        r32: [],
        r16: [],
        qf: [],
        sf: [],
        final: '',
      },
    };
    setPlayers([...state.players, newPlayer]);
  };

  const updatePlayerPicks = (playerId: string, picks: Player['picks']) => {
    setPlayers(
      state.players.map((p) => (p.id === playerId ? { ...p, picks } : p))
    );
  };

  const deletePlayer = (playerId: string) => {
    setPlayers(state.players.filter((p) => p.id !== playerId));
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      setState({
        players: [],
        results: INITIAL_RESULTS,
        activeTab: 'players',
      });
    }
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      setState(data);
    } catch (e) {
      alert('Invalid JSON data');
    }
  };

  return {
    ...state,
    isLoaded,
    setPlayers,
    setResults,
    setActiveTab,
    addPlayer,
    updatePlayerPicks,
    deletePlayer,
    clearAllData,
    importData,
  };
}
