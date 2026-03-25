import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../../design-system';
import {
  Crown, ChevronLeft, Plus, Search, Users, Award, TrendingUp,
  DollarSign, Star, Edit2, Gift, Target, Zap, Settings,
  ArrowUp, ArrowDown, Eye, BarChart3, Download, Filter,
  Trash2, Save, X, Check, AlertCircle, RefreshCw, Copy,
  Calendar, Mail, Phone, MapPin, History, ShoppingBag,
  Sparkles, TrendingDown, Percent, Clock, Info, Building2,
  ToggleLeft, ToggleRight, EyeOff, UserPlus, CircleDollarSign
} from 'lucide-react';

// Types
interface LoyaltyTier {
  id: string;
  name: string;
  icon: string;
  color: string;
  min_points: number;
  max_points: number | null;
  benefits: {
    points_multiplier: number;
    discount_percentage: number;
    priority_support: boolean;
    free_delivery: boolean;
    exclusive_offers: boolean;
    birthday_bonus: number;
  };
  enabled: boolean;
  branch_specific: boolean;
  branch_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  type: 'purchase' | 'signup' | 'referral' | 'birthday' | 'review' | 'social';
  points_awarded: number;
  multiplier?: number;
  min_purchase_amount?: number;
  enabled: boolean;
  branch_specific: boolean;
  branch_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

interface CustomerLoyalty {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  branch_id: string;
  current_tier: string;
  total_points: number;
  available_points: number;
  used_points: number;
  lifetime_spend: number;
  orders_count: number;
  join_date: Date;
  last_activity: Date;
  address?: string;
}

interface PointsTransaction {
  id: string;
  customer_id: string;
  customer_name: string;
  branch_id: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  points: number;
  reason: string;
  order_id?: string;
  created_at: Date;
  created_by?: string;
}

export function AdminLoyaltyNew() {
  const navigate = useNavigate();
  const { branches } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'tiers' | 'rules' | 'transactions' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterRuleType, setFilterRuleType] = useState<string>('all');
  const [showAddTier, setShowAddTier] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [showAdjustPoints, setShowAdjustPoints] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLoyalty | null>(null);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [editingRule, setEditingRule] = useState<LoyaltyRule | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [pointsAdjustment, setPointsAdjustment] = useState({ points: 0, reason: '' });

