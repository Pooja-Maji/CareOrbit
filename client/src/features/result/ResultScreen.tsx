import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import type { Flag } from '@sthreecare/shared';
import { ThresholdGauge } from './ThresholdGauge';
import { FlagCard } from './FlagCard';
import { WhyDrawer } from './WhyDrawer';
import { DoctorScriptCard } from './DoctorScriptCard';
import { SelfCareCard } from './SelfCareCard';
import { DoctorSummarySheet } from '../summary/DoctorSummarySheet';
import { PdfReportButton } from '../summary/ReportPdf';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { PageHeader } from '../../design/ui/PageHeader';
import {
  HeartPulse,
  Stethoscope,
  ClipboardList,
  CheckCircle,
  MapPin,
  HandHeart,
  Clock,
  ArrowUpRight,
  Heart,
  FileText,
  ArrowRight,
} from '../../design/ui/Icon';
import { saveResultToDb } from '../../db/historyRepo';
import { addFollowUpFromFlag } from '../../db/followUpRepo';

const NEXT = [
  { to: '/find-care', label: 'Find a clinic', icon: MapPin, tone: 'bg-teal-soft text-teal' },
  { to: '/support', label: 'Get a volunteer', icon: HandHeart, tone: 'bg-coral-soft text-coral-dark' },
  { to: '/history', label: 'See timeline', icon: Clock, tone: 'bg-plum-soft text-plum' },
];

export const ResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { result, profile } = useAppStore();

  const [whyFlag, setWhyFlag] = useState<Flag | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-plum-soft flex items-center justify-center mx-auto text-plum animate-float">
          <ClipboardList className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-ink">No results yet</h2>
        <Button variant="primary" size="lg" onClick={() => navigate('/assess')} icon={<ClipboardList className="w-5 h-5" />}>
          Start a health check
        </Button>
      </div>
    );
  }

  const pbac = result.scores['pbac'];
  const hb = result.scores['hb'];
  const epds = result.scores['epds'];

  const hasPerinatalMoodFlag = result.flags.some((f) => f.ruleId.startsWith('epds_'));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<HeartPulse className="w-7 h-7" />}
        title="Your Results"
        subtitle={`Saved on this device · ${result.stage}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/print-summary')}
              icon={<FileText className="w-4 h-4" />}
            >
              Print Dossier
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSheetOpen(true)}
              icon={<Stethoscope className="w-4 h-4" />}
            >
              Doctor summary
            </Button>
            <PdfReportButton result={result} profile={profile} label="Download PDF" />
          </div>
        }
      />

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

      {/* Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {typeof pbac === 'number' && (
          <ThresholdGauge title="Period flow" score={pbac} threshold={100} source="PBAC (Higham 1990)" unit="pts" />
        )}
        {typeof hb === 'number' && (
          <ThresholdGauge title="Haemoglobin" score={hb} threshold={profile.isPregnant ? 11.0 : 12.0} maxScore={18} source="WHO Guidelines" unit="g/dL" lowIsConcern />
        )}
        {typeof epds === 'number' && (
          <ThresholdGauge title="Mood" score={epds} threshold={13} maxScore={30} source="EPDS" unit="/ 30" />
        )}
      </div>

      {/* Flags (left) · Script + self-care (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <section className="xl:col-span-7 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-ink">
            Flags
            <span className="px-2 py-0.5 rounded-full bg-plum text-white text-xs font-bold">{result.flags.length}</span>
          </h2>
          {result.flags.length === 0 ? (
            <div className="flex items-center gap-4 p-6 rounded-card bg-teal-soft border border-teal/20 animate-pop-in">
              <span className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </span>
              <div>
                <p className="font-heading font-bold text-ink">All clear</p>
                <p className="text-sm text-ink-muted">Everything is in range.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 stagger">
              {result.flags.map((flag) => (
                <FlagCard
                  key={flag.id}
                  flag={flag}
                  onOpenWhy={(f) => {
                    setWhyFlag(f);
                    setWhyOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="xl:col-span-5 space-y-6">
          <DoctorScriptCard result={result} />
          <SelfCareCard />
        </section>
      </div>

      {/* What next */}
      <div className="space-y-3">
        <h2 className="text-lg font-heading font-semibold text-ink">What next?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
          {NEXT.map((n) => (
            <button
              key={n.to}
              type="button"
              onClick={() => navigate(n.to)}
              className="tile flex items-center justify-between p-4 rounded-card bg-white border border-plum-soft shadow-soft"
            >
              <span className="flex items-center gap-3 font-semibold text-ink">
                <span className={`tile-icon w-11 h-11 rounded-xl flex items-center justify-center ${n.tone}`}>
                  <n.icon className="w-5 h-5" />
                </span>
                {n.label}
              </span>
              <ArrowUpRight className="w-5 h-5 text-ink-subtle" />
            </button>
          ))}
        </div>
      </div>

      <WhyDrawer flag={whyFlag} isOpen={whyOpen} onClose={() => setWhyOpen(false)} />
      <DoctorSummarySheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} result={result} profile={profile} />
    </div>
  );
};
