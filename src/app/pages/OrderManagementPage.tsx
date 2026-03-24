import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { Order } from '../lib/types';
import { 
  Package, Home, RefreshCw, Eye, UtensilsCrossed, Truck, ShoppingBag,
  TrendingUp, Clock, CheckCircle, AlertCircle, ChevronRight, 
  Search, Calendar, Package2, Star,
  Repeat, MessageCircle, X, Send, Phone, Mail, Image as ImageIcon,
  ShoppingCart, Sparkles, ChevronLeft, Plus, Minus, Receipt,
  ArrowLeft, MapPin, Users, Timer
} from 'lucide-react';
import { GlassCard, motion, AnimatePresence } from '../design-system';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RatingData {
  orderId: string;
  rating: number;
  comment: string;
  serviceRating?: number; // Rating for service quality
  deliveryRating?: number; // Rating for delivery/takeaway
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
  tasteRating?: number; // How delicious was it
  presentationRating?: number; // How it looked
}

export function OrderManagementPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { selectedBranch, branches, addToCart } = useApp();
  const { user } = useAuth();

  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Order['type']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  
  // Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  
  // Modals
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showItemRatingModal, setShowItemRatingModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);
  const [selectedItemForRating, setSelectedItemForRating] = useState<{ item: any; order: Order } | null>(null);
  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<Order | null>(null);
  
  // Rating State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [serviceRating, setServiceRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [presentationRating, setPresentationRating] = useState(0);
  const [orderRatings, setOrderRatings] = useState<Record<string, RatingData>>({});
  const [itemRatings, setItemRatings] = useState<Record<string, ItemRatingData>>({});
  
  // Support State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');

  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  // Helper function to get item name from translations or string
  const getItemName = (item: any): string => {
    if (!item.name) return 'Item';
    if (typeof item.name === 'string') return item.name;
    // If it's a translations object, get the current language
    if (typeof item.name === 'object' && item.name[currentLanguage]) {
      return item.name[currentLanguage];
    }
    // Fallback to English or first available
    if (typeof item.name === 'object') {
      return item.name.en || item.name[Object.keys(item.name)[0]] || 'Item';
    }
    return 'Item';
  };

  useEffect(() => {
    loadOrders();
    loadRatings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dbOrders, searchQuery, filterStatus, filterType, sortBy]);

  const loadOrders = () => {
    const ordersFromDb = db.getOrders();
    setDbOrders(ordersFromDb);

    const active = ordersFromDb.filter(o => 
      ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)
    ).length;
    const completed = ordersFromDb.filter(o => o.status === 'completed').length;
    const revenue = ordersFromDb
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);

    setStatsData({
      totalOrders: ordersFromDb.length,
      activeOrders: active,
      completedOrders: completed,
      totalRevenue: revenue,
    });
  };

  const loadRatings = () => {
    const savedRatings = localStorage.getItem('echefs_order_ratings');
    if (savedRatings) {
      setOrderRatings(JSON.parse(savedRatings));
    }

    const savedItemRatings = localStorage.getItem('echefs_item_ratings');
    if (savedItemRatings) {
      setItemRatings(JSON.parse(savedItemRatings));
    }
  };

  const saveRating = () => {
    if (!selectedOrderForRating || rating === 0) return;

    const newRating: RatingData = {
      orderId: selectedOrderForRating.id,
      rating,
      comment: ratingComment,
      serviceRating,
      deliveryRating,
      timestamp: new Date().toISOString(),
      approved: false,
      customerName: selectedOrderForRating.customerName || 'Guest',
    };

    const updatedRatings = {
      ...orderRatings,
      [selectedOrderForRating.id]: newRating,
    };

    setOrderRatings(updatedRatings);
    localStorage.setItem('echefs_order_ratings', JSON.stringify(updatedRatings));

    setShowRatingModal(false);
    setSelectedOrderForRating(null);
    setRating(0);
    setRatingComment('');
    setServiceRating(0);
    setDeliveryRating(0);

    alert('✨ Thank you for your feedback!');
  };

  const saveItemRating = () => {
    if (!selectedItemForRating || rating === 0) return;

    const newRating: ItemRatingData = {
      itemId: selectedItemForRating.item.id,
      orderId: selectedItemForRating.order.id,
      rating,
      comment: ratingComment,
      timestamp: new Date().toISOString(),
      approved: false,
      customerName: selectedItemForRating.order.customerName || 'Guest',
      tasteRating,
      presentationRating,
    };

    const updatedRatings = {
      ...itemRatings,
      [`${selectedItemForRating.item.id}_${selectedItemForRating.order.id}`]: newRating,
    };

    setItemRatings(updatedRatings);
    localStorage.setItem('echefs_item_ratings', JSON.stringify(updatedRatings));

    setShowItemRatingModal(false);
    setSelectedItemForRating(null);
    setRating(0);
    setRatingComment('');
    setTasteRating(0);
    setPresentationRating(0);

    alert('✨ Thank you for your feedback!');
  };

  const handleReorderItem = (item: any) => {
    const itemName = getItemName(item);
    const menuItem = {
      id: item.id,
      translations: {
        en: { name: itemName, description: 'Reordered item' },
        ar: { name: itemName, description: 'إعادة طلب' },
        ru: { name: itemName, description: 'Повторный заказ' },
        ky: { name: itemName, description: 'Кайра заказ' },
      },
      categoryId: 'main',
      menuType: 'food' as const,
      price: item.price,
      imageUrl: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      badges: [] as any[],
      modifiers: [],
      enabled: true,
      order: 0,
      rating: 4.5,
      reviewCount: 0,
      available: true,
    };

    const cartItem = {
      menuItemId: item.id,
      menuItem: menuItem,
      quantity: 1,
      modifiers: [],
      specialInstructions: '',
    };

    addToCart(cartItem);
    alert(`✅ ${itemName} added to cart!`);
  };

  const handleReorderAll = (order: Order) => {
    order.items.forEach(item => {
      const itemName = getItemName(item);
      const menuItem = {
        id: item.id,
        translations: {
          en: { name: itemName, description: 'Reordered item' },
          ar: { name: itemName, description: 'إعادة طلب' },
          ru: { name: itemName, description: 'Повторный заказ' },
          ky: { name: itemName, description: 'Кайра заказ' },
        },
        categoryId: 'main',
        menuType: 'food' as const,
        price: item.price,
        imageUrl: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        badges: [] as any[],
        modifiers: [],
        enabled: true,
        order: 0,
        rating: 4.5,
        reviewCount: 0,
        available: true,
      };

      const cartItem = {
        menuItemId: item.id,
        menuItem: menuItem,
        quantity: item.quantity,
        modifiers: [],
        specialInstructions: item.specialInstructions || '',
      };

      addToCart(cartItem);
    });

    navigate('/cart');
    setTimeout(() => {
      alert(`✅ All ${order.items.length} items added to cart!`);
    }, 300);
  };

  const handleContactSupport = () => {
    if (!selectedOrderForSupport || !supportMessage) return;

    // Get branch information
    const orderBranch = branches.find(b => b.id === selectedOrderForSupport.branchId);
    
    // Create support message object
    const supportMessageData = {
      id: `support_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: selectedOrderForSupport.id,
      branchId: selectedOrderForSupport.branchId,
      branchName: orderBranch?.translations[currentLanguage]?.name || orderBranch?.translations['en']?.name || 'Unknown Branch',
      subject: supportSubject,
      message: supportMessage,
      customerName: selectedOrderForSupport.customerName || user?.name || 'Guest',
      customerEmail: selectedOrderForSupport.customerEmail || user?.email || '',
      customerPhone: selectedOrderForSupport.customerPhone || '',
      timestamp: new Date().toISOString(),
      status: 'new', // new, replied, resolved
      orderType: selectedOrderForSupport.type,
      orderTotal: selectedOrderForSupport.total,
    };

    // Save to localStorage
    const savedMessages = localStorage.getItem('echefs_support_messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : {};
    messages[supportMessageData.id] = supportMessageData;
    localStorage.setItem('echefs_support_messages', JSON.stringify(messages));

    setShowSupportModal(false);
    setSelectedOrderForSupport(null);
    setSupportMessage('');
    setSupportSubject('');

    alert('📧 Support request sent! Our team will contact you shortly.');
  };

  const applyFilters = () => {
    let filtered = [...dbOrders];

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(order => order.type === filterType);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else {
        return b.total - a.total;
      }
    });

    setFilteredOrders(filtered);
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return <UtensilsCrossed className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      case 'takeaway': return <ShoppingBag className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'delivering': return 'bg-purple-500';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Detail View Component
  const OrderDetailView = ({ order }: { order: Order }) => {
    const orderRating = orderRatings[order.id];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] z-[100] overflow-y-auto pb-20"
      >
        {/* Header */}
        <div className="sticky top-0 z-[110] bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg">
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setShowDetailView(false);
                  setSelectedOrder(null);
                }}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Order Details</h1>
                <p className="text-sm text-white/80">
                  #{order.id.split('_')[1] || order.id.slice(-6)}
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                {order.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Order Info Card */}
          <GlassCard variant="elevated" className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                order.type === 'dine-in' 
                  ? 'bg-[#667c67]/10 text-[#667c67]'
                  : order.type === 'delivery'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {getOrderTypeIcon(order.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1F2933] mb-1">
                  {order.type === 'dine-in' ? 'Dine-In Order' : order.type === 'delivery' ? 'Delivery Order' : 'Takeaway Order'}
                </h3>
                <p className="text-sm text-[#6B7280]">{order.branchName}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  {new Date(order.createdAt || new Date()).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#667c67]">
                  ${order.total.toFixed(2)}
                </div>
                <p className="text-xs text-[#6B7280]">{order.items.length} items</p>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-[#E5E7EB]">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#6B7280]">Customer</p>
                <p className="text-sm font-medium text-[#1F2933]">{order.customerName || 'Guest'}</p>
                {order.customerPhone && (
                  <p className="text-xs text-[#6B7280]">📱 {order.customerPhone}</p>
                )}
              </div>

              {order.type === 'dine-in' && order.tableNumber && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B7280]">Table</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#1F2933]">
                    <Users className="w-4 h-4 text-[#667c67]" />
                    {order.tableNumber}
                    {order.region && <span className="text-[#6B7280]">• {order.region}</span>}
                  </div>
                </div>
              )}

              {order.type === 'delivery' && order.deliveryAddress && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B7280]">Delivery Address</p>
                  <div className="flex items-start gap-2 text-sm font-medium text-[#1F2933]">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>
                      {typeof order.deliveryAddress === 'object' 
                        ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
                        : order.deliveryAddress}
                    </span>
                  </div>
                  {order.estimatedDeliveryTime && (
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <Timer className="w-3.5 h-3.5" />
                      Est: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              )}

              {order.type === 'takeaway' && order.pickupTime && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6B7280]">Pickup Time</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#1F2933]">
                    <Clock className="w-4 h-4 text-orange-600" />
                    {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Rating Display */}
          {orderRating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-[#1F2933]">Your Rating</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= orderRating.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {orderRating.comment && (
                      <p className="text-sm text-[#6B7280] italic">"{orderRating.comment}"</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#667c67]" />
                Order Items
              </h3>
            </div>

            <div className="space-y-3">
              {order.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard variant="default" className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Item Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] flex-shrink-0">
                        {item.image ? (
                          <ImageWithFallback
                            src={item.image}
                            alt={getItemName(item)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-[#9CA3AF]" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-[#1F2933] mb-1">
                          {getItemName(item)}
                        </h4>
                        <p className="text-sm text-[#6B7280] mb-2">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="space-y-1">
                            {item.customizations.map((custom, i) => (
                              <p key={i} className="text-xs text-[#9CA3AF]">
                                + {custom.name} {custom.price > 0 && `(+$${custom.price.toFixed(2)})`}
                              </p>
                            ))}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <p className="text-xs text-[#6B7280] italic mt-2">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      {/* Price & Actions */}
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="text-lg font-bold text-[#667c67]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          {order.status === 'completed' && !itemRatings[`${item.id}_${order.id}`] && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemForRating({ item, order });
                                setShowItemRatingModal(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 whitespace-nowrap"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Rate Item
                            </Button>
                          )}
                          {itemRatings[`${item.id}_${order.id}`] && (
                            <div className="flex items-center gap-1 justify-end">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= itemRatings[`${item.id}_${order.id}`].rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <GlassCard variant="elevated" className="p-5">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="font-semibold text-[#1F2933]">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Discount</span>
                  <span className="font-semibold text-green-600">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Tax</span>
                <span className="font-semibold text-[#1F2933]">${order.tax.toFixed(2)}</span>
              </div>
              {order.deliveryFee && order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Delivery Fee</span>
                  <span className="font-semibold text-[#1F2933]">${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E5E7EB] flex justify-between">
                <span className="text-base font-bold text-[#1F2933]">Total</span>
                <span className="text-xl font-bold text-[#667c67]">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {order.status === 'completed' && !orderRating && (
              <Button
                onClick={() => {
                  setSelectedOrderForRating(order);
                  setShowRatingModal(true);
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Star className="w-5 h-5 mr-2" />
                Rate Order
              </Button>
            )}

            <Button
              onClick={() => {
                setSelectedOrderForSupport(order);
                setShowSupportModal(true);
              }}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Button>

            <Button
              onClick={() => navigate(`/order/${order.id}/tracking`)}
              variant="outline"
              className="border-[#667c67]/30 text-[#667c67] hover:bg-[#667c67]/5"
            >
              <Eye className="w-5 h-5 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Show detail view if order is selected */}
      {showDetailView && selectedOrder ? (
        <OrderDetailView order={selectedOrder} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg">
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Order Management</h1>
                <p className="text-sm text-white/80">Track and manage all orders</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center cursor-pointer"
            >
              <div className="text-white/70 text-xs mb-1">Total</div>
              <div className="text-xl font-bold">{statsData.totalOrders}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center cursor-pointer"
            >
              <div className="text-white/70 text-xs mb-1">Active</div>
              <div className="text-xl font-bold">{statsData.activeOrders}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center cursor-pointer"
            >
              <div className="text-white/70 text-xs mb-1">Done</div>
              <div className="text-xl font-bold">{statsData.completedOrders}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center cursor-pointer"
            >
              <div className="text-white/70 text-xs mb-1">Revenue</div>
              <div className="text-lg font-bold">${statsData.totalRevenue.toFixed(0)}</div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Filters & Search */}
        <GlassCard variant="elevated" className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer, or branch..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#6B7280] mb-2 block">Status</label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'].map((status) => (
                  <motion.button
                    key={status}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterStatus === status
                        ? 'bg-[#667c67] text-white shadow-md'
                        : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#6B7280] mb-2 block">Order Type</label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All', icon: Package },
                  { value: 'dine-in', label: 'Dine-In', icon: UtensilsCrossed },
                  { value: 'delivery', label: 'Delivery', icon: Truck },
                  { value: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
                ].map(({ value, label, icon: Icon }) => (
                  <motion.button
                    key={value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterType(value as any)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      filterType === value
                        ? 'bg-[#667c67] text-white shadow-md'
                        : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
              <span className="text-xs font-semibold text-[#6B7280]">Sort by:</span>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    sortBy === 'date'
                      ? 'bg-[#667c67] text-white'
                      : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  Date
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('amount')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    sortBy === 'amount'
                      ? 'bg-[#667c67] text-white'
                      : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  Amount
                </motion.button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Results Count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-[#6B7280]">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
          </p>
          <Button
            onClick={loadOrders}
            variant="outline"
            size="sm"
            className="text-[#667c67] border-[#667c67]/30 hover:bg-[#667c67]/5"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Orders List */}
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard variant="default" className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-[#9CA3AF] mb-4" />
                <h3 className="text-lg font-bold text-[#374151] mb-2">No orders found</h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Orders will appear here once customers place them'}
                </p>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order, index) => {
                const orderRating = orderRatings[order.id];
                const firstItem = order.items[0];

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard 
                      variant="default" 
                      className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailView(true);
                      }}
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-mono text-sm font-bold text-[#1F2933]">
                                #{order.id.split('_')[1] || order.id.slice(-6)}
                              </span>
                              <Badge className={`text-xs flex items-center gap-1 ${
                                order.type === 'dine-in' 
                                  ? 'bg-[#667c67] text-white'
                                  : order.type === 'delivery'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-orange-600 text-white'
                              }`}>
                                {getOrderTypeIcon(order.type)}
                                <span className="ml-0.5">
                                  {order.type === 'dine-in' ? 'Dine-In' : order.type === 'delivery' ? 'Delivery' : 'Takeaway'}
                                </span>
                              </Badge>
                              <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-semibold text-[#374151] truncate mb-1">
                              {order.customerName || 'Guest'}
                            </p>
                            <p className="text-xs text-[#6B7280] line-clamp-1">
                              {order.branchName} • {order.items.length} items
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-[#667c67]">
                              ${order.total.toFixed(2)}
                            </div>
                            <div className="text-xs text-[#9CA3AF]">
                              {getRelativeTime(order.createdAt || new Date().toISOString())}
                            </div>
                          </div>
                        </div>

                        {/* Rating Display */}
                        {orderRating && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= orderRating.rating
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {orderRating.comment && (
                                <p className="text-xs text-[#6B7280] italic line-clamp-1">
                                  "{orderRating.comment}"
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Footer - View Details */}
                        <div className="pt-3 border-t border-[#E5E7EB]">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              setShowDetailView(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#667c67] hover:bg-[#667c67]/5 rounded-lg transition-all"
                          >
                            View Full Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
        </div>
      )}

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && selectedOrderForRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
            onClick={() => {
              setShowRatingModal(false);
              setSelectedOrderForRating(null);
              setRating(0);
              setRatingComment('');
            }}
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
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2933]">Rate Your Order</h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Order #{selectedOrderForRating.id.split('_')[1] || selectedOrderForRating.id.slice(-6)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowRatingModal(false);
                      setSelectedOrderForRating(null);
                      setRating(0);
                      setRatingComment('');
                      setServiceRating(0);
                      setDeliveryRating(0);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-1">
                  {/* Overall Star Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-3 text-center">
                      Overall Experience
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform"
                        >
                          <Star
                            className={`w-10 h-10 transition-all ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm font-medium text-[#667c67] mt-2"
                      >
                        {rating === 5 && '🌟 Excellent!'}
                        {rating === 4 && '😊 Great!'}
                        {rating === 3 && '👍 Good'}
                        {rating === 2 && '😐 Okay'}
                        {rating === 1 && '😔 Poor'}
                      </motion.p>
                    )}
                  </div>

                  {/* Service Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-3">
                      Service Quality
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setServiceRating(star)}
                          className="transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 transition-all ${
                              star <= serviceRating
                                ? 'fill-blue-500 text-blue-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery/Takeaway Rating */}
                  {(selectedOrderForRating.type === 'delivery' || selectedOrderForRating.type === 'takeaway') && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#374151] mb-3">
                        {selectedOrderForRating.type === 'delivery' ? 'Delivery Experience' : 'Pickup Experience'}
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeliveryRating(star)}
                            className="transition-transform"
                          >
                            <Star
                              className={`w-7 h-7 transition-all ${
                                star <= deliveryRating
                                  ? 'fill-green-500 text-green-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comment */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={saveRating}
                    disabled={rating === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Submit Rating
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Rating Modal */}
      <AnimatePresence>
        {showItemRatingModal && selectedItemForRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
            onClick={() => {
              setShowItemRatingModal(false);
              setSelectedItemForRating(null);
              setRating(0);
              setRatingComment('');
            }}
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
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2933]">Rate This Item</h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Item: {getItemName(selectedItemForRating.item)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowItemRatingModal(false);
                      setSelectedItemForRating(null);
                      setRating(0);
                      setRatingComment('');
                      setTasteRating(0);
                      setPresentationRating(0);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-1">
                  {/* Overall Star Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-3 text-center">
                      Overall Rating
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform"
                        >
                          <Star
                            className={`w-10 h-10 transition-all ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm font-medium text-[#667c67] mt-2"
                      >
                        {rating === 5 && '🌟 Excellent!'}
                        {rating === 4 && '😊 Great!'}
                        {rating === 3 && '👍 Good'}
                        {rating === 2 && '😐 Okay'}
                      {rating === 1 && '😔 Poor'}
                    </motion.p>
                  )}
                </div>

                  {/* Taste Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-3">
                      How Delicious Was It?
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setTasteRating(star)}
                          className="transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 transition-all ${
                              star <= tasteRating
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Presentation Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-3">
                      Presentation Quality
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPresentationRating(star)}
                          className="transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 transition-all ${
                              star <= presentationRating
                                ? 'fill-purple-500 text-purple-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#374151] mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={saveItemRating}
                    disabled={rating === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Submit Rating
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && selectedOrderForSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
            onClick={() => {
              setShowSupportModal(false);
              setSelectedOrderForSupport(null);
              setSupportMessage('');
              setSupportSubject('');
            }}
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
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2933]">Contact Support</h3>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Order #{selectedOrderForSupport.id.split('_')[1] || selectedOrderForSupport.id.slice(-6)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSupportModal(false);
                      setSelectedOrderForSupport(null);
                      setSupportMessage('');
                      setSupportSubject('');
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                {/* Branch Contact Information */}
                {(() => {
                  // Get branch information from the order
                  const orderBranch = branches.find(b => b.id === selectedOrderForSupport.branchId);
                  
                  // Get branch support phone from localStorage (priority) or from branch data
                  const phones = localStorage.getItem('echefs_branch_support_phones');
                  const phonesData = phones ? JSON.parse(phones) : {};
                  const branchPhone = orderBranch ? (phonesData[orderBranch.id] || orderBranch.phone) : null;
                  
                  // Get branch email
                  const branchEmail = orderBranch?.email || null;
                  
                  return (branchPhone || branchEmail) && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <p className="text-xs font-semibold text-blue-600 mb-3">Branch Contact Information</p>
                      {orderBranch && (
                        <p className="text-xs text-[#6B7280] mb-3">
                          {orderBranch.translations[currentLanguage]?.name || orderBranch.translations['en']?.name || 'Branch'}
                        </p>
                      )}
                      <div className="space-y-2 mb-3">
                        {branchPhone && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-blue-600">Phone</p>
                              <p className="text-sm font-bold text-[#1F2933] truncate">{branchPhone}</p>
                            </div>
                          </div>
                        )}
                        {branchEmail && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-purple-600">Email</p>
                              <p className="text-sm font-bold text-[#1F2933] truncate">{branchEmail}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Contact Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {branchPhone && (
                          <a
                            href={`tel:${branchPhone}`}
                            className="flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        )}
                        {branchEmail && (
                          <a
                            href={`mailto:${branchEmail}?subject=Order Support - ${selectedOrderForSupport.id}&body=Order ID: ${selectedOrderForSupport.id}%0D%0A%0D%0A`}
                            className="flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Subject
                  </label>
                  <select
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                  >
                    <option value="">Select a subject...</option>
                    <option value="wrong_order">Wrong Order</option>
                    <option value="missing_items">Missing Items</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="delivery_delay">Delivery Delay</option>
                    <option value="refund_request">Refund Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Message
                  </label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleContactSupport}
                  disabled={!supportMessage}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}