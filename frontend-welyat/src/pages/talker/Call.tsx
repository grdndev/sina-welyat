import { useState, useEffect, useRef } from 'react';
import {
  PhoneOff, Star, Mic, MicOff,
  AlertTriangle, CheckCircle, CreditCard, ArrowLeft,
  PhoneCall, Mail, ChevronRight, Lock, Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { authApi } from '../../api/auth';
import { useAuth } from '../../middlewares/Auth';

// ─── Constants ────────────────────────────────────────────────────────────────
const FREE_MINUTES = 15;
const PER_MINUTE_RATE = 0.33;
const SERVICE_FEE = 0.20;
const PREAUTH_AMOUNT = 10;

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'filters'
  | 'preauth_form'
  | 'preauth_processing'
  | 'preauth_fail'
  | 'auth'
  | 'matching'
  | 'active'
  | 'limit_warn'
  | 'ended'
  | 'postcall'
  | 'complete';

type AgeFilter = 'any' | '18-25' | '25-40' | '40+';

// ─── Utils ────────────────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  if (digits.length === 2) return digits + '/';
  return digits;
}

function calculateBilling(callSeconds: number) {
  const totalMinutes = callSeconds / 60;
  const billableMinutes = Math.max(0, totalMinutes - FREE_MINUTES);
  const extra = parseFloat((billableMinutes * PER_MINUTE_RATE).toFixed(2));
  const total = parseFloat((SERVICE_FEE + extra).toFixed(2));
  const freeMinutes = Math.min(totalMinutes, FREE_MINUTES);
  return { serviceFee: SERVICE_FEE, extra, total, freeMinutes, billableMinutes };
}

// ─── Ambient sound hook ───────────────────────────────────────────────────────
function useAmbientSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      try {
        if (gainRef.current && ctxRef.current) {
          gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.4);
          const c = ctxRef.current;
          setTimeout(() => { try { c.close(); } catch { /* ignore */ } }, 1200);
        }
      } catch { /* ignore */ }
      ctxRef.current = null;
      gainRef.current = null;
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);
      master.connect(ctx.destination);
      gainRef.current = master;

      // Soft Am chord: A2, E3, A3, C4, E4
      [110, 164.81, 220, 261.63, 329.63].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow vibrato
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2 + i * 0.05, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(master);
        osc.start();
        lfo.start();
      });
    } catch { /* ignore — no audio context */ }

    return () => {
      try {
        if (gainRef.current && ctxRef.current) {
          gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.4);
          const c = ctxRef.current;
          setTimeout(() => { try { c.close(); } catch { /* ignore */ } }, 1200);
        }
      } catch { /* ignore */ }
    };
  }, [enabled]);
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-3 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={36}
            fill={(hovered || value) >= n ? '#FFD700' : 'none'}
            color={(hovered || value) >= n ? '#FFD700' : '#ccc'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Tip Selector ─────────────────────────────────────────────────────────────
const TIP_PRESETS = [1, 2, 5, 10];

function TipSelector({ value, onChange }: { value: number | null; onChange: (n: number | null) => void }) {
  const [custom, setCustom] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {TIP_PRESETS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => { setIsCustom(false); onChange(amount); }}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition"
            style={{
              background: !isCustom && value === amount ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
              color: !isCustom && value === amount ? 'white' : '#6F6F7A',
              borderColor: !isCustom && value === amount ? 'transparent' : '#e5e7eb',
            }}
          >
            ${amount}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setIsCustom(true); onChange(null); }}
          className="px-4 py-2 rounded-xl text-sm font-bold border transition"
          style={{
            background: isCustom ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
            color: isCustom ? 'white' : '#6F6F7A',
            borderColor: isCustom ? 'transparent' : '#e5e7eb',
          }}
        >
          Other
        </button>
      </div>
      {isCustom && (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 text-sm font-bold">$</span>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="0.00"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); onChange(parseFloat(e.target.value) || null); }}
            className="border border-gray-200 rounded-xl p-2 pl-7 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-32"
            style={{ '--tw-ring-color': '#8e5cff' } as any}
          />
        </div>
      )}
    </div>
  );
}

