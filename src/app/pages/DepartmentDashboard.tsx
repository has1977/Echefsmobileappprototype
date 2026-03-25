import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat, Clock, Timer, AlertCircle, CheckCircle, Flame, 
  Package, Utensils, User, MapPin, Bell, Play, Check, 
  AlertTriangle, Volume2, Grid3x3, History, Package2, Search,
  X, VolumeX, Trash2, RefreshCw, ArrowUpDown, Table2, Bike,
  PlayCircle, CheckCheck, Beef, Soup, Wine, Pizza, IceCream2,
  Salad, LogOut, Coffee, ShoppingCart, Calendar, TrendingUp,
  Users, Target, Award, Zap
} from 'lucide-react';

type KitchenStation = 'all' | 'grill' | 'appetizers' | 'bar' | 'pizza' | 'desserts' | 'cold-kitchen' | 'soup' | 'meat' | 'coffee';
type Priority = 'urgent' | 'warning' | 'normal';
type ViewMode = 'active' | 'history';
type SortBy = 'time' | 'priority' | 'table';

interface OrderItem {
  id: string;
  name: string;
  name_ar: string;
  quantity: number;
  specialInstructions?: string;
  station: KitchenStation;
  imageUrl?: string;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  priority: Priority;
  tableNumber?: string;
  customerName?: string;
  items: OrderItem[];
  elapsedTime: string;
  elapsedMinutes: number;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  receivedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const stationIcons = {
  all: Grid3x3,
  grill: Flame,
  appetizers: Utensils,
  bar: Wine,
  pizza: Pizza,
  desserts: IceCream2,
  'cold-kitchen': Salad,
  soup: Soup,
  meat: Beef,
  coffee: Coffee,
};

const stationColors = {
  all: 'from-gray-500 to-gray-600',
  grill: 'from-orange-500 to-red-500',
  appetizers: 'from-green-500 to-emerald-500',
  bar: 'from-purple-500 to-pink-500',
  pizza: 'from-yellow-500 to-orange-500',
  desserts: 'from-pink-500 to-purple-500',
  'cold-kitchen': 'from-cyan-500 to-blue-500',
  soup: 'from-amber-500 to-orange-500',
  meat: 'from-red-600 to-red-700',
  coffee: 'from-amber-600 to-amber-700',
};

// Mock orders generator
const generateMockOrders = (station: KitchenStation): KitchenOrder[] => {
  const now = new Date();
  const allOrders: KitchenOrder[] = [
    {
      id: '1',
      orderNumber: '#442',
      type: 'dine-in',
      priority: 'urgent',
      tableNumber: '12',
      items: [
        { id: '1', name: 'Ribeye Steak', name_ar: 'ستيك ريب آي', quantity: 2, specialInstructions: 'Medium Rare', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1619719015339-133a130520f6?w=400' },
        { id: '3', name: 'Garlic Mashed Potato', name_ar: 'بطاطس مهروسة بالثوم', quantity: 1, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1708974138002-688a027a8c09?w=400' },
      ],
      elapsedTime: '22:05',
      elapsedMinutes: 22,
      status: 'cooking',
      receivedAt: new Date(now.getTime() - 22 * 60000),
    },
    {
      id: '2',
      orderNumber: '#445',
      type: 'takeaway',
      priority: 'warning',
      customerName: 'Sarah Johnson',
      items: [
        { id: '4', name: 'Fish & Chips', name_ar: 'سمك وبطاطس', quantity: 3, specialInstructions: 'Extra tartar sauce', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400' },
        { id: '5', name: 'Beef Burger', name_ar: 'برجر لحم', quantity: 1, specialInstructions: 'Extra spicy', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
      ],
      elapsedTime: '12:40',
      elapsedMinutes: 12,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 12 * 60000),
    },
    {
      id: '3',
      orderNumber: '#448',
      type: 'dine-in',
      priority: 'normal',
      tableNumber: '18',
      items: [
        { id: '6', name: 'Tomato Soup', name_ar: 'شوربة طماطم', quantity: 1, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1692776407523-8f3c4678ad36?w=400' },
        { id: '7', name: 'Garlic Bread', name_ar: 'خبز بالثوم', quantity: 2, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400' },
      ],
      elapsedTime: '05:12',
      elapsedMinutes: 5,
      status: 'cooking',
      receivedAt: new Date(now.getTime() - 5 * 60000),
    },
    {
      id: '5',
      orderNumber: '#452',
      type: 'dine-in',
      priority: 'warning',
      tableNumber: '3',
      items: [
        { id: '10', name: 'Margherita Pizza', name_ar: 'بيتزا مارغريتا', quantity: 4, specialInstructions: 'Thin crust, Extra basil', station: 'pizza', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      ],
      elapsedTime: '10:15',
      elapsedMinutes: 10,
      status: 'cooking',
      receivedAt: new Date(now.getTime() - 10 * 60000),
    },
    {
      id: '6',
      orderNumber: '#455',
      type: 'dine-in',
      priority: 'normal',
      tableNumber: '21',
      items: [
        { id: '11', name: 'Pasta Carbonara', name_ar: 'باستا كاربونارا', quantity: 2, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400' },
        { id: '12', name: 'Red Wine (Glass)', name_ar: 'نبيذ أحمر (كأس)', quantity: 1, specialInstructions: 'Cabernet Sauvignon', station: 'bar', imageUrl: 'https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?w=400' },
      ],
      elapsedTime: '01:30',
      elapsedMinutes: 1,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 1 * 60000),
    },
    {
      id: '9',
      orderNumber: '#458',
      type: 'dine-in',
      priority: 'normal',
      tableNumber: '14',
      items: [
        { id: '17', name: 'Tiramisu', name_ar: 'تيراميسو', quantity: 2, station: 'desserts', imageUrl: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?w=400' },
        { id: '18', name: 'Espresso', name_ar: 'إسبريسو', quantity: 2, station: 'bar', imageUrl: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?w=400' },
      ],
      elapsedTime: '06:30',
      elapsedMinutes: 6,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 6 * 60000),
    },
  ];

  // Filter by station
  if (station === 'all') return allOrders;
  
  return allOrders.filter(order =>
    order.items.some(item => item.station === station)
  );
};

export function DepartmentDashboard() {
  const navigate = useNavigate();
  const { departmentId } = useParams<{ departmentId: string }>();
  const { user } = useAuth();
  
  // Get department info from localStorage
  const [departmentInfo, setDepartmentInfo] = useState<any>(null);
  const [currentStation, setCurrentStation] = useState<KitchenStation>('all');
  
  // State management
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<KitchenOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [sortBy, setSortBy] = useState<SortBy>('time');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Load department info
    const departments = JSON.parse(localStorage.getItem('echefs_departments') || '[]');
    const dept = departments.find((d: any) => d.id === departmentId);
    if (dept) {
      setDepartmentInfo(dept);
      setCurrentStation(dept.icon as KitchenStation);
      setOrders(generateMockOrders(dept.icon as KitchenStation));
    }
  }, [departmentId]);

  // Play sound effect
  const playSound = (type: 'start' | 'ready' | 'complete' | 'alert') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'start':
        oscillator.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'ready':
        oscillator.frequency.value = 523;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.value = 659;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'alert':
        oscillator.frequency.value = 880;
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  // Show toast notification
  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Update elapsed time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          const elapsed = Math.floor((new Date().getTime() - order.receivedAt.getTime()) / 60000);
          const hours = Math.floor(elapsed / 60);
          const minutes = elapsed % 60;
          const timeString = hours > 0
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            : `${minutes.toString().padStart(2, '0')}:${Math.floor((new Date().getTime() - order.receivedAt.getTime()) % 60000 / 1000).toString().padStart(2, '0')}`;
          
          let newPriority = order.priority;
          if (elapsed > 15 && order.status !== 'ready') {
            newPriority = 'urgent';
          } else if (elapsed > 10 && order.status !== 'ready') {
            newPriority = 'warning';
          }
          
          return {
            ...order,
            elapsedTime: timeString,
            elapsedMinutes: elapsed,
            priority: newPriority,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            startedAt: newStatus === 'cooking' && !order.startedAt ? new Date() : order.startedAt,
            completedAt: newStatus === 'ready' ? new Date() : order.completedAt,
          };
        }
        return order;
      });
      
      return updatedOrders;
    });

    if (newStatus === 'cooking') {
      playSound('start');
      showToast('Order started cooking');
    } else if (newStatus === 'ready') {
      playSound('ready');
      showToast('Order ready to serve!');
    } else if (newStatus === 'completed') {
      playSound('complete');
      showToast('Order completed!');
      
      const completedOrder = orders.find(o => o.id === orderId);
      if (completedOrder) {
        setCompletedOrders(prev => [{ ...completedOrder, status: 'completed' }, ...prev]);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  // Filter by search query
  const filteredOrders = useMemo(() => {
    const activeOrders = viewMode === 'active' ? orders : completedOrders;
    
    if (!searchQuery.trim()) return activeOrders;
    
    const query = searchQuery.toLowerCase();
    return activeOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.tableNumber?.toLowerCase().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.items.some(item =>
        item.name.toLowerCase().includes(query) ||
        item.name_ar.includes(query)
      )
    );
  }, [orders, completedOrders, searchQuery, viewMode]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    
    switch (sortBy) {
      case 'time':
        return sorted.sort((a, b) => b.elapsedMinutes - a.elapsedMinutes);
      case 'priority':
        const priorityOrder = { urgent: 3, warning: 2, normal: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'table':
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.tableNumber || '999');
          const bNum = parseInt(b.tableNumber || '999');
          return aNum - bNum;
        });
      default:
        return sorted;
    }
  }, [filteredOrders, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeOrders = viewMode === 'active' ? orders : completedOrders;
    
    return {
      normal: activeOrders.filter(o => o.priority === 'normal').length,
      warning: activeOrders.filter(o => o.priority === 'warning').length,
      urgent: activeOrders.filter(o => o.priority === 'urgent').length,
      totalOrders: activeOrders.length,
      averagePrep: activeOrders.length > 0
        ? `${Math.floor(activeOrders.reduce((sum, o) => sum + o.elapsedMinutes, 0) / activeOrders.length)}m`
        : '0m',
    };
  }, [orders, completedOrders, viewMode]);

  // Get priority styling
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          borderClass: 'border-l-8 border-red-500',
          headerBg: 'bg-red-50',
          textColor: 'text-red-600',
          timeColor: 'text-red-600',
          label: 'Delayed',
        };
      case 'warning':
        return {
          borderClass: 'border-l-8 border-amber-500',
          headerBg: 'bg-amber-50',
          textColor: 'text-amber-600',
          timeColor: 'text-amber-600',
          label: 'Warning',
        };
      case 'normal':
        return {
          borderClass: 'border-l-8 border-emerald-500',
          headerBg: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          timeColor: 'text-emerald-600',
          label: 'Fresh',
        };
    }
  };

  if (!departmentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading department...</p>
        </div>
      </div>
    );
  }

  const StationIcon = stationIcons[currentStation] || Grid3x3;

  return (
    <div className="flex flex-col h-screen bg-[#e4dbc4]">
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            className="fixed top-8 right-8 z-50"
          >
            <div className="bg-[#667c67] text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[350px]">
              <Bell className="animate-bounce" size={32} />
              <span className="font-black text-2xl">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-[#667c67] text-white shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stationColors[currentStation]} flex items-center justify-center shadow-lg`}>
              <StationIcon size={32} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black">{departmentInfo.name}</h1>
              <p className="text-sm text-white/80 font-bold">{departmentInfo.name_ar}</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-6 ml-4">
            <button
              onClick={() => setViewMode('active')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-lg backdrop-blur-sm transition-all ${
                viewMode === 'active' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <Grid3x3 size={24} />
              Active Orders
              {orders.length > 0 && (
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-black">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-lg transition-colors ${
                viewMode === 'history' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <History size={24} />
              History
              {completedOrders.length > 0 && (
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-black">
                  {completedOrders.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-3 bg-white/20 border-none rounded-xl text-white text-lg placeholder:text-white/70 focus:ring-2 focus:ring-white/50 w-80 backdrop-blur-sm font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'Sound disabled' : 'Sound enabled');
            }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all ${
              soundEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500/50 hover:bg-red-500/70'
            }`}
          >
            {soundEnabled ? <Volume2 size={26} /> : <VolumeX size={26} />}
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                navigate('/auth/sign-in');
              }
            }}
            className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-black text-lg transition-all"
          >
            <LogOut size={24} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-8 py-6 bg-white shadow-md">
        <div className="grid grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-emerald-700 uppercase">Fresh</span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-4xl font-black text-emerald-600">{stats.normal}</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-amber-700 uppercase">Warning</span>
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-4xl font-black text-amber-600">{stats.warning}</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 border-2 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-red-700 uppercase">Delayed</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-4xl font-black text-red-600">{stats.urgent}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-700 uppercase">Total</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-4xl font-black text-blue-600">{stats.totalOrders}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-purple-700 uppercase">Avg Time</span>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-4xl font-black text-purple-600">{stats.averagePrep}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="px-8 py-4 bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-[#667c67]/20"
            >
              <option value="time">Time (Oldest First)</option>
              <option value="priority">Priority (Urgent First)</option>
              <option value="table">Table Number</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-gray-600">
              {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''} displayed
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Package2 className="w-32 h-32 text-gray-300 mb-6" />
            <h2 className="text-3xl font-black text-gray-400 mb-2">
              {viewMode === 'active' ? 'No Active Orders' : 'No Order History'}
            </h2>
            <p className="text-gray-500 text-lg">
              {viewMode === 'active' ? 'Waiting for new orders...' : 'Completed orders will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {sortedOrders.map((order, index) => {
              const styles = getPriorityStyles(order.priority);
              const relevantItems = order.items.filter(item => 
                currentStation === 'all' || item.station === currentStation
              );

              if (relevantItems.length === 0 && currentStation !== 'all') return null;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden ${styles.borderClass} hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Order Header */}
                  <div className={`${styles.headerBg} px-6 py-4 border-b-2 ${styles.borderClass.replace('border-l-8', 'border-b')}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-black text-gray-800">{order.orderNumber}</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-black ${styles.textColor} bg-white/50`}>
                          {styles.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.type === 'dine-in' && <Table2 size={20} className="text-gray-600" />}
                        {order.type === 'takeaway' && <ShoppingCart size={20} className="text-gray-600" />}
                        {order.type === 'delivery' && <Bike size={20} className="text-gray-600" />}
                        <span className="text-sm font-bold text-gray-600 capitalize">{order.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {order.tableNumber && (
                          <div className="text-sm font-bold text-gray-700">
                            Table #{order.tableNumber}
                          </div>
                        )}
                        {order.customerName && (
                          <div className="text-sm font-bold text-gray-700">{order.customerName}</div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 ${styles.timeColor} font-black text-2xl`}>
                        <Clock size={24} />
                        {order.elapsedTime}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-4">
                    {relevantItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-black text-lg text-gray-800">{item.name}</h4>
                            <span className="bg-[#667c67] text-white font-black text-lg px-3 py-1 rounded-full">
                              x{item.quantity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{item.name_ar}</p>
                          {item.specialInstructions && (
                            <div className="mt-2 p-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                              <p className="text-xs font-bold text-yellow-800">
                                📝 {item.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {viewMode === 'active' && (
                    <div className="px-6 pb-6">
                      <div className="flex gap-3">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cooking')}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <PlayCircle size={24} />
                            Start Cooking
                          </button>
                        )}
                        {order.status === 'cooking' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={24} />
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <CheckCheck size={24} />
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
