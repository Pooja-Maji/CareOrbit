import React, { useState } from 'react';
import type { EpdsInputs } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Heart, ChevronRight, ChevronLeft, PhoneCall, Shield } from '../../design/ui/Icon';

export interface MoodSwipeCardsProps {
  value: EpdsInputs;
  onChange: (val: EpdsInputs) => void;
  onComplete?: () => void;
}

interface Question {
  id: number;
  prompt: string;
  options: { label: string; score: number }[];
}

const EPDS_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'I have been able to laugh and see the funny side of things:',
    options: [
      { label: 'As much as I always could', score: 0 },
      { label: 'Not quite so much now', score: 1 },
      { label: 'Definitely not so much now', score: 2 },
      { label: 'Not at all', score: 3 },
    ],
  },
  {
    id: 2,
    prompt: 'I have looked forward with enjoyment to things:',
    options: [
      { label: 'As much as I ever did', score: 0 },
      { label: 'Rather less than I used to', score: 1 },
      { label: 'Definitely less than I used to', score: 2 },
      { label: 'Hardly at all', score: 3 },
    ],
  },
  {
    id: 3,
    prompt: 'I have blamed myself unnecessarily when things went wrong:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, some of the time', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, never', score: 0 },
    ],
  },
  {
    id: 4,
    prompt: 'I have been anxious or worried for no good reason:',
    options: [
      { label: 'No, not at all', score: 0 },
      { label: 'Hardly ever', score: 1 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'Yes, very often', score: 3 },
    ],
  },
  {
    id: 5,
    prompt: 'I have felt scared or panicky for no very good reason:',
    options: [
      { label: 'Yes, quite a lot', score: 3 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'No, not much', score: 1 },
      { label: 'No, not at all', score: 0 },
    ],
  },
  {
    id: 6,
    prompt: 'Things have been getting on top of me:',
    options: [
      { label: 'Yes, most of the time I haven’t been able to cope', score: 3 },
      { label: 'Yes, sometimes I haven’t been coping as well as usual', score: 2 },
      { label: 'No, most of the time I have coped quite well', score: 1 },
      { label: 'No, I have been coping as well as ever', score: 0 },
    ],
  },
  {
    id: 7,
    prompt: 'I have been so unhappy that I have had difficulty sleeping:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, not at all', score: 0 },
    ],
  },
  {
    id: 8,
    prompt: 'I have felt sad or miserable:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, quite often', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, not at all', score: 0 },
    ],
  },
  {
    id: 9,
    prompt: 'I have been so unhappy that I have been crying:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, quite often', score: 2 },
      { label: 'Only occasionally', score: 1 },
      { label: 'No, never', score: 0 },
    ],
  },
  {
    id: 10,
    prompt: 'The thought of harming myself has occurred to me:',
    options: [
      { label: 'Yes, quite often', score: 3 },
      { label: 'Sometimes', score: 2 },
      { label: 'Hardly ever', score: 1 },
      { label: 'Never', score: 0 },
    ],
  },
];

export const MoodSwipeCards: React.FC<MoodSwipeCardsProps> = ({
  value,
  onChange,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const answers = value.answers || new Array(10).fill(0);
  const currentQuestion = EPDS_QUESTIONS[currentIndex];
  const selectedScore = answers[currentIndex] ?? null;

  const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
  const item10Score = answers[9] || 0;
  const isItem10Triggered = item10Score > 0;

  const handleSelectOption = (score: number) => {
    const updated = [...answers];
    updated[currentIndex] = score;
    onChange({ answers: updated });

    if (currentIndex < EPDS_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Self-Harm Safety Alert Intercept */}
      {isItem10Triggered && (
        <Card variant="emergency" padding="md" className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-emergency-dark font-bold text-sm">
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <span>Support and Help is Right Here For You</span>
          </div>
          <p className="text-xs text-ink leading-relaxed">
            You indicated experiencing thoughts of harming yourself. Please know you are not alone. Free, confidential support is available 24/7 in India through <strong>Tele-MANAS: 14416</strong> or call <strong>108</strong>.
          </p>
          <div className="flex gap-2">
            <a
              href="tel:14416"
              className="px-4 py-2 bg-emergency text-white rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call Tele-MANAS (14416)
            </a>
            <a
              href="tel:108"
              className="px-4 py-2 bg-white text-emergency-dark border border-emergency/40 rounded-full text-xs font-semibold"
            >
              Call 108
            </a>
          </div>
        </Card>
      )}

      {/* Card Header & Progress */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span className="font-semibold text-plum">
          Question {currentIndex + 1} of {EPDS_QUESTIONS.length}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Total Score:</span>
          <span className="px-2 py-0.5 rounded-full bg-plum-soft font-bold text-plum">
            {totalScore} / 30
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-plum-soft/60 h-2 rounded-full overflow-hidden">
        <div
          className="bg-plum h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / EPDS_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card variant="elevated" padding="lg" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider">
            In the past 7 days:
          </span>
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-ink leading-snug">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Large Friendly Answer Buttons */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedScore === opt.score;
            return (
              <button
                key={opt.score}
                type="button"
                onClick={() => handleSelectOption(opt.score)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between min-h-[56px] ${
                  isSelected
                    ? 'border-plum bg-plum-soft text-plum font-semibold shadow-soft ring-2 ring-plum/20'
                    : 'border-plum-soft/80 bg-white hover:bg-cream hover:border-plum-soft text-ink font-normal'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-plum text-white' : 'bg-cream text-ink-subtle'
                  }`}
                >
                  {opt.score}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Steppers */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentIndex < EPDS_QUESTIONS.length - 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(EPDS_QUESTIONS.length - 1, prev + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onComplete}>
              Complete Check
            </Button>
          )}
        </div>
      </Card>

      <div className="p-3.5 rounded-xl bg-plum-soft/30 border border-plum/10 text-xs text-ink-muted">
        <strong>About this tool: </strong>
        The Edinburgh Postnatal Depression Scale (Cox et al. 1987) uses a threshold score of 13+ to screen for elevated risk of perinatal depression. It is a screening aid, not an anxiety or psychiatric diagnosis.
      </div>
    </div>
  );
};
