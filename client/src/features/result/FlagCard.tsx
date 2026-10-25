import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Flag } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { EvidenceChip } from './EvidenceChip';
import { AlertTriangle, Info, ArrowRight, Sparkles } from '../../design/ui/Icon';

export interface FlagCardProps {
  flag: Flag;
  onOpenWhy: (flag: Flag) => void;
}

export const FlagCard: React.FC<FlagCardProps> = ({ flag, onOpenWhy }) => {
  const navigate = useNavigate();
  const isUrgent = flag.level === 'urgent';
  const isDiscuss = flag.level === 'discuss';

  const cardVariant = isUrgent ? 'emergency' : isDiscuss ? 'coral' : 'default';

  return (
    <Card variant={cardVariant} padding="md" className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <AlertTriangle className="w-5 h-5 text-emergency flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-coral flex-shrink-0" />
          )}
          <h3 className="font-heading font-semibold text-base sm:text-lg text-ink">
            {flag.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isUrgent
                ? 'bg-emergency text-white'
                : isDiscuss
                ? 'bg-coral text-white'
                : 'bg-teal text-white'
            }`}
          >
            {isUrgent ? 'Urgent Alert' : isDiscuss ? 'Discuss with Doctor' : 'Health Guidance'}
          </span>
        </div>
      </div>

      {/* Explanation paragraph */}
      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
        {flag.why}
      </p>

      {/* Next Step Action Box */}
      <div className="p-3.5 rounded-xl bg-white/80 border border-plum-soft/60 space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-plum block">
          Recommended Next Step:
        </span>
        <p className="text-xs text-ink font-medium leading-relaxed">
          {flag.nextStep}
        </p>
      </div>

      {/* Bottom Bar: Evidence Chip + Volunteer Request + Why Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/5">
        <div className="flex flex-wrap items-center gap-2">
          <EvidenceChip
            source={flag.source}
            ruleId={flag.ruleId}
            onClick={() => onOpenWhy(flag)}
          />

          {!isUrgent && flag.nextStep && (
            <button
              type="button"
              onClick={() =>
                navigate('/support', {
                  state: {
                    taskType: 'navigation',
                    facilityName: 'Healthcare Facility',
                    logisticsNotes: `${flag.title}: ${flag.nextStep}`,
                  },
                })
              }
              className="text-xs font-semibold text-teal hover:text-teal-dark inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-soft/60 border border-teal/20 hover:bg-teal-soft transition-colors"
              title="Request a verified volunteer companion through Healthcare Time Bank"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal" />
              <span>Get Volunteer Help</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenWhy(flag)}
          className="text-xs font-semibold text-plum hover:underline inline-flex items-center gap-1"
        >
          <span>Why did this appear?</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};
