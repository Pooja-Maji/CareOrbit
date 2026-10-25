import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { LifeStageChips } from './LifeStageChips';
import { HistoryIntake } from './HistoryIntake';
import { ResultDetail } from '../history/ResultDetail';
import { DoctorSummarySheet } from '../summary/DoctorSummarySheet';
import { PdfReportButton } from '../summary/ReportPdf';
import { getAllResultsFromDb } from '../../db/historyRepo';
import { seedDemoPersonaIfEmpty } from '../../lib/seedDemo';
import { useUiStore } from '../../state/uiStore';
import type { AgeBand, LifeStage, ProfileHistory, Result } from '@sthreecare/shared';
import {
  User,
  PhoneCall,
  Shield,
  Activity,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Download,
  Settings,
  Heart,
  Plus,
} from '../../design/ui/Icon';

type ProfileTab = 'reports' | 'profile' | 'history' | 'privacy';

export const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    history,
    setProfile,
    setLifeStage,
    deleteResultFromHistory,
    clearAllHistory,
  } = useAppStore();
  const { showToast } = useUiStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('reports');

  // Profile Form States
  const [name, setName] = useState(profile.name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact?.phone || '');
  const [emergencyRel, setEmergencyRel] = useState(profile.emergencyContact?.relationship || '');
  const [ageBand, setAgeBand] = useState<AgeBand>(profile.ageBand || '20-29');
  const [medHistory, setMedHistory] = useState<ProfileHistory>(profile.history || {});

  // Results & Sheets
  const [savedReports, setSavedReports] = useState<Result[]>(history);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDoctorSheetOpen, setIsDoctorSheetOpen] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  useEffect(() => {
    // Load from IndexedDB and local store
    getAllResultsFromDb().then((dbList) => {
      if (dbList && dbList.length > 0) {
        setSavedReports(dbList);
      } else {
        setSavedReports(history);
      }
    });
  }, [history]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfile({
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        relationship: emergencyRel.trim(),
      },
      ageBand,
      history: medHistory,
    });
    setSaveSuccessNotice(true);
    showToast({
      type: 'success',
      title: 'Profile Saved',
      message: 'Your health profile & preferences have been updated locally.',
    });
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this health check report?')) {
      deleteResultFromHistory(id);
      setSavedReports((prev) => prev.filter((r) => r.id !== id));
      showToast({
        type: 'info',
        title: 'Report Deleted',
        message: 'Screening entry removed from local history.',
      });
    }
  };

  const handleExportJson = () => {
    const exportData = {
      profile,
      history: savedReports,
      exportedAt: new Date().toISOString(),
      app: 'SthreeCare Life-Stage Health Compass',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sthreecare_dossier_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ageBands: { id: AgeBand; label: string }[] = [
    { id: '13-19', label: '13–19 (Teen)' },
    { id: '20-29', label: '20–29 (Young Adult)' },
    { id: '30-39', label: '30–39 (Adult)' },
    { id: '40-49', label: '40–49 (Perimenopause)' },
    { id: '50plus', label: '50+ (Postmenopause)' },
  ];

  // Calculate total clinical flags across all saved reports
  const totalFlagsCount = savedReports.reduce((sum, r) => sum + (r.flags?.length || 0), 0);

  const displayName = profile.name || name || 'My Health Profile';
  const displayPhone = profile.phoneNumber || phoneNumber ? `+91 ${profile.phoneNumber || phoneNumber}` : 'No phone set';
  const displayEmergency = profile.emergencyContact?.name || emergencyName ? `Emergency: ${profile.emergencyContact?.name || emergencyName}` : 'No emergency contact set';

  return (
    <div className="space-y-6">
      {/* Patient Profile Header Card */}
      <div className="p-6 rounded-[24px] bg-white border border-plum-soft shadow-lifted">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-plum flex items-center justify-center text-white text-2xl font-heading font-bold shadow-soft flex-shrink-0">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-heading font-bold text-ink tracking-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-plum-soft text-plum border border-plum/20 capitalize">
                  {profile.lifeStage} Stage
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-teal bg-teal-soft px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" />
                  <span>On-Device Vault</span>
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1 flex items-center gap-2">
                <span>{displayPhone}</span>
                <span>•</span>
                <span>Age {profile.ageBand || ageBand}</span>
                <span>•</span>
                <span>{displayEmergency}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/assess')}
              icon={<Plus className="w-4 h-4" />}
              className="shadow-soft"
            >
              Start New Check
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/history')}
              icon={<Activity className="w-4 h-4" />}
            >
              View Care Thread
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-plum-soft/60">
          <div className="p-3 rounded-xl bg-white border border-plum-soft/80 shadow-xs">
            <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
              Saved Reports
            </span>
            <span className="text-xl font-heading font-bold text-plum mt-0.5 block">
              {savedReports.length} {savedReports.length === 1 ? 'Check' : 'Checks'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-plum-soft/80 shadow-xs">
            <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
              Clinical Flags
            </span>
            <span className="text-xl font-heading font-bold text-coral mt-0.5 block">
              {totalFlagsCount} {totalFlagsCount === 1 ? 'Notice' : 'Notices'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-plum-soft/80 shadow-xs">
            <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
              Latest Assessment
            </span>
            <span className="text-sm font-semibold text-ink mt-1 block truncate">
              {savedReports[0]?.date ? new Date(savedReports[0].date).toLocaleDateString() : 'Ready to start'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-plum-soft/80 shadow-xs">
            <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider block">
              Data Boundary
            </span>
            <span className="text-xs font-semibold text-teal mt-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Client-Side</span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-plum-soft gap-1 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-plum text-plum bg-white shadow-xs'
              : 'border-transparent text-ink-muted hover:text-ink hover:bg-plum-soft/30'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Saved Health Reports ({savedReports.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-plum text-plum bg-white shadow-xs'
              : 'border-transparent text-ink-muted hover:text-ink hover:bg-plum-soft/30'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Patient Info & Life Stage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-plum text-plum bg-white shadow-xs'
              : 'border-transparent text-ink-muted hover:text-ink hover:bg-plum-soft/30'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Medical & Reproductive History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'border-plum text-plum bg-white shadow-xs'
              : 'border-transparent text-ink-muted hover:text-ink hover:bg-plum-soft/30'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy & Data Vault</span>
        </button>
      </div>

      {/* Tab 1: Saved Health Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-heading font-bold text-ink">
                Saved Reports
              </h2>
              <p className="text-xs text-ink-muted">
                Tap a report to open it. Download any as PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="teal"
                size="sm"
                onClick={handleExportJson}
                icon={<Download className="w-3.5 h-3.5" />}
                className="text-xs shadow-soft"
              >
                Backup
              </Button>
            </div>
          </div>

          {savedReports.length === 0 ? (
            <Card variant="plumSoft" padding="lg" className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto text-plum shadow-soft">
                <FileText className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-heading font-bold text-ink">
                  No reports yet
                </h3>
                <p className="text-xs text-ink-muted">
                  Do a health check to create your first report.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/assess')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Your First Check
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedReports.map((item, idx) => {
                const pbacScore = item.scores?.['pbac'];
                const hbScore = item.scores?.['hb'];
                const epdsScore = item.scores?.['epds'];

                return (
                  <div
                    key={item.id || idx}
                    className="tile p-5 rounded-card bg-white border border-plum-soft shadow-soft space-y-4 cursor-pointer"
                    onClick={() => {
                      setSelectedResult(item);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-plum-soft/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-plum-soft flex items-center justify-center text-plum font-bold text-xs">
                          #{savedReports.length - idx}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-ink">
                              Health report
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-plum-soft text-plum uppercase">
                              {item.stage} Stage
                            </span>
                          </div>
                          <span className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(item.date).toLocaleString()}</span>
                            <span>•</span>
                            <span>Rules v{item.rulesVersion}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="teal"
                          size="sm"
                          onClick={() => {
                            setSelectedResult(item);
                            setIsDoctorSheetOpen(true);
                          }}
                          icon={<QrCode className="w-3.5 h-3.5" />}
                          className="!py-1 !px-3 text-xs"
                        >
                          QR
                        </Button>
                        <PdfReportButton
                          result={item}
                          profile={profile}
                          label="PDF"
                          size="sm"
                          className="!py-1 !px-3 text-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResult(item);
                            setIsDetailOpen(true);
                          }}
                          className="!py-1 !px-3 text-xs"
                        >
                          Details
                        </Button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteReport(item.id, e)}
                          className="p-1.5 text-ink-subtle hover:text-emergency hover:bg-emergency-soft rounded-lg transition-colors"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Score badges row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {typeof pbacScore === 'number' && (
                        <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                          pbacScore >= 100
                            ? 'bg-coral-soft border-coral/30 text-coral-dark'
                            : 'bg-cream border-plum-soft text-ink'
                        }`}>
                          <div>
                            <span className="font-semibold block">Period flow</span>
                            <span className="text-[10px] text-ink-subtle">Cut-off: 100 pts</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm block">{pbacScore} pts</span>
                            <span className="text-[10px] font-semibold">
                              {pbacScore >= 100 ? 'High' : 'In range'}
                            </span>
                          </div>
                        </div>
                      )}

                      {typeof hbScore === 'number' && (
                        <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                          hbScore < 12.0
                            ? 'bg-amber-soft border-amber/30 text-amber-dark'
                            : 'bg-teal-soft border-teal/30 text-teal-dark'
                        }`}>
                          <div>
                            <span className="font-semibold block">Haemoglobin (Hb)</span>
                            <span className="text-[10px] text-ink-subtle">WHO standard</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm block">{hbScore} g/dL</span>
                            <span className="text-[10px] font-semibold">
                              {hbScore < 12.0 ? 'Low' : 'In range'}
                            </span>
                          </div>
                        </div>
                      )}

                      {typeof epdsScore === 'number' && (
                        <div className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                          epdsScore >= 13
                            ? 'bg-coral-soft border-coral/30 text-coral-dark'
                            : 'bg-cream border-plum-soft text-ink'
                        }`}>
                          <div>
                            <span className="font-semibold block">Mood</span>
                            <span className="text-[10px] text-ink-subtle">Threshold: 13 pts</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm block">{epdsScore} / 30</span>
                            <span className="text-[10px] font-semibold">
                              {epdsScore >= 13 ? 'High' : 'In range'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Flags List */}
                    {item.flags && item.flags.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                          Clinical Findings & Next Steps ({item.flags.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.flags.map((flag) => (
                            <span
                              key={flag.id}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
                                flag.level === 'urgent'
                                  ? 'bg-emergency-soft text-emergency border-emergency/30'
                                  : flag.level === 'discuss'
                                  ? 'bg-coral-soft text-coral-dark border-coral/30'
                                  : 'bg-plum-soft text-plum border-plum/20'
                              }`}
                            >
                              <span>•</span>
                              <span>{flag.title}</span>
                              <span className="text-[10px] opacity-75">({flag.source})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Personal Profile & Life-Stage */}
      {activeTab === 'profile' && (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-ink">
              Patient Identification & Life-Stage Compass
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Updates how the Compass tailors cancer screening schedules, questions, and reference thresholds.
            </p>
          </div>

          {saveSuccessNotice && (
            <div className="p-3 rounded-xl bg-teal-soft border border-teal/30 text-teal text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Patient profile successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-plum-soft bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-plum-soft bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum"
                  required
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-xl bg-cream border border-plum-soft space-y-3">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emergency" />
                <span>Emergency Contact Person (For Danger Signs / 108 Alert)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-lg border border-plum-soft bg-white text-ink text-xs focus:ring-1 focus:ring-plum"
                />
                <input
                  type="tel"
                  placeholder="Emergency Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-lg border border-plum-soft bg-white text-ink text-xs focus:ring-1 focus:ring-plum"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Sister, Doctor)"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="px-3.5 py-2.5 rounded-lg border border-plum-soft bg-white text-ink text-xs focus:ring-1 focus:ring-plum"
                />
              </div>
            </div>

            {/* Life Stage */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                Select Your Current Life Stage
              </label>
              <LifeStageChips
                selectedStage={profile.lifeStage}
                onSelectStage={(stage: LifeStage) => setLifeStage(stage)}
              />
            </div>

            {/* Age Band */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                Age Bracket
              </label>
              <div className="flex flex-wrap gap-2">
                {ageBands.map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setAgeBand(band.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      ageBand === band.id
                        ? 'bg-plum text-white border-plum shadow-soft'
                        : 'bg-white text-ink-muted border-plum-soft hover:bg-plum-soft/30'
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={<CheckCircle className="w-4 h-4" />}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Medical & Reproductive History */}
      {activeTab === 'history' && (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-ink">
              Reproductive & Clinical Background
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Enables deterministic linking of multi-cycle symptoms with clinical escalation rules.
            </p>
          </div>

          <HistoryIntake
            history={medHistory}
            onChange={(newHist) => {
              setMedHistory(newHist);
              setProfile({ history: newHist });
            }}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => handleSaveProfile()}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Update History Records
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 4: Privacy & Data Controls */}
      {activeTab === 'privacy' && (
        <Card variant="default" padding="lg" className="border border-plum-soft shadow-soft space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-ink">
              On-Device Privacy & Data Ownership
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              SthreeCare operates on a zero-health-data backend boundary. You maintain complete control over your records.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-teal-soft/40 border border-teal/20 text-xs text-ink space-y-1">
              <div className="font-semibold text-teal-dark flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal" />
                <span>Zero Server Transmission Guarantee</span>
              </div>
              <p className="text-ink-muted">
                All symptom inputs, menstrual counts, haemoglobin values, and mood questionnaires are processed and stored exclusively inside your browser's IndexedDB. The backend API handles only facility directories and volunteer coordination.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-plum-soft space-y-3">
              <h4 className="font-semibold text-sm text-ink">Export or Backup Your Data</h4>
              <p className="text-xs text-ink-muted">
                Download a complete, offline JSON copy of your profile, screening records, and Care Thread history.
              </p>
              <Button variant="outline" size="sm" onClick={handleExportJson} icon={<Download className="w-4 h-4" />}>
                Export My Health Dossier (.json)
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-emergency-soft/50 border border-emergency/20 space-y-3">
              <h4 className="font-semibold text-sm text-emergency">Clear Local Health Records</h4>
              <p className="text-xs text-ink-muted">
                Permanently purge all saved screening reports, scores, and cached assessment logs from this device.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all screening reports? This cannot be undone.')) {
                    clearAllHistory();
                    setSavedReports([]);
                    showToast({
                      type: 'info',
                      title: 'History Cleared',
                      message: 'All screening logs purged from browser storage.',
                    });
                  }
                }}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Clear All Saved Reports
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Detail Viewer Sheet */}
      <ResultDetail
        result={selectedResult}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenDoctorSummary={(res) => {
          setSelectedResult(res);
          setIsDoctorSheetOpen(true);
        }}
      />

      {/* Doctor Summary Sheet with QR Code */}
      {selectedResult && (
        <DoctorSummarySheet
          isOpen={isDoctorSheetOpen}
          onClose={() => setIsDoctorSheetOpen(false)}
          result={selectedResult}
          profile={profile}
        />
      )}
    </div>
  );
};
