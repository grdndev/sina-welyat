import Layout from '../../components/Layout';
import imgCall from '../../assets/img/becomeListener.jpg';
import Button from '../../components/Button';
import { router } from '../../router';
import {
  CircleChevronRight,
  Heart,
  CircleDollarSign,
  Flame,
  Zap,
  Clock,
  TriangleAlert,
  ArrowBigRight,
  Shield,
  ShieldCheck,
  Mail,
  HatGlasses,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { li, text } from 'framer-motion/client';
import { Link } from 'react-router-dom';

const IconBox = ({
  children,
  color = '#8e5cff',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div
    className="shrink-0 p-2 rounded-xl"
    style={{
      background: `${color}22`,
      border: `1px solid ${color}44`,
    }}
  >
    {children}
  </div>
);

export default function BecomeListener() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-16">
        {/* ── HERO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1 rounded-full w-fit">
              Now hiring listeners
            </span>
            <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Become a <span style={{ color: '#8e5cff' }}>Listener</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Get paid to lend a compassionate ear when people need to talk. Turn empathy into
              income and make a real difference.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Flexible — no schedule required',
                'Work from anywhere',
                'No experience needed',
                'Make a real human impact',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-text-secondary"
                >
                  <IconBox>
                    <CircleChevronRight color="#8e5cff" size={16} />
                  </IconBox>
                  {item}
                </li>
              ))}
            </ul>
            <div className="w-48">
              <Button name="Apply now" typeBtn="button" fn={() => router.navigate('/register')} />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-white/30 h-80">
            <img src={imgCall} alt="Listener" className="w-full h-full object-cover object-top" />
          </div>
        </div>

        {/* ── EARNINGS ── */}
        <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-text-primary font-bold text-xl">Earnings</h2>
              <p className="mt-1 flex items-center gap-2 text-text-secondary text-sm">
                <IconBox>
                  <CircleDollarSign color="#8e5cff" size={16} />
                </IconBox>
                <strong className="text-text-primary">$0.22 per minute</strong>
                <span>(active call only)</span>
              </p>
            </div>
            <div className="flex gap-4 text-sm font-medium text-text-secondary">
              <span className="flex items-center gap-2">
                <IconBox color="#FDD98B">
                  <Flame fill="#FDD98B" color="#FDD98B" size={16} />
                </IconBox>
                Tips = 100% yours
              </span>
              <span className="flex items-center gap-2">
                <IconBox color="#FDD98B">
                  <Zap fill="#FDD98B" color="#FDD98B" size={16} />
                </IconBox>
                XP = extra rewards
              </span>
            </div>
          </div>

          {/* Earning cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { hours: '2h', label: '/day', earn: '$26', period: '/day' },
              { hours: '4h', label: '/day', earn: '$1,584', period: '/month' },
              { hours: '6h', label: '/day', earn: '$2,376', period: '/month' },
            ].map(({ hours, label, earn, period }) => (
              <div
                key={hours}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/20 shadow-md"
                style={{ background: 'linear-gradient(135deg, #b78cff22 0%, #8e5cff33 100%)' }}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <IconBox>
                    <Clock color="#8e5cff" size={14} />
                  </IconBox>
                  <strong className="text-text-primary">{hours}</strong>
                  {label}
                </span>
                <div className="text-2xl font-bold text-text-primary">
                  {earn}
                  <span className="text-sm font-normal text-text-secondary">{period}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <IconBox color="#FDD98B">
                <TriangleAlert fill="#FDD98B" color="#502F7E" size={16} />
              </IconBox>
              Based on <strong className="text-text-primary mx-1">active call time only</strong>{' '}
              (not waiting time)
            </span>
            <span className="flex items-center gap-2">
              <IconBox>
                <ArrowBigRight fill="#8e5cff" color="#8e5cff" size={16} />
              </IconBox>
              More calls = more income
            </span>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What you'll do */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6">
            <h3 className="flex items-center gap-3 font-bold text-text-primary text-lg mb-4">
              <IconBox color="#FDD98B">
                <Heart fill="#FDD98B" color="#FDD98B" size={18} />
              </IconBox>
              What you'll do
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                'Listen actively and with empathy',
                'Support callers through tough moments',
                'Maintain a warm, non-judgmental tone',
                'Respect caller privacy at all times',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-text-secondary"
                >
                  <IconBox>
                    <CircleChevronRight color="#8e5cff" size={16} />
                  </IconBox>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6">
            <h3 className="flex items-center gap-3 font-bold text-text-primary text-lg mb-4">
              <IconBox color="#FDD98B">
                <Shield fill="#FDD98B" color="#FDD98B" size={18} />
              </IconBox>
              Your safety matters
            </h3>
            <ul className="flex flex-col gap-4">
              {[
                { icon: <HatGlasses color="#8e5cff" size={16} />, label: '100% anonymous' },
                {
                  icon: <Mail color="#8e5cff" size={16} />,
                  label: 'No personal information shared',
                },
                {
                  icon: <ShieldCheck color="#FDD98B" size={16} />,
                  label: 'Secure & automatic payments',
                  color: '#FDD98B',
                },
                {
                  icon: <Heart fill="#C954AA" color="#C954AA" size={16} />,
                  label: 'You control your availability',
                  color: '#C954AA',
                },
              ].map(({ icon, label, color }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm font-medium text-text-secondary"
                >
                  <IconBox color={color}>{icon}</IconBox>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── FAQ LINKS ── */}

        {/* ── FAQ ── */}
        <div className="border-t border-white/10 pt-16 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="text-center md:text-left">
              <h4 className="text-text-primary font-bold text-2xl tracking-tight">
                Questions? <span style={{ color: '#8e5cff' }}>We're here.</span>
              </h4>
              <p className="text-text-secondary text-sm mt-1 uppercase tracking-widest font-medium">
                Frequently Asked Questions
              </p>
            </div>
            <Link
              to="/help"
              className="text-xs font-bold text-white uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #b78cff 0%, #8e5cff 50%, #5a2ccb 100%)',
                boxShadow: '0 4px 20px rgba(90, 44, 203, 0.4)',
              }}
            >
              See all help articles
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                text: 'Requirements',
                sub: 'What do I need?',
                path: '/requirements',
                icon: <HatGlasses color="#8e5cff" size={22} />,
                color: '#8e5cff',
              },
              {
                text: 'Payment Method',
                sub: 'How do I get paid?',
                path: '/paid',
                icon: <CircleDollarSign color="#22A854" size={22} />,
                color: '#22A854',
              },
              {
                text: 'Privacy Policy',
                sub: 'Your safety first',
                path: '/privacyPolicy',
                icon: <Shield color="#FDD98B" size={22} />,
                color: '#FDD98B',
              },
              {
                text: 'XP & Rewards',
                sub: 'Level up bonuses',
                path: '/xpRewards',
                icon: <Zap color="#C954AA" size={22} />,
                color: '#C954AA',
              },
            ].map((item) => (
              <Link
                key={item.text}
                to={item.path}
                className="group flex flex-col gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                {/* Icône — même style que IconBox */}
                <div
                  className="w-fit p-3 rounded-xl"
                  style={{
                    background: `${item.color}22`,
                    border: `1px solid ${item.color}44`,
                  }}
                >
                  {item.icon}
                </div>

                {/* Texte */}
                <div className="flex flex-col gap-1">
                  <span className="text-text-primary font-bold text-base">{item.text}</span>
                  <span className="text-text-secondary text-xs">{item.sub}</span>
                </div>

                {/* Footer hover */}
                <div
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                  style={{ color: item.color }}
                >
                  Read more <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
