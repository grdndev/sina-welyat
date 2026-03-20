import { useEffect } from "react";
import { useAuth } from "./Auth";
import { Outlet, useNavigate } from "react-router-dom";

export default function RedirectIfLoggedIn() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {

        } else if (user.role === "admin") {
            navigate("/admin");
        } else if (user.role === "listener") {
            navigate("/listener");
        }
    })

    return <Outlet />
}