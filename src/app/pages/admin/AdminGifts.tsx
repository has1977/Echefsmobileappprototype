import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../../design-system';
import {
  Gift, ChevronLeft, Plus, Search, Package, Edit2, Trash2,
  TrendingUp, Award, DollarSign, Calendar, Eye, Save, X,
  Upload, Image as ImageIcon, Star, ShoppingBag, Ticket,
  Sparkles, Crown, Heart, Coffee, Utensils, Percent, Copy,
  AlertCircle, CheckCircle, XCircle, BarChart3, Download,
  Info, Settings, Building2
} from 'lucide-react';

// Types
interface LoyaltyGift {
  id: string;
  name: string;
  description: string;
  category: 'voucher' | 'product' | 'experience' | 'discount' | 'service';
  points_required: number;
  value: number;
  stock_quantity?: number;
  unlimited_stock: boolean;
  claimed_count: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image_url?: string;
  terms_conditions?: string;
  expiry_days?: number;
  priority: number;
  branch_specific: boolean;
  branch_ids?: string[];
  tier_exclusive?: string[];
  created_at: Date;
  updated_at: Date;
}

export function AdminGifts() {
  const navigate = useNavigate();
  const { branches } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGift, setEditingGift] = useState<LoyaltyGift | null>(null);
  const [gifts, setGifts] = useState<LoyaltyGift[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = () => {
    const saved = localStorage.getItem('echefs_loyalty_gifts');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((g: any) => ({
        ...g,
        created_at: new Date(g.created_at),
        updated_at: new Date(g.updated_at),
      }));
      setGifts(withDates);
    } else {
      // Default gifts
      const defaultGifts: LoyaltyGift[] = [
        {
          id: 'gift-1',
          name: 'Free Coffee',
          description: 'Enjoy a complimentary coffee of your choice',
          category: 'product',
          points_required: 100,
          value: 5,
          unlimited_stock: true,
          claimed_count: 156,
          status: 'active',
          expiry_days: 30,
          priority: 1,
          branch_specific: false,
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-01'),
        },
        {
          id: 'gift-2',
          name: '$10 Voucher',
          description: 'Redeem $10 off your next purchase',
          category: 'voucher',
          points_required: 500,
          value: 10,
          unlimited_stock: true,
          claimed_count: 89,
          status: 'active',
          expiry_days: 60,
          priority: 2,
          branch_specific: false,
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-01'),
        },
        {
          id: 'gift-3',
          name: 'Free Dessert',
          description: 'Get any dessert from our menu for free',
          category: 'product',
          points_required: 200,
          value: 8,
          stock_quantity: 50,
          unlimited_stock: false,
          claimed_count: 34,
          status: 'active',
          expiry_days: 30,
          priority: 3,
          branch_specific: false,
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-01'),
        },
        {
          id: 'gift-4',
          name: 'VIP Experience',
          description: 'Priority seating and complimentary appetizer',
          category: 'experience',
          points_required: 1000,
          value: 25,
          unlimited_stock: true,
          claimed_count: 12,
          status: 'active',
          tier_exclusive: ['gold', 'platinum'],
          expiry_days: 90,
          priority: 4,
          branch_specific: false,
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-01'),
        },
      ];
      setGifts(defaultGifts);
      localStorage.setItem('echefs_loyalty_gifts', JSON.stringify(defaultGifts));
    }
  };

  const saveGifts = (updatedGifts: LoyaltyGift[]) => {
    setGifts(updatedGifts);
    localStorage.setItem('echefs_loyalty_gifts', JSON.stringify(updatedGifts));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        if (editingGift) {
          setEditingGift({
            ...editingGift,
            image_url: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter by branch first
  const giftsByBranch = selectedBranchId === 'all'
    ? gifts
    : gifts.filter(gift => {
        if (!gift.branch_specific) return true; // Global gifts
        if (gift.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredGifts = giftsByBranch.filter((gift) => {
    const matchesSearch = 
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || gift.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: giftsByBranch.length,
    active: giftsByBranch.filter(g => g.status === 'active').length,
    totalClaimed: giftsByBranch.reduce((sum, g) => sum + g.claimed_count, 0),
    totalValue: giftsByBranch.reduce((sum, g) => sum + (g.value * g.claimed_count), 0),
    totalPointsRedeemed: giftsByBranch.reduce((sum, g) => sum + (g.points_required * g.claimed_count), 0),
  };

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  const getCategoryIcon = (category: LoyaltyGift['category']) => {
    const icons = {
      voucher: Ticket,
      product: Package,
      experience: Sparkles,
      discount: Percent,
      service: Award,
    };
    return icons[category];
  };

  const getCategoryColor = (category: LoyaltyGift['category']) => {
    const colors = {
      voucher: '#3b82f6',
      product: '#10b981',
      experience: '#8b5cf6',
      discount: '#f59e0b',
      service: '#ec4899',
    };
    return colors[category];
  };

  const getStatusBadge = (gift: LoyaltyGift) => {
    if (gift.status === 'active') {
      if (!gift.unlimited_stock && gift.stock_quantity !== undefined && gift.stock_quantity <= 0) {
        return <Badge className="bg-red-100 text-red-700 border-red-200">Out of Stock</Badge>;
      }
      return <Badge className="bg-green-100 text-green-700 border-green-200">● Active</Badge>;
    } else if (gift.status === 'out_of_stock') {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Out of Stock</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">⊗ Inactive</Badge>;
    }
  };

  const createNewGift = (): LoyaltyGift => ({
    id: `gift-${Date.now()}`,
    name: '',
    description: '',
    category: 'product',
    points_required: 100,
    value: 5,
    unlimited_stock: true,
    claimed_count: 0,
    status: 'active',
    expiry_days: 30,
    priority: 1,
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const duplicateGift = (gift: LoyaltyGift) => {
    const duplicated: LoyaltyGift = {
      ...gift,
      id: `gift-${Date.now()}`,
      name: `${gift.name} (Copy)`,
      claimed_count: 0,
      status: 'inactive',
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveGifts([...gifts, duplicated]);
  };

  const deleteGift = (id: string) => {
    if (confirm('Are you sure you want to delete this gift?')) {
      saveGifts(gifts.filter(g => g.id !== id));
    }
  };

  const toggleGiftStatus = (id: string) => {
    const updated = gifts.map(g => 
      g.id === id 
        ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' as any, updated_at: new Date() }
        : g
    );
    saveGifts(updated);
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
                  <Gift className="w-7 h-7" />
                  Loyalty Gifts Catalog
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Manage rewards that customers can redeem with points
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
                    gifts: giftsByBranch,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `loyalty-gifts-${selectedBranch?.name || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
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
                  const newGift = createNewGift();
                  // Auto-assign to selected branch if not 'all'
                  if (selectedBranchId !== 'all') {
                    newGift.branch_specific = true;
                    newGift.branch_ids = [selectedBranchId];
                  }
                  setEditingGift(newGift);
                  setUploadedImage(null);
                  setShowCreateModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Gift
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Gifts', value: stats.total, icon: Gift, color: 'bg-white/10' },
              { label: 'Active', value: stats.active, icon: CheckCircle, color: 'bg-green-500/20' },
              { label: 'Total Claimed', value: stats.totalClaimed, icon: TrendingUp, color: 'bg-blue-500/20' },
              { label: 'Total Value', value: `$${stats.totalValue.toFixed(0)}`, icon: DollarSign, color: 'bg-yellow-500/20' },
              { label: 'Points Redeemed', value: stats.totalPointsRedeemed.toLocaleString(), icon: Award, color: 'bg-purple-500/20' },
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
                  Showing gifts for this branch (including global gifts)
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Filters */}
        <GlassCard variant="elevated" className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
            >
              <option value="all">All Categories</option>
              <option value="voucher">🎫 Voucher</option>
              <option value="product">📦 Product</option>
              <option value="experience">✨ Experience</option>
              <option value="discount">💰 Discount</option>
              <option value="service">🏆 Service</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">● Active</option>
              <option value="inactive">⊗ Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </GlassCard>

        {/* Gifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.length === 0 ? (
            <div className="col-span-full">
              <GlassCard variant="default" className="p-12 text-center">
                <Gift className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">No gifts found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first gift to get started'}
                </p>
                {!searchQuery && filterCategory === 'all' && filterStatus === 'all' && (
                  <Button
                    onClick={() => {
                      setEditingGift(createNewGift());
                      setUploadedImage(null);
                      setShowCreateModal(true);
                    }}
                    className="bg-[#667c67] hover:bg-[#526250]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Gift
                  </Button>
                )}
              </GlassCard>
            </div>
          ) : (
            filteredGifts.map((gift, index) => {
              const Icon = getCategoryIcon(gift.category);
              const categoryColor = getCategoryColor(gift.category);
              const stockPercentage = gift.unlimited_stock 
                ? 100 
                : gift.stock_quantity 
                  ? ((gift.stock_quantity - gift.claimed_count) / gift.stock_quantity) * 100
                  : 0;

              return (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    variant="elevated" 
                    className="p-6 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col"
                  >
                    {/* Image */}
                    <div 
                      className="w-full h-48 rounded-xl mb-4 overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: `${categoryColor}20` }}
                    >
                      {gift.image_url ? (
                        <img 
                          src={gift.image_url} 
                          alt={gift.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-20 h-20" style={{ color: categoryColor }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {gift.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {gift.description}
                          </p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(gift)}
                        {gift.tier_exclusive && gift.tier_exclusive.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP Only
                          </Badge>
                        )}
                        {gift.branch_specific && (
                          <Badge variant="outline" className="text-xs">
                            Branch Specific
                          </Badge>
                        )}
                      </div>

                      {/* Points & Value */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div 
                          className="rounded-xl p-3 text-center"
                          style={{ backgroundColor: `${categoryColor}20` }}
                        >
                          <div className="text-xs text-gray-600 mb-1">Points Required</div>
                          <div className="text-2xl font-bold" style={{ color: categoryColor }}>
                            {gift.points_required}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                          <div className="text-xs text-gray-600 mb-1">Value</div>
                          <div className="text-2xl font-bold text-green-600">
                            ${gift.value}
                          </div>
                        </div>
                      </div>

                      {/* Stock Status */}
                      {!gift.unlimited_stock && gift.stock_quantity !== undefined && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Stock</span>
                            <span>
                              {Math.max(0, gift.stock_quantity - gift.claimed_count)} / {gift.stock_quantity}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stockPercentage}%` }}
                              className="h-full"
                              style={{ 
                                backgroundColor: stockPercentage > 20 ? categoryColor : '#ef4444'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-gray-600">Claimed</div>
                          <div className="font-bold text-gray-900">{gift.claimed_count}</div>
                        </div>
                        {gift.expiry_days && (
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="text-gray-600">Expires In</div>
                            <div className="font-bold text-gray-900">{gift.expiry_days}d</div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGift(gift);
                            setUploadedImage(gift.image_url || null);
                            setShowCreateModal(true);
                          }}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateGift(gift)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleGiftStatus(gift.id)}
                          className={gift.status === 'active' ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}
                        >
                          {gift.status === 'active' ? (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => deleteGift(gift.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
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
        {showCreateModal && editingGift && (
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
              className="w-full max-w-3xl my-8"
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {gifts.find(g => g.id === editingGift.id) ? 'Edit' : 'Create'} Loyalty Gift
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
                    <label className="block text-sm font-semibold mb-2">Gift Image</label>
                    <div className="flex gap-4">
                      <div 
                        className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#667c67] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage || editingGift.image_url ? (
                          <img 
                            src={uploadedImage || editingGift.image_url} 
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
                          Upload an attractive image for this gift (recommended size: 600x600px)
                        </div>
                        {(uploadedImage || editingGift.image_url) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUploadedImage(null);
                              setEditingGift({ ...editingGift, image_url: undefined });
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
                      <label className="block text-sm font-semibold mb-2">Gift Name *</label>
                      <Input
                        value={editingGift.name}
                        onChange={(e) => setEditingGift({ ...editingGift, name: e.target.value })}
                        placeholder="e.g., Free Coffee"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Description *</label>
                      <textarea
                        value={editingGift.description}
                        onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                        placeholder="Describe what the customer gets..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category *</label>
                      <select
                        value={editingGift.category}
                        onChange={(e) => setEditingGift({ ...editingGift, category: e.target.value as any })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        <option value="voucher">🎫 Voucher</option>
                        <option value="product">📦 Product</option>
                        <option value="experience">✨ Experience</option>
                        <option value="discount">💰 Discount</option>
                        <option value="service">🏆 Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Priority</label>
                      <Input
                        type="number"
                        value={editingGift.priority}
                        onChange={(e) => setEditingGift({ ...editingGift, priority: parseInt(e.target.value) || 1 })}
                        min={1}
                      />
                    </div>
                  </div>

                  {/* Points & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Points Required *</label>
                      <Input
                        type="number"
                        value={editingGift.points_required}
                        onChange={(e) => setEditingGift({ ...editingGift, points_required: parseInt(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Monetary Value ($) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingGift.value}
                        onChange={(e) => setEditingGift({ ...editingGift, value: parseFloat(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Stock Management */}
                  <div>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={editingGift.unlimited_stock}
                        onChange={(e) => setEditingGift({ 
                          ...editingGift, 
                          unlimited_stock: e.target.checked,
                          stock_quantity: e.target.checked ? undefined : 100
                        })}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <div>
                        <span className="font-medium">Unlimited Stock</span>
                        <p className="text-sm text-gray-600">This gift is always available</p>
                      </div>
                    </label>
                  </div>

                  {!editingGift.unlimited_stock && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
                      <Input
                        type="number"
                        value={editingGift.stock_quantity || 0}
                        onChange={(e) => setEditingGift({ 
                          ...editingGift, 
                          stock_quantity: parseInt(e.target.value) || 0 
                        })}
                        min={0}
                      />
                    </div>
                  )}

                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Expires After (days)</label>
                    <Input
                      type="number"
                      value={editingGift.expiry_days || ''}
                      onChange={(e) => setEditingGift({ 
                        ...editingGift, 
                        expiry_days: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      placeholder="Leave empty for no expiry"
                      min={1}
                    />
                  </div>

                  {/* Branch Specific */}
                  <div>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={editingGift.branch_specific}
                        onChange={(e) => setEditingGift({ 
                          ...editingGift, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked && selectedBranchId !== 'all' 
                            ? [selectedBranchId] 
                            : []
                        })}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <div>
                        <span className="font-medium">Branch Specific</span>
                        <p className="text-sm text-gray-600">Can only be redeemed at specific branches</p>
                      </div>
                    </label>
                  </div>

                  {/* Branch Selection */}
                  {editingGift.branch_specific && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Select Branches</label>
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingGift.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingGift.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingGift({
                                  ...editingGift,
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

                  {/* Terms & Conditions */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Terms & Conditions</label>
                    <textarea
                      value={editingGift.terms_conditions || ''}
                      onChange={(e) => setEditingGift({ 
                        ...editingGift, 
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
                        const existing = gifts.find(g => g.id === editingGift.id);
                        if (existing) {
                          // Update
                          const updated = gifts.map(g => 
                            g.id === editingGift.id 
                              ? { ...editingGift, updated_at: new Date() }
                              : g
                          );
                          saveGifts(updated);
                        } else {
                          // Create
                          saveGifts([...gifts, editingGift]);
                        }
                        setShowCreateModal(false);
                        setEditingGift(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Gift
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingGift(null);
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
