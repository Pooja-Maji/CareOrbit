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
import { Activity, Heart, Shield, AlertTriangle, ArrowRight, Sparkles, PhoneCall } from '../../design/ui/Icon';
import { Card } from '../../design/ui/Card';

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

  const tabs: { id: AssessmentTab; label: string; icon: React.ReactNode; badge?: string }[] = [
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
    {
      id: 'pain',
      label: 'Body Pain Map (Painter)',
      icon: <Activity className="w-4 h-4" />,
      badge: inputs.symptoms?.painLocations?.length ? `${inputs.symptoms.painLocations.length} areas` : undefined,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Urgent Warning Sign Takeover Banner (runs inside stage 6) */}
      {(hasUrgentDangerSigns || hasSelfHarmRisk) && (
        <div className="p-4 rounded-2xl bg-emergency text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lifted animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-emergency flex items-center justify-center flex-shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base">
                Immediate Clinical Danger Sign Detected
              </h4>
              <p className="text-xs text-red-100">
                {hasSelfHarmRisk
                  ? 'Urgent perinatal crisis flag recorded. Free confidential support is available 24/7.'
                  : 'Emergency symptoms (heavy acute blood loss, fainting, or severe pelvic pain) require immediate care.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(hasSelfHarmRisk ? '/crisis-support' : '/emergency')}
              className="bg-white text-emergency-dark hover:bg-red-50 font-bold border-none shadow-md"
              icon={<PhoneCall className="w-4 h-4" />}
            >
              {hasSelfHarmRisk ? 'Support Helpline (14416)' : 'Open Emergency Screen (108)'}
            </Button>
          </div>
        </div>
      )}

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

        {/* Quick Demo Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-subtle mr-1">Demo Scenarios:</span>
          <button
            type="button"
            onClick={load90SecondDemo}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-plum-soft text-plum hover:bg-plum hover:text-white transition-colors border border-plum/20"
            title="Pre-fills heavy flow PBAC (134 pts) and Hb 9.8 g/dL for the 90-second demo"
          >
            90s Hackathon Demo
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
            title="Triggers emergency soaking & fainting warning signs"
          >
            Emergency Sign
          </button>
          <button
            type="button"
            onClick={resetAllInputs}
            className="text-xs px-2.5 py-1.5 text-ink-subtle hover:text-ink underline"
          >
            Reset
          </button>
        </div>
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

        {activeTab === 'pain' && (
          <BodyPainPainter
            symptoms={inputs.symptoms || {}}
            onChange={(symptoms) => updateInputs({ symptoms })}
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
          onClick={evaluateAssessment}
          className="w-full sm:w-auto shadow-lifted hover:scale-[1.01]"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Evaluate Results in Health Compass
        </Button>
      </div>
    </div>
  );
};
