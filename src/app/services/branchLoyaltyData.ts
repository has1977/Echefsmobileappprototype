// Branch-Specific Loyalty System
// Each branch has completely separate loyalty points, promotions, and gifts
// Points earned at Branch A can ONLY be used at Branch A

export interface BranchCustomerLoyalty {
  customer_id: string;
  customer_phone: string; // Primary identifier for login
  branch_id: string;
  branch_name: string;
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
  is_active: boolean;
}

export interface BranchPointsTransaction {
  id: string;
  customer_id: string;
  customer_phone: string;
  branch_id: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjustment';
  points: number;
  balance_after: number;
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'gift' | 'referral' | 'manual';
  created_at: Date;
  expires_at?: Date;
}

// Helper function to get customer loyalty for a specific branch
export function getCustomerLoyaltyForBranch(
  customerPhone: string,
  branchId: string,
  allLoyaltyRecords: BranchCustomerLoyalty[]
): BranchCustomerLoyalty | null {
  return allLoyaltyRecords.find(
    (record) => record.customer_phone === customerPhone && record.branch_id === branchId
  ) || null;
}

// Helper function to get all branches where customer has loyalty accounts
export function getCustomerBranches(
  customerPhone: string,
  allLoyaltyRecords: BranchCustomerLoyalty[]
): BranchCustomerLoyalty[] {
  return allLoyaltyRecords.filter(
    (record) => record.customer_phone === customerPhone && record.is_active
  );
}

