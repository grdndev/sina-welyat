import { api } from './client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  free_minutes_per_month: number;
  fast_track_matching: boolean;
  priority_matching: boolean;
  gender_filter: boolean;
  age_filter: boolean;
  price_per_month: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_id: string;
  is_active: boolean;
  stripe_subscription_id: string | null;
  subscribed_at: string;
  Subscription?: SubscriptionPlan;
}

export const subscriptionsApi = {
  getCurrent: () =>
    api.get<{ success: boolean; data: { subscription: UserSubscription | null } }>(
      '/subscriptions/current'
    ),

  subscribe: (subscriptionId: string) =>
    api.post<{ success: boolean; data: UserSubscription }>('/subscriptions/subscribe', {
      subscriptionId,
    }),

  cancel: () =>
    api.post<{ success: boolean; message: string }>('/subscriptions/cancel', {}),
};
