/**
 * SthreeCare - Clinician-Reviewable Copy and Content
 * All user-facing strings are centralized here for easy auditing,
 * localization, and medical professional review.
 */

export const COPY = {
  appName: 'SthreeCare',
  tagline: 'Life-Stage Health Compass',
  nonDiagnosticDisclaimer:
    'SthreeCare is a validated screening and care-navigation platform, not a diagnostic medical device. It does not replace professional clinical evaluation. Please discuss all findings with a qualified doctor.',

  emergencyNotice:
    'If you are experiencing severe pain, excessive sudden bleeding, fainting, or acute emotional distress, please seek emergency medical attention immediately.',

  emergencyHelpline: '108',
  mentalHealthHelpline: '14416 (Tele-MANAS, Free 24/7)',

  lifeStages: {
    teen: {
      label: 'Teen & Adolescence',
      ageSpan: 'Ages 13–19',
      desc: 'First cycles, menstrual comfort, pain awareness, and body changes.',
    },
    adult: {
      label: 'Reproductive Adult',
      ageSpan: 'Ages 20–39',
      desc: 'Cycle regularity, heavy flow checks, anaemia screening, and wellness.',
    },
    pregnant: {
      label: 'Pregnancy',
      ageSpan: 'Maternal',
      desc: 'Haemoglobin tracking, danger-sign watch, and antenatal guidance.',
    },
    postpartum: {
      label: 'Postpartum & Fourth Trimester',
      ageSpan: 'Up to 12 months after birth',
      desc: 'Physical recovery, Edinburgh mood check, and maternal well-being.',
    },
    '40plus': {
      label: 'Perimenopause & Beyond',
      ageSpan: 'Ages 40+',
      desc: 'Cycle transitions, preventive cancer screening schedules, and bone health.',
    },
  },

  instruments: {
    pbac: {
      name: 'Menstrual Flow Check (PBAC)',
      subtitle: 'Pictorial Blood Assessment Chart',
      source: 'Higham et al., BJOG 1990',
      desc: 'Select the pads or tampons you used during your heaviest cycle to calculate your score.',
      thresholdExplanation:
        'A score of 100 or higher indicates menstrual flow exceeding 80 mL, which corresponds to the clinical definition of heavy menstrual bleeding (menorrhagia).',
    },
    hb: {
      name: 'Haemoglobin (Hb) Check',
      subtitle: 'WHO Sea-Level Cut-offs',
      source: 'World Health Organization (2011)',
      desc: 'Enter your latest blood test haemoglobin value to understand standard reference ranges.',
    },
    epds: {
      name: 'Maternal & Postnatal Mood Check (EPDS)',
      subtitle: 'Edinburgh Postnatal Depression Scale',
      source: 'Cox et al. 1987; Indian validation Fernandes et al. 2021',
      desc: '10 short questions regarding how you have felt over the past 7 days.',
      disclaimer: 'Validated for screening depression, not anxiety or clinical diagnosis.',
    },
    dangerSigns: {
      name: 'Urgent Warning Signs Check',
      subtitle: 'Emergency Clinical Screen',
      source: 'MoHFW / WHO Emergency Referral Guidelines',
      desc: 'Review any critical red-flag signs requiring immediate in-person emergency care.',
    },
  },

  doctorScript: {
    title: 'Ready-to-Share Doctor Discussion Script',
    instruction: 'You can read or show these notes directly to your doctor during your consultation.',
  },

  selfCare: {
    generalAdviceNotice:
      'Safe, non-prescription comfort measures to support your well-being while consulting your physician.',
  },
} as const;