// Helper function to get transactions for customer at specific branch
export function getBranchTransactions(
  customerPhone: string,
  branchId: string,
  allTransactions: BranchPointsTransaction[]
): BranchPointsTransaction[] {
  return allTransactions.filter(
    (txn) => txn.customer_phone === customerPhone && txn.branch_id === branchId
  ).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

// ===================================
// MOCK DATA - Branch-Specific Loyalty
// ===================================

// Customer: +996 555 123 456 has accounts at multiple branches
export const branchCustomerLoyalty: BranchCustomerLoyalty[] = [
  // Ali Karimov at eChefs Downtown (branch-1)
  {
    customer_id: 'cust-001-branch-1',
    customer_phone: '+996555123456',
    branch_id: 'branch-1',
    branch_name: 'eChefs Downtown',
    total_points: 3250,
    available_points: 2800,
    lifetime_points: 5100,
    current_tier: 'tier-gold',
    tier_name: 'Gold',
    next_tier: 'tier-platinum',
    points_to_next_tier: 1750,
    total_orders: 28,
    total_spent: 25600,
    member_since: new Date('2024-01-15'),
    last_activity: new Date('2025-03-16'),
    is_active: true,
  },
  // Ali Karimov at eChefs Mall (branch-2)
  {
    customer_id: 'cust-001-branch-2',
    customer_phone: '+996555123456',
    branch_id: 'branch-2',
    branch_name: 'eChefs Riverside',
    total_points: 580,
    available_points: 580,
    lifetime_points: 580,
    current_tier: 'tier-bronze',
    tier_name: 'Bronze',
    next_tier: 'tier-silver',
    points_to_next_tier: 420,
    total_orders: 5,
    total_spent: 4200,
    member_since: new Date('2025-02-10'),
    last_activity: new Date('2025-03-12'),
    is_active: true,
  },
  // Ali Karimov at eChefs Airport (branch-3)
  {
    customer_id: 'cust-001-branch-3',
    customer_phone: '+996555123456',
    branch_id: 'branch-3',
    branch_name: 'eChefs Garden',
    total_points: 1350,
    available_points: 1100,
    lifetime_points: 1550,
    current_tier: 'tier-silver',
    tier_name: 'Silver',
    next_tier: 'tier-gold',
    points_to_next_tier: 1150,
    total_orders: 12,
    total_spent: 9800,
    member_since: new Date('2024-11-20'),
    last_activity: new Date('2025-03-14'),
    is_active: true,
  },
  // Elena Petrova at eChefs Downtown (branch-1)
  {
    customer_id: 'cust-002-branch-1',
    customer_phone: '+996555789012',
    branch_id: 'branch-1',
    branch_name: 'eChefs Downtown',
    total_points: 1850,
    available_points: 1600,
    lifetime_points: 2200,
    current_tier: 'tier-silver',
    tier_name: 'Silver',
    next_tier: 'tier-gold',
    points_to_next_tier: 650,
    total_orders: 18,
    total_spent: 16500,
    member_since: new Date('2024-06-05'),
    last_activity: new Date('2025-03-17'),
    is_active: true,
  },
  // Aibek Moldoshev at eChefs Mall (branch-2)
  {
    customer_id: 'cust-003-branch-2',
    customer_phone: '+996555345678',
    branch_id: 'branch-2',
    branch_name: 'eChefs Riverside',
    total_points: 320,
    available_points: 320,
    lifetime_points: 320,
    current_tier: 'tier-bronze',
    tier_name: 'Bronze',
    next_tier: 'tier-silver',
    points_to_next_tier: 680,
    total_orders: 3,
    total_spent: 2400,
    member_since: new Date('2025-02-28'),
    last_activity: new Date('2025-03-15'),
    is_active: true,
  },
];

// Branch-specific transactions
export const branchPointsTransactions: BranchPointsTransaction[] = [
  // Ali at Downtown
  {
    id: 'txn-001',
    customer_id: 'cust-001-branch-1',
    customer_phone: '+996555123456',
    branch_id: 'branch-1',
    type: 'earn',
    points: 150,
    balance_after: 2800,
    reason: 'Order #ORD-12345',
    reference_id: 'order-12345',
    reference_type: 'order',
    created_at: new Date('2025-03-16T14:30:00'),
  },
  {
    id: 'txn-002',
    customer_id: 'cust-001-branch-1',
    customer_phone: '+996555123456',
    branch_id: 'branch-1',
    type: 'redeem',
    points: -500,
    balance_after: 2650,
    reason: 'Redeemed: Free Dessert',
    reference_id: 'gift-voucher-001',
    reference_type: 'gift',
    created_at: new Date('2025-03-15T18:20:00'),
  },
  {
    id: 'txn-003',
    customer_id: 'cust-001-branch-1',
    customer_phone: '+996555123456',
    branch_id: 'branch-1',
    type: 'earn',
    points: 200,
    balance_after: 3150,
    reason: 'Order #ORD-12340',
    reference_id: 'order-12340',
    reference_type: 'order',
    created_at: new Date('2025-03-14T12:15:00'),
  },
  // Ali at Mall
  {
    id: 'txn-004',
    customer_id: 'cust-001-branch-2',
    customer_phone: '+996555123456',
    branch_id: 'branch-2',
    type: 'earn',
    points: 80,
    balance_after: 580,
    reason: 'Order #ORD-22001',
    reference_id: 'order-22001',
    reference_type: 'order',
    created_at: new Date('2025-03-12T16:45:00'),
  },
  {
    id: 'txn-005',
    customer_id: 'cust-001-branch-2',
    customer_phone: '+996555123456',
    branch_id: 'branch-2',
    type: 'earn',
    points: 100,
    balance_after: 500,
    reason: 'Order #ORD-21998',
    reference_id: 'order-21998',
    reference_type: 'order',
    created_at: new Date('2025-03-10T11:30:00'),
  },
  // Ali at Airport
  {
    id: 'txn-006',
    customer_id: 'cust-001-branch-3',
    customer_phone: '+996555123456',
    branch_id: 'branch-3',
    type: 'earn',
    points: 120,
    balance_after: 1100,
    reason: 'Order #ORD-33045',
    reference_id: 'order-33045',
    reference_type: 'order',
    created_at: new Date('2025-03-14T09:20:00'),
  },
  {
    id: 'txn-007',
    customer_id: 'cust-001-branch-3',
    customer_phone: '+996555123456',
    branch_id: 'branch-3',
    type: 'redeem',
    points: -250,
    balance_after: 980,
    reason: 'Redeemed: 10% Discount',
    reference_id: 'gift-discount-002',
    reference_type: 'gift',
    created_at: new Date('2025-03-13T13:10:00'),
  },
  // Elena at Downtown
  {
    id: 'txn-008',
    customer_id: 'cust-002-branch-1',
    customer_phone: '+996555789012',
    branch_id: 'branch-1',
    type: 'earn',
    points: 110,
    balance_after: 1600,
    reason: 'Order #ORD-12346',
    reference_id: 'order-12346',
    reference_type: 'order',
    created_at: new Date('2025-03-17T15:45:00'),
  },
  {
    id: 'txn-009',
    customer_id: 'cust-002-branch-1',
    customer_phone: '+996555789012',
    branch_id: 'branch-1',
    type: 'earn',
    points: 50,
    balance_after: 1490,
    reason: 'Birthday Bonus',
    reference_type: 'manual',
    created_at: new Date('2025-03-05T10:00:00'),
  },
  // Aibek at Mall
  {
    id: 'txn-010',
    customer_id: 'cust-003-branch-2',
    customer_phone: '+996555345678',
    branch_id: 'branch-2',
    type: 'earn',
    points: 90,
    balance_after: 320,
    reason: 'Order #ORD-22010',
    reference_id: 'order-22010',
    reference_type: 'order',
    created_at: new Date('2025-03-15T14:30:00'),
  },
];

// Helper to filter promotions by branch
export function getBranchPromotions(branchId: string, allPromotions: any[]) {
  return allPromotions.filter(
    (promo) =>
      promo.status === 'active' &&
      (promo.branches === 'all' || 
       (Array.isArray(promo.branches) && promo.branches.includes(branchId)))
  );
}

// Helper to get ALL active promotions (for "All Branches" view)
export function getAllPromotions(allPromotions: any[]) {
  return allPromotions.filter((promo) => promo.status === 'active');
}

// Helper to filter gifts by branch
export function getBranchGifts(branchId: string, allGifts: any[]) {
  return allGifts.filter(
    (gift) =>
      gift.status === 'active' &&
      (gift.branches === 'all' || 
       (Array.isArray(gift.branches) && gift.branches.includes(branchId)))
  );
}

// Helper to get ALL active gifts (for "All Branches" view)
export function getAllGifts(allGifts: any[]) {
  return allGifts.filter((gift) => gift.status === 'active');
}