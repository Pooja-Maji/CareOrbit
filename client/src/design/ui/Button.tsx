import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'teal' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-sm px-4 py-2 min-h-[40px]',
    md: 'text-base px-6 py-3 min-h-[48px]',
    lg: 'text-lg px-8 py-4 min-h-[56px]',
  };

  const variantStyles = {
    primary: 'bg-plum text-white hover:bg-plum-dark focus:ring-plum shadow-soft hover:shadow active:scale-[0.98]',
    secondary: 'bg-plum-soft text-plum hover:bg-[#ebdce9] focus:ring-plum active:scale-[0.98]',
    outline: 'border-2 border-plum text-plum bg-transparent hover:bg-plum-soft focus:ring-plum active:scale-[0.98]',
    teal: 'bg-teal text-white hover:bg-teal-dark focus:ring-teal shadow-soft active:scale-[0.98]',
    danger: 'bg-emergency text-white hover:bg-emergency-dark focus:ring-emergency shadow-soft active:scale-[0.98]',
    ghost: 'text-ink hover:bg-plum-soft/50 focus:ring-plum',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
