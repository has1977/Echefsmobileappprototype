// Core type definitions for eChefs platform

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
}

export type MenuType = 'main' | 'business' | 'kids' | 'drinks' | 'breakfast' | 'lunch' | 'dinner' | 'desserts';

export interface Category {
  id: string;
  translations: Record<string, string>; // languageCode: name
  menuType: MenuType;
  order: number;
  enabled: boolean;
  icon?: string;
}

export interface MenuItem {
  id: string;
  translations: {
    [languageCode: string]: {
      name: string;
      description: string;
    };
  };
  categoryId: string;
  menuType: MenuType;
  price: number;
  imageUrl: string;
  badges: ('hot' | 'new' | 'discount' | 'popular' | 'recommended' | 'vegan' | 'gluten-free' | 'spicy')[];
  modifiers: Modifier[];
  allergens?: string[];
  calories?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  prepTime?: number; // in minutes
  enabled: boolean;
  order: number;
  rating: number;
  reviewCount: number;
  available: boolean; // Real-time availability
}

export interface Modifier {
  id: string;
  translations: Record<string, string>; // languageCode: name
  type: 'remove' | 'add' | 'choice' | 'size';
  required: boolean;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  translations: Record<string, string>;
  description?: string;
  price: number;
  default?: boolean;
}

export interface Branch {
  id: string;
  translations: {
    [languageCode: string]: {
      name: string;
      address: string;
    };
  };
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  hours: {
    [day: string]: { open: string; close: string };
  };
  regions: Region[];
  enabledMenuTypes: MenuType[];
  imageUrl: string;
  enabled: boolean;
}

export interface Region {
  id: string;
  translations: Record<string, string>;
  type: 'mainHall' | 'smoking' | 'nonSmoking' | 'outdoor' | 'vip' | 'terrace' | 'bar';
  tables: Table[];
  capacity: number;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  qrCode: string;
  nfcId?: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrderId?: string;
  regionId?: string;
  photo?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // Human-readable order number
  branchId: string;
  tableId?: string;
  customerId?: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  paymentMethod?: 'cash' | 'card' | 'pos' | 'qr' | 'wallet';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // minutes
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem; // Populated from menu
  name?: string | Record<string, string>; // Direct name (for test orders) or translations object
  quantity: number;
  modifiers: SelectedModifier[];
  price: number;
  notes?: string;
  status?: 'pending' | 'preparing' | 'ready' | 'served';
  image?: string; // For displaying item image
}

export interface SelectedModifier {
  modifierId: string;
  optionId: string;
  modifier?: Modifier; // Populated
  option?: ModifierOption; // Populated
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin';
  branchId?: string; // For staff
  avatar?: string;
  createdAt: string;
  // Additional customer information
  addresses?: UserAddress[];
  paymentMethods?: UserPaymentMethod[];
  preferences?: UserPreferences;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface UserAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label?: string;
  street: string;
  apartment?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
  deliveryInstructions?: string;
}

export interface UserPaymentMethod {
  id: string;
  type: 'card' | 'mobile_wallet' | 'bank_transfer';
  label?: string;
  // For cards
  cardNumber?: string; // Last 4 digits only
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'other';
  // For mobile wallets
  walletProvider?: 'mbank' | 'odengi' | 'elsom' | 'other';
  walletPhone?: string;
  // Common fields
  isDefault: boolean;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  dietaryRestrictions?: string[];
  allergens?: string[];
  favoriteItems?: string[]; // Menu item IDs
}

export interface LoyaltyCard {
  id: string;
  userId: string;
  branchId?: string; // Branch-specific loyalty card
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lifetimePoints: number;
  transactions: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjustment' | 'bonus';
  points: number;
  orderId?: string;
  description: string;
  timestamp: Date;
}

// ============================================
// BRANCH-SPECIFIC LOYALTY PROGRAMS
// ============================================

export interface LoyaltyProgram {
  id: string;
  branchId: string;
  name: string;
  translations: {
    [languageCode: string]: {
      name: string;
      description: string;
      terms?: string;
    };
  };
  status: 'active' | 'draft' | 'paused';
  accrualRule: {
    unit: 'currency' | 'visits';
    rate: number; // e.g., 1 USD = 10 pts or 1 visit = 100 pts
  };
  redemptionRules: LoyaltyRedemptionRule[];
  tiers: LoyaltyTier[];
  autoRewards?: LoyaltyAutoReward[]; // Automatic rewards at certain thresholds
  startAt?: Date;
  endAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  name: string;
  translations: Record<string, string>;
  pointsRequired: number;
  benefits: string[];
  color?: string;
  icon?: string;
}

