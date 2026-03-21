import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Star,
  Clock,
  Award,
  ChefHat,
  CreditCard,
  MapPin,
  Calendar,
  Activity,
  Package,
  Percent,
  Bell,
  Settings,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Table as TableIcon,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RevenueChart } from '../components/analytics/RevenueChart';

export function ComprehensiveDashboard() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - Replace with real API data
  const stats = {
    revenue: {
      total: 45820,
      change: 12.5,
      trend: 'up' as const,
    },
    orders: {
      total: 342,
      change: 8.3,
      trend: 'up' as const,
    },
    customers: {
      total: 278,
      change: -3.2,
      trend: 'down' as const,
    },
    avgOrder: {
      total: 134,
      change: 5.7,
      trend: 'up' as const,
    },
  };

  const ordersByStatus = [
    { status: 'received', count: 12, color: 'bg-blue-500' },
    { status: 'preparing', count: 24, color: 'bg-yellow-500' },
    { status: 'ready', count: 8, color: 'bg-green-500' },
    { status: 'served', count: 18, color: 'bg-purple-500' },
  ];

  const topMenuItems = [
    { id: '1', name: 'Grilled Salmon', orders: 45, revenue: 2250, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
    { id: '2', name: 'Caesar Salad', orders: 38, revenue: 1140, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
    { id: '3', name: 'Margherita Pizza', orders: 35, revenue: 1750, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
    { id: '4', name: 'Beef Burger', orders: 32, revenue: 1600, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { id: '5', name: 'Pasta Carbonara', orders: 28, revenue: 1260, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  ];

  const branches = [
    { id: '1', name: 'Downtown Branch', revenue: 18500, orders: 145, status: 'active', occupancy: 85 },
    { id: '2', name: 'Mall Branch', revenue: 15200, orders: 120, status: 'active', occupancy: 72 },
    { id: '3', name: 'Airport Branch', revenue: 12120, orders: 77, status: 'active', occupancy: 90 },
  ];

  const paymentMethods = [
    { method: 'Card', count: 156, percentage: 45.6, amount: 20900 },
    { method: 'Cash', count: 98, percentage: 28.7, amount: 13100 },
    { method: 'QR Code', count: 65, percentage: 19.0, amount: 8700 },
    { method: 'POS', count: 23, percentage: 6.7, amount: 3120 },
  ];

  const recentReviews = [
    { id: '1', customer: 'John Doe', rating: 5, comment: 'Excellent food and service!', time: '10 min ago' },
    { id: '2', customer: 'Jane Smith', rating: 4, comment: 'Great experience, will come again.', time: '25 min ago' },
    { id: '3', customer: 'Mike Johnson', rating: 5, comment: 'Best restaurant in town!', time: '1 hour ago' },
  ];

  const loyaltyStats = {
    totalMembers: 1247,
    activemembers: 892,
    pointsIssued: 45678,
    rewardsRedeemed: 234,
  };

  const tableOccupancy = [
    { region: 'Main Hall', total: 20, occupied: 17, reserved: 2, available: 1 },
    { region: 'Terrace', total: 12, occupied: 8, reserved: 3, available: 1 },
    { region: 'VIP Area', total: 6, occupied: 4, reserved: 1, available: 1 },
    { region: 'Bar Area', total: 8, occupied: 5, reserved: 0, available: 3 },
  ];

  const recentOrders = [
    { id: '#3421', table: 'T-12', items: 4, total: 145, status: 'preparing', time: '2 min ago' },
    { id: '#3420', table: 'T-08', items: 2, total: 89, status: 'ready', time: '5 min ago' },
    { id: '#3419', table: 'T-15', items: 6, total: 234, status: 'served', time: '8 min ago' },
    { id: '#3418', table: 'T-03', items: 3, total: 112, status: 'received', time: '12 min ago' },
  ];

  // Revenue chart data
  const revenueData = [
    { date: 'Mon', revenue: 4200, orders: 45 },
    { date: 'Tue', revenue: 5100, orders: 52 },
    { date: 'Wed', revenue: 4800, orders: 48 },
    { date: 'Thu', revenue: 6200, orders: 61 },
    { date: 'Fri', revenue: 7500, orders: 73 },
    { date: 'Sat', revenue: 8900, orders: 84 },
    { date: 'Sun', revenue: 9120, orders: 79 },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprehensive Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Complete overview of your eChefs platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['today', 'week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" size="md" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>

              <Button variant="primary" size="md" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.revenue.total.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.revenue.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stats.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.revenue.change}%
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.orders.total}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">{stats.orders.change}%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customers Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.customers.total}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">{Math.abs(stats.customers.change)}%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgOrder.total}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">{stats.avgOrder.change}%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-500">Daily revenue over time</p>
              </div>
              <LineChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-[300px]">
              <RevenueChart 
                data={revenueData}
                title="Revenue Trend"
                period="Last 7 days"
                totalRevenue={45820}
                growth={12.5}
                chartType="area"
              />
            </div>
          </Card>

          {/* Orders by Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Orders Status</h3>
                <p className="text-sm text-gray-500">Current order distribution</p>
              </div>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {ordersByStatus.map((status) => (
                <div key={status.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{status.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${status.color} h-2 rounded-full`}
                      style={{ width: `${(status.count / 62) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Menu Items & Branch Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Menu Items */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Menu Items</h3>
                <p className="text-sm text-gray-500">Best performing dishes</p>
              </div>
              <ChefHat className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topMenuItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.revenue}</p>
                    <p className="text-sm text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Branch Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Branch Performance</h3>
                <p className="text-sm text-gray-500">Revenue by location</p>
              </div>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{branch.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                        <span className="text-sm text-gray-500">{branch.orders} orders</span>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-primary">${branch.revenue.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Occupancy</span>
                      <span className="font-medium text-gray-900">{branch.occupancy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${branch.occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Methods & Loyalty Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <p className="text-sm text-gray-500">Transaction breakdown</p>
              </div>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div key={payment.method} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{payment.method}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">${payment.amount.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">({payment.count})</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${payment.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 w-12 text-right">
                    {payment.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Loyalty Program Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Loyalty Program</h3>
                <p className="text-sm text-gray-500">Member statistics</p>
              </div>
              <Award className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Total Members</p>
                <p className="text-3xl font-bold text-blue-900">{loyaltyStats.totalMembers.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Active Members</p>
                <p className="text-3xl font-bold text-green-900">{loyaltyStats.activemembers.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Points Issued</p>
                <p className="text-3xl font-bold text-purple-900">{loyaltyStats.pointsIssued.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <p className="text-sm text-orange-600 mb-1">Rewards Redeemed</p>
                <p className="text-3xl font-bold text-orange-900">{loyaltyStats.rewardsRedeemed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Table Occupancy & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table Occupancy */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Table Occupancy</h3>
                <p className="text-sm text-gray-500">Real-time table status</p>
              </div>
              <TableIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {tableOccupancy.map((area) => (
                <div key={area.region} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{area.region}</span>
                    <span className="text-sm text-gray-500">{area.total} tables</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center p-2 bg-red-100 rounded">
                      <p className="text-xs text-red-600 mb-1">Occupied</p>
                      <p className="text-lg font-bold text-red-900">{area.occupied}</p>
                    </div>
                    <div className="flex-1 text-center p-2 bg-yellow-100 rounded">
                      <p className="text-xs text-yellow-600 mb-1">Reserved</p>
                      <p className="text-lg font-bold text-yellow-900">{area.reserved}</p>
                    </div>
                    <div className="flex-1 text-center p-2 bg-green-100 rounded">
                      <p className="text-xs text-green-600 mb-1">Available</p>
                      <p className="text-lg font-bold text-green-900">{area.available}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
                <p className="text-sm text-gray-500">Latest customer feedback</p>
              </div>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.customer}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest order activity</p>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Table</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-gray-600">{order.table}</td>
                    <td className="py-3 px-4 text-gray-600">{order.items} items</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${order.total}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-sm">New Order</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <ChefHat className="w-6 h-6 text-primary" />
              <span className="text-sm">Menu Items</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm">Customers</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-sm">Branches</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
              <Settings className="w-6 h-6 text-primary" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}