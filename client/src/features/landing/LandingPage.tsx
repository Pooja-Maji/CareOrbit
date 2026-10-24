import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';
import { Heart, Shield, Activity, Sparkles, ArrowRight, PhoneCall, CheckCircle } from '../../design/ui/Icon';
import { COPY } from '../../copy';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useAppStore();

  const handleStart = () => {
    navigate('/login');
  };

  const pillars = [
    {
      icon: <Activity className="w-6 h-6 text-plum" />,
      title: 'Validated Screening, Zero Guesswork',
      desc: 'Uses recognized clinical tools—PBAC menstrual blood assessment, WHO haemoglobin cut-offs, and Edinburgh mood scale. Never guesses diseases.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-teal" />,
      title: 'Connected Clinical Intelligence',
      desc: 'Links heavy flow patterns with lab haemoglobin values to highlight iron deficiency risks for discussion with your doctor.',
    },
    {
      icon: <Shield className="w-6 h-6 text-coral" />,
      title: '100% On-Device Privacy',
      desc: 'All health questions, menstrual charts, and scores stay securely in your browser. No sensitive personal health data leaves your phone.',
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-plum-soft border border-plum/10 text-xs font-semibold text-plum animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span>PS1 Women's Healthcare • recHERsion'26</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-ink tracking-tight leading-tight">
          Life-Stage Health Compass for Women
        </h1>

        <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
          A platform that runs validated screening tools for each life stage, connects the results, tells you exactly what to ask a doctor, and supports follow-through.
        </p>

        {/* Pitch Quote Card */}
        <div className="p-4 rounded-card bg-white border border-plum-soft/80 shadow-soft max-w-xl mx-auto text-left">
          <p className="text-xs sm:text-sm text-ink italic font-serif leading-relaxed">
            "Women don't fall short of care because they don't care. They fall short because no one connects what she feels, what to do, and who can help. We do."
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            className="w-full sm:w-auto shadow-lifted"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Start Your Health Check
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            Open Dashboard & Timeline
          </Button>
        </div>
      </section>

      {/* Signature Care Thread Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {pillars.map((p, i) => (
          <Card key={i} variant="default" padding="lg" className="space-y-3 hover:shadow-lifted transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center shadow-xs">
              {p.icon}
            </div>
            <h3 className="font-heading font-semibold text-lg text-ink">
              {p.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {p.desc}
            </p>
          </Card>
        ))}
      </section>

      {/* 4 Life-Stage Check Modules */}
      <section className="p-6 sm:p-8 rounded-[24px] bg-plum-soft/50 border border-plum/10 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-heading font-bold text-ink">
            Screening Modules Tailored to Your Stage
          </h2>
          <p className="text-xs text-ink-muted">
            The Compass reshapes its questions and guidelines depending on where you are in life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-plum-soft shadow-xs space-y-2">
            <span className="text-xs font-bold text-plum uppercase">1. Menstrual Flow</span>
            <h4 className="font-semibold text-sm text-ink">PBAC Picture Chart</h4>
            <p className="text-xs text-ink-muted">
              Tap illustrated pads to calculate whether your cycle exceeds the 100-point menorrhagia cut-off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-plum-soft shadow-xs space-y-2">
            <span className="text-xs font-bold text-teal uppercase">2. Anaemia Track</span>
            <h4 className="font-semibold text-sm text-ink">WHO Hb Cut-offs</h4>
            <p className="text-xs text-ink-muted">
              Enter your haemoglobin lab value to categorize severity against international sea-level standards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-plum-soft shadow-xs space-y-2">
            <span className="text-xs font-bold text-coral uppercase">3. Mood & Postnatal</span>
            <h4 className="font-semibold text-sm text-ink">EPDS Mood Scale</h4>
            <p className="text-xs text-ink-muted">
              10 friendly swipe cards with immediate safety safeguards for emotional distress.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-plum-soft shadow-xs space-y-2">
            <span className="text-xs font-bold text-emergency uppercase">4. Danger Signs</span>
            <h4 className="font-semibold text-sm text-ink">Emergency Intercept</h4>
            <p className="text-xs text-ink-muted">
              Immediate full-screen guidance with 1-click Call 108 for critical medical danger signs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
