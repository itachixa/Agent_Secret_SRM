const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export type ApiOptions = {
  userId?: string | null;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & ApiOptions = {},
): Promise<T> {
  const { userId, token, headers = {}, ...fetchOptions } = options;
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'X-User-ID': userId } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : typeof data?.message === 'string'
          ? data.message
          : `API request failed with status ${response.status}`;

    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

export const api = {
  get: <T,>(path: string, options?: ApiOptions) =>
    apiRequest<T>(path, { method: 'GET', ...options }),

  post: <T,>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T,>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T,>(path: string, options?: ApiOptions) =>
    apiRequest<T>(path, { method: 'DELETE', ...options }),
};
