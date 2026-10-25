/**
 * Care Orbit - Care Gap Nudge
 * Owner: Person B (Stage 12)
 * 
 * Signature UX element:
 * The Care Gap Identifier gently asks whether help is needed instead of
 * scolding or assuming care was missed. Respects autonomy.
 */

import React from 'react';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Heart, Sparkles, CheckCircle, Clock, ArrowRight } from '../../design/ui/Icon';
import type { ExtendedFollowUp } from '../../db/schema';

interface CareGapNudgeProps {
  followUp: ExtendedFollowUp;
  onYesNeedHelp: () => void;
  onRemindLater: () => void;
  onMarkDone: () => void;
}

export const CareGapNudge: React.FC<CareGapNudgeProps> = ({
  followUp,
  onYesNeedHelp,
  onRemindLater,
  onMarkDone,
}) => {
  return (
    <Card variant="plumSoft" padding="md" className="border-2 border-plum/30 shadow-soft space-y-3">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-plum text-white">
          <Heart className="w-3.5 h-3.5" />
          <span>Gentle Care-Gap Check-In</span>
        </span>

        {followUp.dueDate && (
          <span className="text-[11px] text-ink-subtle">
            Suggested by {followUp.dueDate}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-heading font-bold text-base text-ink">
          "{followUp.step}"
        </h4>
        <p className="text-xs text-ink-muted leading-relaxed">
          Life gets busy, and navigating clinic visits can be overwhelming. Would you like a verified volunteer companion to help with booking or hospital navigation?
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          variant="teal"
          size="sm"
          onClick={() => onYesNeedHelp()}
          className="text-xs"
        >
          Yes, Need Help
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRemindLater()}
          className="text-xs"
        >
          Remind Me Later
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMarkDone()}
          icon={<CheckCircle className="w-3.5 h-3.5 text-teal" />}
          className="text-xs"
        >
          Already Done
        </Button>
      </div>
    </Card>
  );
};
