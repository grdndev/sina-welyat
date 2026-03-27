import {
  CreditCard,
  Clock,
  Newspaper,
  IdCard,
  HatGlasses,
  CircleX,
  TriangleAlert,
  Mail,
  Check,
  CircleUserRound,
  Mic,
  LaptopMinimal,
  ShieldCheck,
  PanelTop,
  Star,
  Sun,
  Heart,
  Phone,
  ArrowRight,
  Stars,
} from 'lucide-react';
import Layout from '../../components/Layout';
import img from '../../assets/img/requirements.png';
import { Link } from 'react-router-dom';

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div
    className="shrink-0 h-fit p-2 rounded-xl"
    style={{
      background: 'linear-gradient(135deg, #7C3AED44, #5B21B666)',
      border: '1px solid rgba(124,58,237,0.3)',
    }}
  >
    {children}
  </div>
);

const cards = [
  {
    icon: <CircleUserRound color="#F8CD8B" size={22} />,
    title: 'Age & Eligibility',
    textOne: '18+ years old',
    textTwo: 'Independent Contractor',
  },
  {
    icon: <Mic color="#F8CD8B" size={22} />,
    title: 'Voice & Communication',
    textOne: 'Clear & calm voice',
    textTwo: 'Pass a short voice test',
  },

  {
    icon: <LaptopMinimal color="#F8CD8B" size={22} />,
    title: 'Technical Setup',
    textOne: 'Stable internet',
    textTwo: 'Quiet environment',
  },
  {
    icon: <ShieldCheck color="#F8CD8B" size={22} />,
    title: 'Emotional Maturity',
    textOne: 'Non-judgmental',
    textTwo: 'Stay composed & respectful',
  },

  {
    icon: <PanelTop color="#F8CD8B" size={22} />,
    title: 'Availability',
    textOne: 'Flexible schedule',
    textTwo: 'Go online anytime',
  },
  {
    icon: <Star color="#F8CD8B" size={22} />,
    title: 'Performance Standards',
    textOne: 'Minimum rating ⭐ 4.7/5',
    textTwo: 'Follow platform rules',
  },
];

export default function Requirements() {
  return (
    <Layout>
      <h1 className="text-text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
        What Are the <span className="text-[#8e5cff] mr-2"> Requirements</span>?
      </h1>
      <p className="text-text-secondary text-2xl"> Become a Premium Listener on Welyat</p>

      <img
        src={img}
        alt=""
        className="m-4 rounded-2xl overflow-hidden shadow-xl border-2 border-rounded-2xl border-white/30"
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {cards.map(({ icon, title, textOne, textTwo }) => (
          <div
            key={title}
            className="flex gap-3 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg"
          >
            <IconBox>{icon}</IconBox>
            <div>
              <h2 className="text-text-primary font-bold tracking-wide text-sm uppercase mb-1">
                {title}
              </h2>
              <p className="text-sm text-text-secondary flex items-center">{textOne}</p>
              <p className="text-sm text-text-secondary flex items-center">{textTwo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Start Listening ── */}
      <div className="mt-10 flex flex-col items-center gap-5 py-10 text-center">
        <h3 className="text-text-primary text-3xl font-bold tracking-wide">
          Start Listening. Grow. Earn.
        </h3>

        {/* Pills simples */}
        <div className="flex items-center gap-4 text-text-secondary text-base font-medium">
          <span className="flex items-center gap-2">
            <Phone fill="#F8CD8B" color="#F8CD8B" size={18} /> Flexibility
          </span>
          <span className="text-text-secondary opacity-40">|</span>
          <span className="flex items-center gap-2">
            <Heart fill="#F8CD8B" color="#F8CD8B" size={18} /> Impact
          </span>
          <span className="text-text-secondary opacity-40">|</span>
          <span className="flex items-center gap-2">
            <Sun fill="#F8CD8B" color="#F8CD8B" size={18} /> Income
          </span>
        </div>

        {/* Steps */}
        <Link
          to="/register"
          className="flex items-center gap-2 text-text-primary text-base hover:text-shadow-text-primary-home transition-colors"
        >
          <span>Simple sign-up · Voice test · Get approved in 24h</span>
          <ArrowRight size={16} className="text-[#8e5cff]" />
        </Link>
      </div>
    </Layout>
  );
}
