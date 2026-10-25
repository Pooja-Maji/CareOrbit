import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Shield, Heart, CheckCircle } from '../../design/ui/Icon';

export const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useAppStore();

  const [onDeviceConsent, setOnDeviceConsent] = useState(profile.consent.dataStaysOnDevice);
  const [screeningConsent, setScreeningConsent] = useState(profile.consent.termsAccepted);

  const canProceed = onDeviceConsent && screeningConsent;

  const handleContinue = () => {
    setProfile({
      consent: {
        dataStaysOnDevice: onDeviceConsent,
        termsAccepted: screeningConsent,
        consentTimestamp: new Date().toISOString(),
      },
    });
    navigate('/profile');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card variant="elevated" padding="lg" className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-teal-soft flex items-center justify-center mx-auto text-teal">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Your Privacy & Safety First
          </h1>
          <p className="text-sm text-ink-muted">
            Before we begin your health checks, please confirm your understanding of how Care Orbit safeguards your data.
          </p>
        </div>

        {/* Consent items */}
        <div className="space-y-4">
          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-plum-soft bg-white hover:bg-plum-soft/20 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={onDeviceConsent}
              onChange={(e) => setOnDeviceConsent(e.target.checked)}
              className="mt-1 w-5 h-5 text-plum rounded focus:ring-plum"
            />
            <div className="space-y-1">
              <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal" />
                100% On-Device Privacy
              </span>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your menstrual history, mood check answers, and lab values stay stored inside your browser on this device. They are never transmitted to external cloud servers.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-plum-soft bg-white hover:bg-plum-soft/20 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={screeningConsent}
              onChange={(e) => setScreeningConsent(e.target.checked)}
              className="mt-1 w-5 h-5 text-plum rounded focus:ring-plum"
            />
            <div className="space-y-1">
              <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-plum" />
                Screening, Not Medical Diagnosis
              </span>
              <p className="text-xs text-ink-muted leading-relaxed">
                I understand that Care Orbit uses published, deterministic clinical guidelines to prepare structured doctor discussion summaries. It does not provide medical diagnoses or replace a physician's exam.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={!canProceed}
            onClick={handleContinue}
          >
            Agree & Set Up Profile
          </Button>
          {!canProceed && (
            <p className="text-center text-xs text-ink-subtle mt-2">
              Please check both boxes above to proceed safely.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
