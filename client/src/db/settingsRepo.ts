/**
 * Care Orbit - Settings Repository
 * Owner: Person B
 */

import { db } from './client';
import type { AppSettings } from './schema';

const SETTINGS_KEY = 'local_settings';

const defaultSettings: AppSettings = {
  id: SETTINGS_KEY,
  discreetMode: false,
  remindersEnabled: true,
  autoLockMinutes: 3,
  theme: 'cream-plum',
  updatedAt: new Date().toISOString(),
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const s = await db.settings.get(SETTINGS_KEY);
    return s || defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated: AppSettings = {
    ...current,
    ...partial,
    id: SETTINGS_KEY,
    updatedAt: new Date().toISOString(),
  };
  await db.settings.put(updated);
  return updated;
}
