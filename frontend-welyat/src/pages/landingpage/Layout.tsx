import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

export default function Layout({children}: PropsWithChildren) {
    return <div className="max-w-screen min-h-screen text-text-primary bg-linear-to-br from-background-from to-background-to">
        <header className="grid grid-cols-3">
            <div className="col-start-2 flex items-center justify-center p-8 gap-3">
                <img src={logo} width={100}/>
                <div className="flex flex-col items-start tracking-wider">
                    <h1 className="text-5xl">WELYAT</h1>
                    <div>We Listen to You Anytime</div>
                </div>
            </div>
            <nav className="ml-auto">
                <ul className="flex gap-4 pt-10 pr-10">
                    <li><Link to="#">Why Welyat ?</Link></li>
                    <li><Link to="#">How It Works</Link></li>
                    <li><Link to="#">Pricing</Link></li>
                    <li><Link to="#">FAQ</Link></li>
                </ul>
            </nav>
        </header>
        <div className="p-5">
            {children}
        </div>
    </div>
}