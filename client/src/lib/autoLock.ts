/**
 * Care Orbit - Inactivity Auto-Lock & Privacy Protector
 * Owner: Person B
 * 
 * Automatically activates Discreet Mode if the device is left idle for
 * longer than the user's chosen threshold (default 3 minutes).
 */

import { uiStore } from '../state/uiStore';

let idleTimer: any = null;
let lockTimeoutMs = 3 * 60 * 1000; // 3 minutes

export function initAutoLock(timeoutMinutes: number = 3) {
  lockTimeoutMs = timeoutMinutes * 60 * 1000;
  resetIdleTimer();

  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
  const handleActivity = () => {
    resetIdleTimer();
  };

  events.forEach((evt) => {
    window.addEventListener(evt, handleActivity, { passive: true });
  });

  return () => {
    if (idleTimer) clearTimeout(idleTimer);
    events.forEach((evt) => {
      window.removeEventListener(evt, handleActivity);
    });
  };
}

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    // If not already in discreet mode, activate it to protect privacy
    const state = uiStore.getState();
    if (!state.discreetMode) {
      uiStore.setDiscreetMode(true);
      uiStore.showToast({
        type: 'info',
        title: 'Discreet Mode Auto-Activated',
        message: 'Screen shielded after inactivity to protect your private health information.',
        durationMs: 4000,
      });
    }
  }, lockTimeoutMs);
}
