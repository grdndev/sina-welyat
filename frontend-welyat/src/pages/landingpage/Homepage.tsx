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
  Bell
} from 'lucide-react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { router } from '../../router';

import background from '../../assets/bg/homePage.png';
import backgroubndMobile from '../../assets/bg/mb_homePage.png';

export default function HomePage() {
  const [talk, setTalk] = useState<boolean>(false);

  return (
    <Layout home={true} backgroundImage={background} backgroundImageMobile={backgroubndMobile}>
      {/* ─── PAGE 1 : Landing ─── */}
      {talk === false && (
        <div className="text-base sm:text-lg md:text-xl p-2 sm:p-4 md:p-8 relative z-10 flex justify-center">
          <div
            className="absolute inset-0 max-w-5xl mx-auto left-0 right-0 bg-black/50 rounded-3xl blur-sm"
            style={{ zIndex: 0, top: '2rem', bottom: '2rem', pointerEvents: 'none' }}
          />
          <div
            className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-4 relative w-full max-w-5xl"
            style={{ zIndex: 2 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
              <div>You don't have to</div>
              <div>be alone tonight.</div>
            </h1>

            <div className="my-2 sm:my-4 flex flex-col items-center justify-center text-text-primary-home text-center text-sm sm:text-base">
              <div>Talk to someone who truly listens.</div>
              <div>Connect with a real human in seconds.</div>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#42288B] bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] py-2 px-6 text-white transition-all duration-300 ease-in-out hover:from-[#7D2DEC]/90 hover:to-[#3F0DE0]/90 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              onClick={() => setTalk(true)}
            >
              Talk to someone now
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-6 sm:mt-10 text-text-primary-home text-center text-sm sm:text-base">
              Earn by listening{' '}
              <Link
                to="/home-listener"
                className="inline-flex items-center gap-1 text-[#DEB99D] cursor-pointer hover:text-text-primary-home"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="leading-none">Become a Listener</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="my-4 sm:my-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch w-full max-w-4xl mx-auto">
              {/* Card 1 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <Clock color="#F8CD8B" size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Your Free Time
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex items-center gap-2 text-sm text-white/90">
                      <Gift color="#F8CD8B" size={14} className="shrink-0" />
                      <span>
                        <strong className="text-[#F8CD8B]">15 minutes</strong> free to talk
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <Clock color="#c4b5fd" size={14} className="shrink-0" />
                      First 3 calls under 2 minutes don't count
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white/80">
                      <Clock color="#c4b5fd" size={14} className="shrink-0 mt-0.5" />
                      From your 4th call, only time beyond 2 minutes is deducted
                    </li>
                    <li className="flex items-center gap-2 text-sm font-semibold text-[#F8CD8B]">
                      <ShieldCheck color="#F8CD8B" size={14} className="shrink-0" />
                      You stay in control of your time
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <CreditCard color="#F8CD8B" size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Pricing (Simple)
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      No surprises
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      You only pay after your free time
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      Charged per minute
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      You choose to continue or stop
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <Clock color="#F8CD8B" size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    What Happens During a Call
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleChevronRight color="#F8CD8B" size={14} className="shrink-0" />
                      T=0 → Connected instantly to a real person
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleChevronRight color="#F8CD8B" size={14} className="shrink-0" />
                      T=13 → Audio alert (ending soon)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleChevronRight color="#F8CD8B" size={14} className="shrink-0" />
                      T=15 → Press # to continue or call ends automatically
                    </li>
                  </ul>
                  <p className="text-xs text-white/50 mt-2">
                    (You can hang up anytime, no commitment)
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="w-full flex gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full h-fit">
                  <div className="bg-[#7C3AED] p-2 rounded-full">
                    <ShieldCheck color="#F8CD8B" size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase mb-2">
                    Fair Use
                  </h2>
                  <p className="text-sm text-white/60 mb-1.5">
                    To keep the platform fair for everyone
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      Real human connection, no abuse
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/80">
                      <CircleCheck color="#F8CD8B" size={14} className="shrink-0" />
                      System automatically adjusts usage to prevent exploitation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAGE 2 : Before you start ─── */}
      {talk && (
        <div className="text-base sm:text-lg md:text-xl p-2 sm:p-4 md:p-8 relative z-10 flex justify-center">
          <div
            className="absolute inset-0 max-w-5xl mx-auto left-0 right-0 bg-black/50 rounded-3xl blur-sm"
            style={{ zIndex: 0, top: '2rem', bottom: '2rem', pointerEvents: 'none' }}
          />
          <div
            className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-4 relative w-full max-w-5xl"
            style={{ zIndex: 2 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-center">
              Before you start
            </h1>
            <div className="text-sm sm:text-base text-white/50 text-center">
              Takes <span className="text-[#F8CD8B]">10 seconds</span> to read.
            </div>

            <div className="my-4 sm:my-6 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-stretch w-full max-w-4xl mx-auto">
              {/* Free Time — col-span-4 */}
              <div className="md:col-span-4 w-full flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full">
                      <div className="bg-[#7C3AED] p-2 rounded-full">
                        <Clock color="#F8CD8B" size={22} />
                      </div>
                    </div>
                    <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase">
                      Your Free Time
                    </h2>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-400/40"
                    style={{ background: 'linear-gradient(135deg, #6D28D9, #4C1D95)' }}
                  >
                    <Gift color="#F8CD8B" size={14} />
                    <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
                      15 FREE MINUTES
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-white/90">
                    <Gift color="#F8CD8B" size={15} className="shrink-0" />
                    <span>
                      <strong className="text-[#F8CD8B]">15 minutes</strong> free to talk
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <Clock color="#c4b5fd" size={15} className="shrink-0" />
                    First 3 calls under 2 minutes don't count
                  </li>
                  <li className="flex items-start gap-2 text-sm text-white/80">
                    <Clock color="#c4b5fd" size={15} className="shrink-0 mt-0.5" />
                    From your 4th call, only time beyond 2 minutes is deducted
                  </li>
                  <li className="flex items-center gap-2 text-sm font-semibold text-[#F8CD8B]">
                    <ShieldCheck color="#F8CD8B" size={15} className="shrink-0" />
                    You stay in control of your time
                  </li>
                </ul>
              </div>

              {/* Simple Pricing — col-span-2 */}
              <div className="md:col-span-2 w-full flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full">
                      <div className="bg-[#7C3AED] p-2 rounded-full">
                        <DollarSign color="#F8CD8B" size={22} />
                      </div>
                    </div>
                    <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase">
                      Simple Pricing
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-white/70 text-xs sm:text-sm whitespace-nowrap">
                      No surprises
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <CircleCheck color="#F8CD8B" size={15} className="shrink-0" />
                    You only pay after your free time
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <CircleCheck color="#F8CD8B" size={15} className="shrink-0" />
                    Charged per minute
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <CircleCheck color="#F8CD8B" size={15} className="shrink-0" />
                    You choose to continue or stop
                  </li>
                </ul>
                <div className="text-sm border border-white/20 text-center p-2 rounded-xl mt-auto">
                  <strong className="text-base">
                    <span className="text-[#F8CD8B]">$0.33</span> per minute
                  </strong>
                  <br />
                  <span className="text-white/60">after free time</span>
                </div>
                <p className="text-sm text-center text-white/60">
                  ≃ <span className="text-[#F8CD8B]">$19.80 / hour</span> if you continue
                </p>
              </div>

              {/* Transparent Fees — col-span-2 */}
              <div className="md:col-span-2 w-full flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full">
                      <div className="bg-[#7C3AED] p-2 rounded-full">
                        <ShieldCheck color="#F8CD8B" size={22} />
                      </div>
                    </div>
                    <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase">
                      Transparent Fees
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-white/70 text-xs sm:text-sm whitespace-nowrap">
                      Small connection fees
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <CircleChevronRight color="#F8CD8B" size={15} className="shrink-0" />
                    <strong className="text-white">$0.10</strong>&nbsp;at call start
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/80">
                    <CircleChevronRight color="#F8CD8B" size={15} className="shrink-0" />
                    <strong className="text-white">$0.10</strong>&nbsp;at 10 minutes
                  </li>
                </ul>
                <div className="text-sm border border-white/20 text-center p-2 rounded-xl mt-8 text-white/60">
                  Applied even during free time
                  <br />
                  to cover infrastructure
                </div>
              </div>

              {/* What happens — col-span-4 */}
              <div className="md:col-span-4 w-full flex flex-col gap-3 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 bg-[#5B21B6] p-[6px] rounded-full">
                      <div className="bg-[#7C3AED] p-2 rounded-full">
                        <Activity color="#F8CD8B" size={22} />
                      </div>
                    </div>
                    <h2 className="text-white font-bold tracking-wide text-sm sm:text-base uppercase">
                      What Happens During a Call
                    </h2>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-white/70 text-xs sm:text-sm whitespace-nowrap">
                      You can hang up anytime — no commitment
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* T=0 */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="bg-[#164b35] p-[6px] rounded-full">
                      <div className="bg-[#226142] p-2 rounded-full">
                        <Phone color="#fff" size={22} />
                      </div>
                    </div>
                    <div>
                      <strong className="text-[#F8CD8B] text-base">T = 0</strong>
                      <p className="text-white/80 text-sm mt-1">
                        Connected instantly to a real person
                      </p>
                    </div>
                  </div>
                  {/* T=13 */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="bg-[#AF5258] p-[6px] rounded-full">
                      <div className="bg-[#C97569] p-2 rounded-full">
                        <Bell color="#fff" size={22} />
                      </div>
                    </div>
                    <div>
                      <strong className="text-[#F8CD8B] text-base">T = 13</strong>
                      <p className="text-white/80 text-sm mt-1">
                        Audio alert
                        <span className="text-white/50"> (ending soon)</span>
                      </p>
                    </div>
                  </div>
                  {/* T=15 */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="bg-[#5B21B6] p-[6px] rounded-full">
                      <div className="bg-[#7C3AED] p-2 rounded-full">
                        <Hash color="#fff" size={22} />
                      </div>
                    </div>
                    <div>
                      <strong className="text-[#F8CD8B] text-base">T = 15</strong>
                      <p className="text-white/80 text-sm mt-1">
                        Press # to continue
                        <span className="text-white/50"> (paid mode)</span>
                        <br />
                        <span className="text-white/50">or call ends automatically</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA — col-span-4 */}
              <div className="md:col-span-4 w-full flex flex-col gap-4 items-center justify-center p-2 sm:p-4">
                <button
                  className="w-full max-w-md inline-flex flex-col items-center justify-center gap-1 rounded-full border border-[#42288B] bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] py-3 px-8 text-white transition-all duration-300 ease-in-out hover:from-[#7D2DEC]/90 hover:to-[#3F0DE0]/90 hover:scale-105 hover:shadow-lg"
                  onClick={() => router.navigate('/register')}
                >
                  <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <Phone color="#ffffff" size={18} />
                    START MY CALL
                  </span>
                  <span className="text-xs text-white/70">
                    You'll be connected in a few seconds
                  </span>
                </button>

                <div className="flex flex-row gap-5 text-sm text-white/70 mt-5">
                  <div className="flex items-center gap-2">
                    <Speech color="#c4b5fd" size={18} />
                    Real human listeners
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleCheck color="#c4b5fd" size={18} />
                    No commitment
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen color="#c4b5fd" size={18} />
                    Leave anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
