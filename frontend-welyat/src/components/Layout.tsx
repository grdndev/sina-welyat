import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

interface LayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
  home?: boolean;
  backgroundImage?: string;
  backgroundImageMobile?: string;
}

export default function Layout({ children, home, backgroundImage, backgroundImageMobile }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

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
    // ✅ Gradient menthe-violette par défaut si pas de backgroundImage
    style = {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #d8b4fe 55%, #a78bfa 100%)',
    };
  }

  return (
    <div
      className={`min-h-screen flex flex-col relative ${
        home
          ? 'text-text-primary-home bg-backgound-home'
          : 'text-text-primary'  // ✅ supprimé bg-linear-to-br, géré par style
      }`}
      style={style}
    >
      {/* HEADER */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-4 md:py-8 gap-4 md:gap-0">
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <img src={logo} width={60} className="w-16 md:w-24" />
          <div className="flex flex-col items-start tracking-wider">
            <h1 className="text-3xl md:text-5xl font-bold">WELYAT</h1>
            <div className="text-xs md:text-base">We Listen to You Anytime</div>
          </div>
        </div>
        <nav className="w-full md:w-auto flex justify-center md:justify-end">
          <ul className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-base pt-2 md:pt-0">
            <li><Link to="#" className="hover:text-accent-home transition">Why Welyat ?</Link></li>
            <li><Link to="#" className="hover:text-accent-home transition">How It Works</Link></li>
            <li><Link to="#" className="hover:text-accent-home transition">FAQ</Link></li>
          </ul>
        </nav>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-2 sm:p-4 md:p-8 relative">
        {home && (
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true" />
        )}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full flex flex-col items-center py-4 md:py-2 px-2">
        <hr
          className={`w-full max-w-4xl border-t ${
            home ? 'border-accent-home' : 'border-text-primary'
          } mb-4 md:mb-6`}
        />
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-text-secondary">
            <li><Link to="/termsOfService" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition">Community Guidelines</Link></li>
            <li><Link to="#" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}