/**
 * SthreeCare - Immediate Emotional & Crisis Support Screen (Stage 7)
 * Owner: Person A
 * 
 * Displayed when an EPDS self-harm item is positive or when the user
 * requests emotional crisis support. Calm, trustworthy, and non-stigmatizing.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Heart, PhoneCall, Shield, ArrowRight, Sparkles, CheckCircle } from '../../design/ui/Icon';

export const SupportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAppStore();

  const [activeGroundingStep, setActiveGroundingStep] = useState<number>(0);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Guided breathing pacing loop (4-4-4-4 box breathing)
  useEffect(() => {
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Pause'> = ['Inhale', 'Hold', 'Exhale', 'Pause'];
    let phaseIdx = 0;
    let secondsLeft = 4;

    const timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        phaseIdx = (phaseIdx + 1) % 4;
        setBreathingPhase(phases[phaseIdx]);
        secondsLeft = 4;
      }
      setBreathCount(secondsLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const emergencyPhone = profile.emergencyContact?.phone;
  const emergencyName = profile.emergencyContact?.name || 'Emergency Contact';

  const groundingSteps = [
    {
      step: 5,
      instruction: '5 Things You Can See',
      detail: 'Look around you right now. Notice 5 distinct physical objects (e.g., a window, a cup, a pattern on the floor, the light).',
    },
    {
      step: 4,
      instruction: '4 Things You Can Physically Feel',
      detail: 'Notice your feet resting on the floor, the texture of your clothes, the warmth of your hands, or cool air on your skin.',
    },
    {
      step: 3,
      instruction: '3 Sounds You Can Hear',
      detail: 'Listen carefully for 3 sounds: distant traffic, birds chirping, a clock ticking, or your own gentle breath.',
    },
    {
      step: 2,
      instruction: '2 Things You Can Smell',
      detail: 'Notice any scent in the room, fresh air, a cup of tea, or simply take a deep slow inhale.',
    },
    {
      step: 1,
      instruction: '1 Positive Truth About Yourself',
      detail: 'Remind yourself: "I am safe right now in this moment. Reaching out for support is a strength."',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-[24px] bg-white border border-plum-soft shadow-soft text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-plum-soft text-plum flex items-center justify-center mx-auto shadow-xs">
          <Heart className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal bg-teal-soft px-3 py-1 rounded-full">
            You Are Not Alone
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Emotional Well-being & Immediate Support
          </h1>
          <p className="text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Perinatal changes, hormones, chronic pain, and exhaustion can feel overwhelming. Free, caring, and confidential support is available right now.
          </p>
        </div>
      </div>

      {/* Immediate Crisis Contact Numbers Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          Free 24/7 Confidential Helplines in India
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tele-MANAS */}
          <Card variant="teal" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-teal-dark">
                Government of India
              </span>
              <span className="text-[10px] font-semibold bg-teal text-white px-2 py-0.5 rounded-full">
                24/7 Free Call
              </span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-ink">
                Tele-MANAS National Helpline
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Comprehensive tele-mental health services in 20+ regional Indian languages.
              </p>
            </div>
            <a
              href="tel:14416"
              className="w-full py-3 px-4 rounded-xl bg-teal text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-dark shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Call 14416 (Toll-Free)</span>
            </a>
          </Card>

          {/* Vandrevala Foundation */}
          <Card variant="plumSoft" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-plum">
                Community Mental Health
              </span>
              <span className="text-[10px] font-semibold bg-plum text-white px-2 py-0.5 rounded-full">
                24/7 Counseling
              </span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-ink">
                Vandrevala Foundation
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Experienced counselors providing compassionate, non-judgmental crisis listening.
              </p>
            </div>
            <a
              href="tel:9999666555"
              className="w-full py-3 px-4 rounded-xl bg-plum text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-plum-dark shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 9999 666 555</span>
            </a>
          </Card>
        </div>

        {/* User's Own Emergency Contact */}
        {emergencyPhone ? (
          <div className="p-4 rounded-2xl bg-white border border-plum-soft shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-ink-subtle uppercase">
                Your Saved Trusted Contact
              </span>
              <h4 className="font-heading font-bold text-base text-ink">
                {emergencyName} ({emergencyPhone})
              </h4>
            </div>
            <a
              href={`tel:${emergencyPhone}`}
              className="px-5 py-2.5 rounded-full bg-plum text-white font-semibold text-xs inline-flex items-center gap-2 shadow-xs hover:bg-plum-dark transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call {emergencyName}</span>
            </a>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-plum-soft/60 text-xs text-ink-muted flex items-center justify-between">
            <span>You can add a trusted friend or family member in your profile anytime.</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              Add Contact in Profile
            </Button>
          </div>
        )}
      </div>

      {/* Calming Guided Box Breathing Tool */}
      <Card variant="default" padding="lg" className="space-y-6 text-center">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal">
            Grounding Exercise
          </span>
          <h3 className="font-heading font-bold text-xl text-ink">
            Paced Breathing Circle
          </h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Take a moment to slow your heart rate. Follow the expanding and contracting rhythm.
          </p>
        </div>

        {/* Visual Breathing Circle */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
              breathingPhase === 'Inhale'
                ? 'scale-125 bg-teal/20 text-teal-dark border-4 border-teal'
                : breathingPhase === 'Hold'
                ? 'scale-125 bg-plum/20 text-plum border-4 border-plum'
                : breathingPhase === 'Exhale'
                ? 'scale-90 bg-cream text-ink border-2 border-plum-soft'
                : 'scale-90 bg-cream/60 text-ink-subtle border-2 border-plum-soft/40'
            }`}
          >
            <span className="text-lg font-heading font-bold">{breathingPhase}</span>
            <span className="text-xs font-medium mt-0.5">{breathCount}s</span>
          </div>
        </div>

        <p className="text-xs text-ink-subtle">
          Box Breathing: 4s Inhale &bull; 4s Hold &bull; 4s Exhale &bull; 4s Gentle Pause
        </p>
      </Card>

      {/* 5-4-3-2-1 Sensory Grounding Tool */}
      <Card variant="plumSoft" padding="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-plum" />
          <h3 className="font-heading font-bold text-lg text-ink">
            5-4-3-2-1 Sensory Grounding Method
          </h3>
        </div>

        <p className="text-xs text-ink-muted">
          When distressing thoughts or panic arise, grounding reconnects you directly with your physical environment.
        </p>

        {/* Step Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {groundingSteps.map((step, idx) => (
            <button
              key={step.step}
              type="button"
              onClick={() => setActiveGroundingStep(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeGroundingStep === idx
                  ? 'bg-plum text-white shadow-xs'
                  : 'bg-white border border-plum-soft text-ink-muted hover:bg-white/80'
              }`}
            >
              Step {step.step}: {step.instruction}
            </button>
          ))}
        </div>

        {/* Active Grounding Card */}
        <div className="p-4 rounded-2xl bg-white border border-plum-soft space-y-2">
          <div className="flex items-center gap-2 text-plum font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{groundingSteps[activeGroundingStep].instruction}</span>
          </div>
          <p className="text-xs text-ink leading-relaxed">
            {groundingSteps[activeGroundingStep].detail}
          </p>
        </div>
      </Card>

      {/* Navigation Return */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-plum-soft">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/result')}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Return to My Assessment Findings
        </Button>
      </div>
    </div>
  );
};
