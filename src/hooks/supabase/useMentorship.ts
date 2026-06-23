'use client';

import { useEffect, useState } from 'react';
import { getAvailableMentors, getMentorships, requestMentorship } from '../../lib/supabase/services/mentorship';
import type { MentorshipPublic, UserProfile } from '../../lib/supabase/types';

export function useMentorship(userId?: string) {
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getAvailableMentors(), getMentorships(userId)])
      .then(([mentorResult, mentorshipResult]) => {
        if (!active) return;
        if (mentorResult.error) throw mentorResult.error;
        if (mentorshipResult.error) throw mentorshipResult.error;
        setMentors(mentorResult.data || []);
        setMentorships(mentorshipResult.data || []);
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
  }, [userId]);

  const request = async (mentorId: string, field: string) => {
    const result = await requestMentorship(mentorId, field, userId);
    if (!result.error) setMentorships((current) => result.data ? [...current, result.data] : current);
    return result;
  };

  return { mentors, mentorships, loading, error, request };
}
