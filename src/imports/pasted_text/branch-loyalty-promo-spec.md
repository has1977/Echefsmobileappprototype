Below is a concise, developer- and designer-ready specification for Branch‑specific Loyalty, Promotions & Gifts — including business logic, data model, UI/UX layout, routes, permissions, and display rules so each branch manager can fully control their own programs via dashboard/admin pages and customers see the correct offers after selecting a branch.

1) Goals
- Enable each branch to create/manage its own loyalty programs, promotions, and gift offers.
- Ensure clear ownership, permission control (branch manager vs. admin), accurate targeting, and consistent UX displaying only branch-relevant items after branch selection.
- Track redemption, effectiveness, and avoid conflicting promotions.

2) Data model (concise)
- Branch { id, name, region, timezone, menus[], status }
- LoyaltyProgram { id, branch_id, name, status(active/draft/paused), accrual_rule, redemption_rules, tiers[], start_at, end_at, terms, created_by, created_at }
  - accrual_rule: { unit: currency/visits, rate: number } e.g., 1 USD = 10 pts
  - tiers: [{name, points_required, benefits}]
  - redemption_rules: [{reward_id, points_cost, limit_per_user, expiry_days}]
- Promotion { id, branch_id, name, type(discount, bundle, upsell, happy_hour), scope(menu_item_ids or category_ids or global), discount: {percent|amount}, min_order_value, schedule: {days, start_time, end_time}, stacking_rule(allow/exclusive), usage_limit, created_by, status }
- GiftOffer { id, branch_id, name, trigger(condition: min_order_value / specific_item / loyalty_tier), reward_type(free_item/discount/points), schedule, limit_per_user, status }
- Reward { id, type, details } (used by loyalty redemptions)
- CampaignLog { id, branch_id, user_id, action(created/activated/redeemed/expired), meta }
- UserLoyalty { user_id, branch_id, points_balance, tier, history[] }
- CouponCode { code, branch_id, promotion_id, single_use/multi_use, expiry, usage_count }
- Audit & Permissions: Role assignments per branch.

3) Permissions & roles
- Branch Manager: create/edit/publish promotions, gifts, loyalty programs for their branch only; view reports for their branch.
- Admin (Super): create global promotions, override branch rules, view cross-branch analytics, assign managers.
- Guest Manager/Viewer: read-only.
- System enforces branch_id scoping on all CRUD operations.

4) Business logic & precedence
- Evaluation order at checkout:
  1. Branch-specific active happy-hour/time-limited promotions (time + day match)
  2. Branch-specific item/category promotions (explicit scope)
  3. Loyalty redemptions & automatic rewards (if customer redeems)
  4. Coupon codes (branch-scoped)
  5. Delivery/takeaway-specific fees/discounts
- Stacking rules:
  - By default, promotions are exclusive unless promotion.stack = true.
  - Loyalty automatic rewards may be applied in addition unless a promotion explicitly forbids stacking.
- Conflict resolution:
  - If competing promotions with same priority, apply the one with higher monetary benefit.
  - Log decisions in CampaignLog for audit and analytics.

5) UI – Customer Loyalty & Promotions (after branch selection)
- Entry: after branch selection (auto from QR/NFC or manual), show a compact banner: “You’re ordering at {Branch Name} — Offers available”
- Primary Tabbed Layout (Loyalty | Promotions | Gifts)
  - Header: Branch card (name, hours, loyalty tier status if logged in)
  - Loyalty Tab:
    - Loyalty summary card: points balance (branch-specific), current tier, progress bar to next tier, CTA “Redeem Rewards”
    - Active auto-rewards: (e.g., “Free Drink on orders over $30”) with Redeem button if eligible
    - Earning rules: short bullets (e.g., “Earn 10 pts per $1”)
    - History link: view past points & redemptions
  - Promotions Tab:
    - Filtered list of active promotions for branch, sorted by relevance (current time-sensitive first, then highest savings)
    - Promotion card: title, badge (e.g., 20% OFF), scope (items/categories), time left, CTA “Apply” or “See items”
    - Banner carousel for featured promos
    - Opt-in toggles (if promo requires signup)
  - Gifts Tab:
    - Gift cards/offers and triggered gifts
    - Gift card component: buy/send gift (if enabled)
    - Triggered gifts: show conditions and CTA “Add to cart” or “Redeem”
