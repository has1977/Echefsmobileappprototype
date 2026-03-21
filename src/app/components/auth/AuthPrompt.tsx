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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-[#667c67] to-[#526250] p-8 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
            <p className="text-center text-white/90 text-sm">{message}</p>
          </div>

          <div className="p-6">
            {/* Phone Registration */}
            {mode === 'phone' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-800 font-medium">
                        Quick registration with your Kyrgyzstan phone number (+996)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+996 (555) 123-456"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleSendOTP}
                      disabled={phoneNumber.length < 10}
                      className="w-full h-12 bg-[#667c67] hover:bg-[#526250] text-white font-semibold"
                    >
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">OTP sent to</p>
                      <p className="text-lg font-bold text-[#667c67]">{phoneNumber}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                        Enter OTP Code
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
                            className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-sm">
                      {otpTimer > 0 ? (
                        <p className="text-gray-600">
                          Resend in <span className="font-bold text-[#667c67]">{otpTimer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleSendOTP}
                          className="font-semibold text-[#667c67] hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.join('').length < 6 || loading}
                      className="w-full h-12 bg-[#667c67] hover:bg-[#526250] text-white font-semibold"
                    >
                      {loading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>

                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      className="w-full text-center text-sm font-semibold text-gray-600 hover:text-[#667c67]"
                    >
                      Change Number
                    </button>
                  </>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setMode('signin')}
                    className="w-full py-3 text-sm font-semibold text-[#667c67] hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Sign in with email
                  </button>
                  <button
                    onClick={handleContinueAsGuest}
                    className="w-full py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            )}

            {/* Email Sign In */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#667c67] hover:bg-[#526250] text-white font-semibold"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm font-semibold text-[#667c67] hover:underline"
                  >
                    Don't have an account? Sign up
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className="w-full text-sm font-semibold text-gray-600 hover:text-[#667c67]"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#667c67] hover:bg-[#526250] text-white font-semibold"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm font-semibold text-[#667c67] hover:underline"
                  >
                    Already have an account? Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className="w-full text-sm font-semibold text-gray-600 hover:text-[#667c67]"
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