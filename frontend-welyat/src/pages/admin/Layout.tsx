import { Bell, SquareActivity } from "lucide-react";
import type { PropsWithChildren } from "react";
import LogoutButton from "../../components/LogoutButton";

const nav = [
    {url: "/admin/", name: "Admin"},
    {url: "/admin/sessions", name: "Sessions"},
    {url: "/admin/analytics", name: "Analytics"},
    {url: "/admin/settings", name: "Settings"},
]

export default function Layout({ children }: PropsWithChildren) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-sky-950 to-green-950 text-white">
        <header className="border-b border-cyan-500/20 bg-gradient-to-r from-sky-950 to-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-3 text-xl md:text-3xl font-bold tracking-wider uppercase">
                    <SquareActivity size={30} className="text-cyan-400" />
                    <span className="text-shadow-lg text-shadow-gray-400/40">Welyat</span>
                </h1>
                <nav>
                    <ul className="flex gap-5 text-xl text-gray-400 font-semibold">
                        {nav.map(n => <li className="hover:text-gray-300">
                            <a href={n.url}>{n.name}</a>
                        </li>)}
                    </ul>
                </nav>
                <div className="flex items-center gap-2 text-lg font-medium text-slate-100">
                    <button className="px-2">FR</button>
                    <button className="px-2">EN</button>
                    <LogoutButton />
                </div>
            </div>
        </header>
        {children}
    </div>
}