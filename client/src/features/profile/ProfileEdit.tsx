import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { LifeStageChips } from './LifeStageChips';
import { HistoryIntake } from './HistoryIntake';
import type { AgeBand, LifeStage, ProfileHistory } from '@sthreecare/shared';
import { ArrowRight, Shield } from '../../design/ui/Icon';

export const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, setLifeStage } = useAppStore();

  const [ageBand, setAgeBand] = useState<AgeBand>(profile.ageBand || '20-29');
  const [history, setHistory] = useState<ProfileHistory>(profile.history || {});
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveAndProceed = () => {
    setProfile({
      ageBand,
      history,
    });
    setSavedNotice(true);
    setTimeout(() => {
      navigate('/assess');
    }, 400);
  };

  const ageBands: { id: AgeBand; label: string }[] = [
    { id: '13-19', label: '13–19' },
    { id: '20-29', label: '20–29' },
    { id: '30-39', label: '30–39' },
    { id: '40-49', label: '40–49' },
    { id: '50plus', label: '50+' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
          Your Life-Stage Compass Setup
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Customise your health profile. The Compass adapts checks and guidelines according to your life stage.
        </p>
      </div>

      <Card variant="default" padding="lg" className="space-y-6">
        {/* Section 1: Life Stage */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-ink block">
            Select Your Current Life Stage
          </label>
          <LifeStageChips
            selectedStage={profile.lifeStage}
            onSelectStage={(stage: LifeStage) => setLifeStage(stage)}
          />
        </div>

        <hr className="border-plum-soft" />

        {/* Section 2: Age Band */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-ink block">
            Age Bracket
          </label>
          <div className="flex flex-wrap gap-2">
            {ageBands.map((band) => (
              <button
                key={band.id}
                type="button"
                onClick={() => setAgeBand(band.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  ageBand === band.id
                    ? 'bg-plum text-white border-plum shadow-soft'
                    : 'bg-white text-ink-muted border-plum-soft hover:bg-plum-soft/30'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-muted">
            Used to suggest age-appropriate preventive wellness and cancer screening checks.
          </p>
        </div>

        <hr className="border-plum-soft" />

        {/* Section 3: History */}
        <HistoryIntake
          history={history}
          onChange={(newHistory) => setHistory(newHistory)}
        />

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <Shield className="w-4 h-4 text-teal" />
            <span>Profile stored locally on this phone</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleSaveAndProceed}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {savedNotice ? 'Saving...' : 'Save & Start Checks'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
