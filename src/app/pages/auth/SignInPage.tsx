import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/shared/Logo';
import { GlassCard, motion, AnimatePresence } from '../../design-system';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, 
  Loader2, ArrowLeft, Smartphone, ChevronRight, Shield, Globe
} from 'lucide-react';

type AuthMode = 'email' | 'phone';
type PhoneStep = 'phone' | 'otp';

// Country codes for Kyrgyzstan region
const COUNTRY_CODES = [
  { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: '+995', name: 'Georgia', flag: '🇬🇪' },
];

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();
  
  // Auth mode (email or phone)
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  
  // Email Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone Auth
  const [countryCode, setCountryCode] = useState('+996'); // Default to Kyrgyzstan
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Common
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format phone number for Kyrgyzstan
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // For Kyrgyzstan (+996), format as XXX XXX XXX
    if (countryCode === '+996') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
    }
    
    // For other countries, basic formatting
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  const getFullPhoneNumber = () => {
    return `${countryCode}${phoneNumber.replace(/\s/g, '')}`;
  };

  const validatePhoneNumber = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Kyrgyzstan numbers should be 9 digits
    if (countryCode === '+996' && digits.length !== 9) {
      setError('Phone number must be 9 digits for Kyrgyzstan');
      return false;
    }
    
    // Russia numbers should be 10 digits
    if (countryCode === '+7' && digits.length !== 10) {
      setError('Phone number must be 10 digits for Russia');
      return false;
    }
    
    // Other countries - at least 9 digits
    if (digits.length < 9) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (result.success) {
      const from = sessionStorage.getItem('redirectAfterLogin') || '/branch-selection';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from);
    } else {
      setError(result.error || 'Sign in failed');
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phoneStep === 'phone') {
      // Send OTP
      setIsSubmitting(true);
      
      // Simulate sending OTP
      setTimeout(() => {
        setIsSubmitting(false);
        setPhoneStep('otp');
        setResendTimer(60);
        
        // Start countdown
        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 1000);
    } else {
      // Verify OTP
      setIsSubmitting(true);
      const otpCode = otp.join('');
      
      // Simulate OTP verification
      setTimeout(async () => {
        if (otpCode === '123456' || otpCode.length === 6) {
          // Auto sign in after OTP verification
          const result = await signIn('customer@echefs.com', 'demo123'); // Demo for now
          
          if (result.success) {
            const from = sessionStorage.getItem('redirectAfterLogin') || '/branch-selection';
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(from);
          } else {
            setError('Verification failed. Please try again.');
            setIsSubmitting(false);
          }
        } else {
          setError('Invalid OTP. Please try again.');
          setIsSubmitting(false);
        }
      }, 1000);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    setError('');
    
    // Start countdown
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDemoSignIn = async (role: 'customer' | 'waiter' | 'manager' | 'admin') => {
    const demoAccounts = {
      customer: { email: 'customer@echefs.com', password: 'demo123' },
      waiter: { email: 'waiter@echefs.com', password: 'demo123' },
      manager: { email: 'manager@echefs.com', password: 'demo123' },
      admin: { email: 'admin@echefs.com', password: 'demo123' },
    };

    const account = demoAccounts[role];
    setEmail(account.email);
    setPassword(account.password);
    
    setIsSubmitting(true);
    const result = await signIn(account.email, account.password);
    
    if (result.success) {
      const from = sessionStorage.getItem('redirectAfterLogin') || '/branch-selection';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from);
    } else {
      setError(result.error || 'Demo sign in failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-[#667c67] hover:bg-[#667c67]/10 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <GlassCard variant="elevated" className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <Logo className="h-8" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-white/90">Sign in to continue your journey</p>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#F9FAFB] rounded-xl">
              <button
                onClick={() => {
                  setAuthMode('email');
                  setError('');
                  setPhoneStep('phone');
                }}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  authMode === 'email'
                    ? 'bg-white text-[#667c67] shadow-md'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </button>
              <button
                onClick={() => {
                  setAuthMode('phone');
                  setError('');
                }}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  authMode === 'phone'
                    ? 'bg-white text-[#667c67] shadow-md'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                <Smartphone className="w-4 h-4 inline-block mr-2" />
                Phone
              </button>
            </div>

            {/* Email Sign In Form */}
            <AnimatePresence mode="wait">
              {authMode === 'email' && (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-[#374151]">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-[#374151]">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667c67] transition-colors"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-[#667c67] hover:text-[#546352] font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#667c67] to-[#526250] hover:shadow-xl h-12 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Phone Sign In Form */}
              {authMode === 'phone' && (
                <motion.form
                  key="phone-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handlePhoneSubmit}
                  className="space-y-5"
                >
                  {phoneStep === 'phone' ? (
                    <>
                      {/* Phone Number */}
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-[#374151]">
                          Phone Number
                        </label>
                        
                        {/* Country Code Selector */}
                        <div className="relative mb-3">
                          <button
                            type="button"
                            onClick={() => setShowCountryCodes(!showCountryCodes)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] hover:border-[#667c67] transition-all"
                            disabled={isSubmitting}
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="w-5 h-5 text-[#9CA3AF]" />
                              <span className="text-sm font-medium text-[#374151]">
                                {COUNTRY_CODES.find(c => c.code === countryCode)?.flag}{' '}
                                {COUNTRY_CODES.find(c => c.code === countryCode)?.name}{' '}
                                <span className="text-[#667c67]">({countryCode})</span>
                              </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-[#9CA3AF] transition-transform ${showCountryCodes ? 'rotate-90' : ''}`} />
                          </button>
                          
                          {/* Country Codes Dropdown */}
                          <AnimatePresence>
                            {showCountryCodes && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden"
                              >
                                <div className="max-h-64 overflow-y-auto">
                                  {COUNTRY_CODES.map(country => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => {
                                        setCountryCode(country.code);
                                        setShowCountryCodes(false);
                                        setPhoneNumber(''); // Reset phone number on country change
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors ${
                                        countryCode === country.code ? 'bg-[#667c67]/10' : ''
                                      }`}
                                    >
                                      <span className="text-2xl">{country.flag}</span>
                                      <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-[#374151]">{country.name}</div>
                                        <div className="text-xs text-[#6B7280]">{country.code}</div>
                                      </div>
                                      {countryCode === country.code && (
                                        <div className="w-2 h-2 rounded-full bg-[#667c67]" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Phone Input */}
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            placeholder={countryCode === '+996' ? '700 123 456' : '123 456 789'}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className="text-xs text-[#6B7280] mt-2">
                          {countryCode === '+996' 
                            ? 'Kyrgyzstan mobile number (9 digits)' 
                            : 'Enter your mobile number'}
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#667c67] to-[#526250] hover:shadow-xl h-12 text-base font-semibold"
                        disabled={isSubmitting || !phoneNumber}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-5 h-5 mr-2" />
                            Send Verification Code
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* OTP Input */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-[#374151]">
                            Verification Code
                          </label>
                          <button
                            type="button"
                            onClick={() => setPhoneStep('phone')}
                            className="text-xs text-[#667c67] hover:underline font-semibold"
                          >
                            Change Number
                          </button>
                        </div>
                        
                        <p className="text-sm text-[#6B7280] mb-4">
                          Code sent to <span className="font-semibold text-[#374151]">{phoneNumber}</span>
                        </p>

                        <div className="flex gap-2 justify-between mb-4">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-full aspect-square text-center text-2xl font-bold rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                              disabled={isSubmitting}
                            />
                          ))}
                        </div>

                        {/* Resend OTP */}
                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <p className="text-sm text-[#6B7280]">
                              Resend code in <span className="font-bold text-[#667c67]">{resendTimer}s</span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-sm text-[#667c67] hover:text-[#546352] font-semibold hover:underline"
                            >
                              Resend Code
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#667c67] to-[#526250] hover:shadow-xl h-12 text-base font-semibold"
                        disabled={isSubmitting || otp.join('').length !== 6}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5 mr-2" />
                            Verify & Sign In
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#E5E7EB]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-[#6B7280] font-semibold">Quick Demo Access</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3">
              <p className="text-xs text-center text-[#6B7280] mb-4 font-medium">
                Try the platform instantly:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoSignIn('customer')}
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">🛍️</div>
                  <div className="text-sm font-bold text-blue-900">Customer</div>
                  <div className="text-xs text-blue-700 mt-1">Browse & Order</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoSignIn('waiter')}
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 hover:shadow-md transition-all disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">🍽️</div>
                  <div className="text-sm font-bold text-green-900">Waiter</div>
                  <div className="text-xs text-green-700 mt-1">Serve Tables</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoSignIn('manager')}
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm font-bold text-purple-900">Manager</div>
                  <div className="text-xs text-purple-700 mt-1">Manage Branch</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoSignIn('admin')}
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">👑</div>
                  <div className="text-sm font-bold text-amber-900">Admin</div>
                  <div className="text-xs text-amber-700 mt-1">Full Control</div>
                </motion.button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Don't have an account?{' '}
                <Link 
                  to="/sign-up" 
                  className="text-[#667c67] font-bold hover:text-[#546352] hover:underline inline-flex items-center gap-1 group"
                >
                  Create one now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B7280] mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-[#667c67] hover:underline font-medium">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#667c67] hover:underline font-medium">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}