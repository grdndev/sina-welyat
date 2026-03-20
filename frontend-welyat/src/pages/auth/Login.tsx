import { AtSign, Eye, EyeOff, KeyRound, MoveRight } from "lucide-react";
import { useAuth } from "../../middlewares/Auth";
import Layout from "./Layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";

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

    function handleFormData(type: string, value: string) {
        setFormData({...formData, [type]: value});
    }

    async function handleFormSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);
        try {
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
        <div className="h-screen flex flex-col items-center justify-center">
            <form className="w-full md:w-fit flex flex-col gap-2 rounded-lg border border-cyan-500/20 p-4 bg-slate-800/80" onSubmit={handleFormSubmit}>
                <h1 className="text-lg font-bold">Authentication</h1>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col text-gray-400">
                        <div>Email</div>
                        <div className="border-1 border-gray-500 bg-gray-500/10 rounded-lg p-2 px-2 text-white/60 flex focus-within:border-cyan-500/20">
                            <AtSign />
                            <input className={`focus:outline-none ml-2 w-full${loading ? " animate-pulse opacity-10" : ""}`} disabled={loading} type="email" onChange={(e) => handleFormData('email', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-col text-gray-400">
                        <div>Password</div>
                        <div className="border-1 border-gray-500 bg-gray-500/10 rounded-lg p-2 px-2 text-white/60 flex focus-within:border-cyan-500/20">
                            <KeyRound />
                            <input className={`focus:outline-none ml-2 w-full${loading ? " animate-pulse opacity-10" : ""}`} disabled={loading} type={showPassword ? 'text' : 'password'} onChange={(e) => handleFormData('password', e.target.value)} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye /> : <EyeOff />}</button>
                        </div>
                    </div>
                </div>
                {error && <div className="bg-red-500/10 border-1 border-red-500/30 text-red-500 rounded py-2 px-3">
                    {error}
                </div>}
                <button className="bg-primary/80 hover:bg-primary border-1 border-white/20 transition rounded p-2 font-bold mt-4" type="submit">
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
            <div className="w-sm flex p-2">
                <Link to="/register" className="ml-auto flex gap-1 text-gray-300">
                    <div>Register</div>
                    <MoveRight />
                </Link>
            </div>
        </div>
    </Layout>
}