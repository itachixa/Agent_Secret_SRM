import { createBrowserSupabaseClient } from '../client';
import { createServerSupabaseClient } from '../client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { data: { user }, error: null };
}

export async function getSession() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { data: { session }, error: null };
}

export async function signIn(email: string, password: string): Promise<ApiResult<any>> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function signUp(email: string, password: string, fullName: string, metadata?: Record<string, unknown>): Promise<ApiResult<any>> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, ...metadata } },
  });
  if (error) return { data: null, error: toError(error) };
  return { data, error: null };
}

export async function signOut(): Promise<ApiResult<void>> {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { data: null, error: toError(error) };
  return { data: undefined, error: null };
}

export async function resetPassword(email: string): Promise<ApiResult<void>> {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  if (error) return { data: null, error: toError(error) };
  return { data: undefined, error: null };
}

export async function updatePassword(password: string): Promise<ApiResult<void>> {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { data: null, error: toError(error) };
  return { data: undefined, error: null };
}