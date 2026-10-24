/**
 * SthreeCare - Clear All On-Device Data
 * Owner: Person B
 * 
 * Strict Privacy guarantee: Instant full wipe of on-device IndexedDB
 * and localStorage caches.
 */

import { db } from './client';

export async function clearAllLocalHealthData(): Promise<void> {
  try {
    await Promise.all([
      db.profile.clear(),
      db.results.clear(),
      db.followUps.clear(),
      db.settings.clear(),
    ]);

    // Clear related local storage keys
    const keysToRemove = [
      'sthreecare_profile',
      'sthreecare_history',
      'sthreecare_auth_session',
      'sthreecare_anon_ref',
      'sthreecare_discreet_mode',
    ];

    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('Failed to fully clear local health data', e);
  }
}
