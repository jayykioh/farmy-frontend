import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

type ScanState = 'viewfinder' | 'analyzing' | 'result';

interface PlantDiagnosis {
  is_plant: boolean;
  disease: string;
  confidence: number;
  symptoms: string[];
  treatment: {
    chemical: string;
    organic: string;
    phi_warning?: string;
  };
  safety_alert?: string | null;
  low_confidence_warning?: string | null;
  disclaimer: string;
  speech_bubble: string;
  mascot_mood: 'happy' | 'worried' | 'excited' | 'analytical' | 'celebrating' | 'sleeping' | 'neutral' | 'sad' | 'hungry' | 'sleepy';
}

const SCENARIOS: Record<string, PlantDiagnosis> = {
  scenario1: {
    is_plant: true,
    disease: "Bệnh Đạo Ôn (Pyricularia oryzae)",
    confidence: 0.92,
    symptoms: ["Vết bệnh hình thoi đặc trưng trên lá lúa", "Tâm vết bệnh màu xám tro, rìa màu nâu đỏ hoặc vàng nhạt"],
    treatment: {
      chemical: "Phun thuốc trừ nấm chứa hoạt chất Tricyclazole (như Fuji-one 40EC) theo liều lượng khuyến cáo.",
      organic: "Dọn sạch cỏ dại quanh bờ ruộng, bón phân cân đối, hạn chế bón phân đạm quá liều khi cây trổ bông.",
      phi_warning: "⚠️ Tuân thủ thời gian cách ly PHI: Cách ly 14 ngày trước thu hoạch sau khi phun thuốc hóa học."
    },
    safety_alert: null,
    low_confidence_warning: null,
    disclaimer: "Kết quả AI chỉ mang tính tham khảo. Để chẩn đoán chính xác nhất, bà con vui lòng tham khảo cán bộ khuyến nông địa phương.",
    speech_bubble: "Bé Thóc phát hiện lúa có dấu hiệu bệnh Đạo Ôn rồi! Bà con xem ngay cách xử lý nhé.",
    mascot_mood: "worried"
  },
  scenario2: {
    is_plant: true,
    disease: "Bệnh Vàng Lá Gân Xanh (Greening)",
    confidence: 0.45,
    symptoms: ["Lá bị vàng lốm đốm nhưng gân lá vẫn giữ màu xanh", "Cây còi cọc, lá nhỏ và dựng đứng, quả méo mó"],
    treatment: {
      chemical: "Chưa có thuốc hóa học đặc trị hiệu quả cao cho bệnh Greening.",
      organic: "Cắt tỉa và tiêu hủy cành sâu bệnh, phun bổ sung phân vi lượng kẽm/sắt và phun dầu khoáng phòng trừ rầy chổng cánh.",
    },
    safety_alert: null,
    low_confidence_warning: "⚠️ Độ tin cậy thấp (< 60%). Vui lòng chụp lại ảnh rõ nét hơn dưới ánh sáng tự nhiên hoặc bổ sung thêm triệu chứng mô tả.",
    disclaimer: "Kết quả AI chỉ mang tính tham khảo. Để chẩn đoán chính xác nhất, bà con vui lòng tham khảo cán bộ khuyến nông địa phương.",
    speech_bubble: "Ảnh hơi mờ hoặc thiếu sáng, Bé Thóc không chắc lắm nhưng nghi là bệnh Greening rồi.",
    mascot_mood: "sad"
  },
  scenario3: {
    is_plant: true,
    disease: "Sâu Vẽ Bùa (Phyllocnistis citrella)",
    confidence: 0.88,
    symptoms: ["Lá non xuất hiện các đường ngoằn ngoèo màu trắng bạc", "Lá bị co rúm, biến dạng và khô héo"],
    treatment: {
      chemical: "Phun thuốc diệt sâu có chứa hoạt chất Chlorpyrifos hoặc Paraquat để diệt trừ sâu đục bên dưới lớp biểu bì.",
      organic: "Tưới nước phân cân đối để thúc đẩy các đợt đọt non ra tập trung, ngắt bỏ cành bị hại nặng mang đi tiêu hủy.",
      phi_warning: "⚠️ Tuân thủ thời gian cách ly PHI: Cách ly 21 ngày trước thu hoạch."
    },
    safety_alert: "🚨 CẢNH BÁO BẢO VỆ THỰC VẬT: Hoạt chất Chlorpyrifos và Paraquat là thuốc hạn chế hoặc cấm sử dụng tại Việt Nam do độc tính cao. Vui lòng tham khảo ý kiến Chi cục Bảo vệ Thực vật địa phương để thay thế bằng hoạt chất an toàn hơn.",
    low_confidence_warning: null,
    disclaimer: "Kết quả AI chỉ mang tính tham khảo. Để chẩn đoán chính xác nhất, bà con vui lòng tham khảo ý kiến cơ quan chức năng.",
    speech_bubble: "Sâu vẽ bùa phá hoại lá rồi! Nhưng bà con cẩn thận khi chọn thuốc bảo vệ thực vật nhé.",
    mascot_mood: "worried"
  },
  scenario4: {
    is_plant: false,
    disease: "Không nhận dạng được cây trồng",
    confidence: 0.0,
    symptoms: [],
    treatment: {
      chemical: "",
      organic: ""
    },
    safety_alert: "❌ LỖI HÌNH ẢNH: Ảnh chụp không phải là cây trồng hoặc quá mờ để AI có thể nhận diện cấu trúc lá. Bà con vui lòng chụp lại cận cảnh lá cây bị bệnh nhé!",
    low_confidence_warning: null,
    disclaimer: "Hệ thống chỉ hỗ trợ phân tích hình ảnh lá cây bị sâu bệnh nông nghiệp.",
    speech_bubble: "Ủa ảnh này hình như không phải cây trồng rồi á! Bà con chụp lại giúp Bé Thóc đi.",
    mascot_mood: "sleepy"
  }
};

