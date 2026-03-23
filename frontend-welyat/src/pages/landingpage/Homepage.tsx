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
    <Layout home={true} >
      <div className="text-xl p-5 z-10">
        <div className="flex flex-col items-center justify-center gap-3 p-10">
          <h1 className="text-4xl flex flex-col items-center justify-center font-bold tracking-wider">
            <div>You don't have to</div>
            <div>be alone tonight.</div>
          </h1>
          <div className="m-4 flex flex-col items-center justify-center text-text-primary-home">
            <div>Talk to someone who truly listens.</div>
            <div>Connect whith a real human in seconds.</div>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7D2DEC] to-[#3F0DE0] py-2 px-2 text-primary-home text-center "
          >
            Talk to someone now <ArrowRight color="text-primary-home" />
          </Link>

          <div className="mt-10 text-text-primary-home">
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

          <div className="my-5 grid grid-cols-2 gap-4 items-stretch">
            <div className="w-full flex gap-2 p-4 border border-white/20 rounded-lg">
              <div>
                <Hourglass color="#F8CD8B" size={50} />
              </div>
              <div>
                <h2>YOUR FREE TIME</h2>
                <ul className="ml-4 list-disc marker:text-accent-home">
                  <li className="m-1">
                    You start with{' '}
                    <span className="rounded-full border-1 p-1 px-2 bg-[#1B0746] text-accent-home">
                      15 free minutes
                    </span>{' '}
                    .
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

            <div className="w-full flex gap-2 p-4 border border-white/20 rounded-lg">
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

            <div className="w-full flex gap-2 p-4 border border-white/20 rounded-lg">
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

            <div className="w-full flex gap-2 p-4 border border-white/20 rounded-lg">
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
