/**
 * Care Orbit - Volunteer Match Card
 * Owner: Person B (Stage 11)
 * 
 * Displays the matched verified volunteer while maintaining strict
 * boundary: volunteers do non-medical tasks only.
 */

import React from 'react';
import type { Volunteer } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { CheckCircle, Shield, PhoneCall, Heart } from '../../design/ui/Icon';

interface VolunteerMatchCardProps {
  volunteer: Volunteer;
  taskType: string;
}

export const VolunteerMatchCard: React.FC<VolunteerMatchCardProps> = ({
  volunteer,
  taskType,
}) => {
  return (
    <Card variant="default" padding="lg" className="border-2 border-teal/30 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center font-heading font-bold text-lg shadow-soft flex-shrink-0">
            {volunteer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base sm:text-lg text-ink">
                {volunteer.name}
              </h3>
              {volunteer.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal bg-teal-soft px-2 py-0.5 rounded-full border border-teal/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Volunteer</span>
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted">
              {volunteer.badge || 'Accredited Community Companion'} • {volunteer.hours} hours contributed
            </p>
          </div>
        </div>

        <span className="text-xs text-ink-subtle">
          Matched via Time Bank
        </span>
      </div>

      {/* Languages & Skills */}
      <div className="p-3 rounded-xl bg-cream/70 border border-plum-soft/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">Languages spoken:</span>
          <span className="text-plum font-medium">
            {volunteer.languages.join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">Assigned non-medical role:</span>
          <span className="text-teal font-medium capitalize">
            {taskType} assistance
          </span>
        </div>
      </div>

      {/* Strict Role Boundary Notice */}
      <div className="p-3 rounded-lg bg-amber-soft/40 border border-amber/30 text-[11px] text-ink leading-relaxed space-y-0.5">
        <strong className="text-amber-dark flex items-center gap-1">
          <span>ℹ</span>
          <span>Role Boundary & Safeguarding:</span>
        </strong>
        <p className="text-ink-muted">
          Volunteers assist with hospital registration, queue navigation, language translation, and emotional accompaniment. They never perform medical procedures, make diagnoses, or handle medications.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-plum-soft/30">
        <span className="text-xs text-ink-subtle">
          Zero health records shared with volunteer
        </span>

        {volunteer.phone && (
          <a
            href={`tel:${volunteer.phone}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal text-white hover:bg-teal/90 text-xs font-semibold shadow-soft transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Volunteer Coordinator</span>
          </a>
        )}
      </div>
    </Card>
  );
};
