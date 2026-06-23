import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getMentorships(userId?: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/mentorships', { userId });
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function getAvailableMentors(): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/profiles?limit=50');
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function requestMentorship(mentorId: string, field: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/mentorships', { mentor_id: mentorId, field }, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}