- Menu Integration:
  - In menu list and item detail, show inline promotion badges and loyalty/ gift indicators (e.g., “Eligible for free side with this item”)
  - When adding to cart, show applied promotions and points earning preview
- Checkout UI:
  - Promotions & Loyalty panel shows applied offers with breakdown, option to manually apply coupon or redeem points
  - Clear indicator of stacking and final savings
  - Confirmation of redemption and points deduction

6) UI – Manager Dashboard (branch-scoped)
- Loyalty Management panel:
  - Create/Edit Loyalty Program wizard: accrual rule, tiers, redemption catalog, start/end, auto-rewards toggle
  - Preview customer-facing cards
  - Member management: view top members, manual point adjustments, export CSV
- Promotions Manager:
  - Create promotion wizard: select type, scope (categories/items/global), schedule (time windows like happy hour), stacking rule, usage limit, coupon generation
  - Preview: how it appears on menu and checkout
  - Activation toggle & scheduling
- Gifts Manager:
  - Create triggered gifts: define trigger, reward, limits
  - Gift card config (if selling): denominations, expiry
- Analytics:
  - KPI widgets: redemptions, revenue lift from promos, AOV lift, active members, coupon usage
  - Campaign logs and audit trail
- Approvals:
  - If organization requires, promotions created by branch managers can be set to “pending” for admin approval.

7) APIs & routes (examples)
- GET /branches/{id}/offers — returns active promotions, gifts, loyalty program summary
- GET /branches/{id}/promotions — list (filter: active, time)
- POST /branches/{id}/promotions — create (branch manager)
- POST /branches/{id}/promotions/{id}/apply — evaluate on cart payload -> returns discount lines
- POST /branches/{id}/loyalty/redeem — redeem points, returns updated balance & reward
- GET /users/{id}/branches/{id}/loyalty — user balance & tier
- GET /branches/{id}/campaign-logs — analytics & logs (authorized)
- Webhooks: campaign/offer created/updated/published → push to POS/KDS/Cache invalidation

8) Checkout evaluation flow (server-side)
- Input: cart {items, quantities, branch_id, user_id, order_type}
- Steps:
  1. Fetch branch active promotions (time filtered)
  2. Fetch user loyalty status for branch
  3. Evaluate automatic gifts and loyalty auto-rewards
  4. Evaluate coupon codes user supplied
  5. Compute all applicable combos according to stacking rules and pick optimal set
  6. Return line items: base prices, discounts applied, points earned, final total, audit log of decision

9) Caching & performance
- Cache branch offers in CDN for 30–60s; invalidate on publish/unpublish.
- Use optimistic UI for customer when applying coupon or redeeming points; confirm server result and rollback on failure.

10) Analytics & KPIs
- Track: promo impressions, promo clicks, promo redemptions, AOV delta (with/without promo), loyalty enrollment rate, points expiration rate, top performing promotions per branch
- Use CampaignLog for attribution.

11) Edge cases & rules
- Expiring points: notify user; auto-expire according to branch rules.
- Branch-level overrides: branch manager cannot change global promotions; admin can push global promos to branches.
- Multi-branch cart: disallow promotions that are branch-exclusive when cart contains items from multiple branches (recommend single-branch order).
- Refunds: when refund occurs, reverse points and promo redemptions; log in CampaignLog.

12) UX & Display priorities (best ways to show to user)
- After branch selection, show a concise banner with 1-2 highlighted offers (time sensitive or high savings).
- Use badges inline in menu (e.g., “20% OFF”, “Earn 50 pts”) and a persistent “Offers” tab in header to avoid user missing deals.
- Show loyalty progress on home screen for logged-in users; guest users see CTA “Sign up to earn points”.
- At checkout, clearly show applied promotions and points to avoid surprises.
- Use microcopy: “Applied by branch {name}” for transparency.
- Provide preview calculators: “Spend $X more to reach next tier / free item”.

13) Acceptance criteria
- Branch manager can CRUD loyalty, promotions, gifts scoped to their branch.
- Customer sees only branch-active items after selecting branch.
- Checkout applies promotions correctly per stacking rules and logs decisions.
- Analytics show campaign performance per branch.
- Admin can view and override branch campaigns.
- APIs respond within acceptable time and caches invalidate on publish.

If you want, I can:
- produce a Figma-ready page wireframe for Loyalty / Promotions / Gifts (customer + manager screens), or
- create the JSON schema and example API payloads for each endpoint and a sequence diagram for checkout evaluation. Which do you prefer?