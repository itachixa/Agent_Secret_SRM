import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getForumQuestions(): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/forum/questions');
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function getForumQuestion(id: string): Promise<ApiResult<any>> {
  try {
    const data = await api.get<any>(`/api/forum/questions/${id}`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function createForumQuestion(input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/forum/questions', input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function createForumAnswer(questionId: string, content: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/forum/questions/${questionId}/answers`, { content }, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function voteForumQuestion(questionId: string, value: -1 | 1, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/forum/questions/${questionId}/vote?value=${value}`, undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function voteForumAnswer(answerId: string, value: -1 | 1, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/forum/answers/${answerId}/vote?value=${value}`, undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}