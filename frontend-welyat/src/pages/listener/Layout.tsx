import { Bell } from "lucide-react";
import type { PropsWithChildren } from "react";
import LogoutButton from "../../components/LogoutButton";
import logo from "../../assets/logo.png";

export default function Layout({ children }: PropsWithChildren) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-background-from to-background-to text-text-primary">
        <header className="border-b border-primary/10 bg-background p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-3 text-xl sm:text-3xl font-bold tracking-wider uppercase">
                    <img src={logo} width={50}/>
                    <span className="hidden sm:block text-shadow-lg text-shadow-gray-400/40">Dashboard</span>
                    <span className="text-shadow-sm text-shadow-primary-gradient text-primary">Listener</span>
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium text-text-secondary">
                    <button className="flex items-center justify-center rounded-lg bg-linear-to-r from-background-from to-background-to transition hover:from-background-from/80 hover:to-background-to/80 p-4 cursor-pointer"><Bell /></button>
                    <LogoutButton />
                </div>
            </div>
        </header>
        {children}
    </div>
}