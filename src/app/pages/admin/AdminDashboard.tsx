import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'motion/react';
import { 
  Building2, Users, BarChart3, Globe, UtensilsCrossed, 
  Grid3x3, TrendingUp, DollarSign, ShoppingCart, Clock,
  Star, ChevronRight, Crown, Tag, Gift, Package,
  Activity, CheckCircle2, AlertCircle, Target, Zap,
  Bell, Settings, Sparkles, FileText, Heart, UserCircle,
  Palette, TestTube
} from 'lucide-react';
import { getAdminStats } from '../../services/adminData';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get real statistics from data service
  const stats = getAdminStats();

  const highlights = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Today Orders',
      value: stats.pendingOrders,
      change: '+8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Active Branches',
      value: stats.activeBranches,
      change: 'All operational',
      trend: 'neutral',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  ];

  const quickActions = [
    {
      title: 'Branch Management',
      description: 'Manage locations & settings',
      icon: Building2,
      path: '/admin/branches',
      color: 'from-purple-500 to-purple-600',
      stats: `${stats.activeBranches}/${stats.totalBranches} active`,
    },
    {
      title: 'Menu Management',
      description: 'Update items, pricing & availability',
      icon: UtensilsCrossed,
      path: '/admin/menu',
      color: 'from-[#667c67] to-[#526250]',
      stats: '124 items',
    },
    {
      title: 'Inventory System',
      description: 'Stock tracking & auto-ordering',
      icon: Package,
      path: '/admin/inventory',
      color: 'from-amber-500 to-orange-600',
      stats: 'Real-time tracking',
    },
    {
      title: 'Orders Management',
      description: 'View and manage all orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      color: 'from-blue-500 to-blue-600',
      stats: `${stats.totalOrders} total`,
    },
    {
      title: 'Customers',
      description: 'Customer accounts & loyalty',
      icon: UserCircle,
      path: '/admin/customers',
      color: 'from-pink-500 to-rose-600',
      stats: `${stats.activeCustomers} active`,
    },
    {
      title: 'Table Management',
      description: 'QR codes, regions & layouts',
      icon: Grid3x3,
      path: '/admin/table-management',
      color: 'from-orange-500 to-red-600',
      stats: '87 tables',
    },
    {
      title: 'User Management',
      description: 'Staff accounts & permissions',
      icon: Users,
      path: '/admin/users',
      color: 'from-green-500 to-green-600',
      stats: `${stats.activeUsers} users`,
    },
    {
      title: 'Analytics & Reports',
      description: 'Performance insights & trends',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'from-blue-500 to-indigo-600',
      stats: 'Real-time data',
    },
    {
      title: 'Promotions',
      description: 'Special offers & discounts',
      icon: Tag,
      path: '/admin/promotions',
      color: 'from-red-500 to-pink-600',
      stats: 'Create campaigns',
    },
    {
      title: 'Loyalty Program',
      description: 'Points, tiers & rewards',
      icon: Crown,
      path: '/admin/loyalty',
      color: 'from-yellow-500 to-amber-600',
      stats: 'Manage rewards',
    },
    {
      title: 'Loyalty Gifts',
      description: 'Reward catalog management',
      icon: Gift,
      path: '/admin/gifts',
      color: 'from-violet-500 to-purple-600',
      stats: '3 active',
    },
    {
      title: 'Notifications',
      description: 'System alerts & messages',
      icon: Bell,
      path: '/admin/notifications',
      color: 'from-cyan-500 to-blue-600',
      stats: `${stats.unreadNotifications} unread`,
    },
    {
      title: 'Languages',
      description: 'Multi-language support',
      icon: Globe,
      path: '/admin/languages',
      color: 'from-teal-500 to-cyan-600',
      stats: '4 languages',
    },
    {
      title: 'Currency Management',
      description: 'Store & loyalty currencies',
      icon: DollarSign,
      path: '/admin/currency',
      color: 'from-emerald-500 to-green-600',
      stats: '8 currencies',
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      path: '/admin/settings',
      color: 'from-gray-500 to-slate-600',
      stats: 'Configure system',
    },
    {
      title: 'Brand Style Guide',
      description: 'Design system & components',
      icon: Palette,
      path: '/admin/brand-guide',
      color: 'from-indigo-500 to-purple-600',
      stats: 'View guidelines',
    },
    {
      title: 'Data Test',
      description: 'Testing & development tools',
      icon: TestTube,
      path: '/admin/data-test',
      color: 'from-emerald-500 to-green-600',
      stats: 'Dev tools',
    },
  ];

  const recentActivity = [
    { id: 1, type: 'branch', message: 'Downtown branch opened', time: '2 hours ago', icon: Building2, color: 'text-purple-600' },
    { id: 2, type: 'user', message: '3 new staff members added', time: '4 hours ago', icon: Users, color: 'text-green-600' },
    { id: 3, type: 'menu', message: 'Menu updated for all branches', time: '6 hours ago', icon: UtensilsCrossed, color: 'text-[#667c67]' },
    { id: 4, type: 'order', message: 'Peak hours: 247 orders today', time: '8 hours ago', icon: ShoppingCart, color: 'text-blue-600' },
    { id: 5, type: 'alert', message: 'Server maintenance scheduled', time: '1 day ago', icon: AlertCircle, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">System-wide overview and management</p>
            </div>
            <Badge className="bg-[#667c67] text-white border-none px-4 py-2">
              Super Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-2 border-gray-100 hover:border-[#667c67]/20 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    {stat.trend === 'up' && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your system efficiently</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="overflow-hidden cursor-pointer transition-all hover:shadow-xl active:scale-98 border-2 border-transparent hover:border-[#667c67]/20"
                        onClick={() => navigate(action.path)}
                      >
                        <div className="p-5 flex items-center gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <action.icon className="w-7 h-7 text-white" strokeWidth={2} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                            <p className="text-xs text-gray-500 mb-1">{action.description}</p>
                            <p className="text-xs font-semibold text-[#667c67]">{action.stats}</p>
                          </div>

                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* System Performance */}
            <Card className="border-2 border-gray-100 mt-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">System Performance</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                    <Activity className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
                    <p className="text-xs text-blue-600">Total Orders</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border-2 border-green-100">
                    <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-900">${stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-green-600">Total Revenue</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                    <Users className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{stats.totalCustomers}</p>
                    <p className="text-xs text-purple-600">Total Customers</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-100">
                    <Star className="w-6 h-6 text-yellow-600 mb-2" />
                    <p className="text-2xl font-bold text-yellow-900">{stats.avgOrderValue.toFixed(2)}</p>
                    <p className="text-xs text-yellow-600">Avg Order Value</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-2 border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                  <Badge variant="secondary">{recentActivity.length}</Badge>
                </div>
              </div>
              <div className="p-4">
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
              </div>
            </Card>

            {/* System Status */}
            <Card className="border-2 border-gray-100 bg-gradient-to-br from-[#667c67] to-[#526250] text-white">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">System Status</p>
                    <p className="text-xl font-bold">All Systems Operational</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">API Response Time</span>
                    <span className="font-semibold">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Server Uptime</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Database Status</span>
                    <span className="font-semibold">Healthy</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}