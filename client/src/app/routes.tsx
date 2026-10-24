import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './Shell';
import { LandingPage } from '../features/landing/LandingPage';
import { LimitsAndSources } from '../features/landing/LimitsAndSources';
import { LoginScreen } from '../features/onboarding/LoginScreen';
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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Emergency Takeover takes over entire screen without standard shell */}
      <Route path="/emergency" element={<EmergencyTakeover />} />

      {/* Main Layout Shell */}
      <Route element={<Shell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/assess" element={<CheckPicker />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/find-care" element={<FindCareScreen />} />
        <Route path="/support" element={<RequestSupportScreen />} />
        <Route path="/time-bank" element={<TimeBankScreen />} />
        <Route path="/follow-up" element={<FollowUpScreen />} />
        <Route path="/about" element={<LimitsAndSources />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
