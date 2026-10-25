import React from 'react';
import type { Result, Profile } from '@sthreecare/shared';
import { Sheet } from '../../design/ui/Sheet';
import { QrCode } from './QrCode';
import { buildClinicianSummary } from './buildSummary';
import { PdfReportButton } from './ReportPdf';
import { CheckCircle, AlertTriangle, Stethoscope } from '../../design/ui/Icon';

export interface DoctorSummarySheetProps {
  isOpen: boolean;
  onClose: () => void;
  result: Result;
  profile: Profile;
}

export const DoctorSummarySheet: React.FC<DoctorSummarySheetProps> = ({ isOpen, onClose, result, profile }) => {
  const summary = buildClinicianSummary(result, profile);

  const qrData = JSON.stringify({
    app: 'SthreeCare',
    date: summary.date,
    scores: summary.scores.map((s) => `${s.label}: ${s.value}`),
    flags: summary.flags.map((f) => f.title),
  });

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Doctor Summary" subtitle={summary.date}>
      <div className="space-y-5 stagger">
        {/* QR + PDF */}
        <div className="flex items-center gap-5 p-4 rounded-card bg-cream border border-plum-soft">
          <QrCode value={qrData} size={112} />
          <div className="space-y-3">
            <p className="font-heading font-bold text-ink">Show or scan</p>
            <PdfReportButton result={result} profile={profile} label="Download PDF" size="sm" />
          </div>
        </div>

        {/* Scores */}
        <div className="grid gap-2">
          {summary.scores.map((s) => (
            <div
              key={s.label}
              className="tile flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-plum-soft"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.review ? 'bg-coral-soft text-coral' : 'bg-teal-soft text-teal'
                  }`}
                >
                  {s.review ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">{s.label}</div>
                  <div className="text-[11px] text-ink-subtle">Range: {s.threshold}</div>
                </div>
              </div>
              <span className="font-heading font-bold text-lg text-plum whitespace-nowrap">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Ask doctor */}
        {summary.doctorTalkingPoints.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal">
              <Stethoscope className="w-4 h-4" /> Ask your doctor
            </h4>
            {summary.doctorTalkingPoints.map((pt, i) => (
              <div key={i} className="p-3 rounded-xl bg-teal-soft/50 border border-teal/20 text-sm text-ink">
                {pt}
              </div>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
};
