import { supabase } from '../../lib/supabase';

/**
 * Uses the existing client in src/lib/supabase.ts. This uses the NEXT_PUBLIC_* keys
 * and is suitable only when your rounds table is publicly readable. Tests mock this
 * module so unit/integration tests are unaffected.
 */
export type Round = {
  id: string;
  start_time?: string | null;
  end_time?: string | null;
};

export async function getRoundById(id: string): Promise<Round | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('rounds')
    .select('id, start_time, end_time')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getRoundById error', error);
    return null;
  }

  return data as Round;
}
