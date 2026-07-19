import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Leaf, AlertTriangle, Wheat } from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';
import type { SnapCondition } from '../types/farmSnap';
import { createSnap, uploadSnapPhoto } from '../api/snaps';

interface SnapCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type CaptureState = 'idle' | 'camera' | 'preview' | 'uploading' | 'success' | 'error';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const validateImageFile = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Ảnh quá lớn, tối đa 10MB.');
  }
};

export const SnapCaptureModal: React.FC<SnapCaptureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [state, setState] = useState<CaptureState>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [cropType, setCropType] = useState<string>('Lúa');
  const [condition, setCondition] = useState<SnapCondition>('healthy');
  const [caption, setCaption] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRequestRef = useRef(0);

  const stopCamera = useCallback(() => {
    setStream((prevStream) => {
      if (prevStream) {
        prevStream.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
  }, []);

  const revokePhotoUrl = useCallback(() => {
    if (photoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }
  }, [photoUrl]);

  const startCamera = useCallback(async () => {
    const requestId = cameraRequestRef.current + 1;
    cameraRequestRef.current = requestId;
    stopCamera();
    setState('idle');

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

      setStream(mediaStream);
      setState('camera');
    } catch (err) {
      if (cameraRequestRef.current !== requestId) {
        return;
      }

      console.error('Camera error:', err);
      setState('error');
      setErrorMessage('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (state === 'camera' && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play()
          .then(() => setIsCameraReady(true))
          .catch(err => {
            console.error('Camera play error:', err);
            setErrorMessage('Không thể phát video từ camera.');
            setState('error');
          });
      };
    } else {
      setIsCameraReady(false);
    }
  }, [state, stream]);

  useEffect(() => {
    if (isOpen) {
       
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!isCameraReady || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      setState('error');
      setErrorMessage('Camera chưa sẵn sàng. Vui lòng đợi 1 giây và thử lại.');
      return;
    }

    // Calculate the visible crop to match object-cover viewport
    const container = video.parentElement;
    const containerW = container?.clientWidth ?? video.clientWidth;
    const containerH = container?.clientHeight ?? video.clientHeight;
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;

    const containerAspect = containerW / containerH;
    const videoAspect = videoW / videoH;

    let sx = 0, sy = 0, sw = videoW, sh = videoH;
    if (videoAspect > containerAspect) {
      // Video is wider than container → crop sides
      sw = videoH * containerAspect;
      sx = (videoW - sw) / 2;
    } else {
      // Video is taller than container → crop top/bottom
      sh = videoW / containerAspect;
      sy = (videoH - sh) / 2;
    }

    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for selfie camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    cameraRequestRef.current += 1;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setState('error');
          setErrorMessage('Không thể tạo ảnh từ camera. Vui lòng thử lại.');
          return;
        }

        const file = new File([blob], `farm-snap-${Date.now()}.jpeg`, {
          type: 'image/jpeg',
        });
        const url = URL.createObjectURL(file);

        revokePhotoUrl();
        setPhotoFile(file);
        setPhotoUrl(url);
        stopCamera();
        setState('preview');
      },
      'image/jpeg',
      0.85,
    );
  };

  const handleRetake = () => {
    revokePhotoUrl();
    setPhotoFile(null);
    setPhotoUrl(null);
    setCaption('');
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    cameraRequestRef.current += 1;

    try {
      validateImageFile(file);
    } catch (err) {
      setState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Ảnh không hợp lệ.');
      return;
    }

    const url = URL.createObjectURL(file);
    revokePhotoUrl();
    setPhotoFile(file);
    setPhotoUrl(url);
    stopCamera();
    setState('preview');
  };

  const resetAfterSuccess = () => {
    setState('idle');
    revokePhotoUrl();
    setPhotoUrl(null);
    setPhotoFile(null);
    setCaption('');
  };

  const handleSubmit = async () => {
    if (!photoFile) {
      setState('error');
      setErrorMessage('Vui lòng chụp hoặc chọn một ảnh trước khi đăng.');
      return;
    }

    setState('uploading');

    try {
      const upload = await uploadSnapPhoto(photoFile);
      await createSnap({
        imageUrl: upload.publicUrl,
        cropType,
        condition,
        caption: caption.trim() || undefined,
        capturedAt: new Date().toISOString(),
      });

      setState('success');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        setTimeout(resetAfterSuccess, 300);
      }, 1500);
    } catch (err) {
      console.error('Create snap error:', err);
      setState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Không thể đăng snap. Vui lòng thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white animate-in fade-in duration-200">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 bg-black/40 rounded-full backdrop-blur-sm active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <div className="w-6 h-6 rounded-full bg-white overflow-hidden flex items-center justify-center mr-2">
            <PetMascot staticMood="neutral" className="w-8 h-8" size={32} />
          </div>
          <span className="font-bold text-sm">Farm Snap</span>
        </div>
      </div>

      <div className="w-full h-full md:max-w-[480px] relative flex flex-col justify-between">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {state === 'camera' ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
            />
          ) : null}

          {state === 'idle' ? (
            <div className="animate-pulse flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-400 font-medium">Đang mở camera...</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-white/10 px-5 py-2.5 rounded-full font-bold active:scale-95 text-white"
              >
                Chọn ảnh từ máy
              </button>
            </div>
          ) : null}

          {state === 'preview' && photoUrl ? (
            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : null}

          {state === 'error' ? (
            <div className="text-center p-6 flex flex-col items-center gap-3">
              <div className="bg-red-500/20 text-red-400 p-4 rounded-2xl mb-2 border border-red-500/30">
                <p className="font-bold">{errorMessage}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startCamera}
                  className="bg-white/10 px-5 py-2.5 rounded-full font-bold active:scale-95 text-white"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary px-5 py-2.5 rounded-full font-bold active:scale-95 text-white"
                >
                  Chọn ảnh từ máy
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative z-10 flex flex-col h-full justify-end pb-8 pt-20 px-4 pointer-events-none">
          {(state === 'camera' || state === 'preview') ? (
            <div className="pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent -mx-4 px-4 pt-12 pb-4 flex flex-col gap-4">
              <div className="flex flex-col gap-3 mb-2">
                <div className="flex flex-wrap gap-2 items-center justify-center">
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold rounded-full px-4 py-2 outline-none appearance-none cursor-pointer text-center"
                  >
                    <option value="Lúa" className="text-black">Lúa</option>
                    <option value="Bưởi" className="text-black">Bưởi</option>
                    <option value="Cà phê" className="text-black">Cà phê</option>
                    <option value="Rau màu" className="text-black">Rau màu</option>
                    <option value="Khác" className="text-black">Khác</option>
                  </select>

                  <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                    <button
                      onClick={() => setCondition('healthy')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${condition === 'healthy' ? 'bg-green-500 text-white' : 'text-white/70'}`}
                    >
                      <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> Khỏe</span>
                    </button>
                    <button
                      onClick={() => setCondition('issue')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${condition === 'issue' ? 'bg-yellow-500 text-white' : 'text-white/70'}`}
                    >
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Có vấn đề</span>
                    </button>
                    <button
                      onClick={() => setCondition('harvest')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${condition === 'harvest' ? 'bg-amber-600 text-white' : 'text-white/70'}`}
                    >
                      <span className="flex items-center gap-1"><Wheat className="w-3.5 h-3.5" /> Thu hoạch</span>
                    </button>
                  </div>
                </div>

                {state === 'preview' ? (
                  <div className="mt-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Thêm mô tả ngắn... (tùy chọn)"
                      maxLength={100}
                      className="w-full bg-black/40 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex justify-between items-center mt-2 px-2">
                {state === 'camera' ? (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 flex justify-center items-center rounded-full bg-white/10 backdrop-blur-md active:scale-95"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>

                    <button
                      onClick={handleCapture}
                      disabled={!isCameraReady}
                      className={`w-20 h-20 rounded-full border-4 flex justify-center items-center transition-transform ${isCameraReady ? 'border-white active:scale-90' : 'border-white/50 opacity-50'}`}
                    >
                      <div className={`w-16 h-16 rounded-full ${isCameraReady ? 'bg-white' : 'bg-white/50'}`}></div>
                    </button>

                    <button
                      onClick={toggleCamera}
                      className="w-12 h-12 flex justify-center items-center rounded-full bg-white/10 backdrop-blur-md active:scale-95"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRetake}
                      className="px-6 py-4 font-bold text-white/80 active:scale-95"
                    >
                      Chụp lại
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-primary text-white font-bold py-4 rounded-full ml-4 active:scale-95 transition-transform flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(8,168,85,0.4)]"
                    >
                      Đăng lên Feed
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {state === 'uploading' ? (
            <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center pointer-events-auto">
              <div className="w-16 h-16 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-xl">Đang đăng...</p>
            </div>
          ) : null}

          {state === 'success' ? (
            <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center pointer-events-auto animate-in zoom-in-95 fade-in">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(8,168,85,0.6)]">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black mb-2 text-primary">+10 XP</h2>
              <p className="font-bold text-xl">Đã đăng thành công!</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
