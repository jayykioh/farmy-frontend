import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, X, BellRinging, Camera } from '@phosphor-icons/react';
import { usePageHeader } from '../contexts/PageHeaderContext';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leftButton?: 'back' | 'close' | 'none';
  rightButton?: 'notification' | 'camera' | 'none';
  onLeftClick?: () => void;
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
  onLeftClick,
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
    if (onLeftClick) {
      onLeftClick();
      return;
    }
    if (leftButton === 'back' || leftButton === 'close') {
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
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 transition-all text-text-main cursor-pointer"
          aria-label="Close"
        >
          <X size={22} weight="bold" />
        </button>
      );
    }

    // back button (default)
    return (
      <button
        onClick={handleLeftClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 transition-all text-text-main cursor-pointer"
        aria-label="Go back"
      >
        <CaretLeft size={24} weight="bold" />
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
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 transition-all text-text-main cursor-pointer"
          aria-label="Notifications"
        >
          <BellRinging size={22} weight="bold" />
        </button>
      );
    }

    if (rightButton === 'camera') {
      return (
        <button
          onClick={onRightClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 transition-all text-text-main cursor-pointer"
          aria-label="Camera"
        >
          <Camera size={22} weight="bold" />
        </button>
      );
    }

    return <div className="w-10" />;
  };

  const desktopClass = showOnDesktop ? 'md:flex' : 'hidden md:hidden';
  const sidebarClass = hasSidebar ? 'md:ml-[260px]' : '';

  return (
    <header
      className={`bg-bg-main/90 backdrop-blur-xl border-b-2 border-border-main fixed top-0 w-full z-40 flex justify-between items-center px-2 md:px-8 py-2.5 max-w-3xl left-1/2 -translate-x-1/2 md:max-w-none md:left-0 md:-translate-x-0 ${sidebarClass} ${desktopClass} transition-all duration-300 ${className}`}
    >
      {renderLeftButton()}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-lg font-black text-text-h tracking-tight">{title}</h1>
        {subtitle ? <p className="font-bold text-xs text-text-secondary mt-[1px]">{subtitle}</p> : null}
      </div>
      {renderRightButton()}
    </header>
  );
};
