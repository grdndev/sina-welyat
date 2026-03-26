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
import TermsOfService from "./pages/support/TermsOfService";
import Contact from "./pages/support/Contact";
import BecomeListener from "./pages/landingpage/BecomeListener";
import Requirements from "./pages/support/Requirements";
import Paid from "./pages/support/Paid";


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
        },{
            path: "/termsOfService",
            element: <TermsOfService />
        },{
            path: "/contact",
            element: <Contact />
        },{
            path:"/becomeListener",
            element: <BecomeListener/>
        },{
            path:"/requirements",
            element: <Requirements/>
        },{
            path:"/paid",
            element: <Paid />
        }
    ]
}])