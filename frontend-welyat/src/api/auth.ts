import { api } from './client';

export interface AuthResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            firstname: string | null;
            lastname: string | null;
            phone: string;
            email: string | null;
            role: string;
            reputation_score: number;
            is_active: boolean;
        };
        token: string;
    };
}

export const authApi = {
    login: (phone: string, password: string) =>
        api.post<AuthResponse>('/auth/login', { phone, password }),

    register: (phone: string, password: string, email?: string) =>
        api.post<AuthResponse>('/auth/register', {
            phone,
            password,
            email: email || undefined,
            role: 'talker',
        }),

    registerListener: (formData: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        age: string;
        gender: string;
        password: string;
        languages: string[];
        days: string[];
        slots: string[];
    }) =>
        api.post<AuthResponse>('/auth/register', {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            age: formData.age,
            gender: formData.gender,
            password: formData.password,
            languages: formData.languages,
            days: formData.days,
            slots: formData.slots,
            role: 'listener',
        }),

    me: () => api.get<{ success: boolean; data: { user: AuthResponse['data']['user'] } }>('/auth/me'),

    verifyMagicLink: (token: string) =>
        api.get<AuthResponse>(`/auth/magic/${token}`),
};
