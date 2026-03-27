import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Table2, Clock, User, Phone, MapPin, ShoppingCart,
  Package, CheckCircle, XCircle, Edit3, Printer, MessageSquare,
  UtensilsCrossed, AlertCircle, Flame, DollarSign, Plus, Minus,
  Trash2, RefreshCw, Share2, Bell, Check, X, ChevronDown, ChevronUp, Search,
  Sparkles, Star, Award, Leaf, Info, Coffee, Cake, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { MenuType } from '../lib/types';
import { AddItemToOrderModal } from '../components/waiter/AddItemToOrderModal';

interface OrderItem {
  id: string;
  name: string;
  name_ar?: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  special_instructions?: string;
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  image_url?: string;
  category?: string;
}

interface Order {
  id: string;
  order_number: string;
  table_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  created_at: Date;
  updated_at?: Date;
  served_at?: Date;
  waiter_name: string;
  waiter_id: string;
  customer_name?: string;
  customer_phone?: string;
  special_instructions?: string;
  payment_status: 'unpaid' | 'paid' | 'partial';
  payment_method?: 'cash' | 'card' | 'online';
  branch_name: string;
}

export function WaiterOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOrderDetails();
  }, [id, location.state]);

  const loadOrderDetails = () => {
    // First, check if order was passed via navigation state
    const passedOrder = (location.state as any)?.order;
    
    if (passedOrder) {
      // Use the passed order data and create full order object
      const fullOrder: Order = {
        id: passedOrder.id,
        order_number: passedOrder.order_number,
        table_number: passedOrder.table_number,
        status: passedOrder.status || 'preparing',
        waiter_name: 'Demo Waiter',
        waiter_id: 'demo-waiter',
        branch_name: 'Downtown Bishkek',
        created_at: passedOrder.created_at || new Date(Date.now() - 15 * 60000),
        payment_status: 'unpaid',
        items: generateMockItems(passedOrder),
        subtotal: passedOrder.total || 45.50,
        tax: (passedOrder.total || 45.50) * 0.1,
        total: passedOrder.total || 45.50,
      };
      setOrder(fullOrder);
      return;
    }

    // Try to load from localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    let foundOrder = waiterOrders.find((o: any) => o.id === id);

    // If not found, create mock order for demo
    if (!foundOrder) {
      foundOrder = createMockOrder(id || '1');
    }

    setOrder(foundOrder);
  };

  const generateMockItems = (orderData: any): OrderItem[] => {
    // Generate mock items based on the order data
    const itemsCount = orderData.items_count || 3;
    const readyItems = orderData.ready_items || 1;
    
    const mockItems: OrderItem[] = [
      {
        id: '1',
        name: 'Grilled Salmon',
        name_ar: 'سلمون مشوي',
        quantity: 2,
        price: 18.50,
        total: 37.00,
        status: readyItems >= 1 ? 'ready' : 'preparing',
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
        modifiers: [
          { id: 'm1', name: 'Extra Lemon', price: 0.50 },
          { id: 'm2', name: 'No Butter', price: 0 }
        ],
      },
      {
        id: '2',
        name: 'Caesar Salad',
        name_ar: 'سلطة سيزر',
        quantity: 1,
        price: 12.50,
        total: 12.50,
        status: readyItems >= 2 ? 'ready' : 'preparing',
        image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
      },
    ];

    if (itemsCount >= 3) {
      mockItems.push({
        id: '3',
        name: 'Beef Burger',
        name_ar: 'برجر لحم',
        quantity: 1,
        price: 15.00,
        total: 15.00,
        status: readyItems >= 3 ? 'ready' : 'pending',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
        special_instructions: 'Medium rare, extra pickles',
      });
    }

    return mockItems.slice(0, itemsCount);
  };

  const createMockOrder = (orderId: string): Order => {
    return {
      id: orderId,
      order_number: '#442',
      table_number: 'T12',
      status: 'preparing',
      waiter_name: 'Demo Waiter',
      waiter_id: 'demo-waiter',
      branch_name: 'Downtown Bishkek',
      created_at: new Date(Date.now() - 15 * 60000),
      payment_status: 'unpaid',
      items: [
        {
          id: '1',
          name: 'Grilled Salmon',
          name_ar: 'سلمون مشوي',
          quantity: 2,
          price: 18.50,
          total: 37.00,
          status: 'ready',
          image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
          modifiers: [
            { id: 'm1', name: 'Extra Lemon', price: 0.50 },
            { id: 'm2', name: 'No Butter', price: 0 }
          ],
        },
        {
          id: '2',
          name: 'Caesar Salad',
          name_ar: 'سلطة سيزر',
          quantity: 1,
          price: 12.50,
          total: 12.50,
          status: 'preparing',
          image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
        },
        {
          id: '3',
          name: 'Beef Burger',
          name_ar: 'برجر لحم',
          quantity: 1,
          price: 15.00,
          total: 15.00,
          status: 'pending',
          image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
          special_instructions: 'Medium rare, extra pickles',
        },
      ],
      subtotal: 64.50,
      tax: 6.45,
      total: 70.95,
    };
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-purple-500';
      case 'completed': return 'bg-emerald-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const OLD_UNUSED_loadMenuItems_DELETE_THIS = () => {
    // This is old unused code - keeping just for reference
    const saved = localStorage.getItem('echefs_menu_items');
    if (saved) {
      // setMenuItems(JSON.parse(saved));
    } else {
      // OLD CODE - NOT NEEDED ANYMORE SINCE WE USE AppContext
      const oldUnusedItems = [
        // Main Courses
        {
          id: 'mi1',
          name: 'Grilled Salmon',
          name_ar: 'سلمون مشوي',
          price: 18.50,
          image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Fresh Atlantic salmon grilled to perfection',
          badges: ['Popular', 'Chef Special'],
          dietary_tags: ['Gluten Free'],
          preparation_time: 20,
        },
        {
          id: 'mi5',
          name: 'Beef Burger',
          name_ar: 'برغر لحم',
          price: 12.50,
          image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Juicy beef patty with fresh vegetables',
          badges: ['Popular'],
          preparation_time: 15,
        },
        {
          id: 'mi6',
          name: 'Margherita Pizza',
          name_ar: 'بيتزا مارغريتا',
          price: 14.00,
          image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Classic Italian pizza with fresh mozzarella',
          dietary_tags: ['Vegetarian'],
          preparation_time: 18,
        },
        {
          id: 'mi7',
          name: 'Ribeye Steak',
          name_ar: 'ستيك ريب آي',
          price: 28.99,
          image_url: 'https://images.unsplash.com/photo-1619719015339-133a130520f6?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Premium ribeye steak grilled to perfection',
          badges: ['Chef Special', 'Recommended'],
          dietary_tags: ['Gluten Free'],
          preparation_time: 25,
        },
        {
          id: 'mi8',
          name: 'Chicken Alfredo',
          name_ar: 'دجاج ألفريدو',
          price: 16.99,
          image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Creamy fettuccine with grilled chicken',
          badges: ['Popular'],
          preparation_time: 20,
        },
        {
          id: 'mi9',
          name: 'Lamb Chops',
          name_ar: 'شرائح لحم الخروف',
          price: 24.50,
          image_url: 'https://images.unsplash.com/photo-1562158147-f8c57c1e085c?w=400&h=400&fit=crop',
          category: 'mains',
          menu_type: 'dine_in',
          description: 'Tender lamb chops with herbs',
          badges: ['Chef Special'],
          dietary_tags: ['Gluten Free'],
          preparation_time: 22,
        },
        
        // Appetizers
        {
          id: 'mi2',
          name: 'Caesar Salad',
          name_ar: 'سلطة سيزر',
          price: 8.50,
          image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Classic Caesar with crispy croutons',
          dietary_tags: ['Vegetarian'],
          preparation_time: 8,
        },
        {
          id: 'mi10',
          name: 'Greek Salad',
          name_ar: 'سلطة يونانية',
          price: 11.50,
          image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Fresh vegetables with feta cheese',
          dietary_tags: ['Vegetarian', 'Gluten Free'],
          preparation_time: 8,
        },
        {
          id: 'mi11',
          name: 'French Fries',
          name_ar: 'بطاطس مقلية',
          price: 4.50,
          image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Crispy golden fries',
          badges: ['Popular'],
          dietary_tags: ['Vegetarian', 'Vegan'],
          preparation_time: 10,
        },
        {
          id: 'mi12',
          name: 'Garlic Bread',
          name_ar: 'خبز بالثوم',
          price: 5.99,
          image_url: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Toasted bread with garlic butter',
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          preparation_time: 5,
        },
        {
          id: 'mi13',
          name: 'Onion Rings',
          name_ar: 'حلقات البصل',
          price: 6.99,
          image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Crispy battered onion rings',
          dietary_tags: ['Vegetarian'],
          preparation_time: 8,
        },
        {
          id: 'mi14',
          name: 'Tomato Soup',
          name_ar: 'شوربة طماطم',
          price: 8.99,
          image_url: 'https://images.unsplash.com/photo-1692776407523-8f3c4678ad36?w=400&h=400&fit=crop',
          category: 'appetizers',
          menu_type: 'dine_in',
          description: 'Creamy tomato soup with basil',
          dietary_tags: ['Vegetarian', 'Vegan'],
          preparation_time: 10,
        },

        // Desserts
        {
          id: 'mi4',
          name: 'Chocolate Cake',
          name_ar: 'كيكة الشوكولاتة',
          price: 6.50,
          image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
          category: 'desserts',
          menu_type: 'dine_in',
          description: 'Rich chocolate layer cake',
          badges: ['Popular'],
          preparation_time: 5,
        },
        {
          id: 'mi15',
          name: 'Tiramisu',
          name_ar: 'تيراميسو',
          price: 7.50,
          image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
          category: 'desserts',
          menu_type: 'dine_in',
          description: 'Classic Italian dessert',
          badges: ['Chef Special'],
          preparation_time: 5,
        },
        {
          id: 'mi16',
          name: 'Ice Cream',
          name_ar: 'آيس كريم',
          price: 5.50,
          image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
          category: 'desserts',
          menu_type: 'dine_in',
          description: 'Assorted flavors available',
          dietary_tags: ['Vegetarian'],
          preparation_time: 3,
        },
        {
          id: 'mi17',
          name: 'Cheesecake',
          name_ar: 'تشيز كيك',
          price: 8.00,
          image_url: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=400&fit=crop',
          category: 'desserts',
          menu_type: 'dine_in',
          description: 'New York style cheesecake',
          badges: ['Popular'],
          preparation_time: 5,
        },

        // Beverages
        {
          id: 'mi3',
          name: 'Iced Tea',
          name_ar: 'شاي مثلج',
          price: 3.50,
          image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
          category: 'drinks',
          menu_type: 'dine_in',
          description: 'Refreshing iced tea with lemon',
          dietary_tags: ['Vegan'],
          preparation_time: 3,
        },
        {
          id: 'mi18',
          name: 'Cappuccino',
          name_ar: 'كابتشينو',
          price: 4.00,
          image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
          category: 'drinks',
          menu_type: 'dine_in',
          description: 'Italian style cappuccino',
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          preparation_time: 5,
        },
        {
          id: 'mi19',
          name: 'Fresh Orange Juice',
          name_ar: 'عصير برتقال طازج',
          price: 5.50,
          image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
          category: 'drinks',
          menu_type: 'dine_in',
          description: 'Freshly squeezed orange juice',
          badges: ['New'],
          dietary_tags: ['Vegan', 'Gluten Free'],
          preparation_time: 3,
        },
        {
          id: 'mi20',
          name: 'Milkshake',
          name_ar: 'ميلك شيك',
          price: 5.99,
          image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
          category: 'drinks',
          menu_type: 'dine_in',
          description: 'Thick creamy milkshake - vanilla, chocolate or strawberry',
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          preparation_time: 5,
        },
        {
          id: 'mi21',
          name: 'Lemonade',
          name_ar: 'ليمونادة',
          price: 3.99,
          image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
          category: 'drinks',
          menu_type: 'dine_in',
          description: 'Fresh homemade lemonade',
          dietary_tags: ['Vegan', 'Gluten Free'],
          preparation_time: 3,
        },
      ];
      // OLD CODE - NOT USED
    }
  };

  const getItemStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'served': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleMarkAsServed = () => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: 'served' as const,
      served_at: new Date(),
      items: order.items.map(item => ({ ...item, status: 'served' as const }))
    };

    setOrder(updatedOrder);

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    toast.success('Order marked as served!');
  };

  const handleMarkItemAsServed = (itemId: string) => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      items: order.items.map(item =>
        item.id === itemId ? { ...item, status: 'served' as const } : item
      )
    };

    setOrder(updatedOrder);

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    toast.success('Item marked as served!');
  };

  const handleCancelOrder = () => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: 'cancelled' as const,
      cancel_reason: cancelReason,
      cancelled_at: new Date()
    };

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    toast.error('Order cancelled');
    setShowCancelModal(false);
    navigate('/waiter/dashboard');
  };

  const handlePrintReceipt = () => {
    toast.info('Printing receipt...');
    // In a real app, this would trigger the printer
  };

  const handleSendToKitchen = () => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: 'preparing' as const,
    };

    setOrder(updatedOrder);
    toast.success('Order sent to kitchen!');
  };

  // ADD ITEM functionality
  const handleAddItemToOrder = (newItem: any) => {
    if (!order) return;

    const updatedItems = [...order.items, newItem];
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTax = newSubtotal * 0.1;
    const newTotal = newSubtotal + newTax;

    const updatedOrder = {
      ...order,
      items: updatedItems,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
      updated_at: new Date(),
    };

    setOrder(updatedOrder);

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    // Close modal
    setShowAddItemModal(false);
  };

  // REMOVE ITEM functionality
  const handleRemoveItem = (itemId: string) => {
    if (!order) return;

    const itemToRemove = order.items.find(i => i.id === itemId);
    if (!itemToRemove) return;

    if (!confirm(`Remove "${itemToRemove.name}" from order?`)) return;

    const updatedItems = order.items.filter(i => i.id !== itemId);

    // If no items left, show warning
    if (updatedItems.length === 0) {
      toast.error('Cannot remove all items. Please cancel the order instead.');
      return;
    }

    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTax = newSubtotal * 0.1;
    const newTotal = newSubtotal + newTax;

    const updatedOrder = {
      ...order,
      items: updatedItems,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
      updated_at: new Date(),
    };

    setOrder(updatedOrder);

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    toast.success(`${itemToRemove.name} removed from order`);
  };

  // UPDATE ITEM QUANTITY
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (!order || newQuantity < 1) return;

    const updatedItems = order.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity,
        };
      }
      return item;
    });

    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTax = newSubtotal * 0.1;
    const newTotal = newSubtotal + newTax;

    const updatedOrder = {
      ...order,
      items: updatedItems,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
      updated_at: new Date(),
    };

    setOrder(updatedOrder);

    // Update localStorage
    const waiterOrders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    const updatedOrders = waiterOrders.map((o: any) =>
      o.id === order.id ? updatedOrder : o
    );
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(updatedOrders));

    toast.success('Quantity updated');
  };

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getTimeSince = (date: Date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  // OLD CODE REMOVED - Now using AddItemToOrderModal component

  const readyItemsCount = order?.items.filter(i => i.status === 'ready' || i.status === 'served').length || 0;
  const totalItemsCount = order?.items.length || 0;
  const progressPercentage = (readyItemsCount / totalItemsCount) * 100;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#FBF8F4] pb-24">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/waiter/dashboard')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#667c67] font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintReceipt}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-all"
              >
                <Edit3 className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Order Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          {/* Status Bar */}
          <div className={`${getStatusColor(order.status)} px-6 py-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-1">{order.order_number}</h1>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <Table2 className="w-4 h-4" />
                    {order.table_number}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTimeSince(order.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {order.waiter_name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">Status</div>
                <div className="text-2xl font-bold capitalize">{order.status}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {order.status === 'preparing' && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="font-semibold text-blue-900">Order Progress</span>
                <span className="text-blue-600">{readyItemsCount}/{totalItemsCount} items ready</span>
              </div>
              <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                />
              </div>
            </div>
          )}

          {/* Customer Info */}
          {(order.customer_name || order.customer_phone || order.special_instructions) && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.customer_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{order.customer_name}</span>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{order.customer_phone}</span>
                  </div>
                )}
              </div>
              {order.special_instructions && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-yellow-700 mb-1">Special Instructions</div>
                      <div className="text-sm text-yellow-800">{order.special_instructions}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#667c67]" />
                Order Items ({order.items.length})
              </h2>
              
              {/* Add Item Button */}
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="px-4 py-2 bg-[#667c67] hover:bg-[#556856] text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="px-6 py-4 hover:bg-gray-50 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {item.image_url && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-bold text-gray-900">×{item.quantity}</span>
                            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          </div>
                          {item.name_ar && (
                            <p className="text-sm text-gray-500 mb-1" dir="rtl">{item.name_ar}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getItemStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                            {item.category && (
                              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">${item.price.toFixed(2)} each</div>
                          <div className="text-xl font-bold text-[#667c67]">${item.total.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Modifiers */}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mb-2">
                          <button
                            onClick={() => toggleItemExpand(item.id)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-semibold"
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            {item.modifiers.length} Add-ons
                          </button>
                          <AnimatePresence>
                            {expandedItems.has(item.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 ml-6 space-y-1"
                              >
                                {item.modifiers.map((mod, idx) => {
                                  // Handle both old format (mod.name) and new format (mod.translations)
                                  const modName = mod.name || mod.translations?.en || mod.translations?.[currentLanguage] || 'Add-on';
                                  const modPrice = mod.price || 0;
                                  
                                  return (
                                    <div key={mod.id || idx} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">+ {modName}</span>
                                      <span className="text-gray-500">
                                        {modPrice > 0 ? `$${modPrice.toFixed(2)}` : 'Free'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Special Instructions */}
                      {item.special_instructions && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg mb-2">
                          <div className="flex items-center gap-2 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold">{item.special_instructions}</span>
                          </div>
                        </div>
                      )}

                      {/* Quantity Controls & Remove Button */}
                      {order.status !== 'cancelled' && order.status !== 'completed' && item.status !== 'served' && (
                        <div className="flex items-center gap-2 mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                item.quantity <= 1
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-white hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Item Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Mark as Served Button */}
                      {item.status === 'ready' && order.status !== 'served' && (
                        <button
                          onClick={() => handleMarkItemAsServed(item.id)}
                          className="mt-3 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 w-full justify-center"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Served
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#667c67]" />
              Order Summary
            </h2>
          </div>

          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Tax (10%)</span>
              <span className="font-semibold">${order.tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-[#667c67]">${order.total.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Payment Status</span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : order.payment_status === 'partial'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
              {order.payment_method && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-semibold text-gray-800 capitalize">{order.payment_method}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {order.status === 'pending' && (
              <button
                onClick={handleSendToKitchen}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5" />
                Send to Kitchen
              </button>
            )}

            {(order.status === 'ready' || order.status === 'preparing') && (
              <button
                onClick={handleMarkAsServed}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark All as Served
              </button>
            )}

            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Cancel Order
            </button>
          </motion.div>
        )}
      </div>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel order <strong>{order.order_number}</strong>?
                  This action cannot be undone.
                </p>

                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Customer requested, Item unavailable..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-0 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                >
                  Cancel Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal Placeholder */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Order</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-8">
                <Edit3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Edit order functionality will be available soon.
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Item Modal - New Design */}
      <AddItemToOrderModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAddItem={handleAddItemToOrder}
        currentLanguage={i18n.language}
      />
    </div>
  );
}