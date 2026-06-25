import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getConversations(userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('conversations')
    .select(`*, conversation_participants!inner(user_id)`)
    .eq('conversation_participants.user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getOrCreateConversation(otherUserId: string, userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase
    .from('conversations')
    .select(`*, participants:conversation_participants!inner(user_id)`)
    .eq('participants.user_id', userId)
    .eq('participants.user_id', otherUserId)
    .single();
  if (existing) return { data: existing, error: null };
  const { data, error } = await supabase.from('conversations').insert({}).select().single();
  if (error) return { data: null, error: toError(error) };
  await supabase.from('conversation_participants').insert([
    { conversation_id: data.id, user_id: userId },
    { conversation_id: data.id, user_id: otherUserId },
  ]);
  return { data, error: null };
}

export async function getMessages(conversationId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function sendMessage(conversationId: string, content: string, userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: userId, content }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function markConversationRead(conversationId: string, userId?: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('messages').update({ read: true }).eq('conversation_id', conversationId).eq('sender_id', userId).neq('read', true).select();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}