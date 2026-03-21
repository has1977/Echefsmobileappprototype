import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { PaymentMethodSelector, type PaymentMethod } from '../components/payment/PaymentMethodSelector';
import { AuthPrompt } from '../components/auth/AuthPrompt';
import { motion } from 'motion/react';
import { 
  ChevronLeft, MapPin, Clock, User, Phone, Mail, 
  CreditCard, ShoppingBag, AlertCircle, Check, Loader2
} from 'lucide-react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartTotal,
    currentLanguage,
    orderType,
    selectedBranch,
    selectedTable,
    placeOrder,
    clearCart,
    deliveryAddress,
    setDeliveryAddress,
    pickupTime,
    setPickupTime,
  } = useApp();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(deliveryAddress || '');
  const [time, setTime] = useState(pickupTime || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tip, setTip] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const isRTL = currentLanguage === 'ar';

  // Update form with user data when authenticated
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/branch-selection');
    }
  }, [cart, navigate]);

  // Show auth prompt if not authenticated when page loads
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated]);

  if (cart.length === 0) {
    return null;
  }

  const translations = {
    en: {
      title: 'Checkout',
      subtitle: 'Complete your order',
      orderSummary: 'Order Summary',
      items: 'items',
      subtotal: 'Subtotal',
      tax: 'Tax',
      tip: 'Tip',
      total: 'Total',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (Optional)',
      deliveryAddress: 'Delivery Address',
      pickupTime: 'Pickup Time',
      specialInstructions: 'Special Instructions',
      paymentMethod: 'Payment Method',
      optional: 'Optional',
      required: 'Required',
      dineIn: 'Dine-In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      table: 'Table',
      branch: 'Branch',
      addTip: 'Add Tip',
      noTip: 'No Tip',
    },
    ar: {
      title: 'الدفع',
      subtitle: 'أكمل طلبك',
      orderSummary: 'ملخص الطلب',
      items: 'عناصر',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      tip: 'إكرامية',
      total: 'المجموع',
      placeOrder: 'تقديم الطلب',
      processing: 'جارٍ المعالجة...',
      customerInfo: 'معلومات العميل',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني (اختياري)',
      deliveryAddress: 'عنوان التوصيل',
      pickupTime: 'وقت الاستلام',
      specialInstructions: 'تعليمات خاصة',
      paymentMethod: 'طريقة الدفع',
      optional: 'اختياري',
      required: 'مطلوب',
      dineIn: 'تناول الطعام',
      takeaway: 'طلب خارجي',
      delivery: 'التوصيل',
      table: 'الطاولة',
      branch: 'الفرع',
      addTip: 'إضافة إكرامية',
      noTip: 'بدون إكرامية',
    },
    ru: {
      title: 'Оформление',
      subtitle: 'Завершите заказ',
      orderSummary: 'Итоги заказа',
      items: 'товаров',
      subtotal: 'Промежуточный итог',
      tax: 'Налог',
      tip: 'Чаевые',
      total: 'Итого',
      placeOrder: 'Оформить заказ',
      processing: 'Обработка...',
      customerInfo: 'Информация о клиенте',
      name: 'Полное имя',
      phone: 'Номер телефона',
      email: 'Email (необязательно)',
      deliveryAddress: 'Адрес доставки',
      pickupTime: 'Время самовывоза',
      specialInstructions: 'Особые пожелания',
      paymentMethod: 'Способ оплаты',
      optional: 'Необязательно',
      required: 'Обязательно',
      dineIn: 'В ресторане',
      takeaway: 'С собой',
      delivery: 'Доставка',
      table: 'Стол',
      branch: 'Филиал',
      addTip: 'Добавить чаевые',
      noTip: 'Без чаевых',
    },
    ky: {
      title: 'Төлөм',
      subtitle: 'Буйруткуңузду бүтүрүңүз',
      orderSummary: 'Буйрутманын жыйынтыгы',
      items: 'буюмдар',
      subtotal: 'Жалпы сумма',
      tax: 'Салык',
      tip: 'Чайпул',
      total: 'Жыйынтык',
      placeOrder: 'Буйрутканы берүү',
      processing: 'Иштетилүүдө...',
      customerInfo: 'Кардардын маалыматы',
      name: 'Толук аты',
      phone: 'Телефон номери',
      email: 'Email (тандоо боюнча)',
      deliveryAddress: 'Жеткирүү дареги',
      pickupTime: 'Алуу убактысы',
      specialInstructions: 'Атайын көрсөтмөлөр',
      paymentMethod: 'Төлөм ыкмасы',
      optional: 'Тандоо боюнча',
      required: 'Милдеттүү',
      dineIn: 'Ресторанда',
      takeaway: 'Алып кетүү',
      delivery: 'Жеткирүү',
      table: 'Стол',
      branch: 'Филиал',
      addTip: 'Чайпул кошуу',
      noTip: 'Чайпулсуз',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const finalTotal = cartTotal + tip;

  const tipOptions = [
    { label: t.noTip, value: 0 },
    { label: '10%', value: cartSubtotal * 0.1 },
    { label: '15%', value: cartSubtotal * 0.15 },
    { label: '20%', value: cartSubtotal * 0.2 },
  ];

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!customerName || !customerPhone) {
      alert('Please fill in required fields');
      return;
    }

    if (orderType === 'delivery' && !address) {
      alert('Please provide delivery address');
      return;
    }

    if (orderType === 'takeaway' && !time) {
      alert('Please provide pickup time');
      return;
    }

    setIsProcessing(true);

    try {
      // Update delivery/pickup info
      if (orderType === 'delivery') {
        setDeliveryAddress(address);
      }
      if (orderType === 'takeaway') {
        setPickupTime(time);
      }

      // Place the order
      const order = placeOrder({
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        notes: specialInstructions || undefined,
        tip,
        paymentMethod,
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to order tracking
      navigate(`/order/${order.id}/tracking`);
      setOrderSuccess(true);
      setCreatedOrderId(order.id);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
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
            onClick={() => navigate('/cart')}
            disabled={isProcessing}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-sm text-white/80">{t.subtitle}</p>
          </div>

          <Badge className="bg-white/20 text-white border-none">
            {cart.length} {t.items}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Type & Details */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Type</span>
            <Badge className="bg-[#667c67]">
              {orderType === 'dine-in' ? t.dineIn : orderType === 'takeaway' ? t.takeaway : t.delivery}
            </Badge>
          </div>

          {selectedBranch && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#667c67] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedBranch.translations[currentLanguage]?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedBranch.translations[currentLanguage]?.address}</p>
              </div>
            </div>
          )}

          {orderType === 'dine-in' && selectedTable && (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#667c67]" />
              <span className="text-sm">{t.table}: {selectedTable}</span>
            </div>
          )}
        </Card>

        {/* Customer Information */}
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[#667c67]" />
            {t.customerInfo}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                {t.name} <span className="text-destructive">*</span>
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                {t.phone} <span className="text-destructive">*</span>
              </label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                {t.email}
              </label>
              <Input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                type="email"
                disabled={isProcessing}
              />
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        {orderType === 'delivery' && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#667c67]" />
              {t.deliveryAddress} <span className="text-destructive">*</span>
            </h3>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Apt 4B, City, ZIP"
              rows={3}
              disabled={isProcessing}
            />
          </Card>
        )}

        {/* Pickup Time */}
        {orderType === 'takeaway' && (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#667c67]" />
              {t.pickupTime} <span className="text-destructive">*</span>
            </h3>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isProcessing}
            />
          </Card>
        )}

        {/* Special Instructions */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            {t.specialInstructions} ({t.optional})
          </h3>
          <Textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="E.g., Ring doorbell, allergies, preferences..."
            rows={3}
            disabled={isProcessing}
          />
        </Card>

        {/* Tip Selection */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">{t.addTip}</h3>
          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map((option, index) => (
              <Button
                key={index}
                variant={tip === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTip(option.value)}
                className={tip === option.value ? 'bg-[#667c67]' : ''}
                disabled={isProcessing}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {tip > 0 && (
            <p className="text-sm text-center text-muted-foreground">
              ${tip.toFixed(2)}
            </p>
          )}
        </Card>

        {/* Payment Method */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#667c67]" />
            {t.paymentMethod}
          </h3>
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            language={currentLanguage}
          />
        </Card>

        {/* Order Summary */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">{t.orderSummary}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.subtotal}</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.tax}</span>
              <span>${cartTax.toFixed(2)}</span>
            </div>

            {tip > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.tip}</span>
                <span>${tip.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>{t.total}</span>
              <span className="text-[#667c67]">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Your order will be confirmed after payment processing. You'll receive updates on your order status.
          </p>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-20">
        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !customerName || !customerPhone}
          size="lg"
          className="w-full h-14 text-base bg-[#667c67] hover:bg-[#526250] disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              {t.processing}
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-3" />
              {t.placeOrder} • ${finalTotal.toFixed(2)}
            </>
          )}
        </Button>
      </div>

      {/* Auth Prompt */}
      {showAuthPrompt && (
        <AuthPrompt
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          onSuccess={() => setShowAuthPrompt(false)}
          title="Sign In to Continue"
          message="Please sign in or create an account to place your order. You can also continue as a guest."
        />
      )}
    </div>
  );
}