import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import {
  PhoneCall,
  Shield,
  Menu,
  X,
  User,
  Activity,
  FileText,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  Info,
  Calendar,
  AlertTriangle,
  QrCode,
  Download,
} from '../design/ui/Icon';
import { COPY } from '../copy';

export const Header: React.FC = () => {
  const { profile, currentUser, logout, history } = useAppStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const lifeStageLabel = COPY.lifeStages[profile.lifeStage]?.label || 'General';
  const realName = currentUser?.name || profile.name || 'Patient';
  const realPhone = currentUser?.phoneNumber || profile.phoneNumber || '';
  const userInitials = realName.trim() ? realName.trim().slice(0, 2).toUpperCase() : 'SC';

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenuAndNavigate = (to: string) => {
    setIsMenuOpen(false);
    navigate(to);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBF7F4]/90 backdrop-blur-md border-b border-[#6B2D5C]/10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B2D5C] via-[#883A76] to-[#511F45] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-all">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#1F6F6B] rounded-full border-2 border-[#FBF7F4] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-[#241B22] tracking-tight group-hover:text-[#6B2D5C] transition-colors">
                  SthreeCare
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5ECF3] text-[#6B2D5C] border border-[#6B2D5C]/20">
                  Compass
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-[#8C7F89] font-medium">
                Women's Life-Stage Health
              </p>
            </div>
          </Link>

          {/* Top Quick Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-[#6B2D5C]/10 shadow-xs">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isActive
                    ? 'bg-[#6B2D5C] text-white shadow-soft'
                    : 'text-[#61555E] hover:text-[#6B2D5C] hover:bg-[#F5ECF3]/50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/assess"
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#6B2D5C] text-white shadow-soft'
                    : 'text-[#61555E] hover:text-[#6B2D5C] hover:bg-[#F5ECF3]/50'
                }`
              }
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Health Checks</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#6B2D5C] text-white shadow-soft'
                    : 'text-[#61555E] hover:text-[#6B2D5C] hover:bg-[#F5ECF3]/50'
                }`
              }
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Saved Reports</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#6B2D5C] text-white shadow-soft'
                    : 'text-[#61555E] hover:text-[#6B2D5C] hover:bg-[#F5ECF3]/50'
                }`
              }
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </NavLink>

            <NavLink
              to="/time-bank"
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#1F6F6B] text-white shadow-soft'
                    : 'text-[#1F6F6B] hover:bg-[#E8F4F3]'
                }`
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Time Bank</span>
            </NavLink>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* User Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white border border-[#6B2D5C]/15 hover:border-[#6B2D5C]/40 text-xs font-semibold text-[#241B22] shadow-xs hover-lift transition-all"
              title="Open My Profile & Saved Reports"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6B2D5C] to-[#1F6F6B] text-white flex items-center justify-center text-[10px] font-bold">
                {userInitials}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate">{realName}</span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] bg-[#F5ECF3] text-[#6B2D5C] capitalize">
                {profile.lifeStage}
              </span>
            </Link>

            {/* Emergency 108 Action Button */}
            <button
              type="button"
              onClick={() => navigate('/emergency')}
              className="px-3.5 py-1.5 rounded-full bg-[#B3261E] hover:bg-[#8C1D18] text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition-transform active:scale-95 animate-pulse-glow"
              title="Immediate Emergency Screen (Calls 108)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>108</span>
            </button>

            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-2xl border border-[#6B2D5C]/20 bg-white text-[#241B22] hover:bg-[#F5ECF3] hover:text-[#6B2D5C] transition-all shadow-xs flex items-center justify-center gap-1.5 group"
              aria-label="Open Features Menu"
              title="Open SthreeCare Features Directory"
            >
              <Menu className="w-5 h-5 text-[#6B2D5C] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-xs font-bold text-[#6B2D5C]">
                Features
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* COMPREHENSIVE FEATURES DRAWER (HAMBURGER MENU) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-[#241B22]/40 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md h-full bg-[#FBF7F4] border-l border-[#6B2D5C]/15 shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#6B2D5C]/10 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B2D5C] to-[#1F6F6B] text-white flex items-center justify-center font-bold text-sm shadow-soft">
                  {userInitials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#241B22] leading-tight">
                    {realName}
                  </h3>
                  <p className="text-xs text-[#61555E]">
                    {realPhone ? `+91 ${realPhone} • ` : ''}{lifeStageLabel} Stage
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-[#8C7F89] hover:text-[#241B22] hover:bg-[#F5ECF3] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: All Platform Features Categorized */}
            <div className="p-5 space-y-6 flex-1">
              {/* Category 1: Clinical Health Checks */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#6B2D5C]" />
                    <span>Screening & Health Checks</span>
                  </span>
                  <span className="text-[10px] text-[#8C7F89] bg-[#F5ECF3] px-2 py-0.5 rounded-full font-semibold">
                    Deterministic
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/assess')}
                    className="p-3.5 rounded-2xl bg-white border border-[#6B2D5C]/10 hover:border-[#6B2D5C]/30 text-left transition-all hover-lift shadow-xs flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5ECF3] flex items-center justify-center text-[#6B2D5C] group-hover:scale-105 transition-transform">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#241B22] group-hover:text-[#6B2D5C]">
                          Start Comprehensive Health Check
                        </h4>
                        <p className="text-xs text-[#61555E]">
                          Runs PBAC flow, WHO anaemia & mood check
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7F89] group-hover:text-[#6B2D5C]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/assess')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#6B2D5C]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">PBAC Menstrual Pad Calculator</span>
                        <span className="text-[11px] text-[#8C7F89]">Validated 100-point menorrhagia threshold</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/assess')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#1F6F6B]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">WHO Haemoglobin & Anaemia Test</span>
                        <span className="text-[11px] text-[#8C7F89]">Lab report lookup (mild/moderate/severe)</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/assess')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#E4735A]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">EPDS Mood & Postpartum Screening</span>
                        <span className="text-[11px] text-[#8C7F89]">10-item validated emotional wellbeing scale</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>
                </div>
              </div>

              {/* Category 2: Saved Health Dossier & Records */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#6B2D5C]" />
                    <span>My Health Dossier & Records</span>
                  </span>
                  <span className="text-[10px] text-[#1F6F6B] bg-[#E8F4F3] px-2 py-0.5 rounded-full font-semibold">
                    {history.length} Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/profile')}
                    className="p-3.5 rounded-2xl bg-white border border-[#6B2D5C]/10 hover:border-[#6B2D5C]/30 text-left transition-all hover-lift shadow-xs flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F4F3] flex items-center justify-center text-[#1F6F6B] group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#241B22] group-hover:text-[#6B2D5C]">
                          Saved Reports Dossier
                        </h4>
                        <p className="text-xs text-[#61555E]">
                          Review past checks, scores & doctor sheets
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7F89] group-hover:text-[#6B2D5C]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/history')}
                    className="p-3.5 rounded-2xl bg-white border border-[#6B2D5C]/10 hover:border-[#6B2D5C]/30 text-left transition-all hover-lift shadow-xs flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5ECF3] flex items-center justify-center text-[#6B2D5C] group-hover:scale-105 transition-transform">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#241B22] group-hover:text-[#6B2D5C]">
                          Care Thread Timeline
                        </h4>
                        <p className="text-xs text-[#61555E]">
                          Longitudinal trajectory across months & cycles
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7F89] group-hover:text-[#6B2D5C]" />
                  </button>
                </div>
              </div>

              {/* Category 3: Community Care & Support */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1F6F6B]" />
                  <span>Support & Care Navigation</span>
                </span>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/time-bank')}
                    className="p-3.5 rounded-2xl bg-white border border-[#6B2D5C]/10 hover:border-[#1F6F6B]/30 text-left transition-all hover-lift shadow-xs flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F4F3] flex items-center justify-center text-[#1F6F6B] group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#241B22] group-hover:text-[#1F6F6B]">
                          Healthcare Time Bank
                        </h4>
                        <p className="text-xs text-[#61555E]">
                          Community credits, volunteer matching
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C7F89] group-hover:text-[#1F6F6B]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/support')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-[#1F6F6B]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">Request Volunteer Help</span>
                        <span className="text-[11px] text-[#8C7F89]">Booking, hospital accompaniment & language</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/find-care')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#6B2D5C]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">Find Nearby Care Facilities</span>
                        <span className="text-[11px] text-[#8C7F89]">Government PHCs, hospitals & diagnostic labs</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => closeMenuAndNavigate('/follow-up')}
                    className="p-3 rounded-xl bg-white/70 border border-[#6B2D5C]/10 hover:bg-white text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#B7791F]" />
                      <div>
                        <span className="text-xs font-bold text-[#241B22] block">Follow-up Care Gap Tracker</span>
                        <span className="text-[11px] text-[#8C7F89]">Never miss a clinician-recommended test</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                  </button>
                </div>
              </div>

              {/* Category 4: Emergency Assistance */}
              <div className="p-4 rounded-2xl bg-[#FDECEB] border border-[#B3261E]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B3261E] uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Emergency Intercept</span>
                  </span>
                  <span className="text-[10px] font-bold bg-[#B3261E] text-white px-2 py-0.5 rounded-full">
                    Toll-Free 108
                  </span>
                </div>
                <p className="text-xs text-[#241B22]">
                  Experiencing heavy sudden haemorrhage, severe pelvic pain, or pregnancy red flags?
                </p>
                <button
                  type="button"
                  onClick={() => closeMenuAndNavigate('/emergency')}
                  className="w-full py-2.5 rounded-xl bg-[#B3261E] hover:bg-[#8C1D18] text-white text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Open Emergency 108 Screen</span>
                </button>
              </div>

              {/* Category 5: About & Sources */}
              <div>
                <button
                  type="button"
                  onClick={() => closeMenuAndNavigate('/about')}
                  className="w-full p-3 rounded-xl bg-white border border-[#6B2D5C]/10 text-xs text-[#61555E] hover:text-[#241B22] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#1F6F6B]" />
                    <span>Scientific Sources, Guidelines & Disclaimer</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8C7F89]" />
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-[#6B2D5C]/10 bg-white sticky bottom-0 z-20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#1F6F6B] font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>On-Device Encrypted Vault</span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-[#B3261E] hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
