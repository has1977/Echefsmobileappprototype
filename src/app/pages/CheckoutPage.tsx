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
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, MapPin, Clock, User, Phone, Mail, 
  CreditCard, ShoppingBag, AlertCircle, Check, Loader2,
  UtensilsCrossed, Truck, FileText, Star, Sparkles, 
  DollarSign, CheckCircle, ChevronRight, Home
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
    promotionDiscount,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  if (cart.length === 0) {
    return null;
  }

  const translations = {
    en: {
      title: 'Checkout',
      subtitle: 'Review and complete your order',
      step1: 'Information',
      step2: 'Delivery',
      step3: 'Payment',
      orderSummary: 'Order Summary',
      items: 'items',
      subtotal: 'Subtotal',
      tax: 'Tax & Fees',
      tip: 'Tip',
      discount: 'Discount',
      total: 'Total',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      customerInfo: 'Your Information',
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
      addTip: 'Add a Tip',
      noTip: 'No Tip',
      continue: 'Continue',
      back: 'Back',
      estimatedTime: 'Estimated',
      minutes: 'min',
      saveInfo: 'Save my information for next time',
    },
    ar: {
      title: 'الدفع',
      subtitle: 'راجع واكمل طلبك',
      step1: 'المعلومات',
      step2: 'التوصيل',
      step3: 'الدفع',
      orderSummary: 'ملخص الطلب',
      items: 'عناصر',
      subtotal: 'المجموع الفرعي',
      tax: 'الضرائب والرسوم',
      tip: 'إكرامية',
      discount: 'خصم',
      total: 'المجموع',
      placeOrder: 'تقديم الطلب',
      processing: 'جارٍ المعالجة...',
      customerInfo: 'معلوماتك',
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
      continue: 'متابعة',
      back: 'رجوع',
      estimatedTime: 'الوقت المتوقع',
      minutes: 'دقيقة',
      saveInfo: 'احفظ معلوماتي للمرة القادمة',
    },
    ru: {
      title: 'Оформление',
      subtitle: 'Проверьте и завершите заказ',
      step1: 'Информация',
      step2: 'Доставка',
      step3: 'Оплата',
      orderSummary: 'Итоги заказа',
      items: 'товаров',
      subtotal: 'Промежуточный итог',
      tax: 'Налоги и сборы',
      tip: 'Чаевые',
      discount: 'Скидка',
      total: 'Итого',
      placeOrder: 'Оформить заказ',
      processing: 'Обработка...',
      customerInfo: 'Ваша информация',
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
      continue: 'Продолжить',
      back: 'Назад',
      estimatedTime: 'Примерно',
      minutes: 'мин',
      saveInfo: 'Сохранить мои данные на будущее',
    },
    ky: {
      title: 'Төлөм',
      subtitle: 'Буйруткуңузду текшериңиз жана бүтүрүңүз',
      step1: 'Маалымат',
      step2: 'Жеткирүү',
      step3: 'Төлөм',
      orderSummary: 'Буйрутманын жыйынтыгы',
      items: 'буюмдар',
      subtotal: 'Жалпы сумма',
      tax: 'Салыктар жана алымдар',
      tip: 'Чайпул',
      discount: 'Арзандатуу',
      total: 'Жыйынтык',
      placeOrder: 'Буйрутканы берүү',
      processing: 'Иштетилүүдө...',
      customerInfo: 'Сиздин маалыматыңыз',
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
      continue: 'Улантуу',
      back: 'Артка',
      estimatedTime: 'Болжолдуу',
      minutes: 'мүн',
      saveInfo: 'Кийинки жолу үчүн маалыматымды сактоо',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const finalTotal = cartTotal - promotionDiscount + tip;

  const tipOptions = [
    { label: t.noTip, value: 0, percent: '0%' },
    { label: '10%', value: cartSubtotal * 0.1, percent: '10%' },
    { label: '15%', value: cartSubtotal * 0.15, percent: '15%' },
    { label: '20%', value: cartSubtotal * 0.2, percent: '20%' },
  ];

  const steps = [
    { number: 1, title: t.step1, icon: User },
    { number: 2, title: orderType === 'delivery' ? t.step2 : t.step2, icon: orderType === 'delivery' ? MapPin : Clock },
    { number: 3, title: t.step3, icon: CreditCard },
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!customerName.trim()) errors.name = 'Name is required';
      if (!customerPhone.trim()) errors.phone = 'Phone number is required';
      if (customerEmail && !customerEmail.includes('@')) errors.email = 'Invalid email';
    }

    if (step === 2) {
      if (orderType === 'delivery' && !address.trim()) {
        errors.address = 'Delivery address is required';
      }
      if (orderType === 'takeaway' && !time.trim()) {
        errors.time = 'Pickup time is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;

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
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const estimatedTime = cart.length <= 3 ? '15-20' : cart.length <= 6 ? '20-30' : '30-40';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
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
              
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-sm text-white/80">{t.subtitle}</p>
              </div>
            </div>

            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1.5 text-sm">
              {cart.length} {t.items}
            </Badge>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-white/20 rounded-full">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                
                return (
                  <div key={step.number} className="relative flex flex-col items-center z-10">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted || isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-2 ${
                        isCompleted || isActive ? 'text-[#667c67]' : 'text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" fill="currentColor" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{t.customerInfo}</h2>
                        <p className="text-sm text-gray-600">We'll use this to contact you about your order</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                          {t.name} <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            setValidationErrors({ ...validationErrors, name: '' });
                          }}
                          placeholder="John Doe"
                          disabled={isProcessing}
                          className={`h-12 ${validationErrors.name ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.name && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                          {t.phone} <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            setValidationErrors({ ...validationErrors, phone: '' });
                          }}
                          placeholder="+996 555 123 456"
                          type="tel"
                          disabled={isProcessing}
                          className={`h-12 ${validationErrors.phone ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.phone && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          {t.email}
                        </label>
                        <Input
                          value={customerEmail}
                          onChange={(e) => {
                            setCustomerEmail(e.target.value);
                            setValidationErrors({ ...validationErrors, email: '' });
                          }}
                          placeholder="john@example.com"
                          type="email"
                          disabled={isProcessing}
                          className={`h-12 ${validationErrors.email ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.email && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {validationErrors.email}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Optional - for order confirmation</p>
                      </div>
                    </div>
                  </Card>

                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
                  >
                    {t.continue}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Delivery/Pickup Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {orderType === 'delivery' && (
                    <Card className="p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{t.deliveryAddress}</h2>
                          <p className="text-sm text-gray-600">Where should we deliver your order?</p>
                        </div>
                      </div>
                      <Textarea
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setValidationErrors({ ...validationErrors, address: '' });
                        }}
                        placeholder="123 Main St, Apt 4B&#10;City, ZIP Code&#10;Additional landmarks or instructions..."
                        rows={4}
                        disabled={isProcessing}
                        className={`${validationErrors.address ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.address && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.address}
                        </p>
                      )}
                    </Card>
                  )}

                  {orderType === 'takeaway' && (
                    <Card className="p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{t.pickupTime}</h2>
                          <p className="text-sm text-gray-600">When would you like to pick up?</p>
                        </div>
                      </div>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          setTime(e.target.value);
                          setValidationErrors({ ...validationErrors, time: '' });
                        }}
                        disabled={isProcessing}
                        className={`h-12 ${validationErrors.time ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.time && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.time}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {t.estimatedTime}: {estimatedTime} {t.minutes}
                      </p>
                    </Card>
                  )}

                  {orderType === 'dine-in' && (
                    <Card className="p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <UtensilsCrossed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{t.dineIn}</h2>
                          <p className="text-sm text-gray-600">Your order will be served to your table</p>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">{t.table}: #{selectedTable}</span>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                          {t.estimatedTime}: {estimatedTime} {t.minutes}
                        </p>
                      </div>
                    </Card>
                  )}

                  <Card className="p-6 shadow-lg">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      {t.specialInstructions} ({t.optional})
                    </h3>
                    <Textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="E.g., Extra napkins, no onions, allergies, ring doorbell..."
                      rows={3}
                      disabled={isProcessing}
                    />
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      size="lg"
                      variant="outline"
                      className="h-14 text-lg flex-1"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      {t.back}
                    </Button>
                    <Button
                      onClick={handleContinue}
                      size="lg"
                      className="h-14 text-lg flex-1 bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67]"
                    >
                      {t.continue}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Tip Selection */}
                  <Card className="p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" fill="white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{t.addTip}</h2>
                        <p className="text-sm text-gray-600">Show your appreciation</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {tipOptions.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTip(option.value)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            tip === option.value
                              ? 'border-[#667c67] bg-[#667c67]/10 shadow-lg'
                              : 'border-gray-200 hover:border-[#667c67]/50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-lg">{option.percent}</div>
                            {option.value > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                ${option.value.toFixed(2)}
                              </div>
                            )}
                          </div>
                          {tip === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </Card>

                  {/* Payment Method */}
                  <Card className="p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{t.paymentMethod}</h2>
                        <p className="text-sm text-gray-600">How would you like to pay?</p>
                      </div>
                    </div>
                    <PaymentMethodSelector
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                      language={currentLanguage}
                    />
                  </Card>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      size="lg"
                      variant="outline"
                      className="h-14 text-lg flex-1"
                      disabled={isProcessing}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      {t.back}
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      size="lg"
                      className="h-14 text-lg flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t.processing}
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          {t.placeOrder}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 shadow-xl border-2">
                <h3 className="font-bold text-xl mb-5 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#667c67]" />
                  {t.orderSummary}
                </h3>

                {/* Order Details */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                  {selectedBranch && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedBranch.translations[currentLanguage]?.name}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {selectedBranch.translations[currentLanguage]?.address}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    {orderType === 'dine-in' && <UtensilsCrossed className="w-4 h-4 text-gray-500" />}
                    {orderType === 'takeaway' && <ShoppingBag className="w-4 h-4 text-gray-500" />}
                    {orderType === 'delivery' && <Truck className="w-4 h-4 text-gray-500" />}
                    <Badge variant="secondary">
                      {orderType === 'dine-in' ? t.dineIn : orderType === 'takeaway' ? t.takeaway : t.delivery}
                    </Badge>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">{t.subtotal}</span>
                    <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">{t.tax}</span>
                    <span className="font-semibold">${cartTax.toFixed(2)}</span>
                  </div>
                  
                  {promotionDiscount > 0 && (
                    <div className="flex justify-between text-base text-green-600 bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                      <span className="flex items-center gap-1 font-medium">
                        <Sparkles className="w-4 h-4" />
                        {t.discount}
                      </span>
                      <span className="font-bold">-${promotionDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {tip > 0 && (
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">{t.tip}</span>
                      <span className="font-semibold">${tip.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-2xl font-bold border-t-2 pt-4">
                    <span>{t.total}</span>
                    <span className="text-[#667c67]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      Your order will be confirmed after payment. You'll receive real-time updates.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
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
