import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';
import {
  useGetDiaryDetailQuery,
  useGetDiaryLogsQuery,
  useGetDiariesQuery,
} from '../store/api/farmApi';
import { Droplets, Leaf, Shield, Sprout, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DiaryHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diaryIdParam = searchParams.get('diaryId');

  const { data: diaries = [], isLoading: diariesLoading } = useGetDiariesQuery();
  const activeDiaryId = diaryIdParam || (diaries.length > 0 ? diaries[0]._id : undefined);

  const { data: diary, isLoading: diaryLoading } = useGetDiaryDetailQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const { data: logs = [], isLoading: logsLoading } = useGetDiaryLogsQuery(activeDiaryId || '', {
    skip: !activeDiaryId,
  });

  const loading = diariesLoading || diaryLoading || logsLoading;

  // Activity type icon helpers
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

  return (
    <div className="w-full min-h-screen bg-bg-surface-1">
      <PageHeader 
        title={diary ? `Lịch sử: ${diary.crop_type}` : 'Nhật ký canh tác'} 
        subtitle="Chi tiết các hoạt động chăm sóc cây trồng" 
        leftButton="back" 
      />
      <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-8 max-w-5xl mx-auto">

        {/* Bé Thóc Encouragement */}
        <section className="flex items-end gap-4 w-full">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-border-main/50 shrink-0 relative overflow-hidden p-1 shadow-sm">
            <MascotLottie className="w-full h-full -mt-1" />
          </div>
          <div className="relative bg-white border border-border-main/50 rounded-2xl p-4 mb-2 flex-1 shadow-sm">
            <p className="text-base font-medium text-text-main">
              {logs.length > 0 
                ? 'Tuyệt vời! Bạn đang duy trì chăm sóc cây trồng rất đều đặn. Hãy tiếp tục cập nhật nhật ký nhé!'
                : 'Bạn chưa ghi nhận hoạt động chăm sóc nào cho cây này. Hãy tạo nhật ký hoạt động mới ngay nhé!'}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white border-r-[12px] border-r-transparent"></div>
            <div className="absolute -bottom-3.5 left-5 w-0 h-0 border-l-[14px] border-l-transparent border-t-[14px] border-t-border-main/50 border-r-[14px] border-r-transparent -z-10"></div>
          </div>
        </section>

        {loading ? (
          <div className="py-20 text-center font-bold text-text-main/70">Đang tải lịch sử chi tiết...</div>
        ) : !diary ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <Sprout className="w-12 h-12 text-text-main/50" />
            <p className="font-bold text-text-main/70">Không tìm thấy thông tin nhật ký vụ mùa!</p>
            <Button 
              onClick={() => navigate('/diary')}
              className="px-6 py-2"
            >
              Xem danh sách Nhật ký
            </Button>
          </div>
        ) : (
          <>
            {/* Bento Grid: Stats & Chart */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Weekly Chart */}
              <div className="bg-white border border-border-main/50 rounded-3xl p-6 flex flex-col gap-4 row-span-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-text-h">Chăm Sóc Tuần Này</h3>
                  <span className="bg-secondary-light/30 text-secondary-dark px-3 py-1 rounded-full font-bold text-sm">Hiện tại</span>
                </div>
                {/* Simple Bar Chart */}
                <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-4 bg-bg-surface-1 border border-border-main/30 rounded-2xl p-4">
                  {[{ day: 'T2', h: logs.length > 0 ? '40%' : '10%' }, { day: 'T3', h: logs.length > 1 ? '65%' : '10%' }, { day: 'T4', h: logs.length > 2 ? '85%' : '10%' }, { day: 'T5', h: logs.length > 3 ? '50%' : '10%' }, { day: 'T6', h: logs.length > 4 ? '90%' : '10%' }, { day: 'T7', h: logs.length > 5 ? '30%' : '10%' }, { day: 'CN', h: logs.length > 6 ? '70%' : '10%' }].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end w-full group">
                      <div className="w-full bg-bg-surface h-32 relative flex items-end overflow-hidden rounded-full">
                        <div className="bg-primary w-full rounded-full transition-all duration-500 ease-out group-hover:bg-primary-dark" style={{ height: item.h }}></div>
                      </div>
                      <span className="font-bold text-text-main/70 text-xs">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Stats Cards */}
              <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-6 shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-10 h-10 text-primary mb-2" />
                <p className="text-base text-text-main/70 mb-1">Cập nhật lần cuối</p>
                <h4 className="text-xl font-extrabold text-text-main">
                  {logs.length > 0 ? new Date(logs[0].created_at).toLocaleDateString('vi-VN') : 'Chưa có hoạt động'}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm hover:shadow-md transition-shadow">
                  <Activity className="w-8 h-8 text-secondary mb-2" />
                  <p className="font-bold text-sm text-text-main/70 mb-1">Tổng hoạt động</p>
                  <h4 className="text-2xl font-extrabold text-text-main">{logs.length}</h4>
                </div>
                <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                  <p className="font-bold text-sm text-text-main/70 mb-1">Trạng thái</p>
                  <h4 className="text-lg font-bold text-text-main uppercase">{diary.status === 'active' ? 'Đang trồng' : 'Hoàn thành'}</h4>
                </div>
              </div>

            </section>

            {/* Recent Diary Entries List */}
            <section className="flex flex-col gap-4 mt-2">
              <h3 className="text-2xl font-bold text-text-h mb-2">Hoạt động chăm sóc ruộng vườn</h3>
              
              {logs.length === 0 ? (
                <div className="bg-white border border-border-main/50 rounded-2xl p-8 text-center text-text-main/50 font-bold">
                  Không có bản ghi nhật ký hoạt động nào cho cây trồng này.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logs.map(log => {
                    const icon = getActivityIcon(log.activity_type);
                    const bg = getActivityBg(log.activity_type);
                    return (
                      <div 
                        key={log._id}
                        className="bg-white border border-border-main/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-bg-surface-1 transition-colors shadow-sm hover:shadow-md active:scale-95 group"
                      >
                        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-2xl`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-text-main truncate">{log.activity_type}</h4>
                          <p className="text-sm text-text-main/70 truncate">{log.content}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-bold text-xs text-text-main/50">
                            {new Date(log.created_at).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="bg-primary/10 text-primary-container px-2 py-0.5 rounded-full font-bold text-[10px]">Đã ghi</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={() => navigate('/diary/create')}
                  className="flex-1 py-4 text-lg"
                >
                  Thêm hoạt động mới
                </Button>
                <Button 
                  onClick={() => navigate('/diary')}
                  variant="outline"
                  className="flex-1 py-4 text-lg bg-white"
                >
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
