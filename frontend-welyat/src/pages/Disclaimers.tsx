import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronDown } from 'lucide-react';
import { disclaimerApi } from '../api/disclaimer';
import { useAuth } from '../middlewares/Auth';
import Layout from '../components/Layout';

export default function Disclaimers() {
  const navigate = useNavigate();
  const { user, acceptDisclaimer } = useAuth();
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('');
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    disclaimerApi.getLatest()
      .then((res) => {
        setContent(res.data.content);
        setVersion(res.data.version);
      })
      .catch(() => setError('Unable to load disclaimer. Please try again.'));
  }, []);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
      setScrolledToBottom(true);
    }
  }

  async function handleAccept() {
    if (!checked || !scrolledToBottom) return;
    setLoading(true);
    setError('');
    try {
      const res = await disclaimerApi.accept(version);
      acceptDisclaimer?.(res.data.token);
      navigate('/welcome', { replace: true });
    } catch (e: any) {
      setError(e.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: '#8e5cff22', border: '1px solid #8e5cff44' }}>
            <Shield size={20} color="#8e5cff" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text-primary">Terms &amp; Disclaimer</h1>
            <p className="text-xs text-text-secondary">Please read carefully before continuing</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl py-2 px-4 text-center">
            {error}
          </div>
        )}

        {content ? (
          <>
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-5 overflow-y-auto text-sm text-text-secondary leading-relaxed whitespace-pre-wrap"
                style={{ maxHeight: '400px' }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {!scrolledToBottom && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-2 rounded-b-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8))' }}
                >
                  <ChevronDown size={18} className="animate-bounce text-text-secondary" />
                </div>
              )}
            </div>

            <label className={`flex items-start gap-3 cursor-pointer select-none ${!scrolledToBottom ? 'opacity-40 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary shrink-0"
              />
              <span className="text-sm text-text-secondary">
                I have read and I accept the terms and disclaimer above.
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!checked || !scrolledToBottom || loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142,92,255,0.35)' }}
            >
              {loading ? 'Saving…' : 'Accept & continue'}
            </button>
          </>
        ) : !error ? (
          <div className="flex justify-center py-16">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
