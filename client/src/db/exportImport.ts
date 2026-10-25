/**
 * Care Orbit - Data Export & Import Service
 * Owner: Person B
 * 
 * Allows users to own and backup their health data as a JSON file,
 * restoring it anytime without dependence on cloud servers.
 */

import { db } from './client';
import { getStoredProfile } from './profileRepo';
import { getAllResultsFromDb } from './historyRepo';
import { getAllFollowUpsFromDb } from './followUpRepo';
import { getSettings } from './settingsRepo';

export interface SthreeCareBackupPayload {
  version: '1.0';
  exportedAt: string;
  profile: any;
  results: any[];
  followUps: any[];
  settings: any;
}

export async function exportAllDataToJson(): Promise<string> {
  const [profile, results, followUps, settings] = await Promise.all([
    getStoredProfile(),
    getAllResultsFromDb(),
    getAllFollowUpsFromDb(),
    getSettings(),
  ]);

  const payload: SthreeCareBackupPayload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profile,
    results,
    followUps,
    settings,
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadBackupFile(jsonString: string, filename = 'sthreecare-health-backup.json') {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importDataFromJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data: SthreeCareBackupPayload = JSON.parse(jsonString);
    if (!data.version || !data.results) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    if (data.profile) {
      await db.profile.put(data.profile);
    }
    if (Array.isArray(data.results)) {
      for (const res of data.results) {
        await db.results.put(res);
      }
    }
    if (Array.isArray(data.followUps)) {
      for (const fol of data.followUps) {
        await db.followUps.put(fol);
      }
    }
    if (data.settings) {
      await db.settings.put(data.settings);
    }

    return {
      success: true,
      message: `Successfully restored ${data.results.length} screening records and ${data.followUps?.length || 0} follow-up items.`,
    };
  } catch (e: any) {
    return { success: false, message: 'Failed to parse backup file: ' + e.message };
  }
}
