import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";

export default function AuthProtection() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if (!auth?.user) {
            // navigate("/login");
        // }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>l</div>
    }

    return <Outlet />;
}