import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookText, Bot, User, Sprout } from 'lucide-react';
import { getPetState } from '../../api/farm';
import type { PetState } from '../../api/farm';

export const Sidebar: React.FC = () => {
  const [petState, setPetState] = useState<PetState | null>(null);

  useEffect(() => {
    getPetState()
      .then((data) => {
        setPetState(data);
      })
      .catch((err) => {
        console.error('Failed to fetch pet state in Sidebar:', err);
      });
  }, []);

  const navItems = [
    { to: '/home', icon: Home, label: 'Trang chủ' },
    { to: '/diary', icon: BookText, label: 'Nhật ký' },
    { to: '/chat', icon: Bot, label: 'AI Pet' },
    { to: '/profile', icon: User, label: 'Hồ sơ' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[100svh] fixed left-0 top-0 bg-white border-r border-border-main/50 shadow-sm z-50">
      
      {/* Brand / Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border-main/30">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
          <Sprout size={20} />
        </div>
        <span className="font-extrabold text-xl text-primary tracking-tight">FarmDiaries</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-text-main/70 hover:bg-bg-surface-1 hover:text-text-main font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'text-primary' : 'text-text-main/50 group-hover:text-text-main'} 
                  />
                  <span>{item.label}</span>
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
              Cấp độ {petState?.level ?? 1}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
