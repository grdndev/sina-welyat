import { AtSign, CheckCircle, Eye, EyeOff, KeyRound, MoveLeft } from "lucide-react";
import Layout from "./Layout";
import React, { useState } from "react";

export default function Register() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    function validate() {
        if (!formData?.email || !formData?.password || !formData?.confirm) {
            throw new Error("Veuillez remplir tous les champs");
        }

        if (formData.password !== formData.confirm) {
            throw new Error("Les mots de passe ne correspondent pas");
        }
    }

    function handleFormData(type: string, value: any) {
        const newFormData = {...formData};
        newFormData[type] = value ?? undefined;
        setFormData(newFormData);
    }

    async function handleFormSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            validate();
            // await register;
            setSuccess("Account succesfully created : please click the link we sent you to verify your email address.");
        } catch (error: any) {
            setError(error.message ?? "An error occured, try later");
        } finally {
            setLoading(false);
        }
    }

    return <Layout>
        <div className="h-screen flex flex-col items-center justify-center">
            <form className="w-md flex flex-col gap-2 rounded-lg border border-cyan-500/20 p-4 bg-slate-800/80" onSubmit={handleFormSubmit}>
                <h1 className="text-lg font-bold">Registration</h1>
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
                    <div className="flex flex-col text-gray-400">
                        <div>Confirm password</div>
                        <div className="relative border-1 border-gray-500 bg-gray-500/10 rounded-lg p-2 px-2 text-white/60 flex focus-within:border-cyan-500/20">
                            <CheckCircle />
                            <input className={`focus:outline-none ml-2 w-full${loading ? " animate-pulse opacity-10" : ""}`} disabled={loading} type={showPasswordConfirm ? 'text' : 'password'} onChange={(e) => handleFormData('confirm', e.target.value)} />
                            <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>{showPasswordConfirm ? <Eye /> : <EyeOff />}</button>
                        </div>
                    </div>
                </div>
                {error && <div className="bg-red-500/10 border-1 border-red-500/30 text-red-500 rounded py-2 px-3">
                    {error}
                </div>}
                {success && <div className="bg-green-500/10 border-1 border-green-500/30 text-green-500 rounded py-2 px-3">
                    {success}
                </div>}
                <button className="bg-primary/80 hover:bg-primary border-1 border-white/20 transition rounded p-2 font-bold" type="submit">
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <div className="w-sm flex p-2">
                <a href="/login" className="flex gap-1 text-gray-300">
                    <MoveLeft />
                    <div>Log in</div>
                </a>
            </div>
        </div>
    </Layout>
}