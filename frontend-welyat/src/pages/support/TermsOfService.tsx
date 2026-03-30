import {
  CreditCard, Clock, ShieldCheck, Newspaper,
  IdCard, HatGlasses, CircleX, TriangleAlert, Mail,
} from 'lucide-react';
import Layout from '../../components/Layout';
import pdf from '../../assets/pdf/welyat_terms_of_services.pdf';

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="shrink-0 h-fit p-2 rounded-xl"
    style={{ background: 'linear-gradient(135deg, #7C3AED44, #5B21B666)', border: '1px solid rgba(124,58,237,0.3)' }}>
    {children}
  </div>
);

const cards = [
  { icon: <Newspaper color="#F8CD8B" size={22} />, title: 'Overview', text: "These Terms govern your use of Welyat's services, providing a safe and opening environment for listeners and callers." },
  { icon: <IdCard color="#F8CD8B" size={22} />, title: 'Eligibility', text: 'Listeners must be at least 18 years old, and pass a voice test to join.' },
  { icon: <CreditCard color="#F8CD8B" size={22} />, title: 'Payments & Billing', text: 'Earns are calculated per second. Payouts are automatic, sent weekly.' },
  { icon: <Clock color="#F8CD8B" size={22} />, title: 'Free Minutes Policy', text: 'First 15 minutes of listening are free and can convert to paid if the session is extended and the caller agrees.' },
  { icon: <ShieldCheck color="#F8CD8B" size={22} />, title: 'Cancellations', text: 'Callers and listeners can hang up any time. Billing stops instantly when calls end.' },
  { icon: <HatGlasses color="#F8CD8B" size={22} />, title: 'Privacy & Data', text: 'Your identity is always anonymous. See our Privacy Policy for more details.' },
  { icon: <CircleX color="#F8CD8B" size={22} />, title: 'Prohibited Use', text: 'Abusive language, harassment, or any illegal activities are strictly forbidden.' },
  { icon: <TriangleAlert color="#F8CD8B" size={22} />, title: 'Liability & Disclaimers', text: 'Welyat is not a replacement for professional medical or legal advice. Use is at your own risk.' },
];

export default function TermsOfService() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-8 w-full max-w-5xl mx-auto">

        <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Terms of <span style={{ color: '#8e5cff' }} > Services </span>
        </h1>
        <p className="text-text-secondary">Clear rules. Full transparency. Always in control.</p>
        <div className="py-2 px-5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-sm">
         <strong>Last updated: April 2026</strong>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {cards.map(({ icon, title, text }) => (
            <div key={title} className="flex gap-3 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
              <IconBox>{icon}</IconBox>
              <div>
                <h2 className="text-text-primary font-bold tracking-wide text-sm uppercase mb-1">{title}</h2>
                <p className="text-sm text-text-secondary">{text}</p>
              </div>
            </div>
          ))}

          {/* Contact — full width */}
          <div className="md:col-span-2 flex gap-3 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
            <IconBox><Mail color="#F8CD8B" size={22} /></IconBox>
            <div>
              <h2 className="text-text-primary font-bold tracking-wide text-sm uppercase mb-1">Contact</h2>
              <p className="text-sm text-text-secondary">Reach out to us at support@welyat.com for any questions about these Terms.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full mt-4">
          <button
            className="w-80 p-3 rounded-full cursor-pointer font-semibold text-white tracking-wide text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #b78cff 0%, #8e5cff 50%, #5a2ccb 100%)',
              boxShadow: '0 4px 20px rgba(90, 44, 203, 0.4)',
            }}
            onClick={()=> open(pdf) }

          >
            Download PDF
          </button>
        </div>
      </div>
    </Layout>
  );
}