import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, ShoppingCart, User, Globe, Menu as MenuIcon, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Logo } from './Logo';
import { useState } from 'react';

export function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, currentLanguage, setCurrentLanguage, availableLanguages } = useApp();
  const { isAuthenticated, user } = useAuth();
  const { favoritesCount } = useFavorites();
  const [showLanguages, setShowLanguages] = useState(false);
  
  const cartItemsCount = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Determine if we should show back button
  const showBackButton = location.pathname !== '/';
  
  // Determine page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return '';
    if (path === '/branch-selection') return 'Select Branch';
    if (path.includes('/region-selection')) return 'Select Region';
    if (path.includes('/menu') && !path.includes('/menu/')) return 'Menu';
    if (path === '/cart') return 'Cart';
    if (path === '/checkout') return 'Checkout';
    if (path === '/loyalty') return 'Loyalty Program';
    if (path === '/promotions') return 'Promotions';
    if (path === '/profile') return 'Profile';
    if (path === '/favorites') return 'Favorites';
    if (path.includes('/tracking')) return 'Order Tracking';
    if (path.includes('/offers')) return 'Special Offers';
    return '';
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const title = getPageTitle();

  return (
    <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-lg relative z-40 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3.5">
        {/* Left Section - Back Button or Logo */}
        <div className="flex items-center gap-3 flex-1">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-white/20 -ml-2 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Logo className="h-8" />
          )}
          
          {title && (
            <h1 className="text-lg font-bold truncate drop-shadow-sm">{title}</h1>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLanguages(!showLanguages)}
              className="text-white hover:bg-white/20 active:scale-95 transition-transform"
            >
              <Globe className="w-5 h-5" />
            </Button>
            
            {showLanguages && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLanguages(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl py-2 min-w-[140px] z-50 border border-gray-100 overflow-hidden">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-[#667c67]/10 transition-all text-sm ${ 
                        currentLanguage === lang.code 
                          ? 'bg-[#667c67]/10 text-[#667c67] font-bold border-l-3 border-[#667c67]' 
                          : 'text-gray-700 font-medium'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Favorites Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/favorites')}
            className="text-white hover:bg-white/20 relative active:scale-95 transition-transform"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#667c67] to-[#546352] text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold shadow-lg animate-pulse-subtle">
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </Button>

          {/* User/Auth Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(isAuthenticated ? '/profile' : '/sign-in')}
            className="text-white hover:bg-white/20 active:scale-95 transition-transform"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}