export const PlantScan: React.FC = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>('viewfinder');
  const [laplacian, setLaplacian] = useState(0);
  const [scenario, setScenario] = useState<string>('scenario1');
  const [isBlurry, setIsBlurry] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<PlantDiagnosis>(SCENARIOS.scenario1);

  // Simulate laplacian variance changing for the viewfinder
  useEffect(() => {
    if (scanState === 'viewfinder') {
      const interval = setInterval(() => {
        setLaplacian(Math.floor(Math.random() * 150) + 50); // random between 50 and 200
      }, 500);
      return () => clearInterval(interval);
    }
  }, [scanState]);

  const handleCapture = () => {
    if (laplacian < 100) {
      setIsBlurry(true);
      return;
    }
    setIsBlurry(false);
    setActiveDiagnosis(SCENARIOS[scenario]);
    setScanState('analyzing');
    setTimeout(() => {
      setScanState('result');
    }, 2500); // simulate API call
  };

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 relative text-left font-sans flex flex-col">
      <PageHeader 
        title="PlantScan"
        leftButton="back"
        rightButton="none"
      />

      {/* Main Content Canvas */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-[72px] ${scanState === 'viewfinder' ? 'pb-24' : 'pb-[120px] md:pb-8'} flex flex-col ${scanState === 'result' ? 'md:grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 mt-4' : 'mt-4'}`}>
        
        {scanState === 'viewfinder' && (
          <div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 relative">
            
            {/* Viewfinder Area */}
            <div className="relative w-full aspect-[3/4] bg-black rounded-[32px] overflow-hidden shadow-xl border-4 border-border-main/20 flex flex-col">
              {/* Simulated Camera Feed */}
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcOeayO00Q7AYN14kkM6h3-DoHx-2cz97ChylDc3KYOZ_srxoqo_h7TaklWIWW4Hpix7NNF0XH5eC2rRCFE7c_YQ5UK3O6DrGFIz9hSn1yyaSOIz7kmdmKKa6vKfObc6sYyfDvufSCtFi0PUr_K_xwiD6Kwx5fbtTm-U6pJ-4lxC3bZ6GyOWpyVd76otH4SeVaV769g1_C-drbIxRDrAoc4QqUlzDjPYFU1sf1BlzHCx_MB8cGe9bsmCy1a-tZqNS3oN9zWeHFLoV" 
                alt="Camera feed" 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              
              {/* Center Guide Ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-48 h-48 rounded-full border-2 ${laplacian > 100 ? 'border-primary' : 'border-error-main'} border-dashed relative transition-colors duration-300`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
                </div>
              </div>

              {/* Blurry Warning Overlay */}
              {isBlurry && (
                <div className="absolute top-20 left-4 right-4 bg-[#FFE8E8] text-[#D32F2F] border border-[#FFCAD0] rounded-2xl p-3.5 shadow-lg z-20 flex items-start gap-2.5">
                  <svg className="w-5 h-5 mt-0.5 shrink-0 text-[#D32F2F]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-xs leading-none">Ảnh chụp quá mờ để phân tích</p>
                    <p className="text-[10px] opacity-80 mt-1">Bà con vui lòng giữ chắc tay, lấy nét lại vào lá cây và chụp lại nhé.</p>
                  </div>
                  <button 
                    onClick={() => setIsBlurry(false)} 
                    className="text-white bg-[#D32F2F] hover:bg-[#B71C1C] font-bold text-[10px] px-2.5 py-1 rounded transition-colors"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* Top Bar overlays */}
              <div className="absolute top-4 left-4 right-4 flex flex-col gap-2.5 z-10">
                <div className="flex justify-between items-center w-full">
                  {/* Crop Selection */}
                  <select className="bg-black/60 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 font-bold text-sm outline-none appearance-none cursor-pointer">
                    <option>Lúa</option>
                    <option>Bưởi</option>
                    <option>Cà phê</option>
                  </select>
                  
                  {/* Laplacian Indicator */}
                  <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1 transition-colors duration-300 ${laplacian > 100 ? 'bg-primary/60' : 'bg-error-main/60'}`}>
                    {laplacian > 100 ? 'Rõ nét' : 'Mờ'} ({laplacian})
                  </div>
                </div>

                {/* Scenario Selection for testing AI Guardrails */}
                <div className="flex items-center gap-1.5 self-start bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-wider">Mô phỏng AI:</span>
                  <select 
                    value={scenario}
                    onChange={(e) => {
                      setScenario(e.target.value);
                      setIsBlurry(false);
                    }}
                    className="bg-transparent text-white font-extrabold text-[11px] outline-none cursor-pointer pr-1"
                  >
                    <option className="bg-gray-900" value="scenario1">1. Đạo ôn (PHI warning)</option>
                    <option className="bg-gray-900" value="scenario2">2. Greening (Độ tin cậy thấp)</option>
                    <option className="bg-gray-900" value="scenario3">3. Sâu vẽ bùa (Thuốc cấm)</option>
                    <option className="bg-gray-900" value="scenario4">4. Không phải cây trồng</option>
                  </select>
                </div>
              </div>

              {/* Bottom Capture Area inside Viewfinder */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-10">
                {/* Gallery Button */}
                <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer active:scale-95">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                {/* Capture Button */}
                <button 
                  onClick={handleCapture}
                  className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className={`w-16 h-16 rounded-full transition-colors ${laplacian > 100 ? 'bg-white group-hover:bg-gray-200' : 'bg-white/40'}`}></div>
                </button>

                {/* Switch Camera Button */}
                <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer active:scale-95">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="text-sm font-bold text-text-main/60 text-center">Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất</p>
          </div>
        )}

        {scanState === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6">
            <div className="w-48 h-48 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <MascotLottie className="w-32 h-32" state="analytical" />
            </div>
            <h2 className="text-2xl font-bold text-text-h text-center mt-4">Đang phân tích...</h2>
            <p className="text-text-main/70 text-center max-w-xs">Bé Thóc đang xem xét lá cây, vui lòng đợi một chút nhé!</p>
          </div>
        )}

        {scanState === 'result' && (
          <>
            {/* Left Column: Scan Preview Area */}
            <section className="col-span-12 md:col-span-6 lg:col-span-5 h-fit relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-[24px] md:rounded-[32px] border border-border-main/50 bg-bg-surface-1 overflow-hidden flex items-center justify-center shadow-sm">
              <img 
                alt="Scanned diseased leaf" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcOeayO00Q7AYN14kkM6h3-DoHx-2cz97ChylDc3KYOZ_srxoqo_h7TaklWIWW4Hpix7NNF0XH5eC2rRCFE7c_YQ5UK3O6DrGFIz9hSn1yyaSOIz7kmdmKKa6vKfObc6sYyfDvufSCtFi0PUr_K_xwiD6Kwx5fbtTm-U6pJ-4lxC3bZ6GyOWpyVd76otH4SeVaV769g1_C-drbIxRDrAoc4QqUlzDjPYFU1sf1BlzHCx_MB8cGe9bsmCy1a-tZqNS3oN9zWeHFLoV" 
              />
              {/* Scanning Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-[bounce_3s_ease-in-out_infinite] w-full h-1/3 top-0 border-b-2 border-primary pointer-events-none"></div>
            </section>

            {/* Right Column: Bé Thóc Dialogue & Result Card & Actions */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col gap-6">
              
              {/* Bé Thóc Dialogue & Result Card */}
              <section className="relative flex flex-col gap-4">
                
                {/* Mascot Dialogue */}
                <div className="flex items-end gap-3 z-10 md:mt-0 -mt-10 pl-4 relative">
                  <div className="w-16 h-16 rounded-full border border-border-main/50 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                    <MascotLottie className="w-full h-full -mt-1" state={activeDiagnosis.mascot_mood} />
                  </div>
                  {/* Speech Bubble */}
                  <div className="bg-white border border-border-main/50 rounded-[20px] rounded-bl-sm p-3.5 shadow-sm relative max-w-[280px] mb-2 text-left">
                    <p className="font-extrabold text-sm text-text-main leading-tight">{activeDiagnosis.speech_bubble}</p>
                  </div>
                </div>
                
                {/* Result Card */}
                <div className="bg-white border border-border-main/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-4 md:gap-6 relative shadow-sm text-left">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-[11px] md:text-xs text-secondary-dark uppercase tracking-wider bg-secondary-light/30 self-start px-2.5 py-1 rounded-full">
                      {activeDiagnosis.is_plant ? 'Phân tích hoàn tất' : 'Lỗi chẩn đoán'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-text-h mt-1.5 tracking-tight">
                      {activeDiagnosis.disease}
                    </h2>
                  </div>
                  
                  {/* Confidence Bar */}
                  {activeDiagnosis.is_plant && (
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-sm text-text-main/70">Độ tin cậy</span>
                        <span className={`text-2xl font-extrabold ${activeDiagnosis.confidence < 0.6 ? 'text-error-main' : 'text-primary'}`}>
                          {Math.round(activeDiagnosis.confidence * 100)}%
                        </span>
                      </div>
                      {/* Thick Progress Bar */}
                      <div className="h-4 md:h-5 bg-bg-surface-1 rounded-full overflow-hidden border border-border-main/30">
                        <div 
                          className={`h-full ${activeDiagnosis.confidence < 0.6 ? 'bg-error-main animate-pulse' : 'bg-primary'} rounded-full relative transition-all duration-1000`}
                          style={{ width: `${activeDiagnosis.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Symptoms list */}
                  {activeDiagnosis.symptoms.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="font-extrabold text-sm text-text-main/80">Triệu chứng nhận diện:</span>
                      <ul className="list-disc pl-5 text-sm text-text-main/90 font-bold space-y-1">
                        {activeDiagnosis.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Treatments */}
                  {activeDiagnosis.is_plant && (
                    <div className="flex flex-col gap-3 mt-2 bg-[#F3F9F5] p-4.5 rounded-2xl border border-primary/20">
                      <span className="font-extrabold text-sm text-[#066330]">Khuyến nghị điều trị nông nghiệp:</span>
                      <div className="space-y-2 text-sm text-text-main/90 font-bold">
                        <p><span className="text-[#08A855] font-black">Hóa học:</span> {activeDiagnosis.treatment.chemical}</p>
                        <p><span className="text-secondary-dark font-black">Hữu cơ:</span> {activeDiagnosis.treatment.organic}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* PHI Warning Badge */}
                  {activeDiagnosis.treatment.phi_warning && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-[16px] p-4 flex items-start gap-3 mt-1 shadow-sm">
                      <svg className="w-6 h-6 mt-0.5 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                      </svg>
                      <p className="font-extrabold text-sm leading-tight flex-1">{activeDiagnosis.treatment.phi_warning}</p>
                    </div>
                  )}

                  {/* Safety Alert (Banned/Restricted Pesticide Warning) */}
                  {activeDiagnosis.safety_alert && (
                    <div className="bg-[#FFF5F5] border border-[#FFD8D8] text-[#D32F2F] rounded-[16px] p-4 flex items-start gap-3 mt-1 shadow-sm">
                      <svg className="w-6 h-6 mt-0.5 flex-shrink-0 text-[#D32F2F]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <p className="font-extrabold text-sm leading-tight flex-1">{activeDiagnosis.safety_alert}</p>
                    </div>
                  )}

                  {/* Low Confidence Warning */}
                  {activeDiagnosis.low_confidence_warning && (
                    <div className="bg-[#F0F7FF] border border-[#D0E7FF] text-[#1E6BBA] rounded-[16px] p-4 flex items-start gap-3 mt-1 shadow-sm">
                      <svg className="w-6 h-6 mt-0.5 flex-shrink-0 text-[#1E6BBA]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <p className="font-extrabold text-sm leading-tight flex-1">{activeDiagnosis.low_confidence_warning}</p>
                    </div>
                  )}

                  {/* Static Disclaimer */}
                  <p className="text-xs text-text-main/45 font-bold italic mt-2 border-t border-border-main/10 pt-3.5 text-center">
                    {activeDiagnosis.disclaimer}
                  </p>
                </div>
              </section>

              {/* Action Buttons */}
              <section className="flex flex-col md:flex-row gap-3 md:gap-4 mt-2">
                {/* Primary Button */}
                <button 
                  onClick={() => navigate('/diary/create')}
                  className="w-full md:flex-1 bg-primary text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(8,168,85,0.2)] hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Lưu nhật ký
                </button>
                
                {/* Secondary Button */}
                <button 
                  onClick={() => navigate('/chat/active')}
                  className="w-full md:flex-1 bg-white text-text-main font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] border border-border-main/50 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm hover:bg-bg-surface-1 hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Hỏi thêm chuyên gia
                </button>
              </section>

              {/* Retake Button */}
              <button 
                onClick={() => {
                  setScanState('viewfinder');
                  setIsBlurry(false);
                }}
                className="w-full text-text-main/50 font-bold py-2 hover:text-text-main transition-colors mt-2 cursor-pointer"
              >
                Chụp lại
              </button>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PlantScan;
