/**
 * Care Orbit - Healthcare Time Bank Screen
 * Owner: Person B (Stage 11)
 * 
 * Community mutual-aid mechanism providing practical non-medical support.
 * Credits NEVER gate urgent care.
 */

import { PageHeader } from '../../design/ui/PageHeader';
import { Sparkles as HdrIcon } from '../../design/ui/Icon';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditRing } from './CreditRing';
import { Ledger } from './Ledger';
import { getCreditsSummary, redeemCredits } from '../../api/creditsApi';
import type { CreditSummary } from '@sthreecare/shared';
import { sessionStore } from '../../state/sessionStore';
import { useUiStore } from '../../state/uiStore';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Heart, Sparkles, Shield, ArrowRight, AlertTriangle } from '../../design/ui/Icon';

export const TimeBankScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUiStore();
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const anonRef = sessionStore.getAnonymousRef();

  const loadCredits = async () => {
    try {
      const data = await getCreditsSummary(anonRef);
      setSummary(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, [anonRef]);

  const handleSimulateRedeem = async () => {
    const res = await redeemCredits({
      anonymousRef: anonRef,
      hours: 1.0,
      purpose: 'Hospital queue navigation and translation companion',
    });
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Credits Applied',
        message: '1.0 volunteer hour deducted for your support task.',
      });
      await loadCredits();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader icon={<HdrIcon className="w-7 h-7" />} title="Time Bank" subtitle="Give an hour, get an hour" tone="teal" actions={<>
        <Button
          variant="teal"
          size="sm"
          onClick={() => navigate('/support')}
          className="text-xs self-start sm:self-center"
        >
          Get a volunteer
        </Button>
      </>} />

      {/* Critical Role Boundary / Urgent Care Non-Gating Alert */}
      <div className="p-4 rounded-xl bg-amber-soft/50 border border-amber/30 space-y-1.5 text-xs text-ink">
        <div className="flex items-center gap-1.5 font-bold text-amber-dark">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Urgent care is never blocked by credits</span>
        </div>
        <p className="text-ink-muted leading-relaxed">
          Danger signs always go straight to 108. Credits only cover non-medical help, and are free for anyone in need.
        </p>
      </div>

      {/* Credit Ring & Summary Card */}
      {summary && (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* The Signature Credit Ring */}
            <CreditRing
              earned={summary.earnedHours}
              used={summary.redeemedHours}
              sponsored={summary.sponsoredHoursAvailable}
              balance={summary.balanceHours}
            />

            {/* How it works breakdown */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-ink">
                How it works
              </h3>

              <div className="space-y-3 text-sm text-ink-muted">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    1
                  </div>
                  <p>
                    <strong>1 hour = 1 credit.</strong> Volunteer time earns credits.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-plum text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    2
                  </div>
                  <p>
                    <strong>Sponsored pool.</strong> Free hours if you can't volunteer.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    3
                  </div>
                  <p>
                    <strong>Anonymous.</strong> Credits never link to your health data.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSimulateRedeem}
                  className="text-xs"
                >
                  Test Deduct 1.0 hr (Simulation)
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Transaction Ledger */}
      {summary && (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft">
          <Ledger entries={summary.entries} />
        </Card>
      )}
    </div>
  );
};
