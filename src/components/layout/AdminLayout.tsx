import React from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { CaretRight } from '@phosphor-icons/react';

export const AdminLayout: React.FC = () => {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008A5E]"></div>
      </div>
    );
  }

  // Allow admin and moderator roles to enter
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <Navigate to="/home" replace />;
  }


  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-bg-main font-sans text-left">
      {/* Top Header of Admin Dashboard */}
      <div className="bg-bg-main/90 backdrop-blur-xl border-b-2 border-border-main px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary mb-1">
              <span>Hệ thống</span>
              <CaretRight size={12} weight="bold" />
              <span className="text-[#008A5E]">Quản trị viên</span>
            </div>
            <h1 className="text-2xl font-black text-text-h tracking-tight">
              Bảng điều khiển Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#E8F8F5] text-[#008A5E] font-black px-3 py-1 rounded-full border border-[#008A5E]/20 uppercase tracking-wider font-mono">
              {user.role === 'admin' ? 'Quản trị tối cao' : 'Điều phối viên'}
            </span>
            <span className="text-xs text-text-secondary font-bold">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
