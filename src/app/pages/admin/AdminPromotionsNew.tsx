import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag, Plus, Search, Calendar, TrendingUp, Users, DollarSign,
  Edit2, Trash2, Copy, Eye, EyeOff, Target, Gift, Percent,
  ChevronLeft, Clock, CheckCircle, XCircle, Zap, Globe, MapPin,
  BarChart3, Filter, Download, Upload
} from 'lucide-react';
import {
  promotions,
  getActivePromotions,
  getScheduledPromotions,
  getExpiredPromotions,
  type Promotion
} from '../../services/promotionsData';

export function AdminPromotionsNew() {
  const navigate = useNavigate();
  const { branches } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activePromotions = getActivePromotions();
  const scheduledPromotions = getScheduledPromotions();
  const expiredPromotions = getExpiredPromotions();

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || promo.type === filterType;
    const matchesStatus = filterStatus === 'all' || promo.status === filterStatus;
    const matchesScope = filterScope === 'all' || promo.scope === filterScope;
    return matchesSearch && matchesType && matchesStatus && matchesScope;
  });

  const stats = {
    total: promotions.length,
    active: activePromotions.length,
    scheduled: scheduledPromotions.length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usage_count, 0),
  };

  const getTypeIcon = (type: Promotion['type']) => {
    const icons = {
      discount: Percent,
      bogo: Gift,
      free_item: Tag,
      bundle: Target,
      cashback: DollarSign,
      points_multiplier: Zap,
    };
    return icons[type] || Tag;
  };

  const getTypeColor = (type: Promotion['type']) => {
    const colors = {
      discount: 'bg-blue-100 text-blue-700',
      bogo: 'bg-purple-100 text-purple-700',
      free_item: 'bg-green-100 text-green-700',
      bundle: 'bg-orange-100 text-orange-700',
      cashback: 'bg-yellow-100 text-yellow-700',
      points_multiplier: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (promo: Promotion) => {
    const now = new Date();
    if (promo.status === 'active' && promo.start_date <= now && promo.end_date >= now) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
    } else if (promo.status === 'scheduled' || promo.start_date > now) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    } else if (promo.end_date < now) {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Expired</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Inactive</Badge>;
    }
  };

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
                  <Tag className="w-7 h-7" />
                  Promotions Manager
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Create and manage promotional campaigns
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
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Promotions', value: stats.total, icon: Tag, color: 'text-[#667c67]', bg: 'bg-[#667c67]/10' },
            { label: 'Active Now', value: stats.active, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Scheduled', value: stats.scheduled, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Redemptions', value: stats.totalUsage.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
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

        {/* Filters */}
        <Card className="border-none shadow-md">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
              >
                <option value="all">All Types</option>
                <option value="discount">Discount</option>
                <option value="bogo">BOGO</option>
                <option value="free_item">Free Item</option>
                <option value="bundle">Bundle</option>
                <option value="cashback">Cashback</option>
                <option value="points_multiplier">Points Multiplier</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
                className="h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
              >
                <option value="all">All Scopes</option>
                <option value="global">Global</option>
                <option value="branch">Branch-specific</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Promotions List */}
        <div className="space-y-4">
          {filteredPromotions.map((promo, index) => {
            const TypeIcon = getTypeIcon(promo.type);
            const usagePercent = promo.usage_limit 
              ? (promo.usage_count / promo.usage_limit) * 100 
              : 0;

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl ${getTypeColor(promo.type)} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{promo.name}</h3>
                              {getStatusBadge(promo)}
                              <Badge className={getTypeColor(promo.type)}>
                                {promo.type.replace('_', ' ')}
                              </Badge>
                              {promo.scope === 'global' ? (
                                <Badge variant="outline" className="gap-1">
                                  <Globe className="w-3 h-3" />
                                  Global
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {Array.isArray(promo.branches) ? `${promo.branches.length} Branches` : 'All Branches'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{promo.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500 text-xs mb-1">Period</div>
                                <div className="font-semibold flex items-center gap-1 text-gray-900">
                                  <Calendar className="w-4 h-4" />
                                  {promo.start_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {promo.end_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>

                              {promo.discount_value && (
                                <div>
                                  <div className="text-gray-500 text-xs mb-1">Discount</div>
                                  <div className="font-bold text-[#667c67] text-lg">
                                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value} KGS`}
                                  </div>
                                </div>
                              )}

                              {promo.requires_code && promo.code && (
                                <div>
                                  <div className="text-gray-500 text-xs mb-1">Promo Code</div>
                                  <div className="font-mono font-bold text-purple-600 flex items-center gap-2">
                                    {promo.code}
                                    <button className="hover:bg-purple-50 p-1 rounded">
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div>
                                <div className="text-gray-500 text-xs mb-1">Usage</div>
                                <div className="font-semibold text-gray-900">
                                  {promo.usage_count}{promo.usage_limit ? ` / ${promo.usage_limit}` : ''}
                                </div>
                              </div>
                            </div>

                            {/* Usage Progress */}
                            {promo.usage_limit && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Redemption Progress</span>
                                  <span>{usagePercent.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#667c67] to-[#526250] transition-all"
                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filteredPromotions.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or create a new promotion</p>
                <Button onClick={() => setShowCreateModal(true)} className="bg-[#667c67]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Promotion
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
