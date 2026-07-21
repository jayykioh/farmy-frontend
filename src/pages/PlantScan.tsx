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
import { extractPlantScanErrorCode, getPlantScanErrorMessage } from '../api/plantScan';
import type { PlantScanResult } from '../types/plantScan';
import toast from 'react-hot-toast';

type ScanState = 'viewfinder' | 'evidence' | 'context' | 'analyzing' | 'result';
type ScanView = 'scan' | 'history';

type ImageQuality = {
  score: number;
  label: 'Ảnh quá nhỏ' | 'Chất lượng kỹ thuật hạn chế' | 'Có thể gửi phân tích' | 'Chất lượng kỹ thuật tốt';
  usable: boolean;
};

export const getImageQuality = (file: Pick<File, 'size'>): ImageQuality => {
  const score = Math.max(35, Math.min(96, Math.round(58 + file.size / 45_000)));
  if (score < 40) return { score, label: 'Ảnh quá nhỏ', usable: false };
  if (score < 70) return { score, label: 'Chất lượng kỹ thuật hạn chế', usable: false };
  if (score < 85) return { score, label: 'Có thể gửi phân tích', usable: true };
  return { score, label: 'Chất lượng kỹ thuật tốt', usable: true };
};

export const PlantScan: React.FC = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>('viewfinder');
  const [activeView, setActiveView] = useState<ScanView>('scan');
  
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const [selectedCrop, setSelectedCrop] = useState('Lúa');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<PlantScanResult | null>(null);
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [imageQuality, setImageQuality] = useState<ImageQuality | null>(null);
  const [plantPart, setPlantPart] = useState('Lá');
  const [symptomDuration, setSymptomDuration] = useState('Vài ngày');
  const [progression, setProgression] = useState('Ổn định');
  const [analysisStage, setAnalysisStage] = useState(0);
  const [supplementalConfirmed, setSupplementalConfirmed] = useState(false);
  
  // Camera State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRequestRef = useRef(0);
  const [uploadPlantScan] = useUploadPlantScanMutation();
  const {
    data: scanHistory,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useGetPlantScansQuery(undefined, { refetchOnMountOrArgChange: true });

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

    if (!navigator.mediaDevices?.getUserMedia) {
      setIsCameraReady(false);
      return;
    }

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
    setPreviewUrl(item.image_url || item.thumbnail_url || null);
    setScanState('result');
    setActiveView('scan');
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processScanFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPrimaryFile(file);
    setImageQuality(getImageQuality(file));
    stopCamera();
    setScanState('evidence');
  };

  const submitAnalysis = async () => {
    if (!primaryFile) return;
    setScanState('analyzing');
    setAnalysisStage(0);
    const formData = new FormData();
    formData.append('image', primaryFile);
    formData.append('crop_type', selectedCrop);
    formData.append('plant_part', plantPart);
    formData.append('symptom_duration', symptomDuration);
    formData.append('progression', progression);
    formData.append('notes', JSON.stringify({ plantPart, symptomDuration, progression, supplementalConfirmed }));

    const stageTimer = window.setInterval(() => {
      setAnalysisStage((current) => Math.min(current + 1, 4));
    }, 900);

    try {
      const response = await uploadPlantScan(formData).unwrap();
      setScanResult(response);
      if (response.image_url || response.thumbnail_url) {
        setPreviewUrl(response.image_url || response.thumbnail_url || null);
      }
      setScanState('result');
    } catch (error) {
      const errorCode = extractPlantScanErrorCode(error);
      setScanState('viewfinder');
      startCamera();
      toast.error(getPlantScanErrorMessage(error));
      return;
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
    } finally {
      window.clearInterval(stageTimer);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!file) return;
    await processScanFile(file);
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
      processScanFile(file);
    }, 'image/jpeg', 0.85);
  };

  const handleRetake = () => {
    setScanState('viewfinder');
    setScanResult(null);
    setPrimaryFile(null);
    setImageQuality(null);
    setSupplementalConfirmed(false);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-24 text-left font-sans flex flex-col relative">
      <PageHeader 
        title="PlantScan"
        subtitle="Quét lá cây nhận diện sâu bệnh"
        leftButton="back"
        rightButton="none"
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Content Canvas */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col ${activeView === 'scan' && scanState === 'result' ? 'md:grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 mt-4' : 'mt-4'}`}>
        <div className={`${scanState === 'result' && activeView === 'scan' ? 'col-span-12' : ''} w-full max-w-md mx-auto mb-6 grid grid-cols-2 gap-2 rounded-[18px] border-2 border-border-main bg-white p-1.5 shadow-sm`}>
          <button
            type="button"
            onClick={() => setActiveView('scan')}
            aria-pressed={activeView === 'scan'}
            className={`rounded-[13px] px-4 py-2.5 text-sm font-black transition-all cursor-pointer ${activeView === 'scan' ? 'bg-[#008A5E] text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-1'}`}
          >
            Quét cây
          </button>
          <button
            type="button"
            onClick={() => setActiveView('history')}
            aria-pressed={activeView === 'history'}
            className={`rounded-[13px] px-4 py-2.5 text-sm font-black transition-all cursor-pointer ${activeView === 'history' ? 'bg-[#008A5E] text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-1'}`}
          >
            Lịch sử ({isHistoryLoading && !scanHistory ? '…' : (scanHistory?.total ?? 0)})
          </button>
        </div>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />

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
                      <p className="mt-1 text-sm font-bold text-text-secondary">Mức chắc chắn: {Math.round((item.diagnosis?.confidence ?? 0) * 100)}%</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {activeView === 'scan' && scanState === 'viewfinder' ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6 relative">
            {/* Viewfinder Area */}
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

              {/* Top Bar overlays */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <select 
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-black/50 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 font-bold text-sm outline-none appearance-none cursor-pointer"
                >
                  <option value="Lúa" className="text-black">Lúa</option>
                  <option value="Bưởi" className="text-black">Bưởi</option>
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

              {/* Bottom Capture Area inside Viewfinder */}
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

              <div className="absolute left-4 right-4 top-20 z-10 rounded-2xl border border-white/20 bg-black/55 p-3 text-white backdrop-blur-md">
                <p className="text-sm font-black">Đưa lá cây vào khung</p>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] font-bold text-white/90">
                  <span>✓ Đủ ánh sáng</span>
                  <span>✓ Giữ camera ổn định</span>
                  <span className="col-span-2 text-amber-200">! Đưa vùng bị ảnh hưởng gần camera hơn</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold text-text-secondary text-center">Chụp rõ dấu hiệu để Bé Thóc giúp bạn thu thập bằng chứng và kiểm tra bước tiếp theo.</p>
          </div>
        ) : null}

        {activeView === 'scan' && scanState === 'evidence' && previewUrl && imageQuality ? (
          <section className="mx-auto grid w-full max-w-4xl gap-5 md:grid-cols-2">
            <div className="overflow-hidden rounded-[28px] border-2 border-border-main bg-white shadow-sm">
              <img src={previewUrl} alt="Ảnh cây vừa chụp" className="aspect-[4/3] h-full w-full object-cover" />
            </div>
            <div className="card-bubble flex flex-col gap-4 border-2 border-border-main bg-white p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#008A5E]">Kiểm tra bằng chứng</p>
                <h2 className="mt-1 text-2xl font-black text-text-h">Chất lượng ảnh: {imageQuality.label}</h2>
                <p className="mt-1 text-sm font-bold text-text-secondary">Điểm ảnh đầu vào: {imageQuality.score}% — đây không phải độ chính xác chẩn đoán.</p>
              </div>
              <div className="rounded-2xl bg-bg-surface-1 p-4 text-sm font-bold">
                <p className="text-emerald-700">✓ File ảnh có thể đọc và đủ kích thước để gửi</p>
                <p className="mt-1 text-text-secondary">AI chưa nhận diện nội dung ảnh ở bước này.</p>
                <p className="mt-1 text-amber-700">! Ảnh người, đồ vật hoặc cảnh không có cây sẽ bị từ chối khi phân tích.</p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border-main p-4">
                <input type="checkbox" checked={supplementalConfirmed} onChange={(event) => setSupplementalConfirmed(event.target.checked)} className="mt-1" />
                <span><strong>Đã kiểm tra mặt dưới lá (nếu ảnh là lá)</strong><br /><span className="text-xs text-text-secondary">Xác nhận này chỉ là thông tin bạn cung cấp, không phải kết quả nhận diện của AI.</span></span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={handleRetake} className="btn btn--soft font-bold">Chụp lại</button>
                <button type="button" disabled={!imageQuality.usable} onClick={() => setScanState('context')} className="btn btn--cyan font-black disabled:opacity-50">Tiếp tục</button>
              </div>
            </div>
          </section>
        ) : null}

        {activeView === 'scan' && scanState === 'context' ? (
          <section className="card-bubble mx-auto w-full max-w-xl border-2 border-border-main bg-white p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-wider text-[#008A5E]">Thông tin thêm</p>
            <h2 className="mt-1 text-2xl font-black text-text-h">Giúp Bé Thóc phân tích tốt hơn</h2>
            <p className="mt-2 text-sm font-bold text-text-secondary">Chỉ ba câu hỏi ngắn, không phải khảo sát dài.</p>
            <div className="mt-6 space-y-5">
              {[
                { label: 'Bộ phận có vấn đề', value: plantPart, setter: setPlantPart, options: ['Lá', 'Thân', 'Quả', 'Rễ'] },
                { label: 'Xuất hiện từ bao giờ?', value: symptomDuration, setter: setSymptomDuration, options: ['Hôm nay', 'Vài ngày', 'Lâu hơn'] },
                { label: 'Tình trạng đang', value: progression, setter: setProgression, options: ['Ổn định', 'Lan chậm', 'Lan nhanh'] },
              ].map((group) => (
                <fieldset key={group.label}>
                  <legend className="mb-2 text-sm font-black text-text-h">{group.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => (
                      <button key={option} type="button" onClick={() => group.setter(option)} className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${group.value === option ? 'border-[#008A5E] bg-[#E9F9F3] text-[#007A54]' : 'border-border-main bg-white'}`}>{option}</button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setScanState('evidence')} className="btn btn--soft font-bold">Quay lại</button>
              <button type="button" onClick={() => void submitAnalysis()} className="btn btn--cyan font-black">Bắt đầu phân tích</button>
            </div>
          </section>
        ) : null}

        {activeView === 'scan' && scanState === 'analyzing' ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto gap-6">
            <div className="w-48 h-48 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <PetMascot className="w-32 h-32" status={petStatus} size={128} />
            </div>
            <h2 className="text-2xl font-black text-text-h text-center mt-4">Bé Thóc đang xem cây của bạn...</h2>
            <div className="w-full rounded-2xl border-2 border-border-main bg-white p-4">
              {['Kiểm tra chất lượng ảnh', 'Nhận diện dấu hiệu nhìn thấy', 'Đối chiếu dữ liệu canh tác', 'Tham khảo kiến thức kỹ thuật', 'Tổng hợp các khả năng'].map((stage, index) => (
                <p key={stage} className={`py-1.5 text-sm font-bold ${index < analysisStage ? 'text-emerald-700' : index === analysisStage ? 'text-[#008A5E]' : 'text-text-secondary/50'}`}>
                  {index < analysisStage ? '✓' : index === analysisStage ? '●' : '○'} {stage}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {activeView === 'scan' && scanState === 'result' && scanResult ? (
          <>
            {/* Left Column: Scan Preview Area */}
            <section className="col-span-12 md:col-span-6 lg:col-span-5 h-fit relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-[32px] border-2 border-border-main bg-white overflow-hidden flex items-center justify-center shadow-sm">
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
                <div className="flex items-start gap-4 z-10 md:mt-0 -mt-6 pl-4 relative">
                  <div className="w-16 h-16 rounded-full border-2 border-border-main bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                    <PetMascot className="w-full h-full -mt-1" status={petStatus} size={56} />
                  </div>
                  {/* Speech Bubble */}
                  <div className="pet-mood-bubble flex-1 shadow-sm mt-1">
                    <p className="font-bold text-sm text-text-main">
                      {scanResult.diagnosis?.disease_name
                        ? 'Bé Thóc nhận thấy một số dấu hiệu cần được theo dõi thêm.'
                        : 'Chưa thấy dấu hiệu rõ ràng trong ảnh này.'}
                    </p>
                    <span className="pet-mood-bubble__tail" aria-hidden="true" />
                  </div>
                </div>
                
                {/* Result Card */}
                <div className="card-bubble bg-white p-6 md:p-8 flex flex-col gap-4 md:gap-5 relative shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[11px] md:text-xs text-[#008A5E] uppercase tracking-wider bg-primary-light/20 self-start px-3 py-1 rounded-full border border-primary-light/20 flex gap-2 items-center">
                      Đánh giá ban đầu
                      {scanResult.status === 'cached' && (
                        <span className="text-[#008A5E]/80 lowercase">(Từ bộ nhớ đệm)</span>
                      )}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-h mt-1 tracking-tight">
                      {scanResult.diagnosis?.disease_name
                        ? 'Có khả năng cây đang gặp vấn đề'
                        : 'Chưa thấy dấu hiệu rõ ràng'}
                    </h2>
                  </div>
                  
                  {/* Confidence Bar */}
                  {scanResult.diagnosis?.confidence && (
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between items-end">
                         <span className="font-bold text-sm text-text-secondary">Mức chắc chắn của phân tích AI</span>
                        <span className="text-2xl font-black text-[#008A5E]">
                          {Math.round(scanResult.diagnosis.confidence * 100)}%
                        </span>
                      </div>
                      {/* Thick Progress Bar */}
                      <div className="h-4 md:h-5 bg-bg-surface-2 rounded-full overflow-hidden border-2 border-border-main">
                        <div 
                          className="h-full bg-[#008A5E] rounded-full relative transition-all duration-1000"
                          style={{ width: `${Math.round(scanResult.diagnosis.confidence * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {scanResult.diagnosis?.disease_name && (
                    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-amber-700">Khả năng phù hợp nhất</p>
                      <p className="mt-1 text-lg font-black text-text-h">{scanResult.diagnosis.disease_name}</p>
                      <p className="mt-1 text-sm font-semibold text-text-secondary">Tên này là khả năng để đối chiếu tiếp, không phải xác nhận bệnh tuyệt đối.</p>
                    </div>
                  )}
                  
                  {/* Symptoms */}
                  {scanResult.diagnosis?.symptoms && scanResult.diagnosis.symptoms.length > 0 && (
                    <div className="mt-2 text-left">
                       <p className="font-bold text-sm text-text-secondary mb-2">Dấu hiệu AI quan sát được:</p>
                      <ul className="list-disc pl-5 text-text-main space-y-1">
                        {scanResult.diagnosis.symptoms.map((sym, idx) => (
                          <li key={idx} className="text-sm font-semibold">{sym}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-2xl bg-[#F0FDF4] p-4 text-left">
                    <p className="font-black text-emerald-800">Việc nên làm tiếp theo</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-semibold text-emerald-950">
                      <li>Đánh dấu vùng cây đang bị ảnh hưởng.</li>
                      <li>Chụp lại sau 24 giờ để theo dõi mức độ lan.</li>
                      <li>Hạn chế tưới trực tiếp lên lá.</li>
                      <li>Kiểm tra thêm các cây xung quanh.</li>
                    </ol>
                  </div>

                  <div className="grid gap-3 text-left sm:grid-cols-2">
                    <div className="rounded-2xl border border-border-main p-4">
                      <p className="text-sm font-black">Dữ liệu đã sử dụng</p>
                      <p className="mt-2 text-xs font-semibold text-text-secondary">✓ 1 ảnh cây<br />✓ Loại cây: {selectedCrop}<br />✓ Bộ phận: {plantPart}<br />✓ Tiến triển: {progression}</p>
                    </div>
                    <div className="rounded-2xl border border-border-main p-4">
                      <p className="text-sm font-black">Thông tin còn thiếu</p>
                      <p className="mt-2 text-xs font-semibold text-text-secondary">• Ảnh toàn bộ cây<br />• So sánh với cây khỏe gần đó<br />• Thuốc đã dùng gần đây</p>
                    </div>
                  </div>

                  {scanResult.status === 'cached' && (
                    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
                      ⓘ Kết quả tham khảo từ lần phân tích trước. Một số dữ liệu thực tế có thể đã thay đổi.
                    </div>
                  )}

                  {/* Treatment */}
                  {scanResult.diagnosis?.treatment && (
                    <div className="mt-2 flex flex-col gap-3 text-left">
                      {scanResult.diagnosis.treatment.chemical && (
                        <div className="border-t border-border-main/50 pt-3">
                          <p className="font-bold text-sm text-text-secondary">Thông tin điều trị tham khảo:</p>
                          <p className="text-sm text-text-main font-medium mt-0.5">{scanResult.diagnosis.treatment.chemical}</p>
                        </div>
                      )}
                      {scanResult.diagnosis.treatment.organic && (
                        <div className="border-t border-border-main/50 pt-3">
                          <p className="font-bold text-sm text-text-secondary">Biện pháp hữu cơ / sinh học:</p>
                          <p className="text-sm text-text-main font-medium mt-0.5">{scanResult.diagnosis.treatment.organic}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disclaimer */}
                  {scanResult.diagnosis?.disclaimer && (
                    <p className="text-xs italic text-text-secondary/80 mt-4 border-t border-border-main/30 pt-4 text-left">
                      * {scanResult.diagnosis.disclaimer}
                    </p>
                  )}
                  
                  {/* Warnings */}
                  {scanResult.diagnosis?.low_confidence_warning && (
                    <div className="bg-orange-50 border-2 border-orange-200 text-orange-800 rounded-[16px] p-3 flex items-start gap-3 shadow-sm text-left">
                      <p className="font-bold text-sm leading-tight flex-1">⚠️ {scanResult.diagnosis.low_confidence_warning}</p>
                    </div>
                  )}

                  {scanResult.diagnosis?.treatment?.safety_alert && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-[16px] p-4 flex items-start gap-3 shadow-sm text-left">
                      <p className="font-bold text-sm leading-tight flex-1">🚫 Cảnh báo an toàn: {scanResult.diagnosis.treatment.safety_alert}</p>
                    </div>
                  )}

                  {scanResult.diagnosis?.treatment?.phi_warning && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 rounded-[16px] p-4 flex items-start gap-3 shadow-sm text-left">
                      <p className="font-bold text-sm leading-tight flex-1">⏳ Chú ý cách ly (PHI): {scanResult.diagnosis.treatment.phi_warning}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Action Buttons */}
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
                <button
                  onClick={() => navigate('/diary/create', { state: { scanResult } })}
                  className="btn btn--cyan w-full md:flex-1 text-base font-extrabold cursor-pointer active:scale-95"
                >
                  Lưu vào nhật ký
                </button>
                
                <button 
                  onClick={() => navigate('/chat/active', {
                    state: {
                      initialMessage: `Tôi muốn hỏi chi tiết về kết quả chẩn đoán bệnh: ${scanResult?.diagnosis?.disease_name || 'Cây trồng của tôi'}`,
                      initialImage: scanResult?.image_url || previewUrl || null,
                    }
                  })}
                  className="btn btn--soft w-full md:flex-1 text-base font-bold cursor-pointer border-2 border-border-main active:scale-95"
                >
                  Hỏi Bé Thóc về kết quả
                </button>
                <button onClick={() => navigate('/reminder/create', { state: { title: `Kiểm tra lại ${selectedCrop}`, daysFromNow: 1 } })} className="btn btn--soft w-full text-base font-bold border-2 border-border-main">Đặt lịch kiểm tra lại</button>
                <button onClick={() => setScanState('evidence')} className="btn btn--outline w-full text-base font-bold">Bổ sung thông tin</button>
              </section>

              {/* Retake / Upload Buttons */}
              <section className="flex justify-center gap-6 mt-4">
                <button 
                  onClick={handleRetake}
                  className="btn btn--outline font-bold text-sm px-5 py-2.5 cursor-pointer active:scale-95"
                >
                  Quét ảnh khác
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn--soft font-bold text-sm px-5 py-2.5 cursor-pointer border-2 border-border-main active:scale-95"
                >
                  Tải ảnh lên từ thiết bị
                </button>
              </section>

            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default PlantScan;
