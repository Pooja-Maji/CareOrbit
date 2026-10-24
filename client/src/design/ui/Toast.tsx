import React from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'caution' | 'emergency';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  const typeStyles = {
    success: 'bg-teal text-white shadow-soft',
    info: 'bg-plum text-white shadow-soft',
    caution: 'bg-amber text-white shadow-soft',
    emergency: 'bg-emergency text-white shadow-soft',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full flex items-center gap-3 text-sm font-medium ${typeStyles[type]} animate-slide-up`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
