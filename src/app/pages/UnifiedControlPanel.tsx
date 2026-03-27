import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Building2, Users, BarChart3, Globe, UtensilsCrossed,
  Crown, Tag, Gift, TrendingUp, DollarSign, ShoppingCart, Clock,
  Star, ChevronRight, Search, Bell, Settings, Grid3x3,
  Sparkles, Calendar, FileText, Package, Truck, MessageSquare,
  AlertCircle, CheckCircle2, XCircle, Activity, Target,
  Zap, Award, Percent, Home, LogOut, User, Eye, Edit2,
  ToggleLeft, ToggleRight, Plus, Filter, Download, Upload,
  ChefHat, TrendingDown, PieChart, MonitorDot, Utensils,
  MapPin, RefreshCw, ArrowLeft, Menu as MenuIcon, QrCode,
  Database
} from 'lucide-react';
import { RevenueChart } from '../components/analytics/RevenueChart';

export function UnifiedControlPanel() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentLanguage, branches } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'operations' | 'menu' | 'analytics' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isRTL = currentLanguage === 'ar';

  // Role-based access control
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  const isKitchen = user?.role === 'kitchen';
  const isWaiter = user?.role === 'waiter';

  // Support Messages Helper Functions
  const getSupportMessagesStats = () => {
    const savedMessages = localStorage.getItem('echefs_support_messages');
    if (!savedMessages) return '0 messages';
    
    const messages = JSON.parse(savedMessages);
    const messagesList = Object.values(messages) as any[];
    const total = messagesList.length;
    const newCount = messagesList.filter((m: any) => m.status === 'new').length;
    
    if (newCount > 0) {
      return `${newCount} new`;
    }
    return `${total} total`;
  };

  const getNewMessagesCount = () => {
    const savedMessages = localStorage.getItem('echefs_support_messages');
    if (!savedMessages) return 0;
    
    const messages = JSON.parse(savedMessages);
    const messagesList = Object.values(messages) as any[];
    return messagesList.filter((m: any) => m.status === 'new').length;
  };

  // Comprehensive real-time statistics
  const stats = {
    // Revenue & Financial
    totalRevenue: 45680,
    todayRevenue: 12450,
    weekRevenue: 87340,
    monthRevenue: 342500,
    avgOrderValue: 65.87,
    revenueChange: 12.5,

    // Orders
    totalOrders: 1247,
    todayOrders: 247,
    activeOrders: 23,
    pendingOrders: 7,
    kitchenQueue: 12,
    completedToday: 217,
    ordersChange: 8.3,

    // Customers
    totalCustomers: 3247,
    todayCustomers: 189,
    customersChange: -3.2,
    loyaltyMembers: 3247,
    newCustomersToday: 12,

    // Branches & Staff
    activeBranches: 3,
    totalStaff: 45,
    onlineStaff: 38,
    totalTables: 87,
    occupiedTables: 34,
    tableOccupancy: 39,

    // Promotions & Loyalty
    activePromotions: 5,
    redemptionsToday: 48,
    giftsIssued: 124,

    // Performance & Quality
    avgRating: 4.8,
    reviewsToday: 23,
    orderAccuracy: 98.5,
    avgPrepTime: 18,
    deliveryOnTime: 94.2,

    // Menu
    totalMenuItems: 124,
    activeItems: 118,
    outOfStock: 6,
  };

  // Recent orders for real-time monitoring
  const recentOrders = [
    {
      id: 'ORD-1247',
      table: 'T-12',
      branch: 'Downtown',
      items: 3,
      total: 87.50,
      status: 'preparing',
      time: '2 min ago',
      waiter: 'John D.',
    },
    {
      id: 'ORD-1246',
      table: 'T-08',
      branch: 'Mall',
      items: 2,
      total: 45.00,
      status: 'ready',
      time: '5 min ago',
      waiter: 'Sarah M.',
    },
    {
      id: 'ORD-1245',
      table: 'T-15',
      branch: 'Downtown',
      items: 5,
      total: 125.75,
      status: 'served',
      time: '8 min ago',
      waiter: 'Mike R.',
    },
    {
      id: 'ORD-1244',
      table: 'T-03',
      branch: 'Airport',
      items: 4,
      total: 98.25,
      status: 'received',
      time: '10 min ago',
      waiter: 'Emma L.',
    },
  ];

  // Kitchen queue for KDS view
  const kitchenQueue = [
    {
      id: 'ORD-1247',
      table: 'T-12',
      items: ['Grilled Salmon x2', 'Caesar Salad x1'],
      priority: 'high',
      waitTime: '12 min',
      status: 'preparing',
    },
    {
      id: 'ORD-1246',
      table: 'T-08',
      items: ['Margherita Pizza x1', 'Tiramisu x1'],
      priority: 'normal',
      waitTime: '8 min',
      status: 'preparing',
    },
    {
      id: 'ORD-1248',
      table: 'T-05',
      items: ['Beef Burger x3', 'Fries x3', 'Coke x3'],
      priority: 'urgent',
      waitTime: '15 min',
      status: 'new',
    },
  ];

  // Top menu items
  const topMenuItems = [
    { id: '1', name: 'Grilled Salmon', orders: 45, revenue: 2250, category: 'Main Course' },
    { id: '2', name: 'Caesar Salad', orders: 38, revenue: 1140, category: 'Salads' },
    { id: '3', name: 'Margherita Pizza', orders: 35, revenue: 1750, category: 'Pizza' },
    { id: '4', name: 'Beef Burger', orders: 32, revenue: 1600, category: 'Burgers' },
    { id: '5', name: 'Pasta Carbonara', orders: 28, revenue: 1260, category: 'Pasta' },
  ];

  // Branch performance
  const branchPerformance = [
    {
      id: '1',
      name: 'Downtown Branch',
      revenue: 18500,
      orders: 145,
      occupancy: 85,
      rating: 4.9,
      staff: 15,
      status: 'active',
    },
    {
      id: '2',
      name: 'Mall Branch',
      revenue: 15200,
      orders: 120,
      occupancy: 72,
      rating: 4.7,
      staff: 12,
      status: 'active',
    },
    {
      id: '3',
      name: 'Airport Branch',
      revenue: 12120,
      orders: 77,
      occupancy: 90,
      rating: 4.8,
      staff: 18,
      status: 'active',
    },
  ];

  // Revenue chart data for analytics
  const revenueData = [
    { date: 'Mon', revenue: 4200, orders: 45 },
    { date: 'Tue', revenue: 5100, orders: 52 },
    { date: 'Wed', revenue: 4800, orders: 48 },
    { date: 'Thu', revenue: 6200, orders: 61 },
    { date: 'Fri', revenue: 7500, orders: 73 },
    { date: 'Sat', revenue: 8900, orders: 84 },
    { date: 'Sun', revenue: 9120, orders: 79 },
  ];

  // Role-specific quick actions
  const getQuickActions = () => {
    const actions = [];

    // Admin actions
    if (isAdmin) {
      actions.push(
        {
          id: 'branches',
          title: 'Branch Management',
          description: 'Manage locations & settings',
          icon: Building2,
          color: 'from-purple-500 to-purple-600',
          path: '/admin/branches',
          stats: `${stats.activeBranches} active`,
        },
        {
          id: 'users',
          title: 'User Management',
          description: 'Staff, roles & permissions',
          icon: Users,
          color: 'from-blue-500 to-indigo-600',
          path: '/admin/users',
          stats: `${stats.totalStaff} staff`,
        },
        {
          id: 'languages',
          title: 'Language Settings',
          description: 'Manage multi-language support',
          icon: Globe,
          color: 'from-green-500 to-teal-600',
          path: '/admin/languages',
          stats: '4 languages',
        },
        {
          id: 'currency',
          title: 'Currency Management',
          description: 'Store & loyalty currencies',
          icon: DollarSign,
          color: 'from-emerald-500 to-green-600',
          path: '/admin/currency',
          stats: '8 currencies',
        },
        {
          id: 'analytics',
          title: 'Advanced Analytics',
          description: 'Deep insights & reports',
          icon: BarChart3,
          color: 'from-orange-500 to-red-600',
          path: '/admin/analytics',
          stats: 'Real-time',
        }
      );
    }

    // Manager actions
    if (isManager) {
      actions.push(
        {
          id: 'check-in-dashboard',
          title: 'Table Check-Ins',
          description: 'Approve QR/NFC check-in requests',
          icon: QrCode,
          color: 'from-[#667c67] to-[#526250]',
          path: '/staff-check-in-dashboard',
          stats: 'Real-time',
          badge: 'New',
        },
        {
          id: 'menu',
          title: 'Menu Management',
          description: 'Update items, pricing & availability',
          icon: UtensilsCrossed,
          color: 'from-[#667c67] to-[#526250]',
          path: isAdmin ? '/admin/menu' : '/manager/menu',
          stats: `${stats.totalMenuItems} items`,
        },
        {
          id: 'promotions',
          title: 'Promotions & Offers',
          description: 'Manage campaigns & discounts',
          icon: Tag,
          color: 'from-orange-500 to-red-600',
          path: isAdmin ? '/admin/promotions' : '/manager/promotions',
          stats: `${stats.activePromotions} active`,
        },
        {
          id: 'loyalty',
          title: 'Loyalty Program',
          description: 'Rewards, points & memberships',
          icon: Crown,
          color: 'from-yellow-500 to-amber-600',
          path: isAdmin ? '/admin/loyalty' : '/manager/loyalty-promotions',
          stats: `${stats.loyaltyMembers} members`,
          badge: 'Popular',
        },
        {
          id: 'tables',
          title: 'Table Management',
          description: 'QR codes, regions & layouts',
          icon: Grid3x3,
          color: 'from-pink-500 to-rose-600',
          path: '/admin/table-management',
          stats: `${stats.occupiedTables}/${stats.totalTables} occupied`,
        },
        {
          id: 'inventory',
          title: 'Inventory System',
          description: 'Stock levels & auto-ordering',
          icon: Package,
          color: 'from-indigo-500 to-blue-600',
          path: '/admin/inventory',
          stats: 'Auto-reorder enabled',
          badge: 'New',
        },
        {
          id: 'ratings',
          title: 'Ratings & Reviews',
          description: 'Manage customer feedback',
          icon: Star,
          color: 'from-yellow-500 to-orange-600',
          path: '/control-panel/ratings',
          stats: `${stats.avgRating}★ avg`,
        },
        {
          id: 'support-messages',
          title: 'Support Messages',
          description: 'Customer inquiries & issues',
          icon: MessageSquare,
          color: 'from-blue-500 to-cyan-600',
          path: '/control-panel/support-messages',
          stats: getSupportMessagesStats(),
          badge: getNewMessagesCount() > 0 ? 'New' : undefined,
        }
      );
    }

    // Waiter actions
    if (isWaiter) {
      actions.push(
        {
          id: 'new-order',
          title: 'New Order',
          description: 'Create new table order',
          icon: Plus,
          color: 'from-green-500 to-emerald-600',
          path: '/waiter/create-order',
          stats: 'Quick action',
        },
        {
          id: 'my-orders',
          title: 'My Orders',
          description: 'View assigned tables',
          icon: ShoppingCart,
          color: 'from-blue-500 to-indigo-600',
          path: '/waiter/orders',
          stats: `${stats.activeOrders} active`,
        }
      );
    }

    // Kitchen actions
    if (isKitchen) {
      actions.push(
        {
          id: 'kitchen-queue',
          title: 'Kitchen Queue',
          description: 'Pending orders & preparation',
          icon: ChefHat,
          color: 'from-red-500 to-orange-600',
          path: '/kds',
          stats: `${stats.kitchenQueue} in queue`,
          badge: 'Urgent',
        }
      );
    }

    return actions;
  };

  const quickActions = getQuickActions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
      case 'new':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-green-500';
      case 'served':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 lg:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold drop-shadow-sm">Control Panel</h1>
                <p className="text-sm text-white/80 capitalize">{user?.role} Dashboard {user?.email && `• ${user.email}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, items, branches..."
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 -mb-px overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'operations', label: 'Operations', icon: Activity },
              isManager && { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
              isManager && { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ]
              .filter(Boolean)
              .map((tab: any) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all ${
                      active
                        ? 'bg-background text-[#667c67] shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 pb-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Revenue',
                    value: `$${stats.todayRevenue.toLocaleString()}`,
                    change: `+${stats.revenueChange}%`,
                    icon: DollarSign,
                    color: 'from-green-500 to-emerald-600',
                    trend: 'up',
                  },
                  {
                    title: 'Orders',
                    value: stats.todayOrders,
                    change: `+${stats.ordersChange}%`,
                    icon: ShoppingCart,
                    color: 'from-blue-500 to-indigo-600',
                    trend: 'up',
                  },
                  {
                    title: 'Customers',
                    value: stats.todayCustomers,
                    change: `${stats.customersChange}%`,
                    icon: Users,
                    color: 'from-purple-500 to-purple-600',
                    trend: 'down',
                  },
                  {
                    title: 'Rating',
                    value: stats.avgRating,
                    change: '+0.3',
                    icon: Star,
                    color: 'from-yellow-500 to-amber-600',
                    trend: 'up',
                  },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
                  return (
                    <motion.div
                      key={metric.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                        <CardContent className="p-4 relative">
                          <div className="flex items-start justify-between mb-2">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${
                              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <TrendIcon className="w-3 h-3" />
                              {metric.change}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.title}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#667c67]" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, i) => {
                      const Icon = action.icon;
                      return (
                        <motion.button
                          key={action.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => navigate(action.path)}
                          className="relative p-4 rounded-xl border-2 border-transparent hover:border-[#667c67]/20 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all text-left group overflow-hidden"
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.color} opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              {action.badge && (
                                <Badge variant="secondary" className="bg-yellow-500 text-white border-none">
                                  {action.badge}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#667c67]">{action.stats}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#667c67] group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#667c67]" />
                      Recent Orders
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{order.id}</span>
                              <Badge variant="outline" className="text-xs">
                                {order.table}
                              </Badge>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                            </div>
                            <div className="text-xs text-gray-600">
                              {order.branch} • {order.items} items • {order.waiter}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">${order.total}</div>
                            <div className="text-xs text-gray-500">{order.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Items */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#667c67]" />
                      Top Menu Items
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topMenuItems.map((item, i) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center text-white font-bold text-sm">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-xs text-gray-600">{item.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">${item.revenue}</div>
                            <div className="text-xs text-gray-500">{item.orders} orders</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Branch Performance - Admin/Manager only */}
              {isManager && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#667c67]" />
                      Branch Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {branchPerformance.map((branch) => (
                        <div
                          key={branch.id}
                          className="p-4 rounded-xl border-2 border-gray-100 hover:border-[#667c67]/20 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{branch.name}</h3>
                            <Badge variant="secondary" className="bg-green-500 text-white border-none">
                              {branch.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600">Revenue</div>
                              <div className="font-semibold">${branch.revenue.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Orders</div>
                              <div className="font-semibold">{branch.orders}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Occupancy</div>
                              <div className="font-semibold">{branch.occupancy}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Rating</div>
                              <div className="font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                {branch.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* OPERATIONS TAB */}
          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Real-time Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Active Orders',
                    value: stats.activeOrders,
                    icon: Activity,
                    color: 'bg-blue-500',
                  },
                  {
                    title: 'Kitchen Queue',
                    value: stats.kitchenQueue,
                    icon: ChefHat,
                    color: 'bg-orange-500',
                  },
                  {
                    title: 'Occupied Tables',
                    value: `${stats.occupiedTables}/${stats.totalTables}`,
                    icon: Grid3x3,
                    color: 'bg-purple-500',
                  },
                  {
                    title: 'Online Staff',
                    value: `${stats.onlineStaff}/${stats.totalStaff}`,
                    icon: Users,
                    color: 'bg-green-500',
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.title}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Kitchen Display (for Kitchen staff) */}
              {isKitchen && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MonitorDot className="w-5 h-5 text-[#667c67]" />
                      Kitchen Queue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {kitchenQueue.map((order) => (
                        <div
                          key={order.id}
                          className={`p-4 rounded-xl border-2 ${
                            order.priority === 'urgent'
                              ? 'border-red-500 bg-red-50'
                              : order.priority === 'high'
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{order.id}</span>
                              <Badge className={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                            </div>
                            <Badge variant="outline">{order.table}</Badge>
                          </div>
                          <div className="space-y-1 mb-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="text-sm font-medium">
                                • {item}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Wait: {order.waitTime}</span>
                            <Button size="sm" variant={order.status === 'new' ? 'default' : 'secondary'}>
                              {order.status === 'new' ? 'Start' : 'Mark Ready'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Live Orders - All Staff */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#667c67]" />
                    Live Orders
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all"
                      >
                        <div className={`w-3 h-12 rounded-full ${getStatusColor(order.status)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{order.id}</span>
                            <Badge variant="outline">{order.table}</Badge>
                            <span className="text-sm text-gray-600">• {order.branch}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items} items • {order.waiter} • {order.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${order.total}</div>
                          <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* MENU TAB - Manager/Admin only */}
          {activeTab === 'menu' && isManager && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-[#667c67]" />
                    Menu Overview
                  </CardTitle>
                  <Button onClick={() => navigate(isAdmin ? '/admin/menu' : '/manager/menu')}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Manage Menu
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700">{stats.totalMenuItems}</div>
                      <div className="text-sm text-blue-600">Total Items</div>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                      <div className="text-3xl font-bold text-green-700">{stats.activeItems}</div>
                      <div className="text-sm text-green-600">Active</div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <div className="text-3xl font-bold text-red-700">{stats.outOfStock}</div>
                      <div className="text-sm text-red-600">Out of Stock</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="text-3xl font-bold text-purple-700">{topMenuItems.length}</div>
                      <div className="text-sm text-purple-600">Top Sellers</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Best Performers</h3>
                    {topMenuItems.map((item, i) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667c67] to-[#526250] flex items-center justify-center text-white font-bold">
                            #{i + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${item.revenue}</div>
                          <div className="text-sm text-gray-600">{item.orders} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ANALYTICS TAB - Manager/Admin only */}
          {activeTab === 'analytics' && isManager && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Time Range Selector */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {(['today', 'week', 'month', 'year'] as const).map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTimeRange(range)}
                          className="capitalize"
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Custom
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#667c67]" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart 
                    data={revenueData}
                    title="Revenue Trend"
                    period="Last 7 days"
                    totalRevenue={stats.todayRevenue}
                    growth={stats.revenueChange}
                  />
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Order Accuracy',
                    value: `${stats.orderAccuracy}%`,
                    icon: CheckCircle2,
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                  },
                  {
                    title: 'Avg Prep Time',
                    value: `${stats.avgPrepTime} min`,
                    icon: Clock,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    title: 'On-Time Delivery',
                    value: `${stats.deliveryOnTime}%`,
                    icon: Truck,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                  },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.title}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center ${metric.color} mb-3`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.title}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Additional Analytics Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Access full analytics dashboard</p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate(isAdmin ? '/admin/analytics' : '/manager/reports')}
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#667c67]" />
                    Settings & Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate('/admin/settings')}
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          System Settings
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate('/admin/languages')}
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Language Management
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate('/admin/currency')}
                      >
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Currency Management
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate('/admin/users')}
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          User Management
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      
                      {/* Database Check - Developer Tool */}
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300"
                        onClick={() => navigate('/database-check')}
                      >
                        <span className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-600 font-semibold">Database Check</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => navigate('/profile')}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      My Profile
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}