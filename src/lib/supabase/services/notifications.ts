import { createBrowserSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getNotifications(filter?: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  let query = supabase.from('notifications').select('*').eq('user_id', userId);
  if (filter === 'unread') query = query.eq('read', false);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function markNotificationRead(notificationId: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId).eq('user_id', userId).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function markAllNotificationsRead(userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false).select();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function deleteNotification(notificationId: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('notifications').delete().eq('id', notificationId).eq('user_id', userId);
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}