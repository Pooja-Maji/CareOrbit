/**
 * Care Orbit - Healthcare Time Bank Credits API
 * Owner: Person B
 * 
 * CORE PRINCIPLE:
 * Credits are a community mutual-aid reciprocity mechanism (1 volunteer hour = 1 credit).
 * Credits NEVER gate urgent care or clinical consultations.
 * Sponsored credits pool ensures any woman who cannot volunteer still gets full support.
 */

import { apiClient } from './client';
import type { CreditSummary, CreditLedgerEntry, CreditRedeemRequest } from '@sthreecare/shared';

const LOCAL_STORAGE_KEY_CREDITS = 'sthreecare_credits_ledger';

function getLocalLedger(anonymousRef: string): CreditLedgerEntry[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_CREDITS}_${anonymousRef}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  // Initial seed ledger for demo
  const initialEntries: CreditLedgerEntry[] = [
    {
      id: 'cred_seed_1',
      anonymousRef,
      delta: 2.0,
      kind: 'sponsored',
      description: 'Community Welcome Mutual-Aid Grant (recHERsion Healthcare Initiative)',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'cred_seed_2',
      anonymousRef,
      delta: 1.5,
      kind: 'earned',
      description: 'Shared local clinic accessibility feedback with PHC health committee',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  localStorage.setItem(`${LOCAL_STORAGE_KEY_CREDITS}_${anonymousRef}`, JSON.stringify(initialEntries));
  return initialEntries;
}

function saveLocalLedger(anonymousRef: string, entries: CreditLedgerEntry[]) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY_CREDITS}_${anonymousRef}`, JSON.stringify(entries));
}

export async function getCreditsSummary(anonymousRef: string): Promise<CreditSummary> {
  const res = await apiClient<CreditSummary>(`/credits/${anonymousRef}`);
  if (res.data) return res.data;

  const entries = getLocalLedger(anonymousRef);
  const earned = entries.filter((e) => e.kind === 'earned').reduce((acc, cur) => acc + cur.delta, 0);
  const redeemed = entries.filter((e) => e.kind === 'redeemed').reduce((acc, cur) => acc + Math.abs(cur.delta), 0);
  const sponsored = entries.filter((e) => e.kind === 'sponsored').reduce((acc, cur) => acc + cur.delta, 0);
  const balance = earned + sponsored - redeemed;

  return {
    anonymousRef,
    balanceHours: Math.max(0, balance),
    earnedHours: earned,
    redeemedHours: redeemed,
    sponsoredHoursAvailable: 10.0, // Community pooled sponsorship buffer
    entries: entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  };
}

export async function redeemCredits(payload: CreditRedeemRequest): Promise<{ success: boolean; message: string; balanceHours: number }> {
  const res = await apiClient<{ success: boolean; message: string; balanceHours: number }>('/credits/redeem', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.data) return res.data;

  const entries = getLocalLedger(payload.anonymousRef);
  const newEntry: CreditLedgerEntry = {
    id: 'cred_' + Math.random().toString(36).substring(2, 9),
    anonymousRef: payload.anonymousRef,
    delta: -payload.hours,
    kind: 'redeemed',
    description: payload.purpose || 'Hospital accompaniment & navigation volunteer service',
    timestamp: new Date().toISOString(),
  };

  entries.unshift(newEntry);
  saveLocalLedger(payload.anonymousRef, entries);

  const summary = await getCreditsSummary(payload.anonymousRef);
  return {
    success: true,
    message: `Redeemed ${payload.hours} hour(s) for volunteer assistance.`,
    balanceHours: summary.balanceHours,
  };
}
