/**
 * SthreeCare - Storage Notice & Privacy Controls
 * Owner: Person B (Stage 4 & Privacy Boundary)
 * 
 * Verifies navigator.storage.persist() status and provides discreet mode
 * toggle and instant on-device health record wipe.
 */

import React, { useEffect, useState } from 'react';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Shield, CheckCircle, Info } from '../../design/ui/Icon';
import { checkStorageStatus, requestStoragePersistence, type StorageStatus } from '../../db/persist';
import { clearAllLocalHealthData } from '../../db/clearAll';
import { useUiStore } from '../../state/uiStore';

export const StorageNotice: React.FC = () => {
  const { discreetMode, toggleDiscreetMode, showToast } = useUiStore();
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    checkStorageStatus().then(setStorageStatus);
  }, []);

  const handlePersistRequest = async () => {
    const granted = await requestStoragePersistence();
    const updated = await checkStorageStatus();
    setStorageStatus(updated);
    if (granted) {
      showToast({
        type: 'success',
        title: 'Persistent Storage Granted',
        message: 'Your browser will not clear your health records during storage cleanup.',
      });
    } else {
      showToast({
        type: 'info',
        title: 'Storage Persistence Status',
        message: 'Browser storage is managed according to system device preferences.',
      });
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to completely erase all local health checks, timeline, and settings from this device? This action cannot be undone.')) {
      setIsWiping(true);
      await clearAllLocalHealthData();
      showToast({
        type: 'warning',
        title: 'All Local Health Data Erased',
        message: 'IndexedDB stores and cached records have been purged.',
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-plum-soft/60 shadow-soft space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-soft flex items-center justify-center text-teal">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-ink">
              Private by design
            </h4>
            <p className="text-[11px] text-ink-muted">
              Stored on this device only
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={discreetMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleDiscreetMode}
            className="text-xs"
          >
            {discreetMode ? 'Discreet Mode: ON' : 'Toggle Discreet Mode'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearData}
            disabled={isWiping}
            className="text-xs text-emergency hover:bg-emergency/10"
          >
            {isWiping ? 'Erasing...' : 'Wipe Device Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};
