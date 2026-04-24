import { Eye, EyeOff, KeyRound, Phone } from "lucide-react";
import { useAuth } from "../../middlewares/Auth";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";

export default function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function validate() {
        if (!phone.trim()) throw new Error('Phone number is required');
        if (!password) throw new Error('Password is required');
    }

    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            validate();
            const res = await authApi.login(phone, password);
            const u = res.data.user;
            login(
                {
                    id: u.id as any,
                    name: [u.firstname, u.lastname].filter(Boolean).join(' ') || u.phone,
                    email: u.email || u.phone,
                    role: u.role,
                    accepted_disclaimer: u.accepted_disclaimer,
                },
                { token: res.data.token }
            );
        } catch (error: any) {
            setError(error.message ?? "An error occurred, please try again later");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="w-full flex items-center justify-center -m-2 sm:-m-4 md:-m-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
                <div className="flex w-full max-w-md bg-white/30 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                    <div className="flex flex-col justify-center w-full px-10 py-12">

                        <h1 className="text-center text-text-primary text-3xl font-extrabold tracking-tight mb-1">
                            Welcome back <span style={{ color: '#8e5cff' }}>!</span>
                        </h1>
                        <p className="text-center text-sm mb-8" style={{ color: '#6F6F7A' }}>
                            Sign in to your Welyat account
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl mb-4 py-2 px-4 text-center">
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                                    Phone number
                                </label>
                                <div className={`flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 transition focus-within:ring-2 ${loading ? 'opacity-50' : ''}`}
                                    style={{ '--tw-ring-color': '#8e5cff' } as any}>
                                    <Phone size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        disabled={loading}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 000 000 0000"
                                        className="focus:outline-none ml-2 w-full p-3 text-sm bg-transparent"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                                    Password
                                </label>
                                <div className={`flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 transition focus-within:ring-2 ${loading ? 'opacity-50' : ''}`}
                                    style={{ '--tw-ring-color': '#8e5cff' } as any}>
                                    <KeyRound size={16} className="text-gray-400 shrink-0" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        disabled={loading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="focus:outline-none ml-2 w-full p-3 text-sm bg-transparent"
                                        autoComplete="current-password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-primary transition shrink-0">
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end -mt-2">
                                <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: '#8e5cff' }}>
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-60 cursor-pointer"
                                style={{
                                    background: loading ? '#b78cff' : 'linear-gradient(135deg, #7A4CFF 0%, #B78CFF 100%)',
                                    boxShadow: '0 4px 15px rgba(142, 92, 255, 0.35)',
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>

                            <p className="text-center text-xs text-gray-400">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold hover:underline" style={{ color: '#8e5cff' }}>
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
