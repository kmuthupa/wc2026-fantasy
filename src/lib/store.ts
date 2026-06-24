'use client';

import { useState, useEffect } from 'react';
import { Player, Results, INITIAL_RESULTS } from './data';
import { resolveTeamId } from './teams';
import {
  isSupabaseConfigured,
  fetchPlayersDb,
  fetchResultsDb,
  addPlayerDb,
  updatePlayerPicksDb,
  deletePlayerDb,
  updateResultsDb,
  clearAllDataDb,
} from './supabase';

interface AppState {
  players: Player[];
  results: Results;
  activeTab: string;
}

const STORAGE_KEY = 'wc2026-fantasy-v1';

function migrateState(state: AppState): AppState {
  return {
    ...state,
    players: (state.players || []).map((p) => ({
      ...p,
      passcode: p.passcode || '1234',
      championPick: resolveTeamId(p.championPick),
    })),
  };
}

export function useFantasyStore() {
  const [state, setState] = useState<AppState>({
    players: [],
    results: INITIAL_RESULTS,
    activeTab: 'rules',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        try {
          const players = await fetchPlayersDb();
          const results = await fetchResultsDb();
          setState((s) => ({
            ...s,
            players,
            results: results || INITIAL_RESULTS,
          }));
        } catch (e) {
          console.error('Failed to load data from Supabase, trying localStorage fallback...', e);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    }

    function loadFromLocalStorage() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setState((s) => migrateState({ ...s, ...JSON.parse(saved) }));
        } catch (e) {
          console.error('Failed to load state from localStorage', e);
        }
      }
    }

    loadData();
  }, []);

  // Save to localStorage as a backup cache
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setPlayers = (players: Player[]) => setState((s) => ({ ...s, players }));
  const setActiveTab = (activeTab: string) => setState((s) => ({ ...s, activeTab }));

  const setResults = async (results: Results) => {
    // Optimistic update
    setState((s) => ({ ...s, results }));

    if (isSupabaseConfigured) {
      setIsSyncing(true);
      try {
        await updateResultsDb(results);
      } catch (e) {
        console.error('Failed to sync results to Supabase', e);
        alert('Failed to save results to database. Check connection.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const addPlayer = async (name: string, championPick: string, passcode: string) => {
    if (state.players.length >= 25) return;

    setIsSyncing(true);
    if (isSupabaseConfigured) {
      try {
        const newPlayer = await addPlayerDb(name.trim(), championPick, passcode);
        setState((s) => ({
          ...s,
          players: [...s.players, newPlayer],
        }));
      } catch (e) {
        console.error('Failed to add player to Supabase', e);
        alert('Failed to add player to Supabase database.');
      } finally {
        setIsSyncing(false);
      }
    } else {
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        passcode,
        championPick: resolveTeamId(championPick),
        picks: {
          r32: [],
          r16: [],
          qf: [],
          sf: [],
          final: '',
        },
      };
      setState((s) => ({
        ...s,
        players: [...s.players, newPlayer],
      }));
      setIsSyncing(false);
    }
  };

  const updatePlayerPicks = async (playerId: string, picks: Player['picks']) => {
    // Optimistic update
    setState((s) => ({
      ...s,
      players: s.players.map((p) => (p.id === playerId ? { ...p, picks } : p)),
    }));

    if (isSupabaseConfigured) {
      setIsSyncing(true);
      try {
        await updatePlayerPicksDb(playerId, picks);
      } catch (e) {
        console.error('Failed to sync picks to Supabase', e);
        alert('Failed to save picks to database. Your changes might not be saved.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const deletePlayer = async (playerId: string) => {
    // Optimistic update
    setState((s) => ({
      ...s,
      players: s.players.filter((p) => p.id !== playerId),
    }));

    if (isSupabaseConfigured) {
      setIsSyncing(true);
      try {
        await deletePlayerDb(playerId);
      } catch (e) {
        console.error('Failed to delete player from Supabase', e);
        alert('Failed to delete player from database.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const clearAllData = async () => {
    if (confirm('Clear all league data? This cannot be undone.')) {
      setState({
        players: [],
        results: INITIAL_RESULTS,
        activeTab: 'players',
      });

      if (isSupabaseConfigured) {
        setIsSyncing(true);
        try {
          await clearAllDataDb();
        } catch (e) {
          console.error('Failed to clear database data', e);
          alert('Failed to clear data from database.');
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };

  const importData = async (jsonData: string) => {
    try {
      const data = migrateState(JSON.parse(jsonData));
      
      if (isSupabaseConfigured) {
        setIsSyncing(true);
        try {
          // Clear everything first
          await clearAllDataDb();
          
          // Import players
          for (const p of data.players) {
            const newPlayer = await addPlayerDb(p.name, p.championPick, p.passcode || '1234');
            await updatePlayerPicksDb(newPlayer.id, p.picks);
          }

          // Import results
          await updateResultsDb(data.results);
          
          // Re-fetch to update local state with DB IDs
          const fetchedPlayers = await fetchPlayersDb();
          setState((s) => ({
            ...s,
            players: fetchedPlayers,
            results: data.results,
          }));
        } catch (e) {
          console.error('Failed to import data to Supabase', e);
          alert('Failed to import data to Supabase database.');
        } finally {
          setIsSyncing(false);
        }
      } else {
        setState(data);
      }
    } catch {
      alert('Invalid backup file.');
    }
  };

  return {
    ...state,
    isLoaded,
    isSyncing,
    isSupabaseConfigured,
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

