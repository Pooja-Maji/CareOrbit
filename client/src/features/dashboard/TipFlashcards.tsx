import React from 'react';
import {
  Salad,
  Droplets,
  Moon,
  Wind,
  CalendarCheck,
  Brain,
  Leaf,
  Zap,
  Lightbulb,
} from '../../design/ui/Icon';

const TIPS = [
  { icon: Salad, title: 'Eat iron', tip: 'Dates, lentils, greens. Add lemon for better absorption.', tone: 'from-teal to-[#2a8a85]' },
  { icon: Droplets, title: 'Drink water', tip: '6–8 glasses a day, more on heavy-flow days.', tone: 'from-[#2f7fb0] to-[#5aa6d4]' },
  { icon: Moon, title: 'Sleep 7–8 h', tip: 'Steady sleep helps hormones and mood.', tone: 'from-plum to-plum-light' },
  { icon: CalendarCheck, title: 'Log your cycle', tip: 'Note start date, flow and pain every month.', tone: 'from-coral to-[#f0907a]' },
  { icon: Wind, title: 'Breathe', tip: '4 in, 6 out. Three rounds calm the body.', tone: 'from-[#4b8f8a] to-[#7bc4bd]' },
  { icon: Brain, title: 'Mood check', tip: 'Low for 2+ weeks? Do the 10-question check.', tone: 'from-[#8a4b9a] to-[#b77bc4]' },
  { icon: Leaf, title: 'Move daily', tip: '20 minutes of walking eases cramps.', tone: 'from-[#5b8f3a] to-[#8bc267]' },
  { icon: Zap, title: 'Tired a lot?', tip: 'Fatigue can mean low iron. Ask for an Hb test.', tone: 'from-amber to-[#d99a3d]' },
];

/** Auto-scrolling, flip-on-hover tips. Pauses when you hover. */
export const TipFlashcards: React.FC = () => {
  const loop = [...TIPS, ...TIPS];
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-ink">
        <span className="w-9 h-9 rounded-xl bg-amber-soft text-amber flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </span>
        Quick tips
        <span className="text-xs font-normal text-ink-subtle">hover a card to flip</span>
      </h2>
      <div className="marquee-wrap marquee-mask overflow-hidden -mx-4 sm:-mx-6 lg:-mx-10 py-2">
        <div className="marquee-track flex gap-4 w-max animate-marquee px-4">
          {loop.map((t, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${t.title}: ${t.tip}`}
              className="flip w-56 h-40 flex-shrink-0 text-left focus:outline-none"
              onClick={(e) => e.currentTarget.classList.toggle('flipped')}
            >
              <div className="flip-inner">
                <div className={`flip-face bg-gradient-to-br ${t.tone} text-white p-5 flex flex-col justify-between shadow-lifted`}>
                  <t.icon className="w-9 h-9" />
                  <div className="font-heading font-bold text-xl leading-tight">{t.title}</div>
                </div>
                <div className="flip-face flip-back bg-white border border-plum-soft p-5 flex items-center shadow-lifted">
                  <p className="text-sm font-medium text-ink">{t.tip}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
