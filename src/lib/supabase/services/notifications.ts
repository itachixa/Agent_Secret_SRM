import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getNotifications(filter?: string, userId?: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/notifications', { userId });
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function markNotificationRead(notificationId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.put<any>(`/api/notifications/${notificationId}/read`, undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function markAllNotificationsRead(userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.put<any>('/api/notifications/read-all', undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function deleteNotification(notificationId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.delete<any>(`/api/notifications/${notificationId}`, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}