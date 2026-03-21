import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Gift, Clock, MapPin, Tag, X, Check, Copy } from 'lucide-react';
import { GlassCard, GradientButton, motion, AnimatePresence } from '../../design-system';
import { Logo } from '../../components/shared/Logo';
import { copyToClipboard } from '../../utils/clipboard';

export function PromotionDetailPage() {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock promotion data
  const promotion = {
    id: promotionId,
    title: '🎉 Buy 1 Get 1 Free',
    description: 'Get a free main course when you purchase any main course from our menu',
    branchName: 'eChefs Downtown',
    validity: 'Valid until Mar 31, 2026',
    expiresIn: '14 days',
    remainingQty: 47,
    totalQty: 100,
    terms: [
      'Valid for dine-in only',
      'Cannot be combined with other offers',
      'One redemption per customer per day',
      'Main courses must be of equal or lesser value',
      'Excludes premium steaks and seafood',
    ],
    imageEmoji: '🎉',
  };

  const handleClaim = () => {
    setClaimed(true);
    setShowClaimModal(true);
  };

  const copyCode = async () => {
    const success = await copyToClipboard('PROMO-2026-XJ8K9');
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const redeemCode = 'PROMO-2026-XJ8K9';
  const expiryDate = 'Mar 31, 2026 23:59';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2933]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#1F2933]">Promotion Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Promotion Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="elevated" className="overflow-hidden">
            {/* Hero Image/Icon */}
            <div className="h-48 bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/60 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="text-8xl relative z-10">{promotion.imageEmoji}</span>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#1F2933] mb-3">{promotion.title}</h2>
              <p className="text-[#6B7280] mb-4 leading-relaxed">{promotion.description}</p>

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#667c67]" />
                  <span className="text-[#1F2933] font-medium">{promotion.branchName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#667c67]" />
                  <span className="text-[#1F2933] font-medium">{promotion.validity}</span>
                  <span className="ml-auto px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {promotion.expiresIn} left
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-[#667c67]" />
                  <span className="text-[#1F2933] font-medium">
                    {promotion.remainingQty} / {promotion.totalQty} remaining
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#667c67] to-[#546352]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(promotion.remainingQty / promotion.totalQty) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Claim Button */}
              {!claimed ? (
                <GradientButton
                  onClick={handleClaim}
                  size="lg"
                  fullWidth
                  leftIcon={<Gift className="w-5 h-5" />}
                >
                  Claim This Promotion
                </GradientButton>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-4 rounded-2xl bg-green-100 text-green-700 font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Claimed Successfully
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="default" className="p-6">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4">Terms & Conditions</h3>
            <ul className="space-y-2">
              {promotion.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#667c67] mt-2 flex-shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Claim Success Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClaimModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6"
            >
              <GlassCard variant="elevated" className="p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#1F2933]" />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center text-[#1F2933] mb-2">
                  Promotion Claimed!
                </h3>
                <p className="text-center text-[#6B7280] mb-6">
                  Your single-use code is ready
                </p>

                {/* QR Code Placeholder */}
                <div className="bg-white rounded-2xl p-6 mb-6 flex flex-col items-center border-2 border-dashed border-[#667c67]/30">
                  <div className="w-48 h-48 bg-gradient-to-br from-[#667c67]/10 to-[#E4DBC4]/20 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-6xl">📱</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">QR Code</p>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="w-full bg-[#F3F7F3] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#6B7280] mb-1">Promo Code</p>
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

                {/* Expiry Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-900">Valid Until</p>
                  </div>
                  <p className="text-sm text-orange-700">{expiryDate}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <GradientButton
                    onClick={() => {
                      setShowClaimModal(false);
                      navigate(`/loyalty-additions/branch/${promotion.id}`);
                    }}
                    size="lg"
                    fullWidth
                  >
                    Use Now at {promotion.branchName}
                  </GradientButton>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="w-full px-6 py-3 rounded-xl text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-colors"
                  >
                    I'll Use It Later
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}