import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import Layout from '../../components/Layout';
import React, { useState } from 'react';
import img from '../../assets/img/register-listener.jpg';
import { authApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../middlewares/Auth';

export default function RegisterListener() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    display_name: '',
    age: '',
    gender: '' as 'male' | 'female' | '',
  });

  function set(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1() {
    if (!formData.email.trim()) throw new Error('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) throw new Error('Invalid email address');
    if (!formData.phone.trim()) throw new Error('Phone number is required');
    // very light validation; backend can be stricter
    if (!/^\+?[0-9\s().-]{7,20}$/.test(formData.phone.trim())) throw new Error('Invalid phone number');
    if (!formData.password) throw new Error('Password is required');
    if (formData.password.length < 8) throw new Error('Password must be at least 8 characters');
  }

  function validateStep2() {
    if (!formData.display_name.trim()) throw new Error('Display name is required');
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 18) throw new Error('You must be at least 18 years old');
    if (!formData.gender) throw new Error('Please select your gender');
  }

  function nextStep() {
    setError('');
    try {
      validateStep1();
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      validateStep2();
    } catch (e: any) {
      setError(e.message);
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.registerListener({
        firstname: formData.display_name,
        lastname: '',
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
        languages: [],
        days: [],
        slots: [],
      });

      // Persist session so AuthProtection doesn't redirect to /login
      setSession?.(res.data.user as any, res.data as any);

      navigate('/listener');
    } catch (e: any) {
      setError(e.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const progressPercent = ((step - 1) / 1) * 100;

  return (
    <Layout>
      <div className="w-full flex items-center justify-center py-8 px-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="flex w-full max-w-4xl bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-3xl overflow-hidden">
          {/* Image panel */}
          <div
            className="hidden lg:block w-2/5 min-h-[560px]"
            style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="h-full w-full flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, rgba(90,44,203,0.7) 0%, transparent 60%)' }}>
              <h2 className="text-white text-2xl font-extrabold mb-2">Become a listener</h2>
              <p className="text-white/80 text-sm">Help those who need to be heard.</p>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex flex-col w-full lg:w-3/5 px-8 py-10">
            <h1 className="text-text-primary text-2xl font-extrabold tracking-tight mb-1">
              Listener <span style={{ color: '#8e5cff' }}>registration</span>
            </h1>
            <p className="text-sm mb-5" style={{ color: '#6F6F7A' }}>Quick setup — takes less than a minute</p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: '#6F6F7A' }}>
                <span className={step >= 1 ? 'text-text-primary' : ''}>1. Account</span>
                <span className={step >= 2 ? 'text-text-primary' : ''}>2. Profile</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent + 50}%`, background: 'linear-gradient(90deg, #7A4CFF 0%, #B78CFF 100%)' }}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl mb-4 py-2 px-4 text-center">
                {error}
              </div>
            )}

            {/* STEP 1 — Account */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Email <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-3 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => set('email', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 pl-8 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Phone number <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone size={14} className="absolute left-3 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+33 6 00 00 00 00"
                      value={formData.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 pl-8 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Password <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={14} className="absolute left-3 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => set('password', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 pl-8 pr-10 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full mt-2 py-3 rounded-xl font-semibold text-white transition"
                  style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}
                >
                  Continue →
                </button>
                <p className="text-center text-xs text-gray-400">
                  Already have an account?{' '}
                  <a href="/login" className="text-text-primary font-semibold hover:underline">Sign in</a>
                </p>
              </div>
            )}

            {/* STEP 2 — Profile */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Display name <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <p className="text-[11px]" style={{ color: '#a0a0b0' }}>Visible to callers — no last name required</p>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={formData.display_name}
                      onChange={(e) => set('display_name', e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 pl-8 text-sm bg-gray-50 focus:outline-none focus:ring-2 w-full transition"
                      style={{ '--tw-ring-color': '#8e5cff' } as any}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Age <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={99}
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => set('age', e.target.value)}
                    className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition"
                    style={{ '--tw-ring-color': '#8e5cff' } as any}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Gender <span style={{ color: '#8e5cff' }}>*</span>
                  </label>
                  <div className="flex gap-3">
                    {(['male', 'female'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => set('gender', g)}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition capitalize"
                        style={{
                          background: formData.gender === g ? 'linear-gradient(135deg, #7A4CFF, #B78CFF)' : 'white',
                          color: formData.gender === g ? 'white' : '#6F6F7A',
                          borderColor: formData.gender === g ? 'transparent' : '#e5e7eb',
                        }}
                      >
                        {g === 'male' ? '♂ Male' : '♀ Female'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(1); }}
                    className="px-5 py-3 rounded-xl font-semibold border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)', boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)' }}
                  >
                    {loading ? 'Creating account…' : 'Create account →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
