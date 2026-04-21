import { api } from './client';

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

export const adminApi = {
  getMetrics: () => api.get<{ success: boolean; data: AdminMetrics }>('/admin/metrics'),

  getBusinessModes: () => api.get<{ success: boolean; data: { modes: BusinessMode[] } }>('/admin/business-modes'),
  activateBusinessMode: (id: number) =>
    api.post<{ success: boolean; data: { mode: BusinessMode } }>(`/admin/business-modes/${id}/activate`, {}),

  getCloudStatus: () => api.get<CloudStatus>('/admin/cloud/status'),
  executeRedistribution: (percentage: number) => api.post<void>('/admin/cloud/execute', { percentage }),
};
