import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface LayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
  home?: boolean;
}

export default function Layout({ children, home }: LayoutProps) {
  return (
    <div
      className={`min-h-screen flex flex-col ${
        home
          ? 'text-text-primary-home bg-backgound-home'
          : 'text-text-primary bg-linear-to-br from-background-from to-background-to'
      }`}
    >
      {/* HEADER */}
      <header className="grid grid-cols-3">
        <div className="col-start-2 flex items-center justify-center p-8 gap-3">
          <img src={logo} width={100} />
          <div className="flex flex-col items-start tracking-wider">
            <h1 className="text-5xl">WELYAT</h1>
            <div>We Listen to You Anytime</div>
          </div>
        </div>

        <nav className="ml-auto">
          <ul className="flex gap-4 pt-10 pr-10">
            <li><Link to="#">Why Welyat ?</Link></li>
            <li><Link to="#">How It Works</Link></li>
            <li><Link to="#">Pricing</Link></li>
            <li><Link to="#">FAQ</Link></li>
          </ul>
        </nav>
      </header>

      {/* CONTENT (IMPORTANT) */}
      <main className="flex-1 p-5">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="w-full flex flex-col items-center py-6">
        <hr
          className={`w-full max-w-5xl border-t ${
            home ? 'border-accent-home' : 'border-text-primary'
          } mb-6`}
        />

        <nav>
          <ul className="flex gap-8 text-sm text-text-secondary">
            <li>
              <Link to="#" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Community Guidelines
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}