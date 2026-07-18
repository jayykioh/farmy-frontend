import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const processLogin = async () => {
      const accessToken = searchParams.get('accessToken');
      
      if (accessToken) {
        // Fetch user profile using the new token
        try {
          // Temporarily set token in API client or localStorage to make the request
          localStorage.setItem('access_token', accessToken);
          
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          
          if (response.data?.success && response.data?.data) {
            setSession({
              accessToken: accessToken,
              user: response.data.data
            });
            if (response.data.data.onboardingCompleted) {
              navigate('/home', { replace: true });
            } else {
              navigate('/home', { replace: true });
            }
          } else {
            throw new Error('Failed to fetch user');
          }
        } catch (error) {
          console.error('OAuth processing error:', error);
          localStorage.removeItem('access_token');
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };

    processLogin();
  }, [searchParams, navigate, setSession]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-container border-t-primary-main"></div>
        <p className="text-text-main font-medium">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
