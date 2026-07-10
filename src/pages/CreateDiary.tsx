import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';
import { useGetDiariesQuery, useCreateDiaryLogMutation } from '../store/api/farmApi';
import { useInvalidatePetStatus } from '../features/pet/hooks/useInvalidatePetStatus';
import { Sprout, ChevronDown, Thermometer, Droplets, FlaskConical, BugOff, Camera, X, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CreateDiary: React.FC = () => {
  const navigate = useNavigate();
  const { data: diaries = [], isLoading: fetching } = useGetDiariesQuery();
  const [createDiaryLog, { isLoading: loading }] = useCreateDiaryLogMutation();
  const invalidatePetStatus = useInvalidatePetStatus();
  const [selectedDiaryId, setSelectedDiaryId] = useState<string>('');
  const [growthStage, setGrowthStage] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('https://lh3.googleusercontent.com/aida-public/AB6AXuBBsDRgI1pvIo50IOk1rW3XMKV7rFhTt9_s8aTQNkN_WywF7AIGqdVhXjoHALtZprcHrXKjLhttsRZCpjA4uvk_Um24WBesbsE838pimS7ZoudphdnkPFClv9WTTHUkJeYPc4xmdfViit333Cz9CIlJOwN1Q3vb7F72FPHvJMjnyqxQTdgnBBr2O-MnyEgAEIaPO1Dm6D_LT6RC8NAcso7A3hw9dfbzxz58X2roER3BslU56C5sb_vWdPjtLft7MqmLlOGLkEQso-ij'); // default placeholder image
  const [activeActivities, setActiveActivities] = useState<string[]>([]);

  useEffect(() => {
    if (diaries.length > 0 && !selectedDiaryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDiaryId(diaries[0]._id);
    }
  }, [diaries, selectedDiaryId]);

  const toggleActivity = (activity: string) => {
    setActiveActivities(prev => 
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiaryId) {
      alert('Vui lòng chọn hoặc tạo nhật ký vụ mùa trước!');
      return;
    }
    try {
      // activity type is derived from toggled activities
      let activityType = 'Chăm sóc định kỳ';
      if (activeActivities.includes('water')) {
        activityType = 'Tưới nước';
      } else if (activeActivities.includes('fertilizer')) {
        activityType = 'Bón phân';
      } else if (activeActivities.includes('pest')) {
        activityType = 'Phun thuốc';
      }

      const contentParts: string[] = [];
      if (growthStage) {
        contentParts.push(`Giai đoạn: ${growthStage}`);
      }
      if (notes) {
        contentParts.push(notes);
      }
      const content = contentParts.join('. ') || 'Đã thực hiện cập nhật ruộng vườn hàng ngày.';

      await createDiaryLog({
        diaryId: selectedDiaryId,
        log: {
          activity_type: activityType,
          content,
          image_url: imageUrl || undefined,
        }
      }).unwrap();

      invalidatePetStatus();

      navigate('/diary');
    } catch (err) {
      console.error(err);
      alert('Không thể lưu nhật ký hoạt động!');
    }
  };

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-bg-main overflow-x-hidden font-sans">
      <PageHeader 
        title="Nhật ký mới"
        leftButton="close"
        rightButton="none"
      />
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-light/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-secondary-light/30 rounded-full blur-3xl"></div>
        {/* Wavy grass decoration at bottom */}
        <div className="absolute bottom-0 w-full h-[60px] bg-gradient-to-t from-primary/10 to-transparent"></div>
      </div>
      {/* Main Bottom Sheet Simulation */}
      <div className="relative w-full max-w-2xl mx-auto md:mt-8 bg-white rounded-t-[40px] md:rounded-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] md:shadow-xl md:border md:border-border-main/50 z-10 flex flex-col min-h-[100svh] md:min-h-0 md:h-auto">
        
        {/* Pull Indicator */}
        <div className="w-12 h-1.5 bg-border-main rounded-full mx-auto mt-4 mb-2 md:hidden"></div>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 pb-32 md:pb-8">
          {fetching ? (
            <div className="py-20 text-center font-bold text-text-main/70">Đang tải danh sách cây trồng...</div>
          ) : diaries.length === 0 ? (
            <div className="py-20 text-center flex flex-col gap-4 items-center">
              <Sprout className="w-12 h-12 text-primary/50" />
              <p className="font-bold text-text-main/70">Bạn chưa bắt đầu vụ mùa nào để ghi nhật ký!</p>
              <button 
                onClick={() => navigate('/home')}
                className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary-dark"
              >
                Về Trang chủ để thêm vụ mùa
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 pt-2">
              
              {/* Crop Type & Growth Stage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-sm text-text-main ml-2">Chọn vụ mùa / Loại cây *</label>
                  <div className="relative">
                    <select 
                      value={selectedDiaryId}
                      onChange={(e) => setSelectedDiaryId(e.target.value)}
                      className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none shadow-sm transition-shadow"
                    >
                      {diaries.map(diary => (
                        <option key={diary._id} value={diary._id}>
                          {diary.crop_type} ({diary.status === 'active' ? 'Đang canh tác' : 'Lưu trữ'})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-main/70 w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-sm text-text-main ml-2">Giai đoạn sinh trưởng</label>
                  <input 
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container shadow-sm transition-shadow placeholder:text-border-main" 
                    placeholder="Đang làm đòng / Trổ bông" 
                    type="text"
                  />
                </div>
              </div>
              
              {/* Weather Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-surface-1 border border-primary/20 rounded-full shadow-sm">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-sm text-primary">32°C - Nắng ráo - Độ ẩm 74% (Từ GPS)</span>
              </div>
              
              {/* Diary Textarea */}
              <div className="space-y-2">
                <label className="font-bold text-sm text-text-main ml-2">Nhật ký vườn ruộng</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-border-main/80 rounded-[20px] p-4 font-medium text-base focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none shadow-sm transition-shadow placeholder:text-border-main" 
                  placeholder="Hôm nay ruộng vườn nhà bạn có gì thay đổi thế nào?..." 
                  rows={5}
                ></textarea>
              </div>
              
              {/* Daily Activities */}
              <div className="space-y-3">
                <label className="font-bold text-sm text-text-main ml-2">Hoạt động trong ngày</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => toggleActivity('water')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm transition-all border ${activeActivities.includes('water') ? 'bg-primary text-white border-primary shadow-[0_4px_10px_rgba(8,168,85,0.3)] scale-105' : 'bg-white text-text-main/70 border-border-main/50 hover:bg-bg-surface active:scale-95'}`}
                    type="button"
                  >
                    <Droplets className="w-5 h-5" />
                    <span>Đã tưới nước</span>
                  </button>
                  <button 
                    onClick={() => toggleActivity('fertilizer')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm transition-all border ${activeActivities.includes('fertilizer') ? 'bg-primary text-white border-primary shadow-[0_4px_10px_rgba(8,168,85,0.3)] scale-105' : 'bg-white text-text-main/70 border-border-main/50 hover:bg-bg-surface active:scale-95'}`}
                    type="button"
                  >
                    <FlaskConical className="w-5 h-5" />
                    <span>Đã bón phân</span>
                  </button>
                  <button 
                    onClick={() => toggleActivity('pest')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm transition-all border ${activeActivities.includes('pest') ? 'bg-primary text-white border-primary shadow-[0_4px_10px_rgba(8,168,85,0.3)] scale-105' : 'bg-white text-text-main/70 border-border-main/50 hover:bg-bg-surface active:scale-95'}`}
                    type="button"
                  >
                    <BugOff className="w-5 h-5" />
                    <span>Phun thuốc</span>
                  </button>
                </div>
              </div>
              
              {/* Real Photos */}
              <div className="space-y-3">
                <label className="font-bold text-sm text-text-main ml-2">Hình ảnh thực tế (Tối đa 4)</label>
                <div className="grid grid-cols-4 gap-4">
                  <label className="aspect-square border border-dashed border-border-main rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-bg-surface-1 transition-colors group">
                    <input 
                      accept="image/*" 
                      className="hidden" 
                      type="file" 
                      onChange={() => {
                        // In demo, we just use a random stock image when user selects file
                        const randomImages = [
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCzBjvc2DnHkU5kbDFMSwtv8BlsaiWbQudALcZbuYhJy8SPHAFmGOkRmm-l4KC5VSOUk3atkwm00nuuz6Z2ZTKRVAhQjwV3GoTebXZfy1o2eAujMFFziKt-smBZYu6Z5Y1OVRnyLwO5JVfFyoo6FbCJJv1cckKZSMi83YrGWZ_7RpHiVKx2k0l6Z-YKvzETxUD2sLP4FyEfy0ttKsrdDJkHT2IBS62yJLWXk_d0dEaJPZWKTLQH6XjW6IIrIL0y_y0AlbCNPcThctr7',
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ98QwVUaI-DYbws4DExxqd5xte7Qsvnb_b1pfuim31P1em64_rv8k8mhv-ekc8vTVSDCAXyl2iszSTYAk-UGVNY3DAuFbnqmHK8vvkA1kl7Gk7g-MyndBvWKCjfG5eYPNiCsJ8ETcmdNgkjOpGqEEiDgdWh1ZZD1LInCVY4-RDhT6EnOkcQmqqNP5aKuHqDgJcqbw1aU03xTwIeAgj44GBwbORCJUR6IuOK5-Q3P17hzsLuTXZvHOCZNDXU4HrHFK_jc3FcLYK9Lc'
                        ];
                        setImageUrl(randomImages[Math.floor(Math.random() * randomImages.length)]);
                      }}
                    />
                    <Camera className="w-6 h-6 text-text-main/30 group-hover:text-primary transition-colors group-hover:scale-110" />
                    <span className="text-[10px] font-bold text-text-main/50 mt-1">Thêm ảnh</span>
                  </label>
                  {/* Photo preview */}
                  {imageUrl ? (<div className="aspect-square bg-bg-surface-1 rounded-2xl overflow-hidden shadow-sm border border-border-main/30 relative group">
                    <img className="w-full h-full object-cover opacity-90" alt="Preview" src={imageUrl} />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl('')} 
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>) : null}
                </div>
              </div>
              
              {/* Mascot Tip */}
              <div className="bg-bg-surface-1 border border-primary/20 p-4 rounded-xl flex gap-4 items-center mt-8 shadow-sm">
                <div className="w-16 h-16 flex-shrink-0">
                  <MascotLottie className="w-full h-full drop-shadow-md" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-main/80 leading-tight flex flex-col gap-1">
                    <span>"Bạn ơi, ghi lại sự thay đổi của cây trồng mỗi ngày giúp AI của mình chẩn đoán và khuyến nghị tốt hơn nhé! <Sprout className="w-4 h-4 inline" />"</span>
                  </p>
                </div>
              </div>
              
            </form>
          )}
        </main>
        
        {/* Fixed Footer Actions */}
        {diaries.length > 0 && !fetching ? (<footer className="fixed md:static bottom-0 left-0 right-0 w-full max-w-2xl mx-auto p-6 bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-border-main/30 md:border-t-0 space-y-3 z-50 rounded-b-[40px]">
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="w-full shadow-[0_10px_20px_rgba(8,168,85,0.2)] active:shadow-[0_4px_10px_rgba(8,168,85,0.1)] active:translate-y-0.5 active:scale-95 transition-all text-lg py-4 rounded-full"
            icon={<Save className="w-5 h-5" />}
          >
            {loading ? 'Đang lưu nhật ký...' : 'Lưu nhật ký'}
          </Button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-2 text-text-main/50 font-bold hover:text-text-main transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
        </footer>) : null}
        
      </div>
    </div>
  );
};

export default CreateDiary;
