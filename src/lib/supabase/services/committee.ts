import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getCommittee(): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/committee');
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}