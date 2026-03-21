import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, QrCode, Keyboard, Check, TrendingUp, Award } from 'lucide-react';
import { GlassCard, GradientButton, motion, AnimatePresence } from '../../design-system';
import { Logo } from '../../components/shared/Logo';

type CheckInMode = 'select' | 'qr' | 'code' | 'success';

export function CheckInPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [mode, setMode] = useState<CheckInMode>('select');
  const [checkInCode, setCheckInCode] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const branchName = 'eChefs Downtown';

  const handleQRScan = () => {
    // Simulate QR scan
    setTimeout(() => {
      setPointsEarned(30);
      setMode('success');
    }, 1500);
  };

  const handleCodeSubmit = () => {
    if (checkInCode.length >= 6) {
      setPointsEarned(30);
      setMode('success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => mode === 'select' ? navigate(-1) : setMode('select')}
              className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2933]" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-md">
              <Logo size="sm" showText={false} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1F2933]">Check-in & Earn</h1>
              <p className="text-sm text-[#6B7280]">{branchName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Selection Mode */}
          {mode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Info Card */}
              <GlassCard variant="elevated" className="p-8 text-center bg-gradient-to-br from-[#667c67] to-[#546352] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Earn Bonus Points!</h2>
                  <p className="text-white/90 mb-4">Check-in to earn 30 loyalty points</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">Once per day</span>
                  </div>
                </div>
              </GlassCard>

              {/* Choose Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2933] px-1">Choose Check-in Method</h3>

                {/* QR Scanner */}
                <GlassCard
                  variant="elevated"
                  className="p-6 cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setMode('qr')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-md">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#1F2933] mb-1">Scan QR Code</h4>
                      <p className="text-sm text-[#6B7280]">Scan the code at your table</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Recommended
                    </div>
                  </div>
                </GlassCard>

                {/* Manual Code */}
                <GlassCard
                  variant="elevated"
                  className="p-6 cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setMode('code')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-[#D4CBB4] flex items-center justify-center shadow-md">
                      <Keyboard className="w-8 h-8 text-[#667c67]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#1F2933] mb-1">Enter Code</h4>
                      <p className="text-sm text-[#6B7280]">Type the check-in code manually</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* QR Scanner */}
          {mode === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassCard variant="elevated" className="p-8">
                <h3 className="text-xl font-bold text-center text-[#1F2933] mb-6">
                  Position QR code in the frame
                </h3>

                {/* QR Scanner Viewport */}
                <div className="aspect-square bg-gradient-to-br from-[#667c67]/10 to-[#E4DBC4]/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                  {/* Scanner Animation */}
                  <motion.div
                    className="absolute inset-0 border-4 border-[#667c67] rounded-2xl"
                    animate={{
                      borderColor: ['#667c67', '#546352', '#667c67'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
                  </motion.div>

                  {/* Scanning line */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#667c67] to-transparent"
                    animate={{
                      top: ['10%', '90%', '10%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  <div className="text-center z-10">
                    <QrCode className="w-24 h-24 text-[#667c67] mx-auto mb-4" />
                    <p className="text-sm text-[#6B7280] font-semibold">Scanning...</p>
                  </div>
                </div>

                <p className="text-center text-sm text-[#6B7280] mb-4">
                  Find the QR code on your table or at the entrance
                </p>

                <GradientButton onClick={handleQRScan} size="lg" fullWidth>
                  Simulate Scan (Demo)
                </GradientButton>
              </GlassCard>
            </motion.div>
          )}

          {/* Manual Code Entry */}
          {mode === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassCard variant="elevated" className="p-8">
                <h3 className="text-xl font-bold text-center text-[#1F2933] mb-6">
                  Enter Check-in Code
                </h3>

                {/* Code Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest rounded-2xl border-2 border-[#667c67]/20 focus:border-[#667c67] focus:outline-none bg-white"
                  />
                  <p className="text-center text-sm text-[#6B7280] mt-3">
                    Ask staff for the check-in code
                  </p>
                </div>

                {/* Number Pad (Demo) */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        if (checkInCode.length < 6) {
                          setCheckInCode(checkInCode + num);
                        }
                      }}
                      className="aspect-square rounded-xl bg-white border-2 border-[#E5E7EB] text-2xl font-bold text-[#1F2933] hover:border-[#667c67]/50 hover:bg-[#667c67]/5 transition-all active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setCheckInCode('')}
                    className="aspect-square rounded-xl bg-white border-2 border-[#E5E7EB] text-sm font-semibold text-[#6B7280] hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                  >
                    Clear
                  </button>
                </div>

                <GradientButton
                  onClick={handleCodeSubmit}
                  size="lg"
                  fullWidth
                  disabled={checkInCode.length < 6}
                >
                  Submit Code
                </GradientButton>
              </GlassCard>
            </motion.div>
          )}

          {/* Success */}
          {mode === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Success Animation */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl"
                >
                  <Check className="w-16 h-16 text-white" />
                </motion.div>
              </div>

              <div className="text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-[#1F2933] mb-2"
                >
                  Check-in Successful!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#6B7280]"
                >
                  You've earned bonus points
                </motion.p>
              </div>

              {/* Points Earned Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard variant="elevated" className="p-8 bg-gradient-to-br from-[#667c67] to-[#546352] text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white/90 text-sm mb-2">Points Earned</p>
                    <motion.p
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                      className="text-6xl font-bold mb-2"
                    >
                      +{pointsEarned}
                    </motion.p>
                    <p className="text-white/80 text-sm">Added to your balance</p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Next Check-in Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard variant="default" className="p-5 bg-[#E4DBC4]/20">
                  <p className="text-center text-sm text-[#6B7280]">
                    <span className="font-semibold text-[#1F2933]">Next check-in available:</span>
                    <br />
                    Tomorrow at {new Date(Date.now() + 86400000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                <GradientButton
                  onClick={() => navigate(`/loyalty-additions/branch/${branchId}`)}
                  size="lg"
                  fullWidth
                >
                  View Loyalty Balance
                </GradientButton>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-colors"
                >
                  Browse Menu
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
