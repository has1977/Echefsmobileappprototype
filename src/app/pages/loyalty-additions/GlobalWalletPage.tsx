import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, ChevronDown, ChevronUp, MapPin, Award, Star } from 'lucide-react';
import { GlassCard, GradientButton, motion, AnimatePresence } from '../../design-system';
import { Logo } from '../../components/shared/Logo';

interface BranchWallet {
  id: string;
  name: string;
  balance: number;
  distance: string;
  isFavorite: boolean;
  isExpanded: boolean;
  recentActivity: string;
}

export function GlobalWalletPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'nearby' | 'favorites'>('all');
  const [branches, setBranches] = useState<BranchWallet[]>([
    {
      id: '1',
      name: 'eChefs Downtown',
      balance: 450,
      distance: '0.5 km',
      isFavorite: true,
      isExpanded: false,
      recentActivity: 'Earned 50 pts • 2 hours ago',
    },
    {
      id: '2',
      name: 'eChefs Plaza',
      balance: 280,
      distance: '1.2 km',
      isFavorite: true,
      isExpanded: false,
      recentActivity: 'Redeemed 100 pts • Yesterday',
    },
    {
      id: '3',
      name: 'eChefs Mall',
      balance: 120,
      distance: '2.8 km',
      isFavorite: false,
      isExpanded: false,
      recentActivity: 'Earned 30 pts • 3 days ago',
    },
    {
      id: '4',
      name: 'eChefs Airport',
      balance: 0,
      distance: '15.5 km',
      isFavorite: false,
      isExpanded: false,
      recentActivity: 'No activity yet',
    },
  ]);

  const toggleExpand = (id: string) => {
    setBranches(prev =>
      prev.map(b => (b.id === id ? { ...b, isExpanded: !b.isExpanded } : b))
    );
  };

  const filteredBranches = branches.filter(branch => {
    if (filter === 'favorites') return branch.isFavorite;
    if (filter === 'nearby') return parseFloat(branch.distance) < 5;
    return true;
  });

  const totalPoints = branches.reduce((sum, b) => sum + b.balance, 0);
  const enrolledBranches = branches.filter(b => b.balance > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/loyalty-additions/branches')}
              className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F2933]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2933]">Global Wallet</h1>
              <p className="text-sm text-[#6B7280]">All your loyalty points</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'nearby', label: 'Nearby' },
              { key: 'favorites', label: 'Favorites' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === key
                    ? 'bg-gradient-to-r from-[#667c67] to-[#546352] text-white shadow-md'
                    : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Global Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="elevated" className="p-6 bg-gradient-to-br from-[#667c67] to-[#546352] text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <h2 className="text-lg font-bold">Total Points</h2>
              </div>
              <p className="text-5xl font-bold mb-6">{totalPoints.toLocaleString()}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-sm mb-1">Enrolled Branches</p>
                  <p className="text-2xl font-bold">{enrolledBranches}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-sm mb-1">Total Branches</p>
                  <p className="text-2xl font-bold">{branches.length}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Branch List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#1F2933] px-1">Your Branches</h3>
          {filteredBranches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="overflow-hidden">
                {/* Branch Row */}
                <div
                  onClick={() => toggleExpand(branch.id)}
                  className="p-5 cursor-pointer hover:bg-[#667c67]/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-md flex-shrink-0">
                        <Logo size="sm" showText={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-[#1F2933]">{branch.name}</h4>
                          {branch.isFavorite && (
                            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {branch.distance}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#667c67]">{branch.balance}</p>
                        <p className="text-xs text-[#6B7280]">points</p>
                      </div>
                      {branch.isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#667c67]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#667c67]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {branch.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#E5E7EB]"
                    >
                      <div className="p-5 bg-gradient-to-br from-[#F3F7F3] to-white space-y-4">
                        {/* Recent Activity */}
                        <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-[#E4DBC4]/50 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-[#667c67]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280] mb-1">Recent Activity</p>
                            <p className="text-sm font-semibold text-[#1F2933]">{branch.recentActivity}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <GradientButton
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/loyalty-additions/branch/${branch.id}`);
                            }}
                            size="sm"
                            variant="default"
                          >
                            View Details
                          </GradientButton>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/loyalty-additions/redeem/${branch.id}`);
                            }}
                            className="px-4 py-2 rounded-xl bg-white border-2 border-[#667c67] text-[#667c67] font-semibold text-sm hover:bg-[#667c67]/5 transition-colors"
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBranches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-[#667c67]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2933] mb-2">No Branches Found</h3>
            <p className="text-[#6B7280] mb-6">
              {filter === 'favorites' && "You haven't added any favorites yet"}
              {filter === 'nearby' && 'No branches found within 5km'}
            </p>
            <GradientButton onClick={() => setFilter('all')} size="lg">
              View All Branches
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  );
}
