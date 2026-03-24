import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Package, Clock, CheckCircle, XCircle, 
  MapPin, Calendar, DollarSign, Eye, RefreshCw,
  TrendingUp, Filter, Search, ShoppingBag, UtensilsCrossed,
  Truck, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GlassCard } from '../design-system';
import type { Order } from '../lib/types';
import { formatStoreCurrency } from '../utils/currency';

export function MyOrdersPage() {
  const navigate = useNavigate();
  const { currentLanguage, currentBranch } = useApp();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isRTL = currentLanguage === 'ar';

  const translations = {
    en: {
      title: 'My Orders',
      subtitle: 'Track and manage your orders',
      noOrders: 'No orders yet',
      noOrdersDesc: 'Start ordering delicious food!',
      startOrdering: 'Browse Menu',
      searchPlaceholder: 'Search orders...',
      filterAll: 'All',
      filterActive: 'Active',
      filterCompleted: 'Completed',
      filterCancelled: 'Cancelled',
      orderNumber: 'Order',
      status: 'Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivering: 'Out for Delivery',
      completed: 'Completed',
      cancelled: 'Cancelled',
      items: 'items',
      total: 'Total',
      viewDetails: 'View Details',
      trackOrder: 'Track Order',
      orderAgain: 'Order Again',
      branch: 'Branch',
      table: 'Table',
      deliveryAddress: 'Delivery',
      pickupTime: 'Pickup',
      dineIn: 'Dine-In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      refresh: 'Refresh',
      activeOrders: 'Active Orders',
      pastOrders: 'Past Orders',
    },
    ar: {
      title: 'طلباتي',
      subtitle: 'تتبع وإدارة طلباتك',
      noOrders: 'لا توجد طلبات بعد',
      noOrdersDesc: 'ابدأ بطلب طعام لذيذ!',
      startOrdering: 'تصفح القائمة',
      searchPlaceholder: 'بحث عن طلبات...',
      filterAll: 'الكل',
      filterActive: 'النشطة',
      filterCompleted: 'المكتملة',
      filterCancelled: 'الملغية',
      orderNumber: 'طلب رقم',
      status: 'الحالة',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivering: 'قيد التوصيل',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      items: 'عناصر',
      total: 'المجموع',
      viewDetails: 'عرض التفاصيل',
      trackOrder: 'تتبع الطلب',
      orderAgain: 'إعادة الطلب',
      branch: 'الفرع',
      table: 'الطاولة',
      deliveryAddress: 'التوصيل',
      pickupTime: 'الاستلام',
      dineIn: 'تناول الطعام',
      takeaway: 'طلب خارجي',
      delivery: 'التوصيل',
      refresh: 'تحديث',
      activeOrders: 'الطلبات النشطة',
      pastOrders: 'الطلبات السابقة',
    },
    ru: {
      title: 'Мои заказы',
      subtitle: 'Отслеживайте и управляйте своими заказами',
      noOrders: 'Пока нет заказов',
      noOrdersDesc: 'Начните заказывать вкусную еду!',
      startOrdering: 'Просмотреть меню',
      searchPlaceholder: 'Поиск заказов...',
      filterAll: 'Все',
      filterActive: 'Активные',
      filterCompleted: 'Завершенные',
      filterCancelled: 'Отмененные',
      orderNumber: 'Заказ',
      status: 'Статус',
      pending: 'Ожидание',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов',
      delivering: 'В доставке',
      completed: 'Завершен',
      cancelled: 'Отменен',
      items: 'товаров',
      total: 'Итого',
      viewDetails: 'Подробнее',
      trackOrder: 'Отследить заказ',
      orderAgain: 'Заказать снова',
      branch: 'Филиал',
      table: 'Стол',
      deliveryAddress: 'Доставка',
      pickupTime: 'Получение',
      dineIn: 'В ресторане',
      takeaway: 'С собой',
      delivery: 'Доставка',
      refresh: 'Обновить',
      activeOrders: 'Активные заказы',
      pastOrders: 'Прошлые заказы',
    },
    ky: {
      title: 'Менин буйрутмаларым',
      subtitle: 'Буйрутмаларды көзөмөлдөө жана башкаруу',
      noOrders: 'Азырынча буйрутмалар жок',
      noOrdersDesc: 'Даамдуу тамак буйрутуп баштаңыз!',
      startOrdering: 'Менюну көрүү',
      searchPlaceholder: 'Буйрутмаларды издөө...',
      filterAll: 'Баары',
      filterActive: 'Активдүү',
      filterCompleted: 'Аяктаган',
      filterCancelled: 'Жокко чыгарылган',
      orderNumber: 'Буйрутма',
      status: 'Абалы',
      pending: 'Күтүүдө',
      confirmed: 'Ырасталган',
      preparing: 'Даярдалууда',
      ready: 'Даяр',
      delivering: 'Жеткирүүдө',
      completed: 'Аяктаган',
      cancelled: 'Жокко чыгарылган',
      items: 'буюмдар',
      total: 'Жыйынтык',
      viewDetails: 'Деталдарды көрүү',
      trackOrder: 'Буйрутманы көзөмөлдөө',
      orderAgain: 'Кайра буйрутуу',
      branch: 'Филиал',
      table: 'Стол',
      deliveryAddress: 'Жеткирүү',
      pickupTime: 'Алуу',
      dineIn: 'Ресторанда',
      takeaway: 'Алып кетүү',
      delivery: 'Жеткирүү',
      refresh: 'Жаңыртуу',
      activeOrders: 'Активдүү буйрутмалар',
      pastOrders: 'Мурунку буйрутмалар',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // Load user orders
  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    if (user) {
      const userOrders = db.getOrders().filter(order => order.userId === user.id);
      // Sort by date, newest first
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(userOrders);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus === 'active') {
      if (['completed', 'cancelled'].includes(order.status)) return false;
    } else if (filterStatus === 'completed') {
      if (order.status !== 'completed') return false;
    } else if (filterStatus === 'cancelled') {
      if (order.status !== 'cancelled') return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.menuItem.translations[currentLanguage]?.name.toLowerCase().includes(query)
        )
      );
    }

    return true;
  });

  // Separate active and past orders
  const activeOrders = filteredOrders.filter(order => 
    !['completed', 'cancelled'].includes(order.status)
  );
  const pastOrders = filteredOrders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <UtensilsCrossed className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'delivering': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'delivering': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t.pending;
      case 'confirmed': return t.confirmed;
      case 'preparing': return t.preparing;
      case 'ready': return t.ready;
      case 'delivering': return t.delivering;
      case 'completed': return t.completed;
      case 'cancelled': return t.cancelled;
      default: return status;
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return <UtensilsCrossed className="w-4 h-4" />;
      case 'takeaway': return <ShoppingBag className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'dine-in': return t.dineIn;
      case 'takeaway': return t.takeaway;
      case 'delivery': return t.delivery;
      default: return type;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your orders</p>
          <Button
            onClick={() => navigate('/sign-in')}
            className="bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-sm text-white/80 mt-0.5">{t.subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667c67] focus:border-transparent"
                />
              </div>

              {/* Status Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { key: 'all', label: t.filterAll },
                  { key: 'active', label: t.filterActive },
                  { key: 'completed', label: t.filterCompleted },
                  { key: 'cancelled', label: t.filterCancelled },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      filterStatus === filter.key
                        ? 'bg-[#667c67] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center space-y-6 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner"
              >
                <Package className="w-16 h-16 text-gray-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.noOrders}</h2>
                <p className="text-gray-600">{t.noOrdersDesc}</p>
              </div>
              <Button
                onClick={() => {
                  if (currentBranch?.id) {
                    navigate(`/branch/${currentBranch.id}/menu`);
                  } else {
                    navigate('/branch-selection');
                  }
                }}
                className="bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
              >
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                {t.startOrdering}
              </Button>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {orders.length > 0 && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </motion.div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#667c67]" />
              {t.activeOrders}
            </h2>
            <AnimatePresence mode="popLayout">
              {activeOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="p-5 space-y-4">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono font-bold text-lg text-[#667c67]">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1.5">{getStatusText(order.status)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              {getOrderTypeIcon(order.type)}
                              {getOrderTypeText(order.type)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString(currentLanguage)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 mb-1">
                          {order.items.length} {t.items}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {order.items.map(item => 
                            `${item.quantity}x ${item.menuItem.translations[currentLanguage]?.name}`
                          ).join(', ')}
                        </p>
                      </div>

                      {/* Order Total and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">{t.total}</p>
                          <p className="text-2xl font-bold text-[#667c67]">
                            {formatStoreCurrency(order.total)}
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate(`/order/${order.id}/tracking`)}
                          className="bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t.trackOrder}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Past Orders */}
        {pastOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              {t.pastOrders}
            </h2>
            <AnimatePresence mode="popLayout">
              {pastOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="overflow-hidden opacity-90 hover:opacity-100 hover:shadow-lg transition-all">
                    <div className="p-5 space-y-4">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono font-bold text-gray-700">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1.5">{getStatusText(order.status)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              {getOrderTypeIcon(order.type)}
                              {getOrderTypeText(order.type)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString(currentLanguage)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 mb-1">
                          {order.items.length} {t.items}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {order.items.map(item => 
                            `${item.quantity}x ${item.menuItem.translations[currentLanguage]?.name}`
                          ).join(', ')}
                        </p>
                      </div>

                      {/* Order Total and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">{t.total}</p>
                          <p className="text-xl font-bold text-gray-700">
                            {formatStoreCurrency(order.total)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/order/${order.id}/tracking`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
