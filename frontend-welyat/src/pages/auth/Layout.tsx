import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-sky-950 to-green-950 text-white">
        {children}
    </div>
}