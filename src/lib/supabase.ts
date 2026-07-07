import { createClient } from '@supabase/supabase-js';
import { Player, Results } from './data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function checkSupabaseHealth(): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from('players').select('id').limit(1);
  if (error) {
    console.warn('Supabase health check failed:', error);
    return false;
  }

  return true;
}

// Database helper functions
export async function fetchPlayersDb(): Promise<Player[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching players from Supabase:', error);
    throw error;
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    passcode: row.passcode || '',
    championPick: row.champion_pick,
    picks: typeof row.picks === 'string' ? JSON.parse(row.picks) : row.picks,
  }));
}

export async function fetchResultsDb(): Promise<Results | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('tournament_results')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    // If table exists but row is missing, insert default and try again
    if (error.code === 'PGRST116') {
      const defaultResults = {
        r32: [],
        r16: [],
        qf: [],
        sf: [],
        final: '',
        lockedRounds: [],
      };
      const { data: newRow, error: insertError } = await supabase
        .from('tournament_results')
        .insert({
          id: 1,
          r32: defaultResults.r32,
          r16: defaultResults.r16,
          qf: defaultResults.qf,
          sf: defaultResults.sf,
          final: defaultResults.final,
          locked_rounds: [],
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting default results:', insertError);
        return null;
      }
      const lockedRoundsData = newRow.locked_rounds;
      return {
        r32: typeof newRow.r32 === 'string' ? JSON.parse(newRow.r32) : newRow.r32,
        r16: typeof newRow.r16 === 'string' ? JSON.parse(newRow.r16) : newRow.r16,
        qf: typeof newRow.qf === 'string' ? JSON.parse(newRow.qf) : newRow.qf,
        sf: typeof newRow.sf === 'string' ? JSON.parse(newRow.sf) : newRow.sf,
        final: newRow.final,
        lockedRounds: lockedRoundsData
          ? (typeof lockedRoundsData === 'string' ? JSON.parse(lockedRoundsData) : lockedRoundsData)
          : [],
      };
    }
    console.error('Error fetching tournament results:', error);
    return null;
  }

  const lockedRoundsData = data.locked_rounds;
  return {
    r32: typeof data.r32 === 'string' ? JSON.parse(data.r32) : data.r32,
    r16: typeof data.r16 === 'string' ? JSON.parse(data.r16) : data.r16,
    qf: typeof data.qf === 'string' ? JSON.parse(data.qf) : data.qf,
    sf: typeof data.sf === 'string' ? JSON.parse(data.sf) : data.sf,
    final: data.final,
    lockedRounds: lockedRoundsData
      ? (typeof lockedRoundsData === 'string' ? JSON.parse(lockedRoundsData) : lockedRoundsData)
      : [],
  };
}

export async function addPlayerDb(name: string, championPick: string, passcode: string): Promise<Player> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const initialPicks = {
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    final: '',
  };

  const { data, error } = await supabase
    .from('players')
    .insert({
      name,
      champion_pick: championPick,
      passcode,
      picks: initialPicks,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding player in Supabase:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    passcode: data.passcode,
    championPick: data.champion_pick,
    picks: typeof data.picks === 'string' ? JSON.parse(data.picks) : data.picks,
  };
}

export async function updatePlayerPicksDb(playerId: string, picks: Player['picks']): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase
    .from('players')
    .update({ picks })
    .eq('id', playerId);

  if (error) {
    console.error('Error updating player picks in Supabase:', error);
    throw error;
  }
}

export async function deletePlayerDb(playerId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', playerId);

  if (error) {
    console.error('Error deleting player in Supabase:', error);
    throw error;
  }
}

export async function updateResultsDb(results: Results): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase
    .from('tournament_results')
    .upsert({
      id: 1,
      r32: results.r32,
      r16: results.r16,
      qf: results.qf,
      sf: results.sf,
      final: results.final,
      locked_rounds: results.lockedRounds || [],
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating results in Supabase:', error);
    throw error;
  }
}

export async function clearAllDataDb(): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized');
  
  // Clear players
  const { error: playersError } = await supabase
    .from('players')
    .delete()
    .neq('name', ''); // Deletes all rows

  if (playersError) {
    console.error('Error clearing players in Supabase:', playersError);
    throw playersError;
  }

  // Reset results
  const defaultResults: Results = {
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    final: '',
  };
  await updateResultsDb(defaultResults);
}
