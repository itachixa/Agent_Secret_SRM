'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '../../lib/supabase/services/projects';
import type { ProjectPublic, ProjectStatus } from '../../lib/supabase/types';

export function useProjects(ownerId?: string, status?: ProjectStatus | 'all') {
  const [data, setData] = useState<ProjectPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getProjects(status)
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
  }, [ownerId, status]);

  return { data, loading, error };
}
