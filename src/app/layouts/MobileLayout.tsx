import { Outlet, useLocation } from 'react-router';
import { TopNav, BottomNav } from '../design-system';
import { useApp } from '../contexts/AppContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Home, UtensilsCrossed, ShoppingCart, Gift, User } from 'lucide-react';
import { Suspense } from 'react';
import { ActiveOrdersButton } from '../components/ActiveOrdersButton';

// Pages that should show the bottom navigation
const PAGES_WITH_BOTTOM_NAV = [
  '/',
  '/branch-selection',
  '/loyalty',
  '/promotions',
  '/profile',
  '/cart',
];

// Full screen pages (no nav bars)
const FULL_SCREEN_PAGES = [
  '/control-panel',
  '/welcome',
  '/checkout',  // Checkout is full screen
  '/sign-in',   // Auth pages are full screen
  '/sign-up',
];

/**
 * MobileLayout - Layout with mobile navigation
 * Updated: March 19, 2026 - Build 3.3.1
 */
export function MobileLayout() {
  console.log('🟣 MobileLayout rendering - about to call useApp()');
  const location = useLocation();
  const { cart, currentBranch, currentLanguage, changeLanguage, languages } = useApp();
  const { favoritesCount } = useFavorites();
  console.log('✅ MobileLayout successfully got context from useApp()');
  
  // Calculate cart count
  const cartItemsCount = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Check if it's a full screen page
  const isFullScreen = FULL_SCREEN_PAGES.some(path => location.pathname.startsWith(path));
  
  // Show bottom nav on ALL pages except full-screen ones
  const showBottomNav = !isFullScreen;
  
  // Show top nav for most pages, except full screen ones and pages that handle their own nav
  const showTopNav = !isFullScreen && 
    location.pathname !== '/' && 
    location.pathname !== '/branch-selection' &&
    location.pathname !== '/cart' && // Cart page has its own header
    location.pathname !== '/promotions' && // Promotions page has its own header
    !location.pathname.includes('/promotions') && // Branch-specific promotions page has its own header
    location.pathname !== '/loyalty'; // Loyalty page has its own header

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/region-selection')) return 'Select Region';
    if (path.includes('/menu') && !path.includes('/menu/')) return 'Menu';
    if (path === '/cart') return 'Cart';
    if (path === '/checkout') return 'Checkout';
    if (path === '/loyalty') return 'Loyalty';
    if (path === '/promotions') return 'Offers';
    if (path === '/profile') return 'Profile';
    if (path.includes('/tracking')) return 'Order Status';
    if (path.includes('/offers')) return 'Special Offers';
    if (path.includes('/reviews')) return 'Reviews';
    return '';
  };

  // Translations for bottom nav
  const navTranslations = {
    en: { home: 'Home', menu: 'Menu', cart: 'Cart', offers: 'Offers', profile: 'Profile' },
    ar: { home: 'الرئيسية', menu: 'القائمة', cart: 'السلة', offers: 'العروض', profile: 'الملف' },
    ru: { home: 'Главная', menu: 'Меню', cart: 'Корзина', offers: 'Акции', profile: 'Профиль' },
    ky: { home: 'Башкы', menu: 'Меню', cart: 'Себет', offers: 'Сунуштар', profile: 'Профиль' },
  };

  const t = navTranslations[currentLanguage as keyof typeof navTranslations] || navTranslations.en;

  // Determine the menu path based on current branch
  const menuPath = currentBranch?.id 
    ? `/branch/${currentBranch.id}/menu` 
    : '/branch-selection';

  // Home path should go to branch selection instead of welcome page
  const homePath = '/branch-selection';

  // Determine promotions path based on current branch
  const promotionsPath = currentBranch?.id
    ? `/branch/${currentBranch.id}/promotions`
    : '/branch-selection';

  // Bottom nav items
  const bottomNavItems = [
    { path: homePath, icon: Home, label: t.home },
    { path: menuPath, icon: UtensilsCrossed, label: t.menu },
    { path: '/cart', icon: ShoppingCart, label: t.cart, badge: cartItemsCount },
    { path: promotionsPath, icon: Gift, label: t.offers },
    { path: '/profile', icon: User, label: t.profile },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]">
      {showTopNav && (
        <TopNav
          title={getPageTitle()}
          showBack={true}
          showCart={true}
          showUser={true}
          showLanguage={true}
          cartCount={cartItemsCount}
          favoritesCount={favoritesCount}
          onLanguageChange={changeLanguage}
          currentLanguage={currentLanguage}
          languages={languages}
        />
      )}
      
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-24' : ''}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      
      {showBottomNav && <BottomNav items={bottomNavItems} />}
      
      {/* Floating Active Orders Button */}
      <ActiveOrdersButton />
    </div>
  );
}