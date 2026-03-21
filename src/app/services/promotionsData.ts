// Promotions, Loyalty, and Gifts System - Comprehensive Data & Business Logic

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'bogo' | 'free_item' | 'bundle' | 'cashback' | 'points_multiplier';
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  min_order_value?: number;
  max_discount?: number;
  applicable_items?: string[];
  applicable_categories?: string[];
  branches: string[] | 'all'; // Array of branch IDs or 'all'
  scope: 'global' | 'branch';
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  start_date: Date;
  end_date: Date;
  usage_limit?: number;
  usage_count: number;
  usage_per_customer?: number;
  code?: string;
  requires_code: boolean;
  image?: string;
  created_at: Date;
  created_by: string;
  priority: number;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  min_points: number;
  max_points?: number;
  benefits: {
    points_multiplier: number;
    discount_percentage: number;
    free_delivery: boolean;
    priority_support: boolean;
    birthday_bonus: number;
    exclusive_offers: boolean;
  };
  color: string;
  icon: string;
  badge_url?: string;
}

export interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  action: 'order' | 'referral' | 'review' | 'signup' | 'birthday' | 'social_share';
  points_awarded: number;
  multiplier?: number;
  conditions?: {
    min_order_value?: number;
    specific_items?: string[];
    specific_categories?: string[];
  };
  status: 'active' | 'inactive';
  branches: string[] | 'all';
  created_at: Date;
}

export interface CustomerLoyalty {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_points: number;
  available_points: number;
  lifetime_points: number;
  current_tier: string;
  tier_name: string;
  next_tier?: string;
  points_to_next_tier?: number;
  total_orders: number;
  total_spent: number;
  member_since: Date;
  last_activity: Date;
  referred_customers: number;
  reviews_count: number;
}

export interface PointsTransaction {
  id: string;
  customer_id: string;
  customer_name: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjustment';
  points: number;
  balance_after: number;
  reason: string;
  reference_id?: string; // Order ID, gift ID, etc.
  reference_type?: 'order' | 'gift' | 'referral' | 'manual';
  branch_id?: string;
  created_at: Date;
  created_by?: string;
  expires_at?: Date;
}

export interface Gift {
  id: string;
  sku: string;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  image?: string;
  category: 'voucher' | 'product' | 'experience' | 'discount';
  status: 'active' | 'inactive' | 'out_of_stock';
  claimed_count: number;
  value: number; // Monetary value
  branches: string[] | 'all';
  created_at: Date;
  expires_at?: Date;
  redemption_instructions?: string;
  terms_conditions?: string;
}

export interface GiftClaim {
  id: string;
  gift_id: string;
  gift_name: string;
  customer_id: string;
  customer_name: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'redeemed' | 'cancelled' | 'expired';
  claimed_at: Date;
  redeemed_at?: Date;
  redemption_code: string;
  branch_id?: string;
  expires_at: Date;
  notes?: string;
}

export interface PromotionNotification {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'loyalty' | 'gift' | 'points';
  target_audience: 'all' | 'tier' | 'segment' | 'customer';
  target_value?: string[]; // Tier IDs, customer IDs, etc.
  branches: string[] | 'all';
  status: 'draft' | 'scheduled' | 'sent';
  send_at: Date;
  sent_at?: Date;
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  promotion_id?: string;
  image?: string;
  action_url?: string;
  created_at: Date;
  created_by: string;
}

// ===================
// LOYALTY TIERS
// ===================
export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'tier-bronze',
    name: 'Bronze',
    min_points: 0,
    max_points: 999,
    benefits: {
      points_multiplier: 1,
      discount_percentage: 0,
      free_delivery: false,
      priority_support: false,
      birthday_bonus: 50,
      exclusive_offers: false,
    },
    color: '#CD7F32',
    icon: '🥉',
  },
  {
    id: 'tier-silver',
    name: 'Silver',
    min_points: 1000,
    max_points: 2499,
    benefits: {
      points_multiplier: 1.25,
      discount_percentage: 5,
      free_delivery: false,
      priority_support: false,
      birthday_bonus: 100,
      exclusive_offers: true,
    },
    color: '#C0C0C0',
    icon: '🥈',
  },
  {
    id: 'tier-gold',
    name: 'Gold',
    min_points: 2500,
    max_points: 4999,
    benefits: {
      points_multiplier: 1.5,
      discount_percentage: 10,
      free_delivery: true,
      priority_support: true,
      birthday_bonus: 200,
      exclusive_offers: true,
    },
    color: '#FFD700',
    icon: '🥇',
  },
  {
    id: 'tier-platinum',
    name: 'Platinum',
    min_points: 5000,
    benefits: {
      points_multiplier: 2,
      discount_percentage: 15,
      free_delivery: true,
      priority_support: true,
      birthday_bonus: 500,
      exclusive_offers: true,
    },
    color: '#E5E4E2',
    icon: '💎',
  },
];

