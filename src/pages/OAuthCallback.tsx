/* Hallmark · page: oauth-callback · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

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
    <div className="flex h-screen w-full items-center justify-center bg-bg-main font-sans p-4 text-left">
      <div className="card-bubble bg-white p-8 border-2 border-border-main shadow-lg rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border-main border-t-[#008A5E]"></div>
        <p className="text-text-h font-black text-lg">Đang xác thực thông tin...</p>
        <p className="text-text-secondary font-bold text-xs">Bé Thóc đang đưa bạn tới nông trại thân yêu!</p>
      </div>
    </div>
  );
}
