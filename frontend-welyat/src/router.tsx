import { createBrowserRouter } from "react-router-dom";
import AuthProtection from "./middlewares/AuthProtection";
import Dashboard from "./pages/listener/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <h1>Login</h1>
    },
    {
        path: "/register",
        element: <h1>Register</h1>
    },
    {
        path: "/",
        element: <AuthProtection />,
        children: [
            //Add redirect based on role
            {
                path: "/",
                element: <Dashboard />
            }
        ]
    }
])