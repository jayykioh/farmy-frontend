/* Hallmark · page: diary-history · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Pulse, Archive, CheckCircle, Clock, Drop, Leaf, Shield, Plant, Trash, WifiSlash } from '@phosphor-icons/react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/PageHeader';
import {
  useGetDiaryDetailQuery,
  useGetDiaryLogsQuery,
  useGetDiariesQuery,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} from '../store/api/farmApi';
import { useAuthStore } from '../store/authStore';
import {
  OFFLINE_DIARY_DRAFTS_CHANGED,
  deleteOfflineDiaryDraft,
  listOfflineDiaryDraftsByUser,
  type OfflineDiaryDraft,
} from '../lib/indexedDB';
import {
  filterVisibleOfflineDrafts,
  getConfirmedOfflineDraftIds,
} from '../lib/diaryDraftConfirmation';

type TimelineEntry =
  | {
      kind: 'remote';
      id: string;
      activityType: string;
      content: string;
      createdAt: string;
      imageUrl?: string;
      statusLabel: string;
      statusClass: string;
    }
  | {
      kind: 'local';
      id: string;
      activityType: string;
      content: string;
      createdAt: string;
      imageUrl?: string;
      statusLabel: string;
      statusClass: string;
      draft: OfflineDiaryDraft;
    };

const localStatusMeta: Record<OfflineDiaryDraft['status'], { label: string; className: string }> = {
  draft: { label: 'Bản nháp', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Chờ đồng bộ', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  syncing: { label: 'Đang đồng bộ', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  failed_retryable: { label: 'Sẽ thử lại', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  failed_permanent: { label: 'Cần sửa', className: 'bg-red-100 text-red-700 border-red-200' },
  sync_confirming: { label: 'Đang xác nhận', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const getActivityIcon = (activityType: string) => {
  const type = (activityType || '').toLowerCase();
  if (type.includes('tưới')) return <Drop className="w-6 h-6 text-blue-500" weight="duotone" />;
  if (type.includes('phân') || type.includes('dinh dưỡng')) return <Leaf className="w-6 h-6 text-emerald-500" weight="duotone" />;
  if (type.includes('thuốc') || type.includes('sâu')) return <Shield className="w-6 h-6 text-orange-500" weight="duotone" />;
  return <Plant className="w-6 h-6 text-primary" weight="duotone" />;
};

const getActivityBg = (activityType: string) => {
  const type = (activityType || '').toLowerCase();
  if (type.includes('tưới')) return 'bg-blue-50';
  if (type.includes('phân') || type.includes('dinh dưỡng')) return 'bg-emerald-50';
  if (type.includes('thuốc') || type.includes('sâu')) return 'bg-orange-50';
  return 'bg-bg-surface-2';
};

export const DiaryHistory: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const diaryIdParam = params.id || searchParams.get('diaryId') || '';
  const userId = useAuthStore((state) => state.user?.id);
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDiaryDraft[]>([]);

  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const { data: diaries = [], isLoading: diariesLoading } = useGetDiariesQuery();
  const activeDiaryId = diaryIdParam;

  const { data: diary, isLoading: diaryLoading, isError: diaryError } = useGetDiaryDetailQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const { data: logs = [], isLoading: logsLoading, isError: logsError } = useGetDiaryLogsQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const [updateDiary] = useUpdateDiaryMutation();
  const [deleteDiary] = useDeleteDiaryMutation();

  const handleArchive = async () => {
    if (!activeDiaryId || !diary) return;
    if (window.confirm('Bạn có chắc muốn lưu trữ vụ mùa này?')) {
      try {
        await updateDiary({ id: activeDiaryId, data: { status: 'archived' } }).unwrap();
        toast.success('Đã lưu trữ vụ mùa!');
      } catch (e) {
        console.error(e);
        toast.error('Lỗi khi lưu trữ!');
      }
    }
  };

  const handleDelete = async () => {
    if (!activeDiaryId) return;
    if (window.confirm('Bạn có chắc muốn xóa vụ mùa này? Không thể hoàn tác!')) {
      try {
        await deleteDiary(activeDiaryId).unwrap();
        toast.success('Đã xóa vụ mùa!');
        navigate('/diary');
      } catch (e) {
        console.error(e);
        toast.error('Lỗi khi xóa!');
      }
    }
  };

  const loading = diariesLoading || diaryLoading || logsLoading;
  const visibleOfflineDrafts = useMemo(
    () => (userId && activeDiaryId ? offlineDrafts : []),
    [activeDiaryId, offlineDrafts, userId],
  );

  useEffect(() => {
    if (!userId || !activeDiaryId) {
      return undefined;
    }

    let cancelled = false;
    const loadDrafts = async () => {
      const drafts = await listOfflineDiaryDraftsByUser(userId, activeDiaryId);
      if (!cancelled) setOfflineDrafts(drafts);
    };

    void loadDrafts();
    window.addEventListener(OFFLINE_DIARY_DRAFTS_CHANGED, loadDrafts);

    return () => {
      cancelled = true;
      window.removeEventListener(OFFLINE_DIARY_DRAFTS_CHANGED, loadDrafts);
    };
  }, [activeDiaryId, userId]);

  useEffect(() => {
    if (logs.length === 0 || visibleOfflineDrafts.length === 0) return;

    getConfirmedOfflineDraftIds(visibleOfflineDrafts, logs).forEach((id) => {
      void deleteOfflineDiaryDraft(id);
    });
  }, [logs, visibleOfflineDrafts]);

  const entries = useMemo<TimelineEntry[]>(() => {
    const remoteEntries: TimelineEntry[] = logs.map((log) => ({
      kind: 'remote',
      id: log._id,
      activityType: log.activity_type,
      content: log.content,
      createdAt: log.activity_at || log.created_at,
      imageUrl: log.image_url,
      statusLabel: 'Đã ghi',
      statusClass: 'bg-primary-light/10 text-secondary-dark border border-primary-light/20',
    }));

    const localEntries: TimelineEntry[] = filterVisibleOfflineDrafts(visibleOfflineDrafts, logs).map((draft) => {
        const meta = localStatusMeta[draft.status];
        
        let localImageUrl = undefined;
        if (draft.imageUrls?.[0]) {
          localImageUrl = draft.imageUrls[0];
        } else if (draft.imageBlobs?.[0]) {
          localImageUrl = URL.createObjectURL(draft.imageBlobs[0]);
        }

        return {
          kind: 'local',
          id: draft.id,
          activityType: draft.activityType,
          content: draft.content,
          createdAt: draft.diaryDate,
          imageUrl: localImageUrl,
          statusLabel: meta.label,
          statusClass: meta.className,
          draft,
        };
      });

    return [...localEntries, ...remoteEntries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [logs, visibleOfflineDrafts]);

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-24 text-left">
      <PageHeader 
        title={diary ? `Lịch sử: ${diary.crop_type}` : 'Nhật ký canh tác'} 
        subtitle="Chi tiết các hoạt động chăm sóc cây trồng" 
        leftButton="back"
        rightButton="none"
      />
      <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-8 max-w-5xl mx-auto">
        {diary && (
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                diary.status === 'archived' 
                  ? 'bg-bg-surface-2 text-text-secondary border-border-main/50' 
                  : 'bg-primary-light/20 text-[#008A5E] border-primary-light/40'
              }`}>
                {diary.status === 'active' ? '🌱 Đang canh tác' : '📦 Đã lưu trữ'}
              </span>
            </div>
            <div className="flex justify-end gap-3">
              {diary.status === 'active' && (
                <button 
                  onClick={handleArchive} 
                  className="btn btn--soft text-xs px-3 py-2 font-bold cursor-pointer flex gap-1.5 items-center active:scale-95"
                >
                  <Archive className="w-3.5 h-3.5" weight="duotone" /> Lưu trữ
                </button>
              )}
              <button 
                onClick={handleDelete} 
                className="btn btn--coral text-xs px-3 py-2 font-bold cursor-pointer flex gap-1.5 items-center active:scale-95"
              >
                <Trash className="w-3.5 h-3.5" weight="duotone" /> Xóa vụ
              </button>
            </div>
          </div>
        )}

        {/* Bé Thóc Encouragement */}
        <section className="flex items-start gap-4 w-full">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-border-main shrink-0 relative overflow-hidden p-1 shadow-sm">
            <PetMascot className="w-full h-full -mt-1" status={petStatus} size={56} />
          </div>
          <div className="relative pet-mood-bubble flex-1 shadow-sm mt-1">
            <p className="text-sm font-bold text-text-main">
              {entries.length > 0
                ? 'Bạn đang duy trì chăm sóc cây trồng đều đặn.'
                : 'Bạn chưa ghi nhận hoạt động chăm sóc nào cho cây này.'}
            </p>
            <span className="pet-mood-bubble__tail" aria-hidden="true" />
          </div>
        </section>

        {loading ? (
          <div className="py-20 text-center font-bold text-text-secondary">
            Đang tải lịch sử chi tiết...
          </div>
        ) : diaryError || logsError ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <Plant className="w-12 h-12 text-text-secondary" weight="duotone" />
            <p className="font-bold text-text-secondary">Không tải được dữ liệu nhật ký. Vui lòng thử lại.</p>
            <button onClick={() => navigate('/diary')} className="btn btn--cyan px-6 py-2 active:scale-95">
              Xem danh sách Nhật ký
            </button>
          </div>
        ) : !diary ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <Plant className="w-12 h-12 text-text-secondary" weight="duotone" />
            <p className="font-bold text-text-secondary">Không tìm thấy thông tin nhật ký vụ mùa.</p>
            <button onClick={() => navigate('/diary')} className="btn btn--cyan px-6 py-2 active:scale-95">
              Xem danh sách Nhật ký
            </button>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card-bubble p-6 flex flex-col gap-4 row-span-2 shadow-sm text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-extrabold text-text-h">Chăm sóc tuần này</h3>
                  <span className="bg-primary-light/20 text-[#008A5E] px-3 py-1 rounded-full font-bold text-sm">
                    Hiện tại
                  </span>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-4 bg-bg-surface-1 border-2 border-border-main/50 rounded-[20px] p-4">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
                    const height = entries.length > index ? `${Math.min(90, 35 + index * 8)}%` : '10%';
                    return (
                      <div key={day} className="flex flex-col items-center gap-2 h-full justify-end w-full group">
                        <div className="w-full bg-white h-32 relative flex items-end overflow-hidden rounded-full border border-border-main/30">
                          <div className="bg-[#008A5E] w-full rounded-full transition-all duration-500" style={{ height }} />
                        </div>
                        <span className="font-bold text-text-secondary text-xs">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-bubble flex flex-col justify-center items-center text-center p-6 shadow-sm">
                <Clock className="w-10 h-10 text-[#008A5E] mb-2" weight="duotone" />
                <p className="text-sm font-semibold text-text-secondary mb-1">Cập nhật lần cuối</p>
                <h4 className="text-xl font-extrabold text-text-main font-mono">
                  {entries.length > 0
                    ? new Date(entries[0].createdAt).toLocaleDateString('vi-VN')
                    : 'Chưa có hoạt động'}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card-bubble flex flex-col justify-center items-center text-center p-4 shadow-sm">
                  <Pulse className="w-8 h-8 text-secondary mb-2" weight="duotone" />
                  <p className="font-bold text-xs text-text-secondary mb-1">Tổng hoạt động</p>
                  <h4 className="text-2xl font-black text-text-main font-mono">{entries.length}</h4>
                </div>
                <div className="card-bubble flex flex-col justify-center items-center text-center p-4 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" weight="duotone" />
                  <p className="font-bold text-xs text-text-secondary mb-1">Trạng thái</p>
                  <h4 className="text-sm font-black text-[#008A5E] uppercase">
                    {diary.status === 'active' ? 'Đang trồng' : 'Hoàn thành'}
                  </h4>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 mt-6">
              <h3 className="text-xl md:text-2xl font-black text-text-h mb-2">Hoạt động chăm sóc ruộng vườn</h3>

              {entries.length === 0 ? (
                <div className="card-bubble p-8 text-center text-text-secondary font-bold">
                  Không có bản ghi nhật ký hoạt động nào cho cây trồng này.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {entries.map((entry) => {
                    const icon = getActivityIcon(entry.activityType);
                    const bg = getActivityBg(entry.activityType);

                    return (
                      <div
                        key={`${entry.kind}-${entry.id}`}
                        className="card-bubble p-4 flex flex-col gap-3 text-left relative"
                      >
                        {entry.kind === 'local' && (
                          <div className="absolute top-4 right-4 bg-amber-50 p-1.5 rounded-full border border-amber-200">
                            <WifiSlash className="w-3.5 h-3.5 text-amber-500" weight="bold" />
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${bg} border border-border-main/30 flex items-center justify-center shrink-0`}>
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-extrabold text-text-h truncate">{entry.activityType}</h4>
                            <span className="font-bold text-xs text-text-secondary font-mono block">
                              {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                        
                        {entry.imageUrl && (
                          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-border-main/50 bg-bg-surface-2 mt-1">
                            <img
                              className="h-full w-full object-cover"
                              src={entry.imageUrl}
                              alt={`Ảnh hoạt động ${entry.activityType}`}
                            />
                          </div>
                        )}
                        
                        <p className="text-sm font-medium text-text-main line-clamp-3 mt-1">{entry.content}</p>
                        
                        <div className="flex justify-end mt-1">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${entry.statusClass}`}>
                            {entry.statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button onClick={() => navigate(`/diary/create?diaryId=${activeDiaryId}`)} className="btn btn--cyan flex-1 py-4 text-base font-extrabold cursor-pointer active:scale-95">
                  Thêm hoạt động mới
                </button>
                <button onClick={() => navigate('/diary')} className="btn btn--soft flex-1 py-4 text-base font-bold cursor-pointer active:scale-95">
                  Quay lại danh sách
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DiaryHistory;
