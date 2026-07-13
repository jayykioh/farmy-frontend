const MAX_IMAGE_EDGE = 1280;
const JPEG_QUALITY = 0.78;

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Unable to compress image'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      JPEG_QUALITY,
    );
  });
};

export const compressImageFile = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('Canvas is unavailable for image compression');
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvasToBlob(canvas);
};

export const ensurePersistentStorage = async () => {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    await navigator.storage.persist().catch(() => false);
  }
};

export const assertStorageRoom = async (requiredBytes: number) => {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) return;

  const estimate = await navigator.storage.estimate();
  const quota = estimate.quota ?? 0;
  const usage = estimate.usage ?? 0;
  const remaining = quota - usage;

  if (quota > 0 && remaining < requiredBytes) {
    throw new DOMException('Not enough persistent storage for this diary draft', 'QuotaExceededError');
  }
};
