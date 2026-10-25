import React, { useRef, useState } from 'react';
import type { EpdsInputs } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { ChevronRight, ChevronLeft, PhoneCall, Brain, Check } from '../../design/ui/Icon';

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

export const MoodSwipeCards: React.FC<MoodSwipeCardsProps> = ({ value, onChange, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [answered, setAnswered] = useState<Set<number>>(
    () => new Set((value.answers || []).map((a, i) => (a > 0 ? i : -1)).filter((i) => i >= 0))
  );
  const startX = useRef<number | null>(null);

  const total = EPDS_QUESTIONS.length;
  const answers = value.answers || new Array(10).fill(0);
  const q = EPDS_QUESTIONS[currentIndex];
  const selected = answered.has(currentIndex) ? answers[currentIndex] : null;

  const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
  const item10Triggered = (answers[9] || 0) > 0;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    if (clamped === currentIndex) return;
    setDir(clamped > currentIndex ? 'next' : 'prev');
    setCurrentIndex(clamped);
  };

  const pick = (score: number) => {
    const updated = [...answers];
    updated[currentIndex] = score;
    onChange({ answers: updated });
    setAnswered((prev) => new Set(prev).add(currentIndex));
    if (currentIndex < total - 1) {
      setTimeout(() => go(currentIndex + 1), 280);
    } else if (onComplete) {
      setTimeout(onComplete, 280);
    }
  };

  // Swipe: drag left = next card, right = previous card
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx < -60) go(currentIndex + 1);
    if (dx > 60) go(currentIndex - 1);
  };

  const pct = (answered.size / total) * 100;
  const circ = 2 * Math.PI * 42;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* DECK */}
      <div className="xl:col-span-8 space-y-4">
        {item10Triggered && (
          <Card variant="emergency" padding="md" className="flex flex-wrap items-center justify-between gap-3 animate-pop-in">
            <div className="flex items-center gap-3 text-emergency-dark font-bold">
              <PhoneCall className="w-5 h-5 animate-pulse" />
              You are not alone. Free help, 24/7.
            </div>
            <div className="flex gap-2">
              <a href="tel:14416" className="px-4 py-2 bg-emergency text-white rounded-full text-sm font-semibold inline-flex items-center gap-1.5 hover:scale-105 transition-transform">
                <PhoneCall className="w-4 h-4" /> 14416
              </a>
              <a href="tel:108" className="px-4 py-2 bg-white text-emergency-dark border border-emergency/40 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                108
              </a>
            </div>
          </Card>
        )}

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {EPDS_QUESTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to question ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all duration-300 min-h-0 ${
                i === currentIndex ? 'w-10 bg-plum' : answered.has(i) ? 'w-2.5 bg-teal' : 'w-2.5 bg-plum-soft hover:bg-plum/40'
              }`}
            />
          ))}
          <span className="ml-auto text-sm font-semibold text-plum">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Stacked flashcard */}
        <div className="relative pb-4 select-none">
          <div className="absolute inset-x-6 top-4 bottom-0 rounded-card bg-plum/10 rotate-[2deg]" />
          <div className="absolute inset-x-3 top-2 bottom-2 rounded-card bg-plum/15 -rotate-[1.5deg]" />

          <div
            key={currentIndex}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'pan-y' }}
            className={`relative ${dir === 'next' ? 'animate-card-in' : 'animate-card-in-back'}`}
          >
            <Card variant="elevated" padding="lg" className="space-y-6 cursor-grab active:cursor-grabbing">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a4b9a] to-[#b77bc4] text-white flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6" />
                </span>
                <div>
                  <span className="text-xs font-bold text-ink-subtle uppercase tracking-wider">Past 7 days</span>
                  <h3 className="text-xl sm:text-2xl font-heading font-semibold text-ink leading-snug">{q.prompt}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isSel = selected === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => pick(opt.score)}
                      className={`group relative p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 min-h-[64px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted active:scale-[0.98] ${
                        isSel ? 'border-plum bg-plum-soft text-plum font-semibold' : 'border-plum-soft bg-white hover:border-plum/50'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{opt.label}</span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                          isSel ? 'bg-plum text-white scale-110' : 'bg-cream text-ink-subtle group-hover:bg-plum group-hover:text-white'
                        }`}
                      >
                        {isSel ? <Check className="w-4 h-4" /> : opt.score}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" disabled={currentIndex === 0} onClick={() => go(currentIndex - 1)} icon={<ChevronLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <span className="hidden sm:inline text-xs text-ink-subtle">Tap an answer or swipe</span>
                {currentIndex < total - 1 ? (
                  <Button variant="outline" size="sm" onClick={() => go(currentIndex + 1)}>
                    Skip <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={onComplete}>
                    Finish
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* SIDE: live score ring */}
      <aside className="xl:col-span-4">
        <Card padding="lg" interactive className="flex xl:flex-col items-center gap-6 text-center">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#F5ECF3" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={totalScore >= 13 ? '#E4735A' : '#6B2D5C'}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (Math.min(totalScore, 30) / 30) * circ}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold text-ink">{totalScore}</span>
              <span className="text-[11px] text-ink-subtle">of 30</span>
            </div>
          </div>
          <div className="space-y-2 text-left xl:text-center">
            <div className="font-heading font-bold text-ink">{answered.size} of {total} answered</div>
            <div className="h-2 w-full min-w-[140px] rounded-full bg-plum-soft overflow-hidden">
              <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-ink-muted">13+ suggests talking to a doctor. A screen, not a diagnosis.</p>
          </div>
        </Card>
      </aside>
    </div>
  );
};
