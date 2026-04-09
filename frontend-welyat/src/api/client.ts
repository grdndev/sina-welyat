const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const APP_ID = import.meta.env.VITE_APP_ID || 'sina-welyat';

function getToken(): string | null {
    try {
        const tokens = JSON.parse(localStorage.getItem(`${APP_ID}tokens`) || 'null');
        return tokens?.token ?? null;
    } catch {
        return null;
    }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message || 'Request failed');
    }

    return data;
}

async function requestForm<T = any>(path: string, body: FormData): Promise<T> {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Request failed');
    return data;
}

export const api = {
    get: <T = any>(path: string) => request<T>(path),
    post: <T = any>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    postForm: <T = any>(path: string, body: FormData) => requestForm<T>(path, body),
    patch: <T = any>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
};
