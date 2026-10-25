/**
 * SthreeCare - Health Assessment Navigation (Stage 5 & 6)
 * Owner: Person A
 * 
 * Life-stage adaptive assessment hub integrating validated instruments:
 * PBAC flow, WHO Hb entry, EPDS perinatal mood cards, danger signs,
 * and the interactive Body Pain Painter.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { useAssessment, type AssessmentTab } from './useAssessment';
import { PadPicker } from './PadPicker';
import { HbEntry } from './HbEntry';
import { MoodSwipeCards } from './MoodSwipeCards';
import { SymptomLog } from './SymptomLog';
import { BodyPainPainter } from './BodyPainPainter';
import { Button } from '../../design/ui/Button';
import { PageHeader } from '../../design/ui/PageHeader';
import {
  ClipboardList,
  Droplets,
  Brain,
  Siren,
  Activity,
  Check,
  ArrowRight,
  Shield,
  AlertTriangle,
  PhoneCall,
} from '../../design/ui/Icon';

export const CheckPicker: React.FC = () => {
  const navigate = useNavigate();
  const { updateInputs } = useAppStore();

  const {
    activeTab,
    setActiveTab,
    hasUrgentDangerSigns,
    hasSelfHarmRisk,
    evaluateAssessment,
    load90SecondDemo,
    loadPostpartumMoodDemo,
    loadEmergencyDemo,
    resetAllInputs,
    inputs,
    profile,
  } = useAssessment();

  const tabs: {
    id: AssessmentTab;
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
      {
        id: 'pain',
        label: 'Body pain map',
        hint: 'Tap where it hurts',
        icon: <Activity className="w-6 h-6" />,
        done: !!inputs.symptoms?.painLocations?.length,
        badge: inputs.symptoms?.painLocations?.length ? `${inputs.symptoms.painLocations.length} areas` : undefined,
        gradient: 'from-coral to-coral',
      },
    ];

  const doneCount = tabs.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      {/* Urgent warning banner */}
      {(hasUrgentDangerSigns || hasSelfHarmRisk) && (
        <div className="p-4 rounded-2xl bg-emergency text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lifted animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-emergency flex items-center justify-center flex-shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base">Immediate danger sign detected</h4>
              <p className="text-xs text-red-100">
                {hasSelfHarmRisk
                  ? 'Urgent perinatal crisis flag recorded. Free confidential support is available 24/7.'
                  : 'Emergency symptoms (heavy acute blood loss, fainting, or severe pelvic pain) need immediate care.'}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(hasSelfHarmRisk ? '/crisis-support' : '/emergency')}
            className="bg-white text-emergency-dark hover:bg-red-50 font-bold border-none shadow-md flex-shrink-0"
            icon={<PhoneCall className="w-4 h-4" />}
          >
            {hasSelfHarmRisk ? 'Support helpline (14416)' : 'Open emergency screen (108)'}
          </Button>
        </div>
      )}

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

      {/* Demo scenarios */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-subtle mr-1">Demo scenarios:</span>
        <button
          type="button"
          onClick={load90SecondDemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-plum-soft text-plum hover:bg-plum hover:text-white transition-colors border border-plum/20"
          title="Pre-fills heavy flow PBAC (134 pts) and Hb 9.8 g/dL"
        >
          90s demo
        </button>
        <button
          type="button"
          onClick={loadPostpartumMoodDemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-soft text-teal-dark hover:bg-teal hover:text-white transition-colors border border-teal/20"
          title="Pre-fills EPDS score 14/30"
        >
          Postpartum EPDS
        </button>
        <button
          type="button"
          onClick={loadEmergencyDemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emergency-soft text-emergency-dark hover:bg-emergency hover:text-white transition-colors border border-emergency/20"
          title="Triggers emergency warning signs"
        >
          Emergency sign
        </button>
        <button type="button" onClick={resetAllInputs} className="text-xs px-2.5 py-1.5 text-ink-subtle hover:text-ink underline">
          Reset
        </button>
      </div>

      {/* Step cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 stagger">
        {tabs.map((tab, i) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tile relative text-left p-4 rounded-card border-2 overflow-hidden ${active ? 'border-plum bg-white shadow-lifted' : 'border-transparent bg-white shadow-soft'
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

        {activeTab === 'pain' && (
          <BodyPainPainter
            symptoms={inputs.symptoms || {}}
            onChange={(symptoms) => updateInputs({ symptoms })}
          />
        )}
      </div>

      {/* Sticky action bar, sits above the fixed footer */}
      <div className="sticky bottom-[calc(var(--bar-h)+12px)] z-30 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-plum-soft shadow-lifted flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-ink-muted">
          <Shield className="w-4 h-4 text-teal" /> Calculated on your device
        </div>
        <Button
          size="lg"
          onClick={() => evaluateAssessment()}
          icon={<ArrowRight className="w-5 h-5" />}
          className="shine w-full sm:w-auto"
        >
          See my results
        </Button>
      </div>
    </div>
  );
};