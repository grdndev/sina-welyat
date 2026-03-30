import { AtSign, Eye, EyeOff, KeyRound, MoveRight } from "lucide-react";
import { useAuth } from "../../middlewares/Auth";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

type FormData = {
    email: string;
    password: string;
}

export default function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<FormData>({email: '', password: ''});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function validate() {
        if (!formData?.email || !formData?.password) {
            throw new Error("Please fill all the fields");
        }
    }

    function handleFormData(type: string, value: string) {
        setFormData({...formData, [type]: value});
    }

    async function handleFormSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            validate()

            if (formData.email.includes("admin")) {
                login({
                    id: 0,
                    name: "Admin",
                    email: formData.email,
                    role: "admin"
                }, {});
            } else {
                login({
                    id: 0,
                    name: "Listener",
                    email: formData.email,
                    role: "listener"
                }, {});
            }
        } catch (error: any) {
            setError(error.message ?? "An error occured, try later");
        } finally {
            setLoading(false);
        }
    }

    return <Layout>
      <div className="w-full flex items-center justify-center -m-2 sm:-m-4 md:-m-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="flex w-full max-w-md bg-white/30 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl overflow-hidden">

          <div className="flex flex-col justify-center w-full px-10 py-12">

            {/* Title */}
            <h1 className="text-center text-text-primary text-3xl font-extrabold tracking-tight my-4">
              Welcome <span style={{ color: '#8e5cff' }}>Back</span>
            </h1>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl my-2 py-2 px-4 text-center">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-bold text-text-primary uppercase tracking-wider">Email</label>
                <div className={`flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition ${loading ? 'opacity-50' : ''}`}>
                  <AtSign size={16} className="text-gray-400 shrink-0" />
                  <input
                    id="email"
                    type="email"
                    disabled={loading}
                    onChange={(e) => handleFormData('email', e.target.value)}
                    placeholder="john@example.com"
                    className="focus:outline-none ml-2 w-full p-3 text-sm bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs font-bold text-text-primary uppercase tracking-wider">Password</label>
                <div className={`flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition ${loading ? 'opacity-50' : ''}`}>
                  <KeyRound size={16} className="text-gray-400 shrink-0" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    onChange={(e) => handleFormData('password', e.target.value)}
                    placeholder="••••••••"
                    className="focus:outline-none ml-2 w-full p-3 text-sm bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-blue-600 transition shrink-0"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end -mt-1">
                <Link to="/forgot-password" className="text-xs text-text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                typeBtn="submit"
                name={loading ? 'Signing in...' : 'Sign In'}
                className="w-full mt-4 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
              />

              {/* Register redirect */}
              <p className="text-center text-xs text-gray-400 mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-text-primary font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>

            </form>
          </div>

        </div>
      </div>
    </Layout>
}