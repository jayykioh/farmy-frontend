import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookText, Bot, User, Sprout, Lightbulb, ShoppingBag, LogOut } from 'lucide-react';
import { usePetStatus } from '../../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../../features/pet/types/pet.types';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/home', icon: Home, label: 'Trang chủ' },
    { to: '/diary', icon: BookText, label: 'Nhật ký' },
    { to: '/chat', icon: Bot, label: 'AI Pet' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/shop', icon: ShoppingBag, label: 'Cửa hàng' },
    { to: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-[100svh] fixed left-0 top-0 bg-[#FBFBFD] border-r border-black/[0.05] z-50">
      
      {/* Brand / Logo */}
      <div className="h-14 flex items-center gap-2.5 px-6 mt-5 mb-3">
        <div className="flex items-center justify-center text-primary">
          <Sprout size={24} strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[15px] text-text-main tracking-tight">FarmDiaries</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-[10px] transition-all duration-300 ease-out outline-none select-none active:scale-[0.96] ${
                  isActive
                    ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.02] text-slate-800 font-semibold'
                    : 'text-slate-500 hover:bg-black/[0.04] hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="text-[13.5px] leading-none mt-[1px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer area inside sidebar */}
      <div className="p-6 border-t border-black/[0.05] bg-transparent flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'F'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[100px]">{user?.name || 'Nông dân'}</span>
            <span className="text-xs text-slate-500 font-medium">
              Cấp độ {petStatus.level}
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            logout().then(() => navigate('/'));
          }}
          className="p-2 text-text-main/50 hover:text-error hover:bg-error-container/20 rounded-full transition-colors"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