// ===================
// LOYALTY RULES
// ===================
export const loyaltyRules: LoyaltyRule[] = [
  {
    id: 'rule-order',
    name: 'Order Points',
    description: 'Earn 1 point for every $1 spent',
    action: 'order',
    points_awarded: 1,
    multiplier: 1,
    status: 'active',
    branches: 'all',
    created_at: new Date('2025-01-01'),
  },
  {
    id: 'rule-signup',
    name: 'Welcome Bonus',
    description: 'Get 100 points when you sign up',
    action: 'signup',
    points_awarded: 100,
    status: 'active',
    branches: 'all',
    created_at: new Date('2025-01-01'),
  },
  {
    id: 'rule-referral',
    name: 'Referral Bonus',
    description: 'Earn 200 points for each friend you refer',
    action: 'referral',
    points_awarded: 200,
    status: 'active',
    branches: 'all',
    created_at: new Date('2025-01-01'),
  },
  {
    id: 'rule-review',
    name: 'Review Bonus',
    description: 'Get 50 points for leaving a review',
    action: 'review',
    points_awarded: 50,
    status: 'active',
    branches: 'all',
    created_at: new Date('2025-01-01'),
  },
  {
    id: 'rule-birthday',
    name: 'Birthday Bonus',
    description: 'Special birthday gift points (tier-based)',
    action: 'birthday',
    points_awarded: 0, // Tier-based
    status: 'active',
    branches: 'all',
    created_at: new Date('2025-01-01'),
  },
];

// ===================
// PROMOTIONS
// ===================
export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    name: 'Grand Opening: 30% OFF',
    description: 'Celebrate with us! Get 30% off your entire order',
    type: 'discount',
    discount_type: 'percentage',
    discount_value: 30,
    min_order_value: 500,
    max_discount: 1000,
    branches: 'all',
    scope: 'global',
    status: 'active',
    start_date: new Date('2026-03-01'),
    end_date: new Date('2026-03-31'),
    usage_limit: 1000,
    usage_count: 387,
    usage_per_customer: 1,
    requires_code: false,
    image: 'https://images.unsplash.com/photo-1762417420647-45a4401b38f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGlzY291bnQlMjBwcm9tb3Rpb258ZW58MXx8fHwxNzczOTE5Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 10,
    created_at: new Date('2026-02-15'),
    created_by: 'user-1',
  },
  {
    id: 'promo-2',
    name: 'BOGO Pizza Monday',
    description: 'Buy one pizza, get one free every Monday!',
    type: 'bogo',
    applicable_categories: ['pizza'],
    branches: 'all',
    scope: 'global',
    status: 'active',
    start_date: new Date('2026-03-01'),
    end_date: new Date('2026-12-31'),
    usage_count: 145,
    requires_code: false,
    image: 'https://images.unsplash.com/photo-1663858835211-3883764dcd52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MzkxOTc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 8,
    created_at: new Date('2026-02-20'),
    created_by: 'user-1',
  },
  {
    id: 'promo-3',
    name: 'Lunch Special: Free Drink',
    description: 'Order any business lunch and get a free soft drink',
    type: 'free_item',
    applicable_categories: ['business'],
    branches: ['branch-1', 'branch-2'],
    scope: 'branch',
    status: 'active',
    start_date: new Date('2026-03-10'),
    end_date: new Date('2026-04-10'),
    usage_count: 234,
    requires_code: false,
    image: 'https://images.unsplash.com/photo-1529973565457-a60a2ccf750d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdW5jaCUyMGJ1c2luZXNzJTIwbWVhbHxlbnwxfHx8fDE3NzM5MTk4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 7,
    created_at: new Date('2026-03-01'),
    created_by: 'user-2',
  },
  {
    id: 'promo-4',
    name: 'VIP500 - $500 OFF',
    description: 'Exclusive discount for loyal customers',
    type: 'discount',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_value: 2000,
    branches: 'all',
    scope: 'global',
    status: 'active',
    start_date: new Date('2026-03-15'),
    end_date: new Date('2026-04-15'),
    usage_limit: 100,
    usage_count: 23,
    usage_per_customer: 1,
    code: 'VIP500',
    requires_code: true,
    image: 'https://images.unsplash.com/photo-1633051567030-53807ca200aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBleGNsdXNpdmUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MzkxOTgwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 9,
    created_at: new Date('2026-03-10'),
    created_by: 'user-1',
  },
  {
    id: 'promo-5',
    name: 'Weekend 2x Points',
    description: 'Earn double loyalty points on weekend orders',
    type: 'points_multiplier',
    branches: 'all',
    scope: 'global',
    status: 'active',
    start_date: new Date('2026-03-01'),
    end_date: new Date('2026-03-31'),
    usage_count: 456,
    requires_code: false,
    image: 'https://images.unsplash.com/photo-1710587385034-c9fc2889eabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWVrZW5kJTIwY2VsZWJyYXRpb24lMjBmb29kfGVufDF8fHx8MTc3MzkxOTgwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    priority: 6,
    created_at: new Date('2026-02-25'),
    created_by: 'user-1',
  },
  {
    id: 'promo-6',
    name: 'Family Bundle Deal',
    description: '2 mains + 2 sides + 1 dessert for just 1200 KGS',
    type: 'bundle',
    discount_type: 'fixed',
    discount_value: 300,
    branches: 'all',
    scope: 'global',
    status: 'scheduled',
    start_date: new Date('2026-04-01'),
    end_date: new Date('2026-04-30'),
    usage_count: 0,
    requires_code: false,
    priority: 7,
    created_at: new Date('2026-03-15'),
    created_by: 'user-1',
  },
];

