/**
 * SthreeCare - Today Card
 * Owner: Person B (Stage 4)
 * 
 * Signature feature: "One next best step instead of a wall of widgets"
 * Focuses cognitive load on the single most helpful health action.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Calendar, ArrowRight, CheckCircle, Sparkles, AlertTriangle } from '../../design/ui/Icon';
import type { Result, FollowUp } from '@sthreecare/shared';

interface TodayCardProps {
  latestResult: Result | null;
  pendingFollowUp: FollowUp | null;
  onMarkFollowUpDone?: (id: string) => void;
}

export const TodayCard: React.FC<TodayCardProps> = ({
  latestResult,
  pendingFollowUp,
  onMarkFollowUpDone,
}) => {
  const navigate = useNavigate();

  // If there's an active follow-up recommended by the doctor/engine
  if (pendingFollowUp && pendingFollowUp.status === 'open') {
    return (
      <Card variant="plumSoft" padding="lg" className="border-2 border-plum/30 shadow-soft relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-plum/5 rounded-bl-full pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-plum text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today’s Recommended Step</span>
            </span>
            {pendingFollowUp.dueDate && (
              <span className="text-xs text-ink-subtle flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Target: {pendingFollowUp.dueDate}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-heading font-bold text-ink">
              {pendingFollowUp.step}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Based on your screening findings, finishing this step closes the loop. Verified community volunteers can assist with hospital navigation or translation if needed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/find-care')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Find Listed Clinics
            </Button>

            <Button
              variant="teal"
              size="sm"
              onClick={() => navigate('/support')}
            >
              Request Free Volunteer Help
            </Button>

            {onMarkFollowUpDone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkFollowUpDone(pendingFollowUp.id)}
                icon={<CheckCircle className="w-4 h-4 text-teal" />}
                className="text-xs"
              >
                Mark Done
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // If there's a recent result with an urgent or discuss flag
  const topFlag = latestResult?.flags?.[0];
  if (topFlag) {
    return (
      <Card variant="coral" padding="lg" className="border border-coral/30 shadow-soft">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-coral text-white">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Active Health Priority</span>
            </span>
            <span className="text-xs text-ink-subtle">
              Rule: {topFlag.ruleId}
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-ink">
              {topFlag.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              {topFlag.nextStep}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/result')}
            >
              Review Doctor Discussion Script
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/support')}
            >
              Ask Volunteer For Booking Help
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default state: Prompt next periodic health check
  return (
    <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-soft text-teal border border-teal/20">
            ✓ Records Up to Date
          </span>
          <span className="text-xs text-ink-subtle">All checks stored on-device</span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-heading font-bold text-ink">
            Ready for your monthly wellness check?
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
            Record your menstrual bleeding chart (PBAC), latest haemoglobin report, or mood check to track your health progress across life stages.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assess')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start Check Now
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/history')}
          >
            Open Care Thread Timeline
          </Button>
        </div>
      </div>
    </Card>
  );
};
