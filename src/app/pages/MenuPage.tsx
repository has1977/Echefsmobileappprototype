import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, Plus, Star, Flame, Sparkles, Tag, Heart, 
  UtensilsCrossed, Coffee, Cake, Users, FolderTree, ChevronRight,
  Clock, TrendingUp, Filter, X, Leaf, Wheat, ChefHat, Grid3x3, List, LayoutGrid, Check
} from 'lucide-react';
import { GlassCard, GradientButton, Chip, EmptyState, motion, AnimatePresence } from '../design-system';
import type { MenuType } from '../lib/types';

export function MenuPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { 
    selectedBranch, 
    categories, 
    menuItems, 
    currentLanguage,
    cart,
    addToCart,
    currentMenuType,
    setCurrentMenuType,
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<{
    badges: string[];
    dietary: string[];
    priceRange: string | null;
  }>({
    badges: [],
    dietary: [],
    priceRange: null,
  });

  const isRTL = currentLanguage === 'ar';

  // Check if branch is valid
  useEffect(() => {
    if (!selectedBranch || selectedBranch.id !== branchId) {
      navigate('/branch-selection');
    }
  }, [selectedBranch, branchId, navigate]);

  // Return early if no branch
  if (!selectedBranch) {
    return null;
  }

  const translations = {
    en: { 
      search: 'Search dishes...', 
      addToCart: 'Add',
      added: '✓ Added',
      specialOffers: 'Special Offers',
      offersDesc: 'View promotions & exclusive deals',
      noItems: 'No items found',
      trySearch: 'Try adjusting your filters',
      all: 'All',
      viewDetails: 'View Details',
      bestseller: 'Bestseller',
      newItem: 'New',
      spicy: 'Spicy',
      filters: 'Filters',
      clearAll: 'Clear All',
      apply: 'Apply Filters',
      badges: 'Popular Tags',
      dietary: 'Dietary',
      priceRange: 'Price Range',
      vegan: 'Vegan',
      glutenFree: 'Gluten Free',
      popular: 'Popular',
      new: 'New',
      hot: 'Hot',
      discount: 'Discount',
      recommended: 'Recommended',
      budget: '$0-$15',
      mid: '$15-$30',
      premium: '$30+',
      from: 'from',
      menu: 'Menu',
    },
    ar: { 
      search: 'البحث عن الأطباق...', 
      addToCart: 'إضافة',
      added: '✓ تمت الإضافة',
      specialOffers: 'عروض خاصة',
      offersDesc: 'عرض العروض والصفقات الحصرية',
      noItems: 'لا توجد عناصر',
      trySearch: 'حاول تعديل الفلاتر',
      all: 'الكل',
      viewDetails: 'عرض التفاصيل',
      bestseller: 'الأكثر مبيعًا',
      newItem: 'جديد',
      spicy: 'حار',
      filters: 'الفلاتر',
      clearAll: 'مسح الكل',
      apply: 'تطبيق',
      badges: 'العلامات الشائعة',
      dietary: 'النظام الغذائي',
      priceRange: 'نطاق السعر',
      vegan: 'نباتي',
      glutenFree: 'خالٍ من الغلوتين',
      popular: 'شائع',
      new: 'جديد',
      hot: 'ساخن',
      discount: 'تخفيض',
      recommended: 'موصى به',
      budget: '$0-$15',
      mid: '$15-$30',
      premium: '$30+',
      from: 'من',
      menu: 'القائمة',
      gridView: 'شبكة',
      listView: 'قائمة',
      compactView: 'مضغوط',
    },
    ru: { 
      search: 'Поиск блюд...', 
      addToCart: 'Добавить',
      added: '✓ Добавлено',
      specialOffers: 'Специальные предложения',
      offersDesc: 'Просмотр акций и эксклюзивных предложений',
      noItems: 'Товары не найдены',
      trySearch: 'Попробуйте изменить фильтры',
      all: 'Все',
      viewDetails: 'Подробнее',
      bestseller: 'Бестселлер',
      newItem: 'Новинка',
      spicy: 'Острое',
      filters: 'Фильтры',
      clearAll: 'Очистить все',
      apply: 'Применить',
      badges: 'Метки',
      dietary: 'Диета',
      priceRange: 'Цена',
      vegan: 'Веган',
      glutenFree: 'Без глютена',
      popular: 'Популярное',
      new: 'Новинка',
      hot: 'Горячее',
      discount: 'Скидка',
      recommended: 'Рекомендуем',
      budget: '$0-$15',
      mid: '$15-$30',
      premium: '$30+',
      from: 'от',
      menu: 'Меню',
      gridView: 'Сетка',
      listView: 'Список',
      compactView: 'Компактно',
    },
    ky: { 
      search: 'Тамактарды издөө...', 
      addToCart: 'Кошуу',
      added: '✓ Кошулду',
      specialOffers: 'Атайын сунуштар',
      offersDesc: 'Акцияларды жана эксклюзивдүү сунуштарды көрүү',
      noItems: 'Нерселер табылган жок',
      trySearch: 'Фильтрлерди өзгөртүп көрүңүз',
      all: 'Баары',
      viewDetails: 'Деталдуулук',
      bestseller: 'Сатылуучу',
      newItem: 'Жаңы',
      spicy: 'Ачуу',
      filters: 'Фильтрлер',
      clearAll: 'Бардыгын тазалоо',
      apply: 'Колдонуу',
      badges: 'Белгилер',
      dietary: 'Диета',
      priceRange: 'Баа',
      vegan: 'Веган',
      glutenFree: 'Глютенсиз',
      popular: 'Популярдуу',
      new: 'Жаңы',
      hot: 'Ысык',
      discount: 'Арзандатуу',
      recommended: 'Сунуштайбыз',
      budget: '$0-$15',
      mid: '$15-$30',
      premium: '$30+',
      from: 'ден',
      menu: 'Меню',
      gridView: 'Тор',
      listView: 'Тизме',
      compactView: 'Ыкчам',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const menuTypeIcons: Record<MenuType, any> = {
    main: UtensilsCrossed,
    business: FolderTree,
    kids: Users,
    drinks: Coffee,
    desserts: Cake,
    breakfast: Coffee,
    lunch: UtensilsCrossed,
    dinner: UtensilsCrossed,
  };

  const menuTypeLabels: Record<MenuType, Record<string, string>> = {
    main: { en: 'Main', ar: 'رئيسي', ru: 'Основное', ky: 'Негизги' },
    business: { en: 'Business', ar: 'عمل', ru: 'Бизнес', ky: 'Бизнес' },
    kids: { en: 'Kids', ar: 'أطفال', ru: 'Детское', ky: 'Балдар' },
    drinks: { en: 'Drinks', ar: 'مشروبات', ru: 'Напитки', ky: 'Суусундуктар' },
    desserts: { en: 'Desserts', ar: 'حلويات', ru: 'Десерты', ky: 'Десерттер' },
    breakfast: { en: 'Breakfast', ar: 'فطور', ru: 'Завтрак', ky: 'Эртең мененки' },
    lunch: { en: 'Lunch', ar: 'غداء', ru: 'Обед', ky: 'Түшкү' },
    dinner: { en: 'Dinner', ar: 'عشاء', ru: 'Ужин', ky: 'Кечки' },
  };

  const badgeConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
    hot: { icon: Flame, color: '#DC2626', bgColor: '#FEE2E2', label: t.hot },
    new: { icon: Sparkles, color: '#2563EB', bgColor: '#DBEAFE', label: t.newItem },
    discount: { icon: Tag, color: '#16A34A', bgColor: '#DCFCE7', label: t.discount },
    popular: { icon: Star, color: '#F59E0B', bgColor: '#FEF3C7', label: t.popular },
    recommended: { icon: Heart, color: '#DC2626', bgColor: '#FEE2E2', label: t.recommended },
    spicy: { icon: Flame, color: '#DC2626', bgColor: '#FEE2E2', label: t.spicy },
  };

  const filteredCategories = categories.filter(c => c.menuType === currentMenuType && c.enabled);
  
  // Apply all filters
  let filteredItems = selectedCategory 
    ? menuItems.filter(i => i.categoryId === selectedCategory && i.enabled)
    : menuItems.filter(i => i.menuType === currentMenuType && i.enabled);

  // Apply search
  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.translations[currentLanguage]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translations[currentLanguage]?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply badge filters
  if (selectedFilters.badges.length > 0) {
    filteredItems = filteredItems.filter(item =>
      selectedFilters.badges.some(badge => item.badges?.includes(badge as any))
    );
  }

  // Apply dietary filters
  if (selectedFilters.dietary.length > 0) {
    filteredItems = filteredItems.filter(item =>
      selectedFilters.dietary.every(diet => item.badges?.includes(diet as any))
    );
  }

  // Apply price range filter
  if (selectedFilters.priceRange) {
    filteredItems = filteredItems.filter(item => {
      if (selectedFilters.priceRange === 'budget') return item.price < 15;
      if (selectedFilters.priceRange === 'mid') return item.price >= 15 && item.price < 30;
      if (selectedFilters.priceRange === 'premium') return item.price >= 30;
      return true;
    });
  }

  const handleQuickAdd = (item: any) => {
    addToCart({
      menuItemId: item.id,
      menuItem: item,
      quantity: 1,
      modifiers: [],
      price: item.price,
    });
    
    // Show added state
    setAddedItems(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  const handleItemClick = (item: any) => {
    navigate(`/branch/${branchId}/menu/${item.id}`);
  };

  const toggleBadgeFilter = (badge: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }));
  };

  const toggleDietaryFilter = (dietary: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const setPriceRange = (range: string | null) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({ badges: [], dietary: [], priceRange: null });
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const activeFiltersCount = selectedFilters.badges.length + selectedFilters.dietary.length + (selectedFilters.priceRange ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full pl-12 pr-4 h-12 rounded-xl bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-[#667c67] outline-none transition-all text-base placeholder:text-gray-400"
              />
            </div>
            
            {/* View Mode Buttons */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#667c67] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={t.gridView}
              >
                <LayoutGrid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#667c67] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={t.listView}
              >
                <List className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('compact')}
                className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                  viewMode === 'compact'
                    ? 'bg-white text-[#667c67] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={t.compactView}
              >
                <Grid3x3 className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Filter Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`relative h-12 px-4 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                activeFiltersCount > 0 
                  ? 'bg-[#667c67] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#667c67] to-[#546352] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Menu Type Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {(['main', 'business', 'kids', 'drinks', 'desserts'] as MenuType[]).map(type => {
              const Icon = menuTypeIcons[type];
              const count = menuItems.filter(i => i.menuType === type && i.enabled).length;
              const label = menuTypeLabels[type][currentLanguage] || menuTypeLabels[type].en;
              const isActive = currentMenuType === type;
              
              return (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMenuType(type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#667c67] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  <Badge className={`ml-1 ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                {/* Badge Filters */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{t.badges}</h4>
                  <div className="flex flex-wrap gap-2">
                    {['popular', 'new', 'hot', 'discount', 'recommended'].map(badge => (
                      <motion.button
                        key={badge}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleBadgeFilter(badge)}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                          selectedFilters.badges.includes(badge)
                            ? 'bg-[#667c67] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t[badge as keyof typeof t] || badge}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Dietary Filters */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{t.dietary}</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'vegan', icon: Leaf },
                      { key: 'gluten-free', icon: Wheat, label: t.glutenFree },
                    ].map(item => (
                      <motion.button
                        key={item.key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDietaryFilter(item.key)}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-all ${
                          selectedFilters.dietary.includes(item.key)
                            ? 'bg-[#667c67] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label || t[item.key as keyof typeof t]}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{t.priceRange}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['budget', 'mid', 'premium'].map(range => (
                      <motion.button
                        key={range}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPriceRange(range)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedFilters.priceRange === range
                            ? 'bg-[#667c67] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t[range as keyof typeof t]}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-10 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    {t.clearAll}
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 h-10 rounded-lg font-semibold text-white bg-[#667c67] hover:bg-[#546352] transition-all"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Special Offers Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/branch/${branchId}/promotions`)}
          className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-2xl p-6 cursor-pointer group hover:shadow-xl transition-all overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">{t.specialOffers}</h3>
              </div>
              <p className="text-white/90 text-sm">{t.offersDesc}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Categories */}
        {filteredCategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-[#667c67] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t.all}
            </motion.button>
            {filteredCategories.map(category => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#667c67] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.translations[currentLanguage] || category.translations['en'] || 'Category'}
              </motion.button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div 
              key={`items-${viewMode}`}
              className={
                viewMode === 'list' 
                  ? 'space-y-4'
                  : viewMode === 'compact'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredItems.map((item, index) => {
                const isAdded = addedItems.has(item.id);
                
                // LIST VIEW
                if (viewMode === 'list') {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                          alt={item.translations[currentLanguage]?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {item.rating && (
                          <div className="absolute top-2 right-2 bg-white rounded-lg px-1.5 py-0.5 flex items-center gap-0.5 shadow-md">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-900">{item.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 line-clamp-1">
                              {item.translations[currentLanguage]?.name || item.translations['en']?.name || 'Dish'}
                            </h3>
                            {item.badges && item.badges[0] && badgeConfig[item.badges[0]] && (
                              <div
                                className="px-2 py-0.5 rounded-md flex items-center gap-1"
                                style={{ backgroundColor: badgeConfig[item.badges[0]].bgColor }}
                              >
                                <span className="text-xs font-bold" style={{ color: badgeConfig[item.badges[0]].color }}>
                                  {badgeConfig[item.badges[0]].label}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.translations[currentLanguage]?.description || item.translations['en']?.description || ''}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.prepTime && (
                              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {item.prepTime}m
                              </span>
                            )}
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(item);
                            }}
                            className={`h-9 px-4 rounded-lg flex items-center gap-1.5 font-semibold text-sm transition-all ${
                              isAdded
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-[#FF6B35] hover:bg-[#FF5722] text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.added}</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.addToCart}</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // COMPACT VIEW
                if (viewMode === 'compact') {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                          alt={item.translations[currentLanguage]?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {item.rating && (
                          <div className="absolute top-1.5 right-1.5 bg-white rounded-md px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-900">{item.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {item.badges && item.badges[0] && badgeConfig[item.badges[0]] && (
                          <div
                            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md shadow-sm"
                            style={{ backgroundColor: badgeConfig[item.badges[0]].bgColor }}
                          >
                            <span className="text-xs font-bold" style={{ color: badgeConfig[item.badges[0]].color }}>
                              {badgeConfig[item.badges[0]].label}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                          {item.translations[currentLanguage]?.name || item.translations['en']?.name || 'Dish'}
                        </h3>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.prepTime && (
                            <span className="text-xs text-gray-500 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {item.prepTime}m
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(item);
                          }}
                          className={`w-full h-8 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-all ${
                            isAdded
                              ? 'bg-green-500 text-white'
                              : 'bg-[#FF6B35] hover:bg-[#FF5722] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>{t.added}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>{t.addToCart}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                }

                // GRID VIEW (default)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleItemClick(item)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                        alt={item.translations[currentLanguage]?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {item.badges && item.badges.slice(0, 2).map((badge, idx) => {
                          const config = badgeConfig[badge];
                          if (!config) return null;
                          const Icon = config.icon;
                          return (
                            <div
                              key={idx}
                              className="px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg backdrop-blur-sm"
                              style={{ backgroundColor: config.bgColor }}
                            >
                              <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                              <span className="text-xs font-bold" style={{ color: config.color }}>
                                {config.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Rating */}
                      {item.rating && (
                        <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-md">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{item.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {item.translations[currentLanguage]?.name || item.translations['en']?.name || 'Dish'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {item.translations[currentLanguage]?.description || item.translations['en']?.description || ''}
                      </p>

                      {/* Bottom */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-0.5">{t.from}</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(item);
                          }}
                          className={`h-11 px-6 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all ${
                            isAdded
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-[#FF6B35] hover:bg-[#FF5722] text-white shadow-md hover:shadow-lg'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{t.added}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>{t.addToCart}</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* Prep Time */}
                      {item.prepTime && (
                        <div className="flex items-center gap-1 text-gray-500 mt-3 pt-3 border-t border-gray-100">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">{item.prepTime} min</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noItems}</h3>
              <p className="text-gray-600 mb-6">{t.trySearch}</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#667c67] text-white rounded-xl font-semibold hover:bg-[#546352] transition-all"
              >
                {t.clearAll}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}