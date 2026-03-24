import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { db } from '../lib/database';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { 
  ChevronLeft, MapPin, Clock, User, Phone, CheckCircle, 
  Package, Truck, UtensilsCrossed, Star, MessageSquare,
  Home, RefreshCw
} from 'lucide-react';
import type { Order } from '../lib/types';

export function OrderTrackingPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, currentLanguage, selectedBranch, updateOrderStatus } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isRTL = currentLanguage === 'ar';

  // Load order from database directly to ensure fresh data
  const loadOrder = () => {
    if (!orderId) return;
    
    const foundOrder = db.getOrder(orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // Fallback to context orders
      const contextOrder = orders.find(o => o.id === orderId);
      if (contextOrder) {
        setOrder(contextOrder);
      }
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId, orders]);

  // Auto-refresh order status every 10 seconds for active orders
  useEffect(() => {
    if (!order || order.status === 'completed' || order.status === 'cancelled') {
      return;
    }

    const interval = setInterval(() => {
      loadOrder();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [order, orderId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrder();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const translations = {
    en: {
      title: 'Order Tracking',
      orderNumber: 'Order',
      status: 'Status',
      statusPending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivering: 'Out for Delivery',
      completed: 'Completed',
      cancelled: 'Cancelled',
      estimatedTime: 'Estimated Time',
      orderDetails: 'Order Details',
      customerInfo: 'Customer Information',
      deliveryAddress: 'Delivery Address',
      pickupTime: 'Pickup Time',
      table: 'Table',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      paid: 'Paid',
      paymentPending: 'Pending',
      failed: 'Failed',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'Tax',
      tip: 'Tip',
      discount: 'Discount',
      total: 'Total',
      trackOrder: 'Track Your Order',
      goHome: 'Back to Home',
      rateOrder: 'Rate Order',
      contactSupport: 'Contact Support',
      orderPlaced: 'Order Placed',
      branch: 'Branch',
      myOrders: 'My Orders',
      viewAllOrders: 'View All Orders',
    },
    ar: {
      title: 'تتبع الطلب',
      orderNumber: 'الطلب',
      status: 'الحالة',
      statusPending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivering: 'قيد التوصيل',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      estimatedTime: 'الوقت المقدر',
      orderDetails: 'تفاصيل الطلب',
      customerInfo: 'معلومات العميل',
      deliveryAddress: 'عنوان التوصيل',
      pickupTime: 'وقت الاستلام',
      table: 'الطاولة',
      paymentMethod: 'طريقة الدفع',
      paymentStatus: 'حالة الدفع',
      paid: 'مدفوع',
      paymentPending: 'قيد الانتظار',
      failed: 'فشل',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      tip: 'إكرامية',
      discount: 'خصم',
      total: 'المجموع',
      trackOrder: 'تتبع طلبك',
      goHome: 'العودة للرئيسية',
      rateOrder: 'تقييم الطلب',
      contactSupport: 'اتصل بالدعم',
      orderPlaced: 'تم تقديم الطلب',
      branch: 'الفرع',
      myOrders: 'طلباتي',
      viewAllOrders: 'عرض جميع الطلبات',
    },
    ru: {
      title: 'Отслеживание заказа',
      orderNumber: 'Заказ',
      status: 'Статус',
      statusPending: 'Ожидание',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов',
      delivering: 'В доставке',
      completed: 'Завершен',
      cancelled: 'Отменен',
      estimatedTime: 'Ожидаемое время',
      orderDetails: 'Детали заказа',
      customerInfo: 'Информация о клиенте',
      deliveryAddress: 'Адрес доставки',
      pickupTime: 'Время самовывоза',
      table: 'Стол',
      paymentMethod: 'Способ оплаты',
      paymentStatus: 'Статус оплаты',
      paid: 'Оплачено',
      paymentPending: 'Ожидание',
      failed: 'Ошибка',
      orderSummary: 'Итоги заказа',
      subtotal: 'Промежуточный итог',
      tax: 'Налог',
      tip: 'Чаевые',
      discount: 'Скидка',
      total: 'Итого',
      trackOrder: 'Отслеживайте заказ',
      goHome: 'На главную',
      rateOrder: 'Оценить заказ',
      contactSupport: 'Поддержка',
      orderPlaced: 'Заказ размещен',
      branch: 'Филиал',
      myOrders: 'Мои заказы',
      viewAllOrders: 'Смотреть все заказы',
    },
    ky: {
      title: 'Буйруткону көзөмөлдөө',
      orderNumber: 'Буйрутма',
      status: 'Абалы',
      statusPending: 'Күтүлүүдө',
      confirmed: 'Ырасталды',
      preparing: 'Даярдалууда',
      ready: 'Даяр',
      delivering: 'Жеткирилүүдө',
      completed: 'Аяктады',
      cancelled: 'Жокко чыгарылды',
      estimatedTime: 'Болжолдуу убакыт',
      orderDetails: 'Буйрутманын чоо-жайы',
      customerInfo: 'Кардардын маалыматы',
      deliveryAddress: 'Жеткирүү дареги',
      pickupTime: 'Алуу убактысы',
      table: 'Стол',
      paymentMethod: 'Төлөм ыкмасы',
      paymentStatus: 'Төлөм абалы',
      paid: 'Төлөнгөн',
      paymentPending: 'Күтүлүүдө',
      failed: 'Ката',
      orderSummary: 'Буйрутманын жыйынтыгы',
      subtotal: 'Жалпы сумма',
      tax: 'Салык',
      tip: 'Чайпул',
      discount: 'Арзандатуу',
      total: 'Жыйынтык',
      trackOrder: 'Буйруткаңызды көзөмөлдөңүз',
      goHome: 'Башкы бетке',
      rateOrder: 'Баалоо',
      contactSupport: 'Колдоо',
      orderPlaced: 'Буйрутма берилди',
      branch: 'Филиал',
      myOrders: 'Менин буйрутмаларым',
      viewAllOrders: 'Бардык буйрутмаларды көрүү',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <Button onClick={() => navigate('/branch-selection')} className="bg-[#667c67]">
          <Home className="w-4 h-4 mr-2" />
          {t.goHome}
        </Button>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', icon: Clock, label: t.statusPending },
    { key: 'confirmed', icon: CheckCircle, label: t.confirmed },
    { key: 'preparing', icon: UtensilsCrossed, label: t.preparing },
    order.type === 'delivery' 
      ? { key: 'delivering', icon: Truck, label: t.delivering }
      : { key: 'ready', icon: Package, label: t.ready },
    { key: 'completed', icon: CheckCircle, label: t.completed },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-purple-500';
      case 'ready': return 'bg-green-500';
      case 'delivering': return 'bg-blue-600';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'failed': return 'bg-destructive';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#667c67] text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/branch-selection')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-sm text-white/80">
              {t.orderNumber} #{order.orderNumber}
            </p>
          </div>

          <Badge className={`${getStatusColor(order.status)} text-white border-none`}>
            {t[order.status as keyof typeof t] || order.status}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Status Timeline */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6">{t.trackOrder}</h3>
          
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-[#667c67] text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    
                    {index < statusSteps.length - 1 && (
                      <div 
                        className={`absolute left-1/2 -translate-x-1/2 top-12 w-0.5 h-8 ${
                          index < currentStepIndex ? 'bg-[#667c67]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${isCurrent ? 'text-[#667c67]' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-muted-foreground">In progress...</p>
                    )}
                    {isCompleted && !isCurrent && (
                      <p className="text-xs text-success">✓ Completed</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Estimated Time */}
        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <Card className="p-4 bg-[#667c67]/5 border-[#667c67]/20">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-[#667c67]" />
              <div>
                <p className="text-sm text-muted-foreground">{t.estimatedTime}</p>
                <p className="text-lg font-bold text-[#667c67]">
                  {order.type === 'delivery' ? '30-45 min' : '15-20 min'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">{t.orderDetails}</h3>
          
          <div className="space-y-3 text-sm">
            {order.type === 'dine-in' && order.tableId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.table}</span>
                <span className="font-medium">{order.tableId}</span>
              </div>
            )}

            {selectedBranch && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#667c67] mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{selectedBranch.translations[currentLanguage]?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedBranch.translations[currentLanguage]?.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-muted-foreground">{t.orderPlaced}</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleString(currentLanguage, {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* Customer Info */}
        {order.customerName && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-[#667c67]" />
              {t.customerInfo}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              
              {order.customerPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              )}

              {order.deliveryAddress && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">{t.deliveryAddress}</span>
                  <span className="font-medium text-right">{order.deliveryAddress}</span>
                </div>
              )}

              {order.pickupTime && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t.pickupTime}</span>
                  <span className="font-medium">{order.pickupTime}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Payment Info */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">{t.paymentMethod}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium capitalize">{order.paymentMethod || 'cash'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.paymentStatus}</span>
              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white border-none`}>
                {t[order.paymentStatus as keyof typeof t] || order.paymentStatus}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">{t.orderSummary}</h3>
          
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.quantity}x</span>
                  <span className="ml-2">Item {item.menuItemId.slice(0, 8)}</span>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground ml-6">{item.notes}</p>
                  )}
                </div>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.subtotal}</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.tax}</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>

            {order.tip > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.tip}</span>
                <span>${order.tip.toFixed(2)}</span>
              </div>
            )}

            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>{t.discount}</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>{t.total}</span>
              <span className="text-[#667c67]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        {order.status === 'completed' && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <Star className="w-4 h-4" />
              {t.rateOrder}
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {t.contactSupport}
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-20">
        <Button
          onClick={() => navigate('/branch-selection')}
          size="lg"
          className="w-full bg-[#667c67] hover:bg-[#526250]"
        >
          <Home className="w-5 h-5 mr-2" />
          {t.goHome}
        </Button>
      </div>
    </div>
  );
}