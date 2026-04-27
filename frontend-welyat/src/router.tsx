import { createBrowserRouter } from "react-router-dom";
import AuthProtection from "./middlewares/AuthProtection";
import RoleProtection from "./middlewares/RoleProtection";
import AuthProvider from "./middlewares/Auth";
import DisclaimerProtection from "./middlewares/DisclaimerProtection";
import Disclaimers from "./pages/Disclaimers";
import DashboardAdmin from "./pages/admin/Dashboard";
import AdminSessions from "./pages/admin/Sessions";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import DashboardListener from "./pages/listener/Dashboard";
import DashboardTalker from "./pages/talker/Dashboard";
import Call from "./pages/talker/Call";
import Welcome from "./pages/Welcome";
import Error from "./pages/Error";
import Login from "./pages/auth/Login";
import RedirectIfLoggedIn from "./middlewares/RedirectIfLoggedIn";
import Register from "./pages/auth/Register";
import Homepage from "./pages/landingpage/Homepage";
import TermsOfService from "./pages/support/TermsOfService";
import XpRewards from "./pages/support/XpRewards";
import Contact from "./pages/support/Contact";
import BecomeListener from "./pages/landingpage/BecomeListener";
import Requirements from "./pages/support/Requirements";
import Paid from "./pages/support/Paid";
import Why from "./pages/support/Why";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";
import CommunityGuidelines from "./pages/support/CommunityGuidelines";
import Faq from "./pages/support/Faq";
import RegisterListener from "./pages/auth/Register-listener";
import Subscriptions from "./pages/talker/Subscriptions";
import PayoutSetup from "./pages/listener/PayoutSetup";
import MagicLink from "./pages/MagicLink";

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <Error />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/register-listener", element: <RegisterListener /> },
      {
        path: "/",
        element: <RedirectIfLoggedIn />,
        children: [{ path: "/", element: <Homepage /> }],
      },
      {
        element: <AuthProtection />,
        children: [
          {
            element: <RoleProtection roles={["admin"]} />,
            children: [
              { path: "/admin", element: <DashboardAdmin /> },
              { path: "/admin/welcome", element: <Welcome /> },
              { path: "/admin/sessions", element: <AdminSessions /> },
              { path: "/admin/analytics", element: <AdminAnalytics /> },
              { path: "/admin/settings", element: <AdminSettings /> },
            ],
          },
          { path: "/disclaimers", element: <Disclaimers /> },
          { path: "/listener", element: <DashboardListener /> },
          { path: "/listener/payout-setup", element: <PayoutSetup /> },
          {
            element: <DisclaimerProtection />,
            children: [
              { path: "/welcome", element: <Welcome /> },
              { path: "/talker", element: <DashboardTalker /> },
              { path: "/subscriptions", element: <Subscriptions /> },
            ],
          },
        ],
      },
      { path: "/call", element: <Call /> },
      { path: "/magic/:token", element: <MagicLink /> },
      { path: "/termsOfService", element: <TermsOfService /> },
      { path: "/contact", element: <Contact /> },
      { path: "/becomeListener", element: <BecomeListener /> },
      { path: "/requirements", element: <Requirements /> },
      { path: "/paid", element: <Paid /> },
      { path: "/why", element: <Why /> },
      { path: "/privacyPolicy", element: <PrivacyPolicy /> },
      { path: "/communityGuidelines", element: <CommunityGuidelines /> },
      { path: "/xpRewards", element: <XpRewards /> },
      { path: "/faq", element: <Faq /> },
    ],
  },
]);