import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight, 
  UtensilsCrossed, Truck, MapPin, Clock, Tag, Star, Sparkles, 
  Gift, Percent, AlertCircle, X, TrendingUp, Zap, Info
} from 'lucide-react';
import { useState } from 'react';
import { promotions } from '../services/promotionsData';
import { getBranchPromotions } from '../services/branchLoyaltyData';
import { useLoyaltyCurrency, useEarningRate, useStoreCurrency } from '../hooks/useCurrency';
import { calculatePointsEarned, formatLoyaltyCurrency, formatStoreCurrency } from '../utils/currency';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    cartSubtotal,
    cartTax,
    cartTotal,
    currentLanguage,
    orderType,
    selectedTable,
    selectedBranch,
    appliedPromotion,
    setAppliedPromotion,
    promotionDiscount,
    currentBranch,
  } = useApp();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const isRTL = currentLanguage === 'ar';
  
  // Use centralized currency hooks
  const storeCurrency = useStoreCurrency();
  const loyaltyCurrency = useLoyaltyCurrency();
  const earningRate = useEarningRate();

  const translations = {
    en: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptyDesc: 'Add some delicious items to get started',
      subtotal: 'Subtotal',
      tax: 'Tax & Fees',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping',
      orderType: 'Order Type',
      dineIn: 'Dine-In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      table: 'Table',
      branch: 'Branch',
      itemsInCart: 'items in cart',
      estimatedTime: 'Estimated time',
      minutes: 'min',
      promoCode: 'Have a promo code?',
      applyCode: 'Apply',
      viewPromotions: 'View available offers',
      earnPoints: 'You\'ll earn',
      loyaltyPoints: 'loyalty points',
      removeItem: 'Remove',
      quantity: 'Qty',
      savings: 'You Save',
      orderSummary: 'Order Summary',
    },
    ar: {
      title: 'سلة التسوق',
      empty: 'سلتك فارغة',
      emptyDesc: 'أضف بعض الأصناف اللذيذة للبدء',
      subtotal: 'المجموع الفرعي',
      tax: 'الضرائب والرسوم',
      total: 'المجموع',
      checkout: 'إتمام الطلب',
      continueShopping: 'متابعة التسوق',
      orderType: 'نوع الطلب',
      dineIn: 'تناول الطعام',
      takeaway: 'طلب خارجي',
      delivery: 'التوصيل',
      table: 'الطاولة',
      branch: 'الفرع',
      itemsInCart: 'عناصر في السلة',
      estimatedTime: 'الوقت المتوقع',
      minutes: 'دقيقة',
      promoCode: 'لديك رمز ترويجي؟',
      applyCode: 'تطبيق',
      viewPromotions: 'عرض العروض المتاحة',
      earnPoints: 'ستحصل على',
      loyaltyPoints: 'نقاط ولاء',
      removeItem: 'إزالة',
      quantity: 'الكمية',
      savings: 'وفرت',
      orderSummary: 'ملخص الطلب',
    },
    ru: {
      title: 'Корзина покупок',
      empty: 'Ваша корзина пуста',
      emptyDesc: 'Добавьте вкусные блюда, чтобы начать',
      subtotal: 'Промежуточный итог',
      tax: 'Налоги и сборы',
      total: 'Итого',
      checkout: 'Оформить заказ',
      continueShopping: 'Продолжить покупки',
      orderType: 'Тип заказа',
      dineIn: 'В ресторане',
      takeaway: 'С собой',
      delivery: 'Доставка',
      table: 'Стол',
      branch: 'Филиал',
      itemsInCart: 'товаров в корзине',
      estimatedTime: 'Примерное время',
      minutes: 'мин',
      promoCode: 'Есть промокод?',
      applyCode: 'Применить',
      viewPromotions: 'Посмотреть доступные предложения',
      earnPoints: 'Вы заработаете',
      loyaltyPoints: 'баллов лояльности',
      removeItem: 'Удалить',
      quantity: 'Кол-во',
      savings: 'Вы экономите',
      orderSummary: 'Итоги заказа',
    },
    ky: {
      title: 'Сатып алуу себети',
      empty: 'Себетиңиз бош',
      emptyDesc: 'Башташ үчүн даамдуу нерселерди кошуңуз',
      subtotal: 'Жалпы сумма',
      tax: 'Салыктар жана алымдар',
      total: 'Жыйынтык',
      checkout: 'Буйруткону бүтүрүү',
      continueShopping: 'Сатып алууну улантуу',
      orderType: 'Заказ түрү',
      dineIn: 'Ресторанда',
      takeaway: 'Алып кетүү',
      delivery: 'Жеткирүү',
      table: 'Стол',
      branch: 'Филиал',
      itemsInCart: 'буюмдар себетте',
      estimatedTime: 'Болжолдуу убакыт',
      minutes: 'мүн',
      promoCode: 'Промокодуңуз барбы?',
      applyCode: 'Колдонуу',
      viewPromotions: 'Жеткиликтүү сунуштарды көрүү',
      earnPoints: 'Сиз алаасыз',
      loyaltyPoints: 'берилүү упайлары',
      removeItem: 'Өчүрүү',
      quantity: 'Саны',
      savings: 'Сиз үнөмдөйсүз',
      orderSummary: 'Буйрутманын жыйынтыгы',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // Calculate loyalty points that will be earned using centralized utility
  const pointsToEarn = calculatePointsEarned(cartSubtotal);

  // Get available promotions for current branch
  const branchId = selectedBranch?.id || '';
  const availablePromotions = getBranchPromotions(branchId, promotions).filter(p => p.status === 'active');
  
  const finalTotal = cartTotal - promotionDiscount;

  // Estimate preparation time based on cart size
  const estimatedTime = cart.length <= 3 ? '15-20' : cart.length <= 6 ? '20-30' : '30-40';

  const handleApplyPromoCode = () => {
    const promo = availablePromotions.find(p => p.code?.toUpperCase() === promoCodeInput.toUpperCase());
    if (promo) {
      if (promo.min_order_value && cartSubtotal < promo.min_order_value) {
        setPromoError(`Minimum order value is ${promo.min_order_value} KGS`);
        return;
      }
      
      // Calculate discount
      let discount = 0;
      if (promo.discount_type === 'percentage') {
        discount = promo.discount_value || 0;
      } else {
        discount = promo.discount_value || 0;
      }
      
      setAppliedPromotion({
        code: promo.code || '',
        name: promo.name,
        discount: discount,
        type: promo.discount_type || 'fixed',
      });
      setPromoError('');
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromotion(null);
    setPromoError('');
  };

  const handleRemoveItem = (itemId: string) => {
    setDeletingItemId(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setDeletingItemId(null);
    }, 300);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white p-6 shadow-xl">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                if (currentBranch?.id) {
                  navigate(`/branch/${currentBranch.id}/menu`);
                } else {
                  navigate('/branch-selection');
                }
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-40 h-40 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner"
            >
              <ShoppingBag className="w-20 h-20 text-gray-400" />
            </motion.div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">{t.empty}</h2>
              <p className="text-lg text-gray-600">{t.emptyDesc}</p>
            </div>
            <Button
              onClick={() => {
                if (currentBranch?.id) {
                  navigate(`/branch/${currentBranch.id}/menu`);
                } else {
                  navigate('/branch-selection');
                }
              }}
              size="lg"
              className="bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white px-8 h-14 text-lg shadow-lg"
            >
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              {t.continueShopping}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-36" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-colors"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-sm text-white/80 mt-0.5">
                  {cart.length} {t.itemsInCart}
                </p>
              </div>
            </div>

            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1.5 text-sm">
              <Clock className="w-4 h-4 mr-1.5" />
              {estimatedTime} {t.minutes}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-5 bg-gradient-to-br from-[#667c67]/10 to-[#e4dbc4]/20 border-[#667c67]/20 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {orderType === 'dine-in' && <UtensilsCrossed className="w-6 h-6 text-[#667c67]" />}
                    {orderType === 'takeaway' && <ShoppingBag className="w-6 h-6 text-[#667c67]" />}
                    {orderType === 'delivery' && <Truck className="w-6 h-6 text-[#667c67]" />}
                    <div>
                      <span className="font-bold text-[#667c67] text-lg">
                        {orderType === 'dine-in' && t.dineIn}
                        {orderType === 'takeaway' && t.takeaway}
                        {orderType === 'delivery' && t.delivery}
                      </span>
                      {selectedBranch && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {selectedBranch.translations[currentLanguage]?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {orderType === 'dine-in' && selectedTable && (
                    <Badge variant="secondary" className="font-semibold">
                      {t.table} #{selectedTable}
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Cart Items */}
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: deletingItemId === item.id ? 0 : 1, 
                    x: deletingItemId === item.id ? -100 : 0,
                    scale: deletingItemId === item.id ? 0.9 : 1
                  }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="flex gap-4 p-5">
                      <div className="relative group">
                        <img
                          src={item.menuItem.imageUrl}
                          alt={item.menuItem.translations[currentLanguage]?.name}
                          className="w-28 h-28 object-cover rounded-xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        {item.menuItem.isPopular && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 text-white border-0 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1.5 line-clamp-2 text-gray-900">
                          {item.menuItem.translations[currentLanguage]?.name}
                        </h3>
                        
                        {/* Modifiers */}
                        {item.modifiers.length > 0 && (
                          <div className="flex items-start gap-1.5 mb-2">
                            <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.modifiers.map(m => {
                                const modifier = item.menuItem.modifiers.find(mod => mod.id === m.modifierId);
                                const option = modifier?.options.find(opt => opt.id === m.optionId);
                                return option?.translations[currentLanguage];
                              }).filter(Boolean).join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Special Notes */}
                        {item.notes && (
                          <p className="text-xs text-gray-500 italic mb-3 line-clamp-2 bg-gray-50 rounded px-2 py-1">
                            "{item.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#667c67] text-2xl">
                              {formatStoreCurrency(item.price * item.quantity)}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatStoreCurrency(item.price)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="border-t bg-gradient-to-r from-gray-50 to-white px-5 py-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{t.quantity}</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-[#667c67] hover:bg-[#667c67] hover:text-white transition-all"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <motion.span 
                          key={item.quantity}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className="w-12 text-center font-bold text-xl"
                        >
                          {item.quantity}
                        </motion.span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-[#667c67] hover:bg-[#667c67] hover:text-white transition-all"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-8 bg-gray-300 mx-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary - Right Column (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Promo Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">{t.promoCode}</h3>
                  </div>
                  
                  {appliedPromotion ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-bold text-lg">{appliedPromotion.name}</span>
                          </div>
                          <p className="text-sm text-white/90">Code: {appliedPromotion.code}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 -mr-2"
                          onClick={handleRemovePromoCode}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <span className="text-sm font-medium">{t.savings}:</span>
                        <span className="text-2xl font-bold">${promotionDiscount.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="SAVE20"
                          value={promoCodeInput}
                          onChange={(e) => {
                            setPromoCodeInput(e.target.value.toUpperCase());
                            setPromoError('');
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                          className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono uppercase placeholder:normal-case"
                        />
                        <Button
                          onClick={handleApplyPromoCode}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
                          disabled={!promoCodeInput}
                        >
                          {t.applyCode}
                        </Button>
                      </div>
                      {promoError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {promoError}
                        </motion.div>
                      )}
                      {availablePromotions.length > 0 && (
                        <button
                          onClick={() => navigate(`/branch/${branchId}/promotions`)}
                          className="text-sm text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1.5 hover:underline"
                        >
                          <Gift className="w-4 h-4" />
                          {t.viewPromotions}
                        </button>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Loyalty Points */}
              {pointsToEarn > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <Star className="w-6 h-6 text-white" fill="white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{t.earnPoints}</h3>
                        <p className="text-sm text-gray-700">
                          <span className="font-bold text-[#667c67] text-lg">{pointsToEarn}</span> {t.loyaltyPoints}
                        </p>
                      </div>
                      <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 shadow-xl border-2 border-gray-200">
                  <h3 className="font-bold text-xl mb-5 text-gray-900">{t.orderSummary}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">{t.subtotal}</span>
                      <span className="font-semibold text-gray-900">{formatStoreCurrency(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">{t.tax}</span>
                      <span className="font-semibold text-gray-900">{formatStoreCurrency(cartTax)}</span>
                    </div>
                    {promotionDiscount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-base text-green-600 bg-green-50 -mx-2 px-2 py-2 rounded-lg"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Percent className="w-4 h-4" />
                          Discount
                        </span>
                        <span className="font-bold">-{formatStoreCurrency(promotionDiscount)}</span>
                      </motion.div>
                    )}
                    <div className="flex justify-between text-2xl font-bold border-t-2 pt-4">
                      <span className="text-gray-900">{t.total}</span>
                      <span className="text-[#667c67]">{formatStoreCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/checkout')}
                    size="lg"
                    className="w-full mt-6 h-14 text-lg font-bold bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="flex-1">{t.checkout}</span>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-2xl z-50 safe-area-bottom">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-3xl font-bold text-[#667c67]">{formatStoreCurrency(finalTotal)}</span>
          </div>
          
          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white shadow-xl"
          >
            <span className="flex-1">{t.checkout}</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
          
          <button
            onClick={() => {
              if (currentBranch?.id) {
                navigate(`/branch/${currentBranch.id}/menu`);
              } else {
                navigate('/branch-selection');
              }
            }}
            className="w-full mt-3 py-3 text-sm font-semibold text-[#667c67] hover:bg-[#667c67]/5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            {t.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
}