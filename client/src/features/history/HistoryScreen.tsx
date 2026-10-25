/**
 * SthreeCare - History & Care Thread Screen
 * Owner: Person B (Stages 8-9)
 */

import { PageHeader } from '../../design/ui/PageHeader';
import { Clock as HdrIcon } from '../../design/ui/Icon';
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
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader icon={<HdrIcon className="w-7 h-7" />} title="Care Timeline" subtitle="Every check, in one thread" tone="coral" actions={<>
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
                Compare
              </button>
            </div>
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
      </>} />

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
