/**
 * SthreeCare - Backup & Export Card
 * Owner: Person B (Stage 4 & Privacy Boundary)
 * 
 * Allows users to own their health record: export local data as JSON
 * or restore previous backups.
 */

import React, { useState, useRef } from 'react';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Shield, Sparkles, CheckCircle } from '../../design/ui/Icon';
import { exportAllDataToJson, downloadBackupFile, importDataFromJson } from '../../db/exportImport';
import { useUiStore } from '../../state/uiStore';

export const BackupPrompt: React.FC = () => {
  const { showToast } = useUiStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportAllDataToJson();
      const dateStr = new Date().toISOString().split('T')[0];
      downloadBackupFile(json, `SthreeCare_Health_Backup_${dateStr}.json`);
      showToast({
        type: 'success',
        title: 'Health Backup Downloaded',
        message: 'Your complete screening record is saved safely on your device.',
      });
    } catch (e: any) {
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: e.message || 'Unable to generate backup.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const res = await importDataFromJson(text);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Data Restored',
          message: res.message,
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast({
          type: 'error',
          title: 'Import Error',
          message: res.message,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card variant="default" padding="md" className="border border-plum-soft shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal" />
            <h4 className="font-heading font-semibold text-sm text-ink">
              Backup
            </h4>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Data lives only on this device. Save a copy.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs"
          >
            {isExporting ? 'Preparing...' : 'Export backup'}
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            Restore
          </Button>
        </div>
      </div>
    </Card>
  );
};
