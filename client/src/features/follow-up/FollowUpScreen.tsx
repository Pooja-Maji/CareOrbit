/**
 * SthreeCare - Follow-Up & Care Gap Resolution Screen
 * Owner: Person B (Stage 12)
 * 
 * Closes the healthcare loop: tracks clinician-recommended next steps,
 * provides gentle care-gap nudges, and returns back to the dashboard.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareGapNudge } from './CareGapNudge';
import { downloadCalendarEvent } from './ReminderScheduler';
import { getAllFollowUpsFromDb, updateFollowUpStatus } from '../../db/followUpRepo';
import type { ExtendedFollowUp } from '../../db/schema';
import type { FollowUpStatus } from '@sthreecare/shared';
import { useUiStore } from '../../state/uiStore';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { CheckCircle, Clock, Calendar, ArrowRight, Sparkles, Heart } from '../../design/ui/Icon';

export const FollowUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUiStore();
  const [followUps, setFollowUps] = useState<ExtendedFollowUp[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('open');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const list = await getAllFollowUpsFromDb();
      setFollowUps(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: FollowUpStatus) => {
    await updateFollowUpStatus(id, status);
    await loadData();
    showToast({
      type: 'success',
      title: 'Status Updated',
      message: `Action item marked as ${status}.`,
    });
  };

  const handleCalendarDownload = (item: ExtendedFollowUp) => {
    downloadCalendarEvent({
      title: item.step,
      description: 'SthreeCare health follow-up consultation / test appointment',
      startDate: item.dueDate || new Date().toISOString().split('T')[0],
    });
    showToast({
      type: 'info',
      title: 'Calendar Reminder Saved',
      message: 'Downloaded calendar invite to your phone/computer.',
    });
  };

  const filtered = followUps.filter((f) => {
    if (filter === 'open') return f.status === 'open' || f.status === 'booked';
    if (filter === 'done') return f.status === 'done';
    return true;
  });

  const nudgeTarget = followUps.find((f) => f.status === 'open');

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-plum bg-plum-soft px-2.5 py-0.5 rounded-full border border-plum/20">
              Stage 12 • Continuity of Care
            </span>
            <span className="text-xs text-ink-subtle">
              Closing the Loop
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
            Follow-Up Action Tracker
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Track clinician recommendations, lab tests, and ultrasound referrals recommended by the Compass engine.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-xs self-start sm:self-center"
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Gentle Care Gap Nudge */}
      {nudgeTarget && (
        <CareGapNudge
          followUp={nudgeTarget}
          onYesNeedHelp={() => navigate('/support')}
          onRemindLater={() => handleStatusChange(nudgeTarget.id, 'later')}
          onMarkDone={() => handleStatusChange(nudgeTarget.id, 'done')}
        />
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-cream p-1 rounded-xl border border-plum-soft">
          {[
            { id: 'open', label: 'Active Items' },
            { id: 'done', label: 'Completed' },
            { id: 'all', label: 'All History' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === tab.id
                  ? 'bg-plum text-white shadow-soft'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-ink-subtle">
          {filtered.length} follow-up actions
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card variant="default" padding="lg" className="text-center py-10 border border-plum-soft">
            <p className="text-sm font-semibold text-ink">No items in this view.</p>
            <p className="text-xs text-ink-muted mt-1">
              Complete a health assessment to generate personalized next steps.
            </p>
          </Card>
        ) : (
          filtered.map((item) => {
            const isDone = item.status === 'done';
            const isBooked = item.status === 'booked';

            return (
              <Card
                key={item.id}
                variant="default"
                padding="md"
                className={`border transition-all ${
                  isDone
                    ? 'bg-teal-soft/20 border-teal/20 opacity-80'
                    : isBooked
                    ? 'border-plum/40 bg-white shadow-soft'
                    : 'border-plum-soft/70 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-teal-soft text-teal'
                            : isBooked
                            ? 'bg-plum-soft text-plum'
                            : 'bg-amber-soft text-amber-dark'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.dueDate && (
                        <span className="text-[11px] text-ink-subtle flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Target: {item.dueDate}
                        </span>
                      )}
                    </div>
                    <h4 className={`font-heading font-semibold text-sm sm:text-base text-ink ${isDone ? 'line-through text-ink-muted' : ''}`}>
                      {item.step}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!isDone && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCalendarDownload(item)}
                          className="text-xs"
                        >
                          Add to Calendar
                        </Button>

                        <Button
                          variant="teal"
                          size="sm"
                          onClick={() => navigate('/support')}
                          className="text-xs"
                        >
                          Book Volunteer
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(item.id, 'done')}
                          icon={<CheckCircle className="w-3.5 h-3.5 text-teal" />}
                          className="text-xs"
                        >
                          Done
                        </Button>
                      </>
                    )}

                    {isDone && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'open')}
                        className="text-xs text-ink-subtle hover:text-ink underline"
                      >
                        Re-open
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
