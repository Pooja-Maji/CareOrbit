import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Flag } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { EvidenceChip } from './EvidenceChip';
import { AlertTriangle, Info, ArrowRight, CheckCircle, Sparkles } from '../../design/ui/Icon';

export interface FlagCardProps {
  flag: Flag;
  onOpenWhy: (flag: Flag) => void;
}

export const FlagCard: React.FC<FlagCardProps> = ({ flag, onOpenWhy }) => {
  const navigate = useNavigate();
  const urgent = flag.level === 'urgent';
  const discuss = flag.level === 'discuss';

  return (
    <Card variant={urgent ? 'emergency' : discuss ? 'coral' : 'default'} padding="md" interactive className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
              urgent ? 'bg-emergency' : discuss ? 'bg-coral' : 'bg-teal'
            }`}
          >
            {urgent ? <AlertTriangle className="w-5 h-5" /> : discuss ? <Info className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-ink leading-snug">{flag.title}</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
              {urgent ? 'Urgent' : discuss ? 'Talk to a doctor' : 'Good to know'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenWhy(flag)}
          className="text-xs font-semibold text-plum hover:gap-2 inline-flex items-center gap-1 transition-all whitespace-nowrap"
        >
          Why? <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-white/80 border border-plum-soft/60">
        <ArrowRight className="w-4 h-4 text-plum mt-0.5 flex-shrink-0" />
        <p className="text-sm text-ink font-medium">{flag.nextStep}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <EvidenceChip source={flag.source} ruleId={flag.ruleId} onClick={() => onOpenWhy(flag)} />

        {!urgent && flag.nextStep && (
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
    </Card>
  );
};