// ===================
// CUSTOMER LOYALTY DATA
// ===================
export const customersLoyalty: CustomerLoyalty[] = [
  {
    customer_id: 'cust-1',
    customer_name: 'Ali Karimov',
    customer_email: 'ali.karimov@email.com',
    customer_phone: '+996 555 200 001',
    total_points: 3450,
    available_points: 3200,
    lifetime_points: 4800,
    current_tier: 'tier-gold',
    tier_name: 'Gold',
    next_tier: 'tier-platinum',
    points_to_next_tier: 1550,
    total_orders: 48,
    total_spent: 45600,
    member_since: new Date('2025-06-15'),
    last_activity: new Date('2026-03-17'),
    referred_customers: 3,
    reviews_count: 12,
  },
  {
    customer_id: 'cust-2',
    customer_name: 'Maria Ivanova',
    customer_email: 'maria.ivanova@email.com',
    customer_phone: '+996 555 200 002',
    total_points: 6250,
    available_points: 5800,
    lifetime_points: 8900,
    current_tier: 'tier-platinum',
    tier_name: 'Platinum',
    total_orders: 89,
    total_spent: 82400,
    member_since: new Date('2025-04-20'),
    last_activity: new Date('2026-03-18'),
    referred_customers: 7,
    reviews_count: 28,
  },
  {
    customer_id: 'cust-3',
    customer_name: 'Omar Hassan',
    customer_email: 'omar.hassan@email.com',
    customer_phone: '+996 555 200 003',
    total_points: 1450,
    available_points: 1450,
    lifetime_points: 1450,
    current_tier: 'tier-silver',
    tier_name: 'Silver',
    next_tier: 'tier-gold',
    points_to_next_tier: 1050,
    total_orders: 15,
    total_spent: 14200,
    member_since: new Date('2025-11-10'),
    last_activity: new Date('2026-03-16'),
    referred_customers: 1,
    reviews_count: 4,
  },
  {
    customer_id: 'cust-4',
    customer_name: 'Aisha Bekova',
    customer_email: 'aisha.bekova@email.com',
    customer_phone: '+996 555 200 004',
    total_points: 450,
    available_points: 450,
    lifetime_points: 450,
    current_tier: 'tier-bronze',
    tier_name: 'Bronze',
    next_tier: 'tier-silver',
    points_to_next_tier: 550,
    total_orders: 5,
    total_spent: 4200,
    member_since: new Date('2026-01-15'),
    last_activity: new Date('2026-03-15'),
    referred_customers: 0,
    reviews_count: 1,
  },
  {
    customer_id: 'cust-5',
    customer_name: 'Sergey Volkov',
    customer_email: 'sergey.volkov@email.com',
    customer_phone: '+996 555 200 005',
    total_points: 2850,
    available_points: 2600,
    lifetime_points: 3200,
    current_tier: 'tier-gold',
    tier_name: 'Gold',
    next_tier: 'tier-platinum',
    points_to_next_tier: 2150,
    total_orders: 32,
    total_spent: 28900,
    member_since: new Date('2025-08-05'),
    last_activity: new Date('2026-03-17'),
    referred_customers: 2,
    reviews_count: 8,
  },
];

