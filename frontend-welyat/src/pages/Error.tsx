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

    return <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-background-from to-background-to text-text-primary">
            <div className="flex flex-col gap-2 rounded-lg border border-primary/10 p-4 bg-background">
                <h1 className="font-bold text-lg text-red-500">An Error occurred.</h1>
                <div>
                    <div className="font-bold">{error.status} {error.statusText}</div>
                    <div>{error.data}</div>
                </div>
            </div>
            <div className="w-sm flex p-2">
                <a href="/" className="flex gap-1 text-text-secondary">
                    <MoveLeft />
                    <div>Back</div>
                </a>
            </div>
    </div>
}