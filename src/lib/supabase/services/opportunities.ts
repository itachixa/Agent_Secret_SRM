import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getOpportunities(type?: string, status?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from('opportunities').select('*');
  if (type && type !== 'all') query = query.eq('type', type);
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getOpportunity(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createOpportunity(input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('opportunities').insert(input).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}