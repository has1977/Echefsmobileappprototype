import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Star, CheckCircle, XCircle, MessageSquare, User, Calendar,
  Package, UtensilsCrossed, Truck, ShoppingBag, Eye, Phone,
  Search, Filter, ArrowLeft, ThumbsUp, ThumbsDown, Sparkles, 
  Clock, TrendingUp, Award, Mail, Trash2, AlertCircle
} from 'lucide-react';
import { GlassCard, motion, AnimatePresence } from '../../design-system';

interface RatingData {
  orderId: string;
  rating: number;
  comment: string;
  serviceRating?: number;
  deliveryRating?: number;
  timestamp?: string;
  approved?: boolean;
  customerName?: string;
}

interface ItemRatingData {
  itemId: string;
  orderId: string;
  rating: number;
  comment: string;
  timestamp?: string;
  approved?: boolean;
  customerName?: string;
  tasteRating?: number;
  presentationRating?: number;
}

interface SupportMessage {
  id: string;
  orderId: string;
  branchId: string;
  branchName: string;
  subject: string;
  message: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  timestamp: string;
  status: 'new' | 'replied' | 'resolved';
  orderType: string;
  orderTotal: number;
}

export function AdminRatings() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { selectedBranch, branches } = useApp();

  const [orderRatings, setOrderRatings] = useState<Record<string, RatingData>>({});
  const [itemRatings, setItemRatings] = useState<Record<string, ItemRatingData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedRating, setSelectedRating] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [branchPhone, setBranchPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  useEffect(() => {
    loadRatings();
    loadBranchPhone();
  }, []);

  const loadRatings = () => {
    const savedOrderRatings = localStorage.getItem('echefs_order_ratings');
    if (savedOrderRatings) {
      setOrderRatings(JSON.parse(savedOrderRatings));
    }

    const savedItemRatings = localStorage.getItem('echefs_item_ratings');
    if (savedItemRatings) {
      setItemRatings(JSON.parse(savedItemRatings));
    }
  };

  const loadBranchPhone = () => {
    const phones = localStorage.getItem('echefs_branch_support_phones');
    if (phones && selectedBranch) {
      const phonesData = JSON.parse(phones);
      setBranchPhone(phonesData[selectedBranch.id] || '');
    }
  };

  const saveBranchPhone = () => {
    if (!selectedBranch) return;
    
    const phones = localStorage.getItem('echefs_branch_support_phones');
    const phonesData = phones ? JSON.parse(phones) : {};
    phonesData[selectedBranch.id] = branchPhone;
    localStorage.setItem('echefs_branch_support_phones', JSON.stringify(phonesData));
    setIsEditingPhone(false);
    alert('✅ Support phone number updated!');
  };

  const approveOrderRating = (ratingKey: string) => {
    const updatedRatings = {
      ...orderRatings,
      [ratingKey]: {
        ...orderRatings[ratingKey],
        approved: true,
      },
    };
    setOrderRatings(updatedRatings);
    localStorage.setItem('echefs_order_ratings', JSON.stringify(updatedRatings));
    alert('✅ Rating approved!');
  };

  const rejectOrderRating = (ratingKey: string) => {
    const updatedRatings = { ...orderRatings };
    delete updatedRatings[ratingKey];
    setOrderRatings(updatedRatings);
    localStorage.setItem('echefs_order_ratings', JSON.stringify(updatedRatings));
    alert('❌ Rating rejected!');
  };

  const approveItemRating = (ratingKey: string) => {
    const updatedRatings = {
      ...itemRatings,
      [ratingKey]: {
        ...itemRatings[ratingKey],
        approved: true,
      },
    };
    setItemRatings(updatedRatings);
    localStorage.setItem('echefs_item_ratings', JSON.stringify(updatedRatings));
    alert('✅ Rating approved!');
  };

  const rejectItemRating = (ratingKey: string) => {
    const updatedRatings = { ...itemRatings };
    delete updatedRatings[ratingKey];
    setItemRatings(updatedRatings);
    localStorage.setItem('echefs_item_ratings', JSON.stringify(updatedRatings));
    alert('❌ Rating rejected!');
  };

  const allOrderRatings = Object.entries(orderRatings).map(([key, data]) => ({
    key,
    type: 'order',
    ...data,
  }));

  const allItemRatings = Object.entries(itemRatings).map(([key, data]) => ({
    key,
    type: 'item',
    ...data,
  }));

  const allRatings = [...allOrderRatings, ...allItemRatings]
    .filter(rating => {
      if (filterType === 'approved') return rating.approved;
      if (filterType === 'pending') return !rating.approved;
      return true;
    })
    .filter(rating => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        rating.customerName?.toLowerCase().includes(query) ||
        rating.comment?.toLowerCase().includes(query) ||
        rating.orderId?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return bTime - aTime;
    });

  const stats = {
    total: allRatings.length,
    approved: allRatings.filter(r => r.approved).length,
    pending: allRatings.filter(r => !r.approved).length,
    avgRating: allRatings.length > 0 
      ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg">
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Ratings Management</h1>
                <p className="text-sm text-white/80">Review and manage customer feedback</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Approved</div>
              <div className="text-xl font-bold">{stats.approved}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Pending</div>
              <div className="text-xl font-bold">{stats.pending}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
            >
              <div className="text-white/70 text-xs mb-1">Avg Rating</div>
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {stats.avgRating}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Search and Filters */}
        <GlassCard variant="elevated" className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, order ID, or comment..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'approved', 'pending'].map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterType === type
                    ? 'bg-[#667c67] text-white shadow-md'
                    : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Ratings List */}
        <div className="space-y-3">
          {allRatings.length === 0 ? (
            <GlassCard variant="default" className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto text-[#9CA3AF] mb-4" />
              <h3 className="text-lg font-bold text-[#374151] mb-2">No ratings found</h3>
              <p className="text-sm text-[#6B7280]">
                {filterType !== 'all' ? 'Try changing your filter' : 'Ratings will appear here'}
              </p>
            </GlassCard>
          ) : (
            allRatings.map((rating) => (
              <motion.div
                key={rating.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard variant="default" className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rating.type === 'order'
                        ? 'bg-blue-100'
                        : 'bg-orange-100'
                    }`}>
                      {rating.type === 'order' ? (
                        <Package className="w-6 h-6 text-blue-600" />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-base font-bold text-[#1F2933]">
                            {rating.type === 'order' ? 'Order Rating' : 'Item Rating'}
                          </h4>
                          <p className="text-sm text-[#6B7280]">
                            {rating.customerName || 'Guest'} • {rating.timestamp ? new Date(rating.timestamp).toLocaleDateString() : 'Date unknown'}
                          </p>
                        </div>
                        {rating.approved ? (
                          <Badge className="bg-green-500 text-white">Approved</Badge>
                        ) : (
                          <Badge className="bg-yellow-500 text-white">Pending</Badge>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-sm font-semibold text-[#6B7280] mr-2">Overall:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-bold text-[#1F2933] ml-1">{rating.rating}/5</span>
                      </div>

                      {/* Additional Ratings */}
                      {rating.type === 'order' && (
                        <div className="flex gap-4 mb-3 text-xs">
                          {rating.serviceRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#6B7280]">Service:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rating.serviceRating!
                                        ? 'fill-blue-500 text-blue-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {rating.deliveryRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#6B7280]">Delivery:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rating.deliveryRating!
                                        ? 'fill-green-500 text-green-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {rating.type === 'item' && (
                        <div className="flex gap-4 mb-3 text-xs">
                          {rating.tasteRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#6B7280]">Taste:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rating.tasteRating!
                                        ? 'fill-orange-500 text-orange-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {rating.presentationRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#6B7280]">Presentation:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rating.presentationRating!
                                        ? 'fill-purple-500 text-purple-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Comment */}
                      {rating.comment && (
                        <div className="bg-[#F9FAFB] rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[#374151] italic">"{rating.comment}"</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {!rating.approved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              if (rating.type === 'order') {
                                approveOrderRating(rating.key);
                              } else {
                                approveItemRating(rating.key);
                              }
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => {
                              if (rating.type === 'order') {
                                rejectOrderRating(rating.key);
                              } else {
                                rejectItemRating(rating.key);
                              }
                            }}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
