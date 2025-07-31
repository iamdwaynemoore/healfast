import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, hasCompletedOnboarding } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a proper loading component
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has completed onboarding (except if they're already on the welcome page)
  if (!hasCompletedOnboarding() && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}