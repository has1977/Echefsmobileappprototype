import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Logo } from '../../components/shared/Logo';
import { motion } from 'motion/react';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, 
  Loader2, ArrowLeft, Sparkles, ChevronRight
} from 'lucide-react';

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (result.success) {
      // Redirect to home or intended page
      const from = sessionStorage.getItem('redirectAfterLogin') || '/branch-selection';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from);
    } else {
      setError(result.error || 'Sign in failed');
      setIsSubmitting(false);
    }
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
    
    // Auto submit
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
    <div className="min-h-screen bg-gradient-to-br from-[#E4DBC4] via-[#f5f0e6] to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#667c67]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-[#667c67]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E4DBC4]/30 rounded-full blur-3xl" />
        
        {/* Decorative dots pattern */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-20">
          <div className="grid grid-cols-4 gap-3">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#667c67]" />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
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

        <Card className="overflow-hidden shadow-2xl border-2 border-[#E4DBC4]/50 backdrop-blur-sm bg-white/95">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-br from-[#667c67] via-[#667c67] to-[#546352] text-white p-8 overflow-hidden">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E4DBC4] rounded-full blur-2xl" />
            </div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                  <Logo className="h-8" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Welcome Back
                </h1>
                <p className="text-white/90">Sign in to continue your culinary journey</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]/60" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#667c67] transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667c67]/60" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#667c67] transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667c67]/60 hover:text-[#667c67] transition-colors"
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
                  className="text-sm text-[#667c67] hover:text-[#546352] font-semibold hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#667c67] to-[#546352] hover:shadow-xl h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-semibold">Quick Demo Access</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3">
              <p className="text-xs text-center text-gray-600 mb-4 font-medium">
                Try the platform instantly with demo accounts:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoSignIn('customer')}
                  disabled={isSubmitting}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 transition-all disabled:opacity-50 group"
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
                  className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 transition-all disabled:opacity-50 group"
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
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 transition-all disabled:opacity-50 group"
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
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:border-amber-300 transition-all disabled:opacity-50 group"
                >
                  <div className="text-3xl mb-2">👑</div>
                  <div className="text-sm font-bold text-amber-900">Admin</div>
                  <div className="text-xs text-amber-700 mt-1">Full Control</div>
                </motion.button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/sign-up" 
                  className="text-[#667c67] font-bold hover:text-[#546352] hover:underline transition-colors inline-flex items-center gap-1 group"
                >
                  Create one now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6 font-medium">
          By signing in, you agree to our{' '}
          <a href="#" className="text-[#667c67] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-[#667c67] hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}
