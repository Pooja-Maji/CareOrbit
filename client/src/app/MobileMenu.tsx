import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, User, FileText, Heart, Sparkles } from '../design/ui/Icon';

export const MobileMenu: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <Heart className="w-4 h-4" /> },
    { to: '/assess', label: 'Assess', icon: <Activity className="w-4 h-4" /> },
    { to: '/history', label: 'Care Thread', icon: <FileText className="w-4 h-4" /> },
    { to: '/time-bank', label: 'Time Bank', icon: <Sparkles className="w-4 h-4" /> },
    { to: '/profile', label: 'Reports & Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-plum-soft/80 py-2 px-3 shadow-lifted"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold transition-all py-1.5 px-2.5 rounded-2xl ${
                isActive
                  ? 'text-plum bg-plum-soft border border-plum/20 shadow-xs scale-105'
                  : 'text-ink-muted hover:text-ink active:scale-95'
              }`
            }
          >
            {item.icon}
            <span className="truncate max-w-[70px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
