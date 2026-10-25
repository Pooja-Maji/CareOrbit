/**
 * Moving flashcards: facts drift sideways, pause on hover, flip to show what to do.
 * Figures are from the project's cited sources (NFHS-5, PBAC, EPDS studies).
 */
import React, { useState } from 'react';

type Tone = 'plum' | 'teal' | 'amber' | 'coral';

const FACTS: { big: string; front: string; back: string; tone: Tone }[] = [
  { big: '57%', front: 'of women aged 15–49 in India were anaemic in NFHS-5.', back: 'Heavy periods are a common contributor. A bleeding check plus a haemoglobin result shows where you stand.', tone: 'coral' },
  { big: '100', front: 'is the PBAC score that flags heavy bleeding.', back: 'It is a screening flag, not a diagnosis. Log a few cycles and bring the result to a doctor.', tone: 'plum' },
  { big: '1.9%', front: 'of women had ever had cervical screening in NFHS-5.', back: 'Ask your nearest health centre whether screening is offered, especially from age 30.', tone: 'teal' },
  { big: '3–7 yrs', front: 'is the estimated diagnosis delay for endometriosis.', back: 'Repeated, disruptive pain deserves a conversation about referral. The doctor script helps you start it.', tone: 'amber' },
  { big: '10 questions', front: 'make up the mood check used after pregnancy.', back: 'Low mood after birth is common and treatable. Tele-MANAS (14416) is free and open 24/7.', tone: 'teal' },
  { big: '108', front: 'is the number for sudden heavy bleeding, fainting or severe pain.', back: 'Call first, check later. Nothing in this app is ever locked behind credits or steps.', tone: 'coral' },
];

const FRONT: Record<Tone, string> = {
  plum: 'bg-plum-soft border-plum/15 text-plum',
  teal: 'bg-teal-soft border-teal/20 text-teal',
  amber: 'bg-amber-soft border-amber/25 text-amber-dark',
  coral: 'bg-coral-soft border-coral/25 text-coral-dark',
};
const BACK: Record<Tone, string> = {
  plum: 'bg-plum text-white',
  teal: 'bg-teal text-white',
  amber: 'bg-amber text-[#1D1626]',
  coral: 'bg-coral text-white',
};

const Card: React.FC<{ fact: (typeof FACTS)[number]; hidden?: boolean }> = ({ fact, hidden }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flip shrink-0 w-[250px] h-[210px] ${flipped ? 'is-flipped' : ''}`}>
      <button
        type="button"
        tabIndex={hidden ? -1 : 0}
        aria-hidden={hidden}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className="tight flip-inner block text-left w-full h-full"
      >
        <span className={`flip-face border ${FRONT[fact.tone]}`}>
          <span className="font-heading font-extrabold text-[38px] leading-none">{fact.big}</span>
          <span className="mt-3 text-[15px] leading-snug text-ink font-medium">{fact.front}</span>
          <span className="mt-auto text-xs font-semibold opacity-80">Flip for what to do</span>
        </span>
        <span className={`flip-face flip-back ${BACK[fact.tone]}`}>
          <span className="text-xs font-bold opacity-80">What to do</span>
          <span className="mt-2 text-[15px] leading-snug font-medium">{fact.back}</span>
        </span>
      </button>
    </div>
  );
};

export const FactCards: React.FC = () => (
  <section aria-labelledby="facts-h">
    <div className="flex items-end justify-between gap-3 mb-4">
      <h2 id="facts-h" className="text-2xl font-bold text-plum">Good to know</h2>
      <p className="text-sm text-ink-muted">Hover or tap a card to flip it</p>
    </div>
    <div
      className="marquee -mx-4 sm:mx-0 px-4 sm:px-0 py-2 overflow-hidden"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}
    >
      <div className="marquee-track">
        {FACTS.map((f, i) => <Card key={`a${i}`} fact={f} />)}
        {FACTS.map((f, i) => <Card key={`b${i}`} fact={f} hidden />)}
      </div>
    </div>
  </section>
);
