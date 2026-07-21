import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  House,
  BookBookmark,
  Robot,
  User,
  Plant,
  Lightbulb,
  ShoppingBagOpen,
  SignOut,
  ShieldCheck,
  UsersThree,
  Scan,
  BellRinging,
  Key,
} from '@phosphor-icons/react';
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
        { to: '/admin', icon: House, label: 'Tổng quan' },
        { to: '/admin/users', icon: UsersThree, label: 'Thành viên' },
        { to: '/admin/skins', icon: ShoppingBagOpen, label: 'Quản lý Skin' },
        { to: '/admin/rag', icon: Robot, label: 'AI & RAG' },
        { to: '/admin/scans', icon: Scan, label: 'Lịch sử quét' },
        { to: '/admin/reminders', icon: BellRinging, label: 'Nhắc nhở' },
        { to: '/admin/settings', icon: ShieldCheck, label: 'Cấu hình' },
        { to: '/admin/change-password', icon: Key, label: 'Đổi mật khẩu' },
      ]
    : [
        { to: '/home', icon: House, label: 'Trang chủ' },
        { to: '/diary', icon: BookBookmark, label: 'Nhật ký' },
        { to: '/chat', icon: Robot, label: 'Trợ lý ảo' },
        { to: '/insights', icon: Lightbulb, label: 'Phân tích' },
        { to: '/shop', icon: ShoppingBagOpen, label: 'Cửa hàng' },
        { to: '/profile', icon: User, label: 'Hồ sơ' },
      ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-[100svh] fixed left-0 top-0 bg-bg-main/90 backdrop-blur-3xl border-r-2 border-border-main z-50 text-left font-sans">
      
      {/* Brand / Logo */}
      <div className="h-16 flex items-center gap-3 px-6 mt-4 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-white border-2 border-border-main flex items-center justify-center cursor-pointer shadow-xs" onClick={() => navigate('/home')}>
          <Plant size={24} weight="duotone" className="text-[#008A5E]" />
        </div>
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/home')}>
          <span className="font-black text-lg text-text-h tracking-tight">FARMY</span>
          <span className="text-[10px] font-black uppercase text-[#008A5E] tracking-widest -mt-1">Nông nghiệp AI</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 flex flex-col gap-2 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/home'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 outline-none select-none ${
                  isActive
                    ? 'bg-white border-2 border-border-main text-[#008A5E] shadow-xs font-black'
                    : 'text-text-secondary border-2 border-transparent hover:bg-bg-surface-1 hover:text-text-h font-bold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    weight={isActive ? "duotone" : "bold"}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#008A5E]' : 'text-text-secondary group-hover:text-text-h'
                    }`}
                  />
                  <span className="text-sm leading-none tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer area inside sidebar */}
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-white border-2 border-border-main shadow-xs flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer overflow-hidden group" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-full bg-bg-surface-2 border-2 border-border-main flex items-center justify-center font-black text-[#008A5E] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'F'
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-black text-text-h line-clamp-1">{user?.name || 'Nông dân'}</span>
            <span className="text-[11px] text-[#008A5E] font-bold line-clamp-1">
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
          className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-95 shrink-0 cursor-pointer"
          title="Đăng xuất"
        >
          <SignOut size={20} weight="bold" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
