import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { PageHeader } from '../components/PageHeader';
import { useUploadPlantScanMutation } from '../store/api/farmApi';
import { extractPlantScanErrorCode } from '../api/plantScan';
import type { PlantScanResult } from '../types/plantScan';
import toast from 'react-hot-toast';

type ScanState = 'viewfinder' | 'analyzing' | 'result';

export const PlantScan: React.FC = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>('viewfinder');
  
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const [selectedCrop, setSelectedCrop] = useState('Lúa');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<PlantScanResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPlantScan] = useUploadPlantScanMutation();

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Call API
    setScanState('analyzing');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('crop_type', selectedCrop);

    try {
      const response = await uploadPlantScan(formData).unwrap();
      setScanResult(response);
      // Fallback to returned image URL if available
      if (response.image_url || response.thumbnail_url) {
        setPreviewUrl(response.image_url || response.thumbnail_url || null);
      }
      setScanState('result');
    } catch (error) {
      const errorCode = extractPlantScanErrorCode(error);
      setScanState('viewfinder');
      switch (errorCode) {
        case 'SCAN_IMAGE_BLURRY':
          toast.error('Ảnh quá mờ, vui lòng giữ chắc tay và chụp lại.');
          break;
        case 'NOT_A_PLANT_IMAGE':
          toast.error('Bé Thóc chỉ có thể phân tích ảnh cây trồng. Vui lòng thử lại.');
          break;
        case 'SCAN_QUOTA_EXCEEDED':
          toast.error('Bạn đã hết lượt quét trong ngày hôm nay.');
          break;
        case 'AI_SCAN_QUOTA_BUSY':
          toast.error('Hệ thống AI đang quá tải. Vui lòng thử lại sau vài phút.');
          break;
        case 'PLANT_SCAN_PERSISTENCE_FAILED':
          toast.error('Lỗi lưu trữ dữ liệu. Vui lòng thử lại.');
          break;
        case 'SCAN_INVALID_FILE':
        case 'INVALID_IMAGE_TYPE':
          toast.error('Vui lòng tải lên file ảnh hợp lệ (JPG, PNG, WebP) dưới 5MB.');
          break;
        case 'UNKNOWN':
        case 'LLM_ERROR':
        default:
          toast.error('Có lỗi xảy ra trong quá trình quét. Vui lòng thử lại.');
          break;
      }
    }
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setScanState('viewfinder');
    setScanResult(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
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
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />

        {scanState === 'viewfinder' ? (<div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 relative">
          {/* Viewfinder Area */}
          <div className="relative w-full aspect-[3/4] bg-black rounded-[32px] overflow-hidden shadow-xl border-4 border-border-main/20 flex flex-col">
            
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
               {/* Placeholder until capture */}
               <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>

            {/* Top Bar overlays */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              {/* Crop Selection */}
              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-black/50 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 font-bold text-sm outline-none appearance-none cursor-pointer"
              >
                <option value="Lúa">Lúa</option>
                <option value="Bưởi">Bưởi</option>
                <option value="Cà phê">Cà phê</option>
              </select>
            </div>

            {/* Bottom Capture Area inside Viewfinder */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-10">
              {/* Capture Button */}
              <button 
                onClick={handleCaptureClick}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full transition-colors bg-white group-hover:bg-gray-200"></div>
              </button>
            </div>
          </div>
          <p className="text-sm font-bold text-text-main/60 text-center">Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất</p>
        </div>) : null}

        {scanState === 'analyzing' ? (<div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6">
          <div className="w-48 h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <PetMascot className="w-32 h-32" status={petStatus} size={128} />
          </div>
          <h2 className="text-2xl font-bold text-text-h text-center mt-4">Đang phân tích...</h2>
          <p className="text-text-main/70 text-center max-w-xs">Bé Thóc đang xem xét lá cây, vui lòng đợi một chút nhé!</p>
        </div>) : null}

        {scanState === 'result' && scanResult ? (<>
          {/* Left Column: Scan Preview Area */}
          <section className="col-span-12 md:col-span-6 lg:col-span-5 h-fit relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-[24px] md:rounded-[32px] border border-border-main/50 bg-bg-surface-1 overflow-hidden flex items-center justify-center shadow-sm">
            {previewUrl && (
              <img 
                alt="Scanned diseased leaf" 
                className="w-full h-full object-cover" 
                src={previewUrl} 
              />
            )}
          </section>
          
          {/* Right Column: Bé Thóc Dialogue & Result Card & Actions */}
          <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col gap-6">
            
            <section className="relative flex flex-col gap-4">
              {/* Mascot Dialogue */}
              <div className="flex items-end gap-3 z-10 md:mt-0 -mt-10 pl-4 relative">
                <div className="w-16 h-16 rounded-full border border-border-main/50 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                  <PetMascot className="w-full h-full -mt-1" status={petStatus} size={56} />
                </div>
                {/* Speech Bubble */}
                <div className="bg-white border border-border-main/50 rounded-[20px] rounded-bl-sm p-3 shadow-sm relative max-w-[250px] mb-2">
                  <p className="font-bold text-sm text-text-main">
                    {scanResult.diagnosis?.disease_name 
                      ? "Oh no! Looks like we found something." 
                      : "Cây của bạn có vẻ khỏe mạnh!"}
                  </p>
                </div>
              </div>
              
              {/* Result Card */}
              <div className="bg-white border border-border-main/50 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-4 md:gap-6 relative shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-extrabold text-[11px] md:text-xs text-secondary-dark uppercase tracking-wider bg-secondary-light/30 self-start px-2 py-0.5 rounded-full flex gap-2 items-center">
                    Analysis Complete
                    {scanResult.status === 'cached' && (
                      <span className="text-primary/80 lowercase">(Từ bộ nhớ đệm)</span>
                    )}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-text-h mt-1 tracking-tight">
                    {scanResult.diagnosis?.disease_name || 'Không phát hiện bệnh'}
                  </h2>
                </div>
                
                {/* Confidence Bar */}
                {scanResult.diagnosis?.confidence && (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-sm text-text-main/70">Confidence</span>
                      <span className="text-2xl font-extrabold text-primary">
                        {Math.round(scanResult.diagnosis.confidence * 100)}%
                      </span>
                    </div>
                    {/* Thick Progress Bar */}
                    <div className="h-4 md:h-5 bg-bg-surface-1 rounded-full overflow-hidden border border-border-main/30">
                      <div 
                        className="h-full bg-primary rounded-full relative transition-all duration-1000"
                        style={{ width: `${Math.round(scanResult.diagnosis.confidence * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Symptoms */}
                {scanResult.diagnosis?.symptoms && scanResult.diagnosis.symptoms.length > 0 && (
                  <div className="mt-2">
                    <p className="font-bold text-sm text-text-main/70 mb-2">Triệu chứng:</p>
                    <ul className="list-disc pl-5 text-text-main">
                      {scanResult.diagnosis.symptoms.map((sym, idx) => (
                        <li key={idx} className="text-sm">{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment */}
                {scanResult.diagnosis?.treatment && (
                  <div className="mt-2 flex flex-col gap-2">
                    {scanResult.diagnosis.treatment.chemical && (
                      <div>
                        <p className="font-bold text-sm text-text-main/70">Thuốc hóa học:</p>
                        <p className="text-sm text-text-main">{scanResult.diagnosis.treatment.chemical}</p>
                      </div>
                    )}
                    {scanResult.diagnosis.treatment.organic && (
                      <div>
                        <p className="font-bold text-sm text-text-main/70">Phương pháp hữu cơ:</p>
                        <p className="text-sm text-text-main">{scanResult.diagnosis.treatment.organic}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                {scanResult.diagnosis?.disclaimer && (
                  <p className="text-xs italic text-text-main/50 mt-4 border-t border-border-main/30 pt-4">
                    * {scanResult.diagnosis.disclaimer}
                  </p>
                )}
                
                {/* Warnings */}
                {scanResult.diagnosis?.low_confidence_warning && (
                   <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-[16px] p-3 flex items-start gap-3 shadow-sm">
                    <p className="font-bold text-sm leading-tight flex-1">⚠️ {scanResult.diagnosis.low_confidence_warning}</p>
                  </div>
                )}

                {scanResult.diagnosis?.treatment?.safety_alert && (
                   <div className="bg-red-50 border border-red-200 text-red-800 rounded-[16px] p-4 flex items-start gap-3 shadow-sm">
                    <p className="font-bold text-sm leading-tight flex-1">🚫 Cảnh báo an toàn: {scanResult.diagnosis.treatment.safety_alert}</p>
                  </div>
                )}

                {scanResult.diagnosis?.treatment?.phi_warning && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-[16px] p-4 flex items-start gap-3 shadow-sm">
                    <p className="font-bold text-sm leading-tight flex-1">⏳ Chú ý cách ly: {scanResult.diagnosis.treatment.phi_warning}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Action Buttons */}
            <section className="flex flex-col md:flex-row gap-3 md:gap-4 mt-2">
              <button 
                onClick={() => navigate('/diary/create')}
                className="w-full md:flex-1 bg-primary text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(8,168,85,0.2)] hover:scale-[1.02] cursor-pointer"
              >
                Save treatment
              </button>
              
              <button 
                onClick={() => navigate('/chat/active')}
                className="w-full md:flex-1 bg-white text-text-main font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-full md:rounded-[20px] border border-border-main/50 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm hover:bg-bg-surface-1 hover:scale-[1.02] cursor-pointer"
              >
                Ask AI advice
              </button>
            </section>

            {/* Retake Button */}
            <button 
              onClick={handleRetake}
              className="w-full text-text-main/50 font-bold py-2 hover:text-text-main transition-colors mt-2 cursor-pointer"
            >
              Chụp lại
            </button>

          </div>
        </>) : null}
      </main>
    </div>
  );
};

export default PlantScan;

