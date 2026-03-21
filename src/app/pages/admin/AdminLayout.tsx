import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Logo } from '../../components/shared/Logo';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Building2, Grid3x3, Package, UtensilsCrossed, Crown,
  Tag, Gift, ShoppingCart, Users, User, Settings, LogOut,
  Menu, X, BarChart3, Globe, Home, ChevronRight, LayoutDashboard, Palette
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  isNew?: boolean;
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'style-guide', label: 'Design System', icon: Palette, path: '/admin/style-guide', isNew: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: 3 },
    { id: 'branches', label: 'Branches', icon: Building2, path: '/admin/branches' },
    { id: 'tables', label: 'Tables', icon: Grid3x3, path: '/admin/table-management' },
    { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed, path: '/admin/menu' },
    { id: 'loyalty', label: 'Loyalty Program', icon: Crown, path: '/admin/loyalty' },
    { id: 'promotions', label: 'Promotions', icon: Tag, path: '/admin/promotions' },
    { id: 'gifts', label: 'Gift Cards', icon: Gift, path: '/admin/gifts' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'customers', label: 'Customer Accounts', icon: User, path: '/admin/customers' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'languages', label: 'Languages', icon: Globe, path: '/admin/languages' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col fixed lg:relative h-screen z-40 shadow-xl lg:shadow-none"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#667c67] to-[#526250] p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-white/20">
                <Logo size="sm" showText={false} />
              </div>
              <div className="flex-1">
                <h1 className="text-white text-xl font-bold drop-shadow-sm">eChefs</h1>
                <p className="text-white/90 text-sm font-medium">Admin Dashboard</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="mb-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                  Management
                </h2>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                          active
                            ? 'bg-[#667c67] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#667c67]'}`} />
                        <span className={`flex-1 text-left font-medium text-sm ${active ? 'text-white' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        
                        {item.badge && (
                          <Badge className="bg-red-500 text-white border-none h-5 min-w-5 px-1.5">
                            {item.badge}
                          </Badge>
                        )}
                        
                        {item.isNew && (
                          <Badge className="bg-yellow-500 text-white border-none text-xs">
                            New
                          </Badge>
                        )}

                        {active && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Card className="p-4 mb-3 bg-white border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#667c67] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@echefs.com'}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white shadow-md"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Card>

              <Button
                variant="outline"
                className="w-full text-[#667c67] border-[#667c67]/30 hover:bg-[#667c67]/10"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - Both Mobile and Desktop */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-700 hover:bg-gray-100"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <h1 className="font-bold text-gray-900">eChefs Admin</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/notifications')}>
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}