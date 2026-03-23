import {
  Clock10,
  DollarSign,
  HandCoins,
  Plus,
  Star,
  ArrowRight,
  TurkishLira,
  Hourglass,
  CreditCard,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Layout from './Layout';
import image from '../../assets/dashboard.png';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Layout home={true}>
      <div className="text-base sm:text-lg md:text-xl p-2 sm:p-4 md:p-8 relative z-10 flex justify-center">
        {/* Overlay sombre limité au contenu central */}
        <div
          className="absolute inset-0 max-w-5xl mx-auto left-0 right-0 bg-black/50 rounded-3xl blur-sm"
          style={{ zIndex: 0, top: '2rem', bottom: '2rem', pointerEvents: 'none' }}
        />
        <div
          className="flex flex-col items-center justify-center gap-3 p-2 sm:p-6 md:p-10 relative w-full max-w-5xl"
          style={{ zIndex: 2 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl flex flex-col items-center justify-center font-bold tracking-wider text-center">
            <div>You don't have to</div>
            <div>be alone tonight.</div>
          </h1>
          <div className="my-2 sm:my-4 flex flex-col items-center justify-center text-text-primary-home text-center">
            <div>Talk to someone who truly listens.</div>
            <div>Connect whith a real human in seconds.</div>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#42288B] bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] py-2 px-4 text-primary-home transition-all duration-300 ease-in-out hover:from-[#7D2DEC]/90 hover:to-[#3F0DE0]/90 hover:scale-105 hover:shadow-lg text-sm sm:text-base md:text-lg"
          >
            <span>Talk to someone now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <div className="mt-6 sm:mt-10 text-text-primary-home text-center">
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
            <div className="w-full flex gap-2 p-2 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg min-h-[120px]">
              <div>
                <Hourglass color="#F8CD8B" size={50} />
              </div>
              <div>
                <h2>YOUR FREE TIME</h2>
                <ul className="ml-4 list-disc marker:text-accent-home">
                  <li className="m-1">
                    You start with{' '}<strong className='text-accent-home'>15 free minutes</strong>.
                  </li>
                  <li>15 minutes free to talk</li>
                  <li>First 3 calls under 2 minutes don't count</li>
                  <li>
                    Starting from your 4th call,
                    <br />
                    only time beyond 2 minutes is deducted
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full flex gap-2 p-2 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg min-h-[120px]">
              <div>
                <CreditCard color="#F8CD8B" size={50} />
              </div>
              <div>
                <h2>PRICING (SIMPLE)</h2>
                <ul className="ml-4 list-disc marker:text-accent-home">
                  <li>No surprises.</li>
                  <li>You only pay after your free time</li>
                  <li>Charged per minute</li>
                  <li>You choose to continue or stop</li>
                </ul>
              </div>
            </div>

            <div className="w-full flex gap-2 p-2 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg min-h-[120px]">
              <div>
                <Clock color="#F8CD8B" size={50} />
              </div>
              <div>
                <h2>WHAT HAPPENS DURING A CALL</h2>
                <ul className="ml-4 list-disc marker:text-accent-home">
                  <li>T=0 → Connected instantly to a real person</li>
                  <li>T=13 → Audio alert (ending soon)</li>
                  <li>T=15 → Press # to continue (paid mode) or call ends automatically</li>
                </ul>
                <p>(You can hang up anytime, no commitment)</p>
              </div>
            </div>

            <div className="w-full flex gap-2 p-2 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg min-h-[120px]">
              <div>
                <ShieldCheck color="#F8CD8B" size={50} />
              </div>
              <div>
                <h2>FAIR USE</h2>
                <p>To keep the platform fair for everyone</p>
                <ul className="ml-4 list-disc  marker:text-accent-home">
                  <li>Real human connection, no abuse</li>
                  <li>System automatically adjusts usage to prevent exploitation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
