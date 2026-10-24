import React from 'react';
import { Info } from '../../design/ui/Icon';

export interface EvidenceChipProps {
  source: string;
  ruleId?: string;
  onClick?: () => void;
}

export const EvidenceChip: React.FC<EvidenceChipProps> = ({
  source,
  ruleId,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-plum/20 text-plum hover:bg-plum-soft/40 transition-colors shadow-xs"
      title="Click to view published clinical source and rule details"
    >
      <Info className="w-3.5 h-3.5 text-plum" />
      <span className="truncate max-w-[200px]">{source}</span>
    </button>
  );
};
