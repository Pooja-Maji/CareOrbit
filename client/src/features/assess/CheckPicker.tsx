import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { run } from '@sthreecare/compass';
import { PadPicker } from './PadPicker';
import { HbEntry } from './HbEntry';
import { MoodSwipeCards } from './MoodSwipeCards';
import { SymptomLog } from './SymptomLog';
import { Button } from '../../design/ui/Button';
import { PageHeader } from '../../design/ui/PageHeader';
import {
  ClipboardList,
  Droplets,
  Brain,
  Siren,
  Check,
  ArrowRight,
  Shield,
} from '../../design/ui/Icon';

export type CheckTab = 'pbac' | 'hb' | 'epds' | 'symptoms';

export const CheckPicker: React.FC = () => {
  const navigate = useNavigate();
  const { profile, inputs, updateInputs, setResult, saveResultToHistory } = useAppStore();

  const defaultTab: CheckTab = profile.lifeStage === 'postpartum' ? 'epds' : 'pbac';
  const [activeTab, setActiveTab] = useState<CheckTab>(defaultTab);

  const tabs: {
    id: CheckTab;
    label: string;
    hint: string;
    icon: React.ReactNode;
    done: boolean;
    badge?: string;
    gradient: string;
  }[] = [
    {
      id: 'pbac',
      label: 'Period flow',
      hint: 'Pads & clots · 1 min',
      icon: <Droplets className="w-6 h-6" />,
      done: !!inputs.pbac && (inputs.pbac.pad.light + inputs.pbac.pad.moderate + inputs.pbac.pad.saturated > 0),
      gradient: 'from-plum to-plum',
    },
    {
      id: 'hb',
      label: 'Blood (Hb)',
      hint: 'From a lab report',
      icon: <ClipboardList className="w-6 h-6" />,
      done: !!inputs.hb?.hbValue && inputs.hb.hbValue !== 12.0,
      badge: inputs.hb?.hbValue && inputs.hb.hbValue !== 12.0 ? `${inputs.hb.hbValue} g/dL` : undefined,
      gradient: 'from-teal to-teal',
    },
    {
      id: 'epds',
      label: 'Mood',
      hint: '10 quick cards',
      icon: <Brain className="w-6 h-6" />,
      done: !!inputs.epds && inputs.epds.answers.some((a) => a > 0),
      badge: profile.lifeStage === 'postpartum' ? 'Suggested' : undefined,
      gradient: 'from-plum to-plum',
    },
    {
      id: 'symptoms',
      label: 'Symptoms',
      hint: 'Pain & danger signs',
      icon: <Siren className="w-6 h-6" />,
      done: !!inputs.dangerSigns?.selectedSigns?.length,
      badge: inputs.dangerSigns?.selectedSigns?.length ? 'Alert' : undefined,
      gradient: 'from-coral to-coral',
    },
  ];

  const doneCount = tabs.filter((t) => t.done).length;

  const handleRunCompass = () => {
    const evaluation = run(inputs, profile);
    setResult(evaluation);
    saveResultToHistory(evaluation);
    const urgent = evaluation.flags.some(
      (f) => f.level === 'urgent' && (f.ruleId.startsWith('danger_') || f.ruleId === 'epds_self_harm_risk')
    );
    navigate(urgent ? '/emergency' : '/result');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ClipboardList className="w-7 h-7" />}
        title="Health Check"
        subtitle="Pick any check below. Do one or all."
        actions={
          <span className="px-3 py-1.5 rounded-full bg-plum-soft text-plum text-sm font-bold">
            {doneCount}/{tabs.length} done
          </span>
        }
      />

      {/* Step cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
        {tabs.map((tab, i) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tile relative text-left p-4 rounded-card border-2 overflow-hidden ${
                active ? 'border-plum bg-white shadow-lifted' : 'border-transparent bg-white shadow-soft'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`tile-icon w-12 h-12 rounded-2xl bg-gradient-to-br ${tab.gradient} text-white flex items-center justify-center`}>
                  {tab.icon}
                </span>
                {tab.done ? (
                  <span className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center animate-pop-in">
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-plum-soft text-plum text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                )}
              </div>
              <div className="mt-3 font-heading font-bold text-ink">{tab.label}</div>
              <div className="text-xs text-ink-muted flex items-center gap-2">
                {tab.hint}
                {tab.badge && <span className="px-1.5 py-0.5 rounded bg-plum-soft text-plum font-bold">{tab.badge}</span>}
              </div>
              {active && <span className="absolute bottom-0 left-0 h-1 w-full bg-plum bar-grow" />}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div key={activeTab} className="animate-slide-up">
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
          <HbEntry value={inputs.hb || { hbValue: 9.8 }} isPregnant={profile.isPregnant} onChange={(hb) => updateInputs({ hb })} />
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

      {/* Sticky action bar, sits above the fixed footer */}
      <div className="sticky bottom-[calc(var(--bar-h)+12px)] z-30 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-plum-soft shadow-lifted flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-ink-muted">
          <Shield className="w-4 h-4 text-teal" /> Calculated on your device
        </div>
        <Button size="lg" onClick={handleRunCompass} icon={<ArrowRight className="w-5 h-5" />} className="shine w-full sm:w-auto">
          See my results
        </Button>
      </div>
    </div>
  );
};
