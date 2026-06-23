import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

function qs(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export async function getProfiles(filters?: { query?: string; limit?: number }): Promise<ApiResult<any[]>> {
  try {
    const query = qs({ q: filters?.query, limit: filters?.limit ?? 20 });
    const data = await api.get<any[]>(`/api/profiles${query ? `?${query}` : ''}`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function getProfile(profileId: string): Promise<ApiResult<any>> {
  try {
    const data = await api.get<any>(`/api/profiles/${profileId}`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function updateProfile(profileId: string, input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.put<any>(`/api/profiles/${profileId}`, input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function getProfileSkills(profileId: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>(`/api/profiles/${profileId}/skills`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function replaceProfileSkills(profileId: string, skills: string[], userId?: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.put<any[]>(`/api/profiles/${profileId}/skills`, skills, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function getSocialLinks(profileId: string): Promise<ApiResult<any>> {
  try {
    const data = await api.get<any>(`/api/profiles/${profileId}/social-links`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function upsertSocialLinks(profileId: string, input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.put<any>(`/api/profiles/${profileId}/social-links`, input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function followUser(targetUserId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/profiles/${targetUserId}/follow`, undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function unfollowUser(targetUserId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.delete<any>(`/api/profiles/${targetUserId}/follow`, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}