/**
 * SthreeCare - Dashboard (Home)
 * Hero → quick actions → today / trends / stage → tips.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { TodayCard } from './TodayCard';
import { TrendStrip } from './TrendStrip';
import { StageSummary } from './StageSummary';
import { BackupPrompt } from './BackupPrompt';
import { StorageNotice } from './StorageNotice';
import { TipFlashcards } from './TipFlashcards';
import { Button } from '../../design/ui/Button';
import { ClipboardList, FileText, AlertTriangle, CalendarCheck, Sparkles } from '../../design/ui/Icon';
import { getAllResultsFromDb } from '../../db/historyRepo';
import { getAllFollowUpsFromDb, updateFollowUpStatus } from '../../db/followUpRepo';
import type { ExtendedFollowUp } from '../../db/schema';
import type { Result } from '@sthreecare/shared';
import { useUiStore } from '../../state/uiStore';
import { COPY } from '../../copy';

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, result, history } = useAppStore();
  const { showToast } = useUiStore();

  const [dbResults, setDbResults] = useState<Result[]>(history);
  const [followUps, setFollowUps] = useState<ExtendedFollowUp[]>([]);

  const loadData = async () => {
    try {
      const [resList, folList] = await Promise.all([getAllResultsFromDb(), getAllFollowUpsFromDb()]);
      setDbResults(resList.length > 0 ? resList : history);
      setFollowUps(folList);
    } catch (e) {
      console.warn('Error loading dashboard data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [history]);

  const handleMarkFollowUpDone = async (id: string) => {
    await updateFollowUpStatus(id, 'done');
    await loadData();
    showToast({ type: 'success', title: 'Done', message: 'Follow-up marked complete.' });
  };

  const latestResult = dbResults[0] || result || null;
  const openFollowUps = followUps.filter((f) => f.status === 'open');
  const activeFollowUp = openFollowUps[0] || null;
  const name = profile.name || 'there';
  const stage = COPY.lifeStages[profile.lifeStage]?.label || profile.lifeStage;
  const flagCount = latestResult?.flags?.length ?? 0;

  const stats = [
    { icon: FileText, label: 'Reports', value: dbResults.length, to: '/profile' },
    { icon: AlertTriangle, label: 'Flags', value: flagCount, to: '/result' },
    { icon: CalendarCheck, label: 'To do', value: openFollowUps.length, to: '/follow-up' },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden rounded-[28px] text-white p-6 sm:p-8 lg:p-10 shadow-lifted">
        <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full border-[3px] border-[#2E1065]/60" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22D3EE] text-[#1E0B4D] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {stage}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">Hi, {name} 👋</h1>
            <div className="flex flex-wrap gap-3 pt-1">
              {stats.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => navigate(s.to)}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/12 backdrop-blur border border-white/15 hover:bg-white/20 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                  <span className="text-2xl font-heading font-bold leading-none">{s.value}</span>
                  <span className="text-xs text-white/80">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/assess')}
            icon={<ClipboardList className="w-5 h-5" />}
            className="shine !bg-[#fff] !text-[#2E1065] hover:!bg-[#fff] hover:scale-105 shadow-lifted"
          >
            Start health check
          </Button>
        </div>
      </section>

      {/* Moving flashcards: right under the banner so they are seen first */}
      <TipFlashcards />

      {/* MAIN GRID — fills the width */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <TodayCard latestResult={latestResult} pendingFollowUp={activeFollowUp} onMarkFollowUpDone={handleMarkFollowUpDone} />
          <TrendStrip history={dbResults} isPregnant={profile.isPregnant} />
        </div>
        <div className="xl:col-span-5 space-y-6">
          <StageSummary profile={profile} />
          <BackupPrompt />
          <StorageNotice />
        </div>
      </div>

    </div>
  );
};
