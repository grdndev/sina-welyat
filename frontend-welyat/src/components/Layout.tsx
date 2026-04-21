import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Clock, Shield } from 'lucide-react';
import logo from '../assets/logo.png';

interface LayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
  home?: boolean;
  backgroundImage?: string;
  backgroundImageMobile?: string;
}

export default function Layout({
  children,
  home,
  backgroundImage,
  backgroundImageMobile,
}: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  let style: React.CSSProperties = {};

  if (home && (backgroundImage || backgroundImageMobile)) {
    const img = isMobile && backgroundImageMobile ? backgroundImageMobile : backgroundImage;
    if (img) {
      style = {
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
  } else if (!home) {
    style = {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #d8b4fe 55%, #a78bfa 100%)',
    };
  }

  return (
    <div
      className={`min-h-screen flex flex-col relative ${
        home ? 'text-text-primary-home bg-backgound-home' : 'text-text-primary'
      }`}
      style={style}
    >
      {/* HEADER */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-4 md:py-8 gap-4 md:gap-0">
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <Link to={'/'}>
            <img src={logo} className="w-24 md:w-36" />
          </Link>
        </div>
        <nav className="w-full md:w-auto flex justify-center md:justify-end">
          <ul className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-base pt-2 md:pt-0">
            <li>
              <Link to="/why" className="hover:text-accent-home transition">
                Why Welyat ?
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowHowItWorks(true)}
                className="hover:text-accent-home transition cursor-pointer"
              >
                How It Works
              </button>
            </li>
            <li>
              <Link to="/faq" className="hover:text-accent-home transition">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-2 sm:p-4 md:p-8 relative">
        {home && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
          />
        )}

        <div className="relative" style={{ zIndex: 1 }}>
          <div className="text-base sm:text-lg md:text-xl p-2 sm:p-4 md:p-8 relative z-10 flex justify-center">
            <div
              className="absolute inset-0 max-w-5xl mx-auto left-0 right-0  rounded-3xl blur-sm"
              style={{ zIndex: 0, top: '2rem', bottom: '2rem', pointerEvents: 'none' }}
            />
            <div
              className="flex flex-col items-center justify-center gap-3 p-2 sm:p-4 md:p-4 relative w-full max-w-5xl"
              style={{ zIndex: 2 }}
            >

            {/*Body code*/} 
            
            {children}


            </div>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS MODAL */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
            >
              <X size={20} className="text-white/60" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-white mb-1">How it works</h2>
              <p className="text-sm" style={{ color: '#a78bfa' }}>Simple. Clear. No pressure.</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(142,92,255,0.1)', border: '1px solid rgba(142,92,255,0.2)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #7A4CFF, #B78CFF)' }}>
                  <Heart size={18} color="white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Start with free time</div>
                  <div className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>Talk instantly to a real human listener.</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(142,92,255,0.1)', border: '1px solid rgba(142,92,255,0.2)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C542, #FFD700)' }}>
                  <Clock size={18} color="white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Talk freely</div>
                  <div className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>Your first minutes are free. No pressure.</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(142,92,255,0.1)', border: '1px solid rgba(142,92,255,0.2)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#f3f4f6' }}>
                  <Shield size={18} style={{ color: '#6F6F7A' }} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Continue only if you want</div>
                  <div className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>You are never charged unless you choose to continue.</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Pricing</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">15 minutes free</span>
                  <span className="font-bold text-white">$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">After free time</span>
                  <span className="font-bold text-white">$0.33 / min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Service fee</span>
                  <span className="font-bold text-white">$0.20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full flex flex-col items-center py-4 md:py-2 px-2">
        <hr
          className={`w-full max-w-4xl border-t ${
            home ? 'border-accent-home' : 'border-text-primary'
          } mb-4 md:mb-6`}
        />
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-text-secondary">
            <li>
              <Link to="/termsOfService" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacyPolicy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/communityGuidelines" className="hover:text-white transition">
                Community Guidelines
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
