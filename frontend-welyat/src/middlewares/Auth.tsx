import { createContext, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
const APP_ID = import.meta.env.VITE_APP_ID || "sina-welyat";

type Context = {
    user?: User;
    login?: any;
    logout?: any;
}

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
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
    localStorage.setItem(`${APP_ID}${key}`, JSON.stringify(data));
    setter(data);
}

function dataFromLocalStorage(key: string) {
    const json = localStorage.getItem(`${APP_ID}${key}`);

    if (!json || json === "undefined") {
        return null;
    }

    const data = JSON.parse(json);
    return data;
}

function provideAuth() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(dataFromLocalStorage("user"));
    const [tokens, setTokens] = useState<any>(dataFromLocalStorage("tokens"));

    function login(user: User, tokens: any) {
        dataToLocalStorage("user", user, setUser);
        dataToLocalStorage("tokens", tokens, setTokens);
        navigate("/");
    }

    function logout() {
        dataToLocalStorage("user", null, setUser)
        dataToLocalStorage("tokens", null, setTokens)
        navigate("/login");
    }

    return {
        login,
        logout,
        user,
        tokens
    };
}