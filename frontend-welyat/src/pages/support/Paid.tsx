import Layout from '../../components/Layout';
import imgCover from '../../assets/img/paid-cover.png';
import imgOne from '../../assets/img/paid-1.png';
import imgTwo from '../../assets/img/paid-2.png';
import imgTree from '../../assets/img/paid-3.png';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';
import { router } from '../../router';

const cards = [
  { title: 'Get Paid Weekly', image: imgOne, text: 'Earnings transfer automatically every week' },
  {
    title: 'Direct Bank Transfer',
    image: imgTwo,
    text: 'Payments reliably sent to your bank account',
  },
  { title: 'Cash Out Anytime', image: imgTree, text: 'Withdraw earnings your preferred method' },
];

export default function Paid() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
        {/* ── HEADER ── */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider">
            How do I get <span style={{ color: '#8e5cff' }}>paid</span>?
          </h1>
          <p className="text-text-secondary text-lg">Weekly bank payouts, fast and secure</p>
        </div>

        {/* ── IMAGE COVER ── */}
        <img
          src={imgCover}
          alt=""
          className="rounded-2xl shadow-xl border border-white/30 w-full object-cover"
        />

        {/* ── CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(({ title, image, text }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg text-center transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <img src={image} alt={title} className="w-16 h-16 object-contain" />
              <h2 className="text-text-primary font-bold text-base">{title}</h2>
              <p className="text-text-secondary text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col items-center gap-3 mt-4 text-center">
          <h4 className="text-text-primary font-bold text-xl">Ready to start earning?</h4>
          <p className="text-text-secondary text-sm">Free to join · Weekly payouts · 100% Secure</p>
          <div className="w-56 mt-2">
            <Button
              name="Apply to Listen"
              typeBtn="button"
              fn={() => router.navigate('/becomeListener')}
            />
          </div>
        </div>

      </div>
    </Layout>
  );
}
