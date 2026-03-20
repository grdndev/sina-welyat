import { Menu } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import LogoutButton from "../../components/LogoutButton";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const nav = [
    {url: "/admin/", name: "Admin"},
    {url: "/admin/sessions", name: "Sessions"},
    {url: "/admin/analytics", name: "Analytics"},
    {url: "/admin/settings", name: "Settings"},
]

export default function Layout({ children }: PropsWithChildren) {
    const [showMenu, setShowMenu] = useState(false);

    return <div className="min-h-screen w-full bg-gradient-to-br from-background-from to-background-to text-text-primary overflow-x-hidden">
        <header className="fixed md:relative w-full border-b border-primary/10 bg-background p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-3 text-xl md:text-3xl font-bold tracking-wider uppercase">
                    <img src={logo} width={50}/>
                    <span className="text-shadow-lg text-shadow-gray-400/40">Welyat</span>
                </h1>
                <nav className="hidden md:block">
                    <ul className="flex gap-5 text-xl text-text-secondary font-semibold">
                        {nav.map((n,i) => <li key={i} className="hover:text-text-primary">
                            <Link to={n.url}>{n.name}</Link>
                        </li>)}
                    </ul>
                </nav>
                <div className="hidden md:flex items-center gap-2 text-lg font-medium text-text-secondary">
                    <button className="px-2">FR</button>
                    <button className="px-2">EN</button>
                    <LogoutButton />
                </div>
                <div className="flex items-center gap-2 md:hidden">
                    <button className="flex items-center justify-center rounded-lg bg-linear-to-r from-background-from to-background-to transition hover:from-background-from/80 hover:to-background-to/80 p-4 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                        <Menu />
                    </button>
                    <LogoutButton />
                </div>
            </div>
            <div className={`md:hidden absolute transition top-full right-0 h-screen bg-background border-l border-primary/10 ${showMenu ? "translate-x-0" : "translate-x-2/1"}`}>
                <nav>
                    <ul className="flex flex-col gap-2 text-3xl text-text-secondary font-semibold p-3">
                        {nav.map((n,i) => <li key={i} className="hover:text-text-primary p-2">
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