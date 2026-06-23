'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '../../lib/supabase/services/profiles';
import type { UserProfile } from '../../lib/supabase/types';

export function useProfile(id?: string) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    setLoading(true);

    getProfile(id)
      .then((result) => {
        if (!active) return;
        if (result.error) throw result.error;
        setData(result.data);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Erreur Supabase');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { data, loading, error };
}