// ─── Shared layout wrapper ────────────────────────────────────────────────────
function Screen({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: dark
          ? 'linear-gradient(160deg, #1E1024 0%, #0D0620 100%)'
          : 'linear-gradient(135deg, #EFEAF9 0%, #E6DFF7 100%)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Call() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [phase, setPhase] = useState<Phase>('filters');

  // Filter state (sent to backend on call initiation)
  const [filterGender, setFilterGender] = useState<'any' | 'male' | 'female'>('any');
  const [filterAge, setFilterAge] = useState<AgeFilter>('any');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Call state
  const [callSeconds, setCallSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [limitWarningSeconds, setLimitWarningSeconds] = useState(8);

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Post-call state
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);

  // Ambient sound during matching phase
  useAmbientSound(phase === 'matching');

  // Call timer
  useEffect(() => {
    if (phase !== 'active') return;
    const id = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Limit warning countdown → auto-end
  useEffect(() => {
    if (phase !== 'limit_warn') return;
    if (limitWarningSeconds <= 0) { setPhase('ended'); return; }
    const id = setInterval(() => setLimitWarningSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, limitWarningSeconds]);

  // Auto-advance: matching → active after ~3 s
  useEffect(() => {
    if (phase !== 'matching') return;
    const id = setTimeout(() => setPhase('active'), 3200);
    return () => clearTimeout(id);
  }, [phase]);

  // Pre-auth processing mock: 1 s then check login
  useEffect(() => {
    if (phase !== 'preauth_processing') return;
    const id = setTimeout(() => {
      const APP_ID = import.meta.env.VITE_APP_ID || 'sina-welyat';
      const raw = localStorage.getItem(`${APP_ID}tokens`);
      try {
        const tokens = JSON.parse(raw || 'null');
        if (tokens?.token) {
          setPhase('matching');
        } else {
          setPhase('auth');
        }
      } catch {
        setPhase('auth');
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [phase]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = authMode === 'login'
        ? await authApi.login(authPhone, authPassword)
        : await authApi.register(authPhone, authPassword, authEmail || undefined);
      setSession!(res.data.user as any, { token: res.data.token });
      setPhase('matching');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }

  function handlePreAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhase('preauth_processing');
  }

  function handleEndCall() {
    setPhase('ended');
  }

  function handleLimitWarning() {
    setLimitWarningSeconds(8);
    setPhase('limit_warn');
  }

  function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPostSubmitted(true);
    setTimeout(() => setPhase('complete'), 800);
  }

  const billing = calculateBilling(callSeconds);
  const freePct = Math.min(100, (callSeconds / (FREE_MINUTES * 60)) * 100);
  const isPaid = callSeconds > FREE_MINUTES * 60;

  return (
    <>
      {/* ──────────── SCREEN 0: FILTERS ──────────── */}
      {phase === 'filters' && (
        <Screen>
          <button
            onClick={() => navigate('/talker')}
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <img src={logo} width={40} className="mb-4 opacity-80" alt="Welyat" />

          <div className="w-full max-w-lg">
            <p className="text-center text-xs font-semibold mb-1" style={{ color: '#a0a0b0' }}>Step 3 of 6</p>
            <h1 className="text-3xl font-extrabold text-text-primary text-center mb-1">
              Who would you like to talk to?
            </h1>
            <p className="text-center text-sm mb-8" style={{ color: '#6F6F7A' }}>
              We'll find someone who feels right for you.
            </p>

            {/* Gender Preference */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-text-primary">
                <span>♀♂</span> Gender Preference
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: 'any', label: 'No preference', price: 0 },
                  { value: 'female', label: 'Female', price: 2 },
                  { value: 'male', label: 'Male', price: 2 },
                ] as const).map(({ value, label, price }) => {
                  const selected = filterGender === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setFilterGender(value)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition border-2"
                      style={{
                        borderColor: selected ? '#7A4CFF' : '#e5e7eb',
                        background: selected ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
                        color: selected ? 'white' : '#6F6F7A',
                      }}
                    >
                      {selected && <CheckCircle size={14} />}
                      {label}{price > 0 ? ` +$${price}` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age Preference */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-text-primary">
                <span>🎂</span> Age Preference
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: 'any', label: 'No preference', price: 0 },
                  { value: '18-25', label: '18–25', price: 1 },
                  { value: '25-40', label: '25–40', price: 1 },
                  { value: '40+', label: '40+', price: 1 },
                ] as const).map(({ value, label, price }) => {
                  const selected = filterAge === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setFilterAge(value)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition border-2"
                      style={{
                        borderColor: selected ? '#7A4CFF' : '#e5e7eb',
                        background: selected ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
                        color: selected ? 'white' : '#6F6F7A',
                      }}
                    >
                      {selected && <CheckCircle size={14} />}
                      {label}{price > 0 ? ` (+$${price})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-sm mb-5" style={{ color: '#6F6F7A' }}>
              Take your time — or skip and start instantly.
            </p>

            {(() => {
              const filterCost = (filterGender !== 'any' ? 2 : 0) + (filterAge !== 'any' ? 1 : 0);
              return (
                <>
                  <button
                    onClick={() => setPhase('preauth_form')}
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg transition hover:opacity-90 mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                      boxShadow: '0 6px 24px rgba(122,76,255,0.4)',
                    }}
                  >
                    {filterCost > 0 ? `Continue — $${filterCost} extra` : 'Continue'}
                  </button>
                  <button
                    onClick={() => {
                      setFilterGender('any');
                      setFilterAge('any');
                      setPhase('preauth_form');
                    }}
                    className="w-full py-2 text-sm font-semibold underline transition"
                    style={{ color: '#6F6F7A' }}
                  >
                    Start instantly (no filters)
                  </button>
                </>
              );
            })()}
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 2: PRE-AUTH FORM ──────────── */}
      {phase === 'preauth_form' && (
        <Screen>
          <button
            onClick={() => setPhase('filters')}
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="w-full max-w-sm">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Lock size={18} style={{ color: '#8E5CFF' }} />
              <span className="text-sm font-semibold" style={{ color: '#8E5CFF' }}>Secure payment</span>
            </div>

            <h2 className="text-2xl font-extrabold text-text-primary text-center mb-1">
              Add your card
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: '#6F6F7A' }}>
              Pre-authorization of <strong>${PREAUTH_AMOUNT}</strong> — not charged now
            </p>

            <form onSubmit={handlePreAuthSubmit} className="flex flex-col gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-4">
                {/* Card number */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Card number</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2" style={{ '--tw-ring-color': '#8e5cff' } as any}>
                    <CreditCard size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                      className="ml-2 w-full p-3 text-sm bg-transparent focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Expiry */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 font-mono"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                  </div>
                  {/* CVC */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">CVC</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      required
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 font-mono"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Name on card</label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                  boxShadow: '0 6px 24px rgba(122,76,255,0.4)',
                }}
              >
                Confirmer — ${PREAUTH_AMOUNT} pre-authorized
              </button>

              <p className="text-center text-xs" style={{ color: '#6F6F7A' }}>
                <Lock size={10} className="inline mr-1" />
                SSL encrypted. You will not be charged now.
              </p>
            </form>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 3: PRE-AUTH PROCESSING ──────────── */}
      {phase === 'preauth_processing' && (
        <Screen>
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}>
                <Lock size={28} color="white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-text-primary mb-1">Verifying payment…</h2>
              <p className="text-sm" style={{ color: '#6F6F7A' }}>Pre-authorization of ${PREAUTH_AMOUNT} — this will not be charged</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#8E5CFF', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 3b: AUTH ──────────── */}
      {phase === 'auth' && (
        <Screen>
          <button
            onClick={() => setPhase('preauth_form')}
            className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <img src={logo} width={40} className="mb-4 opacity-80" alt="Welyat" />

          <div className="w-full max-w-sm">
            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
              {(['login', 'register'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setAuthMode(mode); setAuthError(''); }}
                  className="flex-1 py-2.5 text-sm font-bold transition"
                  style={{
                    background: authMode === mode ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
                    color: authMode === mode ? 'white' : '#6F6F7A',
                  }}
                >
                  {mode === 'login' ? 'Log in' : 'Create account'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold text-text-primary text-center mb-1">
              {authMode === 'login' ? 'Welcome back' : 'Almost there'}
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: '#6F6F7A' }}>
              {authMode === 'login'
                ? 'Log in to connect to your listener.'
                : 'Create a free account to start your call.'}
            </p>

            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-4">
                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Phone number</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2" style={{ '--tw-ring-color': '#8e5cff' } as any}>
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <input
                      type="tel"
                      placeholder="+33 6 00 00 00 00"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      required
                      className="ml-2 w-full p-3 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email (register only) */}
                {authMode === 'register' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Email <span className="font-normal normal-case" style={{ color: '#a0a0b0' }}>(optional)</span></label>
                    <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2" style={{ '--tw-ring-color': '#8e5cff' } as any}>
                      <Mail size={15} className="text-gray-400 shrink-0" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="ml-2 w-full p-3 text-sm bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                </div>
              </div>

              {authError && (
                <p className="text-xs text-center font-semibold" style={{ color: '#ef4444' }}>{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition hover:opacity-90 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                  boxShadow: '0 6px 24px rgba(122,76,255,0.4)',
                }}
              >
                {authLoading ? 'Connecting…' : authMode === 'login' ? 'Log in & connect' : 'Create account & connect'}
              </button>

              <p className="text-center text-xs" style={{ color: '#6F6F7A' }}>
                <Lock size={10} className="inline mr-1" />
                Your session is private and secure.
              </p>
            </form>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 4: MATCHING ──────────── */}
      {phase === 'matching' && (
        <Screen dark>
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Pulsing rings */}
            <div className="relative flex items-center justify-center w-60 h-60">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border animate-ping"
                  style={{
                    width: `${160 + i * 40}px`,
                    height: `${160 + i * 40}px`,
                    borderColor: `rgba(183,140,255,${0.3 - i * 0.08})`,
                    animationDelay: `${i * 0.6}s`,
                    animationDuration: '2.5s',
                  }}
                />
              ))}
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center z-10"
                style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)', boxShadow: '0 0 60px rgba(122,76,255,0.5)' }}
              >
                <PhoneCall size={48} color="white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Connecting you to a listener…</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Usually less than 20 seconds
              </p>
            </div>

            <div className="flex gap-2 items-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Soft ambient music playing…
            </div>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 5: ACTIVE CALL ──────────── */}
      {phase === 'active' && (
        <Screen dark>
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {isPaid ? 'Paid call in progress' : 'Free call in progress'}
              </span>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div
                className="text-7xl font-mono font-black tracking-tight"
                style={{ color: isPaid ? '#FFD700' : 'white' }}
              >
                {formatDuration(callSeconds)}
              </div>
              <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {isPaid
                  ? `+${formatDuration(callSeconds - FREE_MINUTES * 60)} paid · ${billing.extra.toFixed(2)} $`
                  : `${Math.floor(Math.max(0, FREE_MINUTES * 60 - callSeconds) / 60)}m${((FREE_MINUTES * 60 - callSeconds) % 60).toString().padStart(2,'0')}s free remaining`
                }
              </div>
            </div>

            {/* Free time progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span>0:00</span>
                <span>15 min free</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${freePct}%`,
                    background: isPaid
                      ? 'linear-gradient(90deg, #FFD700, #F5C542)'
                      : 'linear-gradient(90deg, #7A4CFF, #B78CFF)',
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-6 items-center">
              <button
                onClick={() => setMuted(!muted)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition"
                style={{ background: muted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)' }}
              >
                {muted
                  ? <MicOff size={22} color="#ef4444" />
                  : <Mic size={22} color="white" />
                }
              </button>

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="w-20 h-20 rounded-full flex items-center justify-center transition hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 8px 30px rgba(239,68,68,0.5)',
                }}
              >
                <PhoneOff size={32} color="white" />
              </button>

              {/* Placeholder spacer */}
              <div className="w-14 h-14" />
            </div>

            {/* Demo: simulate limit */}
            <button
              onClick={handleLimitWarning}
              className="text-xs underline opacity-30 hover:opacity-60 transition"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              ↗ Simulate limit reached
            </button>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 6: LIMIT WARNING ──────────── */}
      {phase === 'limit_warn' && (
        <Screen dark>
          <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,197,66,0.15)', border: '2px solid rgba(245,197,66,0.4)' }}>
              <AlertTriangle size={28} style={{ color: '#F5C542' }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white mb-2">
                We're reaching your session limit.
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                The call will end shortly.
              </p>
            </div>
            <div
              className="text-5xl font-mono font-black"
              style={{ color: '#F5C542' }}
            >
              {limitWarningSeconds}s
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Call ending in {limitWarningSeconds} seconds
            </p>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 7: ENDED ──────────── */}
      {phase === 'ended' && (
        <Screen>
          <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
            <img src={logo} width={44} className="opacity-80" alt="Welyat" />

            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">
                You're not alone.
              </h2>
              <p className="text-sm" style={{ color: '#6F6F7A' }}>
                You can come back anytime.
              </p>
            </div>

            {/* Billing summary */}
            <div className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm text-left">
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6F6F7A' }}>
                Call summary
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#6F6F7A' }}>Total duration</span>
                  <span className="font-semibold text-text-primary">{formatDuration(callSeconds)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6F6F7A' }}>Free minutes</span>
                  <span className="font-semibold text-text-primary">
                    {Math.min(billing.freeMinutes, FREE_MINUTES).toFixed(1)} min
                  </span>
                </div>
                {billing.billableMinutes > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: '#6F6F7A' }}>Paid minutes</span>
                    <span className="font-semibold text-text-primary">
                      {billing.billableMinutes.toFixed(1)} min × $0.33
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: '#6F6F7A' }}>Service fee</span>
                  <span className="font-semibold text-text-primary">${SERVICE_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 mt-1">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="font-extrabold text-lg" style={{ color: '#8E5CFF' }}>
                    ${billing.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => { setPhase('filters'); setCallSeconds(0); setRating(0); setTip(null); setEmail(''); setPostSubmitted(false); }}
                className="flex-1 py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)', boxShadow: '0 4px 16px rgba(122,76,255,0.35)' }}
              >
                Talk again
              </button>
              <button
                onClick={() => setPhase('postcall')}
                className="flex-1 py-3 rounded-xl font-bold border border-gray-200 bg-white text-text-primary hover:bg-gray-50 transition"
              >
                Continuer <ChevronRight size={16} className="inline" />
              </button>
            </div>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 8: POST-CALL ──────────── */}
      {phase === 'postcall' && (
        <Screen>
          <div className="w-full max-w-4xl">
            <h2 className="text-3xl font-extrabold text-text-primary text-center mb-1">
              How was your call?
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: '#6F6F7A' }}>
              Your feedback helps our listeners improve.
            </p>

            <form onSubmit={handlePostSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rating */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                    <Star size={16} fill="#FFD700" color="#FFD700" /> Rating
                  </div>
                  {rating === 5 && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                      EXCELLENT 👑
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-text-primary text-center mt-1">Rate your listener</div>
                <StarRating value={rating} onChange={setRating} />
                {rating === 0 ? (
                  <p className="text-xs text-center" style={{ color: '#a0a0b0' }}>
                    Your feedback helps us improve — please rate your listener
                  </p>
                ) : (
                  <p className="text-xs text-center font-semibold" style={{ color: '#8E5CFF' }}>
                    {[
                      '',
                      'This didn\'t feel right.',
                      'Something was missing.',
                      'It was okay.',
                      'Good conversation.',
                      'I felt heard. Thank you.',
                    ][rating]}
                  </p>
                )}
              </div>

              {/* Tip */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  🤑 Tip <span className="font-normal text-xs" style={{ color: '#6F6F7A' }}>(Optional)</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary mb-0.5">Leave a tip</div>
                  <div className="text-xs" style={{ color: '#6F6F7A' }}>Optional — 100% goes to the listener</div>
                </div>
                <TipSelector value={tip} onChange={setTip} />
                {tip !== null && (
                  <div className="text-xs text-center mt-1" style={{ color: '#6F6F7A' }}>
                    Total Tip: <strong>${tip}</strong> <span style={{ color: '#a0a0b0' }}>(example)</span>
                  </div>
                )}
              </div>

              {/* Care & check-in */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  💬 Care &amp; Check-in
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary mb-0.5">
                    Want us to check in on you?
                  </div>
                  <div className="text-xs" style={{ color: '#6F6F7A' }}>
                    Life happens. We'll send you a supportive message in a few hours to see how you're doing.
                  </div>
                </div>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2" style={{ '--tw-ring-color': '#8e5cff' } as any}>
                  <Mail size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ml-2 w-full p-2.5 text-sm bg-transparent focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#a0a0b0' }}>
                  <Lock size={11} /> Secure &amp; Confidential
                </div>
              </div>

              {/* Submit — spans full width */}
              <div className="md:col-span-3 flex flex-col gap-3">
                {rating === 0 && (
                  <p className="text-center text-xs font-semibold" style={{ color: '#ef4444' }}>
                    Please rate your listener before submitting.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={postSubmitted || rating === 0}
                  className="w-full py-4 rounded-2xl font-bold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                    boxShadow: rating > 0 ? '0 6px 24px rgba(122,76,255,0.4)' : 'none',
                  }}
                >
                  {postSubmitted ? 'Sending…' : '[ Submit Feedback ]'}
                </button>

                <button
                  type="button"
                  disabled={rating === 0}
                  onClick={() => setPhase('complete')}
                  className="text-center text-sm underline disabled:opacity-40 disabled:cursor-not-allowed transition"
                  style={{ color: '#6F6F7A' }}
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </Screen>
      )}

      {/* ──────────── SCREEN 9: COMPLETE ──────────── */}
      {phase === 'complete' && (
        <Screen>
          <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)', boxShadow: '0 8px 30px rgba(122,76,255,0.4)' }}
            >
              <CheckCircle size={38} color="white" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-text-primary mb-2">
                Thank you for being here.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6F6F7A' }}>
                You're not alone. <br />
                Come back whenever you need.
              </p>
            </div>

            {email && (
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3 w-full"
                style={{ background: 'rgba(142,92,255,0.08)', border: '1px solid rgba(142,92,255,0.15)' }}
              >
                <Mail size={16} style={{ color: '#8E5CFF' }} />
                <span className="text-xs text-text-primary">
                  We will reach out at <strong>{email}</strong>
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => { setPhase('filters'); setCallSeconds(0); setRating(0); setTip(null); setEmail(''); setPostSubmitted(false); }}
                className="w-full py-4 rounded-2xl font-bold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 6px 24px rgba(122,76,255,0.4)' }}
              >
                Talk again
              </button>
              <button
                onClick={() => navigate('/talker')}
                className="w-full py-3 rounded-2xl font-semibold border border-gray-200 bg-white text-text-primary hover:bg-gray-50 transition"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        </Screen>
      )}
    </>
  );
}
