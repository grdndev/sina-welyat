import Layout from '../../components/Layout';
// Importation des icônes Lucide
import { Ban, Megaphone, ShieldAlert, MicOff, UserX, Lock, AlertTriangle } from 'lucide-react';

export default function CommunityGuidelines() {
  return (
    <Layout>
      {/* Header Section - EXACTEMENT comme Privacy Policy */}
      <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
        Community <span style={{ color: '#8e5cff' }}>Guidelines</span>
      </h1>
      <p className="text-text-secondary text-xl font-medium mt-2">
        Our rules for a safe and respectful experience on Welyat.
      </p>

      {/* Content Container - EXACTEMENT comme Privacy Policy */}
      <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 flex flex-col gap-8 text-text-primary leading-relaxed">
        
        {/* Introduction */}
        <section>
          <p className="text-xl opacity-90 font-medium ">
            <strong>To ensure a safe experience for all Welyat users, you agree to the following rules:</strong>
          </p>
        </section>

        {/* 1. No Harassment */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Ban className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">1. No Harassment</h2>
          </div>
          <p className="opacity-90 ml-10">
            Verbal abuse, hate speech, threats, or bullying will result in an <strong>immediate and permanent ban</strong>. Respect is our foundation.
          </p>
        </section>

        {/* 2. No Solicitation */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Megaphone className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">2. No Solicitation</h2>
          </div>
          <p className="opacity-90 ml-10">
            You may not use Welyat for telemarketing, advertising, or selling products. This platform is for human connection, not business pitches.
          </p>
        </section>

        {/* 3. No Scams */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">3. No Scams or Fraud</h2>
          </div>
          <p className="opacity-90 ml-10">
            Never ask other users for money, wire transfers, financial details, or sensitive personal data. Protect your wallet and identity.
          </p>
        </section>

        {/* 4. No Recording */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <MicOff className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">4. No Recording</h2>
          </div>
          <p className="opacity-90 ml-10">
            Recording calls without explicit consent is <strong>illegal</strong> in many U.S. states and is strictly prohibited on Welyat to protect user privacy.
          </p>
        </section>

        {/* 5. No Impersonation */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <UserX className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">5. No Impersonation</h2>
          </div>
          <p className="opacity-90 ml-10">
            Do not pretend to be someone else, or claim to be a member of the Welyat team. Misleading other users destroys trust.
          </p>
        </section>

        {/* 6. Respect Privacy */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-2xl font-bold">6. Respect Privacy (No Doxing)</h2>
          </div>
          <p className="opacity-90 ml-10">
            Do not share the private information of other users (addresses, full names, social media) without their consent. Anonymity is our priority.
          </p>
        </section>

        {/* 7. Safety First & Reporting */}
        <section className="bg-[#8e5cff]/10 border-l-4 border-[#8e5cff] p-6 rounded-r-lg mt-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-7 h-7 text-[#8e5cff]" />
            <h2 className="text-xl font-bold  text-text-primary">Safety First & Reporting</h2>
          </div>
          <div className="space-y-3 ml-10 opacity-90 text-text-primary">
            <p>
              If a conversation makes you uncomfortable, <strong>hang up immediately</strong>.
            </p>
            <p>
              Use the <strong>Report</strong> feature in the app to flag suspicious behavior. We review each report manually to maintain community quality.
            </p>
          </div>
        </section>

        {/* Warning Note */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-text-primary text-center text-sm  font-bold tracking-widest uppercase italic">
            Failure to comply with these guidelines will result in account suspension without refund.
          </p>
        </div>

        {/* Footer - EXACTEMENT comme Privacy Policy */}
      <p className="text-text-primary text-center text-sm  font-bold tracking-widest uppercase">
        Respect the community. Enjoy the connection.
      </p>

      </div>
      
      
    </Layout>
  );
}