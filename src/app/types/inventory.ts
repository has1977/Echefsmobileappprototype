// Inventory & Auto-Ordering System Type Definitions

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  recipe_id: string;
  branch_id: string;
  lead_time_category: 'fast' | 'normal' | 'slow';
  category?: string;
  active: boolean;
}

export interface RecipeIngredient {
  ingredient_id: string;
  qty_per_portion: number;
  uom: string;
}

export interface Recipe {
  id: string;
  menu_item_id: string;
  name: string;
  ingredients: RecipeIngredient[];
  cost_per_portion?: number;
  prep_time?: number;
}

export type UnitOfMeasure = 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'lbs' | 'oz' | 'gal';

export interface Ingredient {
  id: string;
  name: string;
  uom: UnitOfMeasure;
  on_hand_qty: number;
  unit_cost: number;
  reorder_point: number;
  par_level: number;
  safety_stock: number;
  category?: string;
  supplier_id?: string;
  avg_daily_usage?: number;
  days_of_stock?: number;
  last_ordered?: Date;
}

export interface Supplier {
  id: string;
  name: string;
  lead_time_days: number;
  min_order_qty: number;
  pack_size: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  preferred: boolean;
  rating?: number;
  on_time_rate?: number;
}

export interface PurchaseOrderItem {
  ingredient_id: string;
  ingredient_name: string;
  qty_ordered: number;
  uom: string;
  unit_cost: number;
  total_cost: number;
}

export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  branch_id: string;
  supplier_id: string;
  supplier_name: string;
  items: PurchaseOrderItem[];
  status: POStatus;
  total_cost: number;
  eta: Date;
  created_at: Date;
  created_by: string;
  approved_at?: Date;
  approved_by?: string;
  received_at?: Date;
  notes?: string;
}

export interface ForecastUsage {
  date: Date;
  branch_id: string;
  ingredient_id: string;
  used_qty: number;
  forecasted_qty?: number;
}

export interface IncomingOrder {
  id: string;
  ingredient_id: string;
  qty: number;
  uom: string;
  eta: Date;
  status: 'pending' | 'in_transit' | 'delayed' | 'received';
  po_id: string;
}

export type ReorderMethod = 'par' | 'min-max' | 'forecast';

export interface AutoReorderRule {
  id: string;
  branch_id: string;
  ingredient_id: string;
  enabled: boolean;
  reorder_method: ReorderMethod;
  multiplier: number;
  auto_approve: boolean;
  notes?: string;
}

export interface InventorySettings {
  working_days: number[];
  review_time: string;
  default_lead_time: number;
  safety_stock_policy: 'percentage' | 'fixed_days' | 'statistical';
  safety_stock_days: number;
  forecast_window_days: number;
  auto_approve_threshold?: number;
}

export interface StockAdjustment {
  id: string;
  ingredient_id: string;
  branch_id: string;
  adjustment_qty: number;
  reason: 'spoilage' | 'waste' | 'correction' | 'transfer' | 'other';
  notes?: string;
  created_by: string;
  created_at: Date;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'stockout' | 'po_overdue' | 'forecast_exception' | 'high_cost';
  ingredient_id?: string;
  branch_id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  created_at: Date;
  acknowledged: boolean;
}

export interface ReorderSuggestion {
  ingredient_id: string;
  ingredient_name: string;
  supplier_id: string;
  supplier_name: string;
  current_stock: number;
  incoming_qty: number;
  avg_daily_usage: number;
  days_of_stock: number;
  forecast_qty: number;
  safety_stock: number;
  reorder_point: number;
  required_qty: number;
  pack_size: number;
  suggested_order_qty: number;
  expected_cost: number;
  eta: Date;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  calculation_details: {
    lead_time_days: number;
    forecast_days: number;
    demand_multiplier: number;
  };
}

export interface DemandSimulation {
  date_range: {
    start: Date;
    end: Date;
  };
  menu_items: {
    menu_item_id: string;
    estimated_orders: number;
  }[];
  ingredient_requirements: {
    ingredient_id: string;
    ingredient_name: string;
    total_required: number;
    current_available: number;
    shortfall: number;
    estimated_cost: number;
  }[];
  total_cost: number;
}
