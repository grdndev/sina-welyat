import { useState, useEffect } from "react";
import Layout from "./Layout";
import { ChevronRight, Headphones, DollarSign, CheckCircle, Circle, Lock, Phone, Star, Clock } from "lucide-react";
import { listenersApi } from "../../api/listeners";
import { useNavigate } from "react-router-dom";

type PayoutStatus = 'not_started' | 'pending' | 'verified';

type ListenerData = {
  display_name: string;
  earning_today: number;
  available_balance: number;
  total_minutes: number;
  payout_status: PayoutStatus;
  is_online: boolean;
  last_calls: { duration_total: number; rating?: number; date: string }[];
  is_founding?: boolean;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}
function toHM(m: number) {
  return `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<ListenerData | null>(null);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [dismissedSetupOverlay, setDismissedSetupOverlay] = useState(false);
  const [showReadyScreen, setShowReadyScreen] = useState(false);

  useEffect(() => {
    listenersApi.getStatus()
      .then((res) => {
        const listener = res.data.listener as ListenerData;
        setData(listener);

        // Local-only activation screen: show once after returning from Stripe when verified
        try {
          const url = new URL(window.location.href);
          const fromStripe = url.searchParams.get('payout') === 'return';
          const alreadyShown = window.localStorage.getItem('listener_ready_shown') === '1';
          const verified = listener.payout_status === 'verified';

          if (fromStripe && verified && !alreadyShown) {
            setShowReadyScreen(true);
          }
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // Fallback mock for development
        setData({
          display_name: 'Alex',
          earning_today: 0,
          available_balance: 0,
          total_minutes: 0,
          payout_status: 'not_started',
          is_online: false,
          last_calls: [],
        });
      });
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const isSetupDone = data.payout_status === 'verified';
  const isSetupPending = data.payout_status === 'pending';
  const showSetupOverlay = !dismissedSetupOverlay && !isSetupDone;

  async function handleToggleOnline() {
    if (togglingOnline || !data) return;
    setTogglingOnline(true);
    try {
      const res = await listenersApi.toggleOnline();
      setData((prev) => prev ? { ...prev, is_online: res.data.is_online } : prev);
    } catch {
      // ignore
    } finally {
      setTogglingOnline(false);
    }
  }

  function handleGoOnline() {
    setShowReadyScreen(false);
    try {
      window.localStorage.setItem('listener_ready_shown', '1');
      const url = new URL(window.location.href);
      url.searchParams.delete('payout');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
    handleToggleOnline();
  }

  return (
    <Layout>
      <div className="px-3 py-6 relative">
        {/* ── READY SCREEN (after Stripe verification) ── */}
        {showReadyScreen && isSetupDone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center"
              style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}
              >
                <CheckCircle size={28} color="white" />
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2">You're ready 🎉</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Your account has been verified. You can now go online and start listening to callers on Welyat.
              </p>

              <button
                onClick={handleGoOnline}
                className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(122,76,255,0.35)' }}
              >
                GO ONLINE
              </button>
              <div className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Start listening to callers instantly
              </div>

              <button
                onClick={() => {
                  setShowReadyScreen(false);
                  try {
                    window.localStorage.setItem('listener_ready_shown', '1');
                    const url = new URL(window.location.href);
                    url.searchParams.delete('payout');
                    window.history.replaceState({}, '', url.toString());
                  } catch {
                    // ignore
                  }
                }}
                className="mt-5 text-center text-xs underline transition"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {/* ── LOCKED OVERLAY ── */}
        {showSetupOverlay && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-white mb-1">You're almost ready</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Complete your setup to start listening to callers
                </p>
              </div>

              {/* Checklist */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle size={20} className="text-green-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Account created</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: isSetupPending ? 'rgba(245,197,66,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isSetupPending ? 'rgba(245,197,66,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {isSetupPending
                    ? <Clock size={20} style={{ color: '#F5C542' }} className="shrink-0" />
                    : <Circle size={20} style={{ color: 'rgba(255,255,255,0.3)' }} className="shrink-0" />
                  }
                  <div>
                    <div className="text-sm font-semibold text-white">Set up your payouts</div>
                    {isSetupPending && (
                      <div className="text-xs mt-0.5" style={{ color: '#F5C542' }}>Verification in progress</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-center mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Step {isSetupPending ? '1' : '1'} of 2 completed
              </div>

              <div className="flex flex-col gap-3">
                {!isSetupPending && (
                  <button
                    onClick={() => navigate('/listener/payout-setup')}
                    className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(122,76,255,0.35)' }}
                  >
                    Complete payout setup
                  </button>
                )}
                {isSetupPending && (
                  <div className="w-full py-3 rounded-xl font-bold text-center text-white/60 border border-white/10">
                    Verification in progress…
                  </div>
                )}
                <button
                  onClick={() => setDismissedSetupOverlay(true)}
                  className="text-center text-xs underline transition"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex md:flex-row flex-col gap-4">
          {/* ── LEFT: Revenue ── */}
          <div className="md:w-5/18 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
            <div className="text-xl font-bold uppercase tracking-wider">Earnings</div>

            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">Today</div>
              <div className="text-4xl font-extrabold text-text-primary">${data.earning_today.toFixed(2)}</div>
            </div>

            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">Total balance</div>
              <div className="text-4xl font-extrabold text-text-primary">${data.available_balance.toFixed(2)}</div>
              {!isSetupDone && (
                <button
                  onClick={() => navigate('/listener/payout-setup')}
                  className="mt-3 w-full text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
                  style={{ background: 'rgba(122,76,255,0.1)', color: '#8e5cff', border: '1px solid rgba(122,76,255,0.2)' }}
                >
                  <Lock size={12} />
                  {isSetupPending ? 'Payouts pending verification' : 'Complete payout setup'}
                </button>
              )}
            </div>

            {/* Listening time */}
            <div className="rounded-xl border border-primary/10 bg-background p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">Listening time</div>
              <div className="flex items-center gap-3">
                <Headphones size={36} className="text-primary opacity-70" />
                <div className="text-3xl font-bold">{toHM(data.total_minutes)}</div>
              </div>
            </div>

            {/* Genesis badge (moved here) */}
            {data.is_founding && (
              <div className="flex items-center justify-start">
                <div
                  className="px-5 py-3 rounded-full text-[11px] font-extrabold uppercase tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.20), rgba(255,255,255,0.06))',
                    border: '1px solid rgba(255,215,0,0.40)',
                    color: 'rgba(255,215,0,0.95)',
                  }}
                  title="Genesis listener"
                >
                  Genesis listener
                </div>
              </div>
            )}
          </div>

          {/* ── CENTER: GO ONLINE + Call history ── */}
          <div className="flex flex-col gap-4 grow">
            {/* GO ONLINE button */}
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-6 flex flex-col items-center gap-4">
              <div className="text-xl font-bold uppercase tracking-wider self-start">Start listening</div>

              <div className="flex flex-col items-center gap-3 py-4">
                <button
                  disabled={!isSetupDone || togglingOnline}
                  onClick={handleToggleOnline}
                  className="relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={!isSetupDone ? {
                    background: 'rgba(142,92,255,0.15)',
                    border: '2px dashed rgba(142,92,255,0.3)',
                  } : data.is_online ? {
                    background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                    boxShadow: '0 8px 30px rgba(34,197,94,0.45)',
                  } : {
                    background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                    boxShadow: '0 8px 30px rgba(122, 76, 255, 0.45)',
                  }}
                >
                  {!isSetupDone ? (
                    <Lock size={36} style={{ color: '#8e5cff' }} />
                  ) : (
                    <Phone size={52} color="white" />
                  )}
                </button>
                <div className="text-center">
                  <div className="font-bold text-lg text-text-primary">
                    {data.is_online ? 'GO OFFLINE' : 'GO ONLINE'}
                  </div>
                  {!isSetupDone
                    ? <div className="text-sm text-text-secondary mt-1">Complete payout setup to unlock</div>
                    : data.is_online
                    ? <div className="text-sm mt-1" style={{ color: '#4ade80' }}>You are online — callers can reach you</div>
                    : <div className="text-sm text-text-secondary mt-1">Start listening to callers instantly</div>
                  }
                </div>
              </div>
            </div>

            {/* Last calls */}
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
              <div className="text-xl font-bold uppercase tracking-wider mb-3">Call history</div>
              {data.last_calls.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-text-secondary text-sm gap-3 py-10">
                  <Phone size={40} className="opacity-30" />
                  <p>No calls yet.<br />Go online to receive your first call!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.last_calls.map((call, i) => (
                    <div key={i} className="rounded-xl border border-primary/10 bg-background p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-text-secondary">{formatDate(call.date)}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={13} className="text-primary" />
                          <span className="font-semibold text-sm">{toHM(call.duration_total)}</span>
                        </div>
                      </div>
                      {call.rating && (
                        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#FFD700' }}>
                          <Star size={12} fill="currentColor" /> {call.rating}/5
                        </div>
                      )}
                      <ChevronRight size={16} className="text-text-secondary" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Payout status ── */}
          <div className="flex flex-col gap-3 md:w-5/18 rounded-2xl border border-primary/10 bg-gradient-to-br from-background-from to-background-to p-4">
            <div className="text-xl font-bold uppercase tracking-wider">Setup status</div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-green-500/10 p-3">
                <CheckCircle size={18} className="text-green-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">Account created</div>
                  <div className="text-xs text-text-secondary">Welcome, {data.display_name}!</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 rounded-xl p-3 border ${
                isSetupDone
                  ? 'border-emerald-400/30 bg-green-500/10'
                  : isSetupPending
                  ? 'border-yellow-400/30 bg-yellow-500/10'
                  : 'border-primary/10 bg-background'
              }`}>
                {isSetupDone
                  ? <CheckCircle size={18} className="text-green-400 shrink-0" />
                  : isSetupPending
                  ? <Clock size={18} style={{ color: '#F5C542' }} className="shrink-0" />
                  : <DollarSign size={18} className="text-primary/50 shrink-0" />
                }
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {isSetupDone ? 'Payouts enabled' : isSetupPending ? 'Verification in progress' : 'Payouts not set up'}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {isSetupDone ? 'You can receive payments' : 'Required to get paid'}
                  </div>
                </div>
              </div>
            </div>

            {!isSetupDone && !isSetupPending && (
              <button
                onClick={() => navigate('/listener/payout-setup')}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(122,76,255,0.3)' }}
              >
                Complete payout setup
              </button>
            )}

            <div className="mt-auto rounded-xl border border-primary/10 bg-background p-3">
              <div className="text-sm font-bold uppercase tracking-wider mb-2">How payouts work</div>
              <ul className="flex flex-col gap-1.5 text-xs text-text-secondary">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Paid manually every week</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> 100% of tips go to you</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Stripe handles all transfers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
