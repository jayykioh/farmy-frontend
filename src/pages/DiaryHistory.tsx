import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Archive, CheckCircle2, Clock, Droplets, Leaf, Shield, Sprout, Trash2, WifiOff } from 'lucide-react';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';
import {
  useGetDiaryDetailQuery,
  useGetDiaryLogsQuery,
  useGetDiariesQuery,
  useUpdateDiaryMutation,
  useDeleteDiaryMutation,
} from '../store/api/farmApi';
import { Button } from '../components/ui/Button';
import { useAppSelector } from '../store/hooks';
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
      statusLabel: string;
      statusClass: string;
    }
  | {
      kind: 'local';
      id: string;
      activityType: string;
      content: string;
      createdAt: string;
      statusLabel: string;
      statusClass: string;
      draft: OfflineDiaryDraft;
    };

const localStatusMeta: Record<OfflineDiaryDraft['status'], { label: string; className: string }> = {
  draft: { label: 'Bản nháp', className: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Chờ đồng bộ', className: 'bg-amber-100 text-amber-700' },
  syncing: { label: 'Đang đồng bộ', className: 'bg-blue-100 text-blue-700' },
  failed_retryable: { label: 'Sẽ thử lại', className: 'bg-orange-100 text-orange-700' },
  failed_permanent: { label: 'Cần sửa', className: 'bg-red-100 text-red-700' },
  sync_confirming: { label: 'Đang xác nhận', className: 'bg-emerald-100 text-emerald-700' },
};

const getActivityIcon = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('tưới')) return <Droplets className="w-6 h-6 text-blue-500" />;
  if (type.includes('phân') || type.includes('dinh dưỡng')) return <Leaf className="w-6 h-6 text-emerald-500" />;
  if (type.includes('thuốc') || type.includes('sâu')) return <Shield className="w-6 h-6 text-orange-500" />;
  return <Sprout className="w-6 h-6 text-primary" />;
};

const getActivityBg = (activityType: string) => {
  const type = activityType.toLowerCase();
  if (type.includes('tưới')) return 'bg-blue-50';
  if (type.includes('phân') || type.includes('dinh dưỡng')) return 'bg-emerald-50';
  if (type.includes('thuốc') || type.includes('sâu')) return 'bg-orange-50';
  return 'bg-gray-50';
};

