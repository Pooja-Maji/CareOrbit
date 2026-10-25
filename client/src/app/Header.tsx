import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import {
  Heart,
  Menu,
  X,
  LogOut,
  PhoneCall,
  Shield,
  Sparkles,
  Info,
  ArrowRight,
} from '../design/ui/Icon';
import { NAV_ITEMS } from './navItems';
import { COPY } from '../copy';

const TONE_BG: Record<string, string> = {
  plum: 'bg-plum-soft text-plum',
  teal: 'bg-teal-soft text-teal',
  coral: 'bg-coral-soft text-coral-dark',
  amber: 'bg-amber-soft text-amber-dark',
};

export const Header: React.FC = () => {
  const { profile, currentUser, logout, history } = useAppStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const name = currentUser?.name || profile.name || 'Patient';
  const initials = name.trim().slice(0, 2).toUpperCase() || 'SC';
  const stage = COPY.lifeStages[profile.lifeStage]?.label || 'General';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* Full-width header: brand left · nav next to it · actions pinned right */}
      <header className="bar-surface sticky top-0 z-40 border-b border-white/10">
        <div className="h-full w-full px-4 sm:px-6 lg:px-10 flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 rounded-2xl bg-white text-plum flex items-center justify-center shadow-lifted group-hover:rotate-[-8deg] group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-plum/20" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#5ee0d6] border-2 border-plum animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-bold text-xl tracking-tight">SthreeCare</div>
              <div className="hidden sm:block text-[11px] text-white/70 font-medium">Life-stage health compass</div>
            </div>
          </Link>

          {/* Primary nav, left-aligned next to the logo */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 flex-1 min-w-0">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.hint}
                className={({ isActive }) => `bar-link ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4" />
                    <span className={isActive ? 'inline' : 'hidden 2xl:inline'}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <Link
              to="/profile"
              title="My profile & reports"
              className="hidden sm:flex items-center gap-2 h-10 pl-1.5 pr-1.5 2xl:pr-4 rounded-full bg-white/12 hover:bg-white/22 border border-white/15 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-white text-plum text-[11px] font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="hidden 2xl:inline text-sm font-semibold max-w-[110px] truncate">{name}</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate('/emergency')}
              title="Emergency help"
              className="h-10 px-4 rounded-full bg-white text-emergency text-sm font-bold flex items-center gap-1.5 animate-ring hover:scale-105 active:scale-95 transition-transform"
            >
              <PhoneCall className="w-4 h-4" />
              108
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="h-10 px-3 sm:px-4 rounded-full bg-white/12 hover:bg-white/22 border border-white/15 flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <aside className="relative w-full max-w-md h-full bg-cream shadow-2xl flex flex-col animate-slide-in-right">
            <div className="bar-surface flex items-center justify-between px-5 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-2xl bg-white text-plum font-bold flex items-center justify-center">
                  {initials}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="font-heading font-bold truncate">{name}</div>
                  <div className="text-xs text-white/75 truncate">{stage}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <button
                type="button"
                onClick={() => go('/assess')}
                className="shine w-full flex items-center justify-between p-4 rounded-2xl bg-plum text-white font-bold shadow-lifted hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Start a health check
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-2 gap-3 stagger">
                {[...NAV_ITEMS.filter((n) => n.to !== '/assess')].map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => go(item.to)}
                    className="tile text-left p-4 rounded-2xl bg-white border border-plum-soft/70 shadow-soft"
                  >
                    <span className={`tile-icon w-10 h-10 rounded-xl flex items-center justify-center ${TONE_BG[item.tone]}`}>
                      <item.icon className="w-5 h-5" />
                    </span>
                    <div className="mt-3 text-sm font-bold text-ink">{item.label}</div>
                    <div className="text-xs text-ink-muted">{item.hint}</div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go('/time-bank')}
                  className="tile text-left p-4 rounded-2xl bg-white border border-plum-soft/70 shadow-soft"
                >
                  <span className={`tile-icon w-10 h-10 rounded-xl flex items-center justify-center ${TONE_BG.teal}`}>
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div className="mt-3 text-sm font-bold text-ink">Time Bank</div>
                  <div className="text-xs text-ink-muted">Earn & use credits</div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => go('/about')}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-plum-soft/70 text-sm font-semibold text-ink-muted hover:text-plum hover:border-plum/40 transition-colors"
              >
                <Info className="w-4 h-4 text-teal" /> Sources & limits
              </button>
            </div>

            <div className="flex-shrink-0 p-4 border-t border-plum-soft bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal">
                <Shield className="w-4 h-4" /> {history.length} saved · stays on this device
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="text-sm font-bold text-emergency hover:underline flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
