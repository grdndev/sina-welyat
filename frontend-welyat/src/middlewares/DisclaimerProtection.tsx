import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Auth';

export default function DisclaimerProtection() {
  const { user } = useAuth();

  if (user && !user.accepted_disclaimer) {
    return <Navigate to="/disclaimers" replace />;
  }

  return <Outlet />;
}