export const DiaryHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diaryIdParam = searchParams.get('diaryId');
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDiaryDraft[]>([]);

  const { data: diaries = [], isLoading: diariesLoading } = useGetDiariesQuery();
  const activeDiaryId = diaryIdParam || (diaries.length > 0 ? diaries[0]._id : undefined);

  const { data: diary, isLoading: diaryLoading } = useGetDiaryDetailQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const { data: logs = [], isLoading: logsLoading } = useGetDiaryLogsQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const [updateDiary] = useUpdateDiaryMutation();
  const [deleteDiary] = useDeleteDiaryMutation();

  const handleArchive = async () => {
    if (!activeDiaryId || !diary) return;
    if (window.confirm('Bạn có chắc muốn lưu trữ vụ mùa này?')) {
      try {
        await updateDiary({ id: activeDiaryId, data: { status: 'archived' } }).unwrap();
        alert('Đã lưu trữ vụ mùa!');
      } catch (e) {
        console.error(e);
        alert('Lỗi khi lưu trữ!');
      }
    }
  };

  const handleDelete = async () => {
    if (!activeDiaryId) return;
    if (window.confirm('Bạn có chắc muốn xóa vụ mùa này? Không thể hoàn tác!')) {
      try {
        await deleteDiary(activeDiaryId).unwrap();
        alert('Đã xóa vụ mùa!');
        navigate('/diary');
      } catch (e) {
        console.error(e);
        alert('Lỗi khi xóa!');
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
      createdAt: log.created_at,
      statusLabel: 'Đã ghi',
      statusClass: 'bg-primary/10 text-primary-container',
    }));

    const localEntries: TimelineEntry[] = filterVisibleOfflineDrafts(visibleOfflineDrafts, logs).map((draft) => {
        const meta = localStatusMeta[draft.status];
        return {
          kind: 'local',
          id: draft.id,
          activityType: draft.activityType,
          content: draft.content,
          createdAt: draft.diaryDate,
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
    <div className="w-full min-h-screen bg-bg-surface-1">
      <PageHeader 
        title={diary ? `Lịch sử: ${diary.crop_type}` : 'Nhật ký canh tác'} 
        subtitle="Chi tiết các hoạt động chăm sóc cây trồng" 
        leftButton="back"
        rightButton="none"
      />
      <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-8 max-w-5xl mx-auto">
        {diary && (
          <div className="flex justify-end gap-2">
            {diary.status === 'active' && (
              <Button size="sm" variant="outline" onClick={handleArchive} className="flex gap-2 items-center text-primary border-primary">
                <Archive className="w-4 h-4" /> Lưu trữ
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleDelete} className="flex gap-2 items-center text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> Xóa vụ mùa
            </Button>
          </div>
        )}

        {/* Bé Thóc Encouragement */}
        <section className="flex items-end gap-4 w-full">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-border-main/50 shrink-0 relative overflow-hidden p-1 shadow-sm">
            <MascotLottie className="w-full h-full -mt-1" />
          </div>
          <div className="relative bg-white border border-border-main/50 rounded-2xl p-4 mb-2 flex-1 shadow-sm">
            <p className="text-base font-medium text-text-main">
              {entries.length > 0
                ? 'Bạn đang duy trì chăm sóc cây trồng đều đặn.'
                : 'Bạn chưa ghi nhận hoạt động chăm sóc nào cho cây này.'}
            </p>
          </div>
        </section>

        {loading ? (
          <div className="py-20 text-center font-bold text-text-main/70">
            Đang tải lịch sử chi tiết...
          </div>
        ) : !diary ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <Sprout className="w-12 h-12 text-text-main/50" />
            <p className="font-bold text-text-main/70">Không tìm thấy thông tin nhật ký vụ mùa.</p>
            <Button onClick={() => navigate('/diary')} className="px-6 py-2">
              Xem danh sách Nhật ký
            </Button>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-border-main/50 rounded-3xl p-6 flex flex-col gap-4 row-span-2 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-text-h">Chăm sóc tuần này</h3>
                  <span className="bg-secondary-light/30 text-secondary-dark px-3 py-1 rounded-full font-bold text-sm">
                    Hiện tại
                  </span>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-4 bg-bg-surface-1 border border-border-main/30 rounded-2xl p-4">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
                    const height = entries.length > index ? `${Math.min(90, 35 + index * 8)}%` : '10%';
                    return (
                      <div key={day} className="flex flex-col items-center gap-2 h-full justify-end w-full group">
                        <div className="w-full bg-bg-surface h-32 relative flex items-end overflow-hidden rounded-full">
                          <div className="bg-primary w-full rounded-full transition-all duration-500" style={{ height }} />
                        </div>
                        <span className="font-bold text-text-main/70 text-xs">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-6 shadow-sm">
                <Clock className="w-10 h-10 text-primary mb-2" />
                <p className="text-base text-text-main/70 mb-1">Cập nhật lần cuối</p>
                <h4 className="text-xl font-extrabold text-text-main">
                  {entries.length > 0
                    ? new Date(entries[0].createdAt).toLocaleDateString('vi-VN')
                    : 'Chưa có hoạt động'}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm">
                  <Activity className="w-8 h-8 text-secondary mb-2" />
                  <p className="font-bold text-sm text-text-main/70 mb-1">Tổng hoạt động</p>
                  <h4 className="text-2xl font-extrabold text-text-main">{entries.length}</h4>
                </div>
                <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                  <p className="font-bold text-sm text-text-main/70 mb-1">Trạng thái</p>
                  <h4 className="text-lg font-bold text-text-main uppercase">
                    {diary.status === 'active' ? 'Đang trồng' : 'Hoàn thành'}
                  </h4>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 mt-2">
              <h3 className="text-2xl font-bold text-text-h mb-2">Hoạt động chăm sóc ruộng vườn</h3>

              {entries.length === 0 ? (
                <div className="bg-white border border-border-main/50 rounded-2xl p-8 text-center text-text-main/50 font-bold">
                  Không có bản ghi nhật ký hoạt động nào cho cây trồng này.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map((entry) => {
                    const icon = entry.kind === 'local' ? <WifiOff className="w-6 h-6 text-amber-500" /> : getActivityIcon(entry.activityType);
                    const bg = entry.kind === 'local' ? 'bg-amber-50' : getActivityBg(entry.activityType);

                    return (
                      <div
                        key={`${entry.kind}-${entry.id}`}
                        className="bg-white border border-border-main/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
                      >
                        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-text-main truncate">{entry.activityType}</h4>
                          <p className="text-sm text-text-main/70 truncate">{entry.content}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-bold text-xs text-text-main/50">
                            {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className={`${entry.statusClass} px-2 py-0.5 rounded-full font-bold text-[10px]`}>
                            {entry.statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <Button onClick={() => navigate('/diary/create')} className="flex-1 py-4 text-lg">
                  Thêm hoạt động mới
                </Button>
                <Button onClick={() => navigate('/diary')} variant="outline" className="flex-1 py-4 text-lg bg-white">
                  Quay lại danh sách
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default DiaryHistory;
