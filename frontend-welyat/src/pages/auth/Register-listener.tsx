import { AtSign, CheckCircle, Eye, EyeOff, KeyRound, MoveLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img from '../../assets/img/register-listener.jpg';
import Button from '../../components/Button';

export default function Register() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  function validate() {
    if (!formData?.email || !formData?.password || !formData?.confirm) {
      throw new Error('Please fill all the fields');
    }

    if (formData.password !== formData.confirm) {
      throw new Error("Password don't match");
    }
  }

  function handleFormData(type: string, value: any) {
    const newFormData = { ...formData };
    newFormData[type] = value ?? undefined;
    setFormData(newFormData);
  }

  async function handleFormSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      validate();
      // await register;
      setSuccess('Account succesfully created .');
    } catch (error: any) {
      setError(error.message ?? 'An error occured, try later');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div
        className="w-full flex items-center justify-center -m-2 sm:-m-4 md:-m-4"
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <div className="flex w-full max-w-4xl  bg-white/30 backdrop-blur-md border border-white/30 shadow-lg   rounded-3xl overflow-hidden min-h-[600px]">
          {/* Left Side - Image Cover */}
          <div
            className="hidden md:block w-1/2"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Right Side - Form */}
          <div className="flex flex-col justify-center  w-full md:w-1/2 px-10 py-12">
            <h1 className="text-center text-text-primary text-3xl font-extrabold tracking-tight my-4">
              Create <span style={{ color: '#8e5cff' }}> Account </span>
            </h1>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl my-2 py-2 px-4 text-center">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl my-2 py-2 px-4 text-center">
                {success}
              </div>
            )}

            <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-1 text-text-primary">
                <label htmlFor="fullname" className="text-xs font-bold uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  disabled={loading}
                  onChange={(e) => handleFormData('fullname', e.target.value)}
                  placeholder="John Doe"
                  className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-text-primary uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled={loading}
                  onChange={(e) => handleFormData('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-text-primary uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    onChange={(e) => handleFormData('password', e.target.value)}
                    placeholder="••••••••"
                    className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 w-full transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirm"
                  className="text-xs font-bold text-text-primary uppercase tracking-wider"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    disabled={loading}
                    onChange={(e) => handleFormData('confirm', e.target.value)}
                    placeholder="••••••••"
                    className={`border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 w-full transition ${loading ? 'animate-pulse opacity-50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 text-gray-400 hover:text-blue-600 transition"
                  >
                    {showPasswordConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 mt-1">
                <input type="checkbox" id="terms" className="mt-0.5 accent-blue-700" required />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I agree to the{' '}
                  <a
                    href="/termsOfService"
                    className="text-text-primary underline hover:text-text-primary transition"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacyPolicy"
                    className="text-text-primary underline hover:text-text-primary transition"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <Button
                typeBtn="submit"
                name={loading ? 'Creating Account...' : 'Create Account'}
                className="w-full mt-4 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
              />
              {/* Login redirect */}
              <p className="text-center text-xs text-gray-400 mt-2">
                Already have an account?{' '}
                <a href="/login" className="text-text-primary font-semibold hover:underline">
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
