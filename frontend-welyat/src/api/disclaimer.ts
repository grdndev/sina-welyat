import { api } from './client';

export const disclaimerApi = {
  getLatest: () =>
    api.get<{ data: { version: string; content: string } }>('/disclaimer/'),

  accept: (version: string) =>
    api.post<{ success: boolean; data: { token: string } }>('/disclaimer/accept', { version }),
};
