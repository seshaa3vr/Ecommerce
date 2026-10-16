export class ApiError extends Error {
  status: number;
  /** Per-field messages from server-side validation, keyed by field path (e.g. "shipping.phone"). */
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  formData?: FormData;
}

/** Calls the store API. Resolves with the JSON body, or throws ApiError with a user-friendly message. */
export async function api<T>(path: string, { method, body, formData }: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: method ?? (body !== undefined || formData ? 'POST' : 'GET'),
    credentials: 'same-origin',
  };
  if (formData) {
    init.body = formData;
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }

  let response: Response;
  try {
    response = await fetch(`/api${path}`, init);
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? 'Something went wrong. Please try again.', data.fields ?? {});
  }
  return data as T;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
