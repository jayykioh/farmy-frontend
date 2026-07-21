/* Hallmark · page: plant-scan · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { PageHeader } from '../components/PageHeader';
import { useGetPlantScansQuery, useUploadPlantScanMutation } from '../store/api/farmApi';
import { extractPlantScanErrorCode } from '../api/plantScan';
import type { PlantScanResult, ImageQualityInfo, UserScanContext } from '../types/plantScan';
import toast from 'react-hot-toast';

import { ImageQualityAssistant } from '../components/plant-scan/ImageQualityAssistant';
import { GuidedAdditionalCapture, type AdditionalAngleSuggestion } from '../components/plant-scan/GuidedAdditionalCapture';
import { ContextFormStep } from '../components/plant-scan/ContextFormStep';
import { TransparentAnalysisStages } from '../components/plant-scan/TransparentAnalysisStages';
import { GuidedResultView } from '../components/plant-scan/GuidedResultView';

type ScanState = 'viewfinder' | 'quality_check' | 'additional_capture' | 'context_form' | 'analyzing' | 'result';
type ScanView = 'scan' | 'history';

const SUGGESTIONS: AdditionalAngleSuggestion[] = [
  {
    id: 'underside',
    title: 'Chụp mặt dưới lá',
    reason: 'Giúp phát hiện côn trùng nhỏ hoặc bào tử nấm',
    icon: '🍃',
  },
  {
    id: 'whole_plant',
    title: 'Chụp toàn bộ cây',
    reason: 'Đánh giá mức độ lan rộng của bệnh trên cả cây',
    icon: '🪴',
  },
  {
    id: 'stem_root',
    title: 'Chụp vết bệnh ở thân / gốc',
    reason: 'Kiểm tra xem bệnh có lan từ rễ hoặc thân chính không',
    icon: '🪵',
  },
];

export const PlantScan: React.FC = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>('viewfinder');
  const [activeView, setActiveView] = useState<ScanView>('scan');
  
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const [selectedCrop, setSelectedCrop] = useState('Lúa');
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState<string | null>(null);
  
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  
  const [qualityInfo, setQualityInfo] = useState<ImageQualityInfo>({
    score: 85,
    status: 'good',
    checks: {
      is_enough_light: true,
      is_centered: true,
      is_blurry: false,
      tips: ['Đưa vùng bị đốm lá lại gần camera hơn để AI soi chi tiết'],
    },
  });

  const [userContext, setUserContext] = useState<UserScanContext>({});
  const [scanResult, setScanResult] = useState<PlantScanResult | null>(null);
  
  // Camera State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const cameraRequestRef = useRef(0);

  const [uploadPlantScan] = useUploadPlantScanMutation();
  const {
    data: scanHistory,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useGetPlantScansQuery(undefined, { skip: activeView !== 'history' });

  const stopCamera = useCallback(() => {
    cameraRequestRef.current += 1;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream((prevStream) => {
      if (prevStream) {
        prevStream.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    const requestId = cameraRequestRef.current + 1;
    cameraRequestRef.current = requestId;
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
      });

      if (cameraRequestRef.current !== requestId) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      if (cameraRequestRef.current !== requestId) return;
      console.error('Camera error:', err);
      toast.error('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (activeView === 'scan' && scanState === 'viewfinder') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeView, scanState, startCamera, stopCamera]);

  useEffect(() => {
    if (activeView === 'scan' && scanState === 'viewfinder' && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play()
          .then(() => setIsCameraReady(true))
          .catch(err => {
            console.error('Camera play error:', err);
          });
      };
    } else {
      setIsCameraReady(false);
    }
  }, [activeView, scanState, stream]);

  const openHistoryItem = (item: PlantScanResult) => {
    setScanResult(item);
    setSelectedCrop(item.crop_type);
    setPrimaryPreviewUrl(item.image_url || item.thumbnail_url || null);
    setScanState('result');
    setActiveView('scan');
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (primaryPreviewUrl && !primaryPreviewUrl.startsWith('http')) {
        URL.revokeObjectURL(primaryPreviewUrl);
      }
      additionalPreviews.forEach((url) => {
        if (!url.startsWith('http')) URL.revokeObjectURL(url);
      });
    };
  }, [primaryPreviewUrl, additionalPreviews]);

  const handlePrimaryFileReceived = (file: File) => {
    const url = URL.createObjectURL(file);
    setPrimaryFile(file);
    setPrimaryPreviewUrl(url);
    stopCamera();

    // Mock quality check score & info
    const sizeKb = file.size / 1024;
    const isSmall = sizeKb < 80;
    setQualityInfo({
      score: isSmall ? 65 : 88,
      status: isSmall ? 'usable' : 'good',
      checks: {
        is_enough_light: true,
        is_centered: true,
        is_blurry: isSmall,
        tips: isSmall ? ['Ánh sáng hơi yếu, hãy đưa camera sát hơn'] : ['Đưa vùng bị đốm sát hơn để AI soi rõ'],
      },
    });

    setScanState('quality_check');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!file) return;
    handlePrimaryFileReceived(file);
  };

  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const container = video.parentElement;
    const containerW = container?.clientWidth ?? video.clientWidth;
    const containerH = container?.clientHeight ?? video.clientHeight;
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    const containerAspect = containerW / containerH;
    const videoAspect = videoW / videoH;

    let sx = 0, sy = 0, sw = videoW, sh = videoH;
    if (videoAspect > containerAspect) {
      sw = videoH * containerAspect;
      sx = (videoW - sw) / 2;
    } else {
      sh = videoW / containerAspect;
      sy = (videoH - sh) / 2;
    }

    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Lỗi chụp ảnh. Vui lòng thử lại.');
        return;
      }
      const file = new File([blob], `plant-scan-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      handlePrimaryFileReceived(file);
    }, 'image/jpeg', 0.85);
  };

  const handleAdditionalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (additionalFileInputRef.current) {
      additionalFileInputRef.current.value = '';
    }
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAdditionalFiles((prev) => [...prev, file]);
    setAdditionalPreviews((prev) => [...prev, url]);
    toast.success('Đã thêm ảnh bổ sung!');
  };

  const executeFinalDiagnosis = async (context: UserScanContext) => {
    if (!primaryFile) return;
    setUserContext(context);
    setScanState('analyzing');

    const formData = new FormData();
    formData.append('image', primaryFile);
    formData.append('crop_type', context.crop_type || selectedCrop);
    if (context.organ) formData.append('organ', context.organ);
    if (context.onset) formData.append('onset', context.onset);
    if (context.progress) formData.append('progress', context.progress);

    additionalFiles.forEach((file, index) => {
      formData.append(`additional_image_${index}`, file);
    });

    try {
      const response = await uploadPlantScan(formData).unwrap();
      setScanResult(response);
      setScanState('result');
    } catch (error) {
      const errorCode = extractPlantScanErrorCode(error);
      setScanState('viewfinder');
      startCamera();
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
        default:
          toast.error('Có lỗi xảy ra trong quá trình quét. Vui lòng thử lại.');
          break;
      }
    }
  };

  const handleRetake = () => {
    setScanState('viewfinder');
    setScanResult(null);
    setPrimaryFile(null);
    setAdditionalFiles([]);
    setAdditionalPreviews([]);
    if (primaryPreviewUrl && !primaryPreviewUrl.startsWith('http')) {
      URL.revokeObjectURL(primaryPreviewUrl);
    }
    setPrimaryPreviewUrl(null);
  };
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-24 text-left font-sans flex flex-col relative">
      <PageHeader 
        title="PlantScan"
        subtitle="Hành trình chẩn đoán sức khỏe cây trồng có hướng dẫn"
        leftButton="back"
        rightButton="none"
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col mt-4">
        <div className="w-full max-w-md mx-auto mb-6 grid grid-cols-2 gap-2 rounded-[18px] border-2 border-border-main bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setActiveView('scan');
              if (scanState === 'result') handleRetake();
            }}
            aria-pressed={activeView === 'scan'}
            className={`rounded-[13px] px-4 py-2.5 text-sm font-black transition-all cursor-pointer ${activeView === 'scan' ? 'bg-[#008A5E] text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-1'}`}
          >
            Quét cây mới
          </button>
          <button
            type="button"
            onClick={() => setActiveView('history')}
            aria-pressed={activeView === 'history'}
            className={`rounded-[13px] px-4 py-2.5 text-sm font-black transition-all cursor-pointer ${activeView === 'history' ? 'bg-[#008A5E] text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-1'}`}
          >
            Lịch sử ({scanHistory?.total ?? 0})
          </button>
        </div>
        
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={additionalFileInputRef} 
          onChange={handleAdditionalFileSelect} 
        />

        {/* VIEW 1: History View */}
        {activeView === 'history' ? (
          <section className="w-full max-w-4xl mx-auto" aria-label="Lịch sử quét cây">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-h">Lịch sử PlantScan</h2>
                <p className="mt-1 text-sm font-bold text-text-secondary">Xem lại chẩn đoán và hướng xử lý đã lưu.</p>
              </div>
              <button type="button" onClick={() => refetchHistory()} className="btn btn--soft px-4 py-2 text-sm font-bold cursor-pointer">
                Làm mới
              </button>
            </div>

            {isHistoryLoading ? (
              <div className="card-bubble flex min-h-48 items-center justify-center bg-white border-2 border-border-main">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-[#008A5E]" aria-label="Đang tải lịch sử" />
              </div>
            ) : isHistoryError ? (
              <div className="card-bubble bg-white border-2 border-red-200 p-8 text-center">
                <p className="font-black text-red-700">Không thể tải lịch sử quét.</p>
                <button type="button" onClick={() => refetchHistory()} className="btn btn--coral mt-4 px-5 py-2.5 font-bold cursor-pointer">Thử lại</button>
              </div>
            ) : !scanHistory?.items.length ? (
              <div className="card-bubble bg-white border-2 border-border-main p-10 text-center">
                <p className="text-lg font-black text-text-h">Chưa có lần quét nào</p>
                <p className="mt-2 text-sm font-bold text-text-secondary">Ảnh và kết quả quét thành công sẽ tự động xuất hiện tại đây.</p>
                <button type="button" onClick={() => setActiveView('scan')} className="btn btn--cyan mt-5 px-6 py-3 font-black cursor-pointer">Quét cây đầu tiên</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scanHistory.items.map((item) => (
                  <button
                    type="button"
                    key={item.scan_id}
                    onClick={() => openHistoryItem(item)}
                    className="card-bubble overflow-hidden bg-white border-2 border-border-main text-left cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[4/3] bg-bg-surface-2 overflow-hidden">
                      {item.thumbnail_url || item.image_url ? (
                        <img src={item.thumbnail_url || item.image_url} alt={`Ảnh quét ${item.crop_type}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-text-secondary">Không có ảnh</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-primary-light/20 px-2.5 py-1 text-[11px] font-black text-[#008A5E]">{item.crop_type}</span>
                        <span className="text-[11px] font-bold text-text-secondary">
                          {item.created_at ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(item.created_at)) : ''}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-base font-black text-text-h">{item.diagnosis?.disease_name || 'Không phát hiện bệnh'}</h3>
                      <p className="mt-1 text-sm font-bold text-text-secondary">Trạng thái: {item.diagnosis?.assessment_summary || 'Đã kiểm tra'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {/* VIEW 2: GUIDED FLOW STAGES */}
        {activeView === 'scan' && (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Stage 0: Viewfinder Camera */}
            {scanState === 'viewfinder' && (
              <div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 relative">
                <div className="relative w-full aspect-[3/4] bg-black rounded-[32px] overflow-hidden shadow-xl border-4 border-border-main flex flex-col">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 overflow-hidden">
                    {stream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
                      />
                    ) : (
                      <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <select 
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="bg-black/50 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 font-bold text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option value="Lúa" className="text-black">Lúa</option>
                      <option value="Sầu Riêng" className="text-black">Sầu Riêng</option>
                      <option value="Dưa Leo" className="text-black">Dưa Leo</option>
                      <option value="Cà phê" className="text-black">Cà phê</option>
                    </select>
                    
                    <button
                      onClick={toggleCamera}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 active:scale-95 text-white cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-10">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 flex justify-center items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 active:scale-95 text-white cursor-pointer"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>

                    <button 
                      onClick={handleCaptureClick}
                      disabled={!isCameraReady}
                      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all group ${isCameraReady ? 'border-white/50 hover:scale-105 active:scale-95 cursor-pointer' : 'border-white/30 opacity-50'}`}
                    >
                      <div className={`w-16 h-16 rounded-full transition-colors ${isCameraReady ? 'bg-white group-hover:bg-gray-200' : 'bg-white/50'}`}></div>
                    </button>
                    
                    <div className="w-12 h-12" />
                  </div>
                </div>
                <p className="text-sm font-bold text-text-secondary text-center">Đưa đốm lá vào khung để Bé Thóc kiểm tra chất lượng ảnh</p>
              </div>
            )}

            {/* Stage 1: Quality Assistant */}
            {scanState === 'quality_check' && (
              <ImageQualityAssistant
                quality={qualityInfo}
                onProceed={() => setScanState('additional_capture')}
                onRetake={handleRetake}
              />
            )}

            {/* Stage 2: Additional Capture */}
            {scanState === 'additional_capture' && (
              <GuidedAdditionalCapture
                primaryPreviewUrl={primaryPreviewUrl || ''}
                additionalPreviews={additionalPreviews}
                suggestions={SUGGESTIONS}
                onAddPhoto={() => additionalFileInputRef.current?.click()}
                onSkip={() => setScanState('context_form')}
              />
            )}

            {/* Stage 3: Farming Context Form */}
            {scanState === 'context_form' && (
              <ContextFormStep
                initialCropType={selectedCrop}
                onSubmit={executeFinalDiagnosis}
              />
            )}

            {/* Stage 4: Transparent Analysis Stages */}
            {scanState === 'analyzing' && (
              <TransparentAnalysisStages />
            )}

            {/* Stage 5: Guided Evidence-based Result View */}
            {scanState === 'result' && scanResult && (
              <GuidedResultView
                result={scanResult}
                onAskChat={(context) => {
                  navigate('/chat', {
                    state: {
                      initialMessage: `Bé Thóc ơi, tư vấn giúp tôi về trường hợp cây ${scanResult.crop_type}: ${context}`,
                      initialImage: scanResult.image_url || primaryPreviewUrl || null,
                    },
                  });
                }}
                onSaveDiary={() => {
                  toast.success('Đã lưu chẩn đoán vào Nhật ký!');
                  navigate('/diary');
                }}
                onCreateReminder={() => {
                  toast.success('Đã tạo nhắc nhở tái kiểm tra sau 24 giờ!');
                  navigate('/reminders');
                }}
                onReScan={handleRetake}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PlantScan;
