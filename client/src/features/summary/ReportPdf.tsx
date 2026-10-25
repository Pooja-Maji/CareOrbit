import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import type { Result, Profile } from '@sthreecare/shared';
import { Button, type ButtonProps } from '../../design/ui/Button';
import { FileDown } from '../../design/ui/Icon';
import { buildClinicianSummary } from './buildSummary';
import { COPY } from '../../copy';

/* ------------------------------------------------------------------ */
/*  The printable A4 report (hidden on screen, shown only when printing) */
/* ------------------------------------------------------------------ */
const PrintableReport: React.FC<{ result: Result; profile: Profile; qrUrl: string }> = ({
  result,
  profile,
  qrUrl,
}) => {
  const summary = buildClinicianSummary(result, profile);
  const name = profile.name || 'Patient';
  const stage = COPY.lifeStages[profile.lifeStage]?.label || profile.lifeStage;

  return (
    <div className="print-root text-[12px] leading-snug">
      {/* Brand band */}
      <div
        className="rounded-xl px-6 py-5 flex items-center justify-between text-white"
        style={{ background: 'linear-gradient(100deg,#511F45,#6B2D5C 60%,#1F6F6B)' }}
      >
        <div>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            SthreeCare
          </div>
          <div className="text-[11px] opacity-80">Health Screening Report</div>
        </div>
        <div className="text-right text-[11px]">
          <div className="font-semibold text-sm">{summary.date}</div>
          <div className="opacity-80">Rules v{result.rulesVersion}</div>
        </div>
      </div>

      {/* Patient strip */}
      <div className="grid grid-cols-3 gap-3 mt-4 print-avoid-break">
        {[
          ['Name', name],
          ['Life stage', stage],
          ['Age band', summary.ageBand],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-[#F5ECF3] bg-[#FBF7F4] px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-[#8C7F89] font-semibold">{k}</div>
            <div className="font-semibold capitalize">{v}</div>
          </div>
        ))}
      </div>

      {/* Scores */}
      <h2 className="mt-5 mb-2 text-sm font-bold text-[#6B2D5C] uppercase tracking-wider">Scores</h2>
      <table className="w-full border-collapse print-avoid-break">
        <thead>
          <tr className="bg-[#F5ECF3] text-left text-[10px] uppercase tracking-wider text-[#6B2D5C]">
            <th className="p-2">Check</th>
            <th className="p-2">Your result</th>
            <th className="p-2">Healthy range</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {summary.scores.map((s) => (
            <tr key={s.label} className="border-b border-[#F5ECF3]">
              <td className="p-2 font-medium">{s.label}</td>
              <td className="p-2 font-bold">{s.value}</td>
              <td className="p-2 text-[#61555E]">{s.threshold}</td>
              <td className="p-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: s.review ? '#E4735A' : '#1F6F6B' }}
                >
                  {s.review ? 'Review' : 'In range'}
                </span>
              </td>
            </tr>
          ))}
          {summary.scores.length === 0 && (
            <tr>
              <td className="p-2 text-[#61555E]" colSpan={4}>
                No scored checks in this report.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Flags */}
      <h2 className="mt-5 mb-2 text-sm font-bold text-[#6B2D5C] uppercase tracking-wider">
        Flags ({summary.flags.length})
      </h2>
      {summary.flags.length === 0 ? (
        <p className="text-[#61555E]">No flags raised. Keep up regular check-ups.</p>
      ) : (
        <div className="space-y-2">
          {result.flags.map((f) => (
            <div
              key={f.id}
              className="print-avoid-break rounded-lg border px-3 py-2"
              style={{
                borderColor: f.level === 'urgent' ? '#B3261E' : f.level === 'discuss' ? '#E4735A' : '#1F6F6B',
                borderLeftWidth: 5,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold text-[13px]">{f.title}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#61555E]">
                  {f.level === 'urgent' ? 'Urgent' : f.level === 'discuss' ? 'Discuss' : 'Info'}
                </div>
              </div>
              <div className="text-[#61555E] mt-0.5">{f.why}</div>
              <div className="mt-1">
                <span className="font-semibold text-[#6B2D5C]">Next step: </span>
                {f.nextStep}
              </div>
              <div className="text-[10px] text-[#8C7F89] mt-0.5">Source: {f.source}</div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor points + QR */}
      <div className="grid grid-cols-[1fr_auto] gap-5 mt-5 items-start print-avoid-break">
        <div>
          <h2 className="mb-2 text-sm font-bold text-[#6B2D5C] uppercase tracking-wider">Ask your doctor</h2>
          <ul className="list-disc pl-5 space-y-1">
            {summary.doctorTalkingPoints.length ? (
              summary.doctorTalkingPoints.map((p, i) => <li key={i}>{p}</li>)
            ) : (
              <li>Share this report and mention any symptoms that worry you.</li>
            )}
          </ul>
        </div>
        {qrUrl && (
          <div className="text-center">
            <img src={qrUrl} width={110} height={110} alt="QR code of this summary" />
            <div className="text-[9px] text-[#8C7F89] mt-1">Scan for summary</div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-3 border-t border-[#F5ECF3] text-[10px] text-[#8C7F89] print-avoid-break">
        {COPY.nonDiagnosticDisclaimer} Emergency: 108 · Tele-MANAS: 14416 (free, 24/7).
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  One-click "Download PDF" button                                    */
/* ------------------------------------------------------------------ */
export interface PdfReportButtonProps {
  result: Result;
  profile: Profile;
  label?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  fullWidth?: boolean;
}

export const PdfReportButton: React.FC<PdfReportButtonProps> = ({
  result,
  profile,
  label = 'Download PDF',
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth,
}) => {
  const [qrUrl, setQrUrl] = useState('');
  const [printing, setPrinting] = useState(false);

  const handleClick = async () => {
    const summary = buildClinicianSummary(result, profile);
    const qrData = JSON.stringify({
      app: 'SthreeCare',
      date: summary.date,
      scores: summary.scores.map((s) => `${s.label}: ${s.value}`),
      flags: summary.flags.map((f) => f.title),
    });
    try {
      setQrUrl(await QRCode.toDataURL(qrData, { width: 220, margin: 1 }));
    } catch {
      setQrUrl('');
    }
    setPrinting(true);
  };

  // Once the report is mounted, open the print dialog (choose "Save as PDF").
  useEffect(() => {
    if (!printing) return;
    const prevTitle = document.title;
    const stamp = new Date(result.date).toISOString().slice(0, 10);
    document.title = `SthreeCare-Report-${stamp}`;
    const done = () => setPrinting(false);
    window.addEventListener('afterprint', done, { once: true });
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('afterprint', done);
      document.title = prevTitle;
    };
  }, [printing, result.date]);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleClick}
        className={`shine ${className}`}
        icon={<FileDown className="w-4 h-4" />}
      >
        {label}
      </Button>
      {printing && createPortal(<PrintableReport result={result} profile={profile} qrUrl={qrUrl} />, document.body)}
    </>
  );
};
