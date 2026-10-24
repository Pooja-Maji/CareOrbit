/**
 * SthreeCare - Follow-Up Repository
 * Owner: Person B
 * 
 * Tracks clinician-recommended next steps, appointment statuses,
 * and links to practical volunteer support requests.
 */

import { db } from './client';
import type { ExtendedFollowUp } from './schema';
import type { FollowUpStatus } from '@sthreecare/shared';

export async function addFollowUpFromFlag(resultId: string, step: string): Promise<ExtendedFollowUp> {
  const followUps = await getAllFollowUpsFromDb();
  // Check if identical step already exists for this result
  const existing = followUps.find((f) => f.resultId === resultId && f.step === step);
  if (existing) return existing;

  const newFollowUp: ExtendedFollowUp = {
    id: 'fol_' + Math.random().toString(36).substring(2, 9),
    resultId,
    step,
    status: 'open',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days later
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.followUps.put(newFollowUp);
  return newFollowUp;
}

export async function getAllFollowUpsFromDb(): Promise<ExtendedFollowUp[]> {
  try {
    const list = await db.followUps.toArray();
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error('Failed to get follow-ups', e);
    return [];
  }
}

export async function updateFollowUpStatus(
  id: string,
  status: FollowUpStatus,
  notes?: string
): Promise<void> {
  try {
    const item = await db.followUps.get(id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updatedAt = new Date().toISOString();
      await db.followUps.put(item);
    }
  } catch (e) {
    console.error('Failed to update follow-up status', e);
  }
}

export async function linkSupportRequestToFollowUp(
  followUpId: string,
  supportRequestId: string
): Promise<void> {
  try {
    const item = await db.followUps.get(followUpId);
    if (item) {
      item.linkedSupportRequestId = supportRequestId;
      item.status = 'booked';
      item.updatedAt = new Date().toISOString();
      await db.followUps.put(item);
    }
  } catch (e) {
    console.error('Failed to link support request to follow up', e);
  }
}
