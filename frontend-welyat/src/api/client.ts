const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const APP_ID = import.meta.env.VITE_APP_ID || "sina-welyat";

function storageKey(key: string) {
  return `${APP_ID}${key}`;
}

function clearAuthStorage() {
  try {
    localStorage.removeItem(storageKey("tokens"));
    localStorage.removeItem(storageKey("user"));
  } catch {
    // ignore
  }
}

function getToken(): string | null {
  try {
    const tokens = JSON.parse(localStorage.getItem(storageKey("tokens")) || "null");
    return tokens?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(((options.headers as Record<string, string>) ?? {}) as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    clearAuthStorage();
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data as any)?.error?.message || (data as any)?.message || "Request failed");
  }

  return data as T;
}

async function requestForm<T = any>(path: string, body: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  if (res.status === 401 || res.status === 403) {
    clearAuthStorage();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data as any)?.error?.message || (data as any)?.message || "Request failed");
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>(path),
  post: <T = any>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  postForm: <T = any>(path: string, body: FormData) => requestForm<T>(path, body),
  patch: <T = any>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};
