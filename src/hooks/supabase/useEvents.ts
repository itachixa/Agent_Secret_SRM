'use client';

import { useEffect, useState } from 'react';
import { getEvents, toggleEventAttendance } from '../../lib/supabase/services/events';
import type { AttendanceStatus, EventPublic } from '../../lib/supabase/types';

export function useEvents() {
  const [data, setData] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getEvents()
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

const toggleAttendance = async (eventId: string, attending: boolean, status: AttendanceStatus = 'going', userId?: string) => {
    const result = await toggleEventAttendance(eventId, attending, status, userId);
    if (result.error) return result;
    const refreshed = await getEvents();
    if (!refreshed.error) setData(refreshed.data || []);
    return result;
  };

  return { data, loading, error, toggleAttendance };
}