// ===================
// POINTS TRANSACTIONS
// ===================
export const pointsTransactions: PointsTransaction[] = [
  {
    id: 'txn-1',
    customer_id: 'cust-1',
    customer_name: 'Ali Karimov',
    type: 'earn',
    points: 125,
    balance_after: 3200,
    reason: 'Order #ORD-12345',
    reference_id: 'ord-12345',
    reference_type: 'order',
    branch_id: 'branch-1',
    created_at: new Date('2026-03-17T14:30:00'),
  },
  {
    id: 'txn-2',
    customer_id: 'cust-2',
    customer_name: 'Maria Ivanova',
    type: 'redeem',
    points: -500,
    balance_after: 5800,
    reason: 'Redeemed: Premium Coffee Voucher',
    reference_id: 'claim-001',
    reference_type: 'gift',
    branch_id: 'branch-2',
    created_at: new Date('2026-03-16T11:20:00'),
  },
  {
    id: 'txn-3',
    customer_id: 'cust-3',
    customer_name: 'Omar Hassan',
    type: 'earn',
    points: 50,
    balance_after: 1450,
    reason: 'Review bonus',
    reference_type: 'manual',
    branch_id: 'branch-1',
    created_at: new Date('2026-03-16T09:15:00'),
    created_by: 'user-2',
  },
  {
    id: 'txn-4',
    customer_id: 'cust-1',
    customer_name: 'Ali Karimov',
    type: 'earn',
    points: 200,
    balance_after: 3075,
    reason: 'Referral bonus',
    reference_type: 'referral',
    created_at: new Date('2026-03-15T16:45:00'),
  },
  {
    id: 'txn-5',
    customer_id: 'cust-4',
    customer_name: 'Aisha Bekova',
    type: 'earn',
    points: 100,
    balance_after: 450,
    reason: 'Welcome bonus',
    reference_type: 'manual',
    created_at: new Date('2026-01-15T10:00:00'),
    created_by: 'system',
  },
];

