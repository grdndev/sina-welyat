import {
  Clock, ShieldCheck, CircleDollarSign,
  Phone, MessageCircle, CircleUserRound, ArrowRight,
} from 'lucide-react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div
    className="shrink-0 h-fit p-2 rounded-xl transition-all duration-300"
    style={{
      background: 'linear-gradient(135deg, #7C3AED44, #5B21B666)',
      border: '1px solid rgba(124,58,237,0.3)',
    }}
  >
    {children}
  </div>
);

const cards = [
  { icon: <ShieldCheck color="#F8CD8B" size={20} />, title: 'Is my identity really anonymous?', to: '/termsOfService' },
  { icon: <CircleDollarSign color="#F8CD8B" size={20} />, title: 'How do I get paid as a listener?', to: '/becomeListener' },
  { icon: <Phone color="#F8CD8B" size={20} />, title: 'Can I end a call whenever I want?', to: '/termsOfService' },
  { icon: <Clock color="#F8CD8B" size={20} />, title: 'Is my information secure?', to: '/privacyPolicy' },
  { icon: <MessageCircle color="#F8CD8B" size={20} />, title: 'Are the listeners real humans?', to: '/becomeListener' },
  { icon: <CircleUserRound color="#F8CD8B" size={20} />, title: 'Do I need a subscription?', to: '/why' },
];

export default function Faq() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-8 w-full mx-auto"
        // ✅ max-w réduit pour des cards plus étroites
        style={{ maxWidth: '680px' }}
      >
        <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center">
          Frequently asked <span style={{ color: '#8e5cff' }}>questions</span>
        </h1>
        <p className="mt-5 text-text-secondary text-xl text-center">
          Find answers to common questions about Welyat.
        </p>

        <div className="mt-6 flex flex-col gap-3 w-full">
          {cards.map(({ icon, title, text, to }) => (
            <Link to={to} key={title} className="group block w-full">
              <div
                className="
                  flex items-center justify-between gap-3 px-4 py-3
                  rounded-2xl border shadow-md
                  transition-all duration-300 ease-in-out
                  cursor-pointer
                  bg-white/30 backdrop-blur-md border-white/30
                  hover:bg-white/50
                  hover:border-purple-400/50
                  hover:shadow-purple-200/60
                  hover:shadow-lg
                  hover:-translate-y-0.5
                "
              >
                {/* Icône gauche */}
                <IconBox>{icon}</IconBox>

                {/* Texte */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-text-primary font-bold tracking-wide text-xs uppercase mb-0.5 transition-colors duration-300 group-hover:text-purple-700">
                    {title}
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
                </div>

                {/* Arrow — scale au hover */}
                <div
                  className="shrink-0 h-fit p-2 rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED44, #5B21B666)',
                    border: '1px solid rgba(124,58,237,0.3)',
                  }}
                >
                  <ArrowRight
                    size={16}
                    className="transition-all duration-300 group-hover:translate-x-0.5"
                    color="#7C3AED"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center w-full mt-4 text-center">
          <Link 
            to={'/contact'}
            className="w-72 p-3 rounded-full cursor-pointer font-semibold text-white tracking-wide text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #b78cff 0%, #8e5cff 50%, #5a2ccb 100%)',
              boxShadow: '0 4px 20px rgba(90, 44, 203, 0.4)',
            }}
          >
            Still have questions? Contact Us
          </Link>
        </div>
      </div>
    </Layout>
  );
}