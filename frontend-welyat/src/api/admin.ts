import { api } from './client';

export type AdminSession = {
  id: string;
  status: string;
  duration_free_seconds: number;
  duration_paid_seconds: number;
  total_cost_client: number;
  total_payout_listener: number;
  created_at: string;
  ended_at: string | null;
  talker: { id: string; email: string; firstname: string | null; lastname: string | null } | null;
  listener: { id: string; email: string; firstname: string | null; lastname: string | null } | null;
  BusinessMode: { mode_name: string } | null;
};

export type AdminAnalytics = {
  totalUsers: number;
  totalCalls: number;
  activeListeners: number;
  activeTalkers: number;
  callsPerDay: { date: string; count: number; paidMinutes: number }[];
  revenuePerDay: { date: string; revenue: number }[];
};

export type AdminUser = {
  id: string;
  email: string;
  phone: string | null;
  firstname: string | null;
  lastname: string | null;
  role: string;
  is_founding: boolean;
  founding_end_date: string | null;
  is_active: boolean;
  total_xp: number;
  reputation_score: number;
  bonus_seconds: number;
  created_at: string;
};

export type Pagination = { total: number; limit: number; offset: number };

export type AdminMetrics = {
  netProfitPerPaidMinuteMonth: number;
  paidMinutesToday: number;
  paidMinutesWeek: number;
  paidMinutesMonth: number;
  revenueMonth: number;
  costsMonth: number;
  costsBreakdown: {
    payoutsMonth: number;
    bridgeFeesMonth: number;
    xpRedistributionMonth: number;
    twilioCostsMonth: number;
    stripeFeesMonth: number;
    infraCostsMonth: number;
  };
};

export type BusinessMode = {
  id: number;
  mode_name: string;
  is_active: boolean;
  // allow extra config fields without breaking
  [key: string]: unknown;
};

export type CloudStatus = {
  total_xp: number;
  estimated_pool: number;
  eligible_ratio: number;
};

export type TechFee = {
  id: number;
  type: string;
  amount_cents: number;
  incurred_at: string | null;
};

export const adminApi = {
  getMetrics: () => api.get<{ success: boolean; data: AdminMetrics }>('/admin/metrics'),

  getBusinessModes: () => api.get<{ success: boolean; data: { modes: BusinessMode[] } }>('/admin/business-modes'),
  activateBusinessMode: (id: number) =>
    api.post<{ success: boolean; data: { mode: BusinessMode } }>(`/admin/business-modes/${id}/activate`, {}),
  updateBusinessMode: (id: number, fields: Partial<Omit<BusinessMode, 'id' | 'mode_name' | 'is_active'>>) =>
    api.patch<{ success: boolean; data: { mode: BusinessMode } }>(`/admin/business-modes/${id}`, fields),

  getCloudStatus: () => api.get<CloudStatus>('/admin/cloud/status'),
  executeRedistribution: (percentage: number) => api.post<void>('/admin/cloud/execute', { percentage }),

  getSessions: (params: { status?: string; limit?: number; offset?: number; from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.limit != null) qs.set('limit', String(params.limit));
    if (params.offset != null) qs.set('offset', String(params.offset));
    if (params.from) qs.set('from', params.from);
    if (params.to) qs.set('to', params.to);
    return api.get<{ success: boolean; data: AdminSession[]; pagination: Pagination }>(`/admin/sessions?${qs}`);
  },

  getAnalytics: () => api.get<{ success: boolean; data: AdminAnalytics }>('/admin/analytics'),

  getUsers: (params: { search?: string; role?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.role) qs.set('role', params.role);
    if (params.limit != null) qs.set('limit', String(params.limit));
    if (params.offset != null) qs.set('offset', String(params.offset));
    return api.get<{ success: boolean; data: AdminUser[]; pagination: Pagination }>(`/admin/users?${qs}`);
  },

  promoteUser: (id: string) => api.post<void>(`/admin/users/${id}/promote-founding`, {}),
  banUser: (id: string, ban: boolean) => api.post<{ success: boolean; data: { is_active: boolean } }>(`/admin/users/${id}/ban`, { ban }),
  grantMinutes: (id: string, minutes: number) => api.post<{ success: boolean; data: { bonus_seconds: number } }>(`/admin/users/${id}/grant-minutes`, { minutes }),

  refundSession: (id: string) => api.post<{ success: boolean; data: { refunded_amount: number } }>(`/admin/sessions/${id}/refund`, {}),

  getDisclaimer: () => api.get<{ data: { version: number; content: string } }>('/disclaimer/'),
  updateDisclaimer: (content: string) =>
    api.post<{ success: boolean; data: { version: number } }>('/disclaimer/update', { content }),

  getFees: () => api.get<{ success: boolean; data: { fees: TechFee[] } }>('/admin/fees'),
  updateFees: ({ twilio, infra, stripe }: { twilio: number; infra: number; stripe: number }) =>
    api.post<{ success: boolean; data: { twilio: number; infra: number; stripe: number } }>('/admin/fees', { twilio, infra, stripe }),
};
