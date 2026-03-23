import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren ) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-background-from to-background-to text-text-primary">
        {children}
    </div>
}