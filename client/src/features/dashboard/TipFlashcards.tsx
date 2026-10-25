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
  { icon: Salad, title: 'Eat iron', tip: 'Dates, lentils, greens. Add lemon for better absorption.' },
  { icon: Droplets, title: 'Drink water', tip: '6–8 glasses a day, more on heavy-flow days.' },
  { icon: Moon, title: 'Sleep 7–8 h', tip: 'Steady sleep helps hormones and mood.' },
  { icon: CalendarCheck, title: 'Log your cycle', tip: 'Note start date, flow and pain every month.' },
  { icon: Wind, title: 'Breathe', tip: '4 in, 6 out. Three rounds calm the body.' },
  { icon: Brain, title: 'Mood check', tip: 'Low for 2+ weeks? Do the 10-question check.' },
  { icon: Leaf, title: 'Move daily', tip: '20 minutes of walking eases cramps.' },
  { icon: Zap, title: 'Tired a lot?', tip: 'Fatigue can mean low iron. Ask for an Hb test.' },
];

/**
 * Drifting dark flashcards. Every card shows its front for ~2 s, flips by itself
 * to the tip, lets you read it, then flips back. Staggered so they never all flip at once.
 * Hover/focus pauses everything; tap a card to hold it open.
 */
export const TipFlashcards: React.FC = () => {
  const loop = [...TIPS, ...TIPS]; // second half is identical so the loop is seamless
  return (
    <section className="space-y-3">
      <h2 className="flex flex-wrap items-center gap-2 text-lg font-heading font-semibold text-ink">
        <span className="w-9 h-9 rounded-xl bg-plum-soft text-plum flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </span>
        Quick tips
        <span className="text-xs font-normal text-ink-subtle">flips on its own · hover to pause · tap to hold</span>
      </h2>

      <div className="tips-stage">
        <div className="marquee-wrap marquee-mask relative overflow-hidden py-2">
          <div className="marquee-track flex gap-5 w-max animate-marquee px-5">
            {loop.map((t, i) => {
              const n = i % TIPS.length;
              const vTop = n % 2 === 0; // alternate which colour is on top
              const delay = { animationDelay: `-${(n * 1.15).toFixed(2)}s` };
              const grad = vTop ? 'grad-a' : 'grad-b';
              const top = vTop ? 'text-white' : 'text-[#1E0B4D]';
              const bottom = vTop ? 'text-[#1E0B4D]' : 'text-white';
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`${t.title}: ${t.tip}`}
                  className="flip w-60 h-44 flex-shrink-0 text-left focus:outline-none"
                  onClick={(e) => e.currentTarget.classList.toggle('flipped')}
                >
                  <div className="flip-inner auto-flip" style={delay}>
                    {/* FRONT: violet blends into cyan */}
                    <div className={`flip-face tip-front ${grad} flex flex-col justify-between p-4`}>
                      <div className={`flex items-start justify-between ${top}`}>
                        <span className={`tip-halo ${vTop ? 'bg-[#22D3EE] text-[#1E0B4D]' : 'bg-[#2E1065] text-white'}`}>
                          <t.icon className="w-6 h-6" />
                        </span>
                        <span className="text-[11px] font-bold tracking-widest opacity-80">
                          TIP {String(n + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className={`font-heading font-bold text-2xl leading-tight ${bottom}`}>{t.title}</div>
                      <span className="tip-timer" style={{ ...delay, background: vTop ? '#2E1065' : '#22D3EE' }} />
                    </div>
                    {/* BACK: same blend, white text */}
                    <div className={`flip-face flip-back tip-back ${grad} p-5 flex flex-col justify-center gap-2`}>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-[#67E8F9]">{t.title}</span>
                      <p className="text-[15px] leading-snug font-semibold">{t.tip}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
