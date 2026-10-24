/**
 * SthreeCare - History Repository
 * Owner: Person B
 * 
 * Auto-saves and retrieves screening records for the Care Thread timeline.
 */

import { db } from './client';
import type { Result } from '@sthreecare/shared';
import { addFollowUpFromFlag } from './followUpRepo';

export async function saveResultToDb(result: Result): Promise<void> {
  try {
    await db.results.put(result);

    // Auto-generate follow-up action items from screening flags
    if (result.flags && result.flags.length > 0) {
      for (const flag of result.flags) {
        if (flag.nextStep) {
          await addFollowUpFromFlag(result.id, flag.nextStep);
        }
      }
    }
  } catch (e) {
    console.error('Failed to save result to DB', e);
  }
}

export async function getAllResultsFromDb(): Promise<Result[]> {
  try {
    const list = await db.results.toArray();
    // Sort descending by date (most recent first)
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (e) {
    console.error('Failed to fetch history results', e);
    return [];
  }
}

export async function getResultByIdFromDb(id: string): Promise<Result | null> {
  try {
    const res = await db.results.get(id);
    return res || null;
  } catch (e) {
    console.error('Failed to get result by id', e);
    return null;
  }
}

export async function deleteResultFromDb(id: string): Promise<void> {
  try {
    await db.results.delete(id);
  } catch (e) {
    console.error('Failed to delete result', e);
  }
}
