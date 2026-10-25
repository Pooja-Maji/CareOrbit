import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import {
  Shield,
  User,
  PhoneCall,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  UserPlus,
} from '../../design/ui/Icon';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { registerAccount } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== reenterPassword) {
      setError('Passwords do not match. Please re-enter your password correctly.');
      return;
    }

    const result = registerAccount({
      name: cleanName,
      phoneNumber: cleanPhone,
      password: password,
    });

    if (!result.success) {
      setError(result.message || 'Registration failed. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/consent');
    }, 600);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in">
      {/* Top Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-soft border border-plum/10 text-xs font-semibold text-plum">
          <Shield className="w-3.5 h-3.5 text-teal" />
          <span>Patient Registration</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-ink">
          Create Your Care Orbit Account
        </h1>
        <p className="text-sm text-ink-muted max-w-sm mx-auto">
          Set up your private account. All health records and screening history will be stored safely on your device.
        </p>
      </div>

      <Card variant="default" padding="lg" className="border border-plum-soft shadow-lifted bg-white/90 backdrop-blur-md space-y-6">
        {/* Tab switch between Login and Register */}
        <div className="grid grid-cols-2 p-1 bg-cream rounded-2xl border border-plum-soft text-sm font-semibold">
          <Link
            to="/login"
            className="py-2.5 text-center rounded-xl text-ink-muted hover:text-plum transition-colors"
          >
            Sign In
          </Link>
          <div className="py-2.5 text-center rounded-xl bg-plum text-white shadow-soft">
            Register
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-emergency-soft border border-emergency/30 text-emergency text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-teal-soft border border-teal/30 text-teal text-xs flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Account created successfully! Proceeding to setup...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-plum" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-plum-soft/90 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-all"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-plum" />
              <span>Mobile Phone Number</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-semibold text-ink-subtle pointer-events-none">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-plum-soft/90 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-ink-muted">Used for your private on-device account login.</p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-plum" />
              <span>Password</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-plum-soft/90 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-ink-subtle hover:text-plum p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Re-enter Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-plum" />
              <span>Re-enter Password</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showReenterPassword ? 'text' : 'password'}
                placeholder="Re-enter your password to confirm"
                value={reenterPassword}
                onChange={(e) => setReenterPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-plum-soft/90 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowReenterPassword(!showReenterPassword)}
                className="absolute right-3.5 text-ink-subtle hover:text-plum p-1"
                aria-label={showReenterPassword ? 'Hide password' : 'Show password'}
              >
                {showReenterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {reenterPassword && password !== reenterPassword && (
              <p className="text-[11px] text-emergency font-medium">Passwords do not match yet.</p>
            )}
            {reenterPassword && password === reenterPassword && (
              <p className="text-[11px] text-teal font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Passwords match</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="shadow-lifted hover:scale-[1.01]"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Create Account & Continue
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center text-xs text-ink-muted border-t border-plum-soft/60">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-plum hover:underline">
            Sign In here
          </Link>
        </div>
      </Card>
    </div>
  );
};
