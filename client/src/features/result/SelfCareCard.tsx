import React from 'react';
import { Salad, Waves, Droplets, Moon, Heart } from '../../design/ui/Icon';

export interface SelfCareCardProps {
  hasBleedingOrAnaemia?: boolean;
}

const TIPS = [
  { icon: Salad, title: 'Iron + Vitamin C', text: 'Dates, lentils, greens with amla or lemon.', tone: 'from-teal to-[#2a8a85]' },
  { icon: Waves, title: 'Warm compress', text: 'On the lower belly to ease cramps.', tone: 'from-coral to-[#f0907a]' },
  { icon: Droplets, title: 'Stay hydrated', text: 'Water, coconut water, warm soups.', tone: 'from-[#2f7fb0] to-[#5aa6d4]' },
  { icon: Moon, title: 'Rest well', text: 'Short breaks. Sleep early on heavy days.', tone: 'from-plum to-plum-light' },
];

/** Flip cards: hover or tap to reveal the tip. */
export const SelfCareCard: React.FC<SelfCareCardProps> = () => (
  <div className="space-y-3">
    <h3 className="flex items-center gap-2 font-heading font-semibold text-lg text-ink">
      <span className="w-9 h-9 rounded-xl bg-teal-soft text-teal flex items-center justify-center">
        <Heart className="w-4 h-4" />
      </span>
      Self-care
      <span className="text-xs font-normal text-ink-subtle">hover to flip</span>
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {TIPS.map((t) => (
        <button
          key={t.title}
          type="button"
          className="flip h-36 text-left focus:outline-none"
          onClick={(e) => e.currentTarget.classList.toggle('flipped')}
        >
          <div className="flip-inner">
            <div className={`flip-face bg-gradient-to-br ${t.tone} text-white p-4 flex flex-col justify-between shadow-soft`}>
              <t.icon className="w-8 h-8" />
              <div className="font-heading font-bold text-lg leading-tight">{t.title}</div>
            </div>
            <div className="flip-face flip-back bg-white border border-plum-soft p-4 flex items-center shadow-soft">
              <p className="text-sm text-ink font-medium">{t.text}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);
