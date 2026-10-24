import pbacRule from '../../../../common/rules/pbac.json';
import hbRule from '../../../../common/rules/hb_who.json';
import epdsRule from '../../../../common/rules/epds.json';
import dangerSignsRule from '../../../../common/rules/danger_signs.json';
import escalationRule from '../../../../common/rules/escalation.json';
import screeningRule from '../../../../common/rules/screening.json';

export const rules = {
  pbac: pbacRule,
  hb: hbRule,
  epds: epdsRule,
  dangerSigns: dangerSignsRule,
  escalation: escalationRule,
  screening: screeningRule,
};

export const RULES_VERSION = '1.0.0';
