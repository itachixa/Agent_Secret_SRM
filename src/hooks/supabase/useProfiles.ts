'use client';

import { useEffect, useState } from 'react';
import { getProfiles } from '../../lib/supabase/services/profiles';

type Profile = {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  university?: string;
  city?: string;
  field?: string;
  level?: string;
  department?: string;
  program?: string;
  graduation_year?: number;
  phone?: string;
  country?: string;
  badge?: string;
  avatar_type?: string;
  joined_at?: string;
  updated_at?: string;
  is_online?: boolean;
  cv_url?: string;
  skills?: string[];
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  followers_count?: number;
  following_count?: number;
  friends_count?: number;
};

export function useProfiles(filters?: { query?: string; limit?: number }) {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getProfiles(filters)
      .then((result) => {
        if (!active) return;
        if (result.error) throw result.error;
        setData(result.data || []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Erreur Backend');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return { data, loading, error };
}