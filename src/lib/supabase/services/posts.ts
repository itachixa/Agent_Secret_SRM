import { api } from '../../api/client';

type ApiResult<T> = { data: T | null; error: Error | null };

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function getPosts(type?: string): Promise<ApiResult<any[]>> {
  try {
    const query = type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : '';
    const data = await api.get<any[]>(`/api/posts${query}`);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: toError(error) };
  }
}

export async function createPost(input: Record<string, unknown>, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>('/api/posts', input, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function createPostComment(postId: string, content: string, userId?: string): Promise<ApiResult<any>> {
  try {
    const data = await api.post<any>(`/api/posts/${postId}/comments`, { content }, { userId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function toggleLikePost(postId: string, liked: boolean, userId?: string): Promise<ApiResult<any>> {
  try {
    if (liked) {
      const data = await api.post<any>(`/api/posts/${postId}/like`, undefined, { userId });
      return { data, error: null };
    } else {
      const data = await api.delete<any>(`/api/posts/${postId}/like`, { userId });
      return { data, error: null };
    }
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

export async function toggleBookmarkPost(postId: string, bookmarked: boolean, userId?: string): Promise<ApiResult<any>> {
  try {
    if (bookmarked) {
      const data = await api.post<any>(`/api/posts/${postId}/bookmark`, undefined, { userId });
      return { data, error: null };
    } else {
      const data = await api.delete<any>(`/api/posts/${postId}/bookmark`, { userId });
      return { data, error: null };
    }
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}