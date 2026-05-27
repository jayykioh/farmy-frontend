import { NavLink } from 'react-router-dom';
import { Home, BookText, Bot, User } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { to: '/home', icon: Home, label: 'Trang chủ' },
    { to: '/diary', icon: BookText, label: 'Nhật ký' },
    { to: '/chat', icon: Bot, label: 'AI Pet' },
    { to: '/profile', icon: User, label: 'Hồ sơ' }
  ];

  return (
    <nav className="fixed bottom-0 w-full left-1/2 -translate-x-1/2 max-w-[1024px] bg-bg-surface/90 backdrop-blur-lg border-t border-border-main/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-50 md:hidden">
      <div className="flex justify-around items-center h-[72px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-20 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-text-muted hover:text-text-main'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-primary-lightest/30' : ''}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[11px] ${isActive ? 'font-extrabold text-primary' : 'font-bold'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
