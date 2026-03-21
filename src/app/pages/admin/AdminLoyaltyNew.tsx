import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Crown, ChevronLeft, Plus, Search, Users, Award, TrendingUp,
  DollarSign, Star, Edit2, Gift, Target, Zap, Settings,
  ArrowUp, ArrowDown, Eye, BarChart3, Download, Filter
} from 'lucide-react';
import {
  loyaltyTiers,
  loyaltyRules,
  customersLoyalty,
  pointsTransactions,
  getTopLoyaltyCustomers,
  getRecentTransactions,
  type LoyaltyTier,
  type CustomerLoyalty
} from '../../services/promotionsData';

export function AdminLoyaltyNew() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'tiers' | 'rules' | 'transactions'>('overview');

  const filteredCustomers = customersLoyalty.filter((customer) => {
    const matchesSearch = 
      customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customer_phone.includes(searchQuery);
    const matchesTier = filterTier === 'all' || customer.current_tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const stats = {
    totalCustomers: customersLoyalty.length,
    totalPoints: customersLoyalty.reduce((sum, c) => sum + c.available_points, 0),
    avgPointsPerCustomer: Math.round(customersLoyalty.reduce((sum, c) => sum + c.available_points, 0) / customersLoyalty.length),
    activeMembers: customersLoyalty.filter(c => {
      const daysSinceActivity = Math.floor((Date.now() - c.last_activity.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceActivity <= 30;
    }).length,
  };

  const tierDistribution = loyaltyTiers.map(tier => ({
    ...tier,
    count: customersLoyalty.filter(c => c.current_tier === tier.id).length,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/control-panel')}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-sm flex items-center gap-2">
                  <Crown className="w-7 h-7" />
                  Loyalty Program
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Manage customer loyalty tiers, points, and rewards
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-white text-[#667c67] hover:bg-white/90 font-semibold"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-t border-white/20 pt-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'tiers', label: 'Tiers', icon: Crown },
              { id: 'rules', label: 'Rules', icon: Target },
              { id: 'transactions', label: 'Transactions', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#667c67]'
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
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Members', value: stats.totalCustomers.toLocaleString(), icon: Users, color: 'text-[#667c67]', bg: 'bg-[#667c67]/10' },
                { label: 'Active Members', value: stats.activeMembers.toLocaleString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Avg Points', value: stats.avgPointsPerCustomer.toLocaleString(), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-none shadow-md">
                      <CardContent className="p-5">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Tier Distribution */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#667c67]" />
                  Tier Distribution
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {tierDistribution.map((tier) => {
                    const percentage = (tier.count / customersLoyalty.length) * 100;
                    return (
                      <div key={tier.id} className="relative p-5 rounded-2xl border-2 hover:shadow-lg transition-shadow" style={{ borderColor: tier.color }}>
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{tier.icon}</div>
                          <h4 className="font-bold text-lg" style={{ color: tier.color }}>{tier.name}</h4>
                          <p className="text-sm text-gray-500">{tier.min_points}+ points</p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Members</span>
                              <span className="font-bold">{tier.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full transition-all" 
                                style={{ width: `${percentage}%`, backgroundColor: tier.color }}
                              />
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {tier.benefits.points_multiplier}x points
                            </div>
                            {tier.benefits.discount_percentage > 0 && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {tier.benefits.discount_percentage}% discount
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Customers */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-white">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Top Loyalty Customers
                  </h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {getTopLoyaltyCustomers(5).map((customer, idx) => {
                      const tier = loyaltyTiers.find(t => t.id === customer.current_tier);
                      return (
                        <div key={customer.customer_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center text-white font-bold">
                            #{idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{customer.customer_name}</div>
                            <div className="text-sm text-gray-500">{customer.customer_email}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#667c67]">{customer.total_points.toLocaleString()}</div>
                            <div className="text-xs" style={{ color: tier?.color }}>{tier?.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-white">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Recent Transactions
                  </h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {getRecentTransactions(5).map((txn) => (
                      <div key={txn.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          txn.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {txn.type === 'earn' ? (
                            <ArrowUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{txn.customer_name}</div>
                          <div className="text-sm text-gray-500 truncate">{txn.reason}</div>
                        </div>
                        <div className={`font-bold ${txn.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'earn' ? '+' : ''}{txn.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <>
            {/* Filters */}
            <Card className="border-none shadow-md">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-11"
                    />
                  </div>

                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
                  >
                    <option value="all">All Tiers</option>
                    {loyaltyTiers.map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.icon} {tier.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Customers List */}
            <div className="space-y-4">
              {filteredCustomers.map((customer, idx) => {
                const tier = loyaltyTiers.find(t => t.id === customer.current_tier);
                const nextTier = customer.next_tier ? loyaltyTiers.find(t => t.id === customer.next_tier) : null;
                const progressToNext = nextTier && customer.points_to_next_tier 
                  ? ((nextTier.min_points - customer.points_to_next_tier) / nextTier.min_points) * 100 
                  : 100;

                return (
                  <motion.div
                    key={customer.customer_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {customer.customer_name.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{customer.customer_name}</h3>
                                <p className="text-sm text-gray-500">{customer.customer_email}</p>
                                <p className="text-sm text-gray-500">{customer.customer_phone}</p>
                              </div>
                              <div className="text-right">
                                <Badge className="mb-2" style={{ backgroundColor: tier?.color, color: 'white' }}>
                                  {tier?.icon} {tier?.name}
                                </Badge>
                                <div className="text-3xl font-bold text-[#667c67]">
                                  {customer.available_points.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">points available</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Total Orders</div>
                                <div className="font-bold text-gray-900">{customer.total_orders}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Total Spent</div>
                                <div className="font-bold text-gray-900">{customer.total_spent.toLocaleString()} KGS</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Referrals</div>
                                <div className="font-bold text-gray-900">{customer.referred_customers}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Reviews</div>
                                <div className="font-bold text-gray-900">{customer.reviews_count}</div>
                              </div>
                            </div>

                            {nextTier && customer.points_to_next_tier && (
                              <div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progress to {nextTier.name}</span>
                                  <span>{customer.points_to_next_tier} points to go</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#667c67] to-[#526250] transition-all"
                                    style={{ width: `${progressToNext}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loyaltyTiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-2 shadow-xl hover:shadow-2xl transition-all" style={{ borderColor: tier.color }}>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-3">{tier.icon}</div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: tier.color }}>{tier.name}</h3>
                      <p className="text-gray-600">
                        {tier.min_points.toLocaleString()}{tier.max_points ? ` - ${tier.max_points.toLocaleString()}` : '+'} points
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-900">Benefits:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Zap className="w-4 h-4" style={{ color: tier.color }} />
                          {tier.benefits.points_multiplier}x Points
                        </div>
                        {tier.benefits.discount_percentage > 0 && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4" style={{ color: tier.color }} />
                            {tier.benefits.discount_percentage}% Discount
                          </div>
                        )}
                        {tier.benefits.free_delivery && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Gift className="w-4 h-4" style={{ color: tier.color }} />
                            Free Delivery
                          </div>
                        )}
                        {tier.benefits.birthday_bonus > 0 && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Award className="w-4 h-4" style={{ color: tier.color }} />
                            {tier.benefits.birthday_bonus} Birthday Points
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Members</span>
                        <span className="font-bold">{tierDistribution.find(t => t.id === tier.id)?.count || 0}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Tier
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {loyaltyRules.map((rule, idx) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center flex-shrink-0">
                        <Target className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{rule.name}</h3>
                            <p className="text-gray-600">{rule.description}</p>
                          </div>
                          <Badge className={rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {rule.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Action</div>
                            <div className="font-semibold text-gray-900 capitalize">{rule.action.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Points Awarded</div>
                            <div className="font-bold text-[#667c67] text-lg">{rule.points_awarded}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Scope</div>
                            <div className="font-semibold text-gray-900">{rule.branches === 'all' ? 'All Branches' : `${(rule.branches as string[]).length} Branches`}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button className="w-full bg-[#667c67]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Rule
            </Button>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {pointsTransactions.map((txn, idx) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        txn.type === 'earn' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {txn.type === 'earn' ? (
                          <ArrowUp className="w-7 h-7 text-green-600" />
                        ) : (
                          <ArrowDown className="w-7 h-7 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{txn.customer_name}</h4>
                            <p className="text-sm text-gray-600">{txn.reason}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {txn.created_at.toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className={`text-2xl font-bold ${txn.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                              {txn.type === 'earn' ? '+' : ''}{txn.points}
                            </div>
                            <div className="text-xs text-gray-500">
                              Balance: {txn.balance_after.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
