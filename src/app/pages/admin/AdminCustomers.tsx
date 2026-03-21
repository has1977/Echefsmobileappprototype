import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Users, Search, ArrowLeft, Download, TrendingUp,
  DollarSign, ShoppingCart, Award, Mail, Phone,
  MapPin, Calendar, Star, Gift, RefreshCw
} from 'lucide-react';
import { customers, getTopCustomers } from '../../services/adminData';
import type { Customer } from '../../services/adminData';

export function AdminCustomers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesTier = filterTier === 'all' || customer.loyalty_tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalSpent: customers.reduce((sum, c) => sum + c.total_spent, 0),
    avgLifetimeValue: customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length,
  };

  const getTierColor = (tier: Customer['loyalty_tier']) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800',
    };
    return colors[tier];
  };

  const getTierIcon = (tier: Customer['loyalty_tier']) => {
    return <Award className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">Customer Management</h1>
                <p className="text-sm text-white/80">View and manage customer accounts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: stats.total, icon: Users, color: 'text-blue-600' },
            { label: 'Active', value: stats.active, icon: TrendingUp, color: 'text-green-600' },
            { label: 'Total Spent', value: `$${stats.totalSpent.toFixed(2)}`, icon: DollarSign, color: 'text-[#667c67]' },
            { label: 'Avg LTV', value: `$${stats.avgLifetimeValue.toFixed(2)}`, icon: Star, color: 'text-yellow-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="space-y-4">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Customer Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{customer.name}</h3>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getTierColor(customer.loyalty_tier)}>
                          {getTierIcon(customer.loyalty_tier)}
                          <span className="ml-1 capitalize">{customer.loyalty_tier}</span>
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-xs text-gray-600">Total Orders</div>
                          <div className="font-bold text-lg">{customer.total_orders}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Total Spent</div>
                          <div className="font-bold text-lg text-green-600">
                            ${customer.total_spent.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Avg Order</div>
                          <div className="font-bold text-lg">
                            ${customer.avg_order_value.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Loyalty Points</div>
                          <div className="font-bold text-lg text-[#667c67] flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            {customer.loyalty_points}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                        {customer.last_order_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Last order: {new Date(customer.last_order_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {customer.favorite_branch && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>Favorite: {customer.favorite_branch === 'branch-1' ? 'Downtown Bishkek' : 'Ala-Too Square'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full lg:w-auto"
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full lg:w-auto"
                      >
                        Order History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
