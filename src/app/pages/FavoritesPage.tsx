import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Search, X, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import type { MenuItem } from '../lib/types';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { menuItems, addToCart, currentLanguage, branches } = useApp();
  const { favoriteItems, toggleFavorite, favoritesCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
  }, [isAuthenticated, navigate]);

  const translations = {
    en: {
      title: 'My Favorites',
      subtitle: 'Your favorite dishes',
      search: 'Search favorites...',
      noFavorites: 'No favorites yet',
      noFavoritesDesc: 'Start adding your favorite dishes!',
      browseMenu: 'Browse Menu',
      addToCart: 'Add to Cart',
      removeFavorite: 'Remove from Favorites',
      popular: 'Popular',
      trending: 'Trending',
      items: 'items',
      clear: 'Clear',
      noResults: 'No favorites match your search',
      tryDifferent: 'Try a different search term',
    },
    ar: {
      title: 'المفضلة',
      subtitle: 'أطباقك المفضلة',
      search: 'البحث في المفضلة...',
      noFavorites: 'لا توجد مفضلات بعد',
      noFavoritesDesc: 'ابدأ بإضافة أطباقك المفضلة!',
      browseMenu: 'تصفح القائمة',
      addToCart: 'إضافة للسلة',
      removeFavorite: 'إزالة من المفضلة',
      popular: 'الأكثر شعبية',
      trending: 'الرائج',
      items: 'أصناف',
      clear: 'مسح',
      noResults: 'لا توجد مفضلات مطابقة لبحثك',
      tryDifferent: 'جرب كلمة بحث مختلفة',
    },
    ru: {
      title: 'Избранное',
      subtitle: 'Ваши любимые блюда',
      search: 'Поиск в избранном...',
      noFavorites: 'Нет избранного',
      noFavoritesDesc: 'Начните добавлять любимые блюда!',
      browseMenu: 'Меню',
      addToCart: 'В корзину',
      removeFavorite: 'Удалить из избранного',
      popular: 'Популярное',
      trending: 'Трендовое',
      items: 'позиций',
      clear: 'Очистить',
      noResults: 'Нет результатов',
      tryDifferent: 'Попробуйте другой запрос',
    },
    ky: {
      title: 'Тандалмалар',
      subtitle: 'Сиздин сүйүктүү тамактар',
      search: 'Тандалмаларда издөө...',
      noFavorites: 'Тандалмалар жок',
      noFavoritesDesc: 'Сүйүктүү тамактарыңызды кошууну баштаңыз!',
      browseMenu: 'Меню',
      addToCart: 'Себетке',
      removeFavorite: 'Тандалмалардан өчүрүү',
      popular: 'Популярдуу',
      trending: 'Трендде',
      items: 'позиция',
      clear: 'Тазалоо',
      noResults: 'Натыйжалар жок',
      tryDifferent: 'Башка сөздү байкап көрүңүз',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations];

  // Filter favorite items from menu
  const favoriteMenuItems = menuItems.filter(item => favoriteItems.includes(item.id));

  // Apply search filter
  const filteredItems = favoriteMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFavorite = (itemId: string) => {
    toggleFavorite(itemId);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      menuItemId: item.id,
      menuItem: item,
      quantity: 1,
      modifiers: [],
      price: item.price,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E4DBC4]/20 to-white pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#667c67] via-[#667c67] to-[#546352] text-white overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E4DBC4] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative px-4 pt-6 pb-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-white flex items-center justify-center shadow-xl">
              <Heart className="w-6 h-6 text-[#667c67] fill-[#667c67]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-white/80 text-sm">{t.subtitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-2xl font-bold">{favoriteItems.length}</div>
              <div className="text-xs text-white/70">{t.items}</div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-1 text-yellow-300">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-2xl font-bold">4.8</span>
              </div>
              <div className="text-xs text-white/70">{t.popular}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {favoriteItems.length > 0 && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 focus:border-[#667c67]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {favoriteItems.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#E4DBC4] to-[#667c67]/20 flex items-center justify-center">
                <Heart className="w-12 h-12 text-[#667c67]" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.noFavorites}</h3>
              <p className="text-gray-600 mb-6">{t.noFavoritesDesc}</p>
              <Button
                onClick={() => navigate('/branch-selection')}
                className="bg-gradient-to-r from-[#667c67] to-[#546352] hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t.browseMenu}
              </Button>
            </motion.div>
          )}

          {/* No Search Results */}
          {favoriteItems.length > 0 && filteredItems.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold mb-2">{t.noResults}</h3>
              <p className="text-gray-600">{t.tryDifferent}</p>
            </motion.div>
          )}

          {/* Favorites Grid */}
          {filteredItems.length > 0 && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all border-2 border-transparent hover:border-[#667c67]/20">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div
                        onClick={() => navigate(`/branch/${branches[0]?.id}/menu/${item.id}`)}
                        className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#E4DBC4] to-[#667c67]/20 flex items-center justify-center">
                            <span className="text-3xl">{item.emoji || '🍽️'}</span>
                          </div>
                        )}
                        {item.isPopular && (
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-yellow-500 text-white border-0 text-xs px-1.5 py-0.5">
                              <TrendingUp className="w-3 h-3" />
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          onClick={() => navigate(`/branch/${branches[0]?.id}/menu/${item.id}`)}
                          className="cursor-pointer"
                        >
                          <h3 className="font-bold text-lg mb-1 truncate">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-lg font-bold text-[#667c67]">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className="flex-1" />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFavorite(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="bg-gradient-to-r from-[#667c67] to-[#546352] hover:shadow-lg"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            {t.addToCart}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}