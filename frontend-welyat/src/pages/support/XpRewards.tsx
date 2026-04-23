import Layout from '../../components/Layout';
import { Zap, Heart, Star, Shield, Info, ArrowRight } from 'lucide-react';

const IconBox = ({
  children,
  color = '#8e5cff',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div
    className="w-12 h-12 rounded-xl flex justify-center items-center shrink-0"
    style={{
      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
      border: `1px solid ${color}44`,
    }}
  >
    {children}
  </div>
);

export default function XpRewards() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
        {/* ── HEADER ── */}
        <div className="text-center space-y-4">
          <div className="inline-flex justify-center items-center p-3 rounded-2xl bg-[#8e5cff]/10 border border-[#8e5cff]/30 mb-2">
            <Zap color="#8e5cff" size={32} />
          </div>
          <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Welyat Listener <span style={{ color: '#8e5cff' }}>Rewards & XP System</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            Turning your empathy into impact
          </p>
        </div>

        {/* ── WHAT IS XP? ── */}
        <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#8e5cff]"></div>
          <div className="flex items-start gap-4">
            <IconBox color="#8e5cff">
              <Star color="#8e5cff" size={24} />
            </IconBox>
            <div>
              <h2 className="font-bold text-2xl text-text-primary mb-3">What is Welyat XP?</h2>
              <p className="text-text-secondary text-base leading-relaxed mb-2">
                XP (Experience Points) is a recognition system that values your listening time during real conversations.
              </p>
              <p className="text-text-secondary text-base leading-relaxed font-semibold">
                XP reflects engagement and contribution. XP is not a wage or salary.
              </p>
            </div>
          </div>
        </div>

        {/* ── XP EARNINGS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-8 rounded-3xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <IconBox color="#22A854">
                <Heart color="#22A854" size={24} />
              </IconBox>
              <h2 className="font-bold text-xl text-text-primary">XP Earnings (Free Period)</h2>
            </div>
            <p className="text-text-secondary text-sm">
              XP is earned during the first 15 minutes of each call:
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/20 border border-white/10">
                <span className="font-medium text-text-primary">5 min</span>
                <span className="font-bold text-[#22A854] flex items-center gap-1"><ArrowRight size={14}/> 1 XP</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/20 border border-white/10">
                <span className="font-medium text-text-primary">10 min</span>
                <span className="font-bold text-[#22A854] flex items-center gap-1"><ArrowRight size={14}/> 2 XP</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/20 border border-white/10">
                <span className="font-medium text-text-primary">15 min max</span>
                <span className="font-bold text-[#22A854] flex items-center gap-1"><ArrowRight size={14}/> 3 XP</span>
              </div>
            </div>
            <div className="mt-2 p-4 rounded-xl bg-[#ee9d07]/10 border border-[#ee9d07]/30 text-sm font-medium text-text-primary text-center">
              After 15 minutes, the conversation becomes PAID ($0.22/min)
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-8 rounded-3xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <IconBox color="#3BA9C3">
                <Zap color="#3BA9C3" size={24} />
              </IconBox>
              <h2 className="font-bold text-xl text-text-primary">XP Conversion & Eligibility</h2>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              XP is accumulated and may be converted monthly into a performance-based bonus.
            </p>
            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex gap-3 text-sm text-text-primary font-medium border-b border-white/10 pb-3">
                <Zap color="#3BA9C3" size={18} className="shrink-0 mt-0.5" />
                <span>XP never expires</span>
              </li>
              <li className="flex gap-3 text-sm text-text-primary font-medium">
                <Shield color="#3BA9C3" size={18} className="shrink-0 mt-0.5" />
                <span>XP is unlocked only if you complete at least one extended conversation (15+ min paid session) during the month</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── XP RULES ── */}
        <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <IconBox color="#ee9d07">
              <Info color="#ee9d07" size={24} />
            </IconBox>
            <h2 className="font-bold text-2xl text-text-primary">XP Rules</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'XP is earned only during unpaid sessions',
              'XP value is calculated monthly',
              'XP has no guaranteed monetary value',
              'XP is not debt, wage, or salary',
              'Exchange rate is floating based on platform performance',
              'XP rewards are discretionary bonuses',
            ].map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/10 rounded-xl border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ee9d07] mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-text-primary">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PURPOSE & SUMMARY ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#8e5cff]/10 to-transparent border border-[#8e5cff]/20 p-6 rounded-3xl">
            <h3 className="font-bold text-lg text-text-primary mb-3">Purpose</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Welyat ensures your listening time is always tracked and recognized, unlike traditional platforms where early engagement is unpaid.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#22A854]/10 to-transparent border border-[#22A854]/20 p-6 rounded-3xl">
            <h3 className="font-bold text-lg text-text-primary mb-3">Summary</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              XP transforms listening time into measurable contribution within a structured recognition system.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}