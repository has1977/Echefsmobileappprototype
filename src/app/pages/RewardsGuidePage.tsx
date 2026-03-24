import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { motion } from 'motion/react';
// Icons from lucide-react - Updated with ChevronRight
import { 
  ArrowLeft, Star, Trophy, Percent, Gift, Zap, Target, Crown,
  Award, Lightbulb, TrendingUp, Sparkles, CheckCircle, Info,
  Calendar, MapPin, Bell, ShoppingBag, Heart, Package, DollarSign,
  ChevronRight
} from 'lucide-react';
import { GlassCard, GradientButton, Chip } from '../design-system';
import type { LoyaltyRule, Gift as GiftType, Promotion } from '../lib/types';
import { useLoyaltyCurrency, useEarningRate } from '../hooks/useCurrency';
import { formatLoyaltyCurrency } from '../utils/currency';

export function RewardsGuidePage() {
  const navigate = useNavigate();
  const { currentLanguage, currentBranch, selectedBranch } = useApp();
  const { user } = useAuth();
  
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const isRTL = currentLanguage === 'ar';
  const branchId = currentBranch?.id || selectedBranch?.id;

  // Use centralized currency hooks
  const currency = useLoyaltyCurrency();
  const amountPerPoint = useEarningRate();

  // Get loyalty settings from database (for backward compatibility)
  const settings = db.getSettings();
  const loyaltySettings = settings.loyalty;

  useEffect(() => {
    // Load loyalty rules
    const rules = db.getLoyaltyRules();
    setLoyaltyRules(rules);

    // Load gifts
    const allGifts = db.getGifts();
    setGifts(allGifts);

    // Load active promotions
    const allPromotions = db.getPromotions();
    const activePromotions = allPromotions.filter(p => p.status === 'active');
    setPromotions(activePromotions);
  }, []);

  // Get tier rules
  const tierRules = loyaltyRules.filter(r => r.type === 'tier_threshold').sort((a, b) => a.value - b.value);

  // Use currency symbol from hook
  const currencySymbol = currency.symbol;

  const translations = {
    en: {
      title: 'How Rewards Work',
      subtitle: 'Complete guide to earning points, leveling up, and redeeming amazing rewards',
      backToProfile: 'Back to Profile',
      pointsSystem: 'Loyalty Points System',
      pointsDesc: 'Earn points with every purchase and redeem them for exclusive rewards',
      howToEarn: 'How to Earn Points',
      earnRate: 'Earning Rate',
      earnRateDesc: `Earn 1 point for every ${amountPerPoint} ${currencySymbol} you spend`,
      pointsNeverExpire: 'Points Never Expire',
      pointsNeverExpireDesc: 'Your points stay active as long as you remain a member',
      branchSpecific: 'Branch-Specific',
      branchSpecificDesc: 'Points earned at one branch can only be used at that branch',
      tierSystem: 'Membership Tiers',
      tierSystemDesc: 'Level up your membership to unlock better rewards and exclusive perks',
      currentTier: 'Your Current Tier',
      tierBenefits: 'Tier Benefits',
      promotions: 'Exclusive Promotions',
      promotionsDesc: 'Get access to special offers, discounts, and limited-time deals',
      activePromotions: 'Active Promotions',
      noActivePromotions: 'No active promotions at the moment',
      giftsCatalog: 'Rewards Catalog',
      giftsCatalogDesc: 'Redeem your points for amazing gifts and rewards',
      availableGifts: 'Available Rewards',
      pointsRequired: 'Points Required',
      redeemNow: 'Redeem Now',
      insufficientPoints: 'Not enough points',
      proTips: 'Pro Tips',
      proTipsDesc: 'Maximize your rewards with these expert strategies',
      faq: 'Frequently Asked Questions',
      questionPoints: 'How do I earn points?',
      answerPoints: 'You automatically earn points with every purchase. The points are added to your account immediately after order completion.',
      questionExpire: 'Do points expire?',
      answerExpire: 'No! Your points never expire as long as you remain an active member.',
      questionRedeem: 'How do I redeem points?',
      answerRedeem: 'Visit the Loyalty page, browse available rewards, and tap "Redeem" on any item you want.',
      questionBranch: 'Can I use points at any branch?',
      answerBranch: 'Points are branch-specific. Points earned at one branch can only be used at that same branch.',
      questionTier: 'How do I level up my tier?',
      answerTier: 'Tiers are based on your total points earned. Keep ordering to climb the tiers!',
      getStarted: 'Get Started',
      getStartedDesc: 'Start earning rewards today',
      browseMenu: 'Browse Menu',
      viewLoyalty: 'View Loyalty Page',
      checkPromotions: 'Check Promotions',
    },
    ar: {
      title: 'كيف تعمل المكافآت',
      subtitle: 'دليل شامل لكسب النقاط والترقي واسترداد المكافآت المذهلة',
      backToProfile: 'العودة للملف الشخصي',
      pointsSystem: 'نظام نقاط الولاء',
      pointsDesc: 'اكسب النقاط مع كل عملية شراء واستبدلها بمكافآت حصرية',
      howToEarn: 'كيفية كسب النقاط',
      earnRate: 'معدل الكسب',
      earnRateDesc: `اكسب نقطة واحدة لكل ${amountPerPoint} ${currencySymbol} تنفقها`,
      pointsNeverExpire: 'النقاط لا تنتهي صلاحيتها',
      pointsNeverExpireDesc: 'تظل نقاطك نشطة طالما أنك عضو',
      branchSpecific: 'خاص بالفرع',
      branchSpecificDesc: 'النقاط المكتسبة في فرع واحد يمكن استخدامها فقط في ذلك الفرع',
      tierSystem: 'مستويات العضوية',
      tierSystemDesc: 'قم بترقية عضويتك لفتح مكافآت أفضل ومزايا حصرية',
      currentTier: 'مستواك الحالي',
      tierBenefits: 'مزايا المستوى',
      promotions: 'العروض الحصرية',
      promotionsDesc: 'احصل على عروض خاصة وخصومات وصفقات محدودة الوقت',
      activePromotions: 'العروض النشطة',
      noActivePromotions: 'لا توجد عروض نشطة في الوقت الحالي',
      giftsCatalog: 'كتالوج المكافآت',
      giftsCatalogDesc: 'استبدل نقاطك بهدايا ومكافآت مذهلة',
      availableGifts: 'المكافآت المتاحة',
      pointsRequired: 'النقاط المطلوبة',
      redeemNow: 'استبدل الآن',
      insufficientPoints: 'نقاط غير كافية',
      proTips: 'نصائح احترافية',
      proTipsDesc: 'عظّم مكافآتك مع هذه الاستراتيجيات',
      faq: 'الأسئلة الشائعة',
      questionPoints: 'كيف أكسب النقاط؟',
      answerPoints: 'تكسب النقاط تلقائيًا مع كل عملية شراء. تُضاف النقاط إلى حسابك فورًا بعد اكتمال الطلب.',
      questionExpire: 'هل تنتهي صلاحية النقاط؟',
      answerExpire: 'لا! نقاطك لا تنتهي صلاحيتها طالما أنك عضو نشط.',
      questionRedeem: 'كيف أستبدل النقاط؟',
      answerRedeem: 'قم بزيارة صفحة الولاء، تصفح المكافآت المتاحة، واضغط على "استبدال" على أي عنصر تريده.',
      questionBranch: 'هل يمكنني استخدام النقاط في أي فرع؟',
      answerBranch: 'النقاط خاصة بالفرع. النقاط المكتسبة في فرع واحد يمكن استخدامها فقط في نفس الفرع.',
      questionTier: 'كيف أرتقي بمستواي؟',
      answerTier: 'المستويات تعتمد على إجمالي النقاط المكتسبة. استمر في الطلب للارتقاء!',
      getStarted: 'ابدأ الآن',
      getStartedDesc: 'ابدأ في كسب المكافآت اليوم',
      browseMenu: 'تصفح القائمة',
      viewLoyalty: 'عرض صفحة الولاء',
      checkPromotions: 'تحقق من العروض',
    },
    ru: {
      title: 'Как работают награды',
      subtitle: 'Полное руководство по накоплению баллов, повышению уровня и получению наград',
      backToProfile: 'Назад в профиль',
      pointsSystem: 'Система баллов лояльности',
      pointsDesc: 'Зарабатывайте баллы с каждой покупкой и обменивайте их на эксклюзивные награды',
      howToEarn: 'Как заработать баллы',
      earnRate: 'Ставка начисления',
      earnRateDesc: `Зарабатывайте 1 балл за каждые ${amountPerPoint} ${currencySymbol} потраченных`,
      pointsNeverExpire: 'Баллы не сгорают',
      pointsNeverExpireDesc: 'Ваши баллы остаются активными, пока вы являетесь участником',
      branchSpecific: 'Привязаны к филиалу',
      branchSpecificDesc: 'Баллы, заработанные в одном филиале, можно использовать только в нем',
      tierSystem: 'Уровни членства',
      tierSystemDesc: 'Повышайте уровень членства, чтобы получить лучшие награды и эксклюзивные привилегии',
      currentTier: 'Ваш текущий уровень',
      tierBenefits: 'Преимущества уровня',
      promotions: 'Эксклюзивные акции',
      promotionsDesc: 'Получите доступ к специальным предложениям, скидкам и ограниченным по времени сделкам',
      activePromotions: 'Активные акции',
      noActivePromotions: 'На данный момент нет активных акций',
      giftsCatalog: 'Каталог наград',
      giftsCatalogDesc: 'Обменяйте свои баллы на отличные подарки и награды',
      availableGifts: 'Доступные награды',
      pointsRequired: 'Требуется баллов',
      redeemNow: 'Получить',
      insufficientPoints: 'Недостаточно баллов',
      proTips: 'Профессиональные советы',
      proTipsDesc: 'Максимизируйте свои награды с помощью этих стратегий',
      faq: 'Часто задаваемые вопросы',
      questionPoints: 'Как я зарабатываю баллы?',
      answerPoints: 'Вы автоматически зарабатываете баллы с каждой покупкой. Баллы добавляются на ваш счет сразу после завершения заказа.',
      questionExpire: 'Баллы сгорают?',
      answerExpire: 'Нет! Ваши баллы никогда не сгорают, пока вы остаетесь активным участником.',
      questionRedeem: 'Как обменять баллы?',
      answerRedeem: 'Посетите страницу лояльности, просмотрите доступные награды и нажмите "Получить" на любом товаре.',
      questionBranch: 'Могу ли я использовать баллы в любом филиале?',
      answerBranch: 'Баллы привязаны к филиалу. Баллы, заработанные в одном филиале, можно использовать только в нем.',
      questionTier: 'Как повысить уровень?',
      answerTier: 'Уровни основаны на общем количестве заработанных баллов. Продолжайте заказывать, чтобы подняться!',
      getStarted: 'Начать',
      getStartedDesc: 'Начните зарабатывать награды сегодня',
      browseMenu: 'Просмотреть меню',
      viewLoyalty: 'Страница лояльности',
      checkPromotions: 'Проверить акции',
    },
    ky: {
      title: 'Сыйлыктар кантип иштейт',
      subtitle: 'Упайларды топтоо, деңгээлди көтөрүү жана сыйлыктарды алуу боюнча толук көрсөтмө',
      backToProfile: 'Профилге кайтуу',
      pointsSystem: 'Лоялдуулук упайлар системасы',
      pointsDesc: 'Ар бир сатып алуу менен упай топтоп, аларды эксклюзивдүү сыйлыктарга алмаштырыңыз',
      howToEarn: 'Упайларды кантип топтоо керек',
      earnRate: 'Топтоо ылдамдыгы',
      earnRateDesc: `Ар ${amountPerPoint} ${currencySymbol} үчүн 1 упай топтоңуз`,
      pointsNeverExpire: 'Упайлар мөөнөтү бүтпөйт',
      pointsNeverExpireDesc: 'Упайларыңыз мүчө болгонуңузча активдүү калат',
      branchSpecific: 'Филиалга байланыштуу',
      branchSpecificDesc: 'Бир филиалда топтолгон упайларды ошол эле филиалда гана колдонсо болот',
      tierSystem: 'Мүчөлүк деңгээлдери',
      tierSystemDesc: 'Жакшыраак сыйлыктарды ачуу үчүн деңгээлди көтөрүңүз',
      currentTier: 'Сиздин азыркы деңгээлиңиз',
      tierBenefits: 'Деңгээл артыкчылыктары',
      promotions: 'Эксклюзивдүү акциялар',
      promotionsDesc: 'Атайын сунуштарга, арзандатууларга жана мөөнөттүү сделкаларга жетишиңиз',
      activePromotions: 'Активдүү акциялар',
      noActivePromotions: 'Учурда активдүү акциялар жок',
      giftsCatalog: 'Сыйлыктар каталогу',
      giftsCatalogDesc: 'Упайларыңызды укмуштуудай сыйлыктарга алмаштырыңыз',
      availableGifts: 'Жеткиликтүү сыйлыктар',
      pointsRequired: 'Керектүү упайлар',
      redeemNow: 'Азыр алуу',
      insufficientPoints: 'Упайлар жетишсиз',
      proTips: 'Профессионалдык кеңештер',
      proTipsDesc: 'Бул стратегиялар менен сыйлыктарды максималдаштырыңыз',
      faq: 'Көп берилүүчү суроолор',
      questionPoints: 'Упайларды кантип топтоо керек?',
      answerPoints: 'Ар бир сатып алуу менен автоматтык түрдө упай топтойсуз. Буйрутма аткарылгандан кийин упайлар дароо кошулат.',
      questionExpire: 'Упайлардын мөөнөтү бүтөбү?',
      answerExpire: 'Жок! Активдүү мүчө болгонуңузча упайларыңыздын мөөнөтү бүтпөйт.',
      questionRedeem: 'Упайларды кантип алмаштыруу керек?',
      answerRedeem: 'Лоялдуулук бетине кириңиз, жеткиликтүү сыйлыктарды карап чыгыңыз жана каалаган нерсеге "Алуу" басыңыз.',
      questionBranch: 'Упайларды каалаган филиалда колдонсо болобу?',
      answerBranch: 'Упайлар филиалга байланыштуу. Бир филиалда топтолгон упайларды ошол эле филиалда гана колдонсо болот.',
      questionTier: 'Деңгээлди кантип көтөрүү керек?',
      answerTier: 'Деңгээлдер топтолгон упайлардын жалпы санына негизделет. Деңгээлди көтөрүү үчүн буйрутмаларды уланта бериңиз!',
      getStarted: 'Баштоо',
      getStartedDesc: 'Бүгүн сыйлыктарды топтоону баштаңыз',
      browseMenu: 'Менюну карап чыгуу',
      viewLoyalty: 'Лоялдуулук бети',
      checkPromotions: 'Акцияларды текшерүү',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // Get user's loyalty card for current branch
  const loyaltyCard = user && branchId ? db.getLoyaltyCard(user.id, branchId) : null;
  const userPoints = loyaltyCard?.points || 0;

  // Determine user tier
  const getUserTier = (points: number) => {
    const sortedTiers = [...tierRules].reverse();
    for (const tier of sortedTiers) {
      if (points >= tier.value) {
        return tier.tier || 'Bronze';
      }
    }
    return 'Bronze';
  };

  const userTier = getUserTier(userPoints);

  // Filter gifts for current branch
  const branchGifts = gifts.filter(g => !g.branchId || g.branchId === branchId).slice(0, 6);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-purple-50 via-white to-pink-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-white/90 text-sm">{t.subtitle}</p>
            </div>
            <Lightbulb className="w-8 h-8" />
          </div>

          {/* User Points Badge */}
          {user && loyaltyCard && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="text-xs text-white/80">Your Points</div>
                  <div className="font-bold text-lg">{userPoints} pts</div>
                </div>
              </div>
              <Chip variant="default" size="sm" className="bg-white/20 text-white border-white/30">
                {userTier}
              </Chip>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Points System Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">{t.pointsSystem}</h2>
                  <p className="text-white/90 text-sm">{t.pointsDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t.earnRate}</h3>
                      <p className="text-sm text-gray-700">{t.earnRateDesc}</p>
                      <div className="mt-2 text-xs text-gray-600">
                        Example: Spend $50 → Earn {Math.round(50 * (1 / amountPerPoint))} points
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t.pointsNeverExpire}</h3>
                      <p className="text-sm text-gray-700">{t.pointsNeverExpireDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{t.branchSpecific}</h3>
                      <p className="text-sm text-gray-700">{t.branchSpecificDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tier System Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">{t.tierSystem}</h2>
                  <p className="text-white/90 text-sm">{t.tierSystemDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {tierRules.map((tier, index) => {
                const isCurrentTier = tier.tier === userTier;
                const tierColors = {
                  Bronze: 'from-gray-400 to-gray-600',
                  Silver: 'from-gray-300 to-gray-500',
                  Gold: 'from-yellow-400 to-yellow-600',
                  Platinum: 'from-purple-400 to-purple-600',
                };
                const bgColors = {
                  Bronze: 'from-gray-50 to-gray-100',
                  Silver: 'from-gray-50 to-slate-100',
                  Gold: 'from-yellow-50 to-orange-100',
                  Platinum: 'from-purple-50 to-pink-100',
                };

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`p-4 rounded-2xl border-2 ${
                      isCurrentTier 
                        ? 'border-[#667c67] bg-gradient-to-br from-[#667c67]/10 to-[#e4dbc4]/20' 
                        : `border-gray-200 bg-gradient-to-br ${bgColors[tier.tier as keyof typeof bgColors] || 'from-gray-50 to-gray-100'}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierColors[tier.tier as keyof typeof tierColors] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
                          {tier.tier === 'Gold' || tier.tier === 'Platinum' ? (
                            <Crown className="w-6 h-6 text-white" />
                          ) : (
                            <Award className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">{tier.tier}</div>
                          <div className="text-sm text-gray-600">{tier.value}+ points</div>
                        </div>
                      </div>
                      {isCurrentTier && (
                        <Chip variant="success" size="sm">
                          Current
                        </Chip>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      {tier.description || `Unlock exclusive ${tier.tier} tier benefits and rewards`}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Active Promotions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Percent className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">{t.promotions}</h2>
                  <p className="text-white/90 text-sm">{t.promotionsDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {promotions.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">{t.noActivePromotions}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {promotions.slice(0, 5).map((promo, index) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{promo.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                        </div>
                        <Chip variant="default" size="sm" className="bg-purple-100 text-purple-700 border-purple-300">
                          {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                        </Chip>
                      </div>
                      {promo.code && (
                        <div className="mt-2 px-3 py-2 bg-white rounded-lg border border-purple-200 font-mono text-sm font-bold text-purple-700">
                          {promo.code}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Rewards Catalog Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">{t.giftsCatalog}</h2>
                  <p className="text-white/90 text-sm">{t.giftsCatalogDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {branchGifts.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No rewards available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {branchGifts.map((gift, index) => {
                    const canRedeem = userPoints >= gift.pointCost;
                    return (
                      <motion.div
                        key={gift.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={`p-3 rounded-xl border-2 ${
                          canRedeem 
                            ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="aspect-square bg-white rounded-lg mb-2 flex items-center justify-center">
                          <Gift className={`w-8 h-8 ${canRedeem ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{gift.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className={`text-xs font-bold ${canRedeem ? 'text-green-700' : 'text-gray-500'}`}>
                            {gift.pointCost} pts
                          </div>
                          {canRedeem && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Pro Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold mb-1">{t.proTips}</h2>
                  <p className="text-white/90 text-sm">{t.proTipsDesc}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {[
                { icon: TrendingUp, text: 'Order regularly to maintain your tier status and unlock better rewards' },
                { icon: Bell, text: 'Enable notifications to get alerts about exclusive deals and bonus point events' },
                { icon: Percent, text: 'Check the promotions page before ordering to maximize your savings' },
                { icon: ShoppingBag, text: 'Combine promo codes with loyalty points for the best deals' },
                { icon: Heart, text: 'Save your favorite items to get notified when they go on sale' },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{tip.text}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-xl font-bold">{t.faq}</h2>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {[
                { q: t.questionPoints, a: t.answerPoints },
                { q: t.questionExpire, a: t.answerExpire },
                { q: t.questionRedeem, a: t.answerRedeem },
                { q: t.questionBranch, a: t.answerBranch },
                { q: t.questionTier, a: t.answerTier },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <button
                    onClick={() => setActiveSection(activeSection === `faq-${index}` ? null : `faq-${index}`)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
                      <h3 className="font-bold text-gray-900 flex-1 pr-3">{faq.q}</h3>
                      <ChevronRight 
                        className={`w-5 h-5 text-indigo-600 transition-transform ${
                          activeSection === `faq-${index}` ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  {activeSection === `faq-${index}` && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-4 bg-white rounded-xl border border-indigo-200"
                    >
                      <p className="text-sm text-gray-700">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Get Started CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard variant="elevated" className="p-6 bg-gradient-to-br from-[#667c67] to-[#546352] text-white">
            <div className="text-center mb-5">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-[#E4DBC4]" />
              <h2 className="text-2xl font-bold mb-2">{t.getStarted}</h2>
              <p className="text-white/90">{t.getStartedDesc}</p>
            </div>

            <div className="space-y-3">
              <GradientButton
                onClick={() => navigate('/branch-selection')}
                variant="secondary"
                size="lg"
                fullWidth
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                {t.browseMenu}
              </GradientButton>
              
              <GradientButton
                onClick={() => navigate(branchId ? `/loyalty-additions/branch/${branchId}` : '/loyalty')}
                variant="ghost"
                size="lg"
                fullWidth
                leftIcon={<Gift className="w-5 h-5" />}
                className="!bg-white/10 !text-white hover:!bg-white/20"
              >
                {t.viewLoyalty}
              </GradientButton>
              
              <GradientButton
                onClick={() => navigate('/promotions')}
                variant="ghost"
                size="lg"
                fullWidth
                leftIcon={<Percent className="w-5 h-5" />}
                className="!bg-white/10 !text-white hover:!bg-white/20"
              >
                {t.checkPromotions}
              </GradientButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}