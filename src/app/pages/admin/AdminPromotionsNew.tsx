import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../../design-system';
import {
  Tag, Plus, Search, Calendar, TrendingUp, Users, DollarSign,
  Edit2, Trash2, Copy, Eye, EyeOff, Target, Gift, Percent,
  ChevronLeft, Clock, CheckCircle, XCircle, Zap, Globe, MapPin,
  BarChart3, Filter, Download, Upload, Image, Save, X, Info,
  AlertCircle, Settings, ToggleLeft, ToggleRight, Package,
  ShoppingBag, Sparkles, ArrowUpCircle, ArrowDownCircle, Building2
} from 'lucide-react';

// Types
interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'bogo' | 'free_item' | 'bundle' | 'cashback' | 'points_multiplier';
  code?: string;
  discount_value?: number;
  discount_type?: 'percentage' | 'fixed';
  min_purchase?: number;
  max_discount?: number;
  free_item_id?: string;
  buy_quantity?: number;
  get_quantity?: number;
  bundle_items?: string[];
  points_multiplier?: number;
  scope: 'global' | 'branch' | 'region';
  branch_ids?: string[];
  region_ids?: string[];
  status: 'active' | 'scheduled' | 'inactive' | 'expired';
  start_date: Date;
  end_date: Date;
  usage_limit?: number;
  usage_count: number;
  per_customer_limit?: number;
  applicable_to: 'all' | 'specific_items' | 'specific_categories';
  item_ids?: string[];
  category_ids?: string[];
  image_url?: string;
  terms_conditions?: string;
  priority: number;
  created_at: Date;
  updated_at: Date;
}

