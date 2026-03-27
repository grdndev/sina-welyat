import Layout from '../../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout>
      {/* Header Section */}
      <h1 className="text-text-primary text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
        Privacy <span style={{ color: '#8e5cff' }}>Policy</span>
      </h1>
      <p className="text-text-secondary text-xl font-medium mt-2">
        How we handle and protect your personal information.
      </p>

      {/* Content Container */}
      <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 flex flex-col gap-6 text-text-primary">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <p className="text-base"><strong className='text-text-primary'>Last Updated :</strong> March 27, 2026</p>
          <span className="bg-[#8e5cff]/20 text-[#8e5cff] text-xs font-bold px-3 py-1 rounded-full uppercase">Official</span>
        </div>

        {/* 1. Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p className="leading-relaxed opacity-90">
            Welcome to <strong>Welyat</strong>. We provide a secure platform for anonymous voice connections. 
            Your privacy is our core mission. This policy explains how we manage your data through our 
            trusted partners, <strong>Stripe</strong> and <strong>Twilio</strong>, while ensuring your 
            identity remains protected.
          </p>
        </section>

        {/* 2. Age Requirement */}
        <section className="bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-lg">
          <h2 className="text-xl font-bold mb-2">2. Strict Age Requirement (18+)</h2>
          <p className="leading-relaxed opacity-90">
            Welyat is strictly prohibited to minors. We do not knowingly collect personal information 
            from anyone under 18. If we discover a minor has accessed the service, we will terminate 
            the account and delete all associated data immediately.
          </p>
        </section>

        {/* 3. Anonymous Connection */}
        <section>
          <h2 className="text-2xl font-bold mb-3">3. Data Masking Technology</h2>
          <p className="leading-relaxed opacity-90">
            We use Twilio to power our encryption technology. When you connect with another user, 
            your real phone number is <strong >permanently masked</strong>. Neither party can see the other's private 
            number; you only interact through a generic system-generated bridge.
          </p>
        </section>

        {/* 4. Data Collection */}
        <section>
          <h2 className="text-2xl font-bold mb-3">4. Third-Party Providers</h2>
          <ul className="list-disc ml-6 space-y-3 opacity-90">
            <li>
              <strong>Telephony (Twilio):</strong> We collect your phone number to facilitate the call bridge. 
              Twilio routes your call securely without revealing your ID.
            </li>
            <li>
              <strong>Payments (Stripe):</strong> All financial transactions are handled by Stripe. 
              Welyat does not store or process your credit card numbers on our servers.
            </li>
            <li>
              <strong>Zero Recording Policy:</strong> We <strong>never</strong> record, monitor, or store the audio 
              content of your conversations. We only log metadata (date, time, duration) for billing and safety.
            </li>
          </ul>
        </section>

        {/* 5. Security & Retention */}
        <section>
          <h2 className="text-2xl font-bold mb-3">5. Security & Retention</h2>
          <p className="leading-relaxed opacity-90">
            All data transmissions are protected via <strong>SSL/HTTPS encryption</strong>. We retain call logs 
            for a period of <strong>6 months</strong> to prevent abuse and fraud, after which they are automatically 
            deleted or anonymized.
          </p>
        </section>

        {/* 6. Cookies */}
        <section>
          <h2 className="text-2xl font-bold mb-3">6. Cookies</h2>
          <p className="leading-relaxed opacity-90">
            We use only essential session cookies to keep you authenticated. We do not use third-party 
            tracking, advertising, or "creepy" analytics cookies.
          </p>
        </section>

        {/* 7. Legal Rights */}
        <section className="mt-4 pt-6 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-3">7. Your Rights (CCPA/VCDPA/GDPR)</h2>
          <p className="leading-relaxed opacity-90">
            You have the right to access, export, or delete your personal data. To exercise these rights 
            or if you have any questions, please contact our privacy officer at: 
            <a href="mailto:support@welyat.com" className="text-[#8e5cff] font-bold ml-1 hover:underline">
              support@welyat.com
            </a>
          </p>
        </section>

      </div>
       
    </Layout>
  );
}