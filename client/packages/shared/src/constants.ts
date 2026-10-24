/**
 * SthreeCare - Shared Constants and Color Tokens
 * From Project Plan Section 8 (Warm Clinical Design System) & Section 4
 */

export const RULES_VERSION = '1.0.0';

export const EMERGENCY_HELPLINE_INDIA = '108';

export const COLORS = {
  cream: '#FBF7F4',
  plum: '#6B2D5C',
  plumSoft: '#F5ECF3',
  teal: '#1F6F6B',
  coral: '#E4735A',
  amber: '#B7791F',
  red: '#B3261E',
  ink: '#241B22',
} as const;

export const PBAC_THRESHOLD = 100;
export const EPDS_THRESHOLD = 13;
export const EPDS_SELF_HARM_ITEM_INDEX = 10;

export const WHO_HB_CUTOFFS = {
  nonPregnant: {
    normalMin: 12.0,
    mild: { min: 11.0, max: 11.9 },
    moderate: { min: 8.0, max: 10.9 },
    severeBelow: 8.0,
  },
  pregnant: {
    normalMin: 11.0,
    mild: { min: 10.0, max: 10.9 },
    moderate: { min: 7.0, max: 9.9 },
    severeBelow: 7.0,
  },
} as const;
