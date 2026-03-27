import Layout from '../../components/Layout';
import img from '../../assets/img/why.png';
import Button from '../../components/Button';
import { icons, ShieldCheck, UserLock, Clock } from 'lucide-react';
import { router } from '../../router';

const IconBox = ({
  children,
  color = '#8e5cff',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div
    className="w-16 h-16 rounded-2xl flex justify-center items-center "
    style={{
      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
      border: `1px solid ${color}44`,
    }}
  >
    {children}
  </div>
);

const cards = [
  {
    icon: <ShieldCheck color="#8e5cff" size={28} />,
    color: '#8e5cff',
    label: 'No AI, No Judgment',
    value: 'Connect with empathetic, human listeners. No robots, no judgments — just real.',
  },
  {
    icon: <UserLock color="#22A854" size={28} />,
    color: '#22A854',
    label: 'Safe & Anonymous',
    value: 'Speak freely with total privacy. No sharing of personal info, ever.',
  },
  {
    icon: <Clock color="#3BA9C3" size={28} />,
    color: '#3BA9C3',
    label: 'When You Need It',
    value: 'Day or night, we’re here. No subscriptions, no commitments.',
  },
];

export default function Why() {
  return (
    <Layout>
      <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
        What is <span style={{ color: '#8e5cff' }}>Welyat</span> ?
      </h1>
      <p className="text-text-secondary text-3xl font-medium mx-auto">
        A listening ear, without the fear.
      </p>

      <div className="mt-10 flex flex-col justify-center items-center  gap-4">
        <div className="text-text-secondary text-2xl font-normal">
          <p>An anonymous place to talk to real humans who just listen – anytime youve need.</p>
        </div>

        <img
          src={img}
          alt=""
          className="m-4 p-4 rounded-2xl overflow-hidden bg-white/30 backdrop-blur-md border border-white/30 shadow-lg"
        />

        {/*Card*/}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(({ icon, color, label, value }) => (
            <div
              key={label}
              className="group bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-8 rounded-3xl flex flex-col items-center gap-4 text-center cursor-default "
            >
              <IconBox color={color}>{icon}</IconBox>
              <div>
                <strong className="block text-text-primary text-lg mb-1">{label}</strong>
                <span className="text-text-secondary text-sm font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col items-center gap-3 mt-4 text-center">
          <h4 className="text-text-primary font-bold text-xl">Feel heard, finally</h4>
          <p className="text-text-secondary text-sm">Join our safe space today • 100% Anonymous • Real humans</p>
          <div className="w-56 mt-2">
            <Button
              name="Start Your First Call"
              typeBtn="button"
              fn={() => router.navigate('/register')}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
