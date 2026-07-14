import { useEffect } from 'react';
import { runDiarySync, stopDiarySync } from '../lib/diarySyncEngine';
import { useAppDispatch } from '../store/hooks';
import { useAuthStore } from '../store/authStore';

export const useDiaryOfflineSync = () => {
  const dispatch = useAppDispatch();
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) {
      stopDiarySync();
      return undefined;
    }

    void runDiarySync(userId, dispatch);

    const handleOnline = () => {
      void runDiarySync(userId, dispatch);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      stopDiarySync();
    };
  }, [dispatch, userId]);
};
