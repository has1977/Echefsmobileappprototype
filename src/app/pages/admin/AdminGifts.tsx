import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Gift, ArrowLeft, Plus, Search, Package,
  Edit2, Trash2, TrendingUp, Award, DollarSign,
  Calendar, Eye
} from 'lucide-react';
import { gifts, getActiveGifts } from '../../services/adminData';
import type { Gift as GiftType } from '../../services/adminData';

export function AdminGifts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch = 
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || gift.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: gifts.length,
    active: gifts.filter(g => g.status === 'active').length,
    totalClaimed: gifts.reduce((sum, g) => sum + g.claimed_count, 0),
    totalValue: gifts.reduce((sum, g) => sum + (g.value * g.claimed_count), 0),
  };

  const getStatusColor = (status: GiftType['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getCategoryIcon = (category: GiftType['category']) => {
    const icons = {
      voucher: Gift,
      product: Package,
      experience: Award,
      discount: DollarSign,
    };
    return icons[category];
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
                <h1 className="text-xl font-bold drop-shadow-sm">Loyalty Gifts</h1>
                <p className="text-sm text-white/80">Manage loyalty reward catalog</p>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-white text-[#667c67] hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Gift
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Gifts', value: stats.total, icon: Gift, color: 'text-blue-600' },
            { label: 'Active', value: stats.active, icon: TrendingUp, color: 'text-green-600' },
            { label: 'Total Claimed', value: stats.totalClaimed, icon: Award, color: 'text-purple-600' },
            { label: 'Total Value', value: `$${stats.totalValue.toFixed(2)}`, icon: DollarSign, color: 'text-[#667c67]' },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="voucher">Voucher</option>
                <option value="product">Product</option>
                <option value="experience">Experience</option>
                <option value="discount">Discount</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Gifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift, index) => {
            const CategoryIcon = getCategoryIcon(gift.category);
            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-6">
                    {/* Icon & Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#667c67]/10 rounded-lg">
                        <CategoryIcon className="w-8 h-8 text-[#667c67]" />
                      </div>
                      <Badge className={getStatusColor(gift.status)}>
                        {gift.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Name & Description */}
                    <h3 className="font-bold text-lg mb-2">{gift.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {gift.description}
                    </p>

                    {/* Points */}
                    <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="text-xs text-gray-600">Required Points</div>
                        <div className="font-bold text-yellow-600">{gift.points_required}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">Stock</div>
                        <div className="font-bold">{gift.stock}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">Claimed</div>
                        <div className="font-bold text-green-600">{gift.claimed_count}</div>
                      </div>
                    </div>

                    {/* Value & Category */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-bold">${gift.value.toFixed(2)}</span>
                    </div>

                    {/* Expiry */}
                    {gift.expires_at && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                        <Calendar className="w-3 h-3" />
                        <span>Expires: {new Date(gift.expires_at).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredGifts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No gifts found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
