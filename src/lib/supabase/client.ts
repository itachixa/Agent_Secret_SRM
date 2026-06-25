import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let serverClient: ReturnType<typeof createBrowserClient> | null = null;

export function createServerSupabaseClient() {
  if (typeof window !== 'undefined') {
    return createBrowserSupabaseClient();
  }
  const { createServerClient } = require('@supabase/ssr');
  const { cookies } = require('next/headers');
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookies().set(name, value, options);
          } catch {}
        },
        remove(name: string, options: any) {
          try {
            cookies().set(name, '', { ...options, maxAge: 0 });
          } catch {}
        },
      },
    }
  );
}