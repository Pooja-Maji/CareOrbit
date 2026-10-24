/**
 * SthreeCare - Credit Ledger
 * Owner: Person B (Stage 11)
 * 
 * Transparent accounting ledger of Time Bank hours earned, redeemed,
 * and granted through community sponsorship.
 */

import React from 'react';
import type { CreditLedgerEntry } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Sparkles, ArrowRight, Heart } from '../../design/ui/Icon';

interface LedgerProps {
  entries: CreditLedgerEntry[];
}

export const Ledger: React.FC<LedgerProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-ink-muted">
        No Time Bank transactions recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-ink-subtle">
        <span className="font-semibold uppercase tracking-wider">Transaction Activity</span>
        <span>Unit: Hours of Practical Community Assistance</span>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isPositive = entry.delta > 0;
          const isSponsored = entry.kind === 'sponsored';
          const isEarned = entry.kind === 'earned';

          const badgeColor = isSponsored
            ? 'bg-plum-soft text-plum border-plum/20'
            : isEarned
            ? 'bg-teal-soft text-teal border-teal/20'
            : 'bg-amber-soft text-amber-dark border-amber/20';

          return (
            <div
              key={entry.id}
              className="p-3.5 rounded-xl bg-white border border-plum-soft/60 shadow-sm flex items-center justify-between gap-3 hover:border-plum-soft transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {entry.kind}
                  </span>
                  <span className="text-[11px] text-ink-subtle">
                    {new Date(entry.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs font-medium text-ink">
                  {entry.description}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={`font-heading font-bold text-sm sm:text-base ${
                    isPositive ? 'text-teal' : 'text-amber-dark'
                  }`}
                >
                  {isPositive ? `+${entry.delta.toFixed(1)}h` : `${entry.delta.toFixed(1)}h`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
