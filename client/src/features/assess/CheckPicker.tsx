import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { run } from '@sthreecare/compass';
import { PadPicker } from './PadPicker';
import { HbEntry } from './HbEntry';
import { MoodSwipeCards } from './MoodSwipeCards';
import { SymptomLog } from './SymptomLog';
import { Button } from '../../design/ui/Button';
import { Activity, Heart, Shield, AlertTriangle, ArrowRight, Sparkles } from '../../design/ui/Icon';
import { Card } from '../../design/ui/Card';

export type CheckTab = 'pbac' | 'hb' | 'epds' | 'symptoms';

export const CheckPicker: React.FC = () => {
  const navigate = useNavigate();
  const { profile, inputs, updateInputs, setResult, saveResultToHistory } = useAppStore();

  // Pick default tab based on life stage
  const defaultTab: CheckTab = profile.lifeStage === 'postpartum' ? 'epds' : 'pbac';
  const [activeTab, setActiveTab] = useState<CheckTab>(defaultTab);

  const tabs: { id: CheckTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'pbac',
      label: 'Menstrual Flow (PBAC)',
      icon: <Activity className="w-4 h-4" />,
      badge: inputs.pbac?.pad.saturated ? `${inputs.pbac.pad.saturated} sat.` : undefined,
    },
    {
      id: 'hb',
      label: 'Haemoglobin (Hb)',
      icon: <Heart className="w-4 h-4" />,
      badge: inputs.hb?.hbValue ? `${inputs.hb.hbValue} g/dL` : undefined,
    },
    {
      id: 'epds',
      label: 'Mood Check (EPDS)',
      icon: <Sparkles className="w-4 h-4" />,
      badge: profile.lifeStage === 'postpartum' ? 'Recommended' : undefined,
    },
    {
      id: 'symptoms',
      label: 'Symptoms & Warning Signs',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: inputs.dangerSigns?.selectedSigns?.length ? 'Danger Sign' : undefined,
    },
  ];

  const handleRunCompass = () => {
    // Run deterministic engine
    const evaluation = run(inputs, profile);
    setResult(evaluation);
    saveResultToHistory(evaluation);

    // If an urgent danger sign was triggered, route immediately to emergency takeover!
    const hasUrgentDanger = evaluation.flags.some(
      (f) => f.level === 'urgent' && (f.ruleId.startsWith('danger_') || f.ruleId === 'epds_self_harm_risk')
    );

    if (hasUrgentDanger) {
      navigate('/emergency');
    } else {
      navigate('/result');
    }
  };

  const load90SecondDemo = () => {
    // 90-second demo path from project plan Page 16:
    // "Run a heavy-bleeding check with the Pad Picker and enter Hb (9.8 g/dL).
    // Show the gauge crossing the threshold and a flag with its source and the doctor script."
    updateInputs({
      pbac: {
        pad: { light: 2, moderate: 4, saturated: 5 }, // 2*1 + 4*5 + 5*20 = 122 pts
        tampon: { light: 0, moderate: 0, saturated: 0 },
        clot: { small: 2, large: 1 }, // 2*1 + 5 = 7 pts -> total 129
        flooding: 1, // 5 pts -> total 134
      },
      hb: { hbValue: 9.8 },
      dangerSigns: { selectedSigns: [] },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Health Check Navigation
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Life Stage: <strong className="text-plum capitalize">{profile.lifeStage}</strong>. Select an instrument to record your observations.
          </p>
        </div>

        {/* 90-second Hackathon Demo Shortcut */}
        <button
          type="button"
          onClick={load90SecondDemo}
          className="px-3.5 py-2 rounded-xl border border-plum/30 bg-plum-soft/60 hover:bg-plum-soft text-plum text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center"
          title="Pre-fills heavy flow (PBAC > 100) and moderate anaemia (Hb 9.8 g/dL)"
        >
          <Sparkles className="w-4 h-4 text-plum" />
          <span>Load 90s Pitch Demo Persona</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-plum-soft pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-plum text-white shadow-soft ring-2 ring-plum/20'
                  : 'bg-white text-ink-muted border border-plum-soft hover:bg-plum-soft/40'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-plum-soft text-plum'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'pbac' && (
          <PadPicker
            value={
              inputs.pbac || {
                pad: { light: 0, moderate: 0, saturated: 0 },
                tampon: { light: 0, moderate: 0, saturated: 0 },
                clot: { small: 0, large: 0 },
                flooding: 0,
              }
            }
            onChange={(pbac) => updateInputs({ pbac })}
          />
        )}

        {activeTab === 'hb' && (
          <HbEntry
            value={inputs.hb || { hbValue: 9.8 }}
            isPregnant={profile.isPregnant}
            onChange={(hb) => updateInputs({ hb })}
          />
        )}

        {activeTab === 'epds' && (
          <MoodSwipeCards
            value={inputs.epds || { answers: new Array(10).fill(0) }}
            onChange={(epds) => updateInputs({ epds })}
            onComplete={() => setActiveTab('symptoms')}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomLog
            symptoms={inputs.symptoms || {}}
            dangerSigns={inputs.dangerSigns || { selectedSigns: [] }}
            onSymptomsChange={(symptoms) => updateInputs({ symptoms })}
            onDangerSignsChange={(dangerSigns) => updateInputs({ dangerSigns })}
          />
        )}
      </div>

      {/* Run Compass Screening Action Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-plum-soft shadow-lifted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Shield className="w-4 h-4 text-teal" />
          <span>Screening rules execute deterministically on your device</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleRunCompass}
          className="w-full sm:w-auto shadow-lifted hover:scale-[1.01]"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Evaluate Results in Health Compass
        </Button>
      </div>
    </div>
  );
};
