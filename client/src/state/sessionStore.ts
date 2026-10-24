/**
 * SthreeCare - Session State Store
 * Owner: Person B (Stage 2 & Stage 11 integration)
 * 
 * Manages authentication and the zero-knowledge anonymous reference.
 * The anonymousRef ensures volunteer matching & Time Bank credits never
 * link to any clinical screening data or phone identity.
 */

export interface SessionState {
  token: string | null;
  phoneNumber: string | null;
  anonymousRef: string;
  isAuthenticated: boolean;
  loginDemo: (phone: string, token?: string) => void;
  logout: () => void;
  getAnonymousRef: () => string;
}

const STORAGE_KEY_AUTH = 'sthreecare_auth_session';
const STORAGE_KEY_ANON_REF = 'sthreecare_anon_ref';

function getOrCreateAnonRef(): string {
  try {
    let ref = localStorage.getItem(STORAGE_KEY_ANON_REF);
    if (!ref) {
      ref = 'anon_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_ANON_REF, ref);
    }
    return ref;
  } catch {
    return 'anon_local_demo_' + Date.now();
  }
}

class SessionStoreManager {
  private listeners: Set<() => void> = new Set();
  private state: {
    token: string | null;
    phoneNumber: string | null;
    anonymousRef: string;
    isAuthenticated: boolean;
  };

  constructor() {
    let saved: { token?: string; phoneNumber?: string } | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = null;
    }

    this.state = {
      token: saved?.token || 'demo-jwt-token-active',
      phoneNumber: saved?.phoneNumber || '9876543210',
      anonymousRef: getOrCreateAnonRef(),
      isAuthenticated: true,
    };
  }

  getState = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  loginDemo = (phone: string, token: string = 'demo-token-' + Date.now()) => {
    this.state = {
      ...this.state,
      token,
      phoneNumber: phone,
      isAuthenticated: true,
    };
    try {
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({ token, phoneNumber: phone })
      );
    } catch (e) {
      console.warn('Could not save session', e);
    }
    this.notify();
  };

  logout = () => {
    this.state = {
      token: null,
      phoneNumber: null,
      anonymousRef: getOrCreateAnonRef(),
      isAuthenticated: false,
    };
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.warn('Could not remove session', e);
    }
    this.notify();
  };

  getAnonymousRef = () => this.state.anonymousRef;
}

export const sessionStore = new SessionStoreManager();

import { useState, useEffect } from 'react';

export function useSessionStore() {
  const [state, setState] = useState(sessionStore.getState());

  useEffect(() => {
    const unsub = sessionStore.subscribe(() => {
      setState(sessionStore.getState());
    });
    return () => { unsub(); };
  }, []);

  return {
    ...state,
    loginDemo: sessionStore.loginDemo,
    logout: sessionStore.logout,
    getAnonymousRef: sessionStore.getAnonymousRef,
  };
}
