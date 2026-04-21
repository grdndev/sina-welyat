import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { CheckCircle, Zap, Shield, Crown, X, Loader2 } from 'lucide-react';
import { subscriptionsApi, type SubscriptionPlan, type UserSubscription } from '../../api/subscriptions';

const PLANS: {
  id?: string;
  name: string;
  price: number;
  freeMinutes: number;
  features: string[];
  notIncluded: string[];
  icon: React.ReactNode;
  color: string;
  gradient: string;
}[] = [
  {
    name: 'Essential',
    price: 9.99,
    freeMinutes: 300,
    features: ['300 free minutes / month', 'Gender filter', 'Fast-track matching'],
    notIncluded: ['Age filter', 'Priority matching'],
    icon: <Zap size={22} />,
    color: '#8E5CFF',
    gradient: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
  },
  {
    name: 'Comfort',
    price: 19.99,
    freeMinutes: 720,
    features: ['720 free minutes / month', 'Gender filter', 'Age filter', 'Fast-track matching'],
    notIncluded: ['Priority matching'],
    icon: <Shield size={22} />,
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
  },
  {
    name: 'Elite',
    price: 49.99,
    freeMinutes: 2400,
    features: [
      '2400 free minutes / month',
      'Gender filter',
      'Age filter',
      'Fast-track matching',
      'Priority matching',
    ],
    notIncluded: [],
    icon: <Crown size={22} />,
    color: '#F5C542',
    gradient: 'linear-gradient(135deg, #F5A623 0%, #FFD700 100%)',
  },
];

export default function Subscriptions() {
  const navigate = useNavigate();
  const [currentSub, setCurrentSub] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    subscriptionsApi
      .getCurrent()
      .then((res) => setCurrentSub(res.data.subscription))
      .catch(() => setCurrentSub(null))
      .finally(() => setLoading(false));
  }, []);

  const currentPlanName = currentSub?.Subscription?.name ?? null;

  async function handleSubscribe(planName: string, planId?: string) {
    if (!planId) {
      setError('Plan not available yet — please try again later.');
      return;
    }
    setSubscribing(planName);
    setError(null);
    setSuccess(null);
    try {
      await subscriptionsApi.subscribe(planId);
      setSuccess(`You are now subscribed to ${planName}!`);
      const res = await subscriptionsApi.getCurrent();
      setCurrentSub(res.data.subscription);
    } catch (e: any) {
      setError(e.message || 'Subscription failed.');
    } finally {
      setSubscribing(null);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    setSuccess(null);
    try {
      await subscriptionsApi.cancel();
      setSuccess('Your subscription has been cancelled.');
      setCurrentSub(null);
    } catch (e: any) {
      setError(e.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
            Choose your plan
          </h1>
          <p className="text-text-secondary text-sm">
            Get more free minutes and unlock filters to find the right listener.
          </p>
        </div>

        {/* Current plan banner */}
        {currentPlanName && (
          <div className="mb-8 flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-primary" />
              <span className="font-semibold text-text-primary text-sm">
                Active plan: <strong>{currentPlanName}</strong>
                {currentSub?.Subscription && (
                  <span className="text-text-secondary font-normal ml-2">
                    · {currentSub.Subscription.free_minutes_per_month} min/month free
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition disabled:opacity-50"
            >
              {cancelling ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              Cancel plan
            </button>
          </div>
        )}

        {/* Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl text-sm text-green-700 bg-green-50 border border-green-200">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              // Match server plan by name to get real id
              const serverPlan = plans.find((p) => p.name === plan.name);
              const isActive = currentPlanName === plan.name;
              const isLoading = subscribing === plan.name;

              return (
                <div
                  key={plan.name}
                  className="relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-200"
                  style={{
                    borderColor: isActive ? plan.color : 'rgba(0,0,0,0.08)',
                    boxShadow: isActive ? `0 0 0 2px ${plan.color}40` : undefined,
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-6 text-white"
                    style={{ background: plan.gradient }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {plan.icon}
                      <span className="font-extrabold text-lg tracking-tight">{plan.name}</span>
                      {isActive && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-extrabold">
                      ${plan.price}
                      <span className="text-sm font-normal opacity-70 ml-1">/month</span>
                    </div>
                    <div className="text-sm opacity-80 mt-1">
                      {plan.freeMinutes} free minutes / month
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-3 p-6 flex-1 bg-white/60 backdrop-blur-sm">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-text-primary">
                        <CheckCircle size={15} style={{ color: plan.color, flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-text-secondary opacity-50">
                        <X size={15} style={{ flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="p-4 bg-white/40">
                    {isActive ? (
                      <div
                        className="w-full py-3 rounded-2xl text-sm font-bold text-center"
                        style={{ background: `${plan.color}15`, color: plan.color }}
                      >
                        Current plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.name, serverPlan?.id)}
                        disabled={!!subscribing || cancelling}
                        className="w-full py-3 rounded-2xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ background: plan.gradient }}
                      >
                        {isLoading && <Loader2 size={15} className="animate-spin" />}
                        {isLoading ? 'Subscribing…' : `Subscribe to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-text-secondary mt-8">
          You can cancel at any time. Filters are only active if your subscription plan includes them.
        </p>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/talker')}
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
