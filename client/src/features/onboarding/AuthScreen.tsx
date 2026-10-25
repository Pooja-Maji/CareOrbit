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
  Heart,
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

    setSuccessMessage('Account created successfully! Welcome to SthreeCare.');
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#FBF7F4] relative overflow-hidden">
      {/* Decorative background radial gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6B2D5C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1F6F6B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6B2D5C] via-[#883A76] to-[#1F6F6B] text-white shadow-lifted mb-2">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#241B22] tracking-tight">
            SthreeCare
          </h1>
          <p className="text-xs sm:text-sm text-[#61555E] max-w-xs mx-auto">
            Life-Stage Health Compass • On-Device Privacy
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[24px] border border-[#6B2D5C]/10 shadow-lifted p-6 sm:p-8 space-y-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#FBF7F4] rounded-2xl border border-[#F5ECF3] text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-[#6B2D5C] text-white shadow-soft'
                  : 'text-[#61555E] hover:text-[#6B2D5C]'
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
                  ? 'bg-[#6B2D5C] text-white shadow-soft'
                  : 'text-[#61555E] hover:text-[#6B2D5C]'
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
            <div className="p-3.5 rounded-xl bg-[#E8F4F3] border border-[#1F6F6B]/30 text-[#1F6F6B] text-xs flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Mobile Phone Number</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8C7F89] pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 text-[#8C7F89] hover:text-[#6B2D5C] p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#6B2D5C] hover:bg-[#511F45] text-white font-semibold text-sm shadow-lifted transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#61555E]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  className="font-bold text-[#6B2D5C] hover:underline"
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
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Mobile Phone Number</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8C7F89] pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 text-[#8C7F89] hover:text-[#6B2D5C] p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#241B22] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>Re-enter Password</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#F5ECF3] bg-white text-[#241B22] text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3.5 text-[#8C7F89] hover:text-[#6B2D5C] p-1"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regConfirmPassword && regPassword !== regConfirmPassword && (
                  <p className="text-[11px] text-[#B3261E] font-medium">Passwords do not match.</p>
                )}
                {regConfirmPassword && regPassword === regConfirmPassword && (
                  <p className="text-[11px] text-[#1F6F6B] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#6B2D5C] hover:bg-[#511F45] text-white font-semibold text-sm shadow-lifted transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#61555E]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className="font-bold text-[#6B2D5C] hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Privacy Guarantee Footer */}
          <div className="pt-4 border-t border-[#F5ECF3] flex items-center justify-center gap-2 text-[11px] text-[#61555E]">
            <Shield className="w-3.5 h-3.5 text-[#1F6F6B] flex-shrink-0" />
            <span>100% On-Device Privacy • Data stays encrypted in your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};