// ===================
// GIFTS
// ===================
export const gifts: Gift[] = [
  {
    id: 'gift-1',
    sku: 'GIFT-COFFEE-001',
    name: 'Premium Coffee Voucher',
    description: 'Enjoy a free premium coffee of your choice',
    points_required: 500,
    stock: 200,
    category: 'voucher',
    status: 'active',
    claimed_count: 45,
    value: 300,
    branches: 'all',
    image: 'https://images.unsplash.com/photo-1769988426472-e5c665ab08df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwcmVtaXVtJTIwdm91Y2hlcnxlbnwxfHx8fDE3NzM5MTk4MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2025-12-01'),
    expires_at: new Date('2026-12-31'),
    redemption_instructions: 'Show this voucher to cashier before payment',
  },
  {
    id: 'gift-2',
    sku: 'GIFT-PIZZA-001',
    name: 'Free Personal Pizza',
    description: 'Any personal-sized pizza from our menu',
    points_required: 800,
    stock: 150,
    category: 'product',
    status: 'active',
    claimed_count: 67,
    value: 600,
    branches: 'all',
    image: 'https://images.unsplash.com/photo-1663858835211-3883764dcd52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MzkxOTc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2026-01-15'),
    expires_at: new Date('2026-06-30'),
    redemption_instructions: 'Valid for dine-in and takeaway',
  },
  {
    id: 'gift-3',
    sku: 'GIFT-DESSERT-001',
    name: 'Dessert of the Day',
    description: "Chef's special dessert - changes daily",
    points_required: 350,
    stock: 300,
    category: 'product',
    status: 'active',
    claimed_count: 123,
    value: 250,
    branches: 'all',
    image: 'https://images.unsplash.com/photo-1713764221892-d210a0ce0cfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGFzdHJ5JTIwc3dlZXR8ZW58MXx8fHwxNzczODMzNTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2025-11-20'),
  },
  {
    id: 'gift-4',
    sku: 'GIFT-DISC-001',
    name: '20% Discount Coupon',
    description: '20% off your next order (max 500 KGS)',
    points_required: 1000,
    stock: 100,
    category: 'discount',
    status: 'active',
    claimed_count: 34,
    value: 500,
    branches: 'all',
    image: 'https://images.unsplash.com/photo-1644370644949-b175294cbceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMGNvdXBvbiUyMHNhbGV8ZW58MXx8fHwxNzczOTE5ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2026-02-01'),
    expires_at: new Date('2026-05-31'),
  },
  {
    id: 'gift-5',
    sku: 'GIFT-EXP-001',
    name: 'Cooking Class Experience',
    description: 'Join our chef for a 2-hour cooking masterclass',
    points_required: 3000,
    stock: 20,
    category: 'experience',
    status: 'active',
    claimed_count: 8,
    value: 2500,
    branches: ['branch-1'],
    image: 'https://images.unsplash.com/photo-1715000780536-1f3f368b8587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBjaGVmfGVufDF8fHx8MTc3MzkxOTgwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2026-01-10'),
    expires_at: new Date('2026-12-31'),
    redemption_instructions: 'Book your slot at least 3 days in advance',
  },
  {
    id: 'gift-6',
    sku: 'GIFT-MEAL-001',
    name: 'Business Lunch Voucher',
    description: 'Complete business lunch for one person',
    points_required: 650,
    stock: 180,
    category: 'voucher',
    status: 'active',
    claimed_count: 89,
    value: 450,
    branches: 'all',
    image: 'https://images.unsplash.com/photo-1730463527882-efcad72b9d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWVhbCUyMHZvdWNoZXJ8ZW58MXx8fHwxNzczOTE5ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    created_at: new Date('2025-12-15'),
  },
  {
    id: 'gift-7',
    sku: 'GIFT-MERCH-001',
    name: 'eChefs Branded T-Shirt',
    description: 'Stylish eChefs branded merchandise - Size L',
    points_required: 1200,
    stock: 15,
    category: 'product',
    status: 'out_of_stock',
    claimed_count: 35,
    value: 800,
    branches: 'all',
    created_at: new Date('2026-02-20'),
  },
];

// ===================
// GIFT CLAIMS
// ===================
export const giftClaims: GiftClaim[] = [
  {
    id: 'claim-1',
    gift_id: 'gift-1',
    gift_name: 'Premium Coffee Voucher',
    customer_id: 'cust-2',
    customer_name: 'Maria Ivanova',
    points_spent: 500,
    status: 'redeemed',
    claimed_at: new Date('2026-03-16T11:20:00'),
    redeemed_at: new Date('2026-03-17T09:30:00'),
    redemption_code: 'RDMP-COFFEE-A1B2C3',
    branch_id: 'branch-2',
    expires_at: new Date('2026-04-16'),
  },
  {
    id: 'claim-2',
    gift_id: 'gift-2',
    gift_name: 'Free Personal Pizza',
    customer_id: 'cust-1',
    customer_name: 'Ali Karimov',
    points_spent: 800,
    status: 'pending',
    claimed_at: new Date('2026-03-17T14:15:00'),
    redemption_code: 'RDMP-PIZZA-D4E5F6',
    expires_at: new Date('2026-04-17'),
  },
  {
    id: 'claim-3',
    gift_id: 'gift-3',
    gift_name: 'Dessert of the Day',
    customer_id: 'cust-5',
    customer_name: 'Sergey Volkov',
    points_spent: 350,
    status: 'approved',
    claimed_at: new Date('2026-03-15T16:20:00'),
    redemption_code: 'RDMP-DESS-G7H8I9',
    branch_id: 'branch-1',
    expires_at: new Date('2026-04-15'),
  },
];

