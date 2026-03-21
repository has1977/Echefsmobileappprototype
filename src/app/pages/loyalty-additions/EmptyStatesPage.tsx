import { useNavigate } from 'react-router';
import { Award, Gift, WifiOff, TrendingUp, QrCode } from 'lucide-react';
import { GlassCard, GradientButton, motion } from '../../design-system';

export function EmptyStatesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] p-6">
      <h1 className="text-3xl font-bold text-[#1F2933] mb-8 text-center">
        Empty & Edge States
      </h1>

      <div className="space-y-8 max-w-md mx-auto">
        {/* Empty Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <GlassCard variant="elevated" className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-[#667c67]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">Empty Wallet</h3>
              <p className="text-[#6B7280] mb-6">
                You haven't enrolled in any loyalty programs yet
              </p>
              <GradientButton
                onClick={() => navigate('/loyalty-additions/branches')}
                size="lg"
                fullWidth
              >
                Discover Branches
              </GradientButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* No Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center mx-auto mb-6">
                <Gift className="w-12 h-12 text-[#667c67]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">No Active Promotions</h3>
              <p className="text-[#6B7280] mb-6">
                There are no promotions available at this branch right now
              </p>
              <GradientButton
                onClick={() => navigate('/loyalty-additions/notifications')}
                size="lg"
                fullWidth
              >
                Get Notified
              </GradientButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Offline Pending Redemption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="elevated" className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
                <WifiOff className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">Offline Mode</h3>
              <p className="text-[#6B7280] mb-6">
                Your redemption is pending. It will be processed when you're back online.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-orange-900 font-semibold mb-1">Pending Redemption</p>
                <p className="text-sm text-orange-700">Free Coffee • 100 points</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Insufficient Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="elevated" className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">Insufficient Points</h3>
              <p className="text-[#6B7280] mb-6">
                You need 150 more points to redeem this reward
              </p>

              <div className="bg-[#F3F7F3] rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Required Points</span>
                  <span className="font-bold text-[#1F2933]">500</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Your Balance</span>
                  <span className="font-bold text-[#667c67]">350</span>
                </div>
                <div className="h-px bg-[#E5E7EB] my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2933]">Points Needed</span>
                  <span className="text-xl font-bold text-red-600">150</span>
                </div>
              </div>

              <div className="space-y-3">
                <GradientButton
                  onClick={() => navigate('/loyalty-additions/check-in/1')}
                  size="lg"
                  fullWidth
                  leftIcon={<QrCode className="w-5 h-5" />}
                >
                  Check-in to Earn Points
                </GradientButton>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Navigation Back */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/loyalty-additions/branches')}
            className="w-full px-6 py-3 rounded-xl text-[#6B7280] font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Branches
          </button>
        </div>
      </div>
    </div>
  );
}
