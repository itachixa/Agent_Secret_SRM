import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getProjects(status?: string): Promise<ApiResult<any[]>> {
  try {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
    const data = await api.get<any[]>(`/api/projects${query}`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function createProject(input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/projects', input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}
