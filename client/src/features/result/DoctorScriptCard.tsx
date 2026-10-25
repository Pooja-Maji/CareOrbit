import React, { useState } from 'react';
import type { Result } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Copy, Volume2, CheckCircle, Quote } from '../../design/ui/Icon';
import { copyToClipboard } from '../../lib/format';
import { speakText, stopSpeech } from '../../lib/a11y';

export interface DoctorScriptCardProps {
  result: Result;
}

export const DoctorScriptCard: React.FC<DoctorScriptCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pbac = result.scores['pbac'];
  const hb = result.scores['hb'];
  const epds = result.scores['epds'];

  const lines: string[] = ['Hello Doctor, I did a screening before our visit.'];
  if (typeof pbac === 'number' && pbac >= 100) lines.push(`My period bleeding score is ${pbac}, which is heavy.`);
  if (typeof hb === 'number' && hb < 12.0) lines.push(`My haemoglobin is ${hb} g/dL.`);
  if (typeof epds === 'number' && epds >= 13) lines.push(`My mood score is ${epds}/30 and I would like support.`);
  const asks = result.flags.map((f) => f.nextStep).filter(Boolean).slice(0, 2);
  if (asks.length) lines.push(`I would like to ask: ${asks.join(' Also, ')}`);
  const scriptText = lines.join(' ');

  const handleCopy = async () => {
    if (await copyToClipboard(scriptText)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else if (speakText(scriptText)) {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 12000);
    }
  };

  return (
    <Card padding="lg" interactive className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="flex items-center gap-2 font-heading font-semibold text-lg text-ink">
          <span className="w-9 h-9 rounded-xl bg-teal-soft text-teal flex items-center justify-center">
            <Quote className="w-4 h-4" />
          </span>
          What to say
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSpeak} icon={<Volume2 className="w-4 h-4" />}>
            {isSpeaking ? 'Stop' : 'Listen'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      <p className="p-4 rounded-xl bg-cream border border-plum-soft/60 text-sm text-ink font-serif italic">“{scriptText}”</p>
    </Card>
  );
};
