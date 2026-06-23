'use client';

import { useEffect, useState } from 'react';

type AuthResult = {
  data: { session: null; user: { id: string | null } } | null;
  error: Error | null;
};

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getCurrentUser(inputUserId?: string): Promise<AuthResult> {
  try {
    return {
      data: {
        session: null,
        user: { id: inputUserId || null },
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function getSession(): Promise<AuthResult> {
  return { data: { session: null, user: { id: null } }, error: null };
}

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('X-User-ID') : null;
      if (active) setUserId(stored);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return { userId, loading };
}