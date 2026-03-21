// Inventory System - Comprehensive Seed Data & Business Logic

import type {
  Ingredient,
  Supplier,
  PurchaseOrder,
  IncomingOrder,
  InventoryAlert,
  ReorderSuggestion,
  ForecastUsage,
  StockAdjustment,
  AutoReorderRule,
} from '../types/inventory';

// ===================
// SUPPLIERS
// ===================
export const suppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Fresh Ocean Seafood',
    lead_time_days: 2,
    min_order_qty: 10,
    pack_size: 5,
    contact: {
      name: 'Ahmed Hassan',
      email: 'ahmed@freshocean.kg',
      phone: '+996 555 123 456',
    },
    preferred: true,
    rating: 4.8,
    on_time_rate: 95,
  },
  {
    id: 'sup-2',
    name: 'Valley Dairy Co.',
    lead_time_days: 1,
    min_order_qty: 15,
    pack_size: 5,
    contact: {
      name: 'Elena Petrova',
      email: 'elena@valleydairy.kg',
      phone: '+996 555 234 567',
    },
    preferred: true,
    rating: 4.9,
    on_time_rate: 98,
  },
  {
    id: 'sup-3',
    name: 'Farm Fresh Produce',
    lead_time_days: 1,
    min_order_qty: 20,
    pack_size: 10,
    contact: {
      name: 'Dmitri Sokolov',
      email: 'dmitri@farmfresh.kg',
      phone: '+996 555 345 678',
    },
    preferred: true,
    rating: 4.6,
    on_time_rate: 92,
  },
  {
    id: 'sup-4',
    name: 'Premium Meats Ltd',
    lead_time_days: 2,
    min_order_qty: 20,
    pack_size: 10,
    contact: {
      name: 'Bakyt Asanov',
      email: 'bakyt@premiummeats.kg',
      phone: '+996 555 456 789',
    },
    preferred: true,
    rating: 4.7,
    on_time_rate: 94,
  },
  {
    id: 'sup-5',
    name: 'Olive & Oil Importers',
    lead_time_days: 3,
    min_order_qty: 12,
    pack_size: 6,
    contact: {
      name: 'Fatima Al-Rashid',
      email: 'fatima@oliveoil.kg',
      phone: '+996 555 567 890',
    },
    preferred: false,
    rating: 4.5,
    on_time_rate: 88,
  },
];

