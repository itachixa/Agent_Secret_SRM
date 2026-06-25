import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getMentorships(userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('mentorships').select('*').or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`).order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getAvailableMentors() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('id,full_name,avatar_url,field,badge').eq('badge', 'mentor').limit(50);
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function requestMentorship(mentorId: string, field: string, userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('mentorships').insert({ mentor_id: mentorId, mentee_id: userId, field, status: 'pending' }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}