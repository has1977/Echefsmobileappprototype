import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Minus, Plus, Star, Clock, Flame, 
  Heart, Share2, AlertCircle, Check, ShoppingCart, X, Info
} from 'lucide-react';
import type { SelectedModifier } from '../lib/types';

export function MenuItemDetailPage() {
  const navigate = useNavigate();
  const { branchId, itemId } = useParams();
  const { menuItems, addToCart, currentLanguage, cart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const item = menuItems.find(i => i.id === itemId);
  const isRTL = currentLanguage === 'ar';

  const translations = {
    en: {
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      required: 'Required',
      optional: 'Optional',
      notes: 'Special Instructions',
      notesPlaceholder: 'E.g., No onions, extra spicy...',
      nutrition: 'Nutrition',
      calories: 'cal',
      prepTime: 'Prep Time',
      minutes: 'min',
      allergens: 'Allergens',
      chooseOption: 'Choose an option',
      customize: 'Customize Your Order',
      total: 'Total',
      size: 'Size',
      extras: 'Add Extras',
      remove: 'Remove Ingredients',
      backToMenu: 'Back to Menu',
      addedToCart: 'Added to Cart!',
      ingredients: 'Ingredients',
      description: 'Description',
    },
    ar: {
      quantity: 'الكمية',
      addToCart: 'إضافة إلى السلة',
      required: 'مطلوب',
      optional: 'اختياري',
      notes: 'تعليمات خاصة',
      notesPlaceholder: 'مثال: بدون بصل، حار جداً...',
      nutrition: 'التغذية',
      calories: 'سعرة',
      prepTime: 'وقت التحضير',
      minutes: 'دقيقة',
      allergens: 'مسببات الحساسية',
      chooseOption: 'اختر خياراً',
      customize: 'تخصيص طلبك',
      total: 'المجموع',
      size: 'الحجم',
      extras: 'إضافات',
      remove: 'إزالة مكونات',
      backToMenu: 'العودة للقائمة',
      addedToCart: 'تمت الإضافة!',
      ingredients: 'المكونات',
      description: 'الوصف',
    },
    ru: {
      quantity: 'Количество',
      addToCart: 'В корзину',
      required: 'Обязательно',
      optional: 'Необязательно',
      notes: 'Особые пожелания',
      notesPlaceholder: 'Например: без лука, острее...',
      nutrition: 'Питательность',
      calories: 'кал',
      prepTime: 'Время',
      minutes: 'мин',
      allergens: 'Аллергены',
      chooseOption: 'Выберите опцию',
      customize: 'Настроить заказ',
      total: 'Итого',
      size: 'Размер',
      extras: 'Добавки',
      remove: 'Убрать ингредиенты',
      backToMenu: 'Назад в меню',
      addedToCart: 'Добавлено!',
      ingredients: 'Состав',
      description: 'Описание',
    },
    ky: {
      quantity: 'Саны',
      addToCart: 'Себетке кошуу',
      required: 'Милдеттүү',
      optional: 'Тандоо боюнча',
      notes: 'Атайын көрсөтмөлөр',
      notesPlaceholder: 'Мисалы: пиязсыз, ачуу...',
      nutrition: 'Тамак-аш',
      calories: 'кал',
      prepTime: 'Убакыт',
      minutes: 'мүн',
      allergens: 'Аллергендер',
      chooseOption: 'Тандоо',
      customize: 'Буйрутканды ыңгайлаштыруу',
      total: 'Жыйынтык',
      size: 'Өлчөм',
      extras: 'Кошумчалар',
      remove: 'Ингредиенттерди алып салуу',
      backToMenu: 'Менюга кайтуу',
      addedToCart: 'Кошулду!',
      ingredients: 'Курамы',
      description: 'Сүрөттөмө',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <button
            onClick={() => navigate(`/branch/${branchId}/menu`)}
            className="px-6 py-3 bg-[#667c67] text-white rounded-xl font-semibold hover:bg-[#546352] transition-all"
          >
            {t.backToMenu}
          </button>
        </div>
      </div>
    );
  }

  const handleModifierSelect = (modifierId: string, optionId: string) => {
    const modifier = item.modifiers.find(m => m.id === modifierId);
    if (!modifier) return;

    if (modifier.type === 'choice' || modifier.type === 'size') {
      // Replace existing selection
      setSelectedModifiers(prev => [
        ...prev.filter(m => m.modifierId !== modifierId),
        { modifierId, optionId }
      ]);
    } else {
      // Toggle selection for add/remove types
      setSelectedModifiers(prev => {
        const exists = prev.find(m => m.modifierId === modifierId && m.optionId === optionId);
        if (exists) {
          return prev.filter(m => !(m.modifierId === modifierId && m.optionId === optionId));
        } else {
          return [...prev, { modifierId, optionId }];
        }
      });
    }
  };

  const calculateTotalPrice = () => {
    let total = item.price;
    selectedModifiers.forEach(selected => {
      const modifier = item.modifiers.find(m => m.id === selected.modifierId);
      const option = modifier?.options.find(o => o.id === selected.optionId);
      if (option) {
        total += option.price;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      menuItem: item,
      quantity,
      modifiers: selectedModifiers,
      price: item.price,
      notes,
    });
    
    // Navigate back to menu
    setTimeout(() => {
      navigate(`/branch/${branchId}/menu`);
    }, 100);
  };

  const isOptionSelected = (modifierId: string, optionId: string) => {
    return selectedModifiers.some(m => m.modifierId === modifierId && m.optionId === optionId);
  };

  // Check if all required modifiers are selected
  const requiredModifiers = item.modifiers.filter(m => m.required);
  const allRequiredSelected = requiredModifiers.every(modifier => 
    selectedModifiers.some(sm => sm.modifierId === modifier.id)
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Image */}
      <div className="relative h-[400px] bg-white">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
          alt={item.translations[currentLanguage]?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/branch/${branchId}/menu`)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </motion.button>

        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
        </motion.button>

        {/* Badges */}
        {item.badges && item.badges.length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {item.badges.slice(0, 3).map((badge, idx) => {
              const badgeColors: Record<string, string> = {
                hot: 'bg-red-500',
                new: 'bg-blue-500',
                discount: 'bg-green-500',
                popular: 'bg-yellow-500',
                recommended: 'bg-purple-500',
                spicy: 'bg-orange-500',
              };
              
              return (
                <Badge key={idx} className={`${badgeColors[badge] || 'bg-gray-500'} text-white border-0 shadow-lg`}>
                  {badge}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Rating */}
        {item.rating && (
          <div className="absolute bottom-4 right-4 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        {/* Title Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {item.translations[currentLanguage]?.name || item.translations['en']?.name || 'Dish'}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            {item.translations[currentLanguage]?.description || item.translations['en']?.description || ''}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm">
            {item.prepTime && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-[#667c67]" />
                <span className="font-semibold">{item.prepTime} {t.minutes}</span>
              </div>
            )}
            {item.nutrition?.calories && (
              <div className="flex items-center gap-2 text-gray-600">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">{item.nutrition.calories} {t.calories}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modifiers */}
        {item.modifiers && item.modifiers.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.customize}</h2>
            
            <div className="space-y-6">
              {item.modifiers.map((modifier, modIdx) => {
                const modifierLabel = modifier.translations?.[currentLanguage] || modifier.translations?.['en'] || modifier.id;
                
                return (
                  <div key={modifier.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        {modifierLabel}
                        {modifier.required && (
                          <Badge className="ml-2 bg-red-500 text-white border-0">
                            {t.required}
                          </Badge>
                        )}
                      </h3>
                      {!modifier.required && (
                        <Badge className="bg-gray-200 text-gray-700 border-0">
                          {t.optional}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      {modifier.options.map((option) => {
                        const optionLabel = option.translations?.[currentLanguage] || option.translations?.['en'] || option.id;
                        const isSelected = isOptionSelected(modifier.id, option.id);
                        const isChoiceType = modifier.type === 'choice' || modifier.type === 'size';

                        return (
                          <motion.button
                            key={option.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleModifierSelect(modifier.id, option.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#667c67] bg-[#667c67]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Radio/Checkbox */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-[#667c67] bg-[#667c67]' : 'border-gray-300'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                
                                <div>
                                  <div className="font-semibold text-gray-900">{optionLabel}</div>
                                  {option.description && (
                                    <div className="text-sm text-gray-600 mt-0.5">{option.description}</div>
                                  )}
                                </div>
                              </div>
                              
                              {option.price > 0 && (
                                <span className="font-bold text-[#667c67]">
                                  +${option.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Special Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="font-bold text-gray-900 mb-3">{t.notes}</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none resize-none transition-all"
          />
        </motion.div>

        {/* Allergens & Nutrition */}
        {(item.allergens?.length || item.nutrition) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            {item.allergens && item.allergens.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">{t.allergens}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen, idx) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-700 border-orange-200">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {item.nutrition && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t.nutrition}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {item.nutrition.protein && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-semibold text-gray-900">{item.nutrition.protein}g</span>
                    </div>
                  )}
                  {item.nutrition.carbs && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-semibold text-gray-900">{item.nutrition.carbs}g</span>
                    </div>
                  )}
                  {item.nutrition.fat && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-semibold text-gray-900">{item.nutrition.fat}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-gray-900 hover:bg-gray-200 transition-all shadow-sm"
              >
                <Minus className="w-5 h-5" />
              </motion.button>
              <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-gray-900 hover:bg-gray-200 transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!allRequiredSelected}
              className={`flex-1 h-14 rounded-xl flex items-center justify-between px-6 font-bold text-lg shadow-lg transition-all ${
                allRequiredSelected
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#FF5722] hover:to-[#FF6B35] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{t.addToCart}</span>
              <span className="font-bold">${calculateTotalPrice().toFixed(2)}</span>
            </motion.button>
          </div>

          {!allRequiredSelected && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <Info className="w-4 h-4" />
              <span>Please select all required options</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}