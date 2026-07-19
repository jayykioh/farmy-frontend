import { Outlet, useLocation, Link } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { Sidebar } from './Sidebar';
import { usePageHeader } from '../../contexts/PageHeaderContext';
import { useReminders } from '../../hooks/useReminders';
import { PWAInstallBanner } from '../overlays/PWAInstallBanner';
import { useAuthStore } from '../../store/authStore';

export const MainLayout = () => {
  const location = useLocation();
  const { isPageHeaderVisible } = usePageHeader();
  
  const { user } = useAuthStore();
  const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');

  // List of paths where bottom navigation should be hidden
  const hideBottomNavPaths = ['/', '/login', '/register', '/onboarding-1', '/onboarding-2', '/onboarding-3', '/loading', '/network-error', '/maintenance', '/404', '/celebration'];
  const showBottomNav = !hideBottomNavPaths.includes(location.pathname);
  const showBottomNavFinal = showBottomNav && !isAdmin;

  const { data: pendingReminders } = useReminders({ status: 'pending' });
  const pendingCount = pendingReminders?.length || 0;

  return (
    <div className="flex min-h-[100svh] w-full bg-[#FBFBFD] font-sans relative">
      {/* Sidebar (Desktop) */}
      {showBottomNav ? <Sidebar /> : null}
      {/* Main Content Wrapper */}
      <div className={`flex flex-col flex-1 w-full relative transition-all duration-300 ${showBottomNav ? 'md:ml-[260px]' : ''}`}>
        
        {/* Top Header for Core Pages (hidden when page header is visible) */}
        {showBottomNav && !isPageHeaderVisible ? (<header className="sticky top-0 w-full z-40 bg-[#FBFBFD]/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-6 py-2.5 h-14 shadow-sm border-b border-black/[0.05] transition-all duration-300">
          <button className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-black/[0.04] rounded-full active:scale-95 transition-all md:hidden">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </button>
          <h1 className="text-[17px] font-bold text-text-main tracking-tight md:hidden">FarmDiaries AI</h1>
          <div className="hidden md:flex flex-1 items-center max-w-xl relative">
             <svg className="w-5 h-5 absolute left-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
             <input type="text" placeholder="Tìm kiếm..." className="w-full bg-white border border-black/[0.05] shadow-sm rounded-full py-2 pl-10 pr-4 text-[13.5px] focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all" />
          </div>
          <Link to="/reminders" className="relative w-10 h-10 flex items-center justify-center text-text-main hover:bg-black/[0.04] rounded-full active:scale-95 transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-bg-main shadow-sm">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </Link>
        </header>) : null}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col w-full h-full relative ${showBottomNav ? 'pb-24 md:pb-8' : ''}`}>
          <Outlet />
        </main>
        
        {/* Bottom Navigation (Mobile) */}
        {showBottomNavFinal ? <BottomNavigation /> : null}

        {/* PWA Install Banner */}
        <PWAInstallBanner />
      </div>
    </div>
  );
};
