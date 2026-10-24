import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, User, FileText, Heart, Sparkles } from '../design/ui/Icon';

export const MobileMenu: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <Heart className="w-4 h-4" /> },
    { to: '/assess', label: 'Assess', icon: <Activity className="w-4 h-4" /> },
    { to: '/history', label: 'Timeline', icon: <FileText className="w-4 h-4" /> },
    { to: '/find-care', label: 'Find Care', icon: <Sparkles className="w-4 h-4" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-plum-soft py-2 px-4 shadow-lifted"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors py-1 px-3 rounded-xl ${
                isActive
                  ? 'text-plum bg-plum-soft/60'
                  : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
