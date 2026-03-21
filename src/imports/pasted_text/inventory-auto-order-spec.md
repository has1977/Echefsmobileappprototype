Below is a concise, production-ready system spec for calculating food/ingredient needs from orders plus a single, strong prompt you can use to create all dashboard/control-panel pages (Figma or dev) needed to run automatic daily ordering. Includes data model, calculation formulas, business logic, routes, and the page list.

A. Key concepts & data model (minimal)
- MenuItem { id, name, price, recipe_id, branch_id, lead_time_category }
- Recipe/BOM { id, menu_item_id, ingredients: [{ingredient_id, qty_per_portion, uom}] }
- Ingredient { id, name, uom, on_hand_qty, unit_cost, reorder_point, par_level, safety_stock }
- Supplier { id, name, lead_time_days, min_order_qty, pack_size, contact }
- PurchaseOrder { id, branch_id, supplier_id, items: [{ingredient_id, qty_ordered, uom}], status, eta }
- Forecast / Usage { date, branch_id, ingredient_id, used_qty }
- IncomingOrder { id, ingredient_id, qty, eta, status }
- AutoReorderRule { branch_id, ingredient_id, enabled, reorder_method (par/min-max/forecast), multiplier }
- Settings: working_days, review_time, default_lead_time, safety_stock_policy

B. Core calculation formulas
1. Daily ingredient usage from orders:
   used_qty(ingredient) = sum_over_orders( sum_over_items( qty_ordered_item * qty_per_portion_of_ingredient ) )

2. Historical average daily usage:
   avg_daily_usage = SUM(used_qty over N days) / N

3. Forecasted usage for next D days:
   forecast_qty = avg_daily_usage * D * demand_multiplier (seasonality/weekday modifiers)

4. Reorder point (ROP):
   ROP = lead_time_days * avg_daily_usage + safety_stock
   safety_stock = z * σLT * sqrt(lead_time_days)  OR simple policy: safety_stock = avg_daily_usage * safety_days

5. Quantity to order (based on Par or Min-Max):
   If using par level:
     order_qty = max(0, par_level - (on_hand_qty + incoming_qty))
   If using forecast-driven for next D days:
     required = forecast_qty_for_D + safety_stock - (on_hand + incoming)
     order_qty = max(0, ceil_to_pack_size(required, pack_size, min_order_qty))

6. Suggested delivery date / ETA:
   ETA = today + supplier.lead_time_days + branch_processing_days

7. Cost calculations:
   expected_cost = sum(order_qty * unit_cost)

C. Business logic & rules
- Evaluate replenishment once per branch daily (configurable time) or on-demand when on_hand < reorder_point.
- Prioritize ingredients with shortest lead_time or critical items (zero stock risk).
- Batch ingredients to supplier pack_size and respect min_order_qty.
- Combine POs across branches optionally (central admin).
- Allow manual overrides and urgent (express) orders.
- Log all suggestions and final POs for audit.

D. Automation flow (high-level)
1. nightly job or scheduled job per branch:
   - compute avg_daily_usage (last 7/14/30 days as configured)
   - apply seasonality/weekday multipliers
   - compute ROP and required order_qty for each ingredient
   - group by supplier and create Draft PO suggestions
   - apply business constraints (pack_size, budgets, min_order_qty)
   - produce suggested PO list and alert manager for approval (or auto-send if auto-approve enabled)
2. when PO sent: create IncomingOrder with ETA
3. when goods received: update on_hand_qty, close PO, update usage/variance logs

E. Reports / KPIs
- Days of Stock Remaining per ingredient = on_hand_qty / avg_daily_usage
- Stockout risk list (ingredients below ROP)
- Forecast accuracy (forecast vs actual)
- Food cost by day/branch/menu item
- Waste reports (spoilage & adjustments)
- Supplier lead time variance & fill rate

F. Pages to design/build (Dashboard & Control Panel)
Group: Inventory & Auto-Ordering
1. Inventory Dashboard (per-branch)
   - Key KPIs: total inventory value, top risk items, stock coverage days, pending incoming
   - Quick actions: Approve suggested POs, Run Reorder Now, Export

2. Ingredient List & Filters
   - Bulk edit, search, sort by stock/usage/cost, supplier filter, category

3. Ingredient Detail Page
   - Current on_hand, incoming, avg_daily_usage, days_of_stock, ROP, safety_stock, par_level
   - Usage history chart, purchase history, supplier links, activity log
   - Manual adjustment button, set par/ROP/safety, set auto-reorder rule

4. Recipe / Menu Item (BOM) Page
   - Show ingredient list & qty_per_portion, cost per portion, toggle branch-specific recipe variants
   - Edit recipe and preview effect on ingredient demand (simulate x orders)

5. Menu Item Demand Simulator
   - Simulate orders for date range and preview ingredient needs & cost impact

6. Auto-Reorder Rules Page
   - Global/branch rules, per-ingredient rule editor (method, thresholds, multipliers), enable/disable switch

7. Purchase Order (PO) Management
   - Draft PO suggestions list (auto-generated) with grouping by supplier, merge/split, approve/send, status tracking
   - PO detail page, PO history, receive goods action (partial/complete)

