import React, { useState } from 'react';
import { SnapCaptureModal } from './SnapCaptureModal';

export const SnapFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[80px] md:bottom-8 right-4 md:right-8 w-14 h-14 bg-primary text-white rounded-full shadow-[0_4px_20px_rgba(8,168,85,0.4)] flex items-center justify-center z-40 active:scale-90 transition-transform hover:scale-105"
        aria-label="Chụp Farm Snap"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <SnapCaptureModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
