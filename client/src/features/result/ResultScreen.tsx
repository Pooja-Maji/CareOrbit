import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import type { Flag } from '@sthreecare/shared';
import { ThresholdGauge } from './ThresholdGauge';
import { FlagCard } from './FlagCard';
import { WhyDrawer } from './WhyDrawer';
import { DoctorScriptCard } from './DoctorScriptCard';
import { SelfCareCard } from './SelfCareCard';
import { DoctorSummarySheet } from '../summary/DoctorSummarySheet';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { Shield, FileText, ArrowRight, Activity, Heart, Sparkles } from '../../design/ui/Icon';

import { saveResultToDb } from '../../db/historyRepo';
import { addFollowUpFromFlag } from '../../db/followUpRepo';

export const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { result, profile } = useAppStore();

  const [selectedFlagForWhy, setSelectedFlagForWhy] = useState<Flag | null>(null);
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [isDoctorSheetOpen, setIsDoctorSheetOpen] = useState(false);

  React.useEffect(() => {
    if (result) {
      saveResultToDb(result);
      result.flags.forEach((f) => {
        if (f.nextStep) {
          addFollowUpFromFlag(result.id, f.nextStep).catch(() => {});
        }
      });
    }
  }, [result]);

  // If no result is present yet, encourage starting an assessment
  if (!result) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-plum-soft flex items-center justify-center mx-auto text-plum">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-heading font-bold text-ink">
          No Health Assessment Run Yet
        </h2>
        <p className="text-xs text-ink-muted">
          Record your menstrual flow, haemoglobin report, or mood check to calculate your personalized Life-Stage Compass results.
        </p>
        <Button variant="primary" onClick={() => navigate('/assess')}>
          Start Assessment Now
        </Button>
      </div>
    );
  }

  const pbacScore = result.scores['pbac'];
  const hbScore = result.scores['hb'];
  const epdsScore = result.scores['epds'];

  const hasPerinatalMoodFlag = result.flags.some((f) => f.ruleId.startsWith('epds_'));

  const handleOpenWhy = (flag: Flag) => {
    setSelectedFlagForWhy(flag);
    setIsWhyDrawerOpen(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Top Header & Save Confirmation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal bg-teal-soft px-2.5 py-0.5 rounded-full border border-teal/20">
              ✓ Saved Locally on Device
            </span>
            <span className="text-xs text-ink-subtle">
              Rules v{result.rulesVersion}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
            Your Health Compass Findings
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Evaluated for <strong className="text-plum capitalize">{result.stage}</strong> life stage. These results are prepared for clinical consultation.
          </p>
        </div>

        {/* Doctor Summary Sheet & Print Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/print-summary')}
            icon={<FileText className="w-4 h-4" />}
            className="shadow-xs"
          >
            Print Dossier (A4)
          </Button>

          <Button
            variant="teal"
            size="sm"
            onClick={() => setIsDoctorSheetOpen(true)}
            icon={<Sparkles className="w-4 h-4" />}
            className="shadow-soft"
          >
            Doctor Summary & QR
          </Button>
        </div>
      </div>

      {/* Perinatal Mood / Crisis Support Banner if relevant */}
      {hasPerinatalMoodFlag && (
        <Card variant="plumSoft" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-plum/20 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-plum text-white flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-ink">
                Emotional Well-being & Counseling Guide
              </h4>
              <p className="text-xs text-ink-muted">
                Perinatal mood changes are medical, real, and treatable. Free 24/7 confidential support through Tele-MANAS (14416) and guided calming exercises.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/crisis-support')}
            icon={<ArrowRight className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            Access Support Guide
          </Button>
        </Card>
      )}

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {typeof pbacScore === 'number' && (
          <ThresholdGauge
            title="Menstrual Flow (PBAC)"
            score={pbacScore}
            threshold={100}
            source="Higham 1990"
            unit="pts"
          />
        )}

        {typeof hbScore === 'number' && (
          <ThresholdGauge
            title="Haemoglobin (Hb)"
            score={hbScore}
            threshold={profile.isPregnant ? 11.0 : 12.0}
            maxScore={18}
            source="WHO (2011)"
            unit="g/dL"
          />
        )}

        {typeof epdsScore === 'number' && (
          <ThresholdGauge
            title="Mood Screening (EPDS)"
            score={epdsScore}
            threshold={13}
            maxScore={30}
            source="Cox 1987"
            unit="/ 30"
          />
        )}
      </div>

      {/* Structured Flag Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-ink">
            Clinical Screening Flags ({result.flags.length})
          </h2>
          <span className="text-xs text-ink-subtle">
            Sorted by clinical priority
          </span>
        </div>

        {result.flags.length === 0 ? (
          <Card variant="plumSoft" padding="md" className="text-center py-8">
            <p className="text-sm font-semibold text-plum">
              No elevated clinical flags triggered
            </p>
            <p className="text-xs text-ink-muted mt-1">
              Your recorded measurements are currently within standard screening reference ranges. Continue regular preventive wellness visits.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.flags.map((flag) => (
              <FlagCard
                key={flag.id}
                flag={flag}
                onOpenWhy={handleOpenWhy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Doctor Discussion Script */}
      <DoctorScriptCard result={result} />

      {/* Safe Self-Care Guidance */}
      <SelfCareCard />

      {/* Bottom Navigation & Handoff to Person B */}
      <div className="p-6 rounded-card bg-white border border-plum-soft shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-semibold text-base text-ink">
            Need practical help completing your next step?
          </h4>
          <p className="text-xs text-ink-muted mt-0.5">
            Verified community volunteers can assist with hospital navigation, appointment booking, or language support through the Healthcare Time Bank.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-plum text-white hover:bg-plum-dark text-xs font-semibold transition-colors shadow-soft hover-lift"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>Saved in Your Profile Dossier</span>
          </Link>

          <Link
            to="/support"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-teal text-white hover:bg-teal/90 text-xs font-semibold transition-colors shadow-soft hover-lift"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Request Volunteer</span>
          </Link>

          <Link
            to="/history"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-plum-soft text-plum hover:bg-plum/10 text-xs font-semibold transition-colors hover-lift"
          >
            <span>Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* Why Modal Sheet */}
      <WhyDrawer
        flag={selectedFlagForWhy}
        isOpen={isWhyDrawerOpen}
        onClose={() => setIsWhyDrawerOpen(false)}
      />

      {/* Clinician Summary Bottom Sheet */}
      <DoctorSummarySheet
        isOpen={isDoctorSheetOpen}
        onClose={() => setIsDoctorSheetOpen(false)}
        result={result}
        profile={profile}
      />
    </div>
  );
};
