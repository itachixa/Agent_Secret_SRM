import { createBrowserSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getEvents() {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getEvent(id: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createEvent(input: Record<string, unknown>) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('events').insert(input).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function toggleEventAttendance(eventId: string, userId: string, statusValue: string = 'going') {
  const supabase = createBrowserSupabaseClient();
  const { data: existing } = await supabase.from('event_attendees').select('id').eq('event_id', eventId).eq('user_id', userId).single();
  if (existing) {
    const { data, error } = await supabase.from('event_attendees').delete().eq('event_id', eventId).eq('user_id', userId);
    if (error) return { data: null, error: toError(error) };
  } else {
    const { data, error } = await supabase.from('event_attendees').insert({ event_id: eventId, user_id: userId, status: statusValue }).select().single();
    if (error) return { data: null, error: toError(error) };
  }
  return { data: null, error: null };
}