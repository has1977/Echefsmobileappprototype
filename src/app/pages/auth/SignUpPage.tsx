import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/shared/Logo';
import { GlassCard, motion, AnimatePresence } from '../../design-system';
import { 
  Mail, Lock, Eye, EyeOff, User, Smartphone, UserPlus, 
  AlertCircle, Loader2, ArrowLeft, Shield, ChevronRight, Globe
} from 'lucide-react';

type SignUpMode = 'email' | 'phone';
type PhoneStep = 'info' | 'otp';

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

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  // Sign up mode
  const [signUpMode, setSignUpMode] = useState<SignUpMode>('email');
  
  // Email Sign Up
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Phone Sign Up
  const [countryCode, setCountryCode] = useState('+996'); // Default to Kyrgyzstan
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [phoneData, setPhoneData] = useState({
    name: '',
  });
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('info');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Common
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format phone number for Kyrgyzstan
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (countryCode === '+996') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
    }
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmailForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmailForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'customer',
    });

    if (result.success) {
      navigate('/branch-selection');
    } else {
      setError(result.error || 'Sign up failed');
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phoneStep === 'info') {
      if (!phoneData.name || !phoneNumber) {
        setError('Please fill in all required fields');
        return;
      }

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
      // Verify OTP and create account
      setIsSubmitting(true);
      const otpCode = otp.join('');
      
      // Simulate OTP verification
      setTimeout(async () => {
        if (otpCode === '123456' || otpCode.length === 6) {
          // Create account
          const result = await signUp({
            name: phoneData.name,
            phone: getFullPhoneNumber(),
            password: 'auto-generated', // Auto-generated password for phone signup
            role: 'customer',
          });
          
          if (result.success) {
            navigate('/branch-selection');
          } else {
            setError('Account creation failed. Please try again.');
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
      const nextInput = document.getElementById(`signup-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`signup-otp-${index - 1}`);
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-white/90">Join us for amazing experiences</p>
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

            {/* Sign Up Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#F9FAFB] rounded-xl">
              <button
                onClick={() => {
                  setSignUpMode('email');
                  setError('');
                  setPhoneStep('info');
                }}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  signUpMode === 'email'
                    ? 'bg-white text-[#667c67] shadow-md'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </button>
              <button
                onClick={() => {
                  setSignUpMode('phone');
                  setError('');
                }}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  signUpMode === 'phone'
                    ? 'bg-white text-[#667c67] shadow-md'
                    : 'text-[#6B7280] hover:text-[#374151]'
                }`}
              >
                <Smartphone className="w-4 h-4 inline-block mr-2" />
                Phone
              </button>
            </div>

            {/* Email Sign Up Form */}
            <AnimatePresence mode="wait">
              {signUpMode === 'email' && (
                <motion.form
                  key="email-signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-[#374151]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-[#374151]">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
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
                    
                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#6B7280]">Password Strength:</span>
                          <span className={`text-xs font-bold ${
                            passwordStrength.strength === 100 ? 'text-green-600' :
                            passwordStrength.strength === 66 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            className={`h-full ${passwordStrength.color} transition-all`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-[#374151]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667c67] transition-colors"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {/* Phone Sign Up Form */}
              {signUpMode === 'phone' && (
                <motion.form
                  key="phone-signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handlePhoneSubmit}
                  className="space-y-5"
                >
                  {phoneStep === 'info' ? (
                    <>
                      {/* Name */}
                      <div>
                        <label className="text-sm font-semibold mb-2 block text-[#374151]">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                          <input
                            type="text"
                            name="name"
                            value={phoneData.name}
                            onChange={handlePhoneChange}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

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
                        disabled={isSubmitting || !phoneData.name || !phoneNumber}
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
                            onClick={() => setPhoneStep('info')}
                            className="text-xs text-[#667c67] hover:underline font-semibold"
                          >
                            Change Number
                          </button>
                        </div>
                        
                        <p className="text-sm text-[#6B7280] mb-4">
                          Code sent to <span className="font-semibold text-[#374151]">{getFullPhoneNumber()}</span>
                        </p>

                        <div className="flex gap-2 justify-between mb-4">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`signup-otp-${index}`}
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-2" />
                            Verify & Create Account
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Already have an account?{' '}
                <Link 
                  to="/sign-in" 
                  className="text-[#667c67] font-bold hover:text-[#546352] hover:underline inline-flex items-center gap-1 group"
                >
                  Sign in
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B7280] mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-[#667c67] hover:underline font-medium">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#667c67] hover:underline font-medium">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}