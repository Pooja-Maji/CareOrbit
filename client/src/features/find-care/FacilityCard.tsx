/**
 * SthreeCare - Facility Card
 * Owner: Person B (Stage 11)
 * 
 * Displays healthcare facility details with services, phone, address,
 * distance, and explicit "Simulated availability" label per project spec.
 */

import React from 'react';
import type { Facility } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { PhoneCall, Heart, ArrowRight, Shield } from '../../design/ui/Icon';

interface FacilityCardProps {
  facility: Facility;
  onRequestHelpForFacility?: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onRequestHelpForFacility,
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'phc':
        return { label: 'Primary Health Centre (PHC)', bg: 'bg-teal-soft text-teal' };
      case 'chc':
        return { label: 'Community Health Centre (CHC)', bg: 'bg-plum-soft text-plum' };
      case 'district_hospital':
        return { label: 'District Hospital', bg: 'bg-indigo-50 text-indigo-700' };
      case 'diagnostic_lab':
        return { label: 'Diagnostic Blood Lab', bg: 'bg-amber-soft text-amber-dark' };
      case 'teleconsult':
        return { label: 'Teleconsultation Network', bg: 'bg-emerald-50 text-emerald-700' };
      default:
        return { label: 'Healthcare Provider', bg: 'bg-cream text-ink' };
    }
  };

  const badge = getTypeBadge(facility.type);

  return (
    <Card variant="default" padding="md" className="space-y-4 border border-plum-soft/70 shadow-soft hover:border-plum transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.bg}`}>
              {badge.label}
            </span>
            {typeof facility.distanceKm === 'number' && (
              <span className="text-xs font-semibold text-ink-subtle">
                • {facility.distanceKm > 0 ? `${facility.distanceKm} km away` : 'Virtual / Anywhere'}
              </span>
            )}
          </div>
          <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
            {facility.name}
          </h3>
        </div>

        {/* Clear Prototype Warning Tag */}
        <span className="self-start sm:self-center text-[10px] font-bold text-amber-dark uppercase tracking-wider px-2 py-0.5 rounded bg-amber-soft border border-amber/20">
          Simulated Availability
        </span>
      </div>

      {/* Address & Hours */}
      <div className="space-y-1 text-xs text-ink-muted">
        <p>📍 {facility.address}</p>
        <p>🕒 {facility.availability}</p>
      </div>

      {/* Services Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle block">
          Available Clinical Services:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {facility.services.map((serv, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md bg-cream text-[11px] font-medium text-ink border border-plum-soft/40"
            >
              {serv}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-plum-soft/30">
        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            className="text-xs font-semibold text-plum hover:underline inline-flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{facility.phone}</span>
          </a>
        )}

        <div className="flex items-center gap-2">
          {onRequestHelpForFacility && (
            <Button
              variant="teal"
              size="sm"
              onClick={() => onRequestHelpForFacility(facility)}
              className="text-xs"
            >
              Request Volunteer Companion
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
