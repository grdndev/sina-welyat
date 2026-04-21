import { api } from './client';

export const listenersApi = {
  getStatus: () => api.get('/listeners/status'),
  setupPayout: () => api.post('/listeners/setup-payout', {}),
  getPayoutStatus: () => api.get('/listeners/payout-status'),
};
