/**
 * SthreeCare - Care Thread Timeline
 * Owner: Person B (Stage 9)
 * 
 * Signature Visual Design Element:
 * One unbroken plum thread connects onboarding, screening checks,
 * clinical flags, appointment bookings, and follow-up closure.
 * Open items pulse gently to invite resolution without anxiety.
 */

import React from 'react';
import type { Result, FollowUp } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Activity, AlertTriangle, CheckCircle, Clock, ChevronRight, FileText } from '../../design/ui/Icon';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'check' | 'flag' | 'follow_up';
  title: string;
  subtitle: string;
  status?: string;
  isUrgent?: boolean;
  scoreDisplay?: string;
  rawResult?: Result;
  followUpId?: string;
}

interface CareThreadTimelineProps {
  results: Result[];
  followUps?: FollowUp[];
  onSelectResult: (result: Result) => void;
  onSelectFollowUp?: (followUpId: string) => void;
}

export const CareThreadTimeline: React.FC<CareThreadTimelineProps> = ({
  results,
  followUps = [],
  onSelectResult,
  onSelectFollowUp,
}) => {
  // Aggregate results and follow-ups into chronological events
  const events: TimelineEvent[] = [];

  results.forEach((res) => {
    // 1. Assessment node
    const pbac = res.scores?.['pbac'];
    const hb = res.scores?.['hb'];
    const epds = res.scores?.['epds'];

    const scoresList: string[] = [];
    if (typeof pbac === 'number') scoresList.push(`PBAC: ${pbac}`);
    if (typeof hb === 'number') scoresList.push(`Hb: ${hb} g/dL`);
    if (typeof epds === 'number') scoresList.push(`EPDS: ${epds}`);

    events.push({
      id: `check_${res.id}`,
      date: res.date,
      type: 'check',
      title: `${res.stage ? res.stage.toUpperCase() : 'HEALTH'} Assessment Completed`,
      subtitle: scoresList.join(' • ') || 'Routine wellness screening',
      scoreDisplay: scoresList[0],
      rawResult: res,
    });

    // 2. Triggered Flags
    if (res.flags && res.flags.length > 0) {
      res.flags.forEach((f) => {
        events.push({
          id: `flag_${f.id}`,
          date: res.date,
          type: 'flag',
          title: f.title,
          subtitle: `Recommended: ${f.nextStep}`,
          isUrgent: f.level === 'urgent',
          rawResult: res,
        });
      });
    }
  });

  // 3. Follow-up action nodes
  followUps.forEach((fol) => {
    events.push({
      id: `fol_${fol.id}`,
      date: fol.dueDate || new Date().toISOString().split('T')[0],
      type: 'follow_up',
      title: fol.step,
      subtitle: `Status: ${fol.status.toUpperCase()} • Loop Action Item`,
      status: fol.status,
      followUpId: fol.id,
    });
  });

  // Sort descending by date
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (events.length === 0) {
    return (
      <Card variant="default" padding="lg" className="text-center py-12 border border-plum-soft">
        <div className="w-12 h-12 rounded-full bg-plum-soft flex items-center justify-center mx-auto text-plum mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-semibold text-base text-ink">
          Your Care Thread is Ready
        </h3>
        <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
          As you record menstrual cycles, blood test values, or volunteer appointments, each event is threaded into a continuous on-device timeline.
        </p>
      </Card>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 py-2">
      {/* The Signature Continuous Plum Care Thread */}
      <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-teal via-teal to-teal rounded-full" />

      <div className="space-y-6">
        {events.map((evt) => {
          const isCheck = evt.type === 'check';
          const isFlag = evt.type === 'flag';
          const isFollowUp = evt.type === 'follow_up';
          const isOpenFollowUp = isFollowUp && evt.status === 'open';

          return (
            <div key={evt.id} className="relative group">
              {/* Thread Node / Pip */}
              <div
                className={`absolute -left-[19px] sm:-left-[23px] top-3.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-cream transition-transform group-hover:scale-110 ${
                  isFlag
                    ? evt.isUrgent
                      ? 'bg-emergency text-white'
                      : 'bg-coral text-white'
                    : isCheck
                    ? 'bg-plum text-white shadow-soft'
                    : isOpenFollowUp
                    ? 'bg-amber text-white animate-pulse'
                    : 'bg-teal text-white'
                }`}
              >
                {isFlag ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : isCheck ? (
                  <Activity className="w-3.5 h-3.5" />
                ) : isOpenFollowUp ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Event Card */}
              <div
                onClick={() => {
                  if (evt.rawResult) onSelectResult(evt.rawResult);
                  else if (evt.followUpId && onSelectFollowUp) onSelectFollowUp(evt.followUpId);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isFlag
                    ? 'bg-coral-soft/50 border-coral/30 hover:border-coral'
                    : isCheck
                    ? 'bg-white border-plum-soft hover:border-plum hover:shadow-soft'
                    : isOpenFollowUp
                    ? 'bg-amber-soft/50 border-amber/30 hover:border-amber'
                    : 'bg-teal-soft/40 border-teal/30 hover:border-teal'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
                      {evt.date}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFlag
                          ? evt.isUrgent
                            ? 'bg-emergency text-white'
                            : 'bg-coral text-white'
                          : isCheck
                          ? 'bg-plum-soft text-plum'
                          : 'bg-teal-soft text-teal'
                      }`}
                    >
                      {isFlag ? 'Screening Flag' : isCheck ? 'On-Device Check' : 'Care Step'}
                    </span>
                  </div>

                  {evt.rawResult && (
                    <span className="text-xs text-plum font-semibold inline-flex items-center gap-0.5">
                      <span>View Doctor Summary</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h4 className="font-heading font-semibold text-sm sm:text-base text-ink mt-1">
                  {evt.title}
                </h4>

                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  {evt.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
