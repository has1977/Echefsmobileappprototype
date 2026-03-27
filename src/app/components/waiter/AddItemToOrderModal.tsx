import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Search, Plus, Minus, Star, Flame, Sparkles, Tag,
  UtensilsCrossed, Coffee, Cake, Users, Check, ChevronRight,
  AlertCircle, Leaf, Award, Crown, ShoppingCart, Trash2, Grid3x3, List, Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { GlassCard, GradientButton, Chip } from '../../design-system';
import type { MenuType, MenuItem } from '../../lib/types';

interface AddItemToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
  currentLanguage?: string;
}

export function AddItemToOrderModal({ 
  isOpen, 
  onClose, 
  onAddItem,
  currentLanguage: propLanguage = 'en' 
}: AddItemToOrderModalProps) {
  const { categories, menuItems, isRTL, availableLanguages } = useApp();
  
  const [selectedMenuType, setSelectedMenuType] = useState<MenuType>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentLanguage, setCurrentLanguage] = useState(propLanguage);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMenuType('main');
      setSelectedCategory(null);
      setSearchQuery('');
      setSelectedItem(null);
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedModifiers([]);
      setCurrentLanguage(propLanguage);
    }
  }, [isOpen, propLanguage]);

  const translations = {
    en: {
      addItem: 'Add Item to Order',
      search: 'Search dishes...',
      all: 'All',
      quantity: 'Quantity',
      specialInstructions: 'Special Instructions',
      addToOrder: 'Add to Order',
      cancel: 'Cancel',
      itemDetails: 'Item Details',
      modifiers: 'Modifiers',
      back: 'Back',
      noItems: 'No items found',
      tryDifferent: 'Try a different search or category',
      addModifier: 'Add',
      removeModifier: 'Remove',
      optional: 'Optional',
      total: 'Total',
    },
    ar: {
      addItem: 'إضافة عنصر للطلب',
      search: 'البحث عن الأطباق...',
      all: 'الكل',
      quantity: 'الكمية',
      specialInstructions: 'ملاحظات خاصة',
      addToOrder: 'إضافة للطلب',
      cancel: 'إلغاء',
      itemDetails: 'تفاصيل العنصر',
      modifiers: 'التعديلات',
      back: 'رجوع',
      noItems: 'لا توجد عناصر',
      tryDifferent: 'جرب بحث أو تصنيف مختلف',
      addModifier: 'إضافة',
      removeModifier: 'إزالة',
      optional: 'اختياري',
      total: 'المجموع',
    },
    ru: {
      addItem: 'Добавить в заказ',
      search: 'Поиск блюд...',
      all: 'Все',
      quantity: 'Количество',
      specialInstructions: 'Особые пожелания',
      addToOrder: 'Добавить в заказ',
      cancel: 'Отмена',
      itemDetails: 'Детали блюда',
      modifiers: 'Модификаторы',
      back: 'Назад',
      noItems: 'Товары не найдены',
      tryDifferent: 'Попробуйте другой поиск или категорию',
      addModifier: 'Добавить',
      removeModifier: 'Удалить',
      optional: 'Опционально',
      total: 'Итого',
    },
    ky: {
      addItem: 'Заказга кошуу',
      search: 'Тамактарды издөө...',
      all: 'Баары',
      quantity: 'Саны',
      specialInstructions: 'Атайын эскертмелер',
      addToOrder: 'Заказга кошуу',
      cancel: 'Жокко чыгаруу',
      itemDetails: 'Деталдуулук',
      modifiers: 'Өзгөртүүлөр',
      back: 'Артка',
      noItems: 'Нерселер табылган жок',
      tryDifferent: 'Башка издөө же категорияны колдонуңуз',
      addModifier: 'Кошуу',
      removeModifier: 'Алып салуу',
      optional: 'Тандоо боюнча',
      total: 'Жалпы',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const menuTypeIcons: Record<MenuType, any> = {
    main: UtensilsCrossed,
    business: Users,
    kids: Cake,
    drinks: Coffee,
    desserts: Sparkles,
  };

  const menuTypeLabels: Record<MenuType, Record<string, string>> = {
    main: { en: 'Main Menu', ar: 'القائمة الرئيسية', ru: 'Основное меню', ky: 'Негизги меню' },
    business: { en: 'Business', ar: 'أعمال', ru: 'Бизнес', ky: 'Бизнес' },
    kids: { en: 'Kids', ar: 'أطفال', ru: 'Детское', ky: 'Балдар' },
    drinks: { en: 'Drinks', ar: 'مشروبات', ru: 'Напитки', ky: 'Суусундуктар' },
    desserts: { en: 'Desserts', ar: 'حلويات', ru: 'Десерты', ky: 'Десерттер' },
  };

  // Filter categories by menu type
  const filteredCategories = categories.filter(cat => cat.menuType === selectedMenuType && cat.enabled);

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesMenuType = item.menuType === selectedMenuType;
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.translations[currentLanguage]?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translations[currentLanguage]?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const isEnabled = item.enabled;
    const isAvailable = item.available !== false;
    
    return matchesMenuType && matchesCategory && matchesSearch && isEnabled && isAvailable;
  });

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialInstructions('');
    setSelectedModifiers([]);
  };

  const handleAddToOrder = () => {
    if (!selectedItem) return;

    const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + (mod.price || 0), 0);
    const itemTotal = (selectedItem.price + modifiersTotal) * quantity;

    const orderItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      menuItemId: selectedItem.id,
      name: selectedItem.translations[currentLanguage]?.name || selectedItem.translations.en.name,
      quantity,
      price: selectedItem.price,
      total: itemTotal,
      status: 'pending' as const,
      special_instructions: specialInstructions,
      modifiers: selectedModifiers,
      image_url: selectedItem.imageUrl,
      category: selectedItem.categoryId,
    };

    onAddItem(orderItem);
    toast.success(`✅ ${orderItem.name} added to order`);
    setSelectedItem(null);
  };

  const toggleModifier = (modifier: any) => {
    setSelectedModifiers(prev => {
      const exists = prev.find(m => m.id === modifier.id);
      if (exists) {
        return prev.filter(m => m.id !== modifier.id);
      } else {
        return [...prev, modifier];
      }
    });
  };

  if (!isOpen) return null;

  // Item Details View
  if (selectedItem) {
    const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + (mod.price || 0), 0);
    const itemTotal = (selectedItem.price + modifiersTotal) * quantity;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header with Image */}
            <div className="relative h-64 bg-gradient-to-br from-[#667c67] to-[#546352]">
              <img
                src={selectedItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                alt={selectedItem.translations[currentLanguage]?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Item Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedItem.translations[currentLanguage]?.name}
                </h2>
                <p className="text-white/90 text-sm mb-3">
                  {selectedItem.translations[currentLanguage]?.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip variant="success" size="sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1">{selectedItem.rating || 4.5}</span>
                  </Chip>
                  {selectedItem.badges?.includes('hot') && (
                    <Chip variant="error" size="sm">
                      <Flame className="w-3 h-3" />
                      <span className="ml-1">Hot</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('new') && (
                    <Chip variant="info" size="sm">
                      <Sparkles className="w-3 h-3" />
                      <span className="ml-1">New</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('recommended') && (
                    <Chip variant="success" size="sm">
                      <Award className="w-3 h-3" />
                      <span className="ml-1">Top Pick</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('popular') && (
                    <Chip variant="warning" size="sm">
                      <Star className="w-3 h-3" />
                      <span className="ml-1">Popular</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('vegan') && (
                    <Chip variant="success" size="sm">
                      <Leaf className="w-3 h-3" />
                      <span className="ml-1">Vegan</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('premium') && (
                    <Chip variant="warning" size="sm">
                      <Crown className="w-3 h-3" />
                      <span className="ml-1">Premium</span>
                    </Chip>
                  )}
                  {selectedItem.badges?.includes('discount') && (
                    <Chip variant="error" size="sm">
                      <Tag className="w-3 h-3" />
                      <span className="ml-1">Sale</span>
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.quantity}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-[#667c67] hover:bg-[#546352] flex items-center justify-center transition-all"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modifiers */}
              {selectedItem.modifiers && selectedItem.modifiers.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t.modifiers} <span className="text-gray-400 font-normal">({t.optional})</span>
                  </label>
                  <div className="space-y-4">
                    {selectedItem.modifiers.map((modifier) => (
                      <div key={modifier.id} className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600">
                          {modifier.translations[currentLanguage] || modifier.translations['en']}
                        </h4>
                        {modifier.options.map((option) => {
                          const isSelected = selectedModifiers.find(m => m.id === option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleModifier(option)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-[#667c67] bg-[#667c67]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-[#667c67] bg-[#667c67]'
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {option.translations[currentLanguage] || option.translations['en']}
                                </span>
                              </div>
                              <span className="font-semibold text-[#667c67]">
                                {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.specialInstructions}
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., No onions, extra cheese..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">{t.total}:</span>
                <span className="text-2xl font-bold text-[#667c67]">
                  ${itemTotal.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-all"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleAddToOrder}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#667c67] to-[#546352] hover:from-[#546352] hover:to-[#667c67] text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t.addToOrder}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Menu Selection View
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#667c67] to-[#546352] text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t.addItem}</h2>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
                    <Globe className="w-5 h-5" />
                  </button>
                  <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[150px]">
                    {availableLanguages.filter(lang => lang.enabled).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all flex items-center gap-3 ${
                          currentLanguage === lang.code ? 'bg-[#667c67]/10 text-[#667c67] font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm">{lang.nativeName}</span>
                        {currentLanguage === lang.code && <Check className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                      viewMode === 'grid' ? 'bg-white/30' : 'hover:bg-white/10'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                      viewMode === 'list' ? 'bg-white/30' : 'hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Menu Types */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {(Object.keys(menuTypeIcons) as MenuType[]).map((type) => {
                const Icon = menuTypeIcons[type];
                const isActive = selectedMenuType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedMenuType(type);
                      setSelectedCategory(null);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
                      isActive
                        ? 'bg-[#667c67] text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{menuTypeLabels[type][currentLanguage]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap shadow-sm ${
                  !selectedCategory
                    ? 'bg-[#667c67] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {t.all}
              </button>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap shadow-sm ${
                    selectedCategory === category.id
                      ? 'bg-[#667c67] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {category.translations[currentLanguage] || category.translations['en'] || 'Category'}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredItems.length > 0 ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Item Image */}
                    <div className={`relative bg-gray-200 ${
                      viewMode === 'grid' ? 'h-40' : 'w-48 h-full'
                    }`}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                        alt={item.translations[currentLanguage]?.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
                        {item.badges?.includes('hot') && (
                          <Chip variant="error" size="sm">
                            <Flame className="w-3 h-3" />
                            <span className="ml-1 text-xs">Hot</span>
                          </Chip>
                        )}
                        {item.badges?.includes('new') && (
                          <Chip variant="info" size="sm">
                            <Sparkles className="w-3 h-3" />
                            <span className="ml-1 text-xs">New</span>
                          </Chip>
                        )}
                        {item.badges?.includes('recommended') && (
                          <Chip variant="success" size="sm">
                            <Award className="w-3 h-3" />
                            <span className="ml-1 text-xs">Top Pick</span>
                          </Chip>
                        )}
                        {item.badges?.includes('popular') && (
                          <Chip variant="warning" size="sm">
                            <Star className="w-3 h-3" />
                            <span className="ml-1 text-xs">Popular</span>
                          </Chip>
                        )}
                        {item.badges?.includes('vegan') && (
                          <Chip variant="success" size="sm">
                            <Leaf className="w-3 h-3" />
                            <span className="ml-1 text-xs">Vegan</span>
                          </Chip>
                        )}
                        {item.badges?.includes('premium') && (
                          <Chip variant="warning" size="sm">
                            <Crown className="w-3 h-3" />
                            <span className="ml-1 text-xs">Premium</span>
                          </Chip>
                        )}
                        {item.badges?.includes('discount') && (
                          <Chip variant="error" size="sm">
                            <Tag className="w-3 h-3" />
                            <span className="ml-1 text-xs">Sale</span>
                          </Chip>
                        )}
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.translations[currentLanguage]?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                        {item.translations[currentLanguage]?.description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-[#667c67]">
                            ${item.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating || 4.5}</span>
                          </div>
                        </div>
                        
                        {/* Add to Order Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectItem(item);
                          }}
                          className="px-4 py-2 bg-[#667c67] hover:bg-[#556856] text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Plus className="w-4 h-4" />
                          {t.addToOrder || 'Add'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t.noItems}</h3>
                <p className="text-gray-500">{t.tryDifferent}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
