/**
 * Care Orbit - Stage Summary & Preventive Schedule
 * Owner: Person B (Stage 4)
 * 
 * Displays life-stage guidance and age-based cancer & metabolic screening
 * intervals aligned with Indian National Health Guidelines (MoHFW / NFHS-5).
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Heart, ArrowRight, Shield, CheckCircle } from '../../design/ui/Icon';
import type { Profile } from '@sthreecare/shared';
import { COPY } from '../../copy';

interface StageSummaryProps {
  profile: Profile;
}

export const StageSummary: React.FC<StageSummaryProps> = ({ profile }) => {
  const navigate = useNavigate();

  const stageInfo = COPY.lifeStages[profile.lifeStage] || {
    label: 'General Healthcare',
    desc: 'Regular preventive wellness screening',
    checks: ['Menstrual Health', 'Haemoglobin', 'General Wellness'],
  };

  // Screening guidance according to age & life stage
  const getScreeningGuidance = () => {
    switch (profile.lifeStage) {
      case 'pregnant':
        return [
          { title: 'Antenatal Haemoglobin (Hb)', interval: 'Every Trimester', rationale: 'Prevent maternal anaemia; threshold 11.0 g/dL' },
          { title: 'Blood Glucose & BP Check', interval: 'Monthly OPD Visit', rationale: 'Screen for gestational diabetes and pre-eclampsia' },
          { title: 'EPDS Mood Screening', interval: 'Late 2nd & 3rd Trimester', rationale: 'Early identification of perinatal depression' },
        ];
      case 'postpartum':
        return [
          { title: 'Postpartum Depression Check (EPDS)', interval: 'At 6 & 12 Weeks', rationale: 'Validated 10-question screen; support available' },
          { title: 'Iron Level Re-evaluation', interval: '6-8 Weeks Post-delivery', rationale: 'Replenish iron stores depleted by delivery' },
          { title: 'Pelvic Floor Recovery Evaluation', interval: '6 Weeks Post-delivery', rationale: 'Early physiotherapy intervention' },
        ];
      case '40plus':
        return [
          { title: 'Cervical Cancer Screening (Visual/Pap/HPV)', interval: 'Every 3-5 Years', rationale: 'Free at District Hospital/PHC under National Programme' },
          { title: 'Clinical Breast Examination (CBE)', interval: 'Annually', rationale: 'Early detection of palpable lumps or changes' },
          { title: 'Perimenopausal Cycle & Bleeding Track', interval: 'Monthly', rationale: 'Differentiate normal transition from endometrial thickening' },
        ];
      default:
        return [
          { title: 'Menstrual Flow Scoring (PBAC)', interval: 'Each Cycle', rationale: 'Rule out occult menorrhagia and iron deficiency' },
          { title: 'Haemoglobin (Hb) Blood Check', interval: 'Every 6-12 Months', rationale: '57% of Indian women aged 15-49 are anaemic (NFHS-5)' },
          { title: 'Cervical Screening (if 30+)', interval: 'Every 5 Years', rationale: 'Only 1.9% uptake nationally; life-saving preventive care' },
        ];
    }
  };

  const guidanceItems = getScreeningGuidance();

  return (
    <Card variant="default" padding="md" className="space-y-4 border border-plum-soft shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-plum-soft/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
            <h3 className="font-heading font-bold text-lg text-ink">
              {stageInfo.label}
            </h3>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Age {profile.ageBand}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/profile')}
          className="text-xs self-start sm:self-center"
        >
          Change stage
        </Button>
      </div>

      <div className="space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-plum block">
          Screenings to keep up with
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
          {guidanceItems.map((item, idx) => (
            <div
              key={idx}
              className="tile p-3 rounded-xl bg-plum-soft/30 border border-plum-soft flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-ink leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-medium text-teal px-1.5 py-0.5 rounded bg-teal-soft">
                    {item.interval}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug line-clamp-2">
                  {item.rationale}
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/assess')}
                  className="text-[11px] font-semibold text-plum hover:underline inline-flex items-center gap-1"
                >
                  <span>Check now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
