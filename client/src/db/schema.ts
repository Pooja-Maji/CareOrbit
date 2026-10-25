/**
 * Care Orbit - On-Device Database Schema
 * Owner: Person B
 * 
 * Strict On-Device rule: All health data (profile, results, follow-ups)
 * lives exclusively on the user's phone/browser. Never sent over the wire.
 */

import type { Profile, Result, FollowUp } from '@sthreecare/shared';

export interface ExtendedFollowUp extends FollowUp {
  linkedSupportRequestId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string; // 'local_settings'
  discreetMode: boolean;
  remindersEnabled: boolean;
  autoLockMinutes: number; // e.g. 3
  theme: 'cream-plum' | 'high-contrast';
  updatedAt: string;
}

export const DB_NAME = 'SthreeCare_OnDevice_DB';
export const DB_VERSION = 1;

export const STORES = {
  PROFILE: 'profile',
  RESULTS: 'results',
  FOLLOW_UPS: 'followUps',
  SETTINGS: 'settings',
} as const;
