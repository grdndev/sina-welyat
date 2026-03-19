import { useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";

export default function Redirect() {
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

    return <Loading />
}