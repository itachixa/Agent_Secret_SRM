'use client';

import { useEffect } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '../../lib/supabase/client';

export function useRealtimeSubscriptions(options: {
  userId?: string | null;
  conversationId?: string | null;
  onMessage?: (payload: unknown) => void;
  onNotification?: (payload: unknown) => void;
  onPost?: (payload: unknown) => void;
  onForumQuestion?: (payload: unknown) => void;
  onForumAnswer?: (payload: unknown) => void;
  onEvent?: (payload: unknown) => void;
  onProject?: (payload: unknown) => void;
  onCommittee?: (payload: unknown) => void;
}) {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channels: RealtimeChannel[] = [];

    if (options.conversationId) {
      channels.push(
        supabase
          .channel(`messages:${options.conversationId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${options.conversationId}`,
            },
            (payload) => options.onMessage?.(payload)
          )
          .subscribe()
      );
    }

    if (options.userId) {
      channels.push(
        supabase
          .channel(`notifications:${options.userId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${options.userId}`,
            },
            (payload) => options.onNotification?.(payload)
          )
          .subscribe()
      );
    }

    channels.push(
      supabase
        .channel('posts:public')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts' },
          (payload) => options.onPost?.(payload)
        )
        .subscribe(),
      supabase
        .channel('forum:public')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'forum_questions' },
          (payload) => options.onForumQuestion?.(payload)
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'forum_answers' },
          (payload) => options.onForumAnswer?.(payload)
        )
        .subscribe(),
      supabase
        .channel('events:public')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => options.onEvent?.(payload)
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'event_attendees' },
          (payload) => options.onEvent?.(payload)
        )
        .subscribe(),
      supabase
        .channel('projects:public')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          (payload) => options.onProject?.(payload)
        )
        .subscribe(),
      supabase
        .channel('committee:public')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'committee_members' },
          (payload) => options.onCommittee?.(payload)
        )
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [
    options.userId,
    options.conversationId,
    options.onMessage,
    options.onNotification,
    options.onPost,
    options.onForumQuestion,
    options.onForumAnswer,
    options.onEvent,
    options.onProject,
    options.onCommittee,
  ]);
}
