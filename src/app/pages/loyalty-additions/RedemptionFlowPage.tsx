import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Gift, ChevronRight, Check, Copy, Clock, AlertCircle } from 'lucide-react';
import { GlassCard, GradientButton, motion, AnimatePresence } from '../../design-system';
import { Logo } from '../../components/shared/Logo';
import { copyToClipboard } from '../../utils/clipboard';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  emoji: string;
}

type Step = 'select' | 'confirm' | 'success' | 'insufficient';

export function RedemptionFlowPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const userBalance = 450;
  const branchName = 'eChefs Downtown';

  const rewards: Reward[] = [
    { id: '1', name: 'Free Coffee', description: 'Any size, any flavor', pointsCost: 100, emoji: '☕' },
    { id: '2', name: 'Free Dessert', description: 'From dessert menu', pointsCost: 150, emoji: '🍰' },
    { id: '3', name: 'Free Appetizer', description: 'Choose any starter', pointsCost: 200, emoji: '🥗' },
    { id: '4', name: 'Free Main Course', description: 'Select from menu', pointsCost: 500, emoji: '🍝' },
    { id: '5', name: '20% Off Bill', description: 'Up to $50 discount', pointsCost: 300, emoji: '🎫' },
  ];

  const handleSelectReward = (reward: Reward) => {
    setSelectedReward(reward);
    if (userBalance < reward.pointsCost) {
      setCurrentStep('insufficient');
    } else {
      setCurrentStep('confirm');
    }
  };

  const handleConfirmRedeem = () => {
    setCurrentStep('success');
  };

  const copyCode = async () => {
    const success = await copyToClipboard('REDEEM-A7K2P9');
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const redeemCode = 'REDEEM-A7K2P9';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => currentStep === 'select' ? navigate(-1) : setCurrentStep('select')}
              className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2933]" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-md">
              <Logo size="sm" showText={false} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1F2933]">
                {currentStep === 'select' && 'Select Reward'}
                {currentStep === 'confirm' && 'Confirm Redemption'}
                {currentStep === 'success' && 'Redeemed!'}
                {currentStep === 'insufficient' && 'Insufficient Points'}
              </h1>
              <p className="text-sm text-[#6B7280]">{branchName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {currentStep !== 'insufficient' && (
        <div className="px-6 py-4 bg-white/50">
          <div className="flex items-center justify-center gap-2">
            {['select', 'confirm', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    currentStep === step
                      ? 'bg-gradient-to-r from-[#667c67] to-[#546352] text-white'
                      : ['select', 'confirm', 'success'].indexOf(currentStep) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {['select', 'confirm', 'success'].indexOf(currentStep) > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded ${
                      ['select', 'confirm', 'success'].indexOf(currentStep) > index
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Reward */}
          {currentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <GlassCard variant="elevated" className="p-6 bg-gradient-to-br from-[#667c67] to-[#546352] text-white">
                <p className="text-white/70 text-sm mb-1">Your Balance</p>
                <p className="text-4xl font-bold">{userBalance} points</p>
              </GlassCard>

              {/* Rewards List */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1F2933] px-1">Available Rewards</h3>
                {rewards.map((reward, index) => {
                  const canAfford = userBalance >= reward.pointsCost;
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard
                        variant="elevated"
                        className={`p-5 ${
                          canAfford
                            ? 'cursor-pointer hover:shadow-xl transition-all'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => canAfford && handleSelectReward(reward)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-[#E4DBC4]/60 flex items-center justify-center text-3xl flex-shrink-0">
                            {reward.emoji}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-[#1F2933] mb-1">{reward.name}</h4>
                            <p className="text-sm text-[#6B7280] mb-2">{reward.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-[#667c67]">
                                {reward.pointsCost} pts
                              </span>
                              {!canAfford && (
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                                  Need {reward.pointsCost - userBalance} more
                                </span>
                              )}
                            </div>
                          </div>
                          {canAfford && (
                            <ChevronRight className="w-5 h-5 text-[#667c67]" />
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Confirm */}
          {currentStep === 'confirm' && selectedReward && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Selected Reward */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-[#E4DBC4]/60 flex items-center justify-center text-4xl">
                    {selectedReward.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1F2933] mb-1">{selectedReward.name}</h3>
                    <p className="text-sm text-[#6B7280]">{selectedReward.description}</p>
                  </div>
                </div>

                {/* Points Breakdown */}
                <div className="space-y-3 py-4 border-t border-b border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Points Cost</span>
                    <span className="text-lg font-bold text-[#1F2933]">-{selectedReward.pointsCost}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Current Balance</span>
                    <span className="text-lg font-bold text-[#667c67]">{userBalance}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-[#1F2933]">Remaining Balance</span>
                    <span className="text-2xl font-bold text-[#667c67]">
                      {userBalance - selectedReward.pointsCost}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Confirm Button */}
              <GradientButton
                onClick={handleConfirmRedeem}
                size="lg"
                fullWidth
                leftIcon={<Gift className="w-5 h-5" />}
              >
                Confirm Redemption
              </GradientButton>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {currentStep === 'success' && selectedReward && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                  <Check className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-[#1F2933] mb-2">Successfully Redeemed!</h2>
                <p className="text-[#6B7280]">Show this code to staff</p>
              </div>

              {/* Reward Card */}
              <GlassCard variant="elevated" className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-[#E4DBC4]/60 flex items-center justify-center text-5xl">
                    {selectedReward.emoji}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-[#1F2933] mb-2">
                  {selectedReward.name}
                </h3>
                <p className="text-center text-[#6B7280] mb-6">{selectedReward.description}</p>

                {/* QR Code Placeholder */}
                <div className="bg-white rounded-2xl p-6 mb-4 border-2 border-dashed border-[#667c67]/30">
                  <div className="w-full aspect-square bg-gradient-to-br from-[#667c67]/10 to-[#E4DBC4]/20 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <span className="text-6xl mb-2 block">📱</span>
                      <p className="text-xs text-[#6B7280]">Redemption QR Code</p>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="bg-[#F3F7F3] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#6B7280] mb-1">Redemption Code</p>
                      <p className="text-lg font-bold text-[#1F2933] tracking-wider">{redeemCode}</p>
                    </div>
                    <button
                      onClick={copyCode}
                      className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                      {copiedCode ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-[#667c67]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Pickup Instructions */}
                <div className="bg-[#E4DBC4]/20 rounded-xl p-4">
                  <h4 className="font-semibold text-[#1F2933] mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#667c67]" />
                    Pickup Instructions
                  </h4>
                  <ul className="space-y-1 text-sm text-[#6B7280]">
                    <li>• Show this code to any staff member</li>
                    <li>• Valid for 24 hours from redemption</li>
                    <li>• Single use only</li>
                    <li>• Cannot be refunded</li>
                  </ul>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="space-y-3">
                <GradientButton
                  onClick={() => navigate(`/loyalty-additions/branch/${branchId}`)}
                  size="lg"
                  fullWidth
                >
                  Back to Loyalty Program
                </GradientButton>
                <button
                  onClick={() => setCurrentStep('select')}
                  className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-colors"
                >
                  Redeem Another Reward
                </button>
              </div>
            </motion.div>
          )}

          {/* Insufficient Points */}
          {currentStep === 'insufficient' && selectedReward && (
            <motion.div
              key="insufficient"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1F2933] mb-2">Insufficient Points</h2>
                <p className="text-[#6B7280]">You need more points for this reward</p>
              </div>

              {/* Info Card */}
              <GlassCard variant="elevated" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280]">Required Points</span>
                    <span className="text-xl font-bold text-[#1F2933]">{selectedReward.pointsCost}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                    <span className="text-[#6B7280]">Your Balance</span>
                    <span className="text-xl font-bold text-[#667c67]">{userBalance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2933]">Points Needed</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {selectedReward.pointsCost - userBalance}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="space-y-3">
                <GradientButton
                  onClick={() => navigate(`/loyalty-additions/check-in/${branchId}`)}
                  size="lg"
                  fullWidth
                >
                  Earn More Points
                </GradientButton>
                <button
                  onClick={() => setCurrentStep('select')}
                  className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-colors"
                >
                  Choose Another Reward
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}