import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getProjects(status?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from('projects').select('*, owner:profiles!owner_id(full_name, avatar_url)');
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getProject(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('projects').select('*, owner:profiles!owner_id(full_name, avatar_url)').eq('id', id).single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createProject(input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('projects').insert(input).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function updateProject(id: string, input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('projects').update(input).eq('id', id).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function deleteProject(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}