import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/database';
import { seedDatabase } from '../lib/seedData';
import { verifyDatabaseIntegrity } from '../lib/verifyDatabaseIntegrity';
import type {
  Language,
  Branch,
  MenuItem,
  Order,
  OrderItem,
  LoyaltyCard,
  Category,
  MenuType,
  SystemSettings,
} from '../lib/types';

interface CartItem extends OrderItem {
  menuItem: MenuItem;
}

interface AppliedPromotion {
  code: string;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface AppContextType {
  // Language
  languages: Language[];
  availableLanguages: Language[];
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  setCurrentLanguage: (lang: string) => void;
  isRTL: boolean;
  
  // Branch & Table
  branches: Branch[];
  currentBranch: Branch | null;
  selectedBranch: Branch | null;
  selectBranch: (branchId: string) => void;
  selectedTable: string | null;
  selectTable: (tableId: string) => void;
  selectedRegion: string | null;
  selectRegion: (regionId: string) => void;
  
  // Order Type
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  setOrderType: (type: 'dine-in' | 'takeaway' | 'delivery') => void;
  deliveryAddress: string | null;
  setDeliveryAddress: (address: string) => void;
  pickupTime: string | null;
  setPickupTime: (time: string) => void;
  
  // Menu
  currentMenuType: MenuType;
  setCurrentMenuType: (type: MenuType) => void;
  categories: Category[];
  menuItems: MenuItem[];
  getMenuItemsByCategory: (categoryId: string) => MenuItem[];
  getMenuItemsByType: (menuType: MenuType) => MenuItem[];
  
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  
  // Promotions
  appliedPromotion: AppliedPromotion | null;
  setAppliedPromotion: (promotion: AppliedPromotion | null) => void;
  promotionDiscount: number;
  
  // Orders
  currentOrder: Order | null;
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Loyalty
  loyaltyCard: LoyaltyCard | null;
  
  // Settings
  settings: SystemSettings;
  
  // User
  userRole: 'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin';
  setUserRole: (role: 'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin') => void;
  
  // UI State
  isOnline: boolean;
  isLoading: boolean;
  
  // Refresh data
  refreshData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Mark context for Fast Refresh
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // This ensures the context is preserved during hot reload
  });
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  console.log('🟢 AppProvider rendering - providers are active!');
  const { i18n } = useTranslation();
  
  // Initialize database
  useEffect(() => {
    // Check if we need to reset database due to schema changes
    const dbVersion = localStorage.getItem('echefs_db_version');
    const CURRENT_VERSION = '3.3'; // Updated - forcing fresh rebuild March 19, 2026
    
    if (dbVersion !== CURRENT_VERSION) {
      console.log('🔄 Database version mismatch - forcing complete reset...');
      console.log(`  Old version: ${dbVersion}, New version: ${CURRENT_VERSION}`);
      
      // AGGRESSIVE CLEAR: Remove ALL localStorage items
      localStorage.clear();
      
      // Set new version FIRST before seeding
      localStorage.setItem('echefs_db_version', CURRENT_VERSION);
      
      console.log('✅ localStorage cleared completely');
    }
    
    // Always seed (will check internally if already seeded)
    seedDatabase();
    
    // Verify database integrity
    verifyDatabaseIntegrity();
    
    console.log('📊 Current branches in DB:', db.getBranches().map(b => ({ id: b.id, name: b.translations.en.name })));
  }, []);
  
  // State
  const [languages, setLanguages] = useState<Language[]>(db.getEnabledLanguages());
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>(db.getLanguages());
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [branches, setBranches] = useState<Branch[]>(db.getBranches(true));
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [deliveryAddress, setDeliveryAddress] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [currentMenuType, setCurrentMenuType] = useState<MenuType>('main');
  const [categories, setCategories] = useState<Category[]>(db.getCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(db.getMenuItems({ enabled: true }));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [userRole, setUserRole] = useState<'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin'>('customer');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isRTL = currentLanguage === 'ar';

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('echefs_language', lang);
  };

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('echefs_language');
    if (savedLang && languages.find(l => l.code === savedLang)) {
      setCurrentLanguage(savedLang);
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, [languages, i18n]);

  const selectBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
      setCurrentBranch(branch);
      setCart([]); // Clear cart when switching branches
      localStorage.setItem('echefs_branch', branchId);
    }
  };

  const selectTable = (tableId: string) => {
    setSelectedTable(tableId);
    localStorage.setItem('echefs_table', tableId);
  };

  const selectRegion = (regionId: string) => {
    setSelectedRegion(regionId);
    localStorage.setItem('echefs_region', regionId);
  };

  const getMenuItemsByCategory = (categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  const getMenuItemsByType = (menuType: MenuType): MenuItem[] => {
    return menuItems.filter(item => item.menuType === menuType);
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart(prevCart => {
      // Check if item with same modifiers exists
      const existingItemIndex = prevCart.findIndex(
        cartItem => 
          cartItem.menuItemId === item.menuItemId &&
          JSON.stringify(cartItem.modifiers) === JSON.stringify(item.modifiers)
      );
      
      if (existingItemIndex > -1) {
        // Update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, id: `cart_${Date.now()}_${Math.random()}` }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const cartCalculation = db.calculateOrderTotal(cart, true);
  const cartSubtotal = cartCalculation.subtotal;
  const cartTax = cartCalculation.tax;
  const cartTotal = cartCalculation.total;

  const createOrder = (orderData: Partial<Order>): Order => {
    if (!selectedBranch || cart.length === 0) {
      throw new Error('Cannot create order without branch and items');
    }

    // Get current user ID from localStorage auth data (safe method without circular dependency)
    let customerId = 'guest';
    try {
      const authData = localStorage.getItem('echefs_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.user && parsed.user.id) {
          customerId = parsed.user.id;
        }
      }
    } catch (error) {
      console.warn('Could not get user ID, using guest', error);
    }

    const order = db.createOrder({
      branchId: selectedBranch.id,
      customerId: customerId,
      tableId: selectedTable || undefined,
      items: cart.map(item => ({
        id: item.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        modifiers: item.modifiers,
        price: item.price,
        notes: item.notes,
        status: 'pending',
      })),
      status: 'pending',
      type: orderType,
      subtotal: cartSubtotal,
      tax: cartTax,
      discount: 0,
      tip: 0,
      total: cartTotal,
      paymentStatus: 'pending',
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      pickupTime: orderType === 'takeaway' ? pickupTime : undefined,
      ...orderData,
    });

    setOrders(prev => [order, ...prev]);
    setCurrentOrder(order);
    clearCart();

    // Add loyalty points if customer has a card
    if (loyaltyCard && settings.loyalty.enabled) {
      const points = Math.floor(order.total * settings.loyalty.pointsPerDollar);
      db.addLoyaltyPoints(loyaltyCard.userId, points, `Order ${order.orderNumber}`, order.id);
      setLoyaltyCard(db.getLoyaltyCard(loyaltyCard.userId));
    }

    return order;
  };

  const placeOrder = (orderData: Partial<Order>): Order => {
    return createOrder(orderData);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrder = db.updateOrder(orderId, { status });
    if (updatedOrder) {
      setOrders(prev =>
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      if (currentOrder?.id === orderId) {
        setCurrentOrder(updatedOrder);
      }
    }
  };

  const refreshData = () => {
    setLanguages(db.getEnabledLanguages());
    setBranches(db.getBranches(true));
    setCategories(db.getCategories());
    setMenuItems(db.getMenuItems({ enabled: true }));
    setSettings(db.getSettings());
    setOrders(db.getOrders());
  };

  // Load initial data
  useEffect(() => {
    // Load saved selections
    const savedBranch = localStorage.getItem('echefs_branch');
    const savedTable = localStorage.getItem('echefs_table');
    const savedRegion = localStorage.getItem('echefs_region');
    
    if (savedBranch && branches.length > 0) {
      const branch = branches.find(b => b.id === savedBranch);
      if (branch) {
        setSelectedBranch(branch);
        setCurrentBranch(branch);
      }
    }
    
    if (savedTable) setSelectedTable(savedTable);
    if (savedRegion) setSelectedRegion(savedRegion);

    // Load orders
    setOrders(db.getOrders());

    // Create/load loyalty card for demo
    let card = db.getLoyaltyCard('demo_user');
    if (!card) {
      card = db.createLoyaltyCard('demo_user');
    }
    setLoyaltyCard(card);
  }, [branches]);

  const value: AppContextType = {
    languages,
    availableLanguages,
    currentLanguage,
    changeLanguage,
    setCurrentLanguage,
    isRTL,
    branches,
    currentBranch,
    selectedBranch,
    selectBranch,
    selectedTable,
    selectTable,
    selectedRegion,
    selectRegion,
    orderType,
    setOrderType,
    deliveryAddress,
    setDeliveryAddress,
    pickupTime,
    setPickupTime,
    currentMenuType,
    setCurrentMenuType,
    categories,
    menuItems,
    getMenuItemsByCategory,
    getMenuItemsByType,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartTotal,
    appliedPromotion,
    setAppliedPromotion,
    promotionDiscount: appliedPromotion 
      ? (appliedPromotion.type === 'percentage' 
          ? cartSubtotal * (appliedPromotion.discount / 100) 
          : appliedPromotion.discount) 
      : 0,
    currentOrder,
    orders,
    createOrder,
    placeOrder,
    updateOrderStatus,
    loyaltyCard,
    settings,
    userRole,
    setUserRole,
    isOnline,
    isLoading,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};