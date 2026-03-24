import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Mail, Lock, User, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  message?: string;
  mode?: 'signin' | 'signup' | 'phone';
}

export function AuthPrompt({
  isOpen,
  onClose,
  onSuccess,
  title = 'Sign In Required',
  message = 'Please sign in to continue with your order',
  mode: initialMode = 'phone',
}: AuthPromptProps) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const [mode, setMode] = useState<'phone' | 'signin' | 'signup'>(initialMode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Timer Effect
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, otpTimer]);

  // Check if phone number is from Kyrgyzstan (+996)
  const isKyrgyzstanNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('996') && cleaned.length >= 12;
  };

  const handleSendOTP = () => {
    if (!isKyrgyzstanNumber(phoneNumber)) {
      setError('Please enter a valid Kyrgyzstan phone number (+996)');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setError('');
    setOtpSent(true);
    setOtpTimer(60);
    console.log('Sending OTP to:', phoneNumber);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setLoading(true);
      try {
        // In production, verify OTP with backend
        // For demo, create account with phone number
        const result = await signUp({
          name: `User ${phoneNumber.slice(-4)}`,
          email: `${phoneNumber.replace(/\D/g, '')}@echefs.kg`,
          phone: phoneNumber,
          password: otpCode, // In production, generate a secure token
        });
        
        if (result.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(result.error || 'Verification failed');
        }
      } catch (err) {
        setError('Failed to verify OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-[#667c67]/90 via-black/70 to-[#526250]/90 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-[#667c67]" />
          </button>

          {/* Header with Brand Colors */}
          <div className="relative bg-gradient-to-br from-[#667c67] via-[#5a6f5b] to-[#526250] p-10 text-white overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e4dbc4]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#e4dbc4]/10 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="relative w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#e4dbc4] to-[#d4c9a8] rounded-3xl flex items-center justify-center shadow-xl"
            >
              <Sparkles className="w-10 h-10 text-[#667c67]" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-center mb-2 tracking-tight"
            >
              {title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-[#e4dbc4] text-sm font-medium"
            >
              {message}
            </motion.p>
          </div>

          <div className="p-8">
            {/* Phone Registration */}
            {mode === 'phone' && (
              <div className="space-y-5">
                {!otpSent ? (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-br from-[#667c67]/10 to-[#e4dbc4]/20 border-2 border-[#e4dbc4] rounded-2xl"
                    >
                      <p className="text-sm text-[#667c67] font-semibold text-center">
                        🇰🇬 Quick registration with your Kyrgyzstan phone number
                      </p>
                    </motion.div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-[#667c67]" />
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+996 (555) 123-456"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-medium"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <Button
                      onClick={handleSendOTP}
                      disabled={phoneNumber.length < 10}
                      className="w-full h-14 bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Send OTP Code
                    </Button>
                  </>
                ) : (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6 p-4 bg-gradient-to-br from-[#e4dbc4]/30 to-[#667c67]/10 rounded-2xl"
                    >
                      <p className="text-sm text-gray-600 mb-1">OTP sent to</p>
                      <p className="text-xl font-black text-[#667c67]">{phoneNumber}</p>
                    </motion.div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-4 text-center">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all text-[#667c67]"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-sm p-3 bg-gray-50 rounded-xl">
                      {otpTimer > 0 ? (
                        <p className="text-gray-600">
                          Resend code in <span className="font-black text-[#667c67] text-base">{otpTimer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleSendOTP}
                          className="font-bold text-[#667c67] hover:text-[#526250] transition-colors"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.join('').length < 6 || loading}
                      className="w-full h-14 bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? 'Verifying...' : '✓ Verify & Continue'}
                    </Button>

                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      className="w-full text-center text-sm font-bold text-gray-500 hover:text-[#667c67] transition-colors py-2"
                    >
                      ← Change Phone Number
                    </button>
                  </>
                )}

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-semibold">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setMode('signin')}
                    className="w-full py-4 text-sm font-bold text-[#667c67] bg-[#e4dbc4]/30 hover:bg-[#e4dbc4]/50 rounded-2xl transition-all border-2 border-transparent hover:border-[#e4dbc4]"
                  >
                    📧 Sign in with Email
                  </button>
                  <button
                    onClick={handleContinueAsGuest}
                    className="w-full py-4 text-sm font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                  >
                    Continue as Guest →
                  </button>
                </div>
              </div>
            )}

            {/* Email Sign In */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-medium"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? 'Signing in...' : '→ Sign In'}
                </Button>

                <div className="text-center space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm font-bold text-[#667c67] hover:text-[#526250] transition-colors"
                  >
                    Don't have an account? <span className="underline">Sign up</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className="w-full text-sm font-bold text-gray-500 hover:text-[#667c67] transition-colors py-2"
                  >
                    ← Back to phone registration
                  </button>
                </div>
              </form>
            )}

            {/* Email Sign Up */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Phone <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+996 (555) 123-456"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-4 focus:ring-[#667c67]/10 outline-none transition-all font-medium text-gray-800"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">Minimum 6 characters</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-medium"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? 'Creating account...' : '✓ Create Account'}
                </Button>

                <div className="text-center space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm font-bold text-[#667c67] hover:text-[#526250] transition-colors"
                  >
                    Already have an account? <span className="underline">Sign in</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className="w-full text-sm font-bold text-gray-500 hover:text-[#667c67] transition-colors py-2"
                  >
                    ← Back to phone registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}