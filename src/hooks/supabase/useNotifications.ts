'use client';

import { useEffect, useState } from 'react';
import { deleteNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from '../../lib/supabase/services/notifications';
import type { NotificationPublic, NotificationType } from '../../lib/supabase/types';

export function useNotifications(filter?: 'all' | 'unread' | 'read' | NotificationType, userId?: string) {
  const [data, setData] = useState<NotificationPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    const result = await getNotifications(filter, userId);
    if (result.error) {
      setError(result.error.message);
    } else {
      setData(result.data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, [filter, userId]);

  const markRead = async (id: string) => {
    const result = await markNotificationRead(id, userId);
    if (!result.error) setData((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
    return result;
  };

  const markAllRead = async () => {
    const result = await markAllNotificationsRead(userId);
    if (!result.error) setData((current) => current.map((item) => ({ ...item, read: true })));
    return result;
  };

  const remove = async (id: string) => {
    const result = await deleteNotification(id, userId);
    if (!result.error) setData((current) => current.filter((item) => item.id !== id));
    return result;
  };

  return { data, loading, error, reload, markRead, markAllRead, remove };
}
