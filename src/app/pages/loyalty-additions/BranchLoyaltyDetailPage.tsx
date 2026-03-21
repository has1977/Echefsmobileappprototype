import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Gift, TrendingUp, History, Award, QrCode, ChevronRight, Clock, Star } from 'lucide-react';
import { GlassCard, GradientButton, motion } from '../../design-system';
import { Logo } from '../../components/shared/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { getBranchLoyaltyWallet, getBranchLoyaltyTransactions } from '../../services/branchLoyaltyData';

interface Transaction {
  id: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  date: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  validity: string;
  status: 'active' | 'expiring';
}

export function BranchLoyaltyDetailPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { user } = useAuth();
  const [showLedger, setShowLedger] = useState(false);
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [branchName, setBranchName] = useState('Branch');

  const promotions: Promotion[] = [
    {
      id: '1',
      title: '🎉 Buy 1 Get 1 Free',
      description: 'On all main courses',
      validity: 'Valid until Mar 31, 2026',
      status: 'active',
    },
    {
      id: '2',
      title: '☕ Free Coffee',
      description: 'With any breakfast order',
      validity: 'Expires in 2 days',
      status: 'expiring',
    },
    {
      id: '3',
      title: '🍰 20% Off Desserts',
      description: 'All dessert menu items',
      validity: 'Valid until Apr 15, 2026',
      status: 'active',
    },
  ];

  useEffect(() => {
    if (branchId && user) {
      // Get branch info
      const branch = db.getBranch(branchId);
      if (branch) {
        setBranchName(branch.translations.en.name);
      }

      // Get user's loyalty card
      const loyaltyCard = db.getLoyaltyCard(user.id);
      if (loyaltyCard) {
        setLoyaltyBalance(loyaltyCard.points);
        
        // Convert loyalty transactions to the expected format
        const formattedTransactions = loyaltyCard.transactions.map((txn, index) => ({
          id: txn.id,
          type: txn.type === 'earn' || txn.type === 'bonus' ? 'earn' : 'redeem',
          points: txn.points,
          description: txn.description,
          date: formatDate(txn.timestamp),
        })).slice(0, 10); // Show last 10 transactions
        
        setTransactions(formattedTransactions);
      }
    }
  }, [branchId, user]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 2) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date).toLocaleDateString();
  };

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-md">
              <Logo size="sm" showText={false} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#1F2933]">{branchName}</h1>
              <p className="text-sm text-[#6B7280]">Loyalty Program</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Loyalty Balance Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="elevated" className="p-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#667c67]/10 to-[#E4DBC4]/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#667c67] to-[#546352] shadow-xl mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <p className="text-sm text-[#6B7280] font-semibold mb-2">Your Balance</p>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-[#667c67] to-[#546352] bg-clip-text text-transparent mb-2">
                {loyaltyBalance}
              </h2>
              <p className="text-[#6B7280] font-medium">Loyalty Points</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <GradientButton
            onClick={() => navigate(`/loyalty-additions/check-in/${branchId}`)}
            variant="default"
            className="flex-col h-auto py-4"
          >
            <QrCode className="w-6 h-6 mb-2" />
            <span className="text-xs">Check-in</span>
          </GradientButton>
          <GradientButton
            onClick={() => navigate(`/loyalty-additions/redeem/${branchId}`)}
            variant="default"
            className="flex-col h-auto py-4"
          >
            <Gift className="w-6 h-6 mb-2" />
            <span className="text-xs">Redeem</span>
          </GradientButton>
          <button
            onClick={() => setShowLedger(!showLedger)}
            className="flex flex-col items-center justify-center h-auto py-4 px-4 rounded-2xl bg-white border-2 border-[#667c67]/20 text-[#667c67] font-semibold hover:bg-[#667c67]/5 transition-all"
          >
            <History className="w-6 h-6 mb-2" />
            <span className="text-xs">History</span>
          </button>
        </motion.div>

        {/* Points Ledger */}
        {showLedger && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard variant="default" className="p-5">
              <h3 className="text-lg font-bold text-[#1F2933] mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-[#667c67]" />
                Recent Transactions
              </h3>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E7EB]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === 'earn'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {tx.type === 'earn' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <Gift className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2933]">{tx.description}</p>
                        <p className="text-xs text-[#6B7280]">{tx.date}</p>
                      </div>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        tx.type === 'earn' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {tx.type === 'earn' ? '+' : ''}{tx.points}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Accrual Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="default" className="p-5">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
              How to Earn Points
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#E4DBC4]/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🛒</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2933]">Every $1 spent = 10 points</p>
                  <p className="text-xs text-[#6B7280]">On all orders</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#E4DBC4]/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2933]">Check-in bonus: 30 points</p>
                  <p className="text-xs text-[#6B7280]">Once per day</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#E4DBC4]/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎂</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2933]">Birthday bonus: 200 points</p>
                  <p className="text-xs text-[#6B7280]">Annual reward</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Active Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#1F2933]">Active Promotions</h3>
            <button
              onClick={() => navigate('/loyalty-additions/notifications')}
              className="text-sm font-semibold text-[#667c67] hover:text-[#546352] transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <GlassCard
                  variant="elevated"
                  className="p-5 cursor-pointer group hover:shadow-xl transition-all"
                  onClick={() => navigate(`/loyalty-additions/promotion/${promo.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-[#1F2933] mb-1">{promo.title}</h4>
                      <p className="text-sm text-[#6B7280] mb-2">{promo.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-[#667c67]" />
                        <span
                          className={`font-semibold ${
                            promo.status === 'expiring' ? 'text-orange-600' : 'text-[#667c67]'
                          }`}
                        >
                          {promo.validity}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#667c67] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}