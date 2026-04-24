import { useEffect } from "react";
import { useAuth } from "./Auth";
import { Outlet, useNavigate } from "react-router-dom";

export default function RedirectIfLoggedIn() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        if (user.role === "admin") {
            navigate("/admin");
        } else if (user.role === "listener") {
            navigate("/listener");
        } else if (user.role === "talker" || user.role === "both") {
            navigate("/talker");
        }
    }, [user, navigate])

    return <Outlet />
}