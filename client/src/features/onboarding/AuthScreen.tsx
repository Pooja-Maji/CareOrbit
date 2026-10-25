import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import {
  Shield,
  PhoneCall,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  LogIn,
  UserPlus,
  AlertTriangle,
  CheckCircle,
} from '../../design/ui/Icon';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, registerAccount } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Status state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanPhone = loginPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    const res = loginWithCredentials(cleanPhone, loginPassword);
    if (!res.success) {
      setError(res.message || 'Invalid credentials.');
      return;
    }

    setSuccessMessage('Signed in successfully! Loading your health compass...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanName = regName.trim();
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = regPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify and re-enter.');
      return;
    }

    const res = registerAccount({
      name: cleanName,
      phoneNumber: cleanPhone,
      password: regPassword,
    });

    if (!res.success) {
      setError(res.message || 'Registration failed.');
      return;
    }

    setSuccessMessage('Account created successfully! Welcome to Care Orbit.');
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-cream relative overflow-hidden">
      {/* Decorative background radial gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-plum/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lifted mb-2">
            <img src="/brand/care-orbit-mark.png" alt="Care Orbit logo" width={512} height={512} className="w-12 h-12 object-contain" draggable={false} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#1B1530] tracking-tight">
            Care Orbit
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5470] max-w-xs mx-auto">
            Life-Stage Health Compass • On-Device Privacy
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[24px] border border-[#7E57C2]/10 shadow-lifted p-6 sm:p-8 space-y-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-cream rounded-2xl border border-[#F1EBFF] text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-[#7E57C2] text-white shadow-soft'
                  : 'text-[#5B5470] hover:text-[#7E57C2]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#7E57C2] text-white shadow-soft'
                  : 'text-[#5B5470] hover:text-[#7E57C2]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDECEB] border border-[#B3261E]/30 text-[#B3261E] text-xs flex items-center gap-2 animate-fade-in font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-[#E8F4F3] border border-[#B04A7C]/30 text-[#B04A7C] text-xs flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Mobile Phone Number</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8A84A0] pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 text-[#8A84A0] hover:text-[#7E57C2] p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#7E57C2] hover:bg-[#7E57C2] text-white font-semibold text-sm shadow-lifted transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#5B5470]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  className="font-bold text-[#7E57C2] hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Mobile Phone Number</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8A84A0] pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 text-[#8A84A0] hover:text-[#7E57C2] p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1B1530] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#7E57C2]" />
                  <span>Re-enter Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F1EBFF] bg-white text-[#1B1530] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E57C2]/20 focus:border-[#7E57C2] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3.5 text-[#8A84A0] hover:text-[#7E57C2] p-1"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regConfirmPassword && regPassword !== regConfirmPassword && (
                  <p className="text-[11px] text-[#B3261E] font-medium">Passwords do not match.</p>
                )}
                {regConfirmPassword && regPassword === regConfirmPassword && (
                  <p className="text-[11px] text-[#B04A7C] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#7E57C2] hover:bg-[#7E57C2] text-white font-semibold text-sm shadow-lifted transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#5B5470]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className="font-bold text-[#7E57C2] hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Privacy Guarantee Footer */}
          <div className="pt-4 border-t border-[#F1EBFF] flex items-center justify-center gap-2 text-[11px] text-[#5B5470]">
            <Shield className="w-3.5 h-3.5 text-[#B04A7C] flex-shrink-0" />
            <span>100% On-Device Privacy • Data stays encrypted in your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};
