import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Building2, Users, BarChart3, Globe, UtensilsCrossed,
  Crown, Tag, Gift, TrendingUp, DollarSign, ShoppingCart, Clock,
  Star, ChevronRight, Search, Bell, Settings, Grid3x3, 
  Sparkles, Calendar, FileText, Package, Truck, MessageSquare,
  AlertCircle, CheckCircle2, XCircle, Activity, Target,
  Zap, Award, Percent, Home, LogOut, User, Eye, Edit2,
  ToggleLeft, ToggleRight, Plus, Filter, Download, Upload
} from 'lucide-react';

export function ControlPanel() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentLanguage, branches } = useApp();
  
  const [activeSection, setActiveSection] = useState<'overview' | 'operations' | 'management' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const isRTL = currentLanguage === 'ar';

  // Role-based access control
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  const isKitchen = user?.role === 'kitchen';
  const isWaiter = user?.role === 'waiter';

  // Mock real-time data - would come from API/WebSocket
  const [stats, setStats] = useState({
    // Today's metrics
    todayOrders: 247,
    todayRevenue: 12450,
    todayCustomers: 189,
    avgOrderValue: 65.87,
    
    // Real-time
    activeOrders: 23,
    pendingOrders: 7,
    kitchenQueue: 12,
    completedToday: 217,
    
    // Branch/Multi-branch
    activeBranches: 3,
    totalStaff: 45,
    totalTables: 87,
    occupiedTables: 34,
    
    // Loyalty & Promotions
    loyaltyMembers: 3247,
    activePromotions: 5,
    redemptionsToday: 48,
    
    // Satisfaction
    avgRating: 4.8,
    reviewsToday: 23,
    
    // Performance
    orderAccuracy: 98.5,
    avgPrepTime: 18, // minutes
    deliveryOnTime: 94.2, // percentage
  });

  // Quick action modules based on role
  const quickActions = useMemo(() => {
    const actions = [];

    if (isManager) {
      actions.push(
        {
          id: 'loyalty-promotions',
          title: 'Loyalty & Promotions',
          description: 'Manage rewards, offers & campaigns',
          icon: Crown,
          color: 'from-yellow-500 to-amber-600',
          path: '/manager/loyalty-promotions',
          badge: 'Hot',
          stats: `${stats.activePromotions} active`,
          highlighted: true,
        },
        {
          id: 'menu',
          title: 'Menu Management',
          description: 'Update items, pricing & availability',
          icon: UtensilsCrossed,
          color: 'from-[#667c67] to-[#526250]',
          path: isAdmin ? '/admin/menu' : '/manager/menu',
          stats: '124 items',
        },
        {
          id: 'analytics',
          title: 'Analytics & Reports',
          description: 'Performance insights & trends',
          icon: BarChart3,
          color: 'from-blue-500 to-indigo-600',
          path: isAdmin ? '/admin/analytics' : '/manager/reports',
          stats: `$${stats.todayRevenue.toLocaleString()} today`,
        },
      );
    }

    if (isAdmin) {
      actions.push(
        {
          id: 'branches',
          title: 'Branch Management',
          description: 'Manage locations & settings',
          icon: Building2,
          color: 'from-purple-500 to-purple-600',
          path: '/admin/branches',
          stats: `${stats.activeBranches} branches`,
        },
        {
          id: 'users',
          title: 'User Management',
          description: 'Staff accounts & permissions',
          icon: Users,
          color: 'from-green-500 to-green-600',
          path: '/admin/users',
          stats: `${stats.totalStaff} staff`,
        },
        {
          id: 'tables',
          title: 'Table Management',
          description: 'QR codes, regions & layouts',
          icon: Grid3x3,
          color: 'from-orange-500 to-red-600',
          path: '/admin/table-management',
          stats: `${stats.occupiedTables}/${stats.totalTables} occupied`,
        },
        {
          id: 'languages',
          title: 'Languages',
          description: 'Multi-language support',
          icon: Globe,
          color: 'from-teal-500 to-cyan-600',
          path: '/admin/languages',
          stats: '4 languages',
        },
      );
    }

    if (isWaiter) {
      actions.push(
        {
          id: 'orders',
          title: 'My Orders',
          description: 'Active table orders',
          icon: ShoppingCart,
          color: 'from-[#667c67] to-[#526250]',
          path: '/waiter/orders',
          stats: `${stats.activeOrders} active`,
        },
        {
          id: 'create-order',
          title: 'New Order',
          description: 'Take customer order',
          icon: Plus,
          color: 'from-green-500 to-green-600',
          path: '/waiter/create-order',
        },
      );
    }

    if (isKitchen) {
      actions.push(
        {
          id: 'kds',
          title: 'Kitchen Display',
          description: 'Order queue & preparation',
          icon: Activity,
          color: 'from-red-500 to-orange-600',
          path: '/kds',
          stats: `${stats.kitchenQueue} in queue`,
          highlighted: true,
        },
      );
    }

    return actions;
  }, [user?.role, stats, isAdmin, isManager, isWaiter, isKitchen]);

  // Today's highlights
  const highlights = [
    {
      title: 'Orders',
      value: stats.todayOrders,
      change: '+12%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Revenue',
      value: `$${stats.todayRevenue.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Order',
      value: `$${stats.avgOrderValue}`,
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Rating',
      value: stats.avgRating,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  // Real-time activity feed
  const recentActivity = [
    { id: 1, type: 'order', message: 'New order #247 - Table 12', time: '2 min ago', icon: ShoppingCart, color: 'text-blue-600' },
    { id: 2, type: 'promo', message: 'Happy Hour promotion activated', time: '15 min ago', icon: Tag, color: 'text-orange-600' },
    { id: 3, type: 'review', message: 'New 5★ review from Sarah M.', time: '23 min ago', icon: Star, color: 'text-yellow-600' },
    { id: 4, type: 'loyalty', message: '3 customers reached Gold tier', time: '1 hour ago', icon: Crown, color: 'text-purple-600' },
    { id: 5, type: 'alert', message: 'Grilled Salmon low in stock', time: '2 hours ago', icon: AlertCircle, color: 'text-red-600' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">eChefs Control Panel</h1>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' && 'System Administrator'}
                  {user?.role === 'manager' && 'Branch Manager'}
                  {user?.role === 'waiter' && 'Waiter Dashboard'}
                  {user?.role === 'kitchen' && 'Kitchen Manager'}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search orders, items, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => navigate('/profile')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#667c67] to-[#526250] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm">{user?.name}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Home className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#667c67]/20">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Actions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl active:scale-98 ${
                        action.highlighted
                          ? 'border-2 border-yellow-400 ring-2 ring-yellow-400/20'
                          : 'border-2 border-transparent hover:border-[#667c67]/20'
                      }`}
                      onClick={() => navigate(action.path)}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative`}>
                          <action.icon className="w-7 h-7 text-white" strokeWidth={2} />
                          {action.highlighted && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute -top-1 -right-1"
                            >
                              <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sm">{action.title}</h3>
                            {action.badge && (
                              <Badge className="bg-yellow-500 text-white border-none text-xs">
                                {action.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">{action.description}</p>
                          {action.stats && (
                            <p className="text-xs font-semibold text-[#667c67]">{action.stats}</p>
                          )}
                        </div>

                        <ChevronRight className={`w-5 h-5 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Real-time Status */}
            {isManager && (
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Real-time Status</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                    <Activity className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{stats.activeOrders}</p>
                    <p className="text-xs text-blue-600">Active Orders</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-100">
                    <Clock className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-2xl font-bold text-orange-900">{stats.pendingOrders}</p>
                    <p className="text-xs text-orange-600">Pending</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                    <Package className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{stats.kitchenQueue}</p>
                    <p className="text-xs text-purple-600">In Kitchen</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border-2 border-green-100">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-900">{stats.completedToday}</p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Performance Metrics */}
            {isManager && (
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Order Accuracy</span>
                      <span className="text-sm font-bold text-green-600">{stats.orderAccuracy}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.orderAccuracy}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">On-Time Delivery</span>
                      <span className="text-sm font-bold text-blue-600">{stats.deliveryOnTime}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.deliveryOnTime}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Avg Prep Time</p>
                      <p className="text-lg font-bold text-gray-900">{stats.avgPrepTime} min</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Reviews Today</p>
                      <p className="text-lg font-bold text-gray-900">{stats.reviewsToday}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Activity & Insights */}
          <div className="space-y-4">
            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <Badge variant="secondary">{recentActivity.length}</Badge>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </Card>

            {/* Quick Stats Card */}
            {isManager && (
              <Card className="p-6 bg-gradient-to-br from-[#667c67] to-[#526250] text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Loyalty Program</p>
                    <p className="text-2xl font-bold">{stats.loyaltyMembers}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Active promotions</span>
                    <span className="font-semibold">{stats.activePromotions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Redemptions today</span>
                    <span className="font-semibold">{stats.redemptionsToday}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full mt-4 bg-white text-[#667c67] hover:bg-white/90"
                  onClick={() => navigate('/manager/loyalty-promotions')}
                >
                  Manage Loyalty
                </Button>
              </Card>
            )}

            {/* Pro Tips */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Pro Tip</h3>
                  <p className="text-sm text-blue-700">
                    Happy hour promotions between 3-6 PM can increase revenue by 25%. Create one now to boost afternoon sales!
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/manager/loyalty-promotions')}
                  >
                    Create Promotion
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Management Sections for Admin */}
        {isAdmin && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/branches')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary">{stats.activeBranches}</Badge>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Branches</h3>
              <p className="text-sm text-gray-500">Manage all locations</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/users')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary">{stats.totalStaff}</Badge>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Staff</h3>
              <p className="text-sm text-gray-500">User management</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/languages')}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-teal-600" />
                </div>
                <Badge variant="secondary">4</Badge>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Languages</h3>
              <p className="text-sm text-gray-500">Multi-language support</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
