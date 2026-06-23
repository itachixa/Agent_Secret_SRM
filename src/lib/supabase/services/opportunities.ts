import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

function qs(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

export async function getOpportunities(type?: string, status?: string): Promise<ApiResult<any[]>> {
  try {
    const query = qs({ type, status });
    const data = await api.get<any[]>(`/api/opportunities${query ? `?${query}` : ''}`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function createOpportunity(input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/opportunities', input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}