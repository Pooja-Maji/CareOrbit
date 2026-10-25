import React, { useEffect } from 'react';

/** How long the Care Orbit splash stays on screen before the login page appears. */
export const SPLASH_DURATION_MS = 5000;

/**
 * Full-logo splash shown before login. Always uses a light background
 * (even in dark mode) so the plum "Care" lettering stays readable.
 */
export const SplashScreen: React.FC<{ onDone: () => void; durationMs?: number }> = ({
  onDone,
  durationMs = SPLASH_DURATION_MS,
}) => {
  useEffect(() => {
    const t = window.setTimeout(onDone, durationMs);
    return () => window.clearTimeout(t);
  }, [onDone, durationMs]);

  return (
    <div
      role="status"
      aria-label="Care Orbit is loading"
      className="splash-root fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FBF7FF]"
    >
      <img
        src="/brand/care-orbit-logo.png"
        alt="Care Orbit"
        width={882}
        height={646}
        className="splash-logo w-[min(70vw,360px)] h-auto select-none"
        draggable={false}
      />
      <div className="splash-bar mt-10 h-1 w-40 overflow-hidden rounded-full bg-[#F1EBFF]" aria-hidden="true">
        <div className="splash-bar-fill h-full rounded-full bg-gradient-to-r from-[#4E2557] to-[#E8718D]" style={{ animationDuration: `${durationMs}ms` }} />
      </div>
    </div>
  );
};
