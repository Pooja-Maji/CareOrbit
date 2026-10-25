/**
 * SthreeCare - Facility Map Locator (Stretch)
 * Owner: Person B (Stage 11)
 * 
 * Interactive location-based visual locator highlighting public health facilities,
 * primary health centres, and diagnostic labs in the district.
 */

import React, { useState } from 'react';
import type { Facility } from '@sthreecare/shared';
import { Card } from '../../design/ui/Card';

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (f: Facility) => void;
}

export const FacilityMap: React.FC<FacilityMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
}) => {
  return (
    <Card variant="default" padding="none" className="overflow-hidden border border-plum-soft shadow-soft">
      {/* Map Header */}
      <div className="p-3 bg-cream border-b border-plum-soft flex items-center justify-between text-xs font-semibold text-ink">
        <span>Regional Public Health Network Map (Dakshina Kannada / Udupi)</span>
        <span className="text-[10px] text-amber-dark bg-amber-soft px-2 py-0.5 rounded font-bold uppercase">
          Simulated Geo-Pins
        </span>
      </div>

      {/* Stylized Visual Map Grid Canvas */}
      <div className="relative w-full h-64 bg-[#EBF1F0] overflow-hidden">
        {/* Subtle grid lines & roads simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1DDD8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main Highway NH66 representation */}
          <path d="M 50 260 Q 150 140 280 20" stroke="#CBD8D3" strokeWidth="6" fill="none" />
          <path d="M 40 100 Q 180 180 320 220" stroke="#CBD8D3" strokeWidth="4" fill="none" />
          {/* Arabian Sea Coastline */}
          <path d="M 0 30 Q 30 140 10 260 L 0 260 Z" fill="#CFEFF6" />
        </svg>

        {/* Facility Pins */}
        {facilities.map((fac, idx) => {
          const isSelected = selectedFacility?.id === fac.id;
          // Approximate relative placement on canvas
          const positions = [
            { left: '42%', top: '38%' }, // Surathkal PHC
            { left: '30%', top: '18%' }, // Padubidri CHC
            { left: '72%', top: '78%' }, // Wenlock District Hospital
            { left: '48%', top: '46%' }, // Blood Lab
            { left: '80%', top: '25%' }, // Teleconsult
          ];
          const pos = positions[idx % positions.length];

          return (
            <div
              key={fac.id}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => onSelectFacility(fac)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lifted border-2 ${
                  isSelected
                    ? 'bg-plum text-white border-white ring-4 ring-plum/20 scale-110'
                    : fac.type === 'phc' || fac.type === 'chc'
                    ? 'bg-teal text-white border-white'
                    : 'bg-white text-plum border-plum'
                }`}
              >
                <span className="text-[11px] font-bold">
                  {fac.type === 'phc' ? 'P' : fac.type === 'chc' ? 'C' : fac.type === 'district_hospital' ? 'H' : 'L'}
                </span>
              </div>

              {/* Pin tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-ink text-white text-[10px] font-semibold transition-opacity pointer-events-none z-30 shadow-lifted">
                {fac.name} ({fac.distanceKm} km)
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
