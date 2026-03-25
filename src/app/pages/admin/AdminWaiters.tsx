import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Plus, Edit2, Trash2, Users, Building2, Search, X,
  Save, Clock, Star, Phone, Mail, Key, Calendar, Eye,
  CheckCircle, XCircle, TrendingUp, Award, Target, Shield,
  Coffee, UtensilsCrossed, AlertCircle, BarChart3
} from 'lucide-react';

// Types
export interface Waiter {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch_id: string;
  branch_name: string;
  pin_code: string;
  status: 'active' | 'inactive' | 'on_break';
  avatar_url?: string;
  shift_schedule?: string[];
  performance: {
    total_orders: number;
    avg_rating: number;
    total_sales: number;
    customer_satisfaction: number;
  };
  created_at: Date;
  last_login?: Date;
}

export interface WaiterRating {
  id: string;
  waiter_id: string;
  waiter_name: string;
  customer_name?: string;
  order_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

export function AdminWaiters() {
  const navigate = useNavigate();
  const { branches } = useApp();
  
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [ratings, setRatings] = useState<WaiterRating[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<Waiter | null>(null);
  const [selectedWaiterForRatings, setSelectedWaiterForRatings] = useState<Waiter | null>(null);
  const [activeTab, setActiveTab] = useState<'waiters' | 'ratings'>('waiters');

  useEffect(() => {
    loadWaiters();
    loadRatings();
  }, []);

  const loadWaiters = () => {
    const saved = localStorage.getItem('echefs_waiters');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((w: any) => ({
        ...w,
        created_at: new Date(w.created_at),
        last_login: w.last_login ? new Date(w.last_login) : undefined,
      }));
      setWaiters(withDates);
    } else {
      // Default waiters
      const defaultWaiters: Waiter[] = branches.slice(0, 2).map((branch, idx) => ({
        id: `waiter-${idx + 1}`,
        name: idx === 0 ? 'Ahmed Hassan' : 'Maria Garcia',
        email: idx === 0 ? 'ahmed@echefs.com' : 'maria@echefs.com',
        phone: idx === 0 ? '+996 555 100 001' : '+996 555 100 002',
        branch_id: branch.id,
        branch_name: branch.translations.en.name,
        pin_code: `${1000 + idx * 111}`,
        status: 'active',
        performance: {
          total_orders: 145 + idx * 20,
          avg_rating: 4.7 + idx * 0.2,
          total_sales: 15000 + idx * 3000,
          customer_satisfaction: 92 + idx * 3,
        },
        created_at: new Date('2026-01-15'),
        last_login: new Date(),
      }));
      setWaiters(defaultWaiters);
      localStorage.setItem('echefs_waiters', JSON.stringify(defaultWaiters));
    }
  };

  const loadRatings = () => {
    const saved = localStorage.getItem('echefs_waiter_ratings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const withDates = parsed.map((r: any) => ({
        ...r,
        created_at: new Date(r.created_at),
      }));
      setRatings(withDates);
    } else {
      setRatings([]);
    }
  };

  const saveWaiters = (updatedWaiters: Waiter[]) => {
    setWaiters(updatedWaiters);
    localStorage.setItem('echefs_waiters', JSON.stringify(updatedWaiters));
  };

  const saveRatings = (updatedRatings: WaiterRating[]) => {
    setRatings(updatedRatings);
    localStorage.setItem('echefs_waiter_ratings', JSON.stringify(updatedRatings));
  };

  const handleSaveWaiter = (waiter: Partial<Waiter>) => {
    if (editingWaiter) {
      // Update
      const updated = waiters.map(w =>
        w.id === editingWaiter.id ? { ...w, ...waiter } : w
      );
      saveWaiters(updated);
    } else {
      // Create
      const branch = branches.find(b => b.id === waiter.branch_id);
      const newWaiter: Waiter = {
        id: `waiter-${Date.now()}`,
        name: waiter.name || '',
        email: waiter.email || '',
        phone: waiter.phone || '',
        branch_id: waiter.branch_id || branches[0]?.id || '',
        branch_name: branch?.translations.en.name || '',
        pin_code: waiter.pin_code || Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'active',
        performance: {
          total_orders: 0,
          avg_rating: 0,
          total_sales: 0,
          customer_satisfaction: 0,
        },
        created_at: new Date(),
      };
      saveWaiters([...waiters, newWaiter]);
    }
    setShowWaiterModal(false);
    setEditingWaiter(null);
  };

  const handleDeleteWaiter = (id: string) => {
    if (confirm('Are you sure you want to delete this waiter?')) {
      saveWaiters(waiters.filter(w => w.id !== id));
      // Also delete ratings
      saveRatings(ratings.filter(r => r.waiter_id !== id));
    }
  };

  // Filter waiters
  const filteredWaiters = waiters.filter(waiter => {
    const matchesBranch = selectedBranch === 'all' || waiter.branch_id === selectedBranch;
    const matchesSearch = waiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          waiter.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Get ratings for waiter
  const getWaiterRatings = (waiterId: string) => {
    return ratings.filter(r => r.waiter_id === waiterId);
  };

  // Calculate stats
  const stats = {
    totalWaiters: waiters.length,
    activeWaiters: waiters.filter(w => w.status === 'active').length,
    avgRating: waiters.length > 0
      ? (waiters.reduce((sum, w) => sum + w.performance.avg_rating, 0) / waiters.length).toFixed(1)
      : '0.0',
    totalOrders: waiters.reduce((sum, w) => sum + w.performance.total_orders, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1F2933] mb-2">Waiter Management</h1>
            <p className="text-[#6B7280]">Manage waiters and track their performance</p>
          </div>
          <Button
            onClick={() => {
              setEditingWaiter(null);
              setShowWaiterModal(true);
            }}
            className="bg-[#667c67] hover:bg-[#546352] text-white h-12 px-6 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Waiter
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Total Waiters</span>
              <Users className="w-5 h-5 text-[#667c67]" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">{stats.totalWaiters}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Active Now</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.activeWaiters}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Avg Rating</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">{stats.avgRating}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Total Orders</span>
              <UtensilsCrossed className="w-5 h-5 text-[#667c67]" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">{stats.totalOrders}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1 inline-flex shadow-sm">
          <button
            onClick={() => setActiveTab('waiters')}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'waiters'
                ? 'bg-[#667c67] text-white shadow-md'
                : 'text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            <Users className="w-4 h-4" />
            Waiters
            <Badge className={activeTab === 'waiters' ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}>
              {waiters.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'ratings'
                ? 'bg-[#667c67] text-white shadow-md'
                : 'text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            <Star className="w-4 h-4" />
            Ratings
            <Badge className={activeTab === 'ratings' ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}>
              {ratings.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <Input
              placeholder="Search waiters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-[#F9FAFB] border-0 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2933]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-12 px-4 bg-[#F9FAFB] border-0 rounded-xl font-semibold text-[#1F2933] focus:ring-2 focus:ring-[#667c67]/20"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.translations.en.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'waiters' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWaiters.map((waiter, index) => (
            <motion.div
              key={waiter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#667c67] to-[#546352] p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                        {waiter.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{waiter.name}</h3>
                        <p className="text-sm text-white/80">{waiter.branch_name}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        waiter.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : waiter.status === 'on_break'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-500 text-white'
                      }
                    >
                      {waiter.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{waiter.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{waiter.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <div className="text-2xl font-bold text-[#1F2933]">
                          {waiter.performance.avg_rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Rating</div>
                    </div>
                    
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-2xl font-bold text-[#667c67]">
                        {waiter.performance.total_orders}
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Orders</div>
                    </div>
                    
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-2xl font-bold text-[#667c67]">
                        ${waiter.performance.total_sales.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Sales</div>
                    </div>
                    
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-2xl font-bold text-[#667c67]">
                        {waiter.performance.customer_satisfaction}%
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-medium">Satisfaction</div>
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-700 font-semibold uppercase">PIN Code</span>
                      <div className="font-mono font-bold text-2xl text-purple-700">
                        {waiter.pin_code}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedWaiterForRatings(waiter);
                        setShowRatingsModal(true);
                      }}
                      className="flex-1 py-2.5 px-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#667c67] rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Ratings ({getWaiterRatings(waiter.id).length})
                    </button>
                    <button
                      onClick={() => {
                        setEditingWaiter(waiter);
                        setShowWaiterModal(true);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWaiter(waiter.id)}
                      className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredWaiters.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Users className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">No waiters found</h3>
              <p className="text-[#6B7280]">Add your first waiter to get started</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#1F2933] mb-6">All Ratings</h2>
          {ratings.length === 0 ? (
            <div className="py-16 text-center">
              <Star className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1F2933] mb-2">No ratings yet</h3>
              <p className="text-[#6B7280]">Customer ratings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="p-4 bg-[#F9FAFB] rounded-xl flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-bold text-[#1F2933]">{rating.waiter_name}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {rating.rating}/5
                      </Badge>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-[#6B7280] mb-2">"{rating.comment}"</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span>Order: {rating.order_id}</span>
                      {rating.customer_name && <span>Customer: {rating.customer_name}</span>}
                      <span>{rating.created_at.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Waiter Modal */}
      <WaiterModal
        open={showWaiterModal}
        onClose={() => {
          setShowWaiterModal(false);
          setEditingWaiter(null);
        }}
        onSave={handleSaveWaiter}
        waiter={editingWaiter}
        branches={branches}
      />

      {/* Ratings Modal */}
      <RatingsModal
        open={showRatingsModal}
        onClose={() => {
          setShowRatingsModal(false);
          setSelectedWaiterForRatings(null);
        }}
        waiter={selectedWaiterForRatings}
        ratings={getWaiterRatings(selectedWaiterForRatings?.id || '')}
      />
    </div>
  );
}

// Waiter Modal Component
function WaiterModal({
  open,
  onClose,
  onSave,
  waiter,
  branches,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (waiter: Partial<Waiter>) => void;
  waiter: Waiter | null;
  branches: any[];
}) {
  const [formData, setFormData] = useState<Partial<Waiter>>({});

  useEffect(() => {
    if (waiter) {
      setFormData(waiter);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        branch_id: branches[0]?.id || '',
        pin_code: Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'active',
      });
    }
  }, [waiter, branches]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {waiter ? 'Edit Waiter' : 'Add Waiter'}
          </DialogTitle>
          <DialogDescription>
            {waiter ? 'Update waiter information' : 'Create a new waiter account'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Full Name
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Phone
              </label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+996 555 123 456"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                PIN Code (4 digits)
              </label>
              <Input
                value={formData.pin_code || ''}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                placeholder="1234"
                maxLength={4}
                className="h-12 font-mono font-bold text-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2933] mb-2">
              Branch
            </label>
            <select
              value={formData.branch_id || ''}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.translations.en.name}
                </option>
              ))}
            </select>
          </div>

          {waiter && (
            <div>
              <label className="block text-sm font-semibold text-[#1F2933] mb-2">
                Status
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-12 px-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#667c67]/20"
              >
                <option value="active">Active</option>
                <option value="on_break">On Break</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(formData)}
              className="flex-1 h-12 bg-[#667c67] hover:bg-[#546352] text-white"
              disabled={!formData.name || !formData.email || !formData.branch_id}
            >
              <Save className="w-4 h-4 mr-2" />
              {waiter ? 'Update' : 'Create'} Waiter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Ratings Modal Component
function RatingsModal({
  open,
  onClose,
  waiter,
  ratings,
}: {
  open: boolean;
  onClose: () => void;
  waiter: Waiter | null;
  ratings: WaiterRating[];
}) {
  if (!waiter) return null;

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            Ratings for {waiter.name}
          </DialogTitle>
          <DialogDescription>
            Average Rating: {avgRating} / 5.0 ({ratings.length} rating{ratings.length !== 1 ? 's' : ''})
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[500px] overflow-y-auto">
          {ratings.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#6B7280]">No ratings yet for this waiter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map(rating => (
                <div key={rating.id} className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < rating.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#9CA3AF]">
                      {rating.created_at.toLocaleString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-[#6B7280] mb-2">"{rating.comment}"</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                    <span>Order: {rating.order_id}</span>
                    {rating.customer_name && <span>Customer: {rating.customer_name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
