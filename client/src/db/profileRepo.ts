/**
 * SthreeCare - Profile Repository
 * Owner: Person B
 */

import { db } from './client';
import type { Profile } from '@sthreecare/shared';

const PROFILE_PRIMARY_ID = 'local_user_profile';

export async function getStoredProfile(): Promise<Profile | null> {
  try {
    const profile = await db.profile.get(PROFILE_PRIMARY_ID);
    return profile || null;
  } catch (e) {
    console.error('Failed to get profile from DB', e);
    return null;
  }
}

export async function saveStoredProfile(profile: Profile): Promise<void> {
  try {
    await db.profile.put({
      ...profile,
      id: PROFILE_PRIMARY_ID,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to save profile to DB', e);
  }
}
