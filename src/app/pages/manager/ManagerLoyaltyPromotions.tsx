import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Plus, Tag, Crown, Gift, TrendingUp, Users, 
  Edit2, Eye, Trash2, BarChart3, Settings, Sparkles, 
  Calendar, Clock, Percent, DollarSign, Target, Zap,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import type { Promotion, GiftOffer, LoyaltyProgram } from '../../lib/types';

export function ManagerLoyaltyPromotions() {
  const navigate = useNavigate();
  const { currentLanguage } = useApp();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'promotions' | 'loyalty' | 'gifts' | 'analytics'>('promotions');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isRTL = currentLanguage === 'ar';

  // Mock data - would come from API
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'promo1',
      branchId: user?.branchId || '',
      name: 'Happy Hour Special',
      translations: {
        en: {
          name: 'Happy Hour Special',
          description: '50% off on all drinks between 3-6 PM',
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
      usageLimit: { total: 1000, perUser: 5 },
      usageCount: 247,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: true,
      badge: '50% OFF',
    },
    {
      id: 'promo2',
      branchId: user?.branchId || '',
      name: 'Weekend Brunch',
      translations: {
        en: {
          name: 'Weekend Brunch Special',
          description: 'Buy 2 brunch items, get 1 free dessert',
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
      usageLimit: { total: 500 },
      usageCount: 89,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      badge: 'BOGO',
    },
    {
      id: 'promo3',
      branchId: user?.branchId || '',
      name: 'Family Bundle',
      translations: {
        en: {
          name: 'Family Feast Bundle',
          description: 'Save $20 on our family meal combo',
        },
      },
      type: 'bundle',
      scope: { type: 'global' },
      discount: { type: 'amount', value: 20 },
      minOrderValue: 60,
      stackingRule: 'allow',
      usageLimit: { total: 200 },
      usageCount: 156,
      status: 'draft',
      validFrom: new Date('2024-06-01'),
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      badge: '$20 OFF',
    },
  ]);

  const loyaltyPrograms: LoyaltyProgram[] = [
    {
      id: 'loyalty1',
      branchId: user?.branchId || '',
      name: 'eChefs Rewards',
      translations: {
        en: {
          name: 'eChefs Rewards Program',
          description: 'Earn points on every purchase and unlock exclusive rewards',
        },
      },
      status: 'active',
      accrualRule: {
        unit: 'currency',
        rate: 10, // 10 points per $1
      },
      redemptionRules: [],
      tiers: [
        {
          name: 'Bronze',
          translations: { en: 'Bronze', ar: 'برونز' },
          pointsRequired: 0,
          benefits: ['Earn 1x points', 'Birthday reward'],
        },
        {
          name: 'Silver',
          translations: { en: 'Silver', ar: 'فضي' },
          pointsRequired: 500,
          benefits: ['Earn 1.25x points', 'Priority support', 'Birthday reward'],
        },
        {
          name: 'Gold',
          translations: { en: 'Gold', ar: 'ذهبي' },
          pointsRequired: 1500,
          benefits: ['Earn 1.5x points', 'Exclusive menu access', 'Priority reservations'],
        },
        {
          name: 'Platinum',
          translations: { en: 'Platinum', ar: 'بلاتيني' },
          pointsRequired: 5000,
          benefits: ['Earn 2x points', 'VIP treatment', 'Free delivery', 'Complimentary items'],
        },
      ],
      createdBy: user?.id || '',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  ];

  const gifts: GiftOffer[] = [
    {
      id: 'gift1',
      branchId: user?.branchId || '',
      name: 'Welcome Gift',
      translations: {
        en: {
          name: 'Welcome Gift',
          description: 'Free appetizer on your first order',
        },
      },
      trigger: {
        condition: 'first_order',
      },
      rewardType: 'free_item',
      rewardDetails: { category: 'appetizers' },
      usageCount: 142,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: user?.id || '',
      createdAt: new Date(),
    },
    {
      id: 'gift2',
      branchId: user?.branchId || '',
      name: 'Birthday Special',
      translations: {
        en: {
          name: 'Birthday Special',
          description: 'Free dessert on your birthday month',
        },
      },
      trigger: {
        condition: 'loyalty_tier',
        value: 'Bronze',
      },
      rewardType: 'free_item',
      rewardDetails: { category: 'desserts' },
      limitPerUser: 1,
      usageCount: 58,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      createdBy: user?.id || '',
      createdAt: new Date(),
    },
  ];

  const analytics = {
    totalRedemptions: 536,
    revenueImpact: 12450,
    avgOrderValueLift: 18.5,
    activeMembers: 3247,
    newMembersThisMonth: 234,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-white';
      case 'draft': return 'bg-gray-400 text-white';
      case 'paused': return 'bg-warning text-white';
      case 'expired': return 'bg-destructive text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev => prev.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'paused' : 'active' as any }
        : p
    ));
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
            onClick={() => navigate('/manager')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">Loyalty & Promotions</h1>
            <p className="text-sm text-white/80">Manage offers for your branch</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-[#667c67] to-[#526250] text-white">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{analytics.totalRedemptions}</p>
          <p className="text-sm text-white/80">Total Redemptions</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#e4dbc4] to-[#d4c9a8]">
          <DollarSign className="w-8 h-8 mb-2 text-[#667c67]" />
          <p className="text-2xl font-bold text-[#667c67]">${analytics.revenueImpact}</p>
          <p className="text-sm text-[#526250]">Revenue Impact</p>
        </Card>

        <Card className="p-4 border-2 border-[#667c67]/20">
          <Target className="w-8 h-8 mb-2 text-[#667c67]" />
          <p className="text-2xl font-bold">+{analytics.avgOrderValueLift}%</p>
          <p className="text-sm text-muted-foreground">AOV Lift</p>
        </Card>

        <Card className="p-4 border-2 border-[#667c67]/20">
          <Users className="w-8 h-8 mb-2 text-[#667c67]" />
          <p className="text-2xl font-bold">{analytics.activeMembers}</p>
          <p className="text-sm text-muted-foreground">Active Members</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="sticky top-[72px] z-10 bg-background border-y shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full justify-start overflow-x-auto rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="promotions"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Tag className="w-4 h-4" />
              Promotions
              <Badge variant="secondary">{promotions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="loyalty"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Crown className="w-4 h-4" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger 
              value="gifts"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <Gift className="w-4 h-4" />
              Gifts
              <Badge variant="secondary">{gifts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="flex-1 gap-2 data-[state=active]:bg-[#667c67] data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-[#667c67]"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 space-y-4">
        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">All Promotions</h2>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#667c67] hover:bg-[#526250]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>

            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-[#667c67]/20 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">
                            {promo.translations[currentLanguage]?.name || promo.name}
                          </h3>
                          <Badge className={getStatusColor(promo.status)}>
                            {promo.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {promo.translations[currentLanguage]?.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{promo.usageCount} / {promo.usageLimit?.total || '∞'} used</span>
                          </div>
                          {promo.schedule && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{promo.schedule.startTime}-{promo.schedule.endTime}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge className="bg-[#667c67] text-white flex-shrink-0">
                        {promo.badge}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => console.log('Edit', promo.id)}
                      >
                        <Edit2 className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePromotionStatus(promo.id)}
                        className={promo.status === 'active' ? 'border-warning text-warning' : 'border-success text-success'}
                      >
                        {promo.status === 'active' ? (
                          <>
                            <ToggleRight className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/branch/${user?.branchId}/promotions`)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {loyaltyPrograms.map((program) => (
              <Card key={program.id} className="p-6 border-2 border-[#667c67]/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {program.translations[currentLanguage]?.name || program.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {program.translations[currentLanguage]?.description}
                    </p>
                  </div>
                  <Badge className="bg-success text-white">
                    {program.status}
                  </Badge>
                </div>

                {/* Accrual Rule */}
                <div className="p-4 bg-[#e4dbc4]/30 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-[#667c67] font-semibold mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Earning Rule</span>
                  </div>
                  <p className="text-sm">
                    Earn {program.accrualRule.rate} points per ${1} spent
                  </p>
                </div>

                {/* Tiers */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-3">Membership Tiers</h4>
                  <div className="space-y-2">
                    {program.tiers.map((tier, index) => (
                      <div 
                        key={index}
                        className="p-3 border-2 border-[#667c67]/10 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-[#667c67]" />
                            <span className="font-semibold">{tier.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {tier.pointsRequired}+ pts
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tier.benefits.join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                    onClick={() => console.log('Edit program')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Gift Offers</h2>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#667c67] hover:bg-[#526250]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Gift
              </Button>
            </div>

            {gifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 border-2 border-transparent hover:border-[#667c67]/20 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1">
                        {gift.translations[currentLanguage]?.name || gift.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {gift.translations[currentLanguage]?.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {gift.usageCount} redemptions
                        </div>
                        <Badge className={getStatusColor(gift.status)}>
                          {gift.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit2 className="w-3 h-3 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="font-semibold text-lg">Performance Metrics</h2>

            <Card className="p-6 bg-gradient-to-br from-[#667c67] to-[#526250] text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">This Month</p>
                  <p className="text-2xl font-bold">+{analytics.newMembersThisMonth}</p>
                  <p className="text-sm">New Loyalty Members</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Top Performing Promotions</h3>
              <div className="space-y-2">
                {promotions
                  .filter(p => p.status === 'active')
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .map((promo, i) => (
                    <div key={promo.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#667c67] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{promo.name}</p>
                          <p className="text-xs text-muted-foreground">{promo.usageCount} redemptions</p>
                        </div>
                      </div>
                      <Badge className="bg-[#e4dbc4] text-[#667c67]">{promo.badge}</Badge>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Campaign Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-2 border-[#667c67]/10 rounded-lg">
                  <span className="text-sm">Average Order Value Lift</span>
                  <span className="font-bold text-success">+{analytics.avgOrderValueLift}%</span>
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-[#667c67]/10 rounded-lg">
                  <span className="text-sm">Total Revenue Impact</span>
                  <span className="font-bold text-[#667c67]">${analytics.revenueImpact.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-[#667c67]/10 rounded-lg">
                  <span className="text-sm">Active Loyalty Members</span>
                  <span className="font-bold">{analytics.activeMembers.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}