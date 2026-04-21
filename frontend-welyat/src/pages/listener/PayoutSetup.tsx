import { useState } from 'react';
import Layout from './Layout';
import { DollarSign, CheckCircle, ArrowLeft, Lock, ExternalLink } from 'lucide-react';
import { listenersApi } from '../../api/listeners';
import { useNavigate } from 'react-router-dom';

export default function PayoutSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSetup() {
    setLoading(true);
    setError('');
    try {
      const res = await listenersApi.setupPayout();
      const { url } = res.data;
      window.location.href = url;
    } catch (e: any) {
      setError(e.response?.data?.error?.message ?? 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center py-12 px-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="w-full max-w-lg">
          <button
            onClick={() => navigate('/listener')}
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition mb-6"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>

          <div
            className="rounded-3xl p-8 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}
            >
              <DollarSign size={30} color="white" />
            </div>

            <h1 className="text-2xl font-extrabold text-white text-center mb-1">
              Receive your earnings
            </h1>
            <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Add your payout method to start getting paid
            </p>

            {/* What happens */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { step: '1', label: 'Create your Stripe account', sub: 'Secure & compliant payout account' },
                { step: '2', label: 'Complete identity verification', sub: 'Required by financial regulations' },
                { step: '3', label: 'Add your bank details', sub: 'For weekly payouts' },
                { step: '4', label: 'You\'re ready to earn', sub: 'Payments every week automatically' },
              ].map(({ step, label, sub }) => (
                <div key={step} className="flex items-center gap-4 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}
                  >
                    {step}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl mb-4 py-2 px-4 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSetup}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 6px 24px rgba(122,76,255,0.4)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Continue…
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  Continue
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <Lock size={11} />
              Secured by Stripe. Your information is encrypted.
            </div>
          </div>

          {/* Info note */}
          <div className="mt-4 rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(142,92,255,0.08)', border: '1px solid rgba(142,92,255,0.2)' }}>
            <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary">
              After completing Stripe setup, your account status will update automatically. You'll receive a confirmation email once verified.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
