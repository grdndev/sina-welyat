import { Bell, Headphones } from "lucide-react";
import type { PropsWithChildren } from "react";
import LogoutButton from "../../components/LogoutButton";

export default function Layout({ children }: PropsWithChildren) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-sky-950 to-green-950 text-white">
        <header className="border-b border-cyan-500/20 bg-gradient-to-r from-sky-950 to-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-3 text-xl sm:text-3xl font-bold tracking-wider uppercase">
                    <Headphones size={30} className="text-cyan-400" />
                    <span className="hidden sm:block text-shadow-lg text-shadow-gray-400/40">Dashboard</span>
                    <span className="text-shadow-lg text-shadow-emerald-400/40 text-emerald-300">Listener</span>
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-100">
                    <button className="flex items-center justify-center rounded-lg bg-gray-500/30 transition hover:bg-gray-500/50 p-4 cursor-pointer"><Bell /></button>
                    <LogoutButton />
                </div>
            </div>
        </header>
        {children}
    </div>
}