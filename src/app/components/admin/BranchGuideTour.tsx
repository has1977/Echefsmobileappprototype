import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Building2, Users, Grid3x3, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TOUR_STEPS = [
  {
    icon: Building2,
    title: 'Welcome to Branch Management',
    description: 'Create and manage your restaurant branches with full control over locations, hours, and settings.',
    tips: [
      'Add branch details in all languages for better customer experience',
      'Set accurate GPS coordinates for delivery and navigation',
      'Configure operating hours for each day of the week',
    ],
  },
  {
    icon: Users,
    title: 'Organize with Regions/Zones',
    description: 'Divide your restaurant into regions like Main Hall, VIP, Outdoor, Smoking, etc.',
    tips: [
      'Each region can have its own character and table arrangement',
      'Regions help waiters and kitchen staff organize orders',
      'Track occupancy and capacity per region',
    ],
  },
  {
    icon: Grid3x3,
    title: 'Manage Tables',
    description: 'Add tables to each region with QR codes and NFC tags for contactless ordering.',
    tips: [
      'Each table gets a unique QR code automatically',
      'Optionally add NFC IDs for tap-to-order functionality',
      'Set the number of seats to track capacity',
    ],
  },
  {
    icon: QrCode,
    title: 'QR Code System',
    description: 'Every table has a unique QR code that customers scan to start ordering.',
    tips: [
      'QR codes link directly to your menu for that specific table',
      'Orders are automatically tagged with table and region info',
      'Kitchen staff see exactly which table ordered what',
    ],
  },
];

interface BranchGuideTourProps {
  onClose: () => void;
}

export function BranchGuideTour({ onClose }: BranchGuideTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('echefs_branch_tour_completed', 'true');
    onClose();
  };

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white/80 mb-1">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </div>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-lg text-muted-foreground mb-6">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
                      Key Tips
                    </h3>
                    {step.tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-900">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t p-6 bg-muted/30 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {TOUR_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-[#667c67] scale-125'
                        : index < currentStep
                        ? 'bg-[#667c67]/50'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              {currentStep < TOUR_STEPS.length - 1 ? (
                <Button onClick={handleNext} className="bg-[#667c67] gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Get Started
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Hook to check if tour should be shown
export function useBranchTour() {
  const [showTour, setShowTour] = useState(false);

  const checkTour = () => {
    const tourCompleted = localStorage.getItem('echefs_branch_tour_completed');
    if (!tourCompleted) {
      setShowTour(true);
    }
  };

  const closeTour = () => setShowTour(false);
  const openTour = () => setShowTour(true);

  return { showTour, checkTour, closeTour, openTour };
}
