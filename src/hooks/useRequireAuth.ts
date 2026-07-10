import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const initialize = useAuthStore((state) => state.initialize);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === 'idle') {
      void initialize();
      return;
    }

    if (status === 'unauthenticated') {
      navigate('/', { replace: true });
    }
  }, [initialize, navigate, status]);

  return { checkingAuth: status === 'idle' || status === 'checking' };
};
