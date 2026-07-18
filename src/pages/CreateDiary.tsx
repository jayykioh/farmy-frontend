import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Camera, Droplets, FlaskConical, BugOff, Save, Sprout, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MascotLottie } from '../components/MascotLottie';
import { Button } from '../components/ui/Button';
import { useGetDiariesQuery } from '../store/api/farmApi';
import { useAppDispatch } from '../store/hooks';
import { useAuthStore } from '../store/authStore';
import { createBlobDigest, createDiaryRequestHash } from '../lib/diaryHash';
import { assertStorageRoom, compressImageFile, ensurePersistentStorage } from '../lib/imageCompression';
import { saveOfflineDiaryDraft } from '../lib/indexedDB';
import { runDiarySync } from '../lib/diarySyncEngine';
import { CreateSeasonModal } from '../components/modals';

export const CreateDiary: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: diaries = [], isLoading: fetching } = useGetDiariesQuery();
  const [selectedDiaryId, setSelectedDiaryId] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [activeActivities, setActiveActivities] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const activeDiaries = diaries.filter((d) => d.status === 'active');
  const activeDiaryId = selectedDiaryId || activeDiaries[0]?._id || '';

  const selectedDiary = useMemo(
    () => diaries.find((diary) => diary._id === activeDiaryId),
    [diaries, activeDiaryId],
  );

  const toggleActivity = (activity: string) => {
    setActiveActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  };

  const activityType = useMemo(() => {
    if (activeActivities.includes('water')) return 'Tưới nước';
    if (activeActivities.includes('fertilizer')) return 'Bón phân';
    if (activeActivities.includes('pest')) return 'Phun thuốc';
    return 'Chăm sóc định kỳ';
  }, [activeActivities]);

  const content = useMemo(() => {
    const parts: string[] = [];
    if (growthStage.trim()) parts.push(`Giai đoạn: ${growthStage.trim()}`);
    if (notes.trim()) parts.push(notes.trim());
    return parts.join('. ') || 'Đã thực hiện cập nhật ruộng vườn hằng ngày.';
  }, [growthStage, notes]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeDiaryId) {
      alert('Vui lòng chọn hoặc tạo nhật ký vụ mùa trước.');
      return;
    }
    if (!userId) {
      alert('Vui lòng đăng nhập lại để lưu nhật ký offline.');
      return;
    }

    setIsSaving(true);
    try {
      await ensurePersistentStorage();
      const imageBlobs = await Promise.all(imageFiles.slice(0, 4).map(compressImageFile));
      const imageDigests = await Promise.all(imageBlobs.map(createBlobDigest));
      const requiredBytes =
        imageBlobs.reduce((total, blob) => total + blob.size, 0) + new Blob([content]).size + 2048;

      await assertStorageRoom(requiredBytes);

      const diaryDate = new Date().toISOString();
      const requestHash = await createDiaryRequestHash({
        diaryId: activeDiaryId,
        activityType,
        content,
        diaryDate,
        cropType: selectedDiary?.crop_type,
        imageDigests,
      });

      await saveOfflineDiaryDraft({
        id: crypto.randomUUID(),
        userId,
        diaryId: activeDiaryId,
        cropType: selectedDiary?.crop_type,
        activityType,
        content,
        diaryDate,
        status: 'pending',
        attemptCount: 0,
        idempotencyKey: crypto.randomUUID(),
        requestHash,
        imageBlobs,
        imageDigests,
        imageUrls: imageUrl.startsWith('http') ? [imageUrl] : [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      void runDiarySync(userId, dispatch);
      navigate('/diary');
    } catch (error) {
      console.error(error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Bộ nhớ offline không đủ để lưu nhật ký này.');
      } else {
        alert('Không thể lưu nhật ký offline.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 4);
    if (files.length === 0) return;

    setImageFiles(files);
    setImageUrl(URL.createObjectURL(files[0]));
  };

  return (
    <>
      <CreateSeasonModal
        isOpen={showCreateSeason}
        onClose={() => setShowCreateSeason(false)}
        onSuccess={() => setShowCreateSeason(false)}
        mode="add-season"
      />
      <div className="w-full min-h-[100svh] bg-bg-main text-left font-sans">
      <PageHeader title="Nhật ký hoạt động" leftButton="close" rightButton="none" />

      <main className="w-full max-w-2xl mx-auto pt-24 pb-36 md:pb-10 px-5 md:px-8">
        {fetching ? (
          <div className="py-20 text-center font-bold text-text-main/70">
            Đang tải danh sách cây trồng...
          </div>
        ) : diaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150 pointer-events-none" />
              <Sprout className="w-14 h-14 text-primary/60 relative" />
            </div>
            <div className="flex flex-col gap-1.5 max-w-[240px]">
              <p className="font-black text-text-h text-lg">Chưa có vụ mùa nào</p>
              <p className="text-sm font-medium text-text-main/60 leading-relaxed">
                Bạn cần tạo một vụ mùa trước khi ghi nhật ký hoạt động.
              </p>
            </div>
            <Button onClick={() => setShowCreateSeason(true)}>
              <Sprout className="w-4 h-4" />
              Tạo vụ mùa
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <section className="bg-white border border-border-main/50 rounded-3xl p-5 shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="font-bold text-sm text-text-main ml-2">Chọn vụ mùa *</span>
                  <span className="relative block">
                    <select
                      value={activeDiaryId}
                      onChange={(event) => setSelectedDiaryId(event.target.value)}
                      className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none shadow-sm cursor-pointer"
                    >
                      <optgroup label="🌱 Đang canh tác">
                        {diaries.filter(d => d.status === 'active').map((diary) => (
                          <option key={diary._id} value={diary._id}>
                            {diary.crop_type} - {new Date(diary.start_date).toLocaleDateString('vi-VN')}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="📦 Đã lưu trữ">
                        {diaries.filter(d => d.status === 'archived').map((diary) => (
                          <option key={diary._id} value={diary._id}>
                            {diary.crop_type} - {new Date(diary.start_date).toLocaleDateString('vi-VN')}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-main/70 w-5 h-5" />
                  </span>
                </label>

                <label className="space-y-2">
                  <span className="font-bold text-sm text-text-main ml-2">Giai đoạn sinh trưởng *</span>
                  <span className="relative block">
                    <select
                      value={growthStage}
                      onChange={(event) => setGrowthStage(event.target.value)}
                      className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none shadow-sm cursor-pointer"
                      required
                    >
                      <option value="" disabled>Chọn giai đoạn...</option>
                      <option value="Gieo hạt / Nảy mầm">Gieo hạt / Nảy mầm</option>
                      <option value="Cây non / Phát triển">Cây non / Phát triển</option>
                      <option value="Ra hoa / Làm đòng">Ra hoa / Làm đòng</option>
                      <option value="Kết trái / Nuôi hạt">Kết trái / Nuôi hạt</option>
                      <option value="Gần thu hoạch">Gần thu hoạch</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-main/70 w-5 h-5" />
                  </span>
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="font-bold text-sm text-text-main ml-2">Nhật ký vườn ruộng</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full bg-white border border-border-main/80 rounded-[20px] p-4 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none shadow-sm"
                  placeholder="Hôm nay ruộng vườn nhà bạn có gì thay đổi?"
                  rows={5}
                />
              </label>

              <div className="space-y-3">
                <span className="font-bold text-sm text-text-main ml-2">Hoạt động trong ngày</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'water', label: 'Đã tưới nước', icon: <Droplets className="w-5 h-5" /> },
                    { id: 'fertilizer', label: 'Đã bón phân', icon: <FlaskConical className="w-5 h-5" /> },
                    { id: 'pest', label: 'Phun thuốc', icon: <BugOff className="w-5 h-5" /> },
                  ].map((activity) => (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => toggleActivity(activity.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-sm transition-all border ${
                        activeActivities.includes(activity.id)
                          ? 'bg-primary text-white border-primary shadow-[0_4px_10px_rgba(8,168,85,0.3)]'
                          : 'bg-white text-text-main/70 border-border-main/50 hover:bg-bg-surface'
                      }`}
                    >
                      {activity.icon}
                      <span>{activity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-sm text-text-main ml-2">Hình ảnh thực tế</span>
                <div className="grid grid-cols-4 gap-4">
                  <label className="aspect-square border border-dashed border-border-main rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-bg-surface-1 transition-colors group p-2">
                    <input
                      accept="image/png, image/jpeg"
                      className="hidden"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                    <Camera className="w-6 h-6 text-text-main/30 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold text-text-main/50 mt-1">Thêm ảnh</span>
                    <span className="text-[8px] font-medium text-text-main/40 mt-0.5 text-center leading-tight">PNG, JPG<br/>(Tối đa 5MB)</span>
                  </label>

                  {imageUrl ? (
                    <div className="aspect-square bg-bg-surface-1 rounded-2xl overflow-hidden shadow-sm border border-border-main/30 relative group">
                      <img className="w-full h-full object-cover opacity-90" alt="Preview" src={imageUrl} />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setImageFiles([]);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="bg-bg-surface-1 border border-primary/20 p-4 rounded-xl flex gap-4 items-center shadow-sm">
              <div className="w-16 h-16 flex-shrink-0">
                <MascotLottie className="w-full h-full drop-shadow-md" />
              </div>
              <p className="text-sm font-medium text-text-main/80 leading-tight">
                Ghi lại thay đổi của cây trồng mỗi ngày giúp Farmy đưa ra khuyến nghị tốt hơn.
              </p>
            </section>
          </form>
        )}
      </main>

      {diaries.length > 0 && !fetching ? (
        <footer className="fixed md:static bottom-0 left-0 right-0 w-full max-w-2xl mx-auto p-5 bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-border-main/30 md:border-t-0 space-y-3 z-50">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full shadow-[0_10px_20px_rgba(8,168,85,0.2)] active:translate-y-0.5 active:scale-95 transition-all text-lg py-4 rounded-full"
            icon={<Save className="w-5 h-5" />}
          >
            {isSaving ? 'Đang lưu nhật ký...' : 'Lưu nhật ký'}
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 text-text-main/50 font-bold hover:text-text-main transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
        </footer>
      ) : null}
    </div>
    </>
  );
};

export default CreateDiary;