export function AdminPromotionsNew() {
  const navigate = useNavigate();
  const { branches } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = () => {
    const saved = localStorage.getItem('echefs_promotions');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((p: any) => ({
        ...p,
        start_date: new Date(p.start_date),
        end_date: new Date(p.end_date),
        created_at: new Date(p.created_at),
        updated_at: new Date(p.updated_at),
      }));
      setPromotions(withDates);
    } else {
      // Default promotions
      const defaultPromotions: Promotion[] = [
        {
          id: 'promo-1',
          name: 'Summer Sale 2026',
          description: 'Get 20% off on all orders above $50',
          type: 'discount',
          code: 'SUMMER20',
          discount_value: 20,
          discount_type: 'percentage',
          min_purchase: 50,
          max_discount: 100,
          scope: 'global',
          status: 'active',
          start_date: new Date('2026-06-01'),
          end_date: new Date('2026-08-31'),
          usage_count: 245,
          usage_limit: 1000,
          per_customer_limit: 5,
          applicable_to: 'all',
          priority: 1,
          created_at: new Date('2026-05-15'),
          updated_at: new Date('2026-05-15'),
        },
        {
          id: 'promo-2',
          name: 'Buy 1 Get 1 Pizza',
          description: 'Buy any large pizza and get a medium pizza free',
          type: 'bogo',
          code: 'BOGO_PIZZA',
          buy_quantity: 1,
          get_quantity: 1,
          scope: 'branch',
          branch_ids: branches.length > 0 ? [branches[0].id] : ['branch-1'],
          status: 'active',
          start_date: new Date('2026-03-01'),
          end_date: new Date('2026-12-31'),
          usage_count: 89,
          applicable_to: 'specific_categories',
          category_ids: ['pizza'],
          priority: 2,
          created_at: new Date('2026-02-20'),
          updated_at: new Date('2026-02-20'),
        },
      ];
      setPromotions(defaultPromotions);
      localStorage.setItem('echefs_promotions', JSON.stringify(defaultPromotions));
    }
  };

  const savePromotions = (updatedPromotions: Promotion[]) => {
    setPromotions(updatedPromotions);
    localStorage.setItem('echefs_promotions', JSON.stringify(updatedPromotions));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        if (editingPromotion) {
          setEditingPromotion({
            ...editingPromotion,
            image_url: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getActivePromotions = () => {
    const now = new Date();
    return promotions.filter(p => 
      p.status === 'active' && 
      p.start_date <= now && 
      p.end_date >= now
    );
  };

  const getScheduledPromotions = () => {
    const now = new Date();
    return promotions.filter(p => p.start_date > now);
  };

  const getExpiredPromotions = () => {
    const now = new Date();
    return promotions.filter(p => p.end_date < now);
  };

  // Filter by branch first
  const promotionsByBranch = selectedBranchId === 'all'
    ? promotions
    : promotions.filter(promo => {
        if (promo.scope === 'global') return true;
        if (promo.scope === 'branch' && promo.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredPromotions = promotionsByBranch.filter((promo) => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || promo.type === filterType;
    
    // Status filter
    const now = new Date();
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = promo.status === 'active' && promo.start_date <= now && promo.end_date >= now;
    } else if (filterStatus === 'scheduled') {
      matchesStatus = promo.start_date > now;
    } else if (filterStatus === 'expired') {
      matchesStatus = promo.end_date < now;
    } else if (filterStatus === 'inactive') {
      matchesStatus = promo.status === 'inactive';
    }
    
    const matchesScope = filterScope === 'all' || promo.scope === filterScope;
    return matchesSearch && matchesType && matchesStatus && matchesScope;
  });

  const stats = {
    total: promotionsByBranch.length,
    active: promotionsByBranch.filter(p => {
      const now = new Date();
      return p.status === 'active' && p.start_date <= now && p.end_date >= now;
    }).length,
    scheduled: promotionsByBranch.filter(p => p.start_date > new Date()).length,
    expired: promotionsByBranch.filter(p => p.end_date < new Date()).length,
    totalUsage: promotionsByBranch.reduce((sum, p) => sum + p.usage_count, 0),
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  const getTypeIcon = (type: Promotion['type']) => {
    const icons = {
      discount: Percent,
      bogo: Gift,
      free_item: Tag,
      bundle: Package,
      cashback: DollarSign,
      points_multiplier: Zap,
    };
    return icons[type] || Tag;
  };

  const getTypeColor = (type: Promotion['type']) => {
    const colors = {
      discount: '#3b82f6',
      bogo: '#8b5cf6',
      free_item: '#10b981',
      bundle: '#f59e0b',
      cashback: '#eab308',
      points_multiplier: '#ec4899',
    };
    return colors[type] || '#667c67';
  };

  const getStatusBadge = (promo: Promotion) => {
    const now = new Date();
    if (promo.status === 'active' && promo.start_date <= now && promo.end_date >= now) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">● Active</Badge>;
    } else if (promo.start_date > now) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">⏰ Scheduled</Badge>;
    } else if (promo.end_date < now) {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">✕ Expired</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 border-red-200">⊗ Inactive</Badge>;
    }
  };

  const createNewPromotion = (): Promotion => ({
    id: `promo-${Date.now()}`,
    name: '',
    description: '',
    type: 'discount',
    discount_value: 10,
    discount_type: 'percentage',
    scope: 'global',
    status: 'active',
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usage_count: 0,
    applicable_to: 'all',
    priority: 1,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const duplicatePromotion = (promo: Promotion) => {
    const duplicated: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      name: `${promo.name} (Copy)`,
      code: promo.code ? `${promo.code}_COPY` : undefined,
      usage_count: 0,
      status: 'inactive',
      created_at: new Date(),
      updated_at: new Date(),
    };
    savePromotions([...promotions, duplicated]);
  };

  const deletePromotion = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      savePromotions(promotions.filter(p => p.id !== id));
    }
  };

  const togglePromotionStatus = (id: string) => {
    const updated = promotions.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as any, updated_at: new Date() }
        : p
    );
    savePromotions(updated);
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
                  <Tag className="w-7 h-7" />
                  Promotions Manager
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Create and manage promotional campaigns
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
                    promotions: promotionsByBranch,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `promotions-${selectedBranch?.name || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-white text-[#667c67] hover:bg-white/90 font-semibold"
                onClick={() => {
                  const newPromo = createNewPromotion();
                  // Auto-assign to selected branch if not 'all'
                  if (selectedBranchId !== 'all') {
                    newPromo.scope = 'branch';
                    newPromo.branch_ids = [selectedBranchId];
                  }
                  setEditingPromotion(newPromo);
                  setUploadedImage(null);
                  setShowCreateModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: stats.total, icon: Tag, color: 'bg-white/10' },
              { label: 'Active', value: stats.active, icon: CheckCircle, color: 'bg-green-500/20' },
              { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'bg-blue-500/20' },
              { label: 'Expired', value: stats.expired, icon: XCircle, color: 'bg-gray-500/20' },
              { label: 'Total Usage', value: stats.totalUsage, icon: TrendingUp, color: 'bg-yellow-500/20' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className={`${stat.color} backdrop-blur-sm rounded-xl p-3 text-center`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white/70" />
                    <div className="text-white/70 text-xs font-medium">{stat.label}</div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </motion.div>
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
                  Showing promotions for this branch (including global promotions)
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Filters */}
        <GlassCard variant="elevated" className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, code, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
            >
              <option value="all">All Types</option>
              <option value="discount">💰 Discount</option>
              <option value="bogo">🎁 BOGO</option>
              <option value="free_item">🏷️ Free Item</option>
              <option value="bundle">📦 Bundle</option>
              <option value="cashback">💵 Cashback</option>
              <option value="points_multiplier">⚡ Points Multiplier</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">● Active</option>
              <option value="scheduled">⏰ Scheduled</option>
              <option value="expired">✕ Expired</option>
              <option value="inactive">⊗ Inactive</option>
            </select>
          </div>
        </GlassCard>

        {/* Promotions List */}
        <div className="space-y-4">
          {filteredPromotions.length === 0 ? (
            <GlassCard variant="default" className="p-12 text-center">
              <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-400 mb-2">No promotions found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first promotion to get started'}
              </p>
              {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
                <Button
                  onClick={() => {
                    const newPromo = createNewPromotion();
                    if (selectedBranchId !== 'all') {
                      newPromo.scope = 'branch';
                      newPromo.branch_ids = [selectedBranchId];
                    }
                    setEditingPromotion(newPromo);
                    setUploadedImage(null);
                    setShowCreateModal(true);
                  }}
                  className="bg-[#667c67] hover:bg-[#526250]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Promotion
                </Button>
              )}
            </GlassCard>
          ) : (
            filteredPromotions.map((promo, index) => {
              const Icon = getTypeIcon(promo.type);
              const typeColor = getTypeColor(promo.type);
              const now = new Date();
              const isActive = promo.status === 'active' && promo.start_date <= now && promo.end_date >= now;
              const usagePercentage = promo.usage_limit 
                ? (promo.usage_count / promo.usage_limit) * 100 
                : 0;

              return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    variant="elevated" 
                    className="p-6 hover:shadow-2xl transition-all"
                  >
                    <div className="flex items-start gap-6">
                      {/* Image */}
                      <div 
                        className="w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ backgroundColor: `${typeColor}20` }}
                      >
                        {promo.image_url ? (
                          <img 
                            src={promo.image_url} 
                            alt={promo.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-16 h-16" style={{ color: typeColor }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {promo.name}
                              </h3>
                              {getStatusBadge(promo)}
                              {promo.code && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {promo.code}
                                </Badge>
                              )}
                              {promo.scope === 'branch' && (
                                <Badge variant="outline" className="text-xs">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  Branch Specific
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {promo.description}
                            </p>
                          </div>
                        </div>

                        {/* Promo Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {promo.type === 'discount' && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Discount</div>
                              <div className="text-lg font-bold text-blue-600">
                                {promo.discount_type === 'percentage' 
                                  ? `${promo.discount_value}%` 
                                  : `$${promo.discount_value}`}
                              </div>
                            </div>
                          )}
                          {promo.type === 'bogo' && (
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Deal</div>
                              <div className="text-lg font-bold text-purple-600">
                                Buy {promo.buy_quantity} Get {promo.get_quantity}
                              </div>
                            </div>
                          )}
                          {promo.type === 'points_multiplier' && (
                            <div className="bg-pink-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Multiplier</div>
                              <div className="text-lg font-bold text-pink-600">
                                {promo.points_multiplier}x Points
                              </div>
                            </div>
                          )}
                          {promo.min_purchase && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Min Purchase</div>
                              <div className="text-lg font-bold text-green-600">
                                ${promo.min_purchase}
                              </div>
                            </div>
                          )}
                          <div className="bg-orange-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Usage</div>
                            <div className="text-lg font-bold text-orange-600">
                              {promo.usage_count}
                              {promo.usage_limit && `/${promo.usage_limit}`}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Period</div>
                            <div className="text-xs font-bold text-gray-700">
                              {promo.start_date.toLocaleDateString()} - {promo.end_date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Usage Progress */}
                        {promo.usage_limit && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Usage Progress</span>
                              <span>{usagePercentage.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercentage}%` }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: typeColor }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePromotionStatus(promo.id)}
                            className={isActive ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}
                          >
                            {isActive ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPromotion(promo);
                              setUploadedImage(promo.image_url || null);
                              setShowCreateModal(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicatePromotion(promo)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => deletePromotion(promo.id)}
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
            })
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && editingPromotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl my-8"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {promotions.find(p => p.id === editingPromotion.id) ? 'Edit' : 'Create'} Promotion
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Promotion Image</label>
                    <div className="flex gap-4">
                      <div 
                        className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#667c67] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage || editingPromotion.image_url ? (
                          <img 
                            src={uploadedImage || editingPromotion.image_url} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <div className="text-xs text-gray-500">Click to upload</div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-2">
                          Upload a promotional image (recommended size: 800x600px)
                        </div>
                        {(uploadedImage || editingPromotion.image_url) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUploadedImage(null);
                              setEditingPromotion({ ...editingPromotion, image_url: undefined });
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Promotion Name *</label>
                      <Input
                        value={editingPromotion.name}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, name: e.target.value })}
                        placeholder="e.g., Summer Sale 2026"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Description *</label>
                      <textarea
                        value={editingPromotion.description}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                        placeholder="Describe your promotion..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Promotion Type *</label>
                      <select
                        value={editingPromotion.type}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, type: e.target.value as any })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        <option value="discount">💰 Discount</option>
                        <option value="bogo">🎁 Buy One Get One</option>
                        <option value="free_item">🏷️ Free Item</option>
                        <option value="bundle">📦 Bundle Deal</option>
                        <option value="cashback">💵 Cashback</option>
                        <option value="points_multiplier">⚡ Points Multiplier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Promo Code (Optional)</label>
                      <Input
                        value={editingPromotion.code || ''}
                        onChange={(e) => setEditingPromotion({ ...editingPromotion, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., SUMMER20"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {editingPromotion.type === 'discount' && (
                    <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Percent className="w-5 h-5" />
                        Discount Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Discount Type</label>
                          <select
                            value={editingPromotion.discount_type}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              discount_type: e.target.value as any 
                            })}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Discount Value</label>
                          <Input
                            type="number"
                            value={editingPromotion.discount_value || 0}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              discount_value: parseFloat(e.target.value) || 0 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Min Purchase ($)</label>
                          <Input
                            type="number"
                            value={editingPromotion.min_purchase || ''}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              min_purchase: e.target.value ? parseFloat(e.target.value) : undefined 
                            })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Max Discount ($)</label>
                          <Input
                            type="number"
                            value={editingPromotion.max_discount || ''}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              max_discount: e.target.value ? parseFloat(e.target.value) : undefined 
                            })}
                            placeholder="Unlimited"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingPromotion.type === 'bogo' && (
                    <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        BOGO Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Buy Quantity</label>
                          <Input
                            type="number"
                            value={editingPromotion.buy_quantity || 1}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              buy_quantity: parseInt(e.target.value) || 1 
                            })}
                            min={1}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Get Quantity</label>
                          <Input
                            type="number"
                            value={editingPromotion.get_quantity || 1}
                            onChange={(e) => setEditingPromotion({ 
                              ...editingPromotion, 
                              get_quantity: parseInt(e.target.value) || 1 
                            })}
                            min={1}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingPromotion.type === 'points_multiplier' && (
                    <div className="p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Points Multiplier Settings
                      </h4>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Multiplier Value</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editingPromotion.points_multiplier || 2}
                          onChange={(e) => setEditingPromotion({ 
                            ...editingPromotion, 
                            points_multiplier: parseFloat(e.target.value) || 2 
                          })}
                          placeholder="2.0"
                        />
                        <div className="text-xs text-gray-600 mt-1">
                          Customers will earn {editingPromotion.points_multiplier || 2}x points during this promotion
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date *</label>
                      <Input
                        type="datetime-local"
                        value={editingPromotion.start_date.toISOString().slice(0, 16)}
                        onChange={(e) => setEditingPromotion({ 
                          ...editingPromotion, 
                          start_date: new Date(e.target.value) 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date *</label>
                      <Input
                        type="datetime-local"
                        value={editingPromotion.end_date.toISOString().slice(0, 16)}
                        onChange={(e) => setEditingPromotion({ 
                          ...editingPromotion, 
                          end_date: new Date(e.target.value) 
                        })}
                      />
                    </div>
                  </div>

                  {/* Scope */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Scope</label>
                    <select
                      value={editingPromotion.scope}
                      onChange={(e) => setEditingPromotion({ 
                        ...editingPromotion, 
                        scope: e.target.value as any,
                        branch_ids: e.target.value === 'branch' && selectedBranchId !== 'all' 
                          ? [selectedBranchId] 
                          : []
                      })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                    >
                      <option value="global">🌍 Global (All Branches)</option>
                      <option value="branch">🏢 Specific Branches</option>
                      <option value="region">📍 Specific Regions</option>
                    </select>
                  </div>

                  {/* Branch Selection */}
                  {editingPromotion.scope === 'branch' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Select Branches</label>
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingPromotion.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingPromotion.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingPromotion({
                                  ...editingPromotion,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage Limits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Total Usage Limit</label>
                      <Input
                        type="number"
                        value={editingPromotion.usage_limit || ''}
                        onChange={(e) => setEditingPromotion({ 
                          ...editingPromotion, 
                          usage_limit: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Per Customer Limit</label>
                      <Input
                        type="number"
                        value={editingPromotion.per_customer_limit || ''}
                        onChange={(e) => setEditingPromotion({ 
                          ...editingPromotion, 
                          per_customer_limit: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  {/* Applicable To */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Applicable To</label>
                    <select
                      value={editingPromotion.applicable_to}
                      onChange={(e) => setEditingPromotion({ 
                        ...editingPromotion, 
                        applicable_to: e.target.value as any 
                      })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                    >
                      <option value="all">All Items</option>
                      <option value="specific_items">Specific Items</option>
                      <option value="specific_categories">Specific Categories</option>
                    </select>
                  </div>

                  {/* Terms & Conditions */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Terms & Conditions</label>
                    <textarea
                      value={editingPromotion.terms_conditions || ''}
                      onChange={(e) => setEditingPromotion({ 
                        ...editingPromotion, 
                        terms_conditions: e.target.value 
                      })}
                      placeholder="Enter terms and conditions..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = promotions.find(p => p.id === editingPromotion.id);
                        if (existing) {
                          // Update
                          const updated = promotions.map(p => 
                            p.id === editingPromotion.id 
                              ? { ...editingPromotion, updated_at: new Date() }
                              : p
                          );
                          savePromotions(updated);
                        } else {
                          // Create
                          savePromotions([...promotions, editingPromotion]);
                        }
                        setShowCreateModal(false);
                        setEditingPromotion(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Promotion
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingPromotion(null);
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
    </div>
  );
}
