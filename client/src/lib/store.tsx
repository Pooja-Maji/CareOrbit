import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile, Result, AssessmentInputs, LifeStage } from '@sthreecare/shared';

export interface AppState {
  profile: Profile;
  inputs: AssessmentInputs;
  result: Result | null;
  history: Result[];
  isLoggedIn: boolean;
  setProfile: (p: Partial<Profile>) => void;
  setLifeStage: (stage: LifeStage) => void;
  updateInputs: (newInputs: Partial<AssessmentInputs>) => void;
  setResult: (res: Result | null) => void;
  saveResultToHistory: (res: Result) => void;
  setLoggedIn: (val: boolean) => void;
  resetAssessment: () => void;
}

const defaultProfile: Profile = {
  id: 'user_local_1',
  phoneNumber: '9876543210',
  ageBand: '20-29',
  lifeStage: 'adult',
  isPregnant: false,
  isPostpartum: false,
  history: {
    cyclesOver100PbacCount: 3,
    hadUltrasound: false,
    priorAnaemiaDiagnosis: false,
    familyHistoryEndometriosis: false,
  },
  consent: {
    dataStaysOnDevice: true,
    termsAccepted: true,
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
  hb: { hbValue: 9.8 },
  epds: { answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  dangerSigns: { selectedSigns: [] },
  symptoms: {
    cycleLengthDays: 28,
    periodDurationDays: 5,
    painLevel: 6,
    disruptivePainCycles: 2,
    heavyBleedingCycles: 3,
  },
};

const StoreContext = createContext<AppState | null>(null);

const STORAGE_KEY_PROFILE = 'sthreecare_profile';
const STORAGE_KEY_HISTORY = 'sthreecare_history';

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
  const [isLoggedIn, setLoggedIn] = useState<boolean>(true); // Demo is pre-enabled or toggleable

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
        setProfile,
        setLifeStage,
        updateInputs,
        setResult,
        saveResultToHistory,
        setLoggedIn,
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
