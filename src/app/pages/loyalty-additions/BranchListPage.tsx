import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, MapPin, Clock, Gift, Star, TrendingUp } from 'lucide-react';
import { GlassCard, GradientButton, motion } from '../../design-system';
import { Logo } from '../../components/shared/Logo';

interface Branch {
  id: string;
  name: string;
  distance: string;
  status: 'open' | 'closed';
  loyaltyBalance: number;
  activePromotions: number;
  isFavorite: boolean;
  address: string;
}

export function BranchListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'nearby' | 'favorites'>('all');

  const branches: Branch[] = [
    {
      id: '1',
      name: 'eChefs Downtown',
      distance: '0.5 km',
      status: 'open',
      loyaltyBalance: 450,
      activePromotions: 3,
      isFavorite: true,
      address: 'Main Street 123',
    },
    {
      id: '2',
      name: 'eChefs Plaza',
      distance: '1.2 km',
      status: 'open',
      loyaltyBalance: 280,
      activePromotions: 2,
      isFavorite: true,
      address: 'Plaza Center 45',
    },
    {
      id: '3',
      name: 'eChefs Mall',
      distance: '2.8 km',
      status: 'closed',
      loyaltyBalance: 120,
      activePromotions: 1,
      isFavorite: false,
      address: 'Shopping Mall Floor 2',
    },
    {
      id: '4',
      name: 'eChefs Airport',
      distance: '15.5 km',
      status: 'open',
      loyaltyBalance: 0,
      activePromotions: 4,
      isFavorite: false,
      address: 'Terminal 1, Gate A',
    },
  ];

  const filteredBranches = branches.filter(branch => {
    if (filter === 'favorites') return branch.isFavorite;
    if (filter === 'nearby') return parseFloat(branch.distance) < 5;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#667c67]/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Logo size="sm" showText={false} />
            <div>
              <h1 className="text-2xl font-bold text-[#1F2933]">Discover Branches</h1>
              <p className="text-sm text-[#6B7280]">Find nearby restaurants</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Branches' },
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

      {/* Branch List */}
      <div className="p-6 space-y-4">
        {filteredBranches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              variant="elevated"
              className="p-5 cursor-pointer group hover:shadow-xl transition-all"
              onClick={() => navigate(`/loyalty-additions/branch/${branch.id}`)}
            >
              <div className="flex items-start gap-4">
                {/* Branch Logo */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Logo size="sm" showText={false} />
                </div>

                {/* Branch Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#1F2933] mb-1">{branch.name}</h3>
                      <p className="text-sm text-[#6B7280] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {branch.distance} • {branch.address}
                      </p>
                    </div>
                    {branch.isFavorite && (
                      <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                    )}
                  </div>

                  {/* Status & Loyalty */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        branch.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {branch.status === 'open' ? 'Open Now' : 'Closed'}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E4DBC4]/30 text-[#667c67] text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {branch.loyaltyBalance} pts
                    </div>
                  </div>

                  {/* Active Promotions */}
                  {branch.activePromotions > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-sm font-semibold text-[#1F2933]">
                          {branch.activePromotions} Active Promotion{branch.activePromotions > 1 ? 's' : ''}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#667c67] group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBranches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center mb-6">
            <MapPin className="w-12 h-12 text-[#667c67]" />
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

      {/* Global Wallet CTA */}
      <div className="fixed bottom-6 left-6 right-6 z-30">
        <GradientButton
          onClick={() => navigate('/loyalty-additions/global-wallet')}
          size="lg"
          fullWidth
          leftIcon={<TrendingUp className="w-5 h-5" />}
        >
          View Global Wallet
        </GradientButton>
      </div>
    </div>
  );
}
