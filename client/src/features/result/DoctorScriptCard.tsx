import React, { useState } from 'react';
import type { Result } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Copy, Volume2, CheckCircle, FileText } from '../../design/ui/Icon';
import { copyToClipboard } from '../../lib/format';
import { speakText, stopSpeech } from '../../lib/a11y';

export interface DoctorScriptCardProps {
  result: Result;
}

export const DoctorScriptCard: React.FC<DoctorScriptCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Generate doctor conversation script dynamically based on flags and scores
  const pbacScore = result.scores['pbac'];
  const hbScore = result.scores['hb'];
  const epdsScore = result.scores['epds'];

  const scriptParts: string[] = [];

  scriptParts.push("Hello Doctor, I used a validated life-stage screening tool to prepare for our visit today.");

  if (typeof pbacScore === 'number' && pbacScore >= 100) {
    scriptParts.push(`My menstrual bleeding assessment (PBAC score: ${pbacScore}) is above the clinical threshold for heavy periods.`);
  }

  if (typeof hbScore === 'number' && hbScore < 12.0) {
    scriptParts.push(`My recent blood report recorded a haemoglobin level of ${hbScore} g/dL.`);
  }

  if (typeof epdsScore === 'number' && epdsScore >= 13) {
    scriptParts.push(`My mood screening score on the EPDS is ${epdsScore}/30, and I would like to discuss emotional well-being support.`);
  }

  // Next steps recommendations from flags
  const nextSteps = result.flags
    .map((f) => f.nextStep)
    .filter(Boolean)
    .slice(0, 2);

  if (nextSteps.length > 0) {
    scriptParts.push(`Specifically, I would like to ask: ${nextSteps.join(' Also, ')}`);
  }

  const scriptText = scriptParts.join(' ');

  const handleCopy = async () => {
    const ok = await copyToClipboard(scriptText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const ok = speakText(scriptText);
      if (ok) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 12000);
      }
    }
  };

  return (
    <Card variant="default" padding="lg" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center text-teal">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-base sm:text-lg text-ink">
              Doctor Discussion Script
            </h3>
            <p className="text-xs text-ink-muted">
              Ready-to-say talking points for your doctor's appointment
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeak}
            icon={<Volume2 className="w-4 h-4" />}
          >
            {isSpeaking ? 'Stop Reading' : 'Listen'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <CheckCircle className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Script'}
          </Button>
        </div>
      </div>

      {/* Script block quote */}
      <div className="p-4 rounded-xl bg-cream border border-plum-soft/60 relative">
        <p className="text-xs sm:text-sm text-ink leading-relaxed italic font-serif">
          "{scriptText}"
        </p>
      </div>

      <div className="text-[11px] text-ink-subtle flex items-center gap-1.5">
        <span>💡</span>
        <span>You can read this directly, show the screen, or copy and paste into a consultation message.</span>
      </div>
    </Card>
  );
};
