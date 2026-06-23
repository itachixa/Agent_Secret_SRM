import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getConversations(userId?: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>('/api/conversations', { userId });
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function getOrCreateConversation(otherUserId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/conversations', { other_user_id: otherUserId }, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function getMessages(conversationId: string): Promise<ApiResult<any[]>> {
  try {
    const data = await api.get<any[]>(`/api/conversations/${conversationId}/messages`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function sendMessage(conversationId: string, content: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/conversations/${conversationId}/messages`, { content }, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function markConversationRead(conversationId: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/conversations/${conversationId}/read`, undefined, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}
