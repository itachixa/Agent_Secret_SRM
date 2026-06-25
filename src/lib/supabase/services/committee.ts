import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getCommittee() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('committee_members')
    .select(`*, position:committee_positions(title, title_en, description), profile:profiles!profile_id(full_name, avatar_url, city, field, badge)`)
    .eq('is_current', true)
    .order('sort_order', { ascending: true });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}