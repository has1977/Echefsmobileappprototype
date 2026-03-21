import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag, Gift, Crown, Star, ChevronLeft, Copy, Check, 
  Zap, Calendar, Clock, ArrowRight, Sparkles, DollarSign, 
  Package, Percent, ChevronRight, Search, ShoppingCart, 
  CheckCircle2, Building2, Lock, Share2, TrendingUp, Award,
  X, Info, ExternalLink, Timer, CircleDot, Flame, Target
} from 'lucide-react';

// Import data
import {
  promotions,
  gifts,
  loyaltyTiers,
  type Promotion,
  type Gift as GiftType,
} from '../services/promotionsData';

import {
  branchCustomerLoyalty,
  branchPointsTransactions,
  getCustomerLoyaltyForBranch,
  getBranchTransactions,
  getCustomerBranches,
  getBranchPromotions,
  getBranchGifts,
  getAllPromotions,
  getAllGifts,
} from '../services/branchLoyaltyData';

import { db } from '../lib/database';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard, GradientButton } from '../design-system';

export function PromotionsPage() {
  try {
    const navigate = useNavigate();
    const { branchId } = useParams<{ branchId: string }>();
    const { branches } = useApp();
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<'promotions' | 'loyalty' | 'gifts'>('promotions');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
    const [showBranchSwitcher, setShowBranchSwitcher] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

    // Reset states when branchId changes
    useEffect(() => {
      setViewMode('single');
      setSearchQuery('');
      setSelectedPromotion(null);
      setSelectedGift(null);
      setShowBranchSwitcher(false);
    }, [branchId]);

    // Redirect if no branchId
    useEffect(() => {
      if (!branchId) {
        navigate('/branch-selection');
      }
    }, [branchId, navigate]);

    // Get current branch from AppContext
    const currentBranch = branches.find(b => b.id === branchId);
    
    // Early return if no branch found
    if (!branchId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4]">
          <GlassCard variant="elevated" className="p-8 text-center max-w-md">
            <Building2 className="w-16 h-16 text-[#667c67] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Branch Selected</h2>
            <p className="text-gray-600 mb-6">Please select a branch first</p>
            <GradientButton onClick={() => navigate('/branch-selection')}>Select Branch</GradientButton>
          </GlassCard>
        </div>
      );
    }
    
    if (!currentBranch) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4]">
          <GlassCard variant="elevated" className="p-8 text-center max-w-md">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Branch Not Found</h2>
            <p className="text-gray-600 mb-4">Branch ID: {branchId}</p>
            <GradientButton onClick={() => navigate('/branch-selection')}>Select Branch</GradientButton>
          </GlassCard>
        </div>
      );
    }

    // Mock customer phone
    const currentCustomerPhone = '+996555123456';

    // Get customer loyalty for this branch
    const currentCustomer = getCustomerLoyaltyForBranch(
      currentCustomerPhone,
      branchId || '',
      branchCustomerLoyalty
    );

    // Get customer branches
    const customerBranches = getCustomerBranches(currentCustomerPhone, branchCustomerLoyalty);

    // Get tier info
    const customerTier = currentCustomer 
      ? loyaltyTiers.find(t => t.id === currentCustomer.current_tier) || loyaltyTiers[0]
      : loyaltyTiers[0];

    const nextTier = currentCustomer?.next_tier 
      ? loyaltyTiers.find(t => t.id === currentCustomer.next_tier) 
      : null;

    // Get data based on viewMode
    const displayPromotions = viewMode === 'all' 
      ? getAllPromotions(promotions)
      : getBranchPromotions(branchId || '', promotions);
    
    const displayGifts = viewMode === 'all'
      ? getAllGifts(gifts)
      : getBranchGifts(branchId || '', gifts);

    // Filter by search
    const filteredPromotions = displayPromotions.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGifts = displayGifts.filter(g =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper functions
    const showToast = (message: string) => {
      setToastMessage(message);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleCopyCode = (code: string) => {
      navigator.clipboard?.writeText(code).then(() => {
        setCopiedCode(code);
        showToast('Code copied!');
        setTimeout(() => setCopiedCode(null), 2000);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedCode(code);
        showToast('Code copied!');
        setTimeout(() => setCopiedCode(null), 2000);
      });
    };

    const canAfford = (pointsRequired: number) => {
      return currentCustomer ? currentCustomer.available_points >= pointsRequired : false;
    };

    const getTypeIcon = (type: Promotion['type']) => {
      const icons = { 
        discount: Percent, 
        bogo: Gift, 
        free_item: Tag, 
        bundle: Package, 
        cashback: DollarSign, 
        points_multiplier: Zap 
      };
      return icons[type] || Tag;
    };

    const getTypeColor = (type: Promotion['type']) => {
      const colors = {
        discount: 'from-blue-500 to-blue-600',
        bogo: 'from-purple-500 to-purple-600',
        free_item: 'from-green-500 to-green-600',
        bundle: 'from-orange-500 to-orange-600',
        cashback: 'from-yellow-500 to-yellow-600',
        points_multiplier: 'from-pink-500 to-pink-600',
      };
      return colors[type] || 'from-gray-500 to-gray-600';
    };

    const getCategoryIcon = (category: GiftType['category']) => {
      const icons = { voucher: Tag, product: Package, experience: Star, discount: Percent };
      return icons[category];
    };

    const progressToNextTier = nextTier && currentCustomer?.points_to_next_tier
      ? ((nextTier.min_points - currentCustomer.points_to_next_tier) / nextTier.min_points) * 100
      : 100;

    return (
      <div className="min-h-screen bg-white pb-24">
        {/* Success Toast - Minimalist */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.9 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]"
            >
              <div className="bg-[#667c67] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header - Premium Photography-Forward Hero */}
        <div className="bg-[#667c67] pb-8 pt-5 px-5 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative z-10">
            {/* Top Bar - Minimalist */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              <button 
                onClick={() => setShowBranchSwitcher(true)} 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all group"
              >
                <Building2 className="w-4 h-4 text-white/90" />
                <span className="text-sm font-medium text-white">{currentBranch.translations.en.name}</span>
                <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Title - Clean & Bold */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-[#e4dbc4]" />
                <h1 className="text-3xl font-bold text-white tracking-tight">Rewards & Offers</h1>
              </div>
              
              <p className="text-white/80 text-base">
                {viewMode === 'all' 
                  ? 'Discover exclusive deals from all locations' 
                  : `Exclusive for ${currentBranch.translations.en.name} members`}
              </p>
              
              {viewMode === 'all' && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#e4dbc4]" />
                  <span className="text-xs font-medium text-white">All Locations</span>
                </div>
              )}
            </div>

            {/* Loyalty Card - Redesigned for elegance */}
            {currentCustomer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{customerTier.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1F2933]">{customerTier.name}</h3>
                        <p className="text-sm text-[#6B7280]">{currentBranch.translations.en.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#667c67]">{currentCustomer.available_points.toLocaleString()}</div>
                      <div className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">Points</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {nextTier && currentCustomer.points_to_next_tier && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#6B7280] font-medium">{currentCustomer.points_to_next_tier} pts to {nextTier.name}</span>
                        <span className="text-[#667c67] font-bold">{Math.round(progressToNextTier)}%</span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressToNextTier}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#667c67] to-[#546352] rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats - Clean minimal design */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F3F4F6]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1F2933] mb-1">{currentCustomer.total_orders}</div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1F2933] mb-1">{customerTier.benefits.points_multiplier}x</div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Multiplier</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1F2933] mb-1">{customerTier.benefits.discount_percentage}%</div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Discount</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/20">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Start Your Rewards Journey</h3>
                  <p className="text-white/80 text-sm mb-6">Order now and unlock exclusive benefits</p>
                  <button
                    onClick={() => navigate(`/branch/${branchId}/menu`)}
                    className="bg-white text-[#667c67] px-6 py-3 rounded-full font-semibold hover:bg-[#e4dbc4] transition-all inline-flex items-center gap-2"
                  >
                    Start Ordering
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tabs - Minimalist Design */}
            <div className="mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex">
                {[
                  { id: 'promotions', label: 'Promotions', icon: Tag, count: displayPromotions.length },
                  { id: 'loyalty', label: 'Loyalty', icon: Crown },
                  { id: 'gifts', label: 'Gifts', icon: Gift, count: displayGifts.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                        isActive 
                          ? 'bg-white text-[#667c67] shadow-lg' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-[#667c67] text-white' : 'bg-white/20 text-white'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Clean, Spacious Layout */}
        <div className="px-5 py-8 space-y-8">
          {/* Promotions Tab */}
          {activeTab === 'promotions' && (
            <>
              {/* Search - Minimalist */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input 
                  placeholder="Search promotions..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-12 h-12 bg-[#F9FAFB] border-0 rounded-2xl text-base focus:ring-2 focus:ring-[#667c67]/20 focus:bg-white transition-all" 
                />
              </div>

              {filteredPromotions.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-10 h-10 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2933] mb-2">No promotions available</h3>
                  <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">
                    {searchQuery ? 'Try a different search term' : `Check back soon for new offers at ${currentBranch.translations.en.name}`}
                  </p>
                  <button
                    onClick={() => navigate(`/branch/${branchId}/menu`)}
                    className="bg-[#667c67] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#546352] transition-all"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPromotions.map((promo, index) => {
                    const TypeIcon = getTypeIcon(promo.type);
                    const daysLeft = Math.ceil((promo.end_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysLeft <= 3;

                    return (
                      <motion.div 
                        key={promo.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: index * 0.06 }}
                      >
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                          {/* Promotion Image - Large & Bold like Uber Eats */}
                          {promo.image && (
                            <div className="relative h-56 overflow-hidden group">
                              <img 
                                src={promo.image} 
                                alt={promo.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              
                              {/* Floating badges */}
                              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                                {promo.discount_value && (
                                  <div className="bg-[#667c67] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                    {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `${promo.discount_value} KGS`}
                                  </div>
                                )}
                                {daysLeft > 0 && (
                                  <div className={`${isUrgent ? 'bg-red-500' : 'bg-black/40'} backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    {daysLeft}d left
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Content - Clean & Spacious */}
                          <div className="p-6">

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#667c67]/10 flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="w-6 h-6 text-[#667c67]" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1F2933] mb-1">{promo.name}</h3>
                                <p className="text-sm text-[#6B7280] capitalize">{promo.type.replace('_', ' ')}</p>
                              </div>
                            </div>

                            <p className="text-[#6B7280] leading-relaxed mb-6">{promo.description}</p>

                            {/* Details - Minimal */}
                            <div className="space-y-2 mb-6">
                              {promo.min_order_value && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-[#9CA3AF]">Minimum order</span>
                                  <span className="font-semibold text-[#1F2933]">{promo.min_order_value} KGS</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#9CA3AF]">Valid until</span>
                                <span className="font-semibold text-[#1F2933]">
                                  {promo.end_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            {/* Promo Code - Refined */}
                            {promo.requires_code && promo.code && (
                              <div className="mb-6 bg-[#F9FAFB] rounded-2xl p-4 border-2 border-dashed border-[#E5E7EB]">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-[#9CA3AF] uppercase font-semibold mb-1">Code</div>
                                    <div className="text-2xl font-black font-mono text-[#667c67] tracking-wide">{promo.code}</div>
                                  </div>
                                  <button
                                    onClick={() => handleCopyCode(promo.code!)}
                                    className="px-4 py-2.5 rounded-xl bg-[#667c67] hover:bg-[#546352] text-white font-semibold transition-all flex items-center gap-2"
                                  >
                                    {copiedCode === promo.code ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        <span className="text-sm">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        <span className="text-sm">Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Action Button - Prominent */}
                            <button
                              onClick={() => setSelectedPromotion(promo)}
                              className="w-full bg-[#667c67] hover:bg-[#546352] text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 group"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              <span>Apply Offer</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Gifts Tab */}
          {activeTab === 'gifts' && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input 
                  placeholder="Search gifts..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-12 h-12 bg-[#F9FAFB] border-0 rounded-2xl text-base focus:ring-2 focus:ring-[#667c67]/20 focus:bg-white transition-all" 
                />
              </div>

              {!currentCustomer ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#667c67]/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-[#667c67]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2933] mb-2">Create Loyalty Account</h3>
                  <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">You need a loyalty account at {currentBranch.translations.en.name} to redeem gifts</p>
                  <button
                    onClick={() => navigate(`/branch/${branchId}/menu`)}
                    className="bg-[#667c67] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#546352] transition-all"
                  >
                    Place Your First Order
                  </button>
                </div>
              ) : filteredGifts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2933] mb-2">No gifts available</h3>
                  <p className="text-[#6B7280] max-w-sm mx-auto">{searchQuery ? 'Try a different search term' : 'Check back later for new rewards!'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredGifts.map((gift, index) => {
                    const CategoryIcon = getCategoryIcon(gift.category);
                    const affordable = canAfford(gift.points_required);

                    return (
                      <motion.div 
                        key={gift.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: index * 0.06 }}
                      >
                        <div 
                          className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${!affordable && 'opacity-50'}`}
                        >
                          {/* Gift Image - Photography-forward */}
                          {gift.image && (
                            <div className="relative h-56 overflow-hidden group">
                              <img 
                                src={gift.image} 
                                alt={gift.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              
                              {/* Badges */}
                              <div className="absolute top-4 right-4 flex flex-col gap-2">
                                {gift.stock < 50 && gift.stock > 0 && (
                                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                                    <Flame className="w-3.5 h-3.5" />
                                    Low Stock
                                  </div>
                                )}
                                {!affordable && (
                                  <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                                    <Lock className="w-3.5 h-3.5 inline mr-1" />
                                    Locked
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#667c67]/10 flex items-center justify-center flex-shrink-0">
                                <CategoryIcon className="w-6 h-6 text-[#667c67]" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1F2933] mb-1">{gift.name}</h3>
                                <p className="text-sm text-[#6B7280] capitalize">{gift.category}</p>
                              </div>
                            </div>
                            
                            <p className="text-[#6B7280] leading-relaxed mb-6">{gift.description}</p>
                            
                            {/* Points & Action */}
                            <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                              <div className="flex items-baseline gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-2xl font-bold text-[#667c67]">{gift.points_required}</span>
                                <span className="text-sm text-[#9CA3AF]">points</span>
                              </div>
                              
                              <button
                                disabled={!affordable}
                                onClick={() => setSelectedGift(gift)}
                                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                                  affordable 
                                    ? 'bg-[#667c67] hover:bg-[#546352] text-white' 
                                    : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                                }`}
                              >
                                {affordable ? 'Redeem' : 'Locked'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Loyalty Tab */}
          {activeTab === 'loyalty' && (
            <>
              {!currentCustomer ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#667c67]/10 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-10 h-10 text-[#667c67]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2933] mb-2">Join Loyalty Program</h3>
                  <p className="text-[#6B7280] mb-6 max-w-sm mx-auto">Start earning points and exclusive benefits at {currentBranch.translations.en.name}</p>
                  <button
                    onClick={() => navigate(`/branch/${branchId}/menu`)}
                    className="bg-[#667c67] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#546352] transition-all"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#667c67] flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1F2933]">Your Tier Progress</h2>
                  </div>

                  {loyaltyTiers.map((tier, index) => {
                    const isCurrentTier = tier.id === currentCustomer.current_tier;
                    const isUnlocked = currentCustomer.total_points >= tier.min_points;

                    return (
                      <motion.div 
                        key={tier.id} 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: index * 0.1 }}
                      >
                        <div 
                          className={`bg-white rounded-3xl p-6 transition-all ${
                            isCurrentTier 
                              ? 'ring-4 ring-[#667c67]/20 shadow-2xl' 
                              : isUnlocked 
                                ? 'shadow-lg' 
                                : 'opacity-50 shadow-md'
                          }`}
                        >
                          <div className="flex items-start gap-5">
                            {/* Tier Icon */}
                            <div className={`text-5xl ${!isUnlocked && 'grayscale opacity-40'}`}>
                              {tier.icon}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold text-[#1F2933]">{tier.name}</h3>
                                  {isCurrentTier && (
                                    <span className="bg-[#667c67] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#9CA3AF]">
                                  {tier.min_points.toLocaleString()}+ points
                                </p>
                              </div>
                              
                              {/* Benefits - Grid */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Zap className="w-4 h-4 text-[#667c67]" />
                                  <span className="font-medium text-[#374151]">{tier.benefits.points_multiplier}x Points</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Percent className="w-4 h-4 text-[#667c67]" />
                                  <span className="font-medium text-[#374151]">{tier.benefits.discount_percentage}% Off</span>
                                </div>
                                
                                {tier.benefits.free_delivery && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4 text-[#667c67]" />
                                    <span className="font-medium text-[#374151]">Free Delivery</span>
                                  </div>
                                )}
                                
                                {tier.benefits.priority_support && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Award className="w-4 h-4 text-[#667c67]" />
                                    <span className="font-medium text-[#374151]">Priority Support</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Branch Switcher Modal */}
        <Dialog open={showBranchSwitcher} onOpenChange={setShowBranchSwitcher}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#667c67]" />
                Switch Branch
              </DialogTitle>
              <DialogDescription>Select a branch to view its promotions and loyalty status</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-4">
              {/* All Branches Option */}
              <button
                className="w-full p-4 rounded-xl bg-gradient-to-r from-[#667c67]/10 to-[#e4dbc4]/20 border-2 border-[#667c67]/30 hover:border-[#667c67]/50 transition-all text-left"
                onClick={() => {
                  setViewMode('all');
                  setShowBranchSwitcher(false);
                  showToast('Viewing all branches');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#667c67] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[#667c67]">View All Branches</div>
                      <div className="text-xs text-[#6B7280]">See all available offers</div>
                    </div>
                  </div>
                  <Badge className="bg-[#667c67] text-white">
                    {getAllPromotions(promotions).length} offers
                  </Badge>
                </div>
              </button>

              <div className="border-t pt-3">
                <p className="text-xs text-[#9CA3AF] mb-3 px-1 font-semibold uppercase tracking-wide">Individual Branches:</p>
              </div>

              {branches.map((branch) => {
                const hasAccount = customerBranches.some(b => b.branch_id === branch.id);
                const isSelected = branch.id === branchId && viewMode === 'single';
                
                return (
                  <button
                    key={branch.id}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'bg-[#667c67] border-[#667c67] text-white' 
                        : 'bg-white border-[#E5E7EB] hover:border-[#667c67]/30'
                    }`}
                    onClick={() => {
                      setViewMode('single');
                      setShowBranchSwitcher(false);
                      navigate(`/branch/${branch.id}/promotions`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-white/20' : 'bg-[#F9FAFB]'
                        }`}>
                          <Building2 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#667c67]'}`} />
                        </div>
                        <div className="font-semibold">{branch.translations.en.name}</div>
                      </div>
                      {hasAccount && (
                        <Badge className={isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}>
                          Member
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Promotion Modal */}
        <Dialog open={!!selectedPromotion} onOpenChange={() => setSelectedPromotion(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedPromotion?.name}</DialogTitle>
              <DialogDescription className="text-base">{selectedPromotion?.description}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <p className="text-sm text-[#6B7280] font-medium">Ready to apply this promotion to your order?</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12" 
                  onClick={() => setSelectedPromotion(null)}
                >
                  Cancel
                </Button>
                <GradientButton
                  className="flex-1"
                  size="lg"
                  onClick={() => {
                    showToast(`Promotion applied!`);
                    setSelectedPromotion(null);
                    setTimeout(() => navigate(`/branch/${branchId}/menu`), 1000);
                  }}
                >
                  Apply & Go to Menu
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Gift Modal */}
        <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Redeem {selectedGift?.name}</DialogTitle>
              <DialogDescription className="text-base">
                You're about to spend {selectedGift?.points_required} points
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {selectedGift && currentCustomer && (
                <div className="p-4 bg-[#F9FAFB] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280] font-medium">Current Points:</span>
                    <span className="text-lg font-bold text-[#1F2933]">{currentCustomer.available_points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280] font-medium">After Redemption:</span>
                    <span className="text-lg font-bold text-[#667c67]">
                      {currentCustomer.available_points - selectedGift.points_required}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12" 
                  onClick={() => setSelectedGift(null)}
                >
                  Cancel
                </Button>
                <GradientButton
                  className="flex-1"
                  size="lg"
                  onClick={() => {
                    showToast(`Gift redeemed successfully!`);
                    setSelectedGift(null);
                  }}
                >
                  Confirm Redemption
                </GradientButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  } catch (error) {
    console.error('PromotionsPage error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] p-5">
        <GlassCard variant="elevated" className="p-8 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2933] mb-2">Something went wrong</h2>
          <p className="text-[#6B7280] mb-6">Please try again later</p>
          <GradientButton onClick={() => window.location.reload()}>
            Reload Page
          </GradientButton>
        </GlassCard>
      </div>
    );
  }
}