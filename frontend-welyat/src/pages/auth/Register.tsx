import { Eye, EyeOff, Phone } from 'lucide-react';
import Layout from '../../components/Layout';
import React, { useState } from 'react';
import img from '../../assets/img/register.jpg';
import { authApi } from '../../api/auth';
import { useAuth } from '../../middlewares/Auth';

export default function Register() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [success, setSuccess] = useState('');

  function validate() {
    if (!formData?.phone) throw new Error('Phone number is required');
    if (!formData?.password) throw new Error('Password is required');
    if (formData.password !== formData.confirm) throw new Error('Passwords do not match');
    if (formData.password.length < 8) throw new Error('Password must be at least 8 characters');
  }

  function handleFormData(type: string, value: any) {
    setFormData((prev: any) => ({ ...prev, [type]: value || undefined }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      validate();
      const res = await authApi.register(formData.phone, formData.password, formData.email);
      const u = res.data.user;
      login(
        {
          id: u.id as any,
          name: u.phone,
          email: u.email || u.phone,
          role: u.role,
        },
        { token: res.data.token }
      );
    } catch (error: any) {
      setError(error.message ?? 'An error occurred, please try again later');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center -m-2 sm:-m-4 md:-m-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="flex w-full max-w-4xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-3xl overflow-hidden min-h-[600px]">
          <div className="hidden md:block w-1/2" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

          <div className="flex flex-col justify-center w-full md:w-1/2 px-10 py-12">
            <h1 className="text-center text-text-primary text-3xl font-extrabold tracking-tight mb-1">
              Create an <span style={{ color: '#8e5cff' }}>account</span>
            </h1>
            <p className="text-center text-sm mb-5" style={{ color: '#6F6F7A' }}>
              Talk to someone in seconds
            </p>

            {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl my-2 py-2 px-4 text-center">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl my-2 py-2 px-4 text-center">{success}</div>}

            <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Phone <span style={{ color: '#8e5cff' }}>*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-3 text-gray-400" />
                  <input
                    id="phone" type="tel" required disabled={loading}
                    onChange={(e) => handleFormData('phone', e.target.value)}
                    placeholder="+1 000 000 0000"
                    className={`border border-gray-200 rounded-xl p-3 pl-9 text-sm focus:outline-none focus:ring-2 bg-gray-50 w-full transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                </div>
              </div>

              {/* Email (optional) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  Email <span className="text-xs font-normal normal-case tracking-normal" style={{ color: '#6F6F7A' }}>(optional)</span>
                </label>
                <input
                  id="email" type="email" disabled={loading}
                  onChange={(e) => handleFormData('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                  style={{ '--tw-ring-color': '#8e5cff' } as any}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Password <span style={{ color: '#8e5cff' }}>*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} required disabled={loading}
                    onChange={(e) => handleFormData('password', e.target.value)}
                    placeholder="••••••••"
                    className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 w-full transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400 hover:text-primary transition">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="confirm" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Confirm password <span style={{ color: '#8e5cff' }}>*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirm" type={showPasswordConfirm ? 'text' : 'password'} required disabled={loading}
                    onChange={(e) => handleFormData('confirm', e.target.value)}
                    placeholder="••••••••"
                    className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 w-full transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                  <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 text-gray-400 hover:text-primary transition">
                    {showPasswordConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 mt-1">
                <input type="checkbox" id="terms" required className="mt-0.5" style={{ accentColor: '#8e5cff' }} />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I accept the{' '}
                  <a href="/termsOfService" className="text-text-primary underline hover:opacity-80 transition">Terms of Service</a>
                  {' '}and the{' '}
                  <a href="/privacyPolicy" className="text-text-primary underline hover:opacity-80 transition">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60 cursor-pointer"
                style={{ background: loading ? '#b78cff' : 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}
              >
                {loading ? 'Creating account...' : 'Create my account'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                Already have an account?{' '}
                <a href="/login" className="text-text-primary font-semibold hover:underline">Sign in</a>
              </p>
              <p className="text-center text-xs text-gray-400">
                Want to listen?{' '}
                <a href="/register-listener" className="font-semibold hover:underline" style={{ color: '#8e5cff' }}>Become a listener</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
