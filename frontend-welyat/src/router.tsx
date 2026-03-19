import { createBrowserRouter } from "react-router-dom";
import AuthProtection from "./middlewares/AuthProtection";
import DashboardListener from "./pages/listener/Dashboard";
import DashboardAdmin from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import AuthProvider from "./middlewares/Auth";
import Register from "./pages/auth/Register";
import Redirect from "./middlewares/Redirect";
import Error from "./pages/Error";

export const router = createBrowserRouter([{
    element: <AuthProvider />,
    errorElement: <Error />,
    children: [
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            element: <AuthProtection />,
            children: [
                {
                    path: "/",
                    element: <Redirect />
                },
                {
                    path: "/admin",
                    element: <DashboardAdmin />
                },
                {
                    path: "/listener",
                    element: <DashboardListener />
                },
            ]
        }
    ]
}])