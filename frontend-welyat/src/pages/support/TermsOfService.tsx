'USE CLIENT';

import {
  ArrowRight,
  CreditCard,
  Clock,
  ShieldCheck,
  Gift,
  CircleCheck,
  CircleChevronRight,
  Activity,
  Phone,
  Speech,
  DoorOpen,
  DollarSign,
  Hash,
  Bell,
  Newspaper,
  IdCard,
  HatGlasses,
  CircleX,
  TriangleAlert,
  Mail,
} from 'lucide-react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { router } from '../../router';

export default function HomePage() {
  const [talk, setTalk] = useState<boolean>(false);

  return (
    <Layout>
      {/* ─── PAGE 1 : Landing ─── */}
      {talk === false && (
        <div className="text-base sm:text-lg md:text-xl p-2 sm:p-4 md:p-8 relative z-10 flex justify-center">
          <div
            className="absolute inset-0 max-w-5xl mx-auto left-0 right-0  rounded-3xl blur-sm"
            style={{ zIndex: 0, top: '2rem', bottom: '2rem', pointerEvents: 'none' }}
          />
          <div
            className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-4 relative w-full max-w-5xl"
            style={{ zIndex: 2 }}
          >
            <h1 className="text-text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
              Terms of Services
            </h1>

            <div>Clear rules. Full transparency. Always in control.</div>

            <div className="border border-bg  py-2 px-5 rounded-full  bg-white/20 backdrop-blur-md border border-white/30 shadow-lg  ">
              Last updated: April 2026
            </div>

            <div className=" my-10 sm:my-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch w-full max-w-4xl mx-auto">
              {/* Card 1 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <Newspaper color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Overview
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    These Terms govern your use of Weylat's services, providing a safe and openning
                    environment for listeners and callers.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <IdCard color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Eligibility
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Listeners must be at least 18 years old, and pass a voice test to join.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <CreditCard color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Payments & Billing
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Earns are calculated per second. Payouts are automatic, sent weekly.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <Clock color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Free Minutes Policy
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    First 15 minutes of listening are free and can convert to paid if the session is
                    extended and the caller agrees.
                  </p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <ShieldCheck color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Cancellations
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Callers and listeners can hang up any time. Billing stops instantly when calls
                    end.
                  </p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <HatGlasses color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Privacy & Data
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Your identity is always anonymous. See our Privacy Policy for more details.
                  </p>
                </div>
              </div>

              {/* Card 7 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <CircleX color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Prohibited Use
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Abusive language, harassment, or any illegal activities are strictly forbidden.
                  </p>
                </div>
              </div>

              {/* Card 8 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/30 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <TriangleAlert color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Liability & Disclaimers
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Welyat is not a replacement for professional medical or legal advice. Use is at
                    your own risk.
                  </p>
                </div>
              </div>

              {/* Card 9 */}
              <div className="col-span-2 w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-[#E2D0FA] backdrop-blur-md bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <Mail color="#F8CD8B" size={24} />
                  </div>
                </div>

                <div>
                  <h2 className="text-text-primary font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Contact
                  </h2>

                  <p className="text-sm text-text-primary mb-1.5">
                    Reach out to us at support@welyat.com for any questions about these Terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 10 */}
            <div className="flex justify-center w-full">
              <button
                className="w-80 rounded-full p-3 cursor-pointer font-semibold text-white tracking-wide text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #b78cff 0%, #8e5cff 50%, #5a2ccb 100%)',
                  boxShadow: '0 4px 20px rgba(90, 44, 203, 0.4)',
                }}
              >
                ⬇ Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
