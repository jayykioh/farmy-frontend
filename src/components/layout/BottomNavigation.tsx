import { NavLink } from 'react-router-dom';
import { Home, BookText, Bot, User, Lightbulb, ShoppingBag } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { to: '/home', icon: Home, label: 'Trang chủ' },
    { to: '/diary', icon: BookText, label: 'Nhật ký' },
    { to: '/chat', icon: Bot, label: 'AI Pet' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/shop', icon: ShoppingBag, label: 'Cửa hàng' },
    { to: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <nav className="fixed bottom-0 w-full left-0 bg-bg-surface/85 backdrop-blur-xl border-t border-border-main/40 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-[60px] px-2 mb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-[3px] w-16 h-full transition-all duration-300 ease-out active:scale-[0.96] outline-none select-none"
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-colors duration-300 ${isActive ? 'text-primary-container' : 'text-text-muted'}`}
                  />
                  <span className={`text-[10.5px] leading-none tracking-tight transition-colors duration-300 ${isActive ? 'font-semibold text-primary-container' : 'font-medium text-text-muted'}`}>
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
