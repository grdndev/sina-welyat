import { createContext, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

type Context = {
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
}

export const AuthContext = createContext<Context>({});
export const useAuth = () => {
    return useContext(AuthContext);
}

export default function AuthProvider() {
    const auth = provideAuth();

    return <AuthContext.Provider value={auth}>
        <Outlet />
    </AuthContext.Provider>;
}

function dataToLocalStorage(key: string, data: any, setter: (data: any) => void) {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
}

function dataFromLocalStorage(key: string) {
    const json = localStorage.getItem(key);
    if (!json) {
        return null;
    }

    const data = JSON.parse(json);
    return data;
}

function provideAuth() {
    const navigate = useNavigate();
    // const { post_auth_login } = useApi();
    const [user, setUser] = useState(dataFromLocalStorage("user"));
    const [tokens, setTokens] = useState(dataFromLocalStorage("tokens"));
    const API_URL = import.meta.env.VITE_API_URL;

    function register(user: any, tokens: any) {
        if (!user || !tokens) {
            throw new Error("Erreur d'inscription");
        }

        dataToLocalStorage("user", user, setUser);
        dataToLocalStorage("tokens", tokens, setTokens);
        navigate("/");
    }

    async function login(formData: any) {
        if (!formData?.email || !formData?.password) {
            throw new Error("Email et mot de passe requis");
        }

        // const response = await post_auth_login(formData);
        // const json = await response.json();

        // if (!json.success) {
        //     throw new Error(json.message ?? "Erreur serveur");
        // } else {
        //     dataToLocalStorage("user", json.data.user, setUser);
        //     dataToLocalStorage("tokens", json.data.tokens, setTokens);
        //     navigate("/");
        // }
    }

    function logout() {
        dataToLocalStorage("user", null, setUser)
        dataToLocalStorage("tokens", null, setTokens)
        navigate("/login");
    }

    return {
        register,
        login,
        logout,
        user,
        tokens
    };
}