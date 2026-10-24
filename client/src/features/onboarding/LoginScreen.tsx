import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Field } from '../../design/ui/Field';
import { Shield, Sparkles } from '../../design/ui/Icon';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, setLoggedIn } = useAppStore();

  const [phone, setPhone] = useState(profile.phoneNumber || '9876543210');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const DEMO_OTP = '123456';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError(`For this prototype demo, please enter the test OTP: ${DEMO_OTP}`);
      return;
    }
    setError('');
    setProfile({ phoneNumber: phone });
    setLoggedIn(true);
    // Proceed to consent screen
    navigate('/consent');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card variant="elevated" padding="lg" className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-plum-soft flex items-center justify-center mx-auto text-plum">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            {step === 'phone' ? 'Welcome to SthreeCare' : 'Simulated Verification'}
          </h1>
          <p className="text-sm text-ink-muted">
            {step === 'phone'
              ? 'Compass for women’s life-stage health screening'
              : `Enter the simulated 6-digit OTP code sent to +91 ${phone}`}
          </p>
        </div>

        {/* Demo Prototype Notice Banner */}
        <div className="p-3.5 rounded-xl bg-amber-soft border border-amber/30 text-ink text-xs space-y-1">
          <div className="font-semibold text-amber-dark flex items-center gap-1.5">
            <span>⚠</span>
            <span>Simulated Prototype Demo</span>
          </div>
          <p className="text-ink-muted">
            This demo simulates authentication for testing purposes. All health assessments remain strictly local to your browser and are never sent to external servers.
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <Field
              label="Mobile Number"
              type="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={error}
              hint="Demo phone number (any 10 digits)"
              maxLength={10}
            />

            <Button type="submit" variant="primary" fullWidth size="lg">
              Get Demo OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <Field
              label="Simulated OTP Code"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
              hint="Fixed test OTP: 123456"
              maxLength={6}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setOtp(DEMO_OTP)}
                icon={<Sparkles className="w-4 h-4 text-plum" />}
              >
                Auto-fill '{DEMO_OTP}'
              </Button>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg">
              Verify & Proceed
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError('');
              }}
              className="w-full text-center text-xs text-ink-subtle hover:text-ink underline pt-2"
            >
              Change mobile number
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};