// ===================
// PROMOTION NOTIFICATIONS
// ===================
export const promotionNotifications: PromotionNotification[] = [
  {
    id: 'notif-1',
    title: '🎉 30% OFF Grand Opening!',
    message: 'Celebrate with us! Get 30% off your entire order this month.',
    type: 'promotion',
    target_audience: 'all',
    branches: 'all',
    status: 'sent',
    send_at: new Date('2026-03-01T09:00:00'),
    sent_at: new Date('2026-03-01T09:01:00'),
    channels: ['push', 'email', 'in_app'],
    promotion_id: 'promo-1',
    created_at: new Date('2026-02-28'),
    created_by: 'user-1',
  },
  {
    id: 'notif-2',
    title: '🍕 BOGO Pizza Monday!',
    message: "It's Monday! Buy one pizza, get one free. Don't miss out!",
    type: 'promotion',
    target_audience: 'all',
    branches: 'all',
    status: 'scheduled',
    send_at: new Date('2026-03-24T08:00:00'),
    channels: ['push', 'in_app'],
    promotion_id: 'promo-2',
    created_at: new Date('2026-03-17'),
    created_by: 'user-1',
  },
  {
    id: 'notif-3',
    title: '💎 You reached Platinum!',
    message: 'Congratulations! You are now a Platinum member with exclusive benefits.',
    type: 'loyalty',
    target_audience: 'customer',
    target_value: ['cust-2'],
    branches: 'all',
    status: 'sent',
    send_at: new Date('2026-02-15T12:00:00'),
    sent_at: new Date('2026-02-15T12:00:30'),
    channels: ['push', 'email', 'in_app'],
    created_at: new Date('2026-02-15'),
    created_by: 'system',
  },
  {
    id: 'notif-4',
    title: '⭐ New Rewards Available!',
    message: 'Check out our new rewards catalog. Amazing gifts await!',
    type: 'gift',
    target_audience: 'tier',
    target_value: ['tier-gold', 'tier-platinum'],
    branches: 'all',
    status: 'draft',
    send_at: new Date('2026-03-25T10:00:00'),
    channels: ['push', 'email'],
    created_at: new Date('2026-03-17'),
    created_by: 'user-1',
  },
];

// ===================
// UTILITY FUNCTIONS
// ===================

export function getActivePromotions(): Promotion[] {
  const now = new Date();
  return promotions.filter(
    p => p.status === 'active' && p.start_date <= now && p.end_date >= now
  );
}

export function getScheduledPromotions(): Promotion[] {
  const now = new Date();
  return promotions.filter(
    p => p.status === 'scheduled' && p.start_date > now
  );
}

export function getExpiredPromotions(): Promotion[] {
  const now = new Date();
  return promotions.filter(p => p.end_date < now);
}

export function getPromotionsByBranch(branchId: string): Promotion[] {
  return promotions.filter(
    p => p.branches === 'all' || (Array.isArray(p.branches) && p.branches.includes(branchId))
  );
}

export function getCustomerTier(points: number): LoyaltyTier {
  return loyaltyTiers.find(
    tier => points >= tier.min_points && (!tier.max_points || points <= tier.max_points)
  ) || loyaltyTiers[0];
}

export function getNextTier(currentTier: string): LoyaltyTier | null {
  const currentIndex = loyaltyTiers.findIndex(t => t.id === currentTier);
  if (currentIndex === -1 || currentIndex === loyaltyTiers.length - 1) return null;
  return loyaltyTiers[currentIndex + 1];
}

export function calculatePointsForOrder(orderValue: number, customerTier: string): number {
  const tier = loyaltyTiers.find(t => t.id === customerTier);
  const basePoints = Math.floor(orderValue);
  const multiplier = tier?.benefits.points_multiplier || 1;
  return Math.floor(basePoints * multiplier);
}

export function getActiveGifts(): Gift[] {
  return gifts.filter(g => g.status === 'active' && g.stock > 0);
}

export function getGiftsByCategory(category: Gift['category']): Gift[] {
  return gifts.filter(g => g.category === category && g.status === 'active');
}

export function canAffordGift(customerPoints: number, giftPoints: number): boolean {
  return customerPoints >= giftPoints;
}

export function getCustomerHistory(customerId: string): PointsTransaction[] {
  return pointsTransactions.filter(t => t.customer_id === customerId);
}

export function getRecentTransactions(limit: number = 10): PointsTransaction[] {
  return [...pointsTransactions]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, limit);
}

export function getTopLoyaltyCustomers(limit: number = 10): CustomerLoyalty[] {
  return [...customersLoyalty]
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, limit);
}