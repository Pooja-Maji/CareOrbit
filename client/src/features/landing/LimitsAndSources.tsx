import React from 'react';
import { Card } from '../../design/ui/Card';
import { Shield, Info, Heart, ExternalLink } from '../../design/ui/Icon';

export const LimitsAndSources: React.FC = () => {
  const sources = [
    {
      name: 'Pictorial Blood Assessment Chart (PBAC)',
      citation: 'Higham JM, O’Brien PM, Shaw RW. Assessment of menstrual blood loss using a pictorial chart. Br J Obstet Gynaecol. 1990;97(8):734-739.',
      useInApp: 'Calculates bleeding score based on pad/tampon saturation. Threshold ≥ 100 points indicates menorrhagia (~80 mL blood loss).',
      limits: 'Self-assessed sensitivity was 86% and specificity 89% in the original study; subsequent research reports sensitivities ranging from 58% to 97%. It is a screening aid, not definitive diagnostic imaging.',
    },
    {
      name: 'Haemoglobin Concentrations for Anaemia Assessment',
      citation: 'World Health Organization (WHO). Haemoglobin concentrations for the diagnosis of anaemia and assessment of severity. Geneva: WHO, 2011.',
      useInApp: 'Classifies non-pregnant women (<12.0 g/dL) and pregnant women (<11.0 g/dL) into mild, moderate, and severe ranges.',
      limits: 'Cut-offs apply at sea level; smoking and high altitudes require adjustments. Requires a verified venous or capillary lab report.',
    },
    {
      name: 'Edinburgh Postnatal Depression Scale (EPDS)',
      citation: 'Cox JL, Holden JM, Sagovsky R. Br J Psychiatry. 1987; Indian validation: Fernandes M et al. BMC Psychiatry. 2021.',
      useInApp: '10-item questionnaire screening for perinatal mood symptoms. Threshold ≥ 13 points indicates elevated risk; item 10 triggers immediate crisis support.',
      limits: 'Validated specifically for screening depressive symptoms, NOT for generalized anxiety disorder or standalone clinical diagnosis.',
    },
    {
      name: 'Emergency Danger Signs Guidelines',
      citation: 'Ministry of Health and Family Welfare (MoHFW) India & WHO Emergency Obstetric and Gynaecological Care standards.',
      useInApp: 'Triggers immediate emergency full-screen takeover with direct Call 108 and family alert actions.',
      limits: 'Emergency care is always available regardless of login, credits, or steps.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
          Sources & Limits
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Where our rules come from, and what they can't do.
        </p>
      </div>

      {/* Safety Notice Box */}
      <Card variant="default" padding="lg" className="border-plum/20 bg-cream space-y-3">
        <div className="flex items-center gap-2 text-plum font-bold text-sm">
          <Shield className="w-5 h-5 text-teal" />
          <span>Our promises</span>
        </div>
        <ul className="text-xs text-ink-muted space-y-2 list-disc list-inside leading-relaxed">
          <li><strong>No AI diagnosis.</strong> Fixed, published clinical rules.</li>
          <li><strong>Careful wording.</strong> We flag, a doctor decides.</li>
          <li><strong>Private.</strong> Your data stays on this device.</li>
        </ul>
      </Card>

      {/* Published Literature Sources */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-ink">
          Sources
        </h2>

        {sources.map((s, i) => (
          <Card key={i} variant="default" padding="md" className="space-y-2">
            <h3 className="font-semibold text-sm text-ink">{s.name}</h3>
            <p className="text-xs text-plum font-medium italic">{s.citation}</p>
            <div className="text-xs text-ink-muted space-y-1 pt-1">
              <p><strong>Application: </strong>{s.useInApp}</p>
              <p><strong>Known Limitations: </strong>{s.limits}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
