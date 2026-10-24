import React from 'react';

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  unit?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  hint,
  unit,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `field_${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {unit && <span className="text-xs font-medium text-ink-subtle">{unit}</span>}
      </div>

      <div className="relative flex items-center">
        <input
          id={inputId}
          className={`w-full px-4 py-3 min-h-[48px] rounded-xl border bg-white text-ink text-base transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-plum focus:border-plum disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-emergency focus:ring-emergency focus:border-emergency' : 'border-plum-soft/80'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}_error` : hint ? `${inputId}_hint` : undefined}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 text-sm font-medium text-ink-subtle pointer-events-none">
            {unit}
          </span>
        )}
      </div>

      {hint && !error && (
        <span id={`${inputId}_hint`} className="text-xs text-ink-muted">
          {hint}
        </span>
      )}

      {error && (
        <span id={`${inputId}_error`} className="text-xs font-medium text-emergency flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};
