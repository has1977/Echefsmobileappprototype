import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Gift, 
  Star, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Circle,
  ShoppingBag,
  Tag,
  AlertCircle,
  X
} from 'lucide-react';
import { GlassCard, GradientButton, Chip } from '../design-system';
import { Button } from '../components/ui/button';
import { gifts, loyaltyTiers } from '../services/promotionsData';

export function LoyaltyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { loyaltyCard, settings, currentLanguage, currentBranch, selectedBranch } = useApp();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rewards' | 'history'>('overview');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const isRTL = currentLanguage === 'ar';
  
  // Get current branch ID
  const branchId = currentBranch?.id || selectedBranch?.id || '';

  // Translations
  const translations = {
    en: {
      title: 'Loyalty & Rewards',
      yourPoints: 'Your Points',
      currentTier: 'Current Tier',
      lifetimePoints: 'Lifetime Points',
      nextTier: 'Next Tier',
      pointsToGo: 'points to go',
      overview: 'Overview',
      rewards: 'Rewards',
      history: 'History',
      tierBenefits: 'Tier Benefits',
      availableRewards: 'Available Rewards',
      recentActivity: 'Recent Activity',
      signInRequired: 'Sign in to view your loyalty rewards',
      signIn: 'Sign In',
      earnPoints: 'How to Earn Points',
      pointsPerDollar: 'points per $1 spent',
      bonusEvents: 'Bonus events & promotions',
      referFriends: 'Refer friends and family',
      redeemReward: 'Redeem',
      pointsRequired: 'points',
      locked: 'Locked',
      unlocked: 'Unlocked',
      comingSoon: 'Coming Soon',
      cancel: 'Cancel',
      viewPromotions: 'View Promotions',
      goToProfile: 'Go to Profile',
    },
    ar: {
      title: 'الولاء والمكافآت',
      yourPoints: 'نقاطك',
      currentTier: 'المستوى الحالي',
      lifetimePoints: 'النقاط الإجمالية',
      nextTier: 'المستوى التالي',
      pointsToGo: 'نقطة متبقية',
      overview: 'نظرة عامة',
      rewards: 'المكافآت',
      history: 'السجل',
      tierBenefits: 'مزايا المستوى',
      availableRewards: 'المكافآت المتاحة',
      recentActivity: 'النشاط الأخير',
      signInRequired: 'سجل الدخول لعرض مكافآت الولاء',
      signIn: 'تسجيل الدخول',
      earnPoints: 'كيفية كسب النقاط',
      pointsPerDollar: 'نقطة لكل $1',
      bonusEvents: 'أحداث المكافآت والعروض',
      referFriends: 'أحل الأصدقاء والعائلة',
      redeemReward: 'استبدال',
      pointsRequired: 'نقطة',
      locked: 'مقفل',
      unlocked: 'مفتوح',
      comingSoon: 'قريباً',
      cancel: 'إلغاء',
      viewPromotions: 'عرض العروض',
      goToProfile: 'الملف الشخصي',
    },
    ru: {
      title: 'Программа лояльности',
      yourPoints: 'Ваши баллы',
      currentTier: 'Текущий уровень',
      lifetimePoints: 'Всего баллов',
      nextTier: 'Следующий уровень',
      pointsToGo: 'баллов до',
      overview: 'Обзор',
      rewards: 'Награды',
      history: 'История',
      tierBenefits: 'Преимущества уровня',
      availableRewards: 'Доступные награды',
      recentActivity: 'Недавняя активность',
      signInRequired: 'Войдите, чтобы увидеть награды',
      signIn: 'Войти',
      earnPoints: 'Как заработать баллы',
      pointsPerDollar: 'баллов за $1',
      bonusEvents: 'Бонусные акции',
      referFriends: 'Приглашайте друзей',
      redeemReward: 'Получить',
      pointsRequired: 'баллов',
      locked: 'Закрыто',
      unlocked: 'Открыто',
      comingSoon: 'Скоро',
      cancel: 'Отмена',
      viewPromotions: 'Смотреть акции',
      goToProfile: 'Профиль',
    },
    ky: {
      title: 'Лоялдуулук программасы',
      yourPoints: 'Сиздин упайларыңыз',
      currentTier: 'Учурдагы деңгээл',
      lifetimePoints: 'Бардык упайлар',
      nextTier: 'Кийинки деңгээл',
      pointsToGo: 'упай калды',
      overview: 'Жалпы көрүнүш',
      rewards: 'Сыйлыктар',
      history: 'Тарых',
      tierBenefits: 'Деңгээл артыкчылыктары',
      availableRewards: 'Жеткиликтүү сыйлыктар',
      recentActivity: 'Акыркы активдүүлүк',
      signInRequired: 'Сыйлыктарды көрүү үчүн кириңиз',
      signIn: 'Кирүү',
      earnPoints: 'Упай кантип топтоого болот',
      pointsPerDollar: '$1 үчүн упай',
      bonusEvents: 'Бонустук акциялар',
      referFriends: 'Досторду чакырыңыз',
      redeemReward: 'Алуу',
      pointsRequired: 'упай',
      locked: 'Жабык',
      unlocked: 'Ачык',
      comingSoon: 'Жакында',
      cancel: 'Жокко чыгаруу',
      viewPromotions: 'Акцияларды көрүү',
      goToProfile: 'Профиль',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // Use tier configuration from promotionsData for consistency
  const getCurrentTier = (points: number) => {
    return [...loyaltyTiers].reverse().find(tier => points >= tier.min_points) || loyaltyTiers[0];
  };

  const getNextTier = (points: number) => {
    return loyaltyTiers.find(tier => points < tier.min_points);
  };

  // Get actual gifts/rewards from promotionsData
  // Filter to show only active gifts
  const availableGifts = gifts.filter(gift => {
    // Only show active gifts
    if (gift.status !== 'active') return false;
    
    // Check if branch-specific or available to all branches
    if (Array.isArray(gift.branches)) {
      return branchId && gift.branches.includes(branchId);
    }
    
    return gift.branches === 'all';
  });

  // Helper to get gift category icon
  const getGiftIcon = (category: string) => {
    switch (category) {
      case 'voucher': return '🎟️';
      case 'product': return '🍽️';
      case 'experience': return '🎭';
      case 'discount': return '🎁';
      default: return '✨';
    }
  };

  // Helper to check if user can redeem a gift
  const canRedeemGift = (gift: typeof gifts[0]) => {
    if (!loyaltyCard) return false;
    return loyaltyCard.points >= gift.points_required && gift.stock > 0;
  };

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated || !user || !loyaltyCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] flex items-center justify-center p-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#667c67] to-[#546352] rounded-3xl flex items-center justify-center shadow-xl"
            >
              <Crown className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1F2933] mb-3">{t.title}</h2>
            <p className="text-[#6B7280] mb-8">{t.signInRequired}</p>
            <GradientButton
              onClick={() => navigate('/sign-in')}
              size="xl"
              fullWidth
              leftIcon={<Lock className="w-5 h-5" />}
            >
              {t.signIn}
            </GradientButton>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  const currentTier = getCurrentTier(loyaltyCard.lifetimePoints);
  const nextTier = getNextTier(loyaltyCard.lifetimePoints);
  const pointsToNextTier = nextTier ? nextTier.min_points - loyaltyCard.lifetimePoints : 0;
  const progressToNextTier = nextTier 
    ? ((loyaltyCard.lifetimePoints - currentTier.min_points) / (nextTier.min_points - currentTier.min_points)) * 100
    : 100;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#667c67] to-[#546352] p-5 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        </div>

        {/* Points Card */}
        <GlassCard variant="elevated" className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#667c67]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#667c67]/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[#6B7280] font-medium mb-1">{t.yourPoints}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#1F2933]">{loyaltyCard.points}</span>
                  <span className="text-lg text-[#6B7280] font-semibold">{t.pointsRequired}</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`} style={{ background: currentTier.color }}>
                <span className="text-3xl">{currentTier.icon}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#1F2933]">{t.currentTier}: {currentTier.name}</span>
                {nextTier && (
                  <span className="text-[#6B7280]">
                    {pointsToNextTier} {t.pointsToGo}
                  </span>
                )}
              </div>
              
              {nextTier && (
                <div className="relative h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextTier}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentTier.color} rounded-full`}
                  />
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tab Navigation */}
      <div className="px-5 py-4 sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b border-[#E5E7EB]">
        <div className="flex gap-2">
          {(['overview', 'rewards', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                selectedTab === tab
                  ? 'bg-[#667c67] text-white shadow-lg'
                  : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Tier Benefits */}
              <div>
                <h3 className="text-lg font-bold text-[#1F2933] mb-4">{t.tierBenefits}</h3>
                <div className="space-y-3">
                  {loyaltyTiers.map((tier, index) => {
                    const isUnlocked = loyaltyCard.lifetimePoints >= tier.min_points;
                    return (
                      <GlassCard 
                        key={tier.id}
                        variant={isUnlocked ? 'elevated' : 'default'}
                        className={`p-4 ${!isUnlocked && 'opacity-60'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`} style={{ background: tier.color }}>
                            <span className="text-2xl">{tier.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-[#1F2933]">{tier.name}</h4>
                              {isUnlocked ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-[#9CA3AF]" />
                              )}
                            </div>
                            <p className="text-sm text-[#6B7280]">
                              {tier.min_points} {t.pointsRequired} • {isUnlocked ? t.unlocked : t.locked}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>

              {/* How to Earn */}
              <div>
                <h3 className="text-lg font-bold text-[#1F2933] mb-4">{t.earnPoints}</h3>
                <GlassCard variant="default" className="divide-y divide-[#E5E7EB]">
                  {[
                    { icon: TrendingUp, text: `${settings.loyalty.pointsPerDollar} ${t.pointsPerDollar}` },
                    { icon: Sparkles, text: t.bonusEvents, onClick: () => branchId && navigate(`/branch/${branchId}/promotions`) },
                    { icon: Gift, text: t.referFriends },
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-4 ${item.onClick ? 'cursor-pointer hover:bg-[#F9FAFB] transition-colors' : ''}`}
                      onClick={item.onClick}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[#374151] flex-1">{item.text}</span>
                      {item.onClick && <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />}
                    </div>
                  ))}
                </GlassCard>
              </div>
            </motion.div>
          )}

          {selectedTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-[#1F2933]">{t.availableRewards}</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableGifts.map((gift) => {
                  const canRedeem = canRedeemGift(gift);
                  return (
                    <GlassCard
                      key={gift.id}
                      variant={canRedeem ? 'elevated' : 'default'}
                      className={`p-4 ${!canRedeem && 'opacity-60'}`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{getGiftIcon(gift.category)}</div>
                        <h4 className="font-bold text-sm text-[#1F2933] mb-2">{gift.name}</h4>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-[#667c67]" />
                          <span className="text-sm font-semibold text-[#667c67]">{gift.points_required}</span>
                        </div>
                        <GradientButton
                          size="sm"
                          fullWidth
                          disabled={!canRedeem}
                          onClick={() => {
                            setSelectedReward(gift);
                            setShowRedeemModal(true);
                          }}
                        >
                          {canRedeem ? t.redeemReward : t.locked}
                        </GradientButton>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-[#1F2933]">{t.recentActivity}</h3>
              {loyaltyCard.transactions && loyaltyCard.transactions.length > 0 ? (
                <GlassCard variant="default" className="divide-y divide-[#E5E7EB]">
                  {loyaltyCard.transactions.slice(0, 10).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          transaction.points > 0 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        } flex items-center justify-center`}>
                          <Zap className={`w-5 h-5 ${
                            transaction.points > 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1F2933]">{transaction.description}</p>
                          <p className="text-xs text-[#6B7280]">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        transaction.points > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </span>
                    </div>
                  ))}
                </GlassCard>
              ) : (
                <GlassCard variant="default" className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                  <p className="text-[#6B7280]">{t.comingSoon}</p>
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1F2933]">{t.redeemReward}</h2>
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Gift Display */}
                <div className="text-center">
                  <div className="text-6xl mb-3">{getGiftIcon(selectedReward.category)}</div>
                  <h3 className="font-bold text-lg text-[#1F2933] mb-2">{selectedReward.name}</h3>
                  <p className="text-sm text-[#6B7280] mb-4">{selectedReward.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-[#667c67]" />
                    <span className="text-lg font-bold text-[#667c67]">{selectedReward.points_required} {t.pointsRequired}</span>
                  </div>
                </div>

                {/* User Points */}
                <div className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6B7280]">{t.yourPoints}:</span>
                    <span className="text-lg font-bold text-[#1F2933]">{loyaltyCard.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">After redemption:</span>
                    <span className="text-lg font-bold text-[#667c67]">
                      {loyaltyCard.points - selectedReward.points_required}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowRedeemModal(false)}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    {t.cancel}
                  </Button>
                  <GradientButton
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement actual redeem logic
                      setShowRedeemModal(false);
                      // Show success message
                    }}
                  >
                    {t.redeemReward}
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}