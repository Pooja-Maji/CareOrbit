/**
 * Care Orbit - Find Care Screen
 * Owner: Person B (Stage 11)
 * 
 * Lists verified public health centres (PHCs, CHCs, District Hospitals, Labs)
 * with filters and support request links.
 */

import { PageHeader } from '../../design/ui/PageHeader';
import { MapPin as HdrIcon } from '../../design/ui/Icon';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacilityCard } from './FacilityCard';
import { FacilityMap } from './FacilityMap';
import { getNearbyFacilities } from '../../api/facilitiesApi';
import type { Facility } from '@sthreecare/shared';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { Heart, Search, Shield, ArrowRight } from '../../design/ui/Icon';

export const FindCareScreen: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  useEffect(() => {
    getNearbyFacilities().then((data) => {
      setFacilities(data);
      setLoading(false);
    });
  }, []);

  const filteredFacilities = facilities.filter((f) => {
    const matchesType = selectedType === 'all' || f.type === selectedType;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      f.name.toLowerCase().includes(query) ||
      f.services.some((s) => s.toLowerCase().includes(query)) ||
      f.address.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });

  const handleRequestVolunteer = (facility: Facility) => {
    // Navigate to request support with pre-filled context
    navigate('/support', {
      state: {
        facilityName: facility.name,
        facilityAddress: facility.address,
        taskType: 'navigation',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader icon={<HdrIcon className="w-7 h-7" />} title="Find Care" subtitle="Clinics, labs and doctors near you" tone="teal" actions={<>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="text-xs"
          >
            {showMap ? 'List view' : 'Map view'}
          </Button>
          <Button
            variant="teal"
            size="sm"
            onClick={() => navigate('/support')}
            className="text-xs"
          >
            Get a volunteer
          </Button>
        </div>
      </>} />

      {/* Search and Category Filters */}
      <Card variant="default" padding="md" className="space-y-3 border border-plum-soft shadow-soft">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by facility name, service (e.g. Ferritin, Ultrasound, Delivery)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-9 rounded-xl border border-plum-soft bg-white text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-plum"
            />
            <span className="absolute left-3 top-3 text-ink-subtle">🔍</span>
          </div>

          {/* Type filter chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'phc', label: 'PHCs' },
              { id: 'chc', label: 'CHCs' },
              { id: 'district_hospital', label: 'Hospitals' },
              { id: 'diagnostic_lab', label: 'Blood Labs' },
              { id: 'teleconsult', label: 'Teleconsult' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedType === t.id
                    ? 'bg-plum text-white shadow-soft'
                    : 'bg-cream text-ink-muted hover:bg-plum-soft/50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Optional Map View */}
      {showMap && (
        <FacilityMap
          facilities={filteredFacilities}
          selectedFacility={selectedFacility}
          onSelectFacility={setSelectedFacility}
        />
      )}

      {/* Facilities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-ink-subtle">
          <span>Showing {filteredFacilities.length} facilities</span>
          <span>All consultation fees at Govt PHCs/CHCs are free</span>
        </div>

        {filteredFacilities.length === 0 ? (
          <Card variant="default" padding="lg" className="text-center py-10 border border-plum-soft">
            <p className="text-sm font-semibold text-ink">No facilities match your search criteria.</p>
            <p className="text-xs text-ink-muted mt-1">Try clearing filters or search terms.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onRequestHelpForFacility={handleRequestVolunteer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
