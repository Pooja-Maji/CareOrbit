/**
 * Care Orbit - Result Detail Modal/Viewer
 * Owner: Person B (Stage 9)
 * 
 * Inspects a past saved result from the Care Thread with scores,
 * clinical flags, and doctor script.
 */

import React from 'react';
import type { Result } from '@sthreecare/shared';
import { Sheet } from '../../design/ui/Sheet';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { ThresholdGauge } from '../result/ThresholdGauge';
import { FlagCard } from '../result/FlagCard';
import { DoctorScriptCard } from '../result/DoctorScriptCard';
import { Calendar, Shield, Activity } from '../../design/ui/Icon';

interface ResultDetailProps {
  result: Result | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorSummary?: (res: Result) => void;
}

export const ResultDetail: React.FC<ResultDetailProps> = ({
  result,
  isOpen,
  onClose,
  onOpenDoctorSummary,
}) => {
  if (!result) return null;

  const pbacScore = result.scores?.['pbac'];
  const hbScore = result.scores?.['hb'];
  const epdsScore = result.scores?.['epds'];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Screening Check • ${result.date}`}
      subtitle={`Life stage: ${result.stage} • Rules engine v${result.rulesVersion}`}
    >
      <div className="space-y-6 py-2">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-soft text-teal border border-teal/20">
              ✓ Stored Locally on Device
            </span>
          </div>
          {onOpenDoctorSummary && (
            <Button
              variant="teal"
              size="sm"
              onClick={() => {
                onClose();
                onOpenDoctorSummary(result);
              }}
              className="text-xs"
            >
              Open Clinician QR
            </Button>
          )}
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {typeof pbacScore === 'number' && (
            <ThresholdGauge
              title="Menstrual Flow (PBAC)"
              score={pbacScore}
              threshold={100}
              source="Higham 1990"
              unit="pts"
            />
          )}

          {typeof hbScore === 'number' && (
            <ThresholdGauge
              title="Haemoglobin (Hb)"
              score={hbScore}
              threshold={12.0}
              maxScore={18}
              source="WHO (2011)"
              unit="g/dL"
            />
          )}

          {typeof epdsScore === 'number' && (
            <ThresholdGauge
              title="Mood Screening (EPDS)"
              score={epdsScore}
              threshold={13}
              maxScore={30}
              source="Cox 1987"
              unit="/ 30"
            />
          )}
        </div>

        {/* Clinical Flags */}
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm text-ink">
            Clinical Flags ({result.flags?.length || 0})
          </h4>

          {result.flags?.length === 0 ? (
            <div className="p-4 rounded-xl bg-plum-soft/30 text-xs text-ink-muted text-center">
              No elevated clinical flags fired for this check.
            </div>
          ) : (
            <div className="space-y-3">
              {result.flags.map((flag) => (
                <FlagCard
                  key={flag.id}
                  flag={flag}
                  onOpenWhy={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Doctor script */}
        <DoctorScriptCard result={result} />
      </div>
    </Sheet>
  );
};
