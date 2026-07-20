import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookText, Bot, User, Sprout, Lightbulb, ShoppingBag, LogOut, Shield } from 'lucide-react';
import { usePetStatus } from '../../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../../features/pet/types/pet.types';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');

  const navItems = isAdmin
    ? [
        { to: '/admin', icon: Home, label: 'Tổng quan' },
        { to: '/admin/users', icon: User, label: 'Thành viên' },
        { to: '/admin/skins', icon: ShoppingBag, label: 'Quản lý Skin' },
        { to: '/admin/rag', icon: Bot, label: 'AI & RAG' },
        { to: '/admin/scans', icon: Sprout, label: 'Lịch sử quét' },
        { to: '/admin/reminders', icon: BookText, label: 'Nhắc nhở' },
        { to: '/admin/settings', icon: Shield, label: 'Cấu hình' },
        { to: '/admin/change-password', icon: Shield, label: 'Đổi mật khẩu' },
      ]
    : [
        { to: '/home', icon: Home, label: 'Trang chủ' },
        { to: '/diary', icon: BookText, label: 'Nhật ký' },
        { to: '/chat', icon: Bot, label: 'Trợ lý ảo' },
        { to: '/insights', icon: Lightbulb, label: 'Phân tích' },
        { to: '/shop', icon: ShoppingBag, label: 'Cửa hàng' },
        { to: '/profile', icon: User, label: 'Hồ sơ' },
      ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-[100svh] fixed left-0 top-0 bg-[#FBFBFD]/80 backdrop-blur-3xl border-r border-black/[0.05] z-50">
      
      {/* Brand / Logo */}
      <div className="h-16 flex items-center gap-2.5 px-6 mt-4 mb-2">
        <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate('/home')}>
          <Sprout size={24} strokeWidth={2} className="text-[#1d1d1f]" />
        </div>
        <span className="font-semibold text-[17px] text-[#1d1d1f] tracking-tight cursor-pointer" onClick={() => navigate('/home')}>FARMY</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/home'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-3 rounded-[14px] transition-all duration-200 outline-none select-none ${
                  isActive
                    ? 'bg-white/90 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-white/60 text-[#1d1d1f]'
                    : 'text-[#86868b] border border-transparent hover:bg-black/[0.04] hover:text-[#1d1d1f]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#1d1d1f]' : 'text-[#86868b] group-hover:text-[#1d1d1f]'
                    }`}
                  />
                  <span className={`text-[15px] leading-none mt-[1px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer area inside sidebar */}
      <div className="p-4 mx-4 mb-6 rounded-[20px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
        <div className="flex items-center gap-3 cursor-pointer overflow-hidden group" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-full bg-black/[0.03] border border-black/[0.05] flex items-center justify-center font-bold text-[#1d1d1f] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'F'
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[14px] font-semibold text-[#1d1d1f] line-clamp-1">{user?.name || 'Nông dân'}</span>
            <span className="text-[12px] text-[#86868b] font-medium line-clamp-1">
              {user?.role === 'admin'
                ? 'Quản trị viên'
                : user?.role === 'moderator'
                ? 'Kiểm duyệt viên'
                : `Cấp độ ${petStatus.level}`}
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            logout().then(() => navigate('/'));
          }}
          className="p-2 text-[#86868b] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
          title="Đăng xuất"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