  // Load data from localStorage
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([]);
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = () => {
    // Load tiers
    const savedTiers = localStorage.getItem('echefs_loyalty_tiers');
    if (savedTiers) {
      const parsed = JSON.parse(savedTiers);
      const tiersWithDates = parsed.map((t: any) => ({
        ...t,
        created_at: new Date(t.created_at),
        updated_at: new Date(t.updated_at),
      }));
      setLoyaltyTiers(tiersWithDates);
    } else {
      // Default tiers
      const defaultTiers: LoyaltyTier[] = [
        {
          id: 'bronze',
          name: 'Bronze',
          icon: '🥉',
          color: '#CD7F32',
          min_points: 0,
          max_points: 499,
          benefits: {
            points_multiplier: 1,
            discount_percentage: 0,
            priority_support: false,
            free_delivery: false,
            exclusive_offers: false,
            birthday_bonus: 50,
          },
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'silver',
          name: 'Silver',
          icon: '🥈',
          color: '#C0C0C0',
          min_points: 500,
          max_points: 1499,
          benefits: {
            points_multiplier: 1.25,
            discount_percentage: 5,
            priority_support: false,
            free_delivery: false,
            exclusive_offers: true,
            birthday_bonus: 100,
          },
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'gold',
          name: 'Gold',
          icon: '🥇',
          color: '#FFD700',
          min_points: 1500,
          max_points: 2999,
          benefits: {
            points_multiplier: 1.5,
            discount_percentage: 10,
            priority_support: true,
            free_delivery: true,
            exclusive_offers: true,
            birthday_bonus: 200,
          },
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'platinum',
          name: 'Platinum',
          icon: '💎',
          color: '#E5E4E2',
          min_points: 3000,
          max_points: null,
          benefits: {
            points_multiplier: 2,
            discount_percentage: 15,
            priority_support: true,
            free_delivery: true,
            exclusive_offers: true,
            birthday_bonus: 500,
          },
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      setLoyaltyTiers(defaultTiers);
      localStorage.setItem('echefs_loyalty_tiers', JSON.stringify(defaultTiers));
    }

    // Load rules
    const savedRules = localStorage.getItem('echefs_loyalty_rules');
    if (savedRules) {
      const parsed = JSON.parse(savedRules);
      const rulesWithDates = parsed.map((r: any) => ({
        ...r,
        created_at: new Date(r.created_at),
        updated_at: new Date(r.updated_at),
      }));
      setLoyaltyRules(rulesWithDates);
    } else {
      // Default rules
      const defaultRules: LoyaltyRule[] = [
        {
          id: 'purchase',
          name: 'Purchase Points',
          description: 'Earn 1 point for every $1 spent',
          type: 'purchase',
          points_awarded: 1,
          multiplier: 1,
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'signup',
          name: 'Sign Up Bonus',
          description: 'Welcome bonus for new members',
          type: 'signup',
          points_awarded: 100,
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'referral',
          name: 'Referral Bonus',
          description: 'Refer a friend and earn points',
          type: 'referral',
          points_awarded: 250,
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'birthday',
          name: 'Birthday Bonus',
          description: 'Special points on your birthday',
          type: 'birthday',
          points_awarded: 200,
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'review',
          name: 'Review Reward',
          description: 'Write a review and earn points',
          type: 'review',
          points_awarded: 50,
          enabled: true,
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      setLoyaltyRules(defaultRules);
      localStorage.setItem('echefs_loyalty_rules', JSON.stringify(defaultRules));
    }

    // Load customers
    const savedCustomers = localStorage.getItem('echefs_loyalty_customers');
    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers);
      const customersWithDates = parsed.map((c: any) => ({
        ...c,
        join_date: new Date(c.join_date),
        last_activity: new Date(c.last_activity),
      }));
      setCustomers(customersWithDates);
    } else {
      // Generate mock customers
      const mockCustomers: CustomerLoyalty[] = [
        {
          customer_id: '1',
          customer_name: 'Ahmed Al-Rashid',
          customer_email: 'ahmed@example.com',
          customer_phone: '+996555123456',
          address: '123 Main St, Bishkek',
          branch_id: branches.length > 0 ? branches[0].id : 'branch-1',
          current_tier: 'gold',
          total_points: 2500,
          available_points: 1800,
          used_points: 700,
          lifetime_spend: 5200,
          orders_count: 45,
          join_date: new Date('2024-01-15'),
          last_activity: new Date('2026-03-20'),
        },
        {
          customer_id: '2',
          customer_name: 'Fatima Kuznetsova',
          customer_email: 'fatima@example.com',
          customer_phone: '+996555234567',
          address: '456 Oak Ave, Bishkek',
          branch_id: branches.length > 0 ? branches[0].id : 'branch-1',
          current_tier: 'platinum',
          total_points: 4200,
          available_points: 3500,
          used_points: 700,
          lifetime_spend: 8900,
          orders_count: 78,
          join_date: new Date('2023-11-10'),
          last_activity: new Date('2026-03-24'),
        },
        {
          customer_id: '3',
          customer_name: 'Dmitri Ivanov',
          customer_email: 'dmitri@example.com',
          customer_phone: '+996555345678',
          address: '789 Pine Rd, Osh',
          branch_id: branches.length > 1 ? branches[1].id : 'branch-2',
          current_tier: 'silver',
          total_points: 850,
          available_points: 600,
          used_points: 250,
          lifetime_spend: 1200,
          orders_count: 18,
          join_date: new Date('2024-08-22'),
          last_activity: new Date('2026-03-18'),
        },
        {
          customer_id: '4',
          customer_name: 'Sara Thompson',
          customer_email: 'sara@example.com',
          customer_phone: '+996555456789',
          address: '321 Elm St, Bishkek',
          branch_id: branches.length > 0 ? branches[0].id : 'branch-1',
          current_tier: 'bronze',
          total_points: 320,
          available_points: 320,
          used_points: 0,
          lifetime_spend: 450,
          orders_count: 8,
          join_date: new Date('2025-12-05'),
          last_activity: new Date('2026-03-15'),
        },
      ];
      setCustomers(mockCustomers);
      localStorage.setItem('echefs_loyalty_customers', JSON.stringify(mockCustomers));
    }

    // Load transactions
    const savedTransactions = localStorage.getItem('echefs_loyalty_transactions');
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      const transactionsWithDates = parsed.map((t: any) => ({
        ...t,
        created_at: new Date(t.created_at),
      }));
      setTransactions(transactionsWithDates);
    } else {
      const mockTransactions: PointsTransaction[] = [
        {
          id: 'txn-1',
          customer_id: '1',
          customer_name: 'Ahmed Al-Rashid',
          branch_id: branches.length > 0 ? branches[0].id : 'branch-1',
          type: 'earn',
          points: 125,
          reason: 'Order #ORD-1234',
          order_id: 'ORD-1234',
          created_at: new Date('2026-03-20T14:30:00'),
        },
        {
          id: 'txn-2',
          customer_id: '2',
          customer_name: 'Fatima Kuznetsova',
          branch_id: branches.length > 0 ? branches[0].id : 'branch-1',
          type: 'redeem',
          points: -500,
          reason: 'Redeemed: Free Dessert',
          created_at: new Date('2026-03-24T18:15:00'),
        },
        {
          id: 'txn-3',
          customer_id: '3',
          customer_name: 'Dmitri Ivanov',
          branch_id: branches.length > 1 ? branches[1].id : 'branch-2',
          type: 'earn',
          points: 85,
          reason: 'Order #ORD-1235',
          order_id: 'ORD-1235',
          created_at: new Date('2026-03-18T12:00:00'),
        },
      ];
      setTransactions(mockTransactions);
      localStorage.setItem('echefs_loyalty_transactions', JSON.stringify(mockTransactions));
    }
  };

  const saveTiers = (updatedTiers: LoyaltyTier[]) => {
    setLoyaltyTiers(updatedTiers);
    localStorage.setItem('echefs_loyalty_tiers', JSON.stringify(updatedTiers));
  };

  const saveRules = (updatedRules: LoyaltyRule[]) => {
    setLoyaltyRules(updatedRules);
    localStorage.setItem('echefs_loyalty_rules', JSON.stringify(updatedRules));
  };

  const saveCustomers = (updatedCustomers: CustomerLoyalty[]) => {
    setCustomers(updatedCustomers);
    localStorage.setItem('echefs_loyalty_customers', JSON.stringify(updatedCustomers));
  };

  const saveTransactions = (updatedTransactions: PointsTransaction[]) => {
    setTransactions(updatedTransactions);
    localStorage.setItem('echefs_loyalty_transactions', JSON.stringify(updatedTransactions));
  };

  // Filter data by selected branch
  const filteredTiers = selectedBranchId === 'all' 
    ? loyaltyTiers 
    : loyaltyTiers.filter(t => {
        if (!t.branch_specific) return true;
        if (t.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredRules = selectedBranchId === 'all'
    ? loyaltyRules
    : loyaltyRules.filter(r => {
        if (!r.branch_specific) return true;
        if (r.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredCustomersByBranch = selectedBranchId === 'all'
    ? customers
    : customers.filter(c => c.branch_id === selectedBranchId);

  const filteredTransactionsByBranch = selectedBranchId === 'all'
    ? transactions
    : transactions.filter(t => t.branch_id === selectedBranchId);

  // Stats calculations
  const stats = {
    totalCustomers: filteredCustomersByBranch.length,
    totalPoints: filteredCustomersByBranch.reduce((sum, c) => sum + c.available_points, 0),
    avgPointsPerCustomer: filteredCustomersByBranch.length > 0 
      ? Math.round(filteredCustomersByBranch.reduce((sum, c) => sum + c.available_points, 0) / filteredCustomersByBranch.length)
      : 0,
    activeMembers: filteredCustomersByBranch.filter(c => {
      const daysSinceActivity = Math.floor((Date.now() - c.last_activity.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceActivity <= 30;
    }).length,
    totalLifetimeSpend: filteredCustomersByBranch.reduce((sum, c) => sum + c.lifetime_spend, 0),
    totalOrders: filteredCustomersByBranch.reduce((sum, c) => sum + c.orders_count, 0),
  };

  const tierDistribution = filteredTiers.filter(t => t.enabled).map(tier => ({
    ...tier,
    count: filteredCustomersByBranch.filter(c => c.current_tier === tier.id).length,
  }));

  const filteredCustomers = filteredCustomersByBranch.filter((customer) => {
    const matchesSearch = 
      customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customer_phone.includes(searchQuery);
    const matchesTier = filterTier === 'all' || customer.current_tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const recentTransactions = [...filteredTransactionsByBranch]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 10);

  const topCustomers = [...filteredCustomersByBranch]
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 10);

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  // Tier functions
  const createNewTier = (): LoyaltyTier => ({
    id: `tier-${Date.now()}`,
    name: '',
    icon: '⭐',
    color: '#667c67',
    min_points: 0,
    max_points: null,
    benefits: {
      points_multiplier: 1,
      discount_percentage: 0,
      priority_support: false,
      free_delivery: false,
      exclusive_offers: false,
      birthday_bonus: 0,
    },
    enabled: true,
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const toggleTier = (id: string) => {
    const updated = loyaltyTiers.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled, updated_at: new Date() } : t
    );
    saveTiers(updated);
  };

  const deleteTier = (id: string) => {
    if (confirm('Are you sure you want to delete this tier?')) {
      saveTiers(loyaltyTiers.filter(t => t.id !== id));
    }
  };

  const duplicateTier = (tier: LoyaltyTier) => {
    const duplicated: LoyaltyTier = {
      ...tier,
      id: `tier-${Date.now()}`,
      name: `${tier.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveTiers([...loyaltyTiers, duplicated]);
  };

  // Rule functions
  const createNewRule = (): LoyaltyRule => ({
    id: `rule-${Date.now()}`,
    name: '',
    description: '',
    type: 'purchase',
    points_awarded: 0,
    enabled: true,
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const toggleRule = (id: string) => {
    const updated = loyaltyRules.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled, updated_at: new Date() } : r
    );
    saveRules(updated);
  };

  const deleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      saveRules(loyaltyRules.filter(r => r.id !== id));
    }
  };

  const duplicateRule = (rule: LoyaltyRule) => {
    const duplicated: LoyaltyRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveRules([...loyaltyRules, duplicated]);
  };

  // Customer functions
  const adjustCustomerPoints = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.map(c => {
      if (c.customer_id === selectedCustomer.customer_id) {
        const newAvailable = c.available_points + pointsAdjustment.points;
        const newTotal = c.total_points + (pointsAdjustment.points > 0 ? pointsAdjustment.points : 0);
        return {
          ...c,
          available_points: Math.max(0, newAvailable),
          total_points: Math.max(0, newTotal),
          used_points: pointsAdjustment.points < 0 ? c.used_points + Math.abs(pointsAdjustment.points) : c.used_points,
        };
      }
      return c;
    });
    saveCustomers(updatedCustomers);

    // Add transaction
    const newTransaction: PointsTransaction = {
      id: `txn-${Date.now()}`,
      customer_id: selectedCustomer.customer_id,
      customer_name: selectedCustomer.customer_name,
      branch_id: selectedCustomer.branch_id,
      type: 'adjust',
      points: pointsAdjustment.points,
      reason: pointsAdjustment.reason || 'Manual adjustment',
      created_at: new Date(),
      created_by: 'Admin',
    };
    saveTransactions([...transactions, newTransaction]);

    setShowAdjustPoints(false);
    setPointsAdjustment({ points: 0, reason: '' });
  };

  const getRuleIcon = (type: LoyaltyRule['type']) => {
    const icons = {
      purchase: ShoppingBag,
      signup: UserPlus,
      referral: Users,
      birthday: Gift,
      review: Star,
      social: Sparkles,
    };
    return icons[type];
  };

  const getRuleColor = (type: LoyaltyRule['type']) => {
    const colors = {
      purchase: '#3b82f6',
      signup: '#10b981',
      referral: '#8b5cf6',
      birthday: '#ec4899',
      review: '#f59e0b',
      social: '#06b6d4',
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-xl">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/admin')}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-sm flex items-center gap-2">
                  <Crown className="w-7 h-7" />
                  Loyalty Program Manager
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Complete control over customer loyalty system
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white/70" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#667c67] text-white">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id} className="bg-[#667c67] text-white">
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  const exportData = {
                    branch: selectedBranch?.name || 'All Branches',
                    tiers: filteredTiers,
                    rules: filteredRules,
                    customers: filteredCustomersByBranch,
                    transactions: filteredTransactionsByBranch,
                    stats,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `loyalty-data-${selectedBranch?.name || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t border-white/20 pt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'tiers', label: 'Tiers', icon: Crown },
              { id: 'rules', label: 'Rules', icon: Target },
              { id: 'transactions', label: 'Transactions', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-[#667c67] shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Branch Info Banner */}
        {selectedBranchId !== 'all' && selectedBranch && (
          <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Viewing: {selectedBranch.name}
                </h3>
                <p className="text-sm text-gray-600">
                  All loyalty data shown is specific to this branch
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  label: 'Total Members', 
                  value: stats.totalCustomers.toLocaleString(), 
                  icon: Users, 
                  color: '#667c67',
                  change: '+12%',
                  trend: 'up'
                },
                { 
                  label: 'Active Members (30d)', 
                  value: stats.activeMembers.toLocaleString(), 
                  icon: TrendingUp, 
                  color: '#10b981',
                  change: '+8%',
                  trend: 'up'
                },
                { 
                  label: 'Total Points Issued', 
                  value: stats.totalPoints.toLocaleString(), 
                  icon: Award, 
                  color: '#f59e0b',
                  change: '+24%',
                  trend: 'up'
                },
                { 
                  label: 'Avg Points/Customer', 
                  value: stats.avgPointsPerCustomer.toLocaleString(), 
                  icon: BarChart3, 
                  color: '#3b82f6',
                  change: '+5%',
                  trend: 'up'
                },
                { 
                  label: 'Lifetime Spend', 
                  value: `$${stats.totalLifetimeSpend.toLocaleString()}`, 
                  icon: DollarSign, 
                  color: '#8b5cf6',
                  change: '+15%',
                  trend: 'up'
                },
                { 
                  label: 'Total Orders', 
                  value: stats.totalOrders.toLocaleString(), 
                  icon: ShoppingBag, 
                  color: '#ec4899',
                  change: '+18%',
                  trend: 'up'
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard variant="elevated" className="p-5 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: stat.color }} />
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Tier Distribution */}
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Crown className="w-6 h-6 text-[#667c67]" />
                  Tier Distribution
                </h3>
                <Button
                  size="sm"
                  onClick={() => setActiveTab('tiers')}
                  className="bg-[#667c67] hover:bg-[#526250]"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Manage Tiers
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tierDistribution.map((tier) => {
                  const percentage = filteredCustomersByBranch.length > 0 
                    ? (tier.count / filteredCustomersByBranch.length) * 100 
                    : 0;
                  return (
                    <motion.div
                      key={tier.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative p-5 rounded-2xl border-2 hover:shadow-lg transition-all cursor-pointer"
                      style={{ borderColor: tier.color }}
                    >
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-2">{tier.icon}</div>
                        <h4 className="font-bold text-lg" style={{ color: tier.color }}>
                          {tier.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {tier.min_points}+ points
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Members</span>
                            <span className="font-bold text-lg">{tier.count}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="h-full"
                              style={{ backgroundColor: tier.color }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {percentage.toFixed(1)}% of total
                          </div>
                        </div>

                        <div className="pt-3 border-t space-y-2 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Points Multiplier
                            </span>
                            <span className="font-bold">{tier.benefits.points_multiplier}x</span>
                          </div>
                          {tier.benefits.discount_percentage > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Percent className="w-3 h-3" />
                                Discount
                              </span>
                              <span className="font-bold">{tier.benefits.discount_percentage}%</span>
                            </div>
                          )}
                          {tier.benefits.free_delivery && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="w-3 h-3" />
                              Free Delivery
                            </div>
                          )}
                          {tier.benefits.priority_support && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Check className="w-3 h-3" />
                              Priority Support
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Top Customers & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Customers */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Top Loyalty Customers
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab('customers')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {topCustomers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No customers in this branch yet</p>
                    </div>
                  ) : (
                    topCustomers.map((customer, idx) => {
                      const tier = filteredTiers.find(t => t.id === customer.current_tier);
                      return (
                        <motion.div
                          key={customer.customer_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerDetails(true);
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ 
                              background: `linear-gradient(135deg, ${tier?.color || '#667c67'}, ${tier?.color || '#667c67'}dd)` 
                            }}
                          >
                            #{idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {customer.customer_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="truncate">{customer.customer_email}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-[#667c67]">
                              {customer.total_points.toLocaleString()}
                            </div>
                            <div className="text-xs font-semibold" style={{ color: tier?.color }}>
                              {tier?.icon} {tier?.name}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </GlassCard>

              {/* Recent Transactions */}
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="w-6 h-6 text-blue-500" />
                    Recent Activity
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab('transactions')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No transactions in this branch yet</p>
                    </div>
                  ) : (
                    recentTransactions.map((txn, idx) => (
                      <motion.div
                        key={txn.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all"
                      >
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            txn.type === 'earn' ? 'bg-green-100' : 
                            txn.type === 'redeem' ? 'bg-red-100' :
                            txn.type === 'expire' ? 'bg-orange-100' :
                            'bg-blue-100'
                          }`}
                        >
                          {txn.type === 'earn' ? (
                            <ArrowUp className="w-6 h-6 text-green-600" />
                          ) : txn.type === 'redeem' ? (
                            <ArrowDown className="w-6 h-6 text-red-600" />
                          ) : txn.type === 'expire' ? (
                            <Clock className="w-6 h-6 text-orange-600" />
                          ) : (
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {txn.customer_name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {txn.reason}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {txn.created_at.toLocaleDateString()} {txn.created_at.toLocaleTimeString()}
                          </div>
                        </div>
                        <div 
                          className={`font-bold text-lg ${
                            txn.type === 'earn' ? 'text-green-600' : 
                            txn.type === 'redeem' ? 'text-red-600' :
                            'text-orange-600'
                          }`}
                        >
                          {txn.points > 0 ? '+' : ''}{txn.points}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <>
            {/* Search and Filters */}
            <GlassCard variant="elevated" className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                >
                  <option value="all">All Tiers</option>
                  {filteredTiers.filter(t => t.enabled).map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.icon} {tier.name}
                    </option>
                  ))}
                </select>
              </div>
            </GlassCard>

            {/* Customers List */}
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <GlassCard variant="default" className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No customers found</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery || filterTier !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No customers in this branch yet'}
                  </p>
                </GlassCard>
              ) : (
                filteredCustomers.map((customer, index) => {
                  const tier = filteredTiers.find(t => t.id === customer.current_tier);
                  const daysSinceActivity = Math.floor((Date.now() - customer.last_activity.getTime()) / (1000 * 60 * 60 * 24));
                  const isActive = daysSinceActivity <= 30;

                  return (
                    <motion.div
                      key={customer.customer_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard variant="elevated" className="p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start gap-6">
                          {/* Avatar */}
                          <div 
                            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${tier?.color || '#667c67'}, ${tier?.color || '#667c67'}dd)` 
                            }}
                          >
                            {customer.customer_name.charAt(0)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {customer.customer_name}
                                  </h3>
                                  <Badge 
                                    className="font-semibold"
                                    style={{ 
                                      backgroundColor: `${tier?.color}20`,
                                      color: tier?.color,
                                      borderColor: tier?.color
                                    }}
                                  >
                                    {tier?.icon} {tier?.name}
                                  </Badge>
                                  {isActive && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                      ● Active
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {customer.customer_email}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {customer.customer_phone}
                                  </div>
                                  {customer.address && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      {customer.address}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Available Points</div>
                                <div className="text-lg font-bold text-blue-600">
                                  {customer.available_points.toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Total Points</div>
                                <div className="text-lg font-bold text-purple-600">
                                  {customer.total_points.toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Lifetime Spend</div>
                                <div className="text-lg font-bold text-green-600">
                                  ${customer.lifetime_spend.toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Orders</div>
                                <div className="text-lg font-bold text-orange-600">
                                  {customer.orders_count}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Member Since</div>
                                <div className="text-xs font-bold text-gray-700">
                                  {customer.join_date.toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setShowCustomerDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setShowAdjustPoints(true);
                                }}
                              >
                                <CircleDollarSign className="w-4 h-4 mr-2" />
                                Adjust Points
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* TIERS TAB - Continuing in next part... */}
        {activeTab === 'tiers' && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Loyalty Tiers</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Define tier levels and benefits for your loyalty program
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingTier(createNewTier());
                  setShowAddTier(true);
                }}
                className="bg-[#667c67] hover:bg-[#526250]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loyaltyTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    variant="elevated" 
                    className={`p-6 ${tier.enabled ? 'border-2' : 'opacity-60'}`}
                    style={{ borderColor: tier.enabled ? tier.color : '#e5e7eb' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${tier.color}20` }}
                        >
                          {tier.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: tier.color }}>
                            {tier.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {tier.min_points} - {tier.max_points || '∞'} points
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleTier(tier.id)}
                          className={tier.enabled ? 'text-green-600' : 'text-gray-400'}
                        >
                          {tier.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTier(tier);
                            setShowAddTier(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateTier(tier)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTier(tier.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Branch Assignment */}
                    {tier.branch_specific && tier.branch_ids && tier.branch_ids.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                          <Building2 className="w-4 h-4" />
                          Branch Specific: {tier.branch_ids.map(id => 
                            branches.find(b => b.id === id)?.name
                          ).join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Points:</span>
                          <span className="font-bold">{tier.benefits.points_multiplier}x</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Percent className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-bold">{tier.benefits.discount_percentage}%</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Gift className="w-4 h-4 text-pink-600" />
                          <span className="text-gray-600">Birthday:</span>
                          <span className="font-bold">{tier.benefits.birthday_bonus} pts</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-600">Members:</span>
                          <span className="font-bold">
                            {filteredCustomersByBranch.filter(c => c.current_tier === tier.id).length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tier.benefits.free_delivery && (
                          <Badge className="bg-green-100 text-green-700">Free Delivery</Badge>
                        )}
                        {tier.benefits.priority_support && (
                          <Badge className="bg-blue-100 text-blue-700">Priority Support</Badge>
                        )}
                        {tier.benefits.exclusive_offers && (
                          <Badge className="bg-purple-100 text-purple-700">Exclusive Offers</Badge>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Loyalty Rules</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure how customers earn loyalty points
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingRule(createNewRule());
                  setShowAddRule(true);
                }}
                className="bg-[#667c67] hover:bg-[#526250]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            {/* Filters */}
            <GlassCard variant="elevated" className="p-4 mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterRuleType}
                  onChange={(e) => setFilterRuleType(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="purchase">🛍️ Purchase</option>
                  <option value="signup">👤 Sign Up</option>
                  <option value="referral">👥 Referral</option>
                  <option value="birthday">🎂 Birthday</option>
                  <option value="review">⭐ Review</option>
                  <option value="social">✨ Social</option>
                </select>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 gap-4">
              {loyaltyRules
                .filter(rule => {
                  const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    rule.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesType = filterRuleType === 'all' || rule.type === filterRuleType;
                  return matchesSearch && matchesType;
                })
                .map((rule, index) => {
                  const Icon = getRuleIcon(rule.type);
                  const color = getRuleColor(rule.type);

                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard 
                        variant="elevated" 
                        className={`p-6 ${rule.enabled ? 'border-l-4' : 'opacity-60'}`}
                        style={{ borderLeftColor: rule.enabled ? color : '#e5e7eb' }}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="w-7 h-7" style={{ color }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {rule.name}
                                  </h3>
                                  {rule.enabled ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                      ● Active
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                      ○ Inactive
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{rule.description}</p>
                              </div>
                            </div>

                            {/* Branch Assignment */}
                            {rule.branch_specific && rule.branch_ids && rule.branch_ids.length > 0 && (
                              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200 inline-block">
                                <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                                  <Building2 className="w-3 h-3" />
                                  {rule.branch_ids.map(id => 
                                    branches.find(b => b.id === id)?.name
                                  ).join(', ')}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <Award className="w-4 h-4" style={{ color }} />
                                <span className="text-sm text-gray-600">Points:</span>
                                <span className="font-bold text-lg" style={{ color }}>
                                  {rule.points_awarded}
                                </span>
                              </div>
                              {rule.multiplier && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                  <Zap className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm text-gray-600">Multiplier:</span>
                                  <span className="font-bold" style={{ color }}>
                                    {rule.multiplier}x
                                  </span>
                                </div>
                              )}
                              {rule.min_purchase_amount && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                  <DollarSign className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">Min:</span>
                                  <span className="font-bold">${rule.min_purchase_amount}</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleRule(rule.id)}
                                className={rule.enabled ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}
                              >
                                {rule.enabled ? (
                                  <>
                                    <ToggleRight className="w-4 h-4 mr-2" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-4 h-4 mr-2" />
                                    Enable
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingRule(rule);
                                  setShowAddRule(true);
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => duplicateRule(rule)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => deleteRule(rule.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
            </div>
          </>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Points Transactions</h2>
                <p className="text-sm text-gray-600 mt-1">
                  View all loyalty points transactions
                </p>
              </div>
            </div>

            <GlassCard variant="elevated" className="p-6">
              <div className="space-y-3">
                {filteredTransactionsByBranch.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  [...filteredTransactionsByBranch]
                    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
                    .map((txn, idx) => (
                      <motion.div
                        key={txn.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100"
                      >
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            txn.type === 'earn' ? 'bg-green-100' : 
                            txn.type === 'redeem' ? 'bg-red-100' :
                            txn.type === 'expire' ? 'bg-orange-100' :
                            'bg-blue-100'
                          }`}
                        >
                          {txn.type === 'earn' ? (
                            <ArrowUp className="w-6 h-6 text-green-600" />
                          ) : txn.type === 'redeem' ? (
                            <ArrowDown className="w-6 h-6 text-red-600" />
                          ) : txn.type === 'expire' ? (
                            <Clock className="w-6 h-6 text-orange-600" />
                          ) : (
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">
                            {txn.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {txn.reason}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {txn.created_at.toLocaleDateString()} • {txn.created_at.toLocaleTimeString()}
                            {txn.created_by && ` • by ${txn.created_by}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div 
                            className={`font-bold text-2xl ${
                              txn.type === 'earn' ? 'text-green-600' : 
                              txn.type === 'redeem' ? 'text-red-600' :
                              'text-orange-600'
                            }`}
                          >
                            {txn.points > 0 ? '+' : ''}{txn.points}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {txn.type}
                          </div>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </GlassCard>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <GlassCard variant="elevated" className="p-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Program Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Program Configuration</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure global settings for your loyalty program
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Enable Points Expiration</div>
                        <div className="text-sm text-gray-600">Points expire after 12 months of inactivity</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Auto-Assign Tiers</div>
                        <div className="text-sm text-gray-600">Automatically upgrade/downgrade customers based on points</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Send emails for tier upgrades and point changes</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button className="bg-[#667c67] hover:bg-[#526250]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Add/Edit Tier Modal */}
      <AnimatePresence>
        {showAddTier && editingTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowAddTier(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl my-8"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {loyaltyTiers.find(t => t.id === editingTier.id) ? 'Edit' : 'Create'} Tier
                  </h3>
                  <button
                    onClick={() => setShowAddTier(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Tier Name *</label>
                      <Input
                        value={editingTier.name}
                        onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                        placeholder="e.g., Gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Icon (Emoji) *</label>
                      <Input
                        value={editingTier.icon}
                        onChange={(e) => setEditingTier({ ...editingTier, icon: e.target.value })}
                        placeholder="e.g., 🥇"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Color *</label>
                      <Input
                        type="color"
                        value={editingTier.color}
                        onChange={(e) => setEditingTier({ ...editingTier, color: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Min Points *</label>
                      <Input
                        type="number"
                        value={editingTier.min_points}
                        onChange={(e) => setEditingTier({ ...editingTier, min_points: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Max Points (leave empty for unlimited)</label>
                      <Input
                        type="number"
                        value={editingTier.max_points || ''}
                        onChange={(e) => setEditingTier({ 
                          ...editingTier, 
                          max_points: e.target.value ? parseInt(e.target.value) : null 
                        })}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-bold mb-3">Benefits</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Points Multiplier</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editingTier.benefits.points_multiplier}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, points_multiplier: parseFloat(e.target.value) || 1 }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Discount %</label>
                        <Input
                          type="number"
                          value={editingTier.benefits.discount_percentage}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, discount_percentage: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Birthday Bonus Points</label>
                        <Input
                          type="number"
                          value={editingTier.benefits.birthday_bonus}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, birthday_bonus: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTier.benefits.free_delivery}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, free_delivery: e.target.checked }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Free Delivery</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTier.benefits.priority_support}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, priority_support: e.target.checked }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Priority Support</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTier.benefits.exclusive_offers}
                          onChange={(e) => setEditingTier({ 
                            ...editingTier, 
                            benefits: { ...editingTier.benefits, exclusive_offers: e.target.checked }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Exclusive Offers</span>
                      </label>
                    </div>
                  </div>

                  {/* Branch Assignment */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTier.branch_specific}
                        onChange={(e) => setEditingTier({ 
                          ...editingTier, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked ? [] : undefined
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Branch Specific</span>
                    </label>
                    {editingTier.branch_specific && (
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingTier.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingTier.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingTier({
                                  ...editingTier,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = loyaltyTiers.find(t => t.id === editingTier.id);
                        if (existing) {
                          const updated = loyaltyTiers.map(t => 
                            t.id === editingTier.id 
                              ? { ...editingTier, updated_at: new Date() }
                              : t
                          );
                          saveTiers(updated);
                        } else {
                          saveTiers([...loyaltyTiers, editingTier]);
                        }
                        setShowAddTier(false);
                        setEditingTier(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Tier
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddTier(false);
                        setEditingTier(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Rule Modal */}
      <AnimatePresence>
        {showAddRule && editingRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
            onClick={() => setShowAddRule(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {loyaltyRules.find(r => r.id === editingRule.id) ? 'Edit' : 'Create'} Rule
                  </h3>
                  <button
                    onClick={() => setShowAddRule(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Rule Name *</label>
                    <Input
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                      placeholder="e.g., Purchase Points"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      value={editingRule.description}
                      onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                      placeholder="Describe how customers earn points..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Rule Type *</label>
                      <select
                        value={editingRule.type}
                        onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value as any })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        <option value="purchase">🛍️ Purchase</option>
                        <option value="signup">👤 Sign Up</option>
                        <option value="referral">👥 Referral</option>
                        <option value="birthday">🎂 Birthday</option>
                        <option value="review">⭐ Review</option>
                        <option value="social">✨ Social</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Points Awarded *</label>
                      <Input
                        type="number"
                        value={editingRule.points_awarded}
                        onChange={(e) => setEditingRule({ 
                          ...editingRule, 
                          points_awarded: parseInt(e.target.value) || 0 
                        })}
                      />
                    </div>
                    {editingRule.type === 'purchase' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Points Multiplier</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={editingRule.multiplier || 1}
                            onChange={(e) => setEditingRule({ 
                              ...editingRule, 
                              multiplier: parseFloat(e.target.value) || 1 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Min Purchase Amount</label>
                          <Input
                            type="number"
                            value={editingRule.min_purchase_amount || ''}
                            onChange={(e) => setEditingRule({ 
                              ...editingRule, 
                              min_purchase_amount: e.target.value ? parseFloat(e.target.value) : undefined 
                            })}
                            placeholder="0"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Branch Assignment */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingRule.branch_specific}
                        onChange={(e) => setEditingRule({ 
                          ...editingRule, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked ? [] : undefined
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Branch Specific</span>
                    </label>
                    {editingRule.branch_specific && (
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingRule.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingRule.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingRule({
                                  ...editingRule,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = loyaltyRules.find(r => r.id === editingRule.id);
                        if (existing) {
                          const updated = loyaltyRules.map(r => 
                            r.id === editingRule.id 
                              ? { ...editingRule, updated_at: new Date() }
                              : r
                          );
                          saveRules(updated);
                        } else {
                          saveRules([...loyaltyRules, editingRule]);
                        }
                        setShowAddRule(false);
                        setEditingRule(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Rule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddRule(false);
                        setEditingRule(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adjust Points Modal */}
      <AnimatePresence>
        {showAdjustPoints && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
            onClick={() => setShowAdjustPoints(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Adjust Points</h3>
                  <button
                    onClick={() => setShowAdjustPoints(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#667c67] text-white flex items-center justify-center font-bold text-lg">
                      {selectedCustomer.customer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{selectedCustomer.customer_name}</div>
                      <div className="text-sm text-gray-600">
                        Current: {selectedCustomer.available_points} points
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Points (use negative for deduction)
                    </label>
                    <Input
                      type="number"
                      value={pointsAdjustment.points}
                      onChange={(e) => setPointsAdjustment({ 
                        ...pointsAdjustment, 
                        points: parseInt(e.target.value) || 0 
                      })}
                      placeholder="e.g., 100 or -50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Reason *</label>
                    <textarea
                      value={pointsAdjustment.reason}
                      onChange={(e) => setPointsAdjustment({ 
                        ...pointsAdjustment, 
                        reason: e.target.value 
                      })}
                      placeholder="Why are you adjusting points?"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={adjustCustomerPoints}
                      disabled={!pointsAdjustment.reason}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Apply Adjustment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAdjustPoints(false);
                        setPointsAdjustment({ points: 0, reason: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showCustomerDetails && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowCustomerDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Customer Details</h3>
                  <button
                    onClick={() => setShowCustomerDetails(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
                      style={{ 
                        background: `linear-gradient(135deg, ${filteredTiers.find(t => t.id === selectedCustomer.current_tier)?.color || '#667c67'}, ${filteredTiers.find(t => t.id === selectedCustomer.current_tier)?.color || '#667c67'}dd)` 
                      }}
                    >
                      {selectedCustomer.customer_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2">{selectedCustomer.customer_name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {selectedCustomer.customer_email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {selectedCustomer.customer_phone}
                        </div>
                        {selectedCustomer.address && (
                          <div className="flex items-center gap-2 text-gray-600 col-span-2">
                            <MapPin className="w-4 h-4" />
                            {selectedCustomer.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {selectedCustomer.available_points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Available Points</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        ${selectedCustomer.lifetime_spend.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Lifetime Spend</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {selectedCustomer.orders_count}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Transaction History
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {transactions
                        .filter(t => t.customer_id === selectedCustomer.customer_id)
                        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
                        .map((txn) => (
                          <div key={txn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              txn.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {txn.type === 'earn' ? (
                                <ArrowUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <ArrowDown className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{txn.reason}</div>
                              <div className="text-xs text-gray-500">
                                {txn.created_at.toLocaleDateString()} {txn.created_at.toLocaleTimeString()}
                              </div>
                            </div>
                            <div className={`font-bold ${
                              txn.type === 'earn' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {txn.points > 0 ? '+' : ''}{txn.points}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