// ===================
// INGREDIENTS
// ===================
export const ingredients: Ingredient[] = [
  // SEAFOOD
  {
    id: 'ing-1',
    name: 'Fresh Salmon Fillet',
    uom: 'kg',
    on_hand_qty: 3.5,
    unit_cost: 25.50,
    reorder_point: 10,
    par_level: 30,
    safety_stock: 8,
    category: 'Seafood',
    supplier_id: 'sup-1',
    avg_daily_usage: 4.2,
    days_of_stock: 0.83, // Critical!
    last_ordered: new Date('2026-03-12'),
  },
  {
    id: 'ing-2',
    name: 'Shrimp (Large)',
    uom: 'kg',
    on_hand_qty: 6.0,
    unit_cost: 32.00,
    reorder_point: 12,
    par_level: 25,
    safety_stock: 6,
    category: 'Seafood',
    supplier_id: 'sup-1',
    avg_daily_usage: 3.8,
    days_of_stock: 1.58, // Critical!
    last_ordered: new Date('2026-03-11'),
  },
  
  // DAIRY
  {
    id: 'ing-3',
    name: 'Mozzarella Cheese',
    uom: 'kg',
    on_hand_qty: 18.0,
    unit_cost: 12.00,
    reorder_point: 20,
    par_level: 45,
    safety_stock: 10,
    category: 'Dairy',
    supplier_id: 'sup-2',
    avg_daily_usage: 5.2,
    days_of_stock: 3.46,
    last_ordered: new Date('2026-03-10'),
  },
  {
    id: 'ing-4',
    name: 'Parmesan Cheese',
    uom: 'kg',
    on_hand_qty: 8.5,
    unit_cost: 28.00,
    reorder_point: 8,
    par_level: 20,
    safety_stock: 4,
    category: 'Dairy',
    supplier_id: 'sup-2',
    avg_daily_usage: 2.1,
    days_of_stock: 4.05,
    last_ordered: new Date('2026-03-09'),
  },
  {
    id: 'ing-5',
    name: 'Heavy Cream',
    uom: 'l',
    on_hand_qty: 12.0,
    unit_cost: 6.50,
    reorder_point: 15,
    par_level: 30,
    safety_stock: 8,
    category: 'Dairy',
    supplier_id: 'sup-2',
    avg_daily_usage: 3.5,
    days_of_stock: 3.43,
    last_ordered: new Date('2026-03-12'),
  },
  
  // PRODUCE
  {
    id: 'ing-6',
    name: 'Roma Tomatoes',
    uom: 'kg',
    on_hand_qty: 14.0,
    unit_cost: 3.50,
    reorder_point: 25,
    par_level: 60,
    safety_stock: 12,
    category: 'Produce',
    supplier_id: 'sup-3',
    avg_daily_usage: 8.5,
    days_of_stock: 1.65, // Critical!
    last_ordered: new Date('2026-03-13'),
  },
  {
    id: 'ing-7',
    name: 'Fresh Basil',
    uom: 'kg',
    on_hand_qty: 2.8,
    unit_cost: 15.00,
    reorder_point: 5,
    par_level: 12,
    safety_stock: 3,
    category: 'Produce',
    supplier_id: 'sup-3',
    avg_daily_usage: 1.8,
    days_of_stock: 1.56, // Critical!
    last_ordered: new Date('2026-03-13'),
  },
  {
    id: 'ing-8',
    name: 'Lettuce (Iceberg)',
    uom: 'kg',
    on_hand_qty: 8.0,
    unit_cost: 2.80,
    reorder_point: 15,
    par_level: 35,
    safety_stock: 8,
    category: 'Produce',
    supplier_id: 'sup-3',
    avg_daily_usage: 4.2,
    days_of_stock: 1.90, // Critical!
    last_ordered: new Date('2026-03-13'),
  },
  {
    id: 'ing-9',
    name: 'Bell Peppers (Mixed)',
    uom: 'kg',
    on_hand_qty: 18.0,
    unit_cost: 4.20,
    reorder_point: 18,
    par_level: 40,
    safety_stock: 10,
    category: 'Produce',
    supplier_id: 'sup-3',
    avg_daily_usage: 5.5,
    days_of_stock: 3.27,
    last_ordered: new Date('2026-03-11'),
  },
  
  // MEAT & POULTRY
  {
    id: 'ing-10',
    name: 'Chicken Breast',
    uom: 'kg',
    on_hand_qty: 25.0,
    unit_cost: 8.50,
    reorder_point: 20,
    par_level: 50,
    safety_stock: 12,
    category: 'Poultry',
    supplier_id: 'sup-4',
    avg_daily_usage: 6.8,
    days_of_stock: 3.68,
    last_ordered: new Date('2026-03-11'),
  },
  {
    id: 'ing-11',
    name: 'Ground Beef (80/20)',
    uom: 'kg',
    on_hand_qty: 22.0,
    unit_cost: 12.50,
    reorder_point: 18,
    par_level: 40,
    safety_stock: 10,
    category: 'Meat',
    supplier_id: 'sup-4',
    avg_daily_usage: 5.2,
    days_of_stock: 4.23,
    last_ordered: new Date('2026-03-10'),
  },
  {
    id: 'ing-12',
    name: 'Beef Sirloin',
    uom: 'kg',
    on_hand_qty: 8.0,
    unit_cost: 22.00,
    reorder_point: 12,
    par_level: 28,
    safety_stock: 6,
    category: 'Meat',
    supplier_id: 'sup-4',
    avg_daily_usage: 3.2,
    days_of_stock: 2.50,
    last_ordered: new Date('2026-03-12'),
  },
  
  // PANTRY
  {
    id: 'ing-13',
    name: 'Extra Virgin Olive Oil',
    uom: 'l',
    on_hand_qty: 18.0,
    unit_cost: 18.00,
    reorder_point: 12,
    par_level: 30,
    safety_stock: 6,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 2.2,
    days_of_stock: 8.18,
    last_ordered: new Date('2026-03-08'),
  },
  {
    id: 'ing-14',
    name: 'Spaghetti Pasta',
    uom: 'kg',
    on_hand_qty: 42.0,
    unit_cost: 2.20,
    reorder_point: 25,
    par_level: 70,
    safety_stock: 15,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 6.5,
    days_of_stock: 6.46,
    last_ordered: new Date('2026-03-09'),
  },
  {
    id: 'ing-15',
    name: 'Penne Pasta',
    uom: 'kg',
    on_hand_qty: 35.0,
    unit_cost: 2.10,
    reorder_point: 20,
    par_level: 60,
    safety_stock: 12,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 5.8,
    days_of_stock: 6.03,
    last_ordered: new Date('2026-03-09'),
  },
  {
    id: 'ing-16',
    name: 'Arborio Rice',
    uom: 'kg',
    on_hand_qty: 28.0,
    unit_cost: 3.80,
    reorder_point: 18,
    par_level: 45,
    safety_stock: 10,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 4.2,
    days_of_stock: 6.67,
    last_ordered: new Date('2026-03-10'),
  },
  {
    id: 'ing-17',
    name: 'All-Purpose Flour',
    uom: 'kg',
    on_hand_qty: 55.0,
    unit_cost: 1.20,
    reorder_point: 30,
    par_level: 80,
    safety_stock: 18,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 7.2,
    days_of_stock: 7.64,
    last_ordered: new Date('2026-03-08'),
  },
  {
    id: 'ing-18',
    name: 'San Marzano Tomatoes (Canned)',
    uom: 'kg',
    on_hand_qty: 32.0,
    unit_cost: 4.50,
    reorder_point: 22,
    par_level: 50,
    safety_stock: 12,
    category: 'Pantry',
    supplier_id: 'sup-5',
    avg_daily_usage: 5.8,
    days_of_stock: 5.52,
    last_ordered: new Date('2026-03-11'),
  },
];

