import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, Clock, Timer, AlertCircle, CheckCircle, Flame, Package, 
  Utensils, User, MapPin, Bell, Play, Check, AlertTriangle, Volume2,
  Grid3x3, History, Package2, Search, X, VolumeX, Trash2, RefreshCw,
  ArrowUpDown, Table2, Bike, PlayCircle, CheckCheck, Beef, Soup,
  Wine, Pizza, IceCream2, Salad, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

type KitchenStation = 'all' | 'grill' | 'appetizers' | 'bar' | 'pizza' | 'desserts' | 'cold-kitchen';
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

// Generate mock orders
const generateMockOrders = (): KitchenOrder[] => {
  // Load real orders from waiter system
  const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
  const menuItems = JSON.parse(localStorage.getItem('echefs_menu_items') || '[]');
  const departments = JSON.parse(localStorage.getItem('echefs_departments') || '[]');
  
  const now = new Date();
  
  // Convert waiter orders to kitchen format
  const realOrders: KitchenOrder[] = waiterOrders
    .filter((wo: any) => wo.status !== 'completed' && wo.status !== 'cancelled')
    .map((wo: any) => {
      const items: OrderItem[] = wo.items.map((item: any) => {
        // Find menu item to get image and department
        const menuItem = menuItems.find((mi: any) => mi.id === item.id);
        const department = menuItem?.department_id 
          ? departments.find((d: any) => d.id === menuItem.department_id) 
          : null;
        
        // Map department icon to station
        const stationMap: Record<string, KitchenStation> = {
          'grill': 'grill',
          'bar': 'bar',
          'pizza': 'pizza',
          'desserts': 'desserts',
          'appetizers': 'appetizers',
          'cold-kitchen': 'cold-kitchen',
          'soup': 'appetizers',
          'meat': 'grill',
          'coffee': 'bar',
        };
        
        const station = department?.icon ? stationMap[department.icon] || 'appetizers' : 'appetizers';
        
        return {
          id: item.id,
          name: item.name,
          name_ar: item.name_ar || item.name,
          quantity: item.quantity,
          specialInstructions: item.notes,
          station: station,
          imageUrl: menuItem?.image_url,
        };
      });
      
      const elapsed = Math.floor((now.getTime() - new Date(wo.created_at).getTime()) / 60000);
      const minutes = elapsed % 60;
      const seconds = Math.floor((now.getTime() - new Date(wo.created_at).getTime()) % 60000 / 1000);
      
      let priority: Priority = 'normal';
      if (elapsed > 15) priority = 'urgent';
      else if (elapsed > 10) priority = 'warning';
      
      return {
        id: wo.id,
        orderNumber: wo.order_number || `#${wo.id.slice(0, 3)}`,
        type: wo.order_type || 'dine-in',
        priority,
        tableNumber: wo.table_number,
        customerName: wo.customer_name,
        items,
        elapsedTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        elapsedMinutes: elapsed,
        status: wo.status === 'pending' ? 'pending' : wo.status === 'preparing' ? 'cooking' : wo.status === 'ready' ? 'ready' : 'completed',
        receivedAt: new Date(wo.created_at),
      };
    });
  
  // If no real orders, return sample orders
  if (realOrders.length === 0) {
    return [
      {
        id: '1',
        orderNumber: '#442',
        type: 'dine-in',
        priority: 'urgent',
        tableNumber: '12',
        items: [
          { id: '1', name: 'Ribeye Steak', name_ar: 'ستيك ريب آي', quantity: 2, specialInstructions: 'Medium Rare', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1619719015339-133a130520f6?w=400' },
          { id: '2', name: 'Caesar Salad', name_ar: 'سلطة سيزر', quantity: 1, specialInstructions: 'No onions', station: 'cold-kitchen', imageUrl: 'https://images.unsplash.com/photo-1574926054530-540288c8e678?w=400' },
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
    ];
  }
  
  return realOrders;
};

export function KitchenDisplayPage() {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId?: string }>();
  
  const [orders, setOrders] = useState<KitchenOrder[]>(generateMockOrders());
  const [completedOrders, setCompletedOrders] = useState<KitchenOrder[]>([]);
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [sortBy, setSortBy] = useState<SortBy>('time');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const t = (en: string, ar: string) => en; // Simplified for now

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
        break;
      case 'ready':
        oscillator.frequency.value = 523;
        break;
      case 'complete':
        oscillator.frequency.value = 659;
        break;
      case 'alert':
        oscillator.frequency.value = 880;
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const elapsed = Math.floor((new Date().getTime() - order.receivedAt.getTime()) / 60000);
          const minutes = elapsed % 60;
          const seconds = Math.floor((new Date().getTime() - order.receivedAt.getTime()) % 60000 / 1000);
          const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
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

  // Auto-refresh orders from localStorage every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshInterval = setInterval(() => {
      const freshOrders = generateMockOrders();
      setOrders(freshOrders);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(refreshInterval);
  }, [autoRefresh]);

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
      toast.success('Order started cooking');
    } else if (newStatus === 'ready') {
      playSound('ready');
      toast.success('Order ready to serve!');
    } else if (newStatus === 'completed') {
      playSound('complete');
      toast.success('Order completed!');
      
      const completedOrder = orders.find(o => o.id === orderId);
      if (completedOrder) {
        setCompletedOrders(prev => [{ ...completedOrder, status: 'completed' }, ...prev]);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const activeOrders = viewMode === 'active' ? orders : completedOrders;
    
    let filtered = activeOrders;
    
    if (selectedStation !== 'all') {
      filtered = filtered.filter(order => 
        order.items.some(item => item.station === selectedStation)
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.tableNumber?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    const sorted = [...filtered];
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
  }, [orders, completedOrders, selectedStation, searchQuery, sortBy, viewMode]);

  // Get priority styling
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          borderClass: 'border-l-8 border-red-500',
          headerBg: 'bg-red-50',
          textColor: 'text-red-600',
          label: 'Delayed',
        };
      case 'warning':
        return {
          borderClass: 'border-l-8 border-amber-500',
          headerBg: 'bg-amber-50',
          textColor: 'text-amber-600',
          label: 'Warning',
        };
      case 'normal':
        return {
          borderClass: 'border-l-8 border-emerald-500',
          headerBg: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          label: 'Fresh',
        };
    }
  };

  // Station icons
  const getStationIcon = (station: KitchenStation) => {
    switch (station) {
      case 'grill': return Beef;
      case 'appetizers': return Soup;
      case 'bar': return Wine;
      case 'pizza': return Pizza;
      case 'desserts': return IceCream2;
      case 'cold-kitchen': return Salad;
      default: return Utensils;
    }
  };

  const stations: Array<{ id: KitchenStation; name: string; icon: any }> = [
    { id: 'all', name: 'All Orders', icon: Grid3x3 },
    { id: 'grill', name: 'Grill', icon: Beef },
    { id: 'appetizers', name: 'Appetizers', icon: Soup },
    { id: 'bar', name: 'Bar', icon: Wine },
    { id: 'pizza', name: 'Pizza', icon: Pizza },
    { id: 'desserts', name: 'Desserts', icon: IceCream2 },
    { id: 'cold-kitchen', name: 'Cold Kitchen', icon: Salad },
  ];

  const stats = {
    normal: orders.filter(o => o.priority === 'normal').length,
    warning: orders.filter(o => o.priority === 'warning').length,
    urgent: orders.filter(o => o.priority === 'urgent').length,
    totalOrders: orders.length,
  };

  return (
    <div className="flex flex-col h-screen bg-[#e4dbc4]">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-[#667c67] text-white shadow-lg z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <ChefHat size={40} className="text-white" strokeWidth={2.5} />
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display System</h1>
              <p className="text-sm text-white/80 font-bold mt-0.5">Real-time Order Management</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 ml-4">
            <button 
              onClick={() => setViewMode('active')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                viewMode === 'active' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <Grid3x3 size={20} />
              Active Orders
              {orders.length > 0 && (
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold">
                  {orders.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                viewMode === 'history' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <History size={20} />
              History
              {completedOrders.length > 0 && (
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold">
                  {completedOrders.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-3 bg-white/20 border-none rounded-xl text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50 w-80 backdrop-blur-sm font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              soundEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500/50'
            }`}
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white px-8 py-4 shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-semibold text-gray-700">Fresh: {stats.normal}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-sm font-semibold text-gray-700">Warning: {stats.warning}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold text-gray-700">Urgent: {stats.urgent}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 bg-gray-100 rounded-lg border-0 font-semibold text-sm focus:ring-2 focus:ring-[#667c67]"
            >
              <option value="time">Time</option>
              <option value="priority">Priority</option>
              <option value="table">Table</option>
            </select>
          </div>
        </div>
      </div>

      {/* Station Filters */}
      <div className="bg-white px-8 py-4 border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {stations.map((station) => {
            const Icon = station.icon;
            const isActive = selectedStation === station.id;
            const count = station.id === 'all' ? orders.length : orders.filter(o => o.items.some(i => i.station === station.id)).length;
            
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-[#667c67] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                {station.name}
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/30' : 'bg-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Package size={64} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Orders</h3>
            <p className="text-gray-500">Orders will appear here when they come in</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const priorityStyles = getPriorityStyles(order.priority);
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden ${priorityStyles.borderClass}`}
                  >
                    {/* Header */}
                    <div className={`${priorityStyles.headerBg} px-6 py-4 border-b border-gray-200`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-gray-900">{order.orderNumber}</span>
                          {order.type === 'dine-in' && order.tableNumber && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                              <Table2 size={14} />
                              Table {order.tableNumber}
                            </span>
                          )}
                          {order.type === 'takeaway' && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                              <Package size={14} />
                              Takeaway
                            </span>
                          )}
                          {order.type === 'delivery' && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
                              <Bike size={14} />
                              Delivery
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`flex items-center gap-2 text-3xl font-black ${priorityStyles.textColor}`}>
                          <Clock size={24} />
                          {order.elapsedTime}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${priorityStyles.textColor} bg-white/50`}>
                          {priorityStyles.label}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-4 space-y-3">
                      {order.items.map((item) => {
                        const StationIcon = getStationIcon(item.station);
                        return (
                          <div key={item.id} className="flex items-start gap-3">
                            {item.imageUrl ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to icon if image fails
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `<div class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <StationIcon size={24} className="text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold text-gray-900">×{item.quantity}</span>
                                <span className="font-bold text-gray-700">{item.name}</span>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-sm text-red-600 font-semibold mt-1 flex items-center gap-1">
                                  <AlertCircle size={14} />
                                  {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cooking')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                        >
                          <Play size={18} />
                          Start
                        </button>
                      )}
                      {order.status === 'cooking' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                        >
                          <CheckCircle size={18} />
                          Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
                        >
                          <CheckCheck size={18} />
                          Served
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}