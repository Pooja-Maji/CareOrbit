import React from 'react';
import type { Flag } from '@sthreecare/shared';
import { Sheet } from '../../design/ui/Sheet';
import { Shield, ExternalLink, Activity } from '../../design/ui/Icon';

export interface WhyDrawerProps {
  flag: Flag | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyDrawer: React.FC<WhyDrawerProps> = ({ flag, isOpen, onClose }) => {
  if (!flag) return null;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Why This Flag Appeared"
      subtitle={`Rule Identifier: ${flag.ruleId}`}
    >
      <div className="space-y-5 text-sm">
        {/* Core explanation */}
        <div className="p-4 rounded-xl bg-cream border border-plum-soft/60 space-y-2">
          <h4 className="font-semibold text-ink flex items-center gap-2">
            <Activity className="w-4 h-4 text-plum" />
            Clinical Reason & Threshold
          </h4>
          <p className="text-ink-muted text-xs leading-relaxed">{flag.why}</p>
        </div>

        {/* Source and citation */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Published Reference Source
          </span>
          <div className="p-3.5 rounded-xl bg-plum-soft/30 border border-plum/10 text-xs text-ink font-medium">
            {flag.source}
          </div>
        </div>

        {/* Action guideline */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Recommended Next Step
          </span>
          <div className="p-3.5 rounded-xl bg-teal-soft/40 border border-teal/20 text-xs text-ink leading-relaxed">
            {flag.nextStep}
          </div>
        </div>

        {/* Safety Boundary */}
        <div className="p-3 rounded-xl bg-amber-soft/60 border border-amber/20 text-[11px] text-ink-muted flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-dark flex-shrink-0 mt-0.5" />
          <p>
            This rule was evaluated deterministically on your phone using published public health standards. It is intended to help you have an informed discussion with your physician, not to diagnose a health condition.
          </p>
        </div>
      </div>
    </Sheet>
  );
};
