/**
 * SthreeCare - History & Care Thread Screen
 * Owner: Person B (Stages 8-9)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { CareThreadTimeline } from './CareThreadTimeline';
import { ResultDetail } from './ResultDetail';
import { CompareView } from './CompareView';
import { DoctorSummarySheet } from '../summary/DoctorSummarySheet';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { Activity, Sparkles, FileText, ArrowRight } from '../../design/ui/Icon';
import { getAllResultsFromDb } from '../../db/historyRepo';
import { getAllFollowUpsFromDb } from '../../db/followUpRepo';
import type { Result, FollowUp } from '@sthreecare/shared';
import { seedDemoPersonaIfEmpty } from '../../lib/seedDemo';
import { useUiStore } from '../../state/uiStore';

export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { history, profile } = useAppStore();
  const { showToast } = useUiStore();

  const [dbResults, setDbResults] = useState<Result[]>(history);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'compare'>('timeline');

  const loadData = async () => {
    const [resList, folList] = await Promise.all([
      getAllResultsFromDb(),
      getAllFollowUpsFromDb(),
    ]);
    setDbResults(resList.length > 0 ? resList : history);
    setFollowUps(folList);
  };

  useEffect(() => {
    loadData();
  }, [history]);

  const handleSelectResult = (res: Result) => {
    setSelectedResult(res);
    setIsDetailOpen(true);
  };

  const handleOpenDoctorSummary = (res: Result) => {
    setSelectedResult(res);
    setIsDoctorSummaryOpen(true);
  };

  const handleSeedDemo = async () => {
    await seedDemoPersonaIfEmpty();
    await loadData();
    showToast({
      type: 'success',
      title: 'Demo Persona Seeded',
      message: 'Populated 3 prior menstrual cycles & anaemia tests.',
    });
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-plum bg-plum-soft px-2.5 py-0.5 rounded-full border border-plum/20">
              Stages 8 & 9 • Care Thread
            </span>
            <span className="text-xs text-ink-subtle">
              On-Device Longitudinal Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
            Your Care Thread Timeline
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            An unbroken thread connecting every check, clinical flag, and follow-up consultation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {dbResults.length >= 2 && (
            <div className="flex bg-cream p-1 rounded-xl border border-plum-soft">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-plum text-white shadow-soft'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  viewMode === 'compare'
                    ? 'bg-plum text-white shadow-soft'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Compare Cycles
              </button>
            </div>
          )}

          {dbResults.length === 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSeedDemo}
              icon={<Sparkles className="w-3.5 h-3.5 text-plum" />}
              className="text-xs"
            >
              Load Demo Persona
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assess')}
            icon={<Activity className="w-4 h-4" />}
          >
            Start Check
          </Button>
        </div>
      </div>

      {/* Main Content: Timeline or Compare View */}
      {viewMode === 'compare' ? (
        <CompareView results={dbResults} />
      ) : (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft">
          <CareThreadTimeline
            results={dbResults}
            followUps={followUps}
            onSelectResult={handleSelectResult}
            onSelectFollowUp={() => navigate('/follow-up')}
          />
        </Card>
      )}

      {/* Detail Viewer Sheet */}
      <ResultDetail
        result={selectedResult}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenDoctorSummary={handleOpenDoctorSummary}
      />

      {/* Doctor Summary Sheet with QR Code */}
      {selectedResult && (
        <DoctorSummarySheet
          isOpen={isDoctorSummaryOpen}
          onClose={() => setIsDoctorSummaryOpen(false)}
          result={selectedResult}
          profile={profile}
        />
      )}
    </div>
  );
};
