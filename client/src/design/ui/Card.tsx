import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'plumSoft' | 'coral' | 'emergency' | 'teal';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover-lift + glow. Use on anything clickable or scannable. */
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = `rounded-card border ${interactive ? 'tile' : 'transition-all duration-200'}`;

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-white border-plum-soft/60 shadow-soft',
    elevated: 'bg-white border-plum-soft/40 shadow-lifted',
    plumSoft: 'bg-plum-soft border-plum/10 text-ink',
    coral: 'bg-coral-soft border-coral/30 text-ink shadow-soft',
    emergency: 'bg-emergency-soft border-emergency/40 text-ink shadow-soft',
    teal: 'bg-teal-soft border-teal/20 text-ink shadow-soft',
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
