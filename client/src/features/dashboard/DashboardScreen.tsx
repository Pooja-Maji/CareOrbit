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
import { NAV_ITEMS } from '../../app/navItems';
import { COPY } from '../../copy';

const TONE: Record<string, string> = {
  plum: 'bg-plum-soft text-plum',
  teal: 'bg-teal-soft text-teal',
  coral: 'bg-coral-soft text-coral-dark',
  amber: 'bg-amber-soft text-amber-dark',
};

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

  const badge = (to: string): number | undefined =>
    to === '/profile' ? dbResults.length : to === '/follow-up' ? openFollowUps.length : undefined;

  const stats = [
    { icon: FileText, label: 'Reports', value: dbResults.length },
    { icon: AlertTriangle, label: 'Flags', value: flagCount },
    { icon: CalendarCheck, label: 'To do', value: openFollowUps.length },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden rounded-[28px] text-white p-6 sm:p-8 lg:p-10 shadow-lifted">
        <div className="absolute -top-16 -left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl animate-blob" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-[#5ee0d6]/20 blur-3xl animate-blob [animation-delay:-6s]" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {stage}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight">Hi, {name} 👋</h1>
            <div className="flex flex-wrap gap-3 pt-1">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/12 backdrop-blur border border-white/15 hover:bg-white/20 transition-colors">
                  <s.icon className="w-4 h-4" />
                  <span className="text-2xl font-heading font-bold leading-none">{s.value}</span>
                  <span className="text-xs text-white/80">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/assess')}
            icon={<ClipboardList className="w-5 h-5" />}
            className="shine !bg-white !text-plum hover:!bg-white hover:scale-105 shadow-lifted"
          >
            Start health check
          </Button>
        </div>
      </section>

      {/* QUICK ACTIONS — every feature, one tap */}
      <section className="space-y-3">
        <h2 className="text-lg font-heading font-semibold text-ink">Where to?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 stagger">
          {NAV_ITEMS.filter((n) => n.to !== '/dashboard').map((item) => {
            const count = badge(item.to);
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="tile relative text-left p-4 rounded-card bg-white border border-plum-soft/70 shadow-soft"
              >
                {count !== undefined && count > 0 && (
                  <span className="absolute top-3 right-3 min-w-6 h-6 px-1.5 rounded-full bg-plum text-white text-xs font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
                <span className={`tile-icon w-12 h-12 rounded-2xl flex items-center justify-center ${TONE[item.tone]}`}>
                  <item.icon className="w-6 h-6" />
                </span>
                <div className="mt-3 font-heading font-bold text-ink">{item.label}</div>
                <div className="text-xs text-ink-muted">{item.hint}</div>
              </button>
            );
          })}
        </div>
      </section>

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

      <TipFlashcards />
    </div>
  );
};
