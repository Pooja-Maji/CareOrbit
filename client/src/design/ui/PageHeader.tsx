import React from 'react';

export interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  tone?: 'plum' | 'teal' | 'coral' | 'amber';
  actions?: React.ReactNode;
  badge?: string;
}

const TONES = {
  plum: 'from-plum to-plum-light',
  teal: 'from-teal to-[#2a8a85]',
  coral: 'from-coral to-[#f0907a]',
  amber: 'from-amber to-[#d99a3d]',
};

/** Compact page title: icon + one-line title + one-line subtitle + actions on the right. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  tone = 'plum',
  actions,
  badge,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4 min-w-0">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${TONES[tone]} text-white flex items-center justify-center shadow-lifted flex-shrink-0 animate-pop-in`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink leading-tight">{title}</h1>
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-plum-soft text-plum">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-ink-muted truncate">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);
