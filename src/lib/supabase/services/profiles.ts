import { createBrowserSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getProfiles(filters?: { query?: string; limit?: number }) {
  const supabase = createBrowserSupabaseClient();
  let query = supabase.from('profiles').select('*');
  if (filters?.query) query = query.ilike('full_name', `%${filters.query}%`);
  if (filters?.limit) query = query.limit(filters.limit);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getProfile(profileId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function updateProfile(profileId: string, input: Record<string, unknown>) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('profiles').update(input).eq('id', profileId).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function getProfileSkills(profileId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('profile_skills').select('skill').eq('profile_id', profileId);
  if (error) return { data: [], error: toError(error) };
  return { data: data?.map((s: any) => s.skill) || [], error: null };
}

export async function replaceProfileSkills(profileId: string, skills: string[]) {
  const supabase = createBrowserSupabaseClient();
  await supabase.from('profile_skills').delete().eq('profile_id', profileId);
  if (skills.length === 0) return { data: [], error: null };
  const { data, error } = await supabase.from('profile_skills').insert(skills.map((skill) => ({ profile_id: profileId, skill }))).select();
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getSocialLinks(profileId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('social_links').select('*').eq('profile_id', profileId).single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function upsertSocialLinks(profileId: string, input: Record<string, unknown>) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('social_links').upsert({ profile_id: profileId, ...input }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function followUser(targetUserId: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('follows').insert({ follower_id: userId, following_id: targetUserId }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function unfollowUser(targetUserId: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('follows').delete().eq('follower_id', userId).eq('following_id', targetUserId);
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}
