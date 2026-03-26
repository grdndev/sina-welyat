import Layout from '../../components/Layout';
import backgroundx from '../../assets/img/contact.jpg';
import Field from '../../components/Field';
import Textarea from '../../components/Textera';
import Button from '../../components/Button';
import { MapPin, Phone, Mail } from 'lucide-react';

const IconBox = ({ children, color = '#8e5cff' }: { children: React.ReactNode; color?: string }) => (
  <div 
    className="w-16 h-16 rounded-2xl flex justify-center items-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
    style={{ 
      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`, 
      border: `1px solid ${color}44` 
    }}
  >
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
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12">

        {/* ── HEADER ── */}
        <div className="text-center space-y-3">
          <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Have a question ? We'd love to hear from you. Our team will get back to you as soon as possible.
          </p>
        </div>

        {/* ── FORM + IMAGE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Image - 5 columns on Desktop */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative min-h-[300px] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10 pointer-events-none" />
            <img 
              src={backgroundx} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Contact workspace" 
            />
          </div>

          {/* Form - 7 columns on Desktop */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 sm:p-10 rounded-3xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mb-8">
              <h2 className="font-bold text-2xl sm:text-3xl text-text-primary">Send us a message</h2>
              <p className="mt-2 text-sm sm:text-base text-text-secondary">
                Your satisfaction comes first. We strive to deliver exceptional service and support.
              </p>
            </div>
            
            <form className="flex flex-col gap-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field title="Your name" name="name" required placeholder="John Doe" />
                <Field title="Email" name="email" type="email" required placeholder="john@gmail.com" />
              </div>
              <Textarea title="Message" name="description" required placeholder="How can we help?" rows={4} />
              
              <div className="pt-4">
                <Button name="Send message" typeBtn="submit" className="w-full sm:w-auto px-8 py-3" />
              </div>
            </form>
          </div>
        </div>

        {/* ── CONTACT INFO (Individual Cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactInfos.map(({ icon, color, label, value }) => (
            <div 
              key={label} 
              className="group bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 shadow-lg p-8 rounded-3xl flex flex-col items-center gap-4 text-center cursor-default hover:-translate-y-1"
            >
              <IconBox color={color}>{icon}</IconBox>
              <div>
                <strong className="block text-text-primary text-lg mb-1">{label}</strong>
                <span className="text-text-secondary text-sm font-medium">{value}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}