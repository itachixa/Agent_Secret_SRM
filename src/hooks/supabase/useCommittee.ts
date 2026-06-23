'use client';

import { useEffect, useState } from 'react';
import { getCommittee } from '../../lib/supabase/services/committee';
import type { CommitteePublic } from '../../lib/supabase/types';

export function useCommittee() {
  const [data, setData] = useState<CommitteePublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getCommittee()
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
  }, []);

  return { data, loading, error };
}
