import type { Flag, FlagLevel } from '@sthreecare/shared';

export interface ScorerOutput {
  instrumentId: string;
  score?: number;
  category?: string;
  flags: Flag[];
  isUrgentEmergency?: boolean;
}

export interface RuleLoader {
  pbacRule: any;
  hbRule: any;
  epdsRule: any;
  dangerSignsRule: any;
  escalationRule: any;
  screeningRule: any;
}
