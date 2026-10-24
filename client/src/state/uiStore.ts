/**
 * SthreeCare - UI State Store
 * Owner: Person B
 * 
 * Manages privacy controls (Discreet Mode), persistent storage status,
 * and application-wide toast/alert triggers.
 */

import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}

class UiStoreManager {
  private listeners: Set<() => void> = new Set();
  private state = {
    discreetMode: false,
    isStoragePersisted: false,
    storageQuotaMb: 0,
    storageUsageMb: 0,
    activeToasts: [] as ToastMessage[],
  };

  constructor() {
    try {
      const savedDiscreet = localStorage.getItem('sthreecare_discreet_mode');
      if (savedDiscreet) {
        this.state.discreetMode = JSON.parse(savedDiscreet);
      }
    } catch {
      // default false
    }
  }

  getState = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  setDiscreetMode = (enabled: boolean) => {
    this.state = { ...this.state, discreetMode: enabled };
    try {
      localStorage.setItem('sthreecare_discreet_mode', JSON.stringify(enabled));
    } catch (e) {
      console.warn('Storage error', e);
    }
    this.notify();
  };

  toggleDiscreetMode = () => {
    this.setDiscreetMode(!this.state.discreetMode);
  };

  setStorageInfo = (persisted: boolean, usageMb: number = 0, quotaMb: number = 0) => {
    this.state = {
      ...this.state,
      isStoragePersisted: persisted,
      storageUsageMb: usageMb,
      storageQuotaMb: quotaMb,
    };
    this.notify();
  };

  showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const item: ToastMessage = { ...toast, id };
    this.state = {
      ...this.state,
      activeToasts: [...this.state.activeToasts, item],
    };
    this.notify();

    setTimeout(() => {
      this.dismissToast(id);
    }, toast.durationMs || 4000);
  };

  dismissToast = (id: string) => {
    this.state = {
      ...this.state,
      activeToasts: this.state.activeToasts.filter((t) => t.id !== id),
    };
    this.notify();
  };
}

export const uiStore = new UiStoreManager();

export function useUiStore() {
  const [state, setState] = useState(uiStore.getState());

  useEffect(() => {
    const unsub = uiStore.subscribe(() => {
      setState(uiStore.getState());
    });
    return () => { unsub(); };
  }, []);

  return {
    ...state,
    setDiscreetMode: uiStore.setDiscreetMode,
    toggleDiscreetMode: uiStore.toggleDiscreetMode,
    setStorageInfo: uiStore.setStorageInfo,
    showToast: uiStore.showToast,
    dismissToast: uiStore.dismissToast,
  };
}
