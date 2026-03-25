import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, LogOut, QrCode, Plus, Clock, CheckCircle, AlertCircle,
  Eye, UtensilsCrossed, DollarSign, TrendingUp, Package,
  Table2, Users, Star, Bell, Coffee, Flame, Target,
  BarChart3, Award, Zap, Timer, ShoppingCart, Grid3x3,
  List, Search, Filter, Calendar, MessageSquare, Heart,
  Settings
} from 'lucide-react';

interface WaiterOrder {
  id: string;
  table_number: string;
  order_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  items_count: number;
  total: number;
  created_at: Date;
  ready_items: number;
  customer_name?: string;
}

export function WaiterDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [waiterInfo, setWaiterInfo] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState<WaiterOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<WaiterOrder[]>([]);
  const [viewMode, setViewMode] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load waiter info
    const waiters = JSON.parse(localStorage.getItem('echefs_waiters') || '[]');
    
    // For demo purposes, if no user is logged in, use the first waiter
    let currentWaiter;
    if (user?.email) {
      currentWaiter = waiters.find((w: any) => w.email === user.email);
    }
    
    // If no waiter found or no user, use first waiter or create demo waiter
    if (!currentWaiter && waiters.length > 0) {
      currentWaiter = waiters[0];
    } else if (!currentWaiter) {
      // Create a demo waiter for testing
      currentWaiter = {
        id: 'demo-waiter',
        name: 'Demo Waiter',
        email: 'demo@echefs.com',
        phone: '+996 555 000 000',
        branch_id: 'branch-1',
        branch_name: 'Downtown Bishkek',
        pin_code: '1234',
        status: 'active',
        performance: {
          total_orders: 45,
          avg_rating: 4.8,
          total_sales: 2500,
          customer_satisfaction: 95,
        },
        created_at: new Date(),
      };
    }
    
    if (currentWaiter) {
      setWaiterInfo(currentWaiter);
      loadOrders(currentWaiter.id);
    }
  }, [user]);

  const loadOrders = (waiterId: string) => {
    // Mock orders for now
    const mockActiveOrders: WaiterOrder[] = [
      {
        id: '1',
        table_number: 'T12',
        order_number: '#442',
        status: 'preparing',
        items_count: 3,
        total: 45.50,
        created_at: new Date(Date.now() - 15 * 60000),
        ready_items: 1,
      },
      {
        id: '2',
        table_number: 'T05',
        order_number: '#445',
        status: 'ready',
        items_count: 2,
        total: 32.00,
        created_at: new Date(Date.now() - 8 * 60000),
        ready_items: 2,
      },
      {
        id: '3',
        table_number: 'T18',
        order_number: '#448',
        status: 'pending',
        items_count: 4,
        total: 68.75,
        created_at: new Date(Date.now() - 3 * 60000),
        ready_items: 0,
      },
    ];
    setActiveOrders(mockActiveOrders);
  };

  const getTimeSince = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  const getStatusColor = (status: WaiterOrder['status']) => {
    switch (status) {
      case 'pending': return 'from-gray-500 to-gray-600';
      case 'preparing': return 'from-blue-500 to-blue-600';
      case 'ready': return 'from-green-500 to-green-600';
      case 'served': return 'from-purple-500 to-purple-600';
      case 'completed': return 'from-emerald-500 to-emerald-600';
    }
  };

  const getStatusIcon = (status: WaiterOrder['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'preparing': return Flame;
      case 'ready': return CheckCircle;
      case 'served': return UtensilsCrossed;
      case 'completed': return CheckCircle;
    }
  };

  const stats = {
    activeOrders: activeOrders.length,
    readyOrders: activeOrders.filter(o => o.status === 'ready').length,
    totalSales: activeOrders.reduce((sum, o) => sum + o.total, 0),
    avgRating: waiterInfo?.performance?.avg_rating || 0,
  };

  const displayOrders = viewMode === 'active' ? activeOrders : completedOrders;
  const filteredOrders = displayOrders.filter(order =>
    order.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!waiterInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4]">
        <div className="text-center">
          <User className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4 animate-pulse" />
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4]">
      {/* Top Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#667c67] to-[#546352] text-white flex items-center justify-center text-xl font-bold">
                {waiterInfo.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F2933]">{waiterInfo.name}</h2>
                <p className="text-sm text-[#6B7280]">{waiterInfo.branch_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/waiter/settings')}
                className="w-10 h-10 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center transition-all"
              >
                <Settings className="w-5 h-5 text-[#6B7280]" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    navigate('/auth/sign-in');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Active Orders</span>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">{stats.activeOrders}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Ready to Serve</span>
              <Bell className="w-5 h-5 text-green-500 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.readyOrders}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Today's Sales</span>
              <DollarSign className="w-5 h-5 text-[#667c67]" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">${stats.totalSales.toFixed(2)}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#9CA3AF] uppercase">Your Rating</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-[#1F2933]">{stats.avgRating.toFixed(1)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate('/waiter/new-order')}
            className="bg-gradient-to-r from-[#667c67] to-[#546352] hover:from-[#546352] hover:to-[#667c67] text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" />
            New Order
          </button>
          
          <button
            onClick={() => navigate('/waiter/scan-table')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <QrCode className="w-6 h-6" />
            Scan Table QR
          </button>
          
          <button
            onClick={() => navigate('/waiter/tables')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Table2 className="w-6 h-6" />
            View Tables
          </button>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-[#F3F4F6] p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('active')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    viewMode === 'active'
                      ? 'bg-[#667c67] text-white shadow-md'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  Active Orders ({activeOrders.length})
                </button>
                <button
                  onClick={() => setViewMode('completed')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    viewMode === 'completed'
                      ? 'bg-[#667c67] text-white shadow-md'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  Completed ({completedOrders.length})
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search table or order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#F9FAFB] border-0 rounded-xl text-sm focus:ring-2 focus:ring-[#667c67]/20 w-64"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1F2933] mb-2">
                  {viewMode === 'active' ? 'No Active Orders' : 'No Completed Orders'}
                </h3>
                <p className="text-[#6B7280]">
                  {viewMode === 'active' ? 'Start taking orders from customers' : 'Completed orders will appear here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const statusColor = getStatusColor(order.status);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/waiter/order/${order.id}`)}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#667c67]"
                    >
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${statusColor} p-4 text-white`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Table2 className="w-5 h-5" />
                            <span className="text-2xl font-black">{order.table_number}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold capitalize">{order.status}</span>
                          </div>
                        </div>
                        <div className="text-sm opacity-90">{order.order_number}</div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                            <Package className="w-4 h-4" />
                            <span>{order.items_count} items</span>
                          </div>
                          <div className="text-2xl font-bold text-[#667c67]">
                            ${order.total.toFixed(2)}
                          </div>
                        </div>

                        {/* Progress */}
                        {order.status === 'preparing' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1">
                              <span>Progress</span>
                              <span>{order.ready_items}/{order.items_count} ready</span>
                            </div>
                            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${(order.ready_items / order.items_count) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Time */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-[#9CA3AF]">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeSince(order.created_at)}</span>
                          </div>
                          
                          {order.status === 'ready' && (
                            <div className="flex items-center gap-1 text-green-600 font-semibold animate-pulse">
                              <Bell className="w-4 h-4" />
                              <span>Ready!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {viewMode === 'active' && (
                        <div className="px-4 pb-4">
                          {order.status === 'ready' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Mark as served
                              }}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Served
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#667c67]" />
              Today's Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Orders Completed</span>
                <span className="text-lg font-bold text-[#1F2933]">
                  {waiterInfo.performance?.total_orders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Customer Satisfaction</span>
                <span className="text-lg font-bold text-green-600">
                  {waiterInfo.performance?.customer_satisfaction || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Total Sales</span>
                <span className="text-lg font-bold text-[#667c67]">
                  ${waiterInfo.performance?.total_sales?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recent Ratings
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#F9FAFB] rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-[#6B7280]">"Excellent service!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}