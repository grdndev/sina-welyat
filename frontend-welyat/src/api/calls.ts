import { api } from './client';

export interface InitiateCallResponse {
  success: boolean;
  data: {
    call_id: string;
    status: string;
    listener: { id: string; reputation_score: number };
  };
}

export interface ActiveCallResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
    started_at: string | null;
    talker: { id: string; email: string; reputation_score: number };
    listener: { id: string; email: string; reputation_score: number };
  } | null;
}

export const callsApi = {
  initiate: (params: { gender?: string; age_min?: number; age_max?: number }) =>
    api.post<InitiateCallResponse>('/calls/initiate', params),

  getActive: () =>
    api.get<ActiveCallResponse>('/calls/active'),

  end: (callId: string) =>
    api.post<{ success: boolean; message: string }>(`/calls/${callId}/end`, {}),

  rate: (callId: string, data: { rating: number; comment?: string }) =>
    api.post<{ success: boolean; message: string }>(`/calls/${callId}/rate`, data),

  getPaymentStatus: () =>
    api.get<{ success: boolean; data: { hasPaymentMethod: boolean } }>('/calls/payment-status'),

  setupPayment: () =>
    api.post<{ url: string }>('/calls/setup-payment', {}),

  finalizeSetup: () =>
    api.post<{ success: boolean; data: { hasPaymentMethod: boolean } }>('/calls/finalize-setup', {}),

  secondPreauth: (callId: string) =>
    api.post<{ success: boolean }>(`/calls/${callId}/second-preauth`, {}),
};
