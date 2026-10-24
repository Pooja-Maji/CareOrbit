/**
 * SthreeCare - Dashboard Screen
 * Owner: Person B (Stage 4)
 * 
 * Today card, trend sparklines, stage summary, Care Thread summary,
 * backup and storage privacy notice.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { TodayCard } from './TodayCard';
import { TrendStrip } from './TrendStrip';
import { StageSummary } from './StageSummary';
import { BackupPrompt } from './BackupPrompt';
import { StorageNotice } from './StorageNotice';
import { Button } from '../../design/ui/Button';
import { Activity, Sparkles, Calendar, ArrowRight, Shield, Heart } from '../../design/ui/Icon';
import { getAllResultsFromDb } from '../../db/historyRepo';
import { getAllFollowUpsFromDb, updateFollowUpStatus } from '../../db/followUpRepo';
import type { ExtendedFollowUp } from '../../db/schema';
import type { Result } from '@sthreecare/shared';
import { seedDemoPersonaIfEmpty } from '../../lib/seedDemo';
import { useUiStore } from '../../state/uiStore';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, result, history, saveResultToHistory } = useAppStore();
  const { showToast } = useUiStore();

  const [dbResults, setDbResults] = useState<Result[]>(history);
  const [followUps, setFollowUps] = useState<ExtendedFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resList, folList] = await Promise.all([
        getAllResultsFromDb(),
        getAllFollowUpsFromDb(),
      ]);
      setDbResults(resList.length > 0 ? resList : history);
      setFollowUps(folList);
    } catch (e) {
      console.warn('Error loading dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [history]);

  const handleSeedDemo = async () => {
    await seedDemoPersonaIfEmpty();
    await loadData();
    showToast({
      type: 'success',
      title: 'Demo Persona Loaded',
      message: 'Populated 3-cycle PBAC trend and lab Hb 9.8 g/dL for review.',
    });
    // reload state
    setTimeout(() => window.location.reload(), 600);
  };

  const handleMarkFollowUpDone = async (id: string) => {
    await updateFollowUpStatus(id, 'done');
    await loadData();
    showToast({
      type: 'success',
      title: 'Action Completed',
      message: 'Follow-up marked done on your Care Thread.',
    });
  };

  const latestResult = dbResults[0] || result || null;
  const activeFollowUp = followUps.find((f) => f.status === 'open') || null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Top Header / Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-plum bg-plum-soft px-2.5 py-0.5 rounded-full border border-plum/20">
              Stage 4 • Life-Stage Compass
            </span>
            <span className="text-xs text-ink-subtle">
              Private on-device health record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
            Personal Health Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Tracking your health trajectory for life stage: <strong className="text-plum capitalize">{profile.lifeStage}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
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
            size="md"
            onClick={() => navigate('/assess')}
            icon={<Activity className="w-4 h-4" />}
            className="shadow-soft"
          >
            Start Check
          </Button>
        </div>
      </div>

      {/* 1. Today Card: One next best step */}
      <TodayCard
        latestResult={latestResult}
        pendingFollowUp={activeFollowUp}
        onMarkFollowUpDone={handleMarkFollowUpDone}
      />

      {/* 2. Longitudinal Trend Sparklines (PBAC & Hb) */}
      <TrendStrip
        history={dbResults}
        isPregnant={profile.isPregnant}
      />

      {/* 3. Life-Stage Preventive Screening Schedule */}
      <StageSummary profile={profile} />

      {/* Quick Navigation to Person B Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="p-4 rounded-card bg-white border border-plum-soft hover:border-plum hover:shadow-soft transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-plum-soft flex items-center justify-center text-plum group-hover:scale-105 transition-transform flex-shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-ink group-hover:text-plum transition-colors">
              Care Thread Timeline
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              {dbResults.length} recorded checks & flag logs
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/find-care')}
          className="p-4 rounded-card bg-white border border-plum-soft hover:border-teal hover:shadow-soft transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-teal-soft flex items-center justify-center text-teal group-hover:scale-105 transition-transform flex-shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-ink group-hover:text-teal transition-colors">
              Find Listed Care
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              PHCs, labs & teleconsultations
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/time-bank')}
          className="p-4 rounded-card bg-white border border-plum-soft hover:border-teal hover:shadow-soft transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-teal-soft flex items-center justify-center text-teal group-hover:scale-105 transition-transform flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-ink group-hover:text-teal transition-colors">
              Healthcare Time Bank
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Verified volunteer support & credits
            </p>
          </div>
        </button>
      </div>

      {/* 4. On-Device Backup & Export Prompt */}
      <BackupPrompt />

      {/* 5. Storage Persistence & Zero Cloud Notice */}
      <StorageNotice />
    </div>
  );
};
