import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight, UtensilsCrossed, Truck, MapPin, Clock, Tag, Star, Sparkles, Gift, Percent, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { promotions } from '../services/promotionsData';
import { getBranchPromotions } from '../services/branchLoyaltyData';

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

  const isRTL = currentLanguage === 'ar';

  const translations = {
    en: {
      title: 'Cart',
      empty: 'Your cart is empty',
      emptyDesc: 'Add some delicious items to get started',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping',
      orderType: 'Order Type',
      dineIn: 'Dine-In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      table: 'Table',
      branch: 'Branch',
    },
    ar: {
      title: 'السلة',
      empty: 'سلتك فارغة',
      emptyDesc: 'أضف بعض الأصناف اللذيذة للبدء',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      total: 'المجموع',
      checkout: 'إتمام الطلب',
      continueShopping: 'متابعة التسوق',
      orderType: 'نوع الطلب',
      dineIn: 'تناول الطعام',
      takeaway: 'طلب خارجي',
      delivery: 'التوصيل',
      table: 'الطاولة',
      branch: 'الفرع',
    },
    ru: {
      title: 'Корзина',
      empty: 'Ваша корзина пуста',
      emptyDesc: 'Добавьте вкусные блюда, чтобы начать',
      subtotal: 'Промежуточный итог',
      tax: 'Налог',
      total: 'Итого',
      checkout: 'Оформить заказ',
      continueShopping: 'Продолжить покупки',
      orderType: 'Тип заказа',
      dineIn: 'В ресторане',
      takeaway: 'С собой',
      delivery: 'Доставка',
      table: 'Стол',
      branch: 'Филиал',
    },
    ky: {
      title: 'Себет',
      empty: 'Себетиңиз бош',
      emptyDesc: 'Башташ үчүн даамдуу нерселерди кошуңуз',
      subtotal: 'Жалпы сумма',
      tax: 'Салык',
      total: 'Жыйынтык',
      checkout: 'Буйруткону бүтүрүү',
      continueShopping: 'Сатып алууну улантуу',
      orderType: 'Заказ түрү',
      dineIn: 'Ресторанда',
      takeaway: 'Алып кетүү',
      delivery: 'Жеткирүү',
      table: 'Стол',
      branch: 'Филиал',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // Calculate loyalty points that will be earned
  const pointsToEarn = Math.floor(cartSubtotal / 10); // 1 point per 10 KGS

  // Get available promotions for current branch
  const branchId = selectedBranch?.id || '';
  const availablePromotions = getBranchPromotions(branchId, promotions).filter(p => p.status === 'active');
  
  const finalTotal = cartTotal - promotionDiscount;

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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-[#667c67] text-white p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                // Navigate to branch menu if we have a branch, otherwise go to branch selection
                if (currentBranch?.id) {
                  navigate(`/branch/${currentBranch.id}/menu`);
                } else {
                  navigate('/branch-selection');
                }
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">{t.title}</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-sm"
          >
            <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{t.empty}</h2>
              <p className="text-muted-foreground">{t.emptyDesc}</p>
            </div>
            <Button
              onClick={() => {
                // Navigate to branch menu if we have a branch, otherwise go to branch selection
                if (currentBranch?.id) {
                  navigate(`/branch/${currentBranch.id}/menu`);
                } else {
                  navigate('/branch-selection');
                }
              }}
              className="bg-[#667c67] hover:bg-[#526250]"
            >
              {t.continueShopping}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-lg">
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-sm text-white/80">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Info Card */}
        <Card className="p-4 bg-[#667c67]/5 border-[#667c67]/20">
          <div className="flex items-center gap-3 mb-3">
            {orderType === 'dine-in' && <UtensilsCrossed className="w-5 h-5 text-[#667c67]" />}
            {orderType === 'takeaway' && <ShoppingBag className="w-5 h-5 text-[#667c67]" />}
            {orderType === 'delivery' && <Truck className="w-5 h-5 text-[#667c67]" />}
            <span className="font-semibold text-[#667c67]">
              {orderType === 'dine-in' && t.dineIn}
              {orderType === 'takeaway' && t.takeaway}
              {orderType === 'delivery' && t.delivery}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            {selectedBranch && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{selectedBranch.translations[currentLanguage]?.name}</span>
              </div>
            )}
            
            {orderType === 'dine-in' && selectedTable && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <UtensilsCrossed className="w-4 h-4" />
                <span>{t.table} #{selectedTable}</span>
              </div>
            )}
            
            {(orderType === 'takeaway' || orderType === 'delivery') && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Ready in 15-20 min</span>
              </div>
            )}
          </div>
        </Card>

        {cart.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="flex gap-4 p-4">
                <img
                  src={item.menuItem.imageUrl}
                  alt={item.menuItem.translations[currentLanguage]?.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 line-clamp-2">
                    {item.menuItem.translations[currentLanguage]?.name}
                  </h3>
                  
                  {/* Modifiers */}
                  {item.modifiers.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.modifiers.map(m => {
                        const modifier = item.menuItem.modifiers.find(mod => mod.id === m.modifierId);
                        const option = modifier?.options.find(opt => opt.id === m.optionId);
                        return option?.translations[currentLanguage];
                      }).filter(Boolean).join(', ')}
                    </p>
                  )}

                  {/* Special Notes */}
                  {item.notes && (
                    <p className="text-xs text-muted-foreground italic mb-2 line-clamp-1">
                      Note: {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#667c67] text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls - Full Width Bottom Section */}
              <div className="border-t bg-muted/30 p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-2"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-2"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Promo Code Section */}
        <Card className="p-4 bg-gradient-to-br from-[#667c67]/5 to-[#526250]/5 border-[#667c67]/20">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-[#667c67]" />
            <h3 className="font-semibold text-[#667c67]">Promo Code</h3>
          </div>
          
          {appliedPromotion ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold">{appliedPromotion.name}</span>
                  </div>
                  <p className="text-xs text-white/90">Code: {appliedPromotion.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 -mr-2"
                  onClick={handleRemovePromoCode}
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                <span className="text-sm">You save:</span>
                <span className="text-xl font-bold">${promotionDiscount.toFixed(2)}</span>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667c67]"
                />
                <Button
                  onClick={handleApplyPromoCode}
                  className="bg-[#667c67] hover:bg-[#526250]"
                  disabled={!promoCodeInput}
                >
                  Apply
                </Button>
              </div>
              {promoError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  {promoError}
                </motion.div>
              )}
              {availablePromotions.length > 0 && (
                <button
                  onClick={() => navigate(`/branch/${branchId}/promotions`)}
                  className="text-sm text-[#667c67] hover:underline flex items-center gap-1"
                >
                  <Gift className="w-3 h-3" />
                  View available promotions
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Loyalty Points Preview */}
        {pointsToEarn > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Earn Loyalty Points</h3>
                  <p className="text-sm text-gray-600">You'll earn <span className="font-bold text-[#667c67]">{pointsToEarn} points</span> from this order!</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order Summary */}
        <Card className="p-4 space-y-3 bg-muted/50">
          <div className="flex justify-between text-sm">
            <span>{t.subtotal}</span>
            <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t.tax}</span>
            <span className="font-semibold">${cartTax.toFixed(2)}</span>
          </div>
          {promotionDiscount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between text-sm text-green-600"
            >
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Promotion Discount
              </span>
              <span className="font-semibold">-${promotionDiscount.toFixed(2)}</span>
            </motion.div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>{t.total}</span>
            <span className="text-[#667c67]">${finalTotal.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 safe-area-bottom">
        <div className="p-4 space-y-3">
          {/* Total Summary */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-[#667c67]">${finalTotal.toFixed(2)}</span>
          </div>
          
          {/* Checkout Button */}
          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#667c67] to-[#526250] hover:from-[#526250] hover:to-[#667c67] text-white shadow-lg"
          >
            <span className="flex-1">{t.checkout}</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}