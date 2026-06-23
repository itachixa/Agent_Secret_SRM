'use client';

import { useEffect, useState } from 'react';
import { getConversations, getMessages, markConversationRead, sendMessage } from '../../lib/supabase/services/messages';
import type { ConversationListItem, MessagePublic } from '../../lib/supabase/types';

export function useMessages(conversationId?: string | null, userId?: string) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [messages, setMessages] = useState<MessagePublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    const result = await getConversations(userId);
    if (result.error) {
      setError(result.error.message);
    } else {
      setConversations(result.data || []);
      setError(null);
    }
  };

  const loadMessages = async (id: string) => {
    const result = await getMessages(id);
    if (result.error) {
      setError(result.error.message);
    } else {
      setMessages(result.data || []);
      setError(null);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    loadConversations()
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

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    let active = true;
    setLoading(true);

    loadMessages(conversationId)
      .then(() => markConversationRead(conversationId, userId))
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
  }, [conversationId, userId]);

  const send = async (content: string) => {
    if (!conversationId) return;
    const result = await sendMessage(conversationId, content, userId);
    if (!result.error) setMessages((current) => result.data ? [...current, result.data] : current);
    await loadConversations();
    return result;
  };

  return { conversations, messages, loading, error, send, refresh: loadConversations };
}
