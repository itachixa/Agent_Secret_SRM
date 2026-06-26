import { createBrowserSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getForumQuestions() {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('forum_questions')
    .select('*, author:profiles!author_id(full_name, avatar_url)')
    .order('created_at', { ascending: false });
  if (error) return { data: [], error: toError(error) };
  return { data, error: null };
}

export async function getForumQuestion(id: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('forum_questions')
    .select('*, author:profiles!author_id(full_name, avatar_url), answers:forum_answers(*, author:profiles!author_id(full_name, avatar_url))')
    .eq('id', id)
    .single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createForumQuestion(input: Record<string, unknown>) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('forum_questions').insert(input).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function createForumAnswer(questionId: string, content: string, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('forum_answers').insert({ question_id: questionId, author_id: userId, content }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function voteForumQuestion(questionId: string, value: -1 | 1, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('forum_votes').upsert({ question_id: questionId, user_id: userId, value }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function voteForumAnswer(answerId: string, value: -1 | 1, userId?: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.from('forum_votes').upsert({ answer_id: answerId, user_id: userId, value }).select().single();
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}
