import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookText, Bot, User, Sprout, Lightbulb, ShoppingBag } from 'lucide-react';
import { usePetStatus } from '../../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../../features/pet/types/pet.types';

export const Sidebar: React.FC = () => {
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const navItems = [
    { to: '/home', icon: Home, label: 'Trang chủ' },
    { to: '/diary', icon: BookText, label: 'Nhật ký' },
    { to: '/chat', icon: Bot, label: 'AI Pet' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/shop', icon: ShoppingBag, label: 'Cửa hàng' },
    { to: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-[100svh] fixed left-0 top-0 bg-bg-main border-r border-border-main/40 z-50">
      
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
                    ? 'bg-bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] text-primary-container font-medium'
                    : 'text-text-muted hover:bg-black/[0.04] hover:text-text-main'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-primary-container' : 'text-text-muted group-hover:text-text-main'
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
      <div className="p-6 border-t border-border-main/30 bg-bg-surface-1/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-main">Hải Nông Dân</span>
            <span className="text-xs text-text-main/50 font-medium">
              Cấp độ {petStatus.level}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
