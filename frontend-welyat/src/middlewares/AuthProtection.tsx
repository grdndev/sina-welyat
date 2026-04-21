import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import Loading from "../pages/Loading";

export default function AuthProtection() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        setLoading(false);
    }, [user, navigate]);

    if (loading) {
        return <Loading />;
    }

    return <Outlet />;
}