// ===================
// INCOMING ORDERS
// ===================
export const incomingOrders: IncomingOrder[] = [
  {
    id: 'inc-1',
    ingredient_id: 'ing-3',
    qty: 25,
    uom: 'kg',
    eta: new Date('2026-03-15'),
    status: 'in_transit',
    po_id: 'po-003',
  },
  {
    id: 'inc-2',
    ingredient_id: 'ing-10',
    qty: 30,
    uom: 'kg',
    eta: new Date('2026-03-16'),
    status: 'pending',
    po_id: 'po-004',
  },
  {
    id: 'inc-3',
    ingredient_id: 'ing-14',
    qty: 50,
    uom: 'kg',
    eta: new Date('2026-03-17'),
    status: 'pending',
    po_id: 'po-005',
  },
];

// ===================
// PURCHASE ORDERS
// ===================
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    branch_id: 'branch-1',
    supplier_id: 'sup-1',
    supplier_name: 'Fresh Ocean Seafood',
    items: [
      {
        ingredient_id: 'ing-1',
        ingredient_name: 'Fresh Salmon Fillet',
        qty_ordered: 30,
        uom: 'kg',
        unit_cost: 25.50,
        total_cost: 765.00,
      },
      {
        ingredient_id: 'ing-2',
        ingredient_name: 'Shrimp (Large)',
        qty_ordered: 20,
        uom: 'kg',
        unit_cost: 32.00,
        total_cost: 640.00,
      },
    ],
    status: 'draft',
    total_cost: 1405.00,
    eta: new Date('2026-03-16'),
    created_at: new Date('2026-03-14'),
    created_by: 'Manager Ahmed',
    notes: 'Urgent - critical stock levels',
  },
  {
    id: 'po-002',
    branch_id: 'branch-1',
    supplier_id: 'sup-3',
    supplier_name: 'Farm Fresh Produce',
    items: [
      {
        ingredient_id: 'ing-6',
        ingredient_name: 'Roma Tomatoes',
        qty_ordered: 50,
        uom: 'kg',
        unit_cost: 3.50,
        total_cost: 175.00,
      },
      {
        ingredient_id: 'ing-7',
        ingredient_name: 'Fresh Basil',
        qty_ordered: 10,
        uom: 'kg',
        unit_cost: 15.00,
        total_cost: 150.00,
      },
      {
        ingredient_id: 'ing-8',
        ingredient_name: 'Lettuce (Iceberg)',
        qty_ordered: 30,
        uom: 'kg',
        unit_cost: 2.80,
        total_cost: 84.00,
      },
    ],
    status: 'draft',
    total_cost: 409.00,
    eta: new Date('2026-03-15'),
    created_at: new Date('2026-03-14'),
    created_by: 'Manager Ahmed',
    notes: 'Critical produce items - expedite delivery',
  },
  {
    id: 'po-003',
    branch_id: 'branch-1',
    supplier_id: 'sup-2',
    supplier_name: 'Valley Dairy Co.',
    items: [
      {
        ingredient_id: 'ing-3',
        ingredient_name: 'Mozzarella Cheese',
        qty_ordered: 25,
        uom: 'kg',
        unit_cost: 12.00,
        total_cost: 300.00,
      },
    ],
    status: 'approved',
    total_cost: 300.00,
    eta: new Date('2026-03-15'),
    created_at: new Date('2026-03-13'),
    created_by: 'Manager Ahmed',
    approved_at: new Date('2026-03-13'),
    approved_by: 'Admin Sarah',
  },
  {
    id: 'po-004',
    branch_id: 'branch-1',
    supplier_id: 'sup-4',
    supplier_name: 'Premium Meats Ltd',
    items: [
      {
        ingredient_id: 'ing-10',
        ingredient_name: 'Chicken Breast',
        qty_ordered: 30,
        uom: 'kg',
        unit_cost: 8.50,
        total_cost: 255.00,
      },
    ],
    status: 'sent',
    total_cost: 255.00,
    eta: new Date('2026-03-16'),
    created_at: new Date('2026-03-12'),
    created_by: 'Manager Ahmed',
    approved_at: new Date('2026-03-12'),
    approved_by: 'Admin Sarah',
  },
  {
    id: 'po-005',
    branch_id: 'branch-1',
    supplier_id: 'sup-5',
    supplier_name: 'Olive & Oil Importers',
    items: [
      {
        ingredient_id: 'ing-14',
        ingredient_name: 'Spaghetti Pasta',
        qty_ordered: 50,
        uom: 'kg',
        unit_cost: 2.20,
        total_cost: 110.00,
      },
    ],
    status: 'sent',
    total_cost: 110.00,
    eta: new Date('2026-03-17'),
    created_at: new Date('2026-03-11'),
    created_by: 'Manager Ahmed',
    approved_at: new Date('2026-03-11'),
    approved_by: 'Admin Sarah',
  },
];

