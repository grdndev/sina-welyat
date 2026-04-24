import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../middlewares/Auth";

export default function MagicLink() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { setSession } = useAuth();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        authApi.verifyMagicLink(token)
            .then(({ data }) => {
                setSession?.(data.user as any, { token: data.token });
                navigate("/call");
            })
            .catch(() => {
                navigate("/login");
            });
    }, [token]);

    return null;
}
