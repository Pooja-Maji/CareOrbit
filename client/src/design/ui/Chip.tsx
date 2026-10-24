import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: 'plum' | 'teal' | 'coral' | 'neutral';
  icon?: React.ReactNode;
  badge?: string | number;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  variant = 'plum',
  icon,
  badge,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none border min-h-[40px] focus:outline-none focus:ring-2 focus:ring-offset-1';

  const variantStyles = {
    plum: active
      ? 'bg-plum text-white border-plum shadow-sm focus:ring-plum'
      : 'bg-white text-ink-muted border-plum-soft hover:border-plum/40 hover:bg-plum-soft/30 focus:ring-plum',
    teal: active
      ? 'bg-teal text-white border-teal shadow-sm focus:ring-teal'
      : 'bg-white text-ink-muted border-teal-soft hover:border-teal/40 hover:bg-teal-soft/30 focus:ring-teal',
    coral: active
      ? 'bg-coral text-white border-coral shadow-sm focus:ring-coral'
      : 'bg-white text-ink-muted border-coral-soft hover:border-coral/40 hover:bg-coral-soft/30 focus:ring-coral',
    neutral: active
      ? 'bg-ink text-white border-ink'
      : 'bg-white text-ink-muted border-gray-200 hover:bg-gray-50',
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-white/20 text-white' : 'bg-plum-soft text-plum'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
