import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Button } from '../design/ui/Button';
import { PhoneCall, Shield } from '../design/ui/Icon';
import { COPY } from '../copy';

export const Header: React.FC = () => {
  const { profile } = useAppStore();
  const navigate = useNavigate();

  const lifeStageLabel = COPY.lifeStages[profile.lifeStage]?.label || 'General';

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-plum-soft/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-plum flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M12 7v10M7 12h10" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-ink tracking-tight">
                SthreeCare
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-plum-soft text-plum">
                Compass
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/dashboard"
            className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-plum hover:bg-plum-soft/40 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/assess"
            className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-plum hover:bg-plum-soft/40 rounded-lg transition-colors"
          >
            Assess
          </Link>
          <Link
            to="/history"
            className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-plum hover:bg-plum-soft/40 rounded-lg transition-colors"
          >
            Care Thread
          </Link>
          <Link
            to="/find-care"
            className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-plum hover:bg-plum-soft/40 rounded-lg transition-colors"
          >
            Find Care
          </Link>
          <Link
            to="/time-bank"
            className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-plum hover:bg-plum-soft/40 rounded-lg transition-colors"
          >
            Time Bank
          </Link>
        </nav>

        {/* Life-stage & Emergency Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Current Life Stage Badge */}
          <Link
            to="/profile"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-plum-soft text-xs font-semibold text-plum hover:bg-plum-soft/40 transition-colors"
            title="Click to change your life stage"
          >
            <span className="w-2 h-2 rounded-full bg-teal" />
            <span>{lifeStageLabel}</span>
          </Link>

          {/* Privacy Badge */}
          <div
            className="hidden lg:flex items-center gap-1 text-xs text-ink-subtle px-2 py-1 bg-white/60 rounded-full border border-plum-soft/40"
            title="Health records stay exclusively on your device"
          >
            <Shield className="w-3.5 h-3.5 text-teal" />
            <span>On-Device Privacy</span>
          </div>

          {/* Emergency 108 Call Button */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/emergency')}
            className="!px-3.5 !py-1.5 text-xs font-semibold shadow-soft"
            icon={<PhoneCall className="w-3.5 h-3.5" />}
          >
            Call 108
          </Button>
        </div>
      </div>
    </header>
  );
};
