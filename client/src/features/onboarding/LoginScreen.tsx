import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import {
  Shield,
  PhoneCall,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  LogIn,
} from '../../design/ui/Icon';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, currentUser } = useAppStore();

  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    const res = loginWithCredentials(cleanPhone, password);
    if (!res.success) {
      setError(res.message || 'Login failed. Please verify credentials.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fade-in">
      {/* Top Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-soft border border-plum/10 text-xs font-semibold text-plum">
          <Shield className="w-3.5 h-3.5 text-teal" />
          <span>Patient Portal Authentication</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-ink">
          Sign In to Care Orbit
        </h1>
        <p className="text-sm text-ink-muted max-w-xs mx-auto">
          Enter your registered mobile phone number and password to access your private health compass.
        </p>
      </div>

      <Card variant="default" padding="lg" className="border border-plum-soft shadow-lifted bg-white/90 backdrop-blur-md space-y-6">
        {/* Toggle between Sign In and Register */}
        <div className="grid grid-cols-2 p-1 bg-cream rounded-2xl border border-plum-soft text-sm font-semibold">
          <div className="py-2.5 text-center rounded-xl bg-plum text-white shadow-soft">
            Sign In
          </div>
          <Link
            to="/register"
            className="py-2.5 text-center rounded-xl text-ink-muted hover:text-plum transition-colors"
          >
            Register
          </Link>
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
            <span>Signed in successfully! Opening your health records...</span>
          </div>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                placeholder="Enter your password"
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="shadow-lifted hover:scale-[1.01]"
              icon={<LogIn className="w-4 h-4" />}
            >
              Log In
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center text-xs text-ink-muted border-t border-plum-soft/60">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-plum hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
};
