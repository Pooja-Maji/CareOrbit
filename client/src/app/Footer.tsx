import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Info, PhoneCall, HeartPulse, Shield } from '../design/ui/Icon';
import { NAV_ITEMS, MOBILE_TABS } from './navItems';

/**
 * Fixed footer: same surface + same height as the header (see .bar-surface).
 * Desktop → safety info + helplines. Mobile → the 5 main tabs.
 */
export const Footer: React.FC = () => {
  const tabs = MOBILE_TABS.map((to) => NAV_ITEMS.find((n) => n.to === to)!).filter(Boolean);

  return (
    <footer className="bar-surface fixed bottom-0 inset-x-0 z-40 border-t border-white/10">
      {/* Desktop */}
      <div className="hidden md:flex h-full items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 text-sm text-white/85 min-w-0">
          <Shield className="w-4 h-4 text-white flex-shrink-0" />
          <span className="truncate">Screening aid, not a diagnosis. Always confirm with a doctor.</span>
        </div>

        <div className="flex items-center gap-1">
          <Link to="/about" className="bar-link">
            <Info className="w-4 h-4" /> Sources
          </Link>
          <Link to="/emergency" className="bar-link">
            <HeartPulse className="w-4 h-4" /> Danger signs
          </Link>
          <a href="tel:14416" className="bar-link">
            <PhoneCall className="w-4 h-4" /> Mind 14416
          </a>
          <a
            href="tel:108"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#fff] text-[#B3261E] text-sm font-bold hover:scale-105 transition-transform"
          >
            <PhoneCall className="w-4 h-4" /> Ambulance 108
          </a>
        </div>
      </div>

      {/* Mobile tabs */}
      <nav aria-label="Main" className="md:hidden h-full grid grid-cols-5">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-all ${
                isActive ? 'text-white bg-white/15' : 'text-white/70 active:scale-90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <t.icon className={`w-5 h-5 transition-transform ${isActive ? '-translate-y-0.5 scale-110' : ''}`} />
                <span className="truncate max-w-full px-1">{t.to === '/profile' ? 'Profile' : t.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};
