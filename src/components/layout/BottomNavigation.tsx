import { NavLink } from 'react-router-dom';
import { House, BookBookmark, Robot, User, Lightbulb, ShoppingBagOpen } from '@phosphor-icons/react';

export const BottomNavigation = () => {
  const navItems = [
    { to: '/home', icon: House, label: 'Trang chủ' },
    { to: '/diary', icon: BookBookmark, label: 'Nhật ký' },
    { to: '/chat', icon: Robot, label: 'AI Pet' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/shop', icon: ShoppingBagOpen, label: 'Cửa hàng' },
    { to: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <nav className="fixed bottom-0 w-full left-0 bg-bg-main/90 backdrop-blur-xl border-t-2 border-border-main pb-safe z-50 md:hidden font-sans">
      <div className="flex justify-around items-center h-[60px] px-2 mb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-[3px] w-16 h-full transition-all duration-200 ease-out active:scale-95 outline-none select-none"
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={24} 
                    weight={isActive ? "duotone" : "bold"} 
                    className={`transition-colors duration-200 ${isActive ? 'text-[#008A5E]' : 'text-text-secondary'}`}
                  />
                  <span className={`text-[10.5px] leading-none tracking-tight transition-colors duration-200 ${isActive ? 'font-extrabold text-[#008A5E]' : 'font-bold text-text-secondary'}`}>
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
