import Layout from '../../components/Layout';
import backgroundx from '../../assets/img/contact.jpg';
import Field from '../../components/Field';
import Textarea from '../../components/Textera';
import Button from '../../components/Button';
import { MapPin, Phone, Mail } from 'lucide-react';

const IconBox = ({ children, color = '#8e5cff' }: { children: React.ReactNode; color?: string }) => (
  <div className="size-16 rounded-xl flex justify-center items-center shrink-0"
    style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
    {children}
  </div>
);

const contactInfos = [
  { icon: <MapPin color="#ee9d07" size={28} />, color: '#ee9d07', label: 'Address',  value: "785 avenue de l'alverne" },
  { icon: <Phone color="#22A854" size={28} />,  color: '#22A854', label: 'Contact',  value: '0262 01 32 12' },
  { icon: <Mail  color="#3BA9C3" size={28} />,  color: '#3BA9C3', label: 'Email',    value: 'support@welyat.com' },
];

export default function Contact() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">

        <h1 className="text-text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
          Contact
        </h1>

        {/* ── FORM + IMAGE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-white/30 h-full min-h-64">
            <img src={backgroundx} className="w-full h-full object-cover" alt="Contact" />
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-2xl text-text-primary">Send us a message</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Your satisfaction comes first. We strive to deliver exceptional service and support.
              </p>
            </div>
            <form className="flex flex-col gap-4">
              <Field title="Your name" name="name" required placeholder="John" />
              <Field title="Email" name="email" type="email" required placeholder="john@gmail.com" />
              <Textarea title="Message" name="description" required placeholder="How can we help?" rows={4} />
              <Button name="Send message" typeBtn="submit" className='mt-10' />
            </form>
          </div>
        </div>

        {/* ── CONTACT INFO ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl">
          {contactInfos.map(({ icon, color, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-3 text-center">
              <IconBox color={color}>{icon}</IconBox>
              <strong className="text-text-primary">{label}</strong>
              <span className="text-text-secondary text-sm">{value}</span>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}