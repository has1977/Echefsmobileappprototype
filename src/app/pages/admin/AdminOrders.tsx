import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ShoppingCart, Search, Filter, ArrowLeft, Download, Printer,
  Clock, CheckCircle, XCircle, TrendingUp, DollarSign,
  Package, Users, MapPin, Calendar, Eye, RefreshCw, X,
  ChevronDown, ChevronUp, MoreVertical, Edit, Trash2,
  FileText, CreditCard, Phone, Mail, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, LayoutGrid, List as ListIcon,
  AlertCircle, CheckCircle2, Timer, Truck, Ban, PlayCircle,
  ChefHat, BellRing, ExternalLink, Copy, Share2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { orders, getOrdersByStatus, getOrdersByBranch } from '../../services/adminData';
import type { Order } from '../../services/adminData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

type SortField = 'id' | 'created_at' | 'total' | 'customer_name' | 'status';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'card' | 'table';

export function AdminOrders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [groupByBranch, setGroupByBranch] = useState(true);

  // Helper to get item name from translations or string
  const getItemName = (item: any): string => {
    if (!item.name) return 'Item';
    if (typeof item.name === 'string') return item.name;
    if (typeof item.name === 'object' && item.name.en) {
      return item.name.en;
    }
    if (typeof item.name === 'object') {
      return item.name[Object.keys(item.name)[0]] || 'Item';
    }
    return 'Item';
  };

  // Helper to get item image
  const getItemImage = (itemName: string): string => {
    const images: { [key: string]: string } = {
      'Grilled Salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
      'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
      'Mineral Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop',
      'Margherita Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
      'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop',
      'Beef Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
      'French Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
      'Chicken Tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop',
      'Naan Bread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&h=200&fit=crop',
      'Mango Lassi': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=200&h=200&fit=crop',
      'Sushi Platter': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
      'Green Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop',
      'Vegetable Stir Fry': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop',
      'Pasta Carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop',
      'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
      'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    };
    return images[itemName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
  };

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.branch_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesBranch = filterBranch === 'all' || order.branch_id === filterBranch;
      const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment;
      
      const matchesDate = !dateRange.from || !dateRange.to || 
        isWithinInterval(new Date(order.created_at), {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        });
      
      const matchesPrice = 
        (!priceRange.min || order.total >= parseFloat(priceRange.min)) &&
        (!priceRange.max || order.total <= parseFloat(priceRange.max));
      
      return matchesSearch && matchesStatus && matchesBranch && matchesPayment && matchesDate && matchesPrice;
    });

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [searchQuery, filterStatus, filterBranch, filterPayment, dateRange, priceRange, sortField, sortOrder]);

  // Stats calculations
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const todayOrders = orders.filter(o => 
      new Date(o.created_at) >= today
    );

    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      active: filteredOrders.filter(o => ['preparing', 'ready'].includes(o.status)).length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: filteredOrders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, o) => sum + o.total, 0) / filteredOrders.length 
        : 0,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    };
  }, [filteredOrders]);

  // Chart data - Last 7 days
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        id: `revenue-day-${i}-${date.getTime()}`, // Make ID truly unique with timestamp
        date: format(date, 'MMM dd'),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      };
    });
    return days;
  }, []);

  // Status distribution for pie chart
  const statusData = useMemo(() => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'];
    return statuses.map((status, index) => ({
      id: `status-${status}-${index}-${Date.now()}`, // Make ID truly unique
      name: status,
      value: filteredOrders.filter(o => o.status === status).length,
    })).filter(s => s.value > 0);
  }, [filteredOrders]);

  const COLORS = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    preparing: '#8B5CF6',
    ready: '#10B981',
    delivered: '#14B8A6',
    completed: '#6B7280',
    cancelled: '#EF4444',
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-purple-100 text-purple-800 border-purple-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      delivered: 'bg-teal-100 text-teal-800 border-teal-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: Timer,
      confirmed: CheckCircle2,
      preparing: ChefHat,
      ready: BellRing,
      delivered: Truck,
      completed: CheckCircle,
      cancelled: Ban,
    };
    return icons[status] || Clock;
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Branch', 'Status', 'Payment', 'Total', 'Date'],
      ...filteredOrders.map(o => [
        o.id,
        o.customer_name,
        o.branch_name,
        o.status,
        o.payment_status,
        o.total.toFixed(2),
        format(new Date(o.created_at), 'yyyy-MM-dd HH:mm'),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handlePrint = (order: Order) => {
    window.print();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterBranch('all');
    setFilterPayment('all');
    setDateRange({ from: null, to: null });
    setPriceRange({ min: '', max: '' });
  };

  const activeFiltersCount = [
    filterStatus !== 'all',
    filterBranch !== 'all',
    filterPayment !== 'all',
    dateRange.from !== null,
    priceRange.min !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] to-[#fafaf8] pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-40 shadow-xl">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-xl"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-sm">Orders Management</h1>
                <p className="text-sm text-white/80 mt-0.5">Monitor and manage all orders across branches</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg gap-2"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Today Orders', value: stats.todayOrders, icon: ShoppingCart },
              { label: 'Today Revenue', value: `$${stats.todayRevenue.toFixed(0)}`, icon: DollarSign },
              { label: 'Active Orders', value: stats.active, icon: PlayCircle },
              { label: 'Avg Order', value: `$${stats.avgOrderValue.toFixed(0)}`, icon: TrendingUp },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </div>
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Revenue Trends</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Last 7 days performance</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#667c67]">
                    ${stats.totalRevenue.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Revenue</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="ordersColorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667c67" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#667c67" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#667c67" 
                    strokeWidth={2}
                    fill="url(#ordersColorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Status</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Current distribution</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.id} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.slice(0, 4).map((status) => (
                  <div key={status.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[status.name as keyof typeof COLORS] }}
                      />
                      <span className="capitalize text-gray-700">{status.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, customer, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-gray-300 focus:border-[#667c67] focus:ring-[#667c67]"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
                >
                  <option value="all">All Branches</option>
                  <option value="branch-1">Downtown Bishkek</option>
                  <option value="branch-2">Ala-Too Square</option>
                </select>

                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative border-gray-300 hover:bg-gray-50 gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#667c67] text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                <div className="flex gap-2 border-l border-gray-300 pl-2">
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={viewMode === 'card' ? 'bg-[#667c67] hover:bg-[#546352]' : 'border-gray-300'}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={viewMode === 'table' ? 'bg-[#667c67] hover:bg-[#546352]' : 'border-gray-300'}
                  >
                    <ListIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200 mt-4 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Date From</label>
                      <Input
                        type="date"
                        value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : null }))}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Date To</label>
                      <Input
                        type="date"
                        value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : null }))}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Min Price</label>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="border-gray-300"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Max Price</label>
                        <Input
                          type="number"
                          placeholder="$999"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="border-gray-300"
                    >
                      Clear All
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="bg-[#667c67] hover:bg-[#546352]"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders
          </div>
        </div>

        {/* Orders Display */}
        {viewMode === 'table' ? (
          /* TABLE VIEW */
          <Card className="shadow-sm border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('id')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        Order ID
                        {sortField === 'id' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortField !== 'id' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('customer_name')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        Customer
                        {sortField === 'customer_name' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortField !== 'customer_name' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase">Branch</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold text-gray-700 uppercase">Items</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        Status
                        {sortField === 'status' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortField !== 'status' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('total')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        Total
                        {sortField === 'total' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortField !== 'total' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('created_at')}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 uppercase"
                      >
                        Date
                        {sortField === 'created_at' && (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortField !== 'created_at' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-gray-700 uppercase">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-mono text-sm font-semibold text-gray-900">
                            #{order.id}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{order.customer_name}</div>
                            {order.table_number && (
                              <div className="text-xs text-gray-500">Table {order.table_number}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {order.branch_name}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge className={`${getStatusColor(order.status)} border w-fit`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status}
                            </Badge>
                            <Badge className={`${getPaymentStatusColor(order.payment_status)} border w-fit text-xs`}>
                              {order.payment_status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-600">
                            {format(new Date(order.created_at), 'MMM dd, HH:mm')}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* CARD VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer group border-gray-200">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-mono font-bold text-lg text-gray-900">#{order.id}</h3>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{order.customer_name}</span>
                            {order.table_number && (
                              <>
                                <span>•</span>
                                <span>Table {order.table_number}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{order.branch_name}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#667c67] mb-1">
                            ${order.total.toFixed(2)}
                          </div>
                          <Badge className={`${getPaymentStatusColor(order.payment_status)} border text-xs`}>
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                <span className="font-semibold text-gray-900">{item.quantity}x</span> {getItemName(item)}
                              </span>
                              <span className="font-semibold text-gray-900">${item.total.toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="group-hover:bg-[#667c67] group-hover:text-white group-hover:border-[#667c67] transition-all"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No orders found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        getItemName={getItemName}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        getPaymentStatusColor={getPaymentStatusColor}
      />
    </div>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ 
  order, 
  onClose, 
  getItemName, 
  getStatusColor, 
  getStatusIcon,
  getPaymentStatusColor 
}: { 
  order: Order | null; 
  onClose: () => void;
  getItemName: (item: any) => string;
  getStatusColor: (status: Order['status']) => string;
  getStatusIcon: (status: Order['status']) => any;
  getPaymentStatusColor: (status: Order['payment_status']) => string;
}) {
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('pending');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (!order) return null;

  const StatusIcon = getStatusIcon(order.status);

  // Helper to get item image
  const getItemImage = (itemName: string): string => {
    const images: { [key: string]: string } = {
      'Grilled Salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
      'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
      'Mineral Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop',
      'Margherita Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
      'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop',
      'Beef Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
      'French Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
      'Chicken Tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop',
      'Naan Bread': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&h=200&fit=crop',
      'Mango Lassi': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=200&h=200&fit=crop',
      'Sushi Platter': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop',
      'Green Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop',
      'Vegetable Stir Fry': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop',
      'Pasta Carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop',
      'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
      'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    };
    return images[itemName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';
  };

  const statusTimeline: { status: Order['status']; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Timer },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready', icon: BellRing },
    { status: 'delivered', label: 'Delivered', icon: Truck },
    { status: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  const currentStatusIndex = statusTimeline.findIndex(s => s.status === order.status);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast.success('Order ID copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `Order #${order.id} - ${order.customer_name}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}`;
    if (navigator.share) {
      navigator.share({
        title: `Order #${order.id}`,
        text: shareText,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Order details copied to clipboard!');
    }
  };

  const handleContactCustomer = () => {
    // Simulate opening communication options
    toast.info('Opening communication with ' + order.customer_name);
    // In real app, this would open email/phone/SMS dialog
  };

  const handleUpdateStatus = () => {
    setShowStatusUpdate(!showStatusUpdate);
  };

  const handleStatusChange = (newStatus: Order['status']) => {
    toast.success(`Order status updated to: ${newStatus}`);
    setShowStatusUpdate(false);
    // In real app, this would update the backend
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono">#{order.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyOrderId}
                    className="h-7 px-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Order placed on {format(new Date(order.created_at), 'MMMM dd, yyyy \'at\' HH:mm')}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Status & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-2">Order Status</div>
              <Badge className={`${getStatusColor(order.status)} border text-base px-3 py-1.5`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {order.status}
              </Badge>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-2">Payment Status</div>
              <Badge className={`${getPaymentStatusColor(order.payment_status)} border text-base px-3 py-1.5`}>
                <CreditCard className="w-4 h-4 mr-2" />
                {order.payment_status}
              </Badge>
            </div>
          </div>

          {/* Status Timeline */}
          {order.status !== 'cancelled' && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Order Progress</h4>
              <div className="space-y-3">
                {statusTimeline.map((item, index) => {
                  const TimelineIcon = item.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={item.status} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted 
                          ? 'bg-[#667c67] border-[#667c67] text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#667c67]/20' : ''}`}>
                        <TimelineIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.label}
                        </div>
                      </div>
                      {isCurrent && (
                        <Badge className="bg-[#667c67] text-white">Current</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                <span className="font-semibold">Customer</span>
              </div>
              <div className="font-medium text-gray-900 mb-1">{order.customer_name}</div>
              {order.table_number && (
                <div className="text-sm text-gray-600">Table {order.table_number}</div>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">Branch</span>
              </div>
              <div className="font-medium text-gray-900">{order.branch_name}</div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Order Items</h4>
            </div>
            <div className="p-5 space-y-3">
              {order.items.map((item) => {
                const itemName = getItemName(item);
                return (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={getItemImage(itemName)}
                        alt={itemName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{itemName}</div>
                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${item.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">${item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#667c67]">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 mb-1">Order Notes</div>
                  <div className="text-sm text-amber-800">{order.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button className="flex-1 bg-[#667c67] hover:bg-[#546352]" onClick={handleUpdateStatus}>
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleContactCustomer}>
              <Phone className="w-4 h-4 mr-2" />
              Contact Customer
            </Button>
          </div>

          {/* Status Update Form */}
          {showStatusUpdate && (
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Update Order Status</h4>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as Order['status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667c67] bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button
                size="sm"
                className="bg-[#667c67] hover:bg-[#546352] mt-3"
                onClick={() => handleStatusChange(currentStatus)}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}