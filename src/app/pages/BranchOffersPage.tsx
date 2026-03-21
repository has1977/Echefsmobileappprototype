import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Gift, Tag, Crown, Star, Sparkles, TrendingUp, 
  Clock, Check, ArrowRight, Percent, ShoppingBag, Award,
  Calendar, Zap, Heart, Users, Info
} from 'lucide-react';
import type { Promotion, GiftOffer, UserLoyalty } from '../lib/types';

export function BranchOffersPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { selectedBranch, currentLanguage } = useApp();
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'loyalty' | 'promotions' | 'gifts'>('promotions');
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);

  const isRTL = currentLanguage === 'ar';

  // Mock data - would come from API in production
  const [userLoyalty, setUserLoyalty] = useState<UserLoyalty | null>(
    isAuthenticated ? {
      userId: user!.id,
      branchId: branchId || '',
      pointsBalance: 850,
      tier: 'Gold',
      tierProgress: 65,
      lifetimePoints: 3250,
      history: [],
      enrolledAt: new Date('2024-01-15'),
      lastActivity: new Date(),
    } : null
  );

  const promotions: Promotion[] = [
    {
      id: 'promo1',
      branchId: branchId || '',
      name: 'Happy Hour Special',
      translations: {
        en: {
          name: 'Happy Hour Special',
          description: '50% off on all drinks between 3-6 PM',
          terms: 'Valid on weekdays only. Cannot be combined with other offers.',
        },
        ar: {
          name: 'عرض الساعة السعيدة',
          description: 'خصم 50% على جميع المشروبات من 3-6 مساءً',
          terms: 'صالح أيام الأسبوع فقط. لا يمكن دمجه مع عروض أخرى.',
        },
      },
      type: 'happy_hour',
      scope: { type: 'category', categoryIds: ['drinks'] },
      discount: { type: 'percent', value: 50 },
      schedule: {
        days: [1, 2, 3, 4, 5],
        startTime: '15:00',
        endTime: '18:00',
      },
      stackingRule: 'exclusive',
      usageCount: 0,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: 'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: true,
      badge: '50% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    },
    {
      id: 'promo2',
      branchId: branchId || '',
      name: 'Family Feast',
      translations: {
        en: {
          name: 'Family Feast Bundle',
          description: 'Save $20 on our family meal combo for 4 people',
        },
        ar: {
          name: 'وجبة العائلة',
          description: 'وفر 20 دولار على وجبة العائلة لـ 4 أشخاص',
        },
      },
      type: 'bundle',
      scope: { type: 'global' },
      discount: { type: 'amount', value: 20 },
      minOrderValue: 60,
      stackingRule: 'allow',
      usageCount: 0,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      createdBy: 'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
      badge: '$20 OFF',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    },
    {
      id: 'promo3',
      branchId: branchId || '',
      name: 'Weekend Brunch',
      translations: {
        en: {
          name: 'Weekend Brunch Special',
          description: 'Buy 2 brunch items, get 1 free dessert',
        },
        ar: {
          name: 'عرض وجبة الإفطار المتأخر',
          description: 'اشتري 2 من وجبات الإفطار المتأخر واحصل على حلوى مجانية',
        },
      },
      type: 'bogo',
      scope: { type: 'category', categoryIds: ['breakfast'] },
      schedule: {
        days: [0, 6],
        startTime: '09:00',
        endTime: '14:00',
      },
      stackingRule: 'allow',
      usageCount: 0,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: 'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: true,
      badge: 'FREE ITEM',
      imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
    },
  ];

  const gifts: GiftOffer[] = [
    {
      id: 'gift1',
      branchId: branchId || '',
      name: 'First Order Gift',
      translations: {
        en: {
          name: 'Welcome Gift',
          description: 'Free appetizer on your first order',
        },
        ar: {
          name: 'هدية الترحيب',
          description: 'مقبلات مجانية على طلبك الأول',
        },
      },
      trigger: {
        condition: 'first_order',
      },
      rewardType: 'free_item',
      rewardDetails: { category: 'appetizers' },
      usageCount: 0,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: 'manager',
      createdAt: new Date(),
      imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800',
    },
    {
      id: 'gift2',
      branchId: branchId || '',
      name: 'Loyalty Milestone',
      translations: {
        en: {
          name: 'Gold Tier Exclusive',
          description: 'Free signature dish for Gold members',
        },
        ar: {
          name: 'حصري للمستوى الذهبي',
          description: 'طبق مميز مجاني لأعضاء المستوى الذهبي',
        },
      },
      trigger: {
        condition: 'loyalty_tier',
        value: 'Gold',
      },
      rewardType: 'free_item',
      rewardDetails: { specific: 'signature_dish' },
      limitPerUser: 1,
      usageCount: 0,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      createdBy: 'manager',
      createdAt: new Date(),
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    },
  ];

  const translations = {
    en: {
      title: 'Offers & Rewards',
      subtitle: 'Save more with our exclusive deals',
      loyalty: 'Loyalty',
      promotions: 'Promotions',
      gifts: 'Gifts',
      yourPoints: 'Your Points',
      currentTier: 'Current Tier',
      nextTier: 'Next Tier',
      pointsToNext: 'points to next tier',
      earnRule: 'Earn 10 points per $1 spent',
      redeemRewards: 'Redeem Rewards',
      viewHistory: 'View History',
      activeNow: 'Active Now',
      comingSoon: 'Coming Soon',
      expired: 'Expired',
      apply: 'Apply',
      redeem: 'Redeem',
      details: 'Details',
      validUntil: 'Valid until',
      timeRemaining: 'Time remaining',
      minOrder: 'Min. order',
      enrolled: 'Enrolled',
      signUpToEarn: 'Sign up to start earning',
      signUp: 'Sign Up',
      terms: 'Terms & Conditions',
    },
    ar: {
      title: 'العروض والمكافآت',
      subtitle: 'وفر أكثر مع عروضنا الحصرية',
      loyalty: 'الولاء',
      promotions: 'العروض',
      gifts: 'الهدايا',
      yourPoints: 'نقاطك',
      currentTier: 'المستوى الحالي',
      nextTier: 'المستوى التالي',
      pointsToNext: 'نقطة للمستوى التالي',
      earnRule: 'اكسب 10 نقاط لكل دولار تنفقه',
      redeemRewards: 'استبدل المكافآت',
      viewHistory: 'عرض السجل',
      activeNow: 'نشط الآن',
      comingSoon: 'قريباً',
      expired: 'منتهي',
      apply: 'تطبيق',
      redeem: 'استبدال',
      details: 'التفاصيل',
      validUntil: 'صالح حتى',
      timeRemaining: 'الوقت المتبقي',
      minOrder: 'الحد الأدنى للطلب',
      enrolled: 'مسجل',
      signUpToEarn: 'سجل لتبدأ بكسب النقاط',
      signUp: 'تسجيل',
      terms: 'الشروط والأحكام',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  if (!selectedBranch || selectedBranch.id !== branchId) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'from-amber-700 to-amber-900';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const isPromotionActive = (promo: Promotion) => {
    if (!promo.schedule) return true;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return promo.schedule.days.includes(currentDay) && 
           currentTime >= promo.schedule.startTime && 
           currentTime <= promo.schedule.endTime;
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-lg">
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-sm text-white/80">{selectedBranch.translations[currentLanguage]?.name}</p>
          </div>

          <Sparkles className="w-6 h-6 text-yellow-300" />
        </div>

        {/* Branch Info Banner */}
        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Open until 10:00 PM</span>
            </div>
            {isAuthenticated && userLoyalty && (
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">{userLoyalty.tier}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[136px] z-10 bg-background border-b shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full justify-start overflow-x-auto rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="promotions"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Tag className="w-4 h-4" />
              {t.promotions}
              <Badge variant="secondary" className="ml-1">{promotions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="loyalty"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Crown className="w-4 h-4" />
              {t.loyalty}
            </TabsTrigger>
            <TabsTrigger 
              value="gifts"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Gift className="w-4 h-4" />
              {t.gifts}
              <Badge variant="secondary" className="ml-1">{gifts.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 space-y-4">
        {/* Promotions Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'promotions' && (
            <motion.div
              key="promotions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Featured Promotions */}
              <div className="space-y-3">
                {promotions.filter(p => p.featured).map((promo, index) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-2 border-[#667c67]/20 hover:border-[#667c67]/40 transition-all">
                      <div className="relative h-40">
                        <img
                          src={promo.imageUrl}
                          alt={promo.translations[currentLanguage]?.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#667c67] text-white border-none shadow-lg text-base px-3 py-1">
                            {promo.badge}
                          </Badge>
                        </div>

                        {/* Active Status */}
                        {isPromotionActive(promo) && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-success text-white border-none shadow-lg gap-1">
                              <Zap className="w-3 h-3 fill-current" />
                              {t.activeNow}
                            </Badge>
                          </div>
                        )}

                        {/* Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg mb-1">
                            {promo.translations[currentLanguage]?.name}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {promo.translations[currentLanguage]?.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Schedule Info */}
                        {promo.schedule && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{promo.schedule.startTime} - {promo.schedule.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Weekdays</span>
                            </div>
                          </div>
                        )}

                        {/* Min Order */}
                        {promo.minOrderValue && (
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingBag className="w-4 h-4 text-[#667c67]" />
                            <span className="text-muted-foreground">
                              {t.minOrder}: <span className="font-semibold text-foreground">${promo.minOrderValue}</span>
                            </span>
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          onClick={() => navigate(`/branch/${branchId}/menu`)}
                          className="w-full bg-[#667c67] hover:bg-[#526250]"
                        >
                          {t.apply}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* All Promotions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">All Promotions</h3>
                {promotions.filter(p => !p.featured).map((promo, index) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#667c67]/20">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center">
                          <Percent className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-base">
                              {promo.translations[currentLanguage]?.name}
                            </h3>
                            <Badge className="bg-[#e4dbc4] text-[#667c67] border-none flex-shrink-0">
                              {promo.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {promo.translations[currentLanguage]?.description}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/branch/${branchId}/menu`)}
                            className="border-[#667c67] text-[#667c67] hover:bg-[#667c67] hover:text-white"
                          >
                            {t.details}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loyalty Tab */}
          {activeTab === 'loyalty' && (
            <motion.div
              key="loyalty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {isAuthenticated && userLoyalty ? (
                <>
                  {/* Points Card */}
                  <Card className="overflow-hidden border-2 border-[#667c67]/20">
                    <div className={`bg-gradient-to-r ${getTierColor(userLoyalty.tier)} text-white p-6 relative overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white/80 text-sm mb-1">{t.yourPoints}</p>
                            <h2 className="text-4xl font-bold">{userLoyalty.pointsBalance}</h2>
                          </div>
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <Crown className="w-8 h-8" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{t.currentTier}: {userLoyalty.tier}</span>
                            <span>{userLoyalty.tierProgress}% to {t.nextTier}</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${userLoyalty.tierProgress}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-white rounded-full"
                            />
                          </div>
                          <p className="text-xs text-white/70">
                            {Math.round((100 - userLoyalty.tierProgress) * 10)} {t.pointsToNext}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 text-[#667c67]" />
                        <span>{t.earnRule}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="bg-[#667c67] hover:bg-[#526250]"
                          onClick={() => navigate(`/branch/${branchId}/loyalty/redeem`)}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          {t.redeemRewards}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#667c67] text-[#667c67]"
                          onClick={() => navigate('/profile?tab=loyalty')}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          {t.viewHistory}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Benefits */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#667c67]" />
                      Your {userLoyalty.tier} Benefits
                    </h3>
                    <div className="space-y-2">
                      {[
                        'Earn 1.5x points on all orders',
                        'Exclusive access to premium menu items',
                        'Priority reservations',
                        'Birthday special reward',
                        'Free delivery on orders over $30',
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Member Since */}
                  <Card className="p-4 bg-gradient-to-br from-[#f0eadc] to-white border-[#667c67]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#667c67] rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.enrolled}</p>
                        <p className="font-semibold">
                          {new Date(userLoyalty.enrolledAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Lifetime points: {userLoyalty.lifetimePoints}
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                /* Sign Up Card */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Join Our Loyalty Program</h3>
                    <p className="text-muted-foreground mb-6">
                      {t.signUpToEarn}
                    </p>
                    <Button
                      size="lg"
                      onClick={() => navigate('/sign-up')}
                      className="bg-[#667c67] hover:bg-[#526250]"
                    >
                      {t.signUp}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Gifts Tab */}
          {activeTab === 'gifts' && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {gifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-2 border-[#667c67]/20 hover:border-[#667c67]/40 transition-all">
                    <div className="relative h-32">
                      <img
                        src={gift.imageUrl}
                        alt={gift.translations[currentLanguage]?.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <div className="w-10 h-10 bg-[#667c67] rounded-full flex items-center justify-center">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg">
                          {gift.translations[currentLanguage]?.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {gift.translations[currentLanguage]?.description}
                      </p>

                      {/* Trigger Info */}
                      <div className="flex items-center gap-2 p-3 bg-[#e4dbc4]/30 rounded-lg">
                        <Info className="w-4 h-4 text-[#667c67]" />
                        <span className="text-sm font-medium">
                          {gift.trigger.condition === 'first_order' && 'Available on first order'}
                          {gift.trigger.condition === 'loyalty_tier' && `Exclusive for ${gift.trigger.value} members`}
                          {gift.trigger.condition === 'min_order_value' && `Spend $${gift.trigger.value}+ to unlock`}
                        </span>
                      </div>

                      <Button
                        onClick={() => navigate(`/branch/${branchId}/menu`)}
                        className="w-full bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {t.redeem}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {gifts.length === 0 && (
                <Card className="p-12 text-center">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No gifts available at the moment</p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
