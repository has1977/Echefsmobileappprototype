import { Home, UtensilsCrossed, ShoppingCart, Gift, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useApp } from '../../contexts/AppContext';

export function BottomNav() {
  const location = useLocation();
  const { cart, currentBranch } = useApp();
  
  const cartItemsCount = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  // Determine the menu path based on current branch
  const menuPath = currentBranch?.id 
    ? `/branch/${currentBranch.id}/menu` 
    : '/branch-selection';

  // Determine the promotions path based on current branch
  const promotionsPath = currentBranch?.id
    ? `/branch/${currentBranch.id}/promotions`
    : '/branch-selection';

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: menuPath, icon: UtensilsCrossed, label: 'Menu' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemsCount },
    { path: promotionsPath, icon: Gift, label: 'Offers' },
    { path: '/loyalty', icon: User, label: 'Loyalty' },
  ];

  // Check if current path is active (for menu, check if it contains /menu)
  const isActive = (itemPath: string) => {
    if (itemPath === '/') return location.pathname === '/';
    if (itemPath.includes('/menu')) return location.pathname.includes('/menu');
    if (itemPath.includes('/promotions')) return location.pathname.includes('/promotions');
    return location.pathname === itemPath;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
                active 
                  ? 'text-[#667c67]' 
                  : 'text-gray-500 hover:text-[#667c67]'
              }`}
            >
              {/* Background indicator for active item */}
              {active && (
                <div className="absolute inset-0 bg-[#667c67]/5 rounded-t-2xl" />
              )}
              
              <div className="relative z-10">
                <Icon className={`w-6 h-6 transition-all ${active ? 'stroke-[2.5] scale-110' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all z-10 ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#667c67] to-[#526250] rounded-b-full shadow-md" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}