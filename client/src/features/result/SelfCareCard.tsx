import React from 'react';
import { Card } from '../../design/ui/Card';
import { Heart, Shield } from '../../design/ui/Icon';

export interface SelfCareCardProps {
  hasBleedingOrAnaemia?: boolean;
}

export const SelfCareCard: React.FC<SelfCareCardProps> = ({ hasBleedingOrAnaemia = true }) => {
  const tips = [
    {
      title: 'Nutritional Iron & Vitamin C Pairing',
      text: 'Include traditional iron-rich foods such as drumstick leaves (moringa), lentils, spinach, dates, and jaggery. Pair with vitamin C (amla, lemon, or oranges) to significantly boost iron absorption.',
    },
    {
      title: 'Gentle Warmth for Pelvic Comfort',
      text: 'A warm compress or hot water bottle placed over the lower abdomen can help relax uterine muscles and ease cramping discomfort during peak bleeding days.',
    },
    {
      title: 'Hydration and Electrolyte Balance',
      text: 'Drink plenty of water, coconut water, or warm soups to help replace fluid loss and avoid lightheadedness during heavier flow.',
    },
    {
      title: 'Pacing and Active Rest',
      text: 'Allow yourself short rest breaks during physically demanding routines. Track how you feel day by day.',
    },
  ];

  return (
    <Card variant="teal" padding="lg" className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center">
          <Heart className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-base sm:text-lg text-ink">
            Safe Everyday Self-Care Guidance
          </h3>
          <p className="text-xs text-ink-muted">
            Evidence-based comfort practices to support your body while you consult your doctor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-white border border-teal/20 text-xs space-y-1 shadow-xs"
          >
            <h4 className="font-semibold text-teal-dark">{tip.title}</h4>
            <p className="text-ink-muted leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>

      <div className="p-2.5 rounded-xl bg-white/70 border border-teal/10 text-[11px] text-ink-subtle flex items-center gap-2">
        <Shield className="w-4 h-4 text-teal flex-shrink-0" />
        <span>Self-care guidance is supportive only and does not replace medical treatment or prescription therapies.</span>
      </div>
    </Card>
  );
};
