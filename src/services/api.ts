const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export type ApiError = {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
};

export class ApiClientError extends Error {
  status: number;
  data: ApiError | null;

  constructor(status: number, message: string, data: ApiError | null = null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

export type RequestOptions = {
  token?: string | null;
  headers?: Record<string, string>;
};

function buildUrl(path: string) {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorBody = isJson ? (body as ApiError) : null;
    const message = errorBody?.message || response.statusText || 'Error de conexion con la API';
    throw new ApiClientError(response.status, message, errorBody);
  }

  return body as T;
}

async function request<T>(method: string, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

export const apiClient = {
  baseUrl: API_BASE_URL,
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, undefined, options),
};
