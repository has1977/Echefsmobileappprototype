// Admin System - Comprehensive Data & Business Logic

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'customer';
  branch_id?: string;
  branch_name?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  last_login?: Date;
  avatar?: string;
  permissions?: string[];
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  manager_id: string;
  manager_name: string;
  status: 'active' | 'inactive' | 'maintenance';
  opening_hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  coordinates?: { lat: number; lng: number };
  capacity: number;
  tables_count: number;
  avg_rating?: number;
  total_orders?: number;
  revenue_today?: number;
  created_at: Date;
}

export interface Order {
  id: string;
  branch_id: string;
  branch_name: string;
  customer_id?: string;
  customer_name: string;
  table_number?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method?: string;
  created_at: Date;
  completed_at?: Date;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date?: Date;
  created_at: Date;
  status: 'active' | 'inactive';
  favorite_branch?: string;
  favorite_items?: string[];
}

export interface Notification {
  id: string;
  type: 'order' | 'system' | 'promotion' | 'alert' | 'inventory';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  recipient_type: 'all' | 'branch' | 'role' | 'user';
  recipient_id?: string;
  branch_id?: string;
  read: boolean;
  created_at: Date;
  expires_at?: Date;
  action_url?: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  image?: string;
  category: 'voucher' | 'product' | 'experience' | 'discount';
  status: 'active' | 'inactive' | 'out_of_stock';
  claimed_count: number;
  value: number;
  created_at: Date;
  expires_at?: Date;
}

export interface Analytics {
  period: 'today' | 'week' | 'month' | 'year';
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  new_customers: number;
  returning_customers: number;
  top_selling_items: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  revenue_by_branch: {
    branch_id: string;
    branch_name: string;
    revenue: number;
    orders: number;
  }[];
  revenue_trend: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

// ===================
// USERS
// ===================
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah@echefs.kg',
    phone: '+996 555 100 001',
    role: 'admin',
    status: 'active',
    created_at: new Date('2025-01-15'),
    last_login: new Date('2026-03-14T08:30:00'),
    permissions: ['all'],
  },
  {
    id: 'user-2',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@echefs.kg',
    phone: '+996 555 100 002',
    role: 'manager',
    branch_id: 'branch-1',
    branch_name: 'Downtown Bishkek',
    status: 'active',
    created_at: new Date('2025-02-01'),
    last_login: new Date('2026-03-14T09:15:00'),
    permissions: ['branch_management', 'menu', 'orders', 'reports'],
  },
  {
    id: 'user-3',
    name: 'Elena Petrova',
    email: 'elena@echefs.kg',
    phone: '+996 555 100 003',
    role: 'manager',
    branch_id: 'branch-2',
    branch_name: 'Ala-Too Square',
    status: 'active',
    created_at: new Date('2025-02-15'),
    last_login: new Date('2026-03-14T07:45:00'),
    permissions: ['branch_management', 'menu', 'orders', 'reports'],
  },
  {
    id: 'user-4',
    name: 'Dmitri Sokolov',
    email: 'dmitri@echefs.kg',
    phone: '+996 555 100 004',
    role: 'waiter',
    branch_id: 'branch-1',
    branch_name: 'Downtown Bishkek',
    status: 'active',
    created_at: new Date('2025-03-01'),
    last_login: new Date('2026-03-14T10:00:00'),
    permissions: ['orders', 'tables'],
  },
  {
    id: 'user-5',
    name: 'Bakyt Asanov',
    email: 'bakyt@echefs.kg',
    phone: '+996 555 100 005',
    role: 'kitchen',
    branch_id: 'branch-1',
    branch_name: 'Downtown Bishkek',
    status: 'active',
    created_at: new Date('2025-03-10'),
    last_login: new Date('2026-03-14T08:00:00'),
    permissions: ['kitchen'],
  },
  {
    id: 'user-6',
    name: 'Fatima Hassan',
    email: 'fatima@echefs.kg',
    phone: '+996 555 100 006',
    role: 'waiter',
    branch_id: 'branch-2',
    branch_name: 'Ala-Too Square',
    status: 'active',
    created_at: new Date('2025-03-15'),
    last_login: new Date('2026-03-14T09:30:00'),
    permissions: ['orders', 'tables'],
  },
];

