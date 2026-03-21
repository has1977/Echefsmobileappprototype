import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Globe, Bell, Moon, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * Onboarding tooltip to help users discover the Settings page
 * Shows a visual guide pointing to the Settings button
 */
export function SettingsOnboarding() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the onboarding
    const hasSeenOnboarding = localStorage.getItem('echefs_settings_onboarding_seen');
    
    // Only show if user is signed in and hasn't seen it
    const userId = localStorage.getItem('echefs_user_id');
    
    if (!hasSeenOnboarding && userId) {
      // Show after 3 seconds
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowOnboarding(false);
    localStorage.setItem('echefs_settings_onboarding_seen', 'true');
  };

  const handleGoToSettings = () => {
    handleDismiss();
    navigate('/profile/settings');
  };

  const steps = [
    {
      icon: Sparkles,
      title: 'New Settings Page!',
      description: 'Customize your experience with our new settings',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Change Language',
      description: 'Switch between English, Arabic, Russian, and Kyrgyz',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      icon: Bell,
      title: 'Manage Notifications',
      description: 'Control what updates you want to receive',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: Moon,
      title: 'Customize Appearance',
      description: 'Toggle dark mode and sound effects',
      gradient: 'from-yellow-400 to-orange-500',
    },
  ];

  const currentStepData = steps[currentStep];

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-5"
        style={{ pointerEvents: 'all' }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        />

        {/* Onboarding Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-[#1F2933]" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentStepData.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <currentStepData.icon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-[#1F2933] text-center mb-3"
            >
              {currentStepData.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#6B7280] text-center mb-8 font-medium"
            >
              {currentStepData.description}
            </motion.p>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    index === currentStep
                      ? 'w-8 bg-[#667c67]'
                      : 'w-2 bg-[#E5E7EB] hover:bg-[#D1D5DB]'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {currentStep < steps.length - 1 ? (
                <>
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="w-full py-4 bg-gradient-to-r from-[#667c67] to-[#546352] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleGoToSettings}
                    className="w-full py-3 text-[#667c67] font-semibold hover:bg-[#F9FAFB] rounded-xl transition-all"
                  >
                    Go to Settings Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGoToSettings}
                    className="w-full py-4 bg-gradient-to-r from-[#667c67] to-[#546352] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Open Settings
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="w-full py-3 text-[#667c67] font-semibold hover:bg-[#F9FAFB] rounded-xl transition-all"
                  >
                    Maybe Later
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="h-2 bg-gradient-to-r from-[#667c67] via-[#e4dbc4] to-[#667c67]" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Settings Feature Highlight Badge
 * Shows on the Profile page pointing to Settings button
 */
export function SettingsHighlightBadge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenBadge = localStorage.getItem('echefs_settings_badge_seen');
    if (!hasSeenBadge) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('echefs_settings_badge_seen', 'true');
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute -top-2 -right-2 z-10"
    >
      <div className="relative">
        {/* Pulsing Ring */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
        
        {/* Badge */}
        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          NEW
          <button
            onClick={handleDismiss}
            className="ml-1 w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