8. Supplier Management
   - Supplier profiles, lead_time defaults, min_order_qty, pack_sizes, contact, preferred flag

9. Forecasting & Analytics
   - Forecast settings (window, seasonality), forecast vs actual, promo impact, day-of-week patterns

10. Alerts & Notifications
   - Configure alerts: low-stock, PO overdue, in-transit delays, forecast exceptions. Notification channels (email/push/in-app).

11. Settings & Integrations
   - Branch settings, lead time defaults, currency, auto-approve rules, integration settings (ordering API, vendor EDI, ERP, POS sync)

12. Audit Log & Adjustments
   - Stock adjustments, spoilage entries, manual corrections, report download/export

13. Admin Multi-Branch Overview
   - Consolidated POs, supplier aggregation, central ordering toggle, inter-branch transfer requests

G. UX & routing suggestions (URL patterns)
- /branches/{branchId}/inventory
- /branches/{branchId}/ingredients
- /branches/{branchId}/ingredients/{ingredientId}
- /branches/{branchId}/recipes/{recipeId}
- /branches/{branchId}/auto-reorder
- /branches/{branchId}/pos-drafts
- /branches/{branchId}/po/{poId}
- /suppliers
- /forecasting
- /reports/inventory
- /settings/inventory

H. Example calculation (concrete)
- Ingredient A:
  - avg_daily_usage = 10 kg
  - lead_time_days = 3
  - safety_stock = 10 kg
  - on_hand = 15 kg
  - incoming = 0
  ROP = 3 * 10 + 10 = 40 kg
  required = forecast_for_7_days (10*7=70) + safety_stock(10) - on_hand(15) - incoming(0) = 65 kg
  pack_size = 5 kg -> order_qty = ceil(65/5)*5 = 65 kg

I. Acceptance & controls
- Allow preview/override of every auto PO before sending unless auto-approve enabled.
- Provide rollback and audit trails for changes.
- Allow one-click reorder of last PO.

J. Prompt to create all pages + design in Figma or developer spec (single strong prompt)

Prompt (use this to create the UI/design/dev pages; paste into Figma brief or share with dev team):

"Create a complete, production-ready Inventory & Auto-Ordering module for eChefs (branch-scoped) in Figma (and produce developer-ready specs). Use brand colors #667c67 / #e4dbc4. Deliver a design system subset and interactive prototypes for the following pages: Inventory Dashboard, Ingredient List, Ingredient Detail, Recipe/BOM Editor, Menu Item Demand Simulator, Auto-Reorder Rules, Suggested PO Drafts, PO Detail & Receive Goods, Supplier Management, Forecasting & Analytics, Alerts & Notifications, Settings, Admin Multi-Branch Overview, and Audit Log. Each page must include:

- Clear layout for mobile/tablet/desktop (desktop primary).
- Tokenized components and annotated behaviors (tooltips, modals, confirmation flows).
- Per-ingredient panels showing on_hand, incoming, avg_daily_usage, days_of_stock, ROP, par_level, safety_stock, supplier info, cost.
- Auto-reorder engine UI showing calculation breakdown: avg_daily_usage, forecast_qty, lead_time, safety_stock, required_qty, pack rounding, final order_qty, ETA, expected_cost. Include toggle to auto-approve or require manager approval.
- Draft PO grouping by supplier with edit/merge/split actions, per-line pack-size rounding, min-order validation, and send/print/export actions.
- Simulate button: 'Simulate X orders' that updates ingredient projections and POs in real-time.
- Alerts panel for low-stock, delayed PO, and forecast exceptions with subscription settings.
- Role-based views: Branch Manager (branch-scoped controls), Admin (multi-branch), and Viewer.
- API annotations: expected endpoints, payload examples for calculating reorder (POST /branches/{id}/reorder-suggestions with cart/forecast params) and PO creation (POST /branches/{id}/purchase-orders).
- Exportable assets and a 1-page developer handoff: token JSON, sample SQL schema, queue/cron job schedule, and pseudo-code for reorder algorithm.

Business logic to implement in UI annotations:
- Reorder calculation: forecast for window + safety_stock - (on_hand + incoming) -> rounded to pack_size and respect min_order_qty.
- Fallbacks: if no historical data, use default par_level or manual min.
- Merge rules: show combined PO totals and per-supplier cost.
- Audit: every auto-suggestion and manual edit saved with user id/time.

Deliverables:
- Figma file with pages, a clickable prototype of main flows (generate suggestions → edit PO → send), and an exportable spec (JSON tokens, SVG icon set).
- Short README with process for how nightly jobs compute suggestions and endpoints to trigger manual runs.

Design UX: prioritize clarity—one-click approve for trusted items, detailed breakdown for the rest; visualize days-of-stock with color-coded risk bands (green/yellow/red)."

Use this prompt to generate the UI and developer spec so the system can auto-calculate daily needs, produce draft POs, and let managers approve or auto-send orders.

If you want, I can now:
- produce the pseudo-code for the nightly reorder job and example SQL queries, or
- produce Figma wireframe lists for each page (component-by-component). Which next?