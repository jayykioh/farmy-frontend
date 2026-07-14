import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = () => {
  const location = useLocation();
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (status === 'idle') {
      void initialize();
    }
  }, [initialize, status]);

  if (status === 'idle' || status === 'checking') {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Guard onboarding status:
  const onboardingPaths = ['/onboarding-1', '/onboarding-2', '/onboarding-3'];
  const isOnboardingPath = onboardingPaths.includes(location.pathname);

  if (!user?.onboardingCompleted) {
    if (!isOnboardingPath) {
      return <Navigate to="/onboarding-1" replace />;
    }
  } else {
    if (isOnboardingPath) {
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet />;
};