// ===================
// BRANCHES
// ===================
export const branches: Branch[] = [
  {
    id: 'branch-1',
    name: 'eChefs Downtown',
    address: '123 Main Street, Downtown',
    city: 'Bishkek',
    country: 'Kyrgyzstan',
    phone: '+996 312 555 001',
    email: 'downtown@echefs.kg',
    manager_id: 'user-2',
    manager_name: 'Ahmed Al-Rashid',
    status: 'active',
    opening_hours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' },
    },
    coordinates: { lat: 42.8746, lng: 74.5698 },
    capacity: 120,
    tables_count: 25,
    avg_rating: 4.7,
    total_orders: 1245,
    revenue_today: 8450.50,
    created_at: new Date('2025-01-20'),
  },
  {
    id: 'branch-2',
    name: 'eChefs Riverside',
    address: '456 River Road, Waterfront',
    city: 'Bishkek',
    country: 'Kyrgyzstan',
    phone: '+996 312 555 002',
    email: 'riverside@echefs.kg',
    manager_id: 'user-3',
    manager_name: 'Elena Petrova',
    status: 'active',
    opening_hours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '09:00', close: '22:00' },
    },
    coordinates: { lat: 42.8765, lng: 74.6123 },
    capacity: 80,
    tables_count: 18,
    avg_rating: 4.6,
    total_orders: 892,
    revenue_today: 6280.75,
    created_at: new Date('2025-02-10'),
  },
  {
    id: 'branch-3',
    name: 'eChefs Garden',
    address: '789 Park Avenue, Green District',
    city: 'Bishkek',
    country: 'Kyrgyzstan',
    phone: '+996 312 555 003',
    email: 'garden@echefs.kg',
    manager_id: 'user-1',
    manager_name: 'Sarah Johnson',
    status: 'active',
    opening_hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '21:00' },
    },
    coordinates: { lat: 42.8920, lng: 74.6245 },
    capacity: 90,
    tables_count: 20,
    avg_rating: 4.8,
    total_orders: 756,
    revenue_today: 5320.00,
    created_at: new Date('2025-03-01'),
  },
];

// ===================
// ORDERS
// ===================
export const orders: Order[] = [
  {
    id: 'order-1001',
    branch_id: 'branch-1',
    branch_name: 'Downtown Bishkek',
    customer_id: 'cust-1',
    customer_name: 'Ali Karimov',
    table_number: 'A-12',
    items: [
      { id: 'item-1', name: 'Grilled Salmon', quantity: 2, price: 28.50, total: 57.00 },
      { id: 'item-2', name: 'Caesar Salad', quantity: 1, price: 12.00, total: 12.00 },
      { id: 'item-3', name: 'Mineral Water', quantity: 2, price: 3.50, total: 7.00 },
    ],
    subtotal: 76.00,
    tax: 7.60,
    discount: 0,
    total: 83.60,
    status: 'preparing',
    payment_status: 'pending',
    created_at: new Date('2026-03-14T10:30:00'),
  },
  {
    id: 'order-1002',
    branch_id: 'branch-1',
    branch_name: 'Downtown Bishkek',
    customer_id: 'cust-2',
    customer_name: 'Maria Ivanova',
    table_number: 'B-05',
    items: [
      { id: 'item-4', name: 'Margherita Pizza', quantity: 1, price: 18.00, total: 18.00 },
      { id: 'item-5', name: 'Tiramisu', quantity: 2, price: 8.50, total: 17.00 },
    ],
    subtotal: 35.00,
    tax: 3.50,
    discount: 3.50,
    total: 35.00,
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'card',
    created_at: new Date('2026-03-14T09:15:00'),
    completed_at: new Date('2026-03-14T10:00:00'),
  },
  {
    id: 'order-1003',
    branch_id: 'branch-2',
    branch_name: 'Ala-Too Square',
    customer_id: 'cust-3',
    customer_name: 'Talgat Usenov',
    table_number: 'C-08',
    items: [
      { id: 'item-6', name: 'Beef Burger', quantity: 1, price: 15.00, total: 15.00 },
      { id: 'item-7', name: 'French Fries', quantity: 1, price: 5.50, total: 5.50 },
      { id: 'item-8', name: 'Coca-Cola', quantity: 1, price: 3.00, total: 3.00 },
    ],
    subtotal: 23.50,
    tax: 2.35,
    discount: 0,
    total: 25.85,
    status: 'ready',
    payment_status: 'pending',
    created_at: new Date('2026-03-14T11:00:00'),
  },
];

// ===================
// CUSTOMERS
// ===================
export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ali Karimov',
    email: 'ali.k@example.com',
    phone: '+996 555 200 001',
    loyalty_points: 1250,
    loyalty_tier: 'gold',
    total_orders: 45,
    total_spent: 2450.75,
    avg_order_value: 54.46,
    last_order_date: new Date('2026-03-14'),
    created_at: new Date('2025-05-10'),
    status: 'active',
    favorite_branch: 'branch-1',
    favorite_items: ['Grilled Salmon', 'Caesar Salad'],
  },
  {
    id: 'cust-2',
    name: 'Maria Ivanova',
    email: 'maria.i@example.com',
    phone: '+996 555 200 002',
    loyalty_points: 850,
    loyalty_tier: 'silver',
    total_orders: 32,
    total_spent: 1680.50,
    avg_order_value: 52.52,
    last_order_date: new Date('2026-03-14'),
    created_at: new Date('2025-06-15'),
    status: 'active',
    favorite_branch: 'branch-1',
  },
  {
    id: 'cust-3',
    name: 'Talgat Usenov',
    email: 'talgat.u@example.com',
    phone: '+996 555 200 003',
    loyalty_points: 450,
    loyalty_tier: 'bronze',
    total_orders: 18,
    total_spent: 890.25,
    avg_order_value: 49.46,
    last_order_date: new Date('2026-03-14'),
    created_at: new Date('2025-08-20'),
    status: 'active',
    favorite_branch: 'branch-2',
  },
];

