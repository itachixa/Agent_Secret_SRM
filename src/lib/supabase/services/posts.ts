import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getPosts(type?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from('posts').select('*, author:profiles!author_id(full_name, avatar_url)');
  if (type && type !== 'all') query = query.eq('type', type);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function createPost(input: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('posts').insert(input).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createPostComment(postId: string, content: string, userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('post_comments').insert({ post_id: postId, author_id: userId, content }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function toggleLikePost(postId: string, liked: boolean, userId?: string) {
  const supabase = createServerSupabaseClient();
  if (liked) {
    const { data, error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId }).select().single();
    if (error) return { data: null, error: toError(error) };
  } else {
    const { data, error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) return { data: null, error: toError(error) };
  }
  return { data: null, error: null };
}

export async function toggleBookmarkPost(postId: string, bookmarked: boolean, userId?: string) {
  const supabase = createServerSupabaseClient();
  if (bookmarked) {
    const { data, error } = await supabase.from('bookmarks').insert({ post_id: postId, user_id: userId }).select().single();
    if (error) return { data: null, error: toError(error) };
  } else {
    const { data, error } = await supabase.from('bookmarks').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) return { data: null, error: toError(error) };
  }
  return { data: null, error: null };
}