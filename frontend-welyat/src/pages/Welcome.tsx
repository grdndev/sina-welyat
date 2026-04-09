import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middlewares/Auth';
import { PhoneCall, LayoutDashboard, Heart, Shield, Clock, Star, ChevronRight, Headphones, Settings } from 'lucide-react';
import logo from '../assets/logo.png';
import LogoutButton from '../components/LogoutButton';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const, delay },
});

// ─── Role configs ─────────────────────────────────────────────────────────────

const roleConfig = {
  talker: {
    greeting: 'Ready to talk?',
    sub: "You don't have to carry this alone. A real person is ready to listen.",
    color: '#8E5CFF',
    highlights: [
      { icon: Heart, label: '15 minutes free', desc: 'Every session, no commitment' },
      { icon: Clock, label: 'Connected in ~20s', desc: 'Real listeners, available now' },
      { icon: Shield, label: 'Fully anonymous', desc: 'No name, no judgment' },
    ],
    primary: { label: 'Talk to someone now', icon: PhoneCall, to: '/call' },
    secondary: { label: 'My dashboard', to: '/talker' },
  },
  listener: {
    greeting: 'Welcome back.',
    sub: 'Your empathy makes a real difference. People are waiting to be heard.',
    color: '#8E5CFF',
    highlights: [
      { icon: Headphones, label: 'Be available', desc: "Go online when you're ready" },
      { icon: Star, label: 'Earn & grow', desc: 'XP, tips, and reputation' },
      { icon: Shield, label: 'Safe & private', desc: 'Your identity stays protected' },
    ],
    primary: { label: 'Go to my dashboard', icon: LayoutDashboard, to: '/listener' },
    secondary: null,
  },
  admin: {
    greeting: 'Admin panel',
    sub: 'Manage the platform, validate listeners, and monitor activity.',
    color: '#8E5CFF',
    highlights: [
      { icon: Settings, label: 'Platform control', desc: 'Modes, analytics, payouts' },
      { icon: Shield, label: 'Listener validation', desc: 'Review pending applications' },
      { icon: Star, label: 'Cloud XP', desc: 'Distribute and monitor rewards' },
    ],
    primary: { label: 'Open admin panel', icon: LayoutDashboard, to: '/admin' },
    secondary: null,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = (user?.role as keyof typeof roleConfig) ?? 'talker';
  const config = roleConfig[role] ?? roleConfig.talker;
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, #EFEAF9 0%, #E6DFF7 100%)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/20 backdrop-blur-sm">
        <img src={logo} width={44} alt="Welyat" />
        <LogoutButton />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg flex flex-col items-center gap-8">

          {/* Greeting */}
          <motion.div {...fadeUp(0)} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#8E5CFF' }}>
              Hey, {firstName} 👋
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-3">
              {config.greeting}
            </h1>
            <p className="text-base max-w-sm mx-auto leading-relaxed" style={{ color: '#6F6F7A' }}>
              {config.sub}
            </p>
          </motion.div>

          {/* Highlights */}
          <motion.div {...fadeUp(0.12)} className="w-full grid grid-cols-3 gap-3">
            {config.highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/60"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}
                >
                  <Icon size={18} color="white" />
                </div>
                <span className="text-xs font-bold text-text-primary leading-tight">{label}</span>
                <span className="text-xs leading-tight" style={{ color: '#6F6F7A' }}>{desc}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.22)} className="w-full flex flex-col gap-3">
            <button
              onClick={() => navigate(config.primary.to)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition hover:opacity-90 hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                boxShadow: '0 8px 28px rgba(122, 76, 255, 0.4)',
              }}
            >
              <config.primary.icon size={20} />
              {config.primary.label}
            </button>

            {config.secondary && (
              <button
                onClick={() => navigate(config.secondary!.to)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold border border-white/60 bg-white/50 backdrop-blur-sm text-text-primary hover:bg-white/70 transition text-sm"
              >
                {config.secondary.label}
                <ChevronRight size={16} />
              </button>
            )}
          </motion.div>

          {/* Bottom quote */}
          <motion.p {...fadeUp(0.32)} className="text-center text-xs italic" style={{ color: '#9B8CB8' }}>
            "You don't have to be alone tonight."
          </motion.p>
        </div>
      </main>
    </div>
  );
}
