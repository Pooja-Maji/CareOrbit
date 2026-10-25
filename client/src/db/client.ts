/**
 * Care Orbit - On-Device IndexedDB Client (Dexie-compatible layer)
 * Owner: Person B
 * 
 * Provides robust asynchronous storage for local medical screening data
 * with graceful fallback to localStorage.
 */

import { DB_NAME, DB_VERSION, STORES } from './schema';

class DexieTable<T extends { id: string }> {
  constructor(private tableName: string, private getDb: () => Promise<IDBDatabase | null>) {}

  private getFallbackKey(id: string): string {
    return `sthreecare_table_${this.tableName}_${id}`;
  }

  private getFallbackIndexKey(): string {
    return `sthreecare_table_idx_${this.tableName}`;
  }

  private getFallbackIds(): string[] {
    try {
      const raw = localStorage.getItem(this.getFallbackIndexKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private addFallbackId(id: string) {
    const ids = new Set(this.getFallbackIds());
    ids.add(id);
    localStorage.setItem(this.getFallbackIndexKey(), JSON.stringify(Array.from(ids)));
  }

  private removeFallbackId(id: string) {
    const ids = this.getFallbackIds().filter((i) => i !== id);
    localStorage.setItem(this.getFallbackIndexKey(), JSON.stringify(ids));
  }

  async get(id: string): Promise<T | undefined> {
    const db = await this.getDb();
    if (db) {
      return new Promise<T | undefined>((resolve, reject) => {
        try {
          const tx = db.transaction(this.tableName, 'readonly');
          const store = tx.objectStore(this.tableName);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } catch {
          resolve(this.getFallback(id));
        }
      });
    }
    return this.getFallback(id);
  }

  private getFallback(id: string): T | undefined {
    try {
      const raw = localStorage.getItem(this.getFallbackKey(id));
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  }

  async put(item: T): Promise<string> {
    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(this.tableName, 'readwrite');
          const store = tx.objectStore(this.tableName);
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        } catch {
          resolve();
        }
      });
    }

    // Mirror to fallback storage
    try {
      localStorage.setItem(this.getFallbackKey(item.id), JSON.stringify(item));
      this.addFallbackId(item.id);
    } catch (e) {
      console.warn('Fallback storage warning', e);
    }

    return item.id;
  }

  async toArray(): Promise<T[]> {
    const db = await this.getDb();
    if (db) {
      return new Promise<T[]>((resolve, reject) => {
        try {
          const tx = db.transaction(this.tableName, 'readonly');
          const store = tx.objectStore(this.tableName);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = req.result || [];
            if (list.length > 0) {
              resolve(list);
            } else {
              // check fallback
              resolve(this.getAllFallback());
            }
          };
          req.onerror = () => reject(req.error);
        } catch {
          resolve(this.getAllFallback());
        }
      });
    }
    return this.getAllFallback();
  }

  private getAllFallback(): T[] {
    const ids = this.getFallbackIds();
    const result: T[] = [];
    for (const id of ids) {
      const item = this.getFallback(id);
      if (item) result.push(item);
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(this.tableName, 'readwrite');
          const store = tx.objectStore(this.tableName);
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        } catch {
          resolve();
        }
      });
    }

    try {
      localStorage.removeItem(this.getFallbackKey(id));
      this.removeFallbackId(id);
    } catch (e) {
      console.warn('Fallback delete warning', e);
    }
  }

  async clear(): Promise<void> {
    const db = await this.getDb();
    if (db) {
      await new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(this.tableName, 'readwrite');
          const store = tx.objectStore(this.tableName);
          const req = store.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        } catch {
          resolve();
        }
      });
    }

    const ids = this.getFallbackIds();
    for (const id of ids) {
      localStorage.removeItem(this.getFallbackKey(id));
    }
    localStorage.removeItem(this.getFallbackIndexKey());
  }
}

class SthreeCareDatabase {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  profile = new DexieTable<any>(STORES.PROFILE, () => this.init());
  results = new DexieTable<any>(STORES.RESULTS, () => this.init());
  followUps = new DexieTable<any>(STORES.FOLLOW_UPS, () => this.init());
  settings = new DexieTable<any>(STORES.SETTINGS, () => this.init());

  private init(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORES.PROFILE)) {
            db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.RESULTS)) {
            const resStore = db.createObjectStore(STORES.RESULTS, { keyPath: 'id' });
            resStore.createIndex('date', 'date', { unique: false });
            resStore.createIndex('stage', 'stage', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.FOLLOW_UPS)) {
            const folStore = db.createObjectStore(STORES.FOLLOW_UPS, { keyPath: 'id' });
            folStore.createIndex('resultId', 'resultId', { unique: false });
            folStore.createIndex('status', 'status', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
            db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('IndexedDB failed to open, using storage fallback', req.error);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization exception, fallback active', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }
}

export const db = new SthreeCareDatabase();
