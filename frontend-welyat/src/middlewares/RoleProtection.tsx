import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import Loading from "../pages/Loading";

export default function ProtectionProvider({ roles = [] }: { roles: string[] }) {
    const auth = useAuth();
    const [allowed, setAllowed] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (roles.includes(auth.user!.role)) {
            setAllowed(true);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />
    }

    if (!allowed) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}