'use client';

import { useEffect, useState } from 'react';
import { getOpportunities } from '../../lib/supabase/services/opportunities';
import type { OpportunityPublic, OpportunityStatus, OpportunityType } from '../../lib/supabase/types';

export function useOpportunities(type: OpportunityType | 'all' = 'all', status: OpportunityStatus | 'all' = 'all') {
  const [data, setData] = useState<OpportunityPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getOpportunities(type, status)
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
  }, [type, status]);

  return { data, loading, error };
}
