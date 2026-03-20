import { Menu, SquareActivity } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import LogoutButton from "../../components/LogoutButton";
import { Link } from "react-router-dom";

const nav = [
    {url: "/admin/", name: "Admin"},
    {url: "/admin/sessions", name: "Sessions"},
    {url: "/admin/analytics", name: "Analytics"},
    {url: "/admin/settings", name: "Settings"},
]

export default function Layout({ children }: PropsWithChildren) {
    const [showMenu, setShowMenu] = useState(false);

    return <div className="min-h-screen w-full bg-gradient-to-br from-sky-950 to-green-950 text-white overflow-x-hidden">
        <header className="fixed md:relative w-full border-b border-cyan-500/20 bg-gradient-to-r from-sky-950 to-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-3 text-xl md:text-3xl font-bold tracking-wider uppercase">
                    <SquareActivity size={30} className="text-cyan-400" />
                    <span className="text-shadow-lg text-shadow-gray-400/40">Welyat</span>
                </h1>
                <nav className="hidden md:block">
                    <ul className="flex gap-5 text-xl text-gray-400 font-semibold">
                        {nav.map(n => <li className="hover:text-gray-300">
                            <Link to={n.url}>{n.name}</Link>
                        </li>)}
                    </ul>
                </nav>
                <div className="hidden md:flex items-center gap-2 text-lg font-medium text-slate-100">
                    <button className="px-2">FR</button>
                    <button className="px-2">EN</button>
                    <LogoutButton />
                </div>
                <button className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
                    <Menu />
                </button>
            </div>
            <div className={`md:hidden absolute transition top-full right-0 h-screen bg-linear-to-br from-sky-950 to-slate-950 border-l border-white/5 ${showMenu ? "translate-x-0" : "translate-x-2/1"}`}>
                <nav>
                    <ul className="flex flex-col gap-2 text-3xl text-gray-400 font-semibold p-3">
                        {nav.map(n => <li className="hover:text-gray-300 p-2">
                            <Link to={n.url}>{n.name}</Link>
                        </li>)}
                    </ul>
                </nav>
            </div>
        </header>
        <div className="mt-10 md:mt-0">
            {children}
        </div>
    </div>
}