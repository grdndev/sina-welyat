import { MoveLeft } from "lucide-react";
import { useRouteError } from "react-router-dom"

type ErrorBoundaryError = {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: any;
}

export default function Error() {
    const error = useRouteError() as ErrorBoundaryError;

    return <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-sky-950 to-green-950 text-white">
            <div className="flex flex-col gap-2 rounded-lg border border-cyan-500/20 p-4 bg-slate-800/80">
                <h1 className="font-bold text-lg text-red-500">An Error occurred.</h1>
                <div>
                    <div className="font-bold">{error.status} {error.statusText}</div>
                    <div>{error.data}</div>
                </div>
            </div>
            <div className="w-sm flex p-2">
                <a href="/" className="flex gap-1 text-gray-300">
                    <MoveLeft />
                    <div>Back</div>
                </a>
            </div>
    </div>
}