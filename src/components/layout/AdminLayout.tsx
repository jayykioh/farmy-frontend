import React from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Users, Database, FileText, Settings, Bell, ChevronRight } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, status } = useAuthStore();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08A855]"></div>
      </div>
    );
  }

  // Allow admin and moderator roles to enter
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return <Navigate to="/home" replace />;
  }


  return (
    <div className="flex-1 flex flex-col min-h-screen w-full bg-[#f4f7f6]">
      {/* Top Header of Admin Dashboard */}
      <div className="bg-white border-b border-black/[0.04] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#86868b] font-medium mb-1">
              <span>Hệ thống</span>
              <ChevronRight size={12} />
              <span className="text-[#08A855]">Quản trị viên</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Bảng điều khiển Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] bg-[#e6f7ee] text-[#08a855] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role === 'admin' ? 'Quản trị tối cao' : 'Điều phối viên'}
            </span>
            <span className="text-[13px] text-[#86868b] font-medium">{user.name}</span>
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
