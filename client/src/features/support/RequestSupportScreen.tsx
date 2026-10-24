/**
 * SthreeCare - Request Support & Volunteer Companion Screen
 * Owner: Person B (Stage 11)
 * 
 * Enables practical community assistance without compromising health privacy.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TaskStepper } from './TaskStepper';
import { VolunteerMatchCard } from './VolunteerMatchCard';
import { createSupportRequest, getUserSupportRequests, updateSupportTaskStatus } from '../../api/supportApi';
import type { SupportTask, SupportTaskType, SupportTaskStatus } from '@sthreecare/shared';
import { sessionStore } from '../../state/sessionStore';
import { useUiStore } from '../../state/uiStore';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Shield, Sparkles, CheckCircle, ArrowRight, Clock } from '../../design/ui/Icon';

export const RequestSupportScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useUiStore();

  const stateContext = (location.state as any) || {};
  const [taskType, setTaskType] = useState<SupportTaskType>(stateContext.taskType || 'navigation');
  const [language, setLanguage] = useState<string>('Kannada');
  const [logisticsNotes, setLogisticsNotes] = useState<string>(
    stateContext.facilityName ? `Appointment navigation at ${stateContext.facilityName}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTask, setActiveTask] = useState<SupportTask | null>(null);

  const anonRef = sessionStore.getAnonymousRef();

  useEffect(() => {
    getUserSupportRequests(anonRef).then((tasks) => {
      if (tasks.length > 0) {
        setActiveTask(tasks[0]);
      }
    });
  }, [anonRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const task = await createSupportRequest({
        type: taskType,
        anonymousRef: anonRef,
        preferredLanguage: language,
        notes: logisticsNotes || 'Hospital navigation and counter assistance',
        hours: 1.5,
      });

      setActiveTask(task);
      showToast({
        type: 'success',
        title: 'Volunteer Match Found',
        message: 'A verified community healthcare volunteer has been paired with your request.',
      });
    } catch (e: any) {
      showToast({
        type: 'error',
        title: 'Request Failed',
        message: e.message || 'Unable to connect to volunteer service.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (nextStatus: SupportTaskStatus) => {
    if (!activeTask) return;
    const updated = await updateSupportTaskStatus(activeTask.id, nextStatus);
    if (updated) {
      setActiveTask(updated);
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `Task advanced to "${nextStatus.replace('_', ' ')}".`,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal bg-teal-soft px-2.5 py-0.5 rounded-full border border-teal/20">
              Stage 11 • Practical Assistance
            </span>
            <span className="text-xs text-ink-subtle">
              Healthcare Time Bank
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink mt-1">
            Request Volunteer Help
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Overcome practical barriers like hospital queues, OPD registration, or language translation with a verified companion.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/time-bank')}
          className="text-xs self-start sm:self-center"
        >
          View Time Bank Credits
        </Button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-xl bg-teal-soft/40 border border-teal/30 flex items-start gap-3">
        <Shield className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
        <div className="text-xs text-ink space-y-1">
          <p className="font-bold text-teal-dark">
            Zero Health Data Shared With Volunteers
          </p>
          <p className="text-ink-muted leading-relaxed">
            Your medical records and screening scores NEVER leave your device. The volunteer only receives logistics info (meeting point, time, and language) under your anonymous ID: <code className="bg-white/80 px-1.5 py-0.5 rounded text-plum font-mono">{anonRef}</code>.
          </p>
        </div>
      </div>

      {/* If there is an active task in progress */}
      {activeTask ? (
        <div className="space-y-6">
          <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-plum-soft pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-plum">
                  Active Support Task: #{activeTask.id}
                </span>
                <h3 className="font-heading font-bold text-lg text-ink capitalize">
                  {activeTask.type} Assistance
                </h3>
              </div>
              <span className="text-xs text-ink-subtle">
                Target: 1.5 hrs
              </span>
            </div>

            {/* Stepper along the thread */}
            <TaskStepper
              currentStatus={activeTask.status}
              onAdvanceStatus={handleAdvanceStatus}
            />

            {/* Volunteer Profile */}
            {activeTask.volunteer && (
              <VolunteerMatchCard
                volunteer={activeTask.volunteer}
                taskType={activeTask.type}
              />
            )}

            {/* Completion trigger */}
            {activeTask.status === 'verified' && (
              <div className="p-4 rounded-xl bg-teal-soft border border-teal/30 text-center space-y-2">
                <p className="text-sm font-semibold text-teal">
                  ✓ Task Completed & Verified!
                </p>
                <p className="text-xs text-ink-muted">
                  Volunteer received 1.5 Time Bank credits. You closed a vital care loop.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/follow-up')}
                >
                  Return to Follow-Up Tracker
                </Button>
              </div>
            )}
          </Card>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setActiveTask(null)}
              className="text-xs text-ink-subtle hover:text-ink underline"
            >
              Submit another volunteer request
            </button>
          </div>
        </div>
      ) : (
        /* Request Form */
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink block">
                What practical assistance do you need?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    type: 'navigation' as const,
                    title: 'Hospital & Clinic Navigation',
                    desc: 'Companion helps locate the gynaecology OPD, blood collection lab, or pharmacy inside the hospital.',
                  },
                  {
                    type: 'booking' as const,
                    title: 'Appointment & Slot Booking',
                    desc: 'Assistance registering for specialist consultation or government ultrasound slots.',
                  },
                  {
                    type: 'language' as const,
                    title: 'Language Translation',
                    desc: 'Kannada, Tulu, Hindi, or English interpretation during hospital registration counters.',
                  },
                  {
                    type: 'accompaniment' as const,
                    title: 'Hospital Accompaniment',
                    desc: 'Friendly community volunteer to travel or wait with you during long hospital queues.',
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setTaskType(item.type)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      taskType === item.type
                        ? 'border-plum bg-plum-soft/40 shadow-soft'
                        : 'border-plum-soft/60 bg-cream/40 hover:border-plum/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-semibold text-sm text-ink">
                        {item.title}
                      </h4>
                      <input
                        type="radio"
                        name="taskType"
                        checked={taskType === item.type}
                        onChange={() => setTaskType(item.type)}
                        className="text-plum"
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink block">
                Preferred Companion Language
              </label>
              <div className="flex flex-wrap gap-2">
                {['Kannada', 'Tulu', 'Hindi', 'English'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      language === lang
                        ? 'bg-plum text-white border-plum shadow-soft'
                        : 'bg-white text-ink border-plum-soft hover:bg-plum-soft/30'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Non-Medical Logistics Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink block">
                Meeting Details / Logistics Notes (Non-Medical Only)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Meet near Surathkal PHC OPD entrance at 10:00 AM on Thursday..."
                value={logisticsNotes}
                onChange={(e) => setLogisticsNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-plum-soft text-xs text-ink focus:outline-none focus:ring-2 focus:ring-plum"
              />
              <p className="text-[11px] text-ink-subtle">
                Do not include clinical symptoms, bleeding details, or personal addresses.
              </p>
            </div>

            <Button
              type="submit"
              variant="teal"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {isSubmitting ? 'Matching Local Volunteer...' : 'Dispatch Request (Time Bank)'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
