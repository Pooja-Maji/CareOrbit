import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile, Result, AssessmentInputs, LifeStage } from '@sthreecare/shared';
import { saveResultToDb, deleteResultFromDb } from '../db/historyRepo';

export interface UserAccount {
  name: string;
  phoneNumber: string;
  password?: string;
  createdAt: string;
}

export interface AppState {
  profile: Profile;
  inputs: AssessmentInputs;
  result: Result | null;
  history: Result[];
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
  setProfile: (p: Partial<Profile>) => void;
  setLifeStage: (stage: LifeStage) => void;
  updateInputs: (newInputs: Partial<AssessmentInputs>) => void;
  setResult: (res: Result | null) => void;
  saveResultToHistory: (res: Result) => void;
  deleteResultFromHistory: (resultId: string) => void;
  clearAllHistory: () => void;
  setLoggedIn: (val: boolean) => void;
  registerAccount: (data: { name: string; phoneNumber: string; password?: string }) => { success: boolean; message?: string };
  loginWithCredentials: (phoneNumber: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  resetAssessment: () => void;
}

const defaultProfile: Profile = {
  id: 'user_local_1',
  name: '',
  phoneNumber: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
  ageBand: '20-29',
  lifeStage: 'adult',
  isPregnant: false,
  isPostpartum: false,
  history: {},
  consent: {
    dataStaysOnDevice: true,
    termsAccepted: false,
    consentTimestamp: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultInputs: AssessmentInputs = {
  pbac: {
    pad: { light: 0, moderate: 0, saturated: 0 },
    tampon: { light: 0, moderate: 0, saturated: 0 },
    clot: { small: 0, large: 0 },
    flooding: 0,
  },
  hb: { hbValue: 12.0 },
  epds: { answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  dangerSigns: { selectedSigns: [] },
  symptoms: {
    cycleLengthDays: 28,
    periodDurationDays: 5,
    painLevel: 0,
    disruptivePainCycles: 0,
    heavyBleedingCycles: 0,
  },
};

const StoreContext = createContext<AppState | null>(null);

const STORAGE_KEY_PROFILE = 'sthreecare_profile';
const STORAGE_KEY_HISTORY = 'sthreecare_history';
const STORAGE_KEY_ACCOUNTS = 'sthreecare_accounts';
const STORAGE_KEY_CURRENT_USER = 'sthreecare_current_user';
const STORAGE_KEY_LOGGED_IN = 'sthreecare_is_logged_in';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [inputs, setInputsState] = useState<AssessmentInputs>(defaultInputs);
  const [result, setResult] = useState<Result | null>(null);

  const [history, setHistory] = useState<Result[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGGED_IN);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setLoggedIn = (val: boolean) => {
    setIsLoggedInState(val);
    try {
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, JSON.stringify(val));
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  const setProfile = (partial: Partial<Profile>) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...partial, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      } catch (e) {
        console.error('Local save error', e);
      }
      return updated;
    });
  };

  const setLifeStage = (stage: LifeStage) => {
    setProfile({
      lifeStage: stage,
      isPregnant: stage === 'pregnant',
      isPostpartum: stage === 'postpartum',
    });
  };

  const updateInputs = (newInputs: Partial<AssessmentInputs>) => {
    setInputsState((prev) => ({
      ...prev,
      ...newInputs,
    }));
  };

  const saveResultToHistory = (res: Result) => {
    setHistory((prev) => {
      const next = [res, ...prev.filter((r) => r.id !== res.id)];
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      } catch (e) {
        console.error('History save error', e);
      }
      return next;
    });
    // Also save in on-device IndexedDB
    saveResultToDb(res).catch((err) => console.warn('Could not save to Dexie DB', err));
  };

  const deleteResultFromHistory = (resultId: string) => {
    setHistory((prev) => {
      const next = prev.filter((r) => r.id !== resultId);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      } catch (e) {
        console.error('History update error', e);
      }
      return next;
    });
    deleteResultFromDb(resultId).catch((err) => console.warn('Dexie delete error', err));
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.error('Clear history error', e);
    }
  };

  const registerAccount = (data: { name: string; phoneNumber: string; password?: string }) => {
    try {
      const cleanPhone = data.phoneNumber.trim().replace(/\D/g, '');
      const cleanName = data.name.trim();

      if (!cleanName) {
        return { success: false, message: 'Please enter your real full name.' };
      }
      if (cleanPhone.length < 10) {
        return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
      }
      if (!data.password || data.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      const accounts: UserAccount[] = accountsJson ? JSON.parse(accountsJson) : [];

      // Check if user already exists
      const existing = accounts.find((a) => a.phoneNumber === cleanPhone);
      if (existing) {
        return {
          success: false,
          message: 'An account is already registered with this mobile number. Please Sign In instead.',
        };
      }

      const newAccount: UserAccount = {
        name: cleanName,
        phoneNumber: cleanPhone,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      accounts.push(newAccount);
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newAccount));
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, JSON.stringify(true));
      setCurrentUser(newAccount);
      setIsLoggedInState(true);

      // Update profile with real name and phone
      setProfile({
        name: newAccount.name,
        phoneNumber: newAccount.phoneNumber,
      });

      return { success: true };
    } catch (e) {
      return { success: false, message: 'Failed to save account to device storage.' };
    }
  };

  const loginWithCredentials = (phoneNumber: string, password?: string) => {
    try {
      const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      const accounts: UserAccount[] = accountsJson ? JSON.parse(accountsJson) : [];

      if (!cleanPhone || cleanPhone.length < 10) {
        return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
      }

      const found = accounts.find((a) => a.phoneNumber === cleanPhone);

      if (!found) {
        return {
          success: false,
          message: 'No registered account found with this phone number. Please click "Register" to create your account first.',
        };
      }

      if (found.password && password && found.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please verify and try again.',
        };
      }

      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(found));
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, JSON.stringify(true));
      setCurrentUser(found);
      setProfile({
        name: found.name,
        phoneNumber: found.phoneNumber,
      });
      setIsLoggedInState(true);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Authentication error occurred.' };
    }
  };

  const logout = () => {
    setIsLoggedInState(false);
    setCurrentUser(null);
    try {
      localStorage.setItem(STORAGE_KEY_LOGGED_IN, JSON.stringify(false));
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const resetAssessment = () => {
    setInputsState(defaultInputs);
    setResult(null);
  };

  return (
    <StoreContext.Provider
      value={{
        profile,
        inputs,
        result,
        history,
        isLoggedIn,
        currentUser,
        setProfile,
        setLifeStage,
        updateInputs,
        setResult,
        saveResultToHistory,
        deleteResultFromHistory,
        clearAllHistory,
        setLoggedIn,
        registerAccount,
        loginWithCredentials,
        logout,
        resetAssessment,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return context;
};
