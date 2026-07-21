import React, { useState } from 'react';
import { Camera } from '@phosphor-icons/react';
import { SnapCaptureModal } from './SnapCaptureModal';

export const SnapFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed fab-snap right-4 md:right-8 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_4px_20px_rgba(8,168,85,0.4)] flex items-center justify-center active:scale-95 transition-transform hover:scale-105 cursor-pointer"
          aria-label="Chụp Farm Snap"
        >
          <Camera size={28} weight="bold" />
        </button>
      </div>
      <SnapCaptureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