// ===================
// NOTIFICATIONS
// ===================
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'inventory',
    title: 'Low Stock Alert',
    message: '5 ingredients are critically low and require immediate reordering',
    severity: 'error',
    recipient_type: 'role',
    recipient_id: 'manager',
    read: false,
    created_at: new Date('2026-03-14T08:00:00'),
  },
  {
    id: 'notif-2',
    type: 'order',
    title: 'Large Order Received',
    message: 'Table A-12 placed an order worth $83.60',
    severity: 'info',
    recipient_type: 'branch',
    branch_id: 'branch-1',
    read: false,
    created_at: new Date('2026-03-14T10:30:00'),
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'System Update',
    message: 'New features added to inventory management system',
    severity: 'success',
    recipient_type: 'all',
    read: true,
    created_at: new Date('2026-03-13T15:00:00'),
  },
];

// ===================
// GIFTS
// ===================
export const gifts: Gift[] = [
  {
    id: 'gift-1',
    name: 'Free Appetizer Voucher',
    description: 'Get any appetizer from our menu absolutely free',
    points_required: 500,
    stock: 50,
    category: 'voucher',
    status: 'active',
    claimed_count: 24,
    value: 12.00,
    created_at: new Date('2025-01-01'),
    expires_at: new Date('2026-12-31'),
  },
  {
    id: 'gift-2',
    name: '20% Off Next Order',
    description: 'Get 20% discount on your next order',
    points_required: 800,
    stock: 100,
    category: 'discount',
    status: 'active',
    claimed_count: 45,
    value: 0,
    created_at: new Date('2025-01-01'),
    expires_at: new Date('2026-12-31'),
  },
  {
    id: 'gift-3',
    name: 'eChefs T-Shirt',
    description: 'Premium branded t-shirt with eChefs logo',
    points_required: 1500,
    stock: 0,
    category: 'product',
    status: 'out_of_stock',
    claimed_count: 30,
    value: 25.00,
    created_at: new Date('2025-01-01'),
  },
];

// ===================
// ANALYTICS DATA
// ===================
export const analyticsData: Analytics = {
  period: 'today',
  total_revenue: 14731.25,
  total_orders: 287,
  avg_order_value: 51.32,
  new_customers: 12,
  returning_customers: 275,
  top_selling_items: [
    { id: 'item-1', name: 'Grilled Salmon', quantity: 45, revenue: 1282.50 },
    { id: 'item-2', name: 'Margherita Pizza', quantity: 38, revenue: 684.00 },
    { id: 'item-3', name: 'Caesar Salad', quantity: 52, revenue: 624.00 },
    { id: 'item-4', name: 'Beef Burger', quantity: 41, revenue: 615.00 },
    { id: 'item-5', name: 'Tiramisu', quantity: 33, revenue: 280.50 },
  ],
  revenue_by_branch: [
    { branch_id: 'branch-1', branch_name: 'Downtown Bishkek', revenue: 8450.50, orders: 165 },
    { branch_id: 'branch-2', branch_name: 'Ala-Too Square', revenue: 6280.75, orders: 122 },
  ],
  revenue_trend: [
    { date: '2026-03-08', revenue: 12450.00, orders: 245 },
    { date: '2026-03-09', revenue: 13200.50, orders: 268 },
    { date: '2026-03-10', revenue: 11890.25, orders: 232 },
    { date: '2026-03-11', revenue: 14320.75, orders: 289 },
    { date: '2026-03-12', revenue: 13650.00, orders: 271 },
    { date: '2026-03-13', revenue: 15120.50, orders: 302 },
    { date: '2026-03-14', revenue: 14731.25, orders: 287 },
  ],
};

// ===================
// BUSINESS LOGIC FUNCTIONS
// ===================

export function getAdminStats() {
  return {
    totalBranches: branches.length,
    activeBranches: branches.filter(b => b.status === 'active').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    totalRevenue: analyticsData.total_revenue,
    avgOrderValue: analyticsData.avg_order_value,
    unreadNotifications: notifications.filter(n => !n.read).length,
  };
}

export function getUsersByRole(role?: User['role']) {
  if (!role) return users;
  return users.filter(u => u.role === role);
}

export function getBranchById(branchId: string) {
  return branches.find(b => b.id === branchId);
}

export function getOrdersByBranch(branchId: string) {
  return orders.filter(o => o.branch_id === branchId);
}

export function getOrdersByStatus(status: Order['status']) {
  return orders.filter(o => o.status === status);
}

export function getTopCustomers(limit: number = 10) {
  return [...customers]
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, limit);
}

export function getUnreadNotifications() {
  return notifications.filter(n => !n.read);
}

export function getActiveGifts() {
  return gifts.filter(g => g.status === 'active');
}