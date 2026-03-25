import { createBrowserRouter } from "react-router-dom";
import AuthProtection from "./middlewares/AuthProtection";
import AuthProvider from "./middlewares/Auth";
import DashboardAdmin from "./pages/admin/Dashboard";
import DashboardListener from "./pages/listener/Dashboard";
import Error from "./pages/Error";
import Login from "./pages/auth/Login";
import RedirectIfLoggedIn from "./middlewares/RedirectIfLoggedIn";
import Register from "./pages/auth/Register";
import Homepage from "./pages/landingpage/Homepage";
import Listener from "./pages/landingpage/Listener";
import TermsOfService from "./pages/support/termsOfService";

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
            path: "/",
            element: <RedirectIfLoggedIn />,
            children: [
                {
                    path: "/",
                    element: <Homepage />,
                },
            ]
        },
        {
            path: "/termsOfService",
            element: <TermsOfService />
        },
        {
            element: <AuthProtection />,
            children: [
                {
                    path: "/admin",
                    element: <DashboardAdmin />
                },
                {
                    path: "/listener",
                    element: <DashboardListener />
                },
            ]
        },{
            path: "/",
            element: <RedirectIfLoggedIn />,
            children: [
                {
                    path: "/home-listener",
                    element: <Listener />,
                },
            ]
        }
    ]
}])