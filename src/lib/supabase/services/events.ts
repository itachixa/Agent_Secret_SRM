import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getEvents(): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/events');
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function createEvent(input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/events', input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function toggleEventAttendance(eventId: string, attending: boolean, statusValue: string = 'going', userId?: string): Promise<ApiResult<any>> {
  try {
    if (attending) {
      const data = await api.post<any>(`/api/events/${eventId}/attend?status_value=${statusValue}`, undefined, { userId });
      return { data, error: null };
    } else {
      const data = await api.delete<any>(`/api/events/${eventId}/attend`, { userId });
      return { data, error: null };
    }
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}