// ===================
// INVENTORY ALERTS
// ===================
export const inventoryAlerts: InventoryAlert[] = [
  {
    id: 'alert-1',
    type: 'low_stock',
    ingredient_id: 'ing-1',
    branch_id: 'branch-1',
    severity: 'critical',
    message: 'Fresh Salmon Fillet critically low (0.8 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'low_stock',
    ingredient_id: 'ing-2',
    branch_id: 'branch-1',
    severity: 'critical',
    message: 'Shrimp (Large) critically low (1.6 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'low_stock',
    ingredient_id: 'ing-6',
    branch_id: 'branch-1',
    severity: 'critical',
    message: 'Roma Tomatoes critically low (1.7 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-4',
    type: 'low_stock',
    ingredient_id: 'ing-7',
    branch_id: 'branch-1',
    severity: 'critical',
    message: 'Fresh Basil critically low (1.6 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-5',
    type: 'low_stock',
    ingredient_id: 'ing-8',
    branch_id: 'branch-1',
    severity: 'critical',
    message: 'Lettuce (Iceberg) critically low (1.9 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-6',
    type: 'low_stock',
    ingredient_id: 'ing-12',
    branch_id: 'branch-1',
    severity: 'warning',
    message: 'Beef Sirloin stock low (2.5 days remaining)',
    created_at: new Date('2026-03-14T08:00:00'),
    acknowledged: false,
  },
  {
    id: 'alert-7',
    type: 'po_overdue',
    branch_id: 'branch-1',
    severity: 'info',
    message: '2 draft purchase orders require approval',
    created_at: new Date('2026-03-14T10:30:00'),
    acknowledged: false,
  },
];

// ===================
// USAGE HISTORY (Last 7 days)
// ===================
export const forecastUsage: ForecastUsage[] = [
  // Salmon usage history
  { date: new Date('2026-03-08'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 4.5, forecasted_qty: 4.2 },
  { date: new Date('2026-03-09'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 3.8, forecasted_qty: 4.2 },
  { date: new Date('2026-03-10'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 4.2, forecasted_qty: 4.2 },
  { date: new Date('2026-03-11'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 5.1, forecasted_qty: 4.2 },
  { date: new Date('2026-03-12'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 3.9, forecasted_qty: 4.2 },
  { date: new Date('2026-03-13'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 4.6, forecasted_qty: 4.2 },
  { date: new Date('2026-03-14'), branch_id: 'branch-1', ingredient_id: 'ing-1', used_qty: 3.3, forecasted_qty: 4.2 },
];

// ===================
// AUTO-REORDER RULES
// ===================
export const autoReorderRules: AutoReorderRule[] = [
  {
    id: 'rule-1',
    branch_id: 'branch-1',
    ingredient_id: 'ing-1',
    enabled: true,
    reorder_method: 'forecast',
    multiplier: 1.2,
    auto_approve: false,
    notes: 'High-value item, requires manual approval',
  },
  {
    id: 'rule-2',
    branch_id: 'branch-1',
    ingredient_id: 'ing-14',
    enabled: true,
    reorder_method: 'par',
    multiplier: 1.0,
    auto_approve: true,
    notes: 'Stable pantry item, auto-approve enabled',
  },
];

// ===================
// BUSINESS LOGIC FUNCTIONS
// ===================

/**
 * Calculate reorder suggestions for all ingredients
 */
export function calculateReorderSuggestions(branchId: string = 'branch-1'): ReorderSuggestion[] {
  const suggestions: ReorderSuggestion[] = [];
  
  ingredients.forEach((ingredient) => {
    const supplier = suppliers.find((s) => s.id === ingredient.supplier_id);
    if (!supplier) return;
    
    // Get incoming quantity for this ingredient
    const incoming = incomingOrders
      .filter((io) => io.ingredient_id === ingredient.id && io.status !== 'received')
      .reduce((sum, io) => sum + io.qty, 0);
    
    const avgDailyUsage = ingredient.avg_daily_usage || 0;
    const leadTimeDays = supplier.lead_time_days;
    const forecastDays = leadTimeDays + 3; // Lead time + review period
    const demandMultiplier = 1.1; // 10% buffer for demand variation
    
    // Calculate forecast quantity
    const forecastQty = avgDailyUsage * forecastDays * demandMultiplier;
    
    // Calculate required quantity
    const requiredQty = Math.max(
      0,
      forecastQty + ingredient.safety_stock - (ingredient.on_hand_qty + incoming)
    );
    
    // Round up to pack size
    const packSize = supplier.pack_size;
    const suggestedOrderQty = requiredQty > 0
      ? Math.ceil(requiredQty / packSize) * packSize
      : 0;
    
    // Calculate expected cost and ETA
    const expectedCost = suggestedOrderQty * ingredient.unit_cost;
    const eta = new Date();
    eta.setDate(eta.getDate() + leadTimeDays);
    
    // Determine priority
    let priority: 'urgent' | 'high' | 'normal' | 'low' = 'normal';
    const daysOfStock = ingredient.days_of_stock || 0;
    if (daysOfStock < 2) priority = 'urgent';
    else if (daysOfStock < 5) priority = 'high';
    else if (daysOfStock < 7) priority = 'normal';
    else priority = 'low';
    
    if (suggestedOrderQty > 0 || ingredient.on_hand_qty < ingredient.reorder_point) {
      suggestions.push({
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.name,
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        current_stock: ingredient.on_hand_qty,
        incoming_qty: incoming,
        avg_daily_usage: avgDailyUsage,
        days_of_stock: daysOfStock,
        forecast_qty: forecastQty,
        safety_stock: ingredient.safety_stock,
        reorder_point: ingredient.reorder_point,
        required_qty: requiredQty,
        pack_size: packSize,
        suggested_order_qty: suggestedOrderQty,
        expected_cost: expectedCost,
        eta: eta,
        priority: priority,
        calculation_details: {
          lead_time_days: leadTimeDays,
          forecast_days: forecastDays,
          demand_multiplier: demandMultiplier,
        },
      });
    }
  });
  
  // Sort by priority (urgent first)
  return suggestions.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Get inventory statistics
 */
export function getInventoryStats(branchId: string = 'branch-1') {
  const totalInventoryValue = ingredients.reduce(
    (sum, ing) => sum + ing.on_hand_qty * ing.unit_cost,
    0
  );
  
  const lowStockItems = ingredients.filter(
    (ing) => (ing.days_of_stock || 0) < 5
  ).length;
  
  const criticalStockItems = ingredients.filter(
    (ing) => (ing.days_of_stock || 0) < 2
  ).length;
  
  const avgStockCoverage =
    ingredients.reduce((sum, ing) => sum + (ing.days_of_stock || 0), 0) /
    ingredients.length;
  
  const pendingIncoming = incomingOrders.filter(
    (io) => io.status !== 'received'
  ).length;
  
  const draftPOs = purchaseOrders.filter((po) => po.status === 'draft').length;
  
  const totalPOValue = purchaseOrders
    .filter((po) => po.status === 'draft')
    .reduce((sum, po) => sum + po.total_cost, 0);
  
  const unacknowledgedAlerts = inventoryAlerts.filter(
    (alert) => !alert.acknowledged
  ).length;
  
  return {
    totalInventoryValue,
    lowStockItems,
    criticalStockItems,
    avgStockCoverage,
    pendingIncoming,
    draftPOs,
    totalPOValue,
    unacknowledgedAlerts,
    stockoutRisk: criticalStockItems,
  };
}

/**
 * Get ingredients with critical/low stock
 */
export function getRiskItems() {
  return ingredients
    .filter((ing) => (ing.days_of_stock || 0) < 5)
    .sort((a, b) => (a.days_of_stock || 0) - (b.days_of_stock || 0));
}
