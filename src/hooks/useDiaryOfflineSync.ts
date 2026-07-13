import { useEffect } from 'react';
import { runDiarySync, stopDiarySync } from '../lib/diarySyncEngine';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useDiaryOfflineSync = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

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
