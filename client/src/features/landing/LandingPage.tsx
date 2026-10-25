import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import {
  Heart,
  Shield,
  Activity,
  Sparkles,
  ArrowRight,
  PhoneCall,
  CheckCircle,
  LogIn,
  UserPlus,
  FileText,
  Clock,
} from '../../design/ui/Icon';
import { COPY } from '../../copy';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useAppStore();

  const handleStart = () => {
    if (isLoggedIn) {
      navigate('/assess');
    } else {
      navigate('/login');
    }
  };

  const pillars = [
    {
      icon: <Activity className="w-6 h-6 text-plum" />,
      title: 'Validated Screening, Zero Guesswork',
      desc: 'Uses recognized clinical tools—PBAC menstrual blood assessment, WHO haemoglobin cut-offs, and Edinburgh mood scale. Never guesses diseases.',
      badge: 'Scientific',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-teal" />,
      title: 'Connected Clinical Intelligence',
      desc: 'Links heavy flow patterns with lab haemoglobin values to highlight iron deficiency risks for discussion with your doctor.',
      badge: 'Deterministic',
    },
    {
      icon: <Shield className="w-6 h-6 text-coral" />,
      title: '100% On-Device Privacy',
      desc: 'All health questions, menstrual charts, and scores stay securely in your browser. No sensitive personal health data leaves your phone.',
      badge: 'Zero Telemetry',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-plum-soft border border-plum/20 text-xs font-semibold text-plum shadow-xs">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span>PS1: Women's Healthcare • recHERsion'26 (ACM-W, NITK)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold text-ink tracking-tight leading-[1.15]">
          Life-Stage Health Compass <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-plum via-[#883A76] to-teal">
            for Women
          </span>
        </h1>

        <p className="text-base sm:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto font-normal">
          Runs validated screening tools for each life stage, connects the results, tells you exactly what to ask a doctor, and supports follow-through.
        </p>

        {/* Pitch Quote Card */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-plum-soft/80 shadow-soft max-w-2xl mx-auto text-left relative overflow-hidden group hover:border-plum/40 transition-all">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-plum to-teal" />
          <p className="text-xs sm:text-sm text-ink italic font-serif leading-relaxed pl-3">
            "Women don't fall short of care because they don't care. They fall short because no one connects what she feels, what to do, and who can help. We do."
          </p>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            className="w-full sm:w-auto shadow-lifted hover:scale-[1.02] text-sm sm:text-base !px-8"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Start Your Health Check
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto text-sm sm:text-base !px-6"
            icon={<FileText className="w-4 h-4" />}
          >
            My Saved Reports & Profile
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto text-sm sm:text-base !px-6"
          >
            Dashboard
          </Button>
        </div>

        {/* Auth Quick Bar */}
        {!isLoggedIn ? (
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-ink-muted">
            <span>New here?</span>
            <Link to="/register" className="font-bold text-plum hover:underline flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
            <span>•</span>
            <Link to="/login" className="font-bold text-teal hover:underline flex items-center gap-1">
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (Phone & Password)</span>
            </Link>
          </div>
        ) : (
          <div className="pt-2 text-xs text-ink-muted">
            Signed in as <strong className="text-plum">{profile.name || 'Ananya Sharma'}</strong> (+91 {profile.phoneNumber || '9876543210'}).{' '}
            <Link to="/profile" className="text-teal font-semibold hover:underline">
              View your saved reports →
            </Link>
          </div>
        )}
      </section>

      {/* Signature Care Thread Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="p-6 rounded-card bg-white border border-plum-soft/80 shadow-soft hover-lift transition-all space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cream border border-plum-soft flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                {p.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-plum-soft text-plum">
                {p.badge}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-ink">
              {p.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 4 Life-Stage Check Modules */}
      <section className="p-6 sm:p-10 rounded-[28px] bg-gradient-to-b from-plum-soft/60 to-cream border border-plum/10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-plum border border-plum/10">
            <Clock className="w-3.5 h-3.5 text-teal" />
            <span>The 4 Deterministic Screening Instruments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Screening Modules Tailored to Your Stage
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            The Compass reshapes its questions, risk flags, and referral rules depending on where you are in life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-plum-soft shadow-xs space-y-3 hover-lift transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-plum uppercase tracking-wider bg-plum-soft px-2 py-0.5 rounded-full">
                Flow Check
              </span>
              <span className="text-[10px] text-ink-subtle">Higham 1990</span>
            </div>
            <h4 className="font-heading font-bold text-base text-ink">PBAC Picture Chart</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Tap illustrated pads to calculate whether your cycle exceeds the 100-point menorrhagia cut-off.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-plum-soft shadow-xs space-y-3 hover-lift transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal uppercase tracking-wider bg-teal-soft px-2 py-0.5 rounded-full">
                Blood Track
              </span>
              <span className="text-[10px] text-ink-subtle">WHO (2011)</span>
            </div>
            <h4 className="font-heading font-bold text-base text-ink">WHO Hb Cut-offs</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Enter your haemoglobin lab value to categorize severity against international sea-level standards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-plum-soft shadow-xs space-y-3 hover-lift transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-coral uppercase tracking-wider bg-coral-soft px-2 py-0.5 rounded-full">
                Mood Scale
              </span>
              <span className="text-[10px] text-ink-subtle">Cox 1987</span>
            </div>
            <h4 className="font-heading font-bold text-base text-ink">EPDS Mood Scale</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              10 friendly swipe cards with immediate safety safeguards for postpartum & maternal distress.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-plum-soft shadow-xs space-y-3 hover-lift transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emergency uppercase tracking-wider bg-emergency-soft px-2 py-0.5 rounded-full">
                Emergency
              </span>
              <span className="text-[10px] text-ink-subtle">MoHFW / WHO</span>
            </div>
            <h4 className="font-heading font-bold text-base text-ink">Emergency Takeover</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Immediate full-screen guidance with 1-click Call 108 for critical medical danger signs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
