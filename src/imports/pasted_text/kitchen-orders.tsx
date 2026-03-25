import { useState, useEffect, useMemo } from 'react';
import { useApp } from './store';
import { 
  ChefHat, 
  Clock, 
  Timer, 
  AlertCircle, 
  CheckCircle, 
  Flame, 
  Package, 
  Utensils, 
  User, 
  MapPin, 
  Bell, 
  Play, 
  Check, 
  AlertTriangle, 
  Volume2,
  Grid3x3,
  History,
  Package2,
  Search,
  X,
  VolumeX,
  Trash2,
  RefreshCw,
  ArrowUpDown,
  Table2,
  Bike,
  PlayCircle,
  CheckCheck,
  Beef,
  Soup,
  Wine,
  Pizza,
  IceCream2,
  Salad
} from 'lucide-react';
import { toast } from 'sonner';

type KitchenStation = 'all' | 'grill' | 'appetizers' | 'bar' | 'pizza' | 'desserts' | 'cold-kitchen';
type Priority = 'urgent' | 'warning' | 'normal';
type ViewMode = 'active' | 'history' | 'inventory';
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

// Mock kitchen orders data with station assignments
const generateMockOrders = (): KitchenOrder[] => {
  const now = new Date();
  return [
    {
      id: '1',
      orderNumber: '#442',
      type: 'dine-in',
      priority: 'urgent',
      tableNumber: '12',
      items: [
        { id: '1', name: 'Ribeye Steak', name_ar: 'ستيك ريب آي', quantity: 2, specialInstructions: 'Medium Rare', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1619719015339-133a130520f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWJleWUlMjBzdGVhayUyMHBsYXRlfGVufDF8fHx8MTc3MzA0OTcwMHww&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '2', name: 'Caesar Salad', name_ar: 'سلطة سيزر', quantity: 1, specialInstructions: 'No onions, Extra dressing', station: 'cold-kitchen', imageUrl: 'https://images.unsplash.com/photo-1574926054530-540288c8e678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzczMDI2MTUzfDA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '3', name: 'Garlic Mashed Potato', name_ar: 'بطاطس مهروسة بالثوم', quantity: 1, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1708974138002-688a027a8c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBtYXNoZWQlMjBwb3RhdG98ZW58MXx8fHwxNzczMDQ5NzAwfDA&ixlib=rb-4.1.0&q=80&w=400' },
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
        { id: '4', name: 'Fish & Chips', name_ar: 'سمك وبطاطس', quantity: 3, specialInstructions: 'Extra tartar sauce', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwYW5kJTIwY2hpcHN8ZW58MXx8fHwxNzczMDQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '5', name: 'Beef Burger', name_ar: 'برجر لحم', quantity: 1, specialInstructions: 'Extra spicy', station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyfGVufDF8fHx8MTc3MzA0OTcwMnww&ixlib=rb-4.1.0&q=80&w=400' },
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
        { id: '6', name: 'Tomato Soup', name_ar: 'شوربة طماطم', quantity: 1, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1692776407523-8f3c4678ad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzb3VwJTIwYm93bHxlbnwxfHx8fDE3NzMwNDA2MjB8MA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '7', name: 'Garlic Bread', name_ar: 'خبز بالثوم', quantity: 2, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBicmVhZHxlbnwxfHx8fDE3NzMwNDk3MDJ8MA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '05:12',
      elapsedMinutes: 5,
      status: 'cooking',
      receivedAt: new Date(now.getTime() - 5 * 60000),
    },
    {
      id: '4',
      orderNumber: '#450',
      type: 'dine-in',
      priority: 'normal',
      tableNumber: '7',
      items: [
        { id: '8', name: 'Roast Chicken', name_ar: 'دجاج مشوي', quantity: 1, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdCUyMGNoaWNrZW58ZW58MXx8fHwxNzczMDQ5NzAyfDA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '9', name: 'Mashed Potato', name_ar: 'بطاطس مهروسة', quantity: 1, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1708974138002-688a027a8c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBtYXNoZWQlMjBwb3RhdG98ZW58MXx8fHwxNzczMDQ5NzAwfDA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '02:45',
      elapsedMinutes: 2,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 2 * 60000),
    },
    {
      id: '5',
      orderNumber: '#452',
      type: 'dine-in',
      priority: 'warning',
      tableNumber: '3',
      items: [
        { id: '10', name: 'Margherita Pizza', name_ar: 'بيتزا مارغريتا', quantity: 4, specialInstructions: 'Thin crust, Extra basil', station: 'pizza', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzcyOTU2NTc2fDA&ixlib=rb-4.1.0&q=80&w=400' },
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
        { id: '11', name: 'Pasta Carbonara', name_ar: 'باستا كاربونارا', quantity: 2, station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NzI5NzEyNTF8MA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '12', name: 'Red Wine (Glass)', name_ar: 'نبيذ أحمر (كأس)', quantity: 1, specialInstructions: 'Cabernet Sauvignon', station: 'bar', imageUrl: 'https://images.unsplash.com/photo-1630369160812-26c7604cbd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB3aW5lJTIwZ2xhc3N8ZW58MXx8fHwxNzczMDQ5NzAzfDA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '01:30',
      elapsedMinutes: 1,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 1 * 60000),
    },
    {
      id: '7',
      orderNumber: '#456',
      type: 'delivery',
      priority: 'normal',
      customerName: 'Ahmed Al-Mansouri',
      items: [
        { id: '13', name: 'Grilled Salmon', name_ar: 'سلمون مشوي', quantity: 2, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc3Mjk1MDUwNXww&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '14', name: 'Caesar Salad', name_ar: 'سلطة سيزر', quantity: 1, station: 'cold-kitchen', imageUrl: 'https://images.unsplash.com/photo-1574926054530-540288c8e678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzczMDI2MTUzfDA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '03:20',
      elapsedMinutes: 3,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 3 * 60000),
    },
    {
      id: '8',
      orderNumber: '#457',
      type: 'takeaway',
      priority: 'normal',
      customerName: 'Maria Garcia',
      items: [
        { id: '15', name: 'Beef Tacos', name_ar: 'تاكو لحم', quantity: 3, station: 'grill', imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwdGFjb3N8ZW58MXx8fHwxNzczMDQ5NzA0fDA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '16', name: 'Nachos', name_ar: 'ناتشوز', quantity: 1, specialInstructions: 'Extra cheese', station: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1669624272709-c5b91f66b1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWNob3MlMjBjaGVlc2V8ZW58MXx8fHwxNzcyOTUxMzc0fDA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '04:10',
      elapsedMinutes: 4,
      status: 'cooking',
      receivedAt: new Date(now.getTime() - 4 * 60000),
    },
    {
      id: '9',
      orderNumber: '#458',
      type: 'dine-in',
      priority: 'normal',
      tableNumber: '14',
      items: [
        { id: '17', name: 'Tiramisu', name_ar: 'تيراميسو', quantity: 2, station: 'desserts', imageUrl: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzcyOTUzMDgxfDA&ixlib=rb-4.1.0&q=80&w=400' },
        { id: '18', name: 'Espresso', name_ar: 'إسبريسو', quantity: 2, station: 'bar', imageUrl: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cHxlbnwxfHx8fDE3NzI5OTMzNTd8MA&ixlib=rb-4.1.0&q=80&w=400' },
      ],
      elapsedTime: '06:30',
      elapsedMinutes: 6,
      status: 'pending',
      receivedAt: new Date(now.getTime() - 6 * 60000),
    },
  ];
};

export function DashboardKitchen() {
  const { language } = useApp();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = (en: string, ar: string) => language === 'ar' ? ar : en;

  // State management
  const [orders, setOrders] = useState<KitchenOrder[]>(generateMockOrders());
  const [completedOrders, setCompletedOrders] = useState<KitchenOrder[]>([]);
  const [selectedStation, setSelectedStation] = useState<KitchenStation>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [sortBy, setSortBy] = useState<SortBy>('time');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Play sound effect
  const playSound = (type: 'start' | 'ready' | 'complete' | 'alert') => {
    if (!soundEnabled) return;
    
    // Create audio context for beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different actions
    switch (type) {
      case 'start':
        oscillator.frequency.value = 440; // A4
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'ready':
        oscillator.frequency.value = 523; // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.value = 659; // E5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'alert':
        oscillator.frequency.value = 880; // A5
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
          
          // Auto-update priority based on elapsed time
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
    }, 1000); // Update every second for accurate timing

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh orders (simulate new orders coming in)
  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshTimer = setInterval(() => {
      // Simulate 20% chance of new order
      if (Math.random() < 0.2 && orders.length < 15) {
        const newOrderNumber = `#${Math.floor(Math.random() * 900) + 100}`;
        const tables = ['5', '8', '11', '15', '19', '23'];
        const customers = ['John Smith', 'Emma Wilson', 'Michael Chen', 'Sofia Rodriguez'];
        
        // Don't add if we're in history mode
        if (viewMode !== 'active') return;
        
        const newOrder: KitchenOrder = {
          id: Date.now().toString(),
          orderNumber: newOrderNumber,
          type: Math.random() > 0.5 ? 'dine-in' : Math.random() > 0.5 ? 'takeaway' : 'delivery',
          priority: 'normal',
          tableNumber: Math.random() > 0.5 ? tables[Math.floor(Math.random() * tables.length)] : undefined,
          customerName: Math.random() > 0.5 ? customers[Math.floor(Math.random() * customers.length)] : undefined,
          items: [
            { 
              id: Date.now().toString(), 
              name: 'New Order Item', 
              name_ar: 'عنصر طلب جديد', 
              quantity: Math.floor(Math.random() * 3) + 1,
              station: ['grill', 'appetizers', 'bar', 'pizza', 'desserts', 'cold-kitchen'][Math.floor(Math.random() * 6)] as KitchenStation
            },
          ],
          elapsedTime: '00:00',
          elapsedMinutes: 0,
          status: 'pending',
          receivedAt: new Date(),
        };
        
        setOrders(prev => [...prev, newOrder]);
        playSound('alert');
        showToast(t(`New order ${newOrderNumber} received!`, `طلب جديد ${newOrderNumber} وصل!`));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(refreshTimer);
  }, [autoRefresh, orders.length, viewMode]);

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { 
            ...order, 
            status: newStatus,
            startedAt: newStatus === 'cooking' && !order.startedAt ? new Date() : order.startedAt,
            completedAt: newStatus === 'ready' ? new Date() : order.completedAt,
          };
          return updatedOrder;
        }
        return order;
      });
      
      return updatedOrders;
    });

    // Play appropriate sound
    if (newStatus === 'cooking') {
      playSound('start');
      showToast(t('Order started cooking', 'بدأ طهي الطلب'));
    } else if (newStatus === 'ready') {
      playSound('ready');
      showToast(t('Order ready to serve!', 'الطلب جاهز للتقديم!'));
    } else if (newStatus === 'completed') {
      playSound('complete');
      showToast(t('Order completed!', 'اكتمل الطلب!'));
      
      // Move to completed orders
      const completedOrder = orders.find(o => o.id === orderId);
      if (completedOrder) {
        setCompletedOrders(prev => [{ ...completedOrder, status: 'completed' }, ...prev]);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  // Clear all orders
  const clearAllOrders = () => {
    if (orders.length === 0) {
      showToast(t('No orders to clear', 'لا توجد طلبات للمسح'));
      return;
    }

    if (confirm(t('Are you sure you want to clear all active orders? This will move them to history.', 'هل أنت متأكد من مسح جميع الطلبات النشطة؟ سيتم نقلها إلى السجل.'))) {
      const completedNow = orders.map(o => ({ ...o, status: 'completed' as const, completedAt: new Date() }));
      setCompletedOrders(prev => [...completedNow, ...prev]);
      setOrders([]);
      playSound('complete');
      showToast(t('All orders cleared to history', 'تم مسح جميع الطلبات إلى السجل'));
    }
  };

  // Reset to sample orders
  const resetOrders = () => {
    setOrders(generateMockOrders());
    playSound('alert');
    showToast(t('Sample orders loaded', 'تم تحميل الطلبات التجريبية'));
  };

  // Filter orders by station
  const filteredByStation = useMemo(() => {
    const activeOrders = viewMode === 'active' ? orders : completedOrders;
    
    if (selectedStation === 'all') return activeOrders;
    
    return activeOrders.filter(order => 
      order.items.some(item => item.station === selectedStation)
    );
  }, [orders, completedOrders, selectedStation, viewMode]);

  // Filter by search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return filteredByStation;
    
    const query = searchQuery.toLowerCase();
    return filteredByStation.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.tableNumber?.toLowerCase().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(query) ||
        item.name_ar.includes(query)
      )
    );
  }, [filteredByStation, searchQuery]);

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
        ? `${Math.floor(activeOrders.reduce((sum, o) => sum + o.elapsedMinutes, 0) / activeOrders.length)}m ${Math.floor(Math.random() * 60)}s`
        : '0m 0s',
    };
  }, [orders, completedOrders, viewMode]);

  // Get priority styling
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          borderClass: 'border-l-8 border-red-500',
          headerBg: 'bg-red-50',
          headerBorder: 'border-red-100',
          textColor: 'text-red-600',
          timeColor: 'text-red-600',
          statusColor: 'text-red-800',
          statusBg: 'bg-red-50',
          label: t('Delayed', 'متأخر'),
        };
      case 'warning':
        return {
          borderClass: 'border-l-8 border-amber-500',
          headerBg: 'bg-amber-50',
          headerBorder: 'border-amber-100',
          textColor: 'text-amber-600',
          timeColor: 'text-amber-600',
          statusColor: 'text-amber-800',
          statusBg: 'bg-amber-50',
          label: t('Warning', 'تحذير'),
        };
      case 'normal':
        return {
          borderClass: 'border-l-8 border-emerald-500',
          headerBg: 'bg-emerald-50',
          headerBorder: 'border-emerald-100',
          textColor: 'text-emerald-600',
          timeColor: 'text-emerald-600',
          statusColor: 'text-emerald-800',
          statusBg: 'bg-emerald-50',
          label: t('Fresh', 'جديد'),
        };
    }
  };

  // Get station count
  const getStationCount = (station: KitchenStation) => {
    if (station === 'all') return orders.length;
    return orders.filter(order => 
      order.items.some(item => item.station === station)
    ).length;
  };

  return (
    <div className="flex flex-col h-full bg-[#e4dbc4]" dir={dir}>
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right">
          <div className="bg-[#667c67] text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[350px]">
            <Bell className="animate-bounce" size={32} />
            <span className="font-black text-2xl">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-[#667c67] text-white shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <ChefHat size={40} className="text-white" strokeWidth={2.5} />
            <div>
              <p className="text-sm text-white/80 font-bold mt-0.5">{t('KDS', 'نظام المطبخ')}</p>
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
              {t('Active Orders', 'الطلبات النشطة')}
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
              {t('History', 'السجل')}
              {completedOrders.length > 0 && (
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-black">
                  {completedOrders.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setViewMode('inventory')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-lg transition-colors ${
                viewMode === 'inventory' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <Package2 size={24} />
              {t('Inventory', 'المخزون')}
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
            <input
              type="text"
              placeholder={t('Search orders...', 'البحث عن الطلبات...')}
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
              showToast(soundEnabled 
                ? t('Sound disabled', 'تم تعطيل الصوت') 
                : t('Sound enabled', 'تم تفعيل الصوت')
              );
            }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all ${
              soundEnabled ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500/50 hover:bg-red-500/70'
            }`}
            title={soundEnabled ? t('Disable sound', 'تعطيل الصوت') : t('Enable sound', 'تفعيل الصوت')}
          >
            {soundEnabled ? <Volume2 size={26} /> : <VolumeX size={26} />}
          </button>
          <button
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              showToast(autoRefresh 
                ? t('Auto-refresh disabled', 'تم تعطيل التحديث التلقائي') 
                : t('Auto-refresh enabled', 'تم تفعيل التحديث التلقائي')
              );
            }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all ${
              autoRefresh ? 'bg-white/20 hover:bg-white/30' : 'bg-orange-500/50 hover:bg-orange-500/70'
            }`}
            title={autoRefresh ? t('Disable auto-refresh', 'تعطيل التحديث التلقائي') : t('Enable auto-refresh', 'تفعيل التحديث التلقائي')}
          >
            <RefreshCw size={26} className={autoRefresh ? 'animate-spin-slow' : ''} />
          </button>
          {viewMode === 'active' && (
            <button
              onClick={clearAllOrders}
              className="flex items-center gap-3 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-lg rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={orders.length === 0}
            >
              <Trash2 size={24} />
              {t('Clear All', 'مسح الكل')}
            </button>
          )}
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-all">
            <User size={26} />
          </div>
        </div>
      </header>

      {/* Sub-header Filters */}
      {viewMode !== 'inventory' && (
        <div className="flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-sm border-b-2 border-[#667c67]/10">
          <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setSelectedStation('all')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'all'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Grid3x3 size={22} />
              {t('All Stations', 'جميع الأقسام')}
              <span className={`px-3 py-1 rounded-full text-base font-black ${
                selectedStation === 'all' ? 'bg-white/30' : 'bg-[#667c67]/10'
              }`}>
                {getStationCount('all')}
              </span>
            </button>
            <button
              onClick={() => setSelectedStation('grill')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'grill'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Beef size={22} />
              {t('Meat Station', 'قسم اللحوم')}
              {getStationCount('grill') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'grill' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('grill')}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedStation('appetizers')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'appetizers'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Soup size={22} />
              {t('Appetizers', 'المقبلات')}
              {getStationCount('appetizers') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'appetizers' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('appetizers')}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedStation('bar')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'bar'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Wine size={22} />
              {t('Bar', 'البار')}
              {getStationCount('bar') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'bar' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('bar')}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedStation('pizza')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'pizza'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Pizza size={22} />
              {t('Pizza Oven', 'فرن البيتزا')}
              {getStationCount('pizza') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'pizza' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('pizza')}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedStation('desserts')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'desserts'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <IceCream2 size={22} />
              {t('Desserts', 'الحلويات')}
              {getStationCount('desserts') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'desserts' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('desserts')}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedStation('cold-kitchen')}
              className={`flex items-center gap-3 px-7 py-3 rounded-full font-black text-lg transition-all ${
                selectedStation === 'cold-kitchen'
                  ? 'bg-[#667c67] text-white shadow-lg scale-105'
                  : 'bg-white text-[#667c67] border-2 border-[#667c67]/20 hover:bg-[#667c67]/5 hover:scale-105'
              }`}
            >
              <Salad size={22} />
              {t('Cold Kitchen', 'المطبخ البارد')}
              {getStationCount('cold-kitchen') > 0 && (
                <span className={`px-3 py-1 rounded-full text-base font-black ${
                  selectedStation === 'cold-kitchen' ? 'bg-white/30' : 'bg-[#667c67]/10'
                }`}>
                  {getStationCount('cold-kitchen')}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                const sortOptions: SortBy[] = ['time', 'priority', 'table'];
                const currentIndex = sortOptions.indexOf(sortBy);
                const nextSort = sortOptions[(currentIndex + 1) % sortOptions.length];
                setSortBy(nextSort);
                showToast(t(
                  `Sorted by ${nextSort}`,
                  `تم الترتيب حسب ${nextSort === 'time' ? 'الوقت' : nextSort === 'priority' ? 'الأولوية' : 'الطاولة'}`
                ));
              }}
              className="flex items-center gap-3 px-6 py-3 bg-white text-[#667c67] border-2 border-[#667c67]/20 rounded-full font-black text-base hover:bg-[#667c67]/5 transition-all shadow-md hover:scale-105"
              title={t('Change sort order', 'تغيير الترتيب')}
            >
              <ArrowUpDown size={20} />
              <span className="uppercase">
                {sortBy === 'time' ? t('Time', 'الوقت') : sortBy === 'priority' ? t('Priority', 'الأولوية') : t('Table', 'الطاولة')}
              </span>
            </button>
            <div className="flex items-center gap-6 text-[#667c67] font-black">
              <div className="flex flex-col items-end">
                <span className="text-sm uppercase opacity-70 font-black">{t('Average Prep', 'متوسط التحضير')}</span>
                <span className="text-2xl">{stats.averagePrep}</span>
              </div>
              <div className="h-10 w-px bg-[#667c67]/20 mx-2"></div>
              <div className="flex flex-col items-end">
                <span className="text-sm uppercase opacity-70 font-black">{t('Active Load', 'الطلبات النشطة')}</span>
                <span className="text-2xl">{stats.totalOrders} {t('Orders', 'طلب')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Display */}
      <main className="flex-1 p-6 overflow-y-auto">
        {viewMode === 'inventory' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center mb-6">
              <Package2 size={64} className="text-[#667c67]/30" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#667c67]/50 mb-2">
              {t('Inventory Management', 'إدارة المخزون')}
            </h2>
            <p className="text-lg font-medium text-[#667c67]/40">
              {t('Coming soon', 'قريباً')}
            </p>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center mb-6">
              {searchQuery ? (
                <Search size={64} className="text-[#667c67]/30" />
              ) : (
                <ChefHat size={64} className="text-[#667c67]/30" />
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-[#667c67]/50 mb-2">
              {searchQuery 
                ? t('No orders found', 'لم يتم العثور على طلبات')
                : viewMode === 'history'
                ? t('No Completed Orders', 'لا توجد طلبات مكتملة')
                : t('No Active Orders', 'لا توجد طلبات نشطة')
              }
            </h2>
            <p className="text-lg font-medium text-[#667c67]/40 mb-6">
              {searchQuery
                ? t('Try a different search query', 'جرب كلمة بحث مختلفة')
                : viewMode === 'history'
                ? t('Completed orders will appear here', 'ستظهر الطلبات المكتملة هنا')
                : t('New orders will appear here', 'ستظهر الطلبات الجديدة هنا')
              }
            </p>
            {viewMode === 'active' && !searchQuery && (
              <button
                onClick={resetOrders}
                className="px-6 py-3 bg-[#667c67] hover:bg-[#556b56] text-white rounded-xl font-extrabold flex items-center gap-2 transition-all shadow-lg"
              >
                <RefreshCw size={20} />
                {t('Load Sample Orders', 'تحميل طلبات تجريبية')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {sortedOrders.map(order => {
              const priorityStyles = getPriorityStyles(order.priority);

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden ${priorityStyles.borderClass} transition-all hover:shadow-2xl hover:scale-[1.02]`}
                >
                  {/* Order Header */}
                  <div className={`p-6 ${priorityStyles.headerBg} flex justify-between items-center border-b-2 ${priorityStyles.headerBorder}`}>
                    <div>
                      <h3 className={`text-4xl font-black ${priorityStyles.textColor} leading-tight`}>
                        {order.type === 'dine-in' 
                          ? `${t('Table', 'طاولة')} ${order.tableNumber}`
                          : order.customerName
                        }
                      </h3>
                      <p className={`text-base font-black ${priorityStyles.statusColor} flex items-center gap-2 mt-2`}>
                        {t('Order', 'طلب')} {order.orderNumber} • 
                        {order.type === 'dine-in' ? (
                          <><Table2 size={16} strokeWidth={3} /> {t('Dine-in', 'داخل المطعم')}</>
                        ) : order.type === 'takeaway' ? (
                          <><Package size={16} strokeWidth={3} /> {t('Takeout', 'تيك أواي')}</>
                        ) : (
                          <><Bike size={16} strokeWidth={3} /> {t('Delivery', 'توصيل')}</>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-black ${priorityStyles.timeColor} tabular-nums`}>
                        {order.elapsedTime}
                      </p>
                      <p className={`text-sm font-black uppercase ${priorityStyles.statusColor} mt-1`}>
                        {priorityStyles.label}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 flex-1 space-y-5">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-start gap-4">
                        {/* Food Photo */}
                        {item.imageUrl && (
                          <div className="shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-xl shadow-md border-2 border-[#667c67]/20"
                            />
                          </div>
                        )}
                        <div className="flex items-start gap-4 flex-1">
                          <span className="text-4xl font-black text-[#667c67] min-w-[4rem] leading-none">
                            {item.quantity}×
                          </span>
                          <div className="flex-1">
                            <p className="text-2xl font-black leading-tight text-[#2b352b]">
                              {language === 'ar' ? item.name_ar : item.name}
                            </p>
                            {item.specialInstructions && (
                              <p className={`text-lg font-extrabold italic mt-2 px-3 py-2 rounded-lg ${
                                order.priority === 'urgent' ? 'text-red-700 bg-red-50' : 
                                order.priority === 'warning' ? 'text-amber-700 bg-amber-50' : 
                                'text-emerald-700 bg-emerald-50'
                              }`}>
                                ⚠️ {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="p-6 bg-slate-50 mt-auto border-t-2 border-slate-200">
                    {viewMode === 'history' ? (
                      <div className="w-full py-5 bg-gray-200 text-gray-600 rounded-xl text-2xl font-black uppercase tracking-wider flex items-center justify-center gap-3">
                        <CheckCheck size={30} strokeWidth={3} />
                        {t('Completed', 'مكتمل')}
                      </div>
                    ) : (
                      <>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cooking')}
                            className="w-full py-5 bg-[#667c67]/20 text-[#667c67] hover:bg-[#667c67]/30 rounded-xl text-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md"
                          >
                            <PlayCircle size={30} strokeWidth={3} />
                            {t('Start Cooking', 'بدء الطهي')}
                          </button>
                        )}
                        {order.status === 'cooking' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="w-full py-5 bg-[#667c67] hover:bg-[#556b56] text-white rounded-xl text-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                          >
                            <CheckCircle size={30} strokeWidth={3} />
                            {t('Ready to Serve', 'جاهز للتقديم')}
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-2xl font-black uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
                          >
                            <CheckCheck size={30} strokeWidth={3} />
                            {t('Complete', 'إكمال')}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Stats */}
      <footer className="bg-[#667c67] text-white py-3 px-8 flex justify-between items-center shadow-lg">
        <div className="flex gap-8 text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span>{t('Normal', 'عادي')}: {stats.normal}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span>{t('Warning', 'تحذير')}: {stats.warning}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-red-400 ${stats.urgent > 0 ? 'animate-pulse' : ''}`}></div>
            <span>{t('Urgent', 'عاجل')}: {stats.urgent}</span>
          </div>
          <div className="h-4 w-px bg-white/20 mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="opacity-70">{t('Total:', 'الإجمالي:')}</span>
            <span className="font-black">{stats.totalOrders}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-70 font-medium">
            {t('Kitchen Status:', 'حالة المطبخ:')} <span className="font-extrabold">{t('Online', 'متصل')}</span>
          </span>
          <div className="h-4 w-px bg-white/20 mx-2"></div>
          <span className="font-extrabold flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            {t('Auto-refresh:', 'التحديث التلقائي:')} {autoRefresh ? t('ON', 'مفعّل') : t('OFF', 'معطّل')}
          </span>
        </div>
      </footer>
    </div>
  );
}