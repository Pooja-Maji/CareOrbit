/**
 * SthreeCare - Measurement Units and Conversion Helpers
 */

export const HB_UNIT = 'g/dL';

/**
 * Converts haemoglobin from g/L to g/dL if necessary
 */
export function gLToGdl(val: number): number {
  return Number((val / 10).toFixed(1));
}

/**
 * Rounds Hb to tenths of g/dL per clinical lab standards
 */
export function roundHb(val: number): number {
  return Math.round(val * 10) / 10;
}
