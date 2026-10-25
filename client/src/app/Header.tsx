import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Heart, Menu, X, LogOut, PhoneCall, Shield, Sparkles, Info, ArrowRight, ChevronRight } from '../design/ui/Icon';
import { ThemeToggle } from '../design/ui/ThemeToggle';
import { NAV_ITEMS, NAV_GROUPS } from './navItems';
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
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const name = currentUser?.name || profile.name || 'Patient';
  const initials = name.trim().slice(0, 2).toUpperCase() || 'SC';
  const stage = COPY.lifeStages[profile.lifeStage]?.label || 'General';
  const here = NAV_ITEMS.find((n) => pathname === n.to || (n.to !== '/dashboard' && pathname.startsWith(n.to)));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Header: brand · where you are · profile · theme · emergency · menu. No feature list here (it lives in Menu). */}
      <header className="bar-surface sticky top-0 z-40 border-b border-white/10">
        <div className="h-full w-full px-4 sm:px-6 lg:px-10 flex items-center gap-3 lg:gap-6">
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 rounded-2xl bg-[#fff] text-plum-dark flex items-center justify-center shadow-lifted group-hover:rotate-[-8deg] group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-[#4C1D95]/20 text-[#4C1D95]" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22D3EE] border-2 border-[#2E1065] animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-bold text-xl tracking-tight">SthreeCare</div>
              <div className="hidden sm:block text-[11px] text-white/70 font-medium">Life-stage health compass</div>
            </div>
          </Link>

          {here && (
            <span className="hidden md:inline-flex items-center gap-2 px-3 h-8 rounded-full bg-white/10 border border-white/15 text-sm font-semibold text-white/90">
              <here.icon className="w-4 h-4" />
              {here.label}
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <Link
              to="/profile"
              title="My profile & reports"
              className="hidden md:flex items-center gap-2 h-10 pl-1.5 pr-4 rounded-full bg-white/12 hover:bg-white/22 border border-white/15 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-[#fff] text-plum-dark text-[11px] font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="text-sm font-semibold max-w-[110px] truncate">Profile</span>
            </Link>

            <ThemeToggle onBar className="hidden sm:block" />

            <button
              type="button"
              onClick={() => navigate('/emergency')}
              title="Emergency help"
              className="h-10 px-4 rounded-full bg-[#fff] text-[#B3261E] text-sm font-bold flex items-center gap-1.5 animate-ring hover:scale-105 active:scale-95 transition-transform"
            >
              <PhoneCall className="w-4 h-4" />
              108
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="h-10 px-3 sm:px-4 rounded-full bg-white/12 hover:bg-white/22 border border-white/15 flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu drawer — the ONE place all features are listed, in the order to follow them */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <aside className="relative w-full max-w-md h-full bg-cream shadow-2xl flex flex-col animate-slide-in-right">
            <div className="bar-surface flex items-center justify-between px-5 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-2xl bg-[#fff] text-plum-dark font-bold flex items-center justify-center">
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
              <Link
                to="/assess"
                className="shine split-btn w-full flex items-center justify-between p-4 rounded-2xl text-white font-bold shadow-lifted hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Start a health check
                </span>
                <ArrowRight className="w-5 h-5 text-[#1E0B4D]" />
              </Link>

              {NAV_GROUPS.map((g) => {
                const items = NAV_ITEMS.filter((n) => n.group === g.id);
                return (
                  <section key={g.id} className="space-y-2">
                    {g.title && (
                      <h3 className="px-1 text-[11px] font-bold uppercase tracking-widest text-ink-subtle font-sans">{g.title}</h3>
                    )}
                    <ul className="space-y-2 stagger">
                      {items.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              `tile flex items-center gap-3 p-3 rounded-2xl border shadow-soft ${
                                isActive ? 'bg-plum-soft border-plum/50' : 'bg-white border-plum-soft/70'
                              }`
                            }
                          >
                            <span className={`tile-icon relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${TONE_BG[item.tone]}`}>
                              <item.icon className="w-5 h-5" />
                              {item.step && (
                                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-plum text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[rgb(var(--c-cream))]">
                                  {item.step}
                                </span>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-ink">{item.label}</span>
                              <span className="block text-xs text-ink-muted truncate">{item.hint}</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-ink-subtle flex-shrink-0" />
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

              <Link
                to="/about"
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-plum-soft/70 text-sm font-semibold text-ink-muted hover:text-plum hover:border-plum/40 transition-colors"
              >
                <Info className="w-4 h-4 text-teal" /> Sources & limits
              </Link>

              {/* Appearance — also in the header on wider screens */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-plum-soft/70">
                <div className="text-sm font-semibold text-ink">
                  Appearance
                  <div className="text-xs font-normal text-ink-muted">Switch light / dark mode</div>
                </div>
                <ThemeToggle />
              </div>
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
