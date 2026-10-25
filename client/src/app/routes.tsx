import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Shell } from './Shell';
import { AuthScreen } from '../features/onboarding/AuthScreen';
import { ConsentScreen } from '../features/onboarding/ConsentScreen';
import { ProfileEdit } from '../features/profile/ProfileEdit';
import { CheckPicker } from '../features/assess/CheckPicker';
import { ResultScreen } from '../features/result/ResultScreen';
import { EmergencyTakeover } from '../features/result/EmergencyTakeover';
import { DashboardScreen } from '../features/dashboard/DashboardScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { FindCareScreen } from '../features/find-care/FindCareScreen';
import { RequestSupportScreen } from '../features/support/RequestSupportScreen';
import { TimeBankScreen } from '../features/time-bank/TimeBankScreen';
import { FollowUpScreen } from '../features/follow-up/FollowUpScreen';
import { LimitsAndSources } from '../features/landing/LimitsAndSources';

export const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAppStore();

  // If NOT logged in, show ONLY the Login / Register screen
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/emergency" element={<EmergencyTakeover />} />
        <Route path="*" element={<AuthScreen />} />
      </Routes>
    );
  }

  // Once logged in, Home page is the main Dashboard and all features are accessible
  return (
    <Routes>
      {/* Emergency Takeover takes over entire screen */}
      <Route path="/emergency" element={<EmergencyTakeover />} />

      {/* Main Layout Shell */}
      <Route element={<Shell />}>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/assess" element={<CheckPicker />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/find-care" element={<FindCareScreen />} />
        <Route path="/support" element={<RequestSupportScreen />} />
        <Route path="/time-bank" element={<TimeBankScreen />} />
        <Route path="/follow-up" element={<FollowUpScreen />} />
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/about" element={<LimitsAndSources />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