export interface LoyaltyRedemptionRule {
  id: string;
  rewardId: string;
  rewardType: 'free_item' | 'discount_percent' | 'discount_amount';
  rewardDetails: any; // menuItemId for free_item, amount/percent for discounts
  pointsCost: number;
  limitPerUser?: number;
  expiryDays?: number;
  translations: {
    [languageCode: string]: {
      title: string;
      description: string;
    };
  };
}

export interface LoyaltyAutoReward {
  id: string;
  condition: {
    type: 'min_order_value' | 'specific_items' | 'points_threshold';
    value: number | string[];
  };
  reward: {
    type: 'free_item' | 'discount_percent' | 'discount_amount' | 'bonus_points';
    details: any;
  };
  translations: {
    [languageCode: string]: {
      title: string;
      description: string;
    };
  };
}

export interface Promotion {
  id: string;
  branchId: string;
  name: string;
  translations: {
    [languageCode: string]: {
      name: string;
      description: string;
      terms?: string;
    };
  };
  type: 'discount' | 'bundle' | 'upsell' | 'happy_hour' | 'bogo' | 'combo';
  scope: {
    type: 'global' | 'category' | 'items';
    categoryIds?: string[];
    itemIds?: string[];
  };
  discount?: {
    type: 'percent' | 'amount';
    value: number;
  };
  minOrderValue?: number;
  schedule?: {
    days: number[]; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
  stackingRule: 'allow' | 'exclusive';
  usageLimit?: {
    total?: number;
    perUser?: number;
  };
  usageCount: number;
  status: 'active' | 'draft' | 'paused' | 'expired';
  validFrom: Date;
  validUntil?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  badge?: string; // e.g., "20% OFF", "BOGO"
  imageUrl?: string;
}

export interface GiftOffer {
  id: string;
  branchId: string;
  name: string;
  translations: {
    [languageCode: string]: {
      name: string;
      description: string;
    };
  };
  trigger: {
    condition: 'min_order_value' | 'specific_item' | 'loyalty_tier' | 'first_order';
    value?: number | string;
  };
  rewardType: 'free_item' | 'discount' | 'points' | 'gift_card';
  rewardDetails: any;
  schedule?: {
    days: number[];
    startTime: string;
    endTime: string;
  };
  limitPerUser?: number;
  usageCount: number;
  status: 'active' | 'draft' | 'paused';
  validFrom: Date;
  validUntil?: Date;
  createdBy: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface UserLoyalty {
  userId: string;
  branchId: string;
  pointsBalance: number;
  tier: string;
  tierProgress: number; // Percentage to next tier
  lifetimePoints: number;
  history: LoyaltyTransaction[];
  enrolledAt: Date;
  lastActivity: Date;
}

export interface CouponCode {
  code: string;
  branchId: string;
  promotionId?: string;
  type: 'single_use' | 'multi_use';
  discount: {
    type: 'percent' | 'amount';
    value: number;
  };
  minOrderValue?: number;
  maxUses?: number;
  usageCount: number;
  validFrom: Date;
  validUntil: Date;
  createdBy: string;
  status: 'active' | 'expired' | 'used';
}

export interface CampaignLog {
  id: string;
  branchId: string;
  userId?: string;
  action: 'created' | 'activated' | 'redeemed' | 'expired' | 'applied';
  entityType: 'loyalty' | 'promotion' | 'gift' | 'coupon';
  entityId: string;
  metadata: {
    orderId?: string;
    pointsEarned?: number;
    pointsRedeemed?: number;
    discountAmount?: number;
    [key: string]: any;
  };
  timestamp: Date;
}

export interface SystemSettings {
  tax: {
    enabled: boolean;
    rate: number; // percentage
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  loyalty: {
    enabled: boolean;
    pointsPerDollar: number;
    currency: string; // Currency code for loyalty program (e.g., 'KGS', 'USD', 'RUB')
    currencySymbol: string; // Currency symbol (e.g., 'с', '$', '₽')
    amountPerPoint: number; // Amount of currency needed to earn 1 point (e.g., 100 KGS = 1 point)
    tiers: {
      [tier: string]: {
        minPoints: number;
        benefits: string[];
        multiplier: number; // Point earning multiplier
      };
    };
  };
  orderSettings: {
    requireTableSelection: boolean;
    allowTakeaway: boolean;
    allowDelivery: boolean;
    minOrderAmount: number;
    maxOrderAmount: number;
    orderNumberPrefix: string;
  };
  notificationSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingItems: {
    itemId: string;
    quantity: number;
    revenue: number;
  }[];
  revenueByHour: {
    hour: number;
    revenue: number;
    orders: number;
  }[];
  revenueByDay: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  customerRetention: number;
}