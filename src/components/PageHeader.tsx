import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../contexts/PageHeaderContext';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leftButton?: 'back' | 'close' | 'none';
  rightButton?: 'notification' | 'camera' | 'none';
  onRightClick?: () => void;
  showOnDesktop?: boolean;
  className?: string;
  hasSidebar?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  leftButton = 'back',
  rightButton = 'none',
  onRightClick,
  showOnDesktop = true,
  className = '',
  hasSidebar = true,
}) => {
  const navigate = useNavigate();
  const { setPageHeaderVisible } = usePageHeader();

  useEffect(() => {
    setPageHeaderVisible(true);
    return () => setPageHeaderVisible(false);
  }, [setPageHeaderVisible]);

  const handleLeftClick = () => {
    if (leftButton === 'back') {
      navigate(-1);
    }
  };

  const renderLeftButton = () => {
    if (leftButton === 'none') {
      return <div className="w-10" />;
    }

    if (leftButton === 'close') {
      return (
        <button
          onClick={handleLeftClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] active:scale-95 transition-all text-text-main"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      );
    }

    // back button (default)
    return (
      <button
        onClick={handleLeftClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] active:scale-95 transition-all text-text-main"
        aria-label="Go back"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };

  const renderRightButton = () => {
    if (rightButton === 'none') {
      return <div className="w-10" />;
    }

    if (rightButton === 'notification') {
      return (
        <button
          onClick={onRightClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] active:scale-95 transition-all text-text-main"
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      );
    }

    if (rightButton === 'camera') {
      return (
        <button
          onClick={onRightClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] active:scale-95 transition-all text-text-main"
          aria-label="Camera"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      );
    }

    return <div className="w-10" />;
  };

  const desktopClass = showOnDesktop ? 'md:flex' : 'hidden md:hidden';
  const sidebarClass = hasSidebar ? 'md:ml-[260px]' : '';

  return (
    <header
      className={`bg-bg-main/80 backdrop-blur-md border-b border-border-main/40 shadow-sm fixed top-0 w-full z-40 flex justify-between items-center px-2 md:px-8 py-2.5 max-w-3xl left-1/2 -translate-x-1/2 md:max-w-none md:left-0 md:-translate-x-0 ${sidebarClass} ${desktopClass} transition-all duration-300 ${className}`}
    >
      {renderLeftButton()}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-[17px] font-bold text-text-main tracking-tight">{title}</h1>
        {subtitle ? <p className="font-medium text-[11.5px] text-text-muted mt-[1px]">{subtitle}</p> : null}
      </div>
      {renderRightButton()}
    </header>
  );
};
