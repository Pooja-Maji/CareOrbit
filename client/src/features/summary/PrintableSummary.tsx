/**
 * Care Orbit - Printable Clinician Summary (Stage 7 & 10)
 * Owner: Person A
 * 
 * Clean, high-contrast, print-optimized document for physical printing
 * or PDF export to share with doctors during in-person visits.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { buildClinicianSummary } from './buildSummary';
import { QrCode } from './QrCode';
import { Button } from '../../design/ui/Button';
import { Printer, ArrowLeft, Shield, FileText } from '../../design/ui/Icon';

export const PrintableSummary: React.FC = () => {
  const navigate = useNavigate();
  const { result, profile } = useAppStore();

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <p className="text-sm text-ink-muted">No assessment results available to print.</p>
        <Button variant="primary" onClick={() => navigate('/assess')}>
          Start Assessment
        </Button>
      </div>
    );
  }

  const summary = buildClinicianSummary(result, profile);

  const qrPayload = JSON.stringify({
    system: 'CareOrbit-Compass',
    id: result.id,
    date: summary.date,
    stage: summary.lifeStage,
    scores: summary.scores.map((s) => `${s.label}: ${s.value}`),
    flags: summary.flags.map((f) => f.title),
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Non-Print Controls */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-plum-soft shadow-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/result')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Results
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-muted hidden sm:inline">
            A4 / Letter Print Layout
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Summary / Save PDF
          </Button>
        </div>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="bg-white text-black p-8 sm:p-12 rounded-2xl border border-gray-300 shadow-sm print:shadow-none print:border-none print:p-0 space-y-8 font-sans">
        {/* Header */}
        <div className="border-b-2 border-black pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-gray-900">
                Care Orbit
              </span>
              <span className="text-xs font-semibold uppercase px-2 py-0.5 border border-gray-800 rounded">
                Life-Stage Health Compass
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mt-1">
              Patient Life-Stage Screening Dossier
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Self-reported standardized screening summary prepared for clinical consultation.
            </p>
          </div>

          <div className="text-right text-xs text-gray-600 space-y-0.5">
            <div><strong>Date:</strong> {summary.date}</div>
            <div><strong>Rules Engine:</strong> v{result.rulesVersion}</div>
            <div><strong>Life Stage:</strong> <span className="capitalize">{summary.lifeStage}</span> ({summary.ageBand} yrs)</div>
            <div><strong>Report Ref:</strong> {result.id}</div>
          </div>
        </div>

        {/* Overview & QR Transfer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="space-y-1 text-xs">
            <h2 className="font-bold text-sm text-gray-900">
              Digital Medical Handover
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-lg">
              This summary compiles validated clinical instruments (Higham PBAC, WHO Haemoglobin classification, EPDS Perinatal Mood). Every finding cites published peer-reviewed thresholds. No automated diagnosis is rendered.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Data evaluated locally on device. No confidential health data was sent to server.</span>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center">
            <QrCode value={qrPayload} size={130} />
            <span className="text-[10px] text-gray-500 mt-1">Scan for structured payload</span>
          </div>
        </div>

        {/* Standardized Instruments Scoring Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
            Standardized Instrument Scores & Validated Thresholds
          </h2>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="py-2 px-3 font-bold text-gray-800">Instrument</th>
                <th className="py-2 px-3 font-bold text-gray-800">Recorded Score</th>
                <th className="py-2 px-3 font-bold text-gray-800">Published Reference Threshold</th>
                <th className="py-2 px-3 font-bold text-gray-800">Clinical Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summary.scores.map((sc, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{sc.label}</td>
                  <td className="py-2.5 px-3 font-bold text-gray-900">{sc.value}</td>
                  <td className="py-2.5 px-3 text-gray-700">{sc.threshold}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-[11px]">
                    {sc.label.includes('PBAC')
                      ? 'Higham et al., BJOG 1990'
                      : sc.label.includes('Hb')
                      ? 'WHO Diagnostic Guidelines 2011'
                      : 'Cox et al., Br J Psychiatry 1987'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clinical Flags Identified */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
            Deterministic Screening Findings ({summary.flags.length})
          </h2>

          {summary.flags.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No elevated clinical threshold flags recorded.</p>
          ) : (
            <div className="space-y-3">
              {summary.flags.map((flag, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-gray-300 bg-gray-50 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{idx + 1}. {flag.title}</span>
                    <span className="text-[10px] text-gray-500">{flag.source}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{flag.why}</p>
                  <div className="pt-1 text-[11px] font-semibold text-gray-800">
                    <strong>Suggested Investigation:</strong> {flag.nextStep}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doctor Talking Points */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 pb-1">
            Questions / Talking Points Prepared by Patient
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-800">
            {summary.doctorTalkingPoints.map((pt, i) => (
              <li key={i} className="leading-relaxed">
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinician Notes & Evaluation Section (Blank lines for physical handwriting) */}
        <div className="pt-4 border-t-2 border-gray-300 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Clinician Consultation Notes & Treatment Plan
          </h2>
          <div className="space-y-6 pt-2">
            <div className="border-b border-gray-300 h-6"></div>
            <div className="border-b border-gray-300 h-6"></div>
            <div className="border-b border-gray-300 h-6"></div>
          </div>

          <div className="flex justify-between items-end pt-6 text-xs text-gray-600">
            <div>
              <div>Clinician Name & Registration: ____________________________________</div>
            </div>
            <div>
              <div>Signature & Date: ____________________________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
