/**
 * Care Orbit - Storage Persistence Service
 * Owner: Person B
 * 
 * Requests persistent storage via navigator.storage.persist() so that
 * the user's private health checks and timeline are never evicted.
 */

export interface StorageStatus {
  isPersisted: boolean;
  usageBytes: number;
  quotaBytes: number;
  usagePercent: number;
}

export async function requestStoragePersistence(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (e) {
      console.warn('Storage persistence request failed:', e);
      return false;
    }
  }
  return false;
}

export async function checkStorageStatus(): Promise<StorageStatus> {
  let isPersisted = false;
  let usageBytes = 0;
  let quotaBytes = 0;

  if (typeof navigator !== 'undefined' && navigator.storage) {
    try {
      if (navigator.storage.persisted) {
        isPersisted = await navigator.storage.persisted();
      }
      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
      }
    } catch (e) {
      console.warn('Storage estimate check failed:', e);
    }
  }

  const usagePercent = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;

  return {
    isPersisted,
    usageBytes,
    quotaBytes,
    usagePercent,
  };
}
