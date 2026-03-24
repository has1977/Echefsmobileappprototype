# 📦 How to See Your Orders - Complete Guide

## 🎯 Quick Answer

There are **2 main pages** to see orders:

### 1. **My Orders Page** (All Orders)
📍 **URL**: `/my-orders`
```
http://localhost:5173/my-orders
```

### 2. **Order Tracking Page** (Single Order)
📍 **URL**: `/order/{orderId}/tracking`
```
http://localhost:5173/order/order_1234567/tracking
```

---

## 🗺️ Navigation Map

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. Home (/)                                │
│     ↓                                       │
│  2. Branch Selection (/branch-selection)    │
│     ↓                                       │
│  3. Menu (/branch/{id}/menu)               │
│     ↓                                       │
│  4. Cart (/cart)                           │
│     ↓                                       │
│  5. Checkout (/checkout)                   │
│     ↓                                       │
│  6. Order Tracking ← YOU ARE HERE!         │
│     (/order/{id}/tracking)                 │
│                                             │
│  To see all orders:                        │
│  → My Orders (/my-orders)                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📱 How to Access My Orders Page

### Method 1: Direct URL
```
http://localhost:5173/my-orders
```

### Method 2: From Profile
1. Click on **Profile** icon (usually top-right or bottom nav)
2. Look for **"My Orders"** / **"طلباتي"**
3. Click it

### Method 3: From Browser Console
```javascript
// Paste in console (F12)
window.location.href = '/my-orders';
```

### Method 4: Add to Navigation (if not visible)
Check your bottom navigation or hamburger menu for "My Orders"

---

## 📊 What You'll See in My Orders Page

```
┌─────────────────────────────────────────────┐
│  My Orders                            [⟳]  │
│  Track and manage your orders              │
├─────────────────────────────────────────────┤
│  🔍 Search orders...                       │
│  [All] [Active] [Completed] [Cancelled]    │
├─────────────────────────────────────────────┤
│  Active Orders                              │
│  ┌───────────────────────────────────────┐ │
│  │ 📦 Order #12345                       │ │
│  │ Downtown Branch                       │ │
│  │ [⏱ Preparing]                         │ │
│  │ 3 items • $45.50                      │ │
│  │ 10 minutes ago                        │ │
│  │ [Track Order] [View Details]          │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Past Orders                                │
│  ┌───────────────────────────────────────┐ │
│  │ ✓ Order #12344                        │ │
│  │ Airport Branch                        │ │
│  │ [✓ Completed]                         │ │
│  │ 5 items • $62.00                      │ │
│  │ 2 days ago                            │ │
│  │ [Order Again] [View Details]          │ │← "Order Again" button!
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 📊 What You'll See in Order Tracking Page

```
┌─────────────────────────────────────────────┐
│  ← Order Tracking                    [⟳]  │
├─────────────────────────────────────────────┤
│  Order #12345                              │
│  [✓ Completed]                             │
├─────────────────────────────────────────────┤
│  📍 Downtown Branch                        │
│  🪑 Table 5                                │
│  💵 Total: $45.50                          │
├─────────────────────────────────────────────┤
│  Order Timeline:                           │
│  ✓ Order Placed    14:30                   │
│  ✓ Confirmed       14:32                   │
│  ✓ Preparing       14:35                   │
│  ✓ Ready           14:50                   │
│  ✓ Completed       15:00                   │
├─────────────────────────────────────────────┤
│  Order Items:                              │
│  • Burger x2                $20.00         │
│  • Fries x1                 $5.50          │
│  • Coke x1                  $3.00          │
│  • Tax                      $2.85          │
│  • Total                    $45.50         │
├─────────────────────────────────────────────┤
│  [Back to Home]  [Order Again]             │← NEW BUTTON!
└─────────────────────────────────────────────┘
```

---

## 🧪 Complete Testing Workflow

### Step-by-Step:

```bash
# 1. Start fresh
Go to: /branch-selection

# 2. Select a branch
Click any branch

# 3. Browse menu
You're at: /branch/{branchId}/menu

# 4. Add items to cart
Click items, add to cart

# 5. View cart
Click cart icon or go to: /cart

# 6. Checkout
Click "Proceed to Checkout"
You're at: /checkout

# 7. Complete order
Fill in details, click "Place Order"

# 8. ORDER TRACKING (Automatic redirect)
You're automatically at: /order/{orderId}/tracking
✅ YOU'LL SEE THE ORDER HERE!

# 9. View all orders
Go to: /my-orders
✅ YOU'LL SEE ALL YOUR ORDERS HERE!
```

---

## 🔍 Order Filtering (My Orders Page)

You can filter orders by status:

| Filter | Shows |
|--------|-------|
| **All** | All orders |
| **Active** | Pending, Confirmed, Preparing, Ready, Delivering |
| **Completed** | Successfully completed orders |
| **Cancelled** | Cancelled orders |

---

## 🎨 Order Status Colors

```
🟡 Pending       - Yellow badge
🔵 Confirmed     - Blue badge
🟠 Preparing     - Orange badge
🟢 Ready         - Green badge
🚚 Delivering    - Purple badge
✅ Completed     - Green badge with checkmark
❌ Cancelled     - Red badge
```

---

## 📲 Quick Access Routes

Copy these to navigate directly:

```bash
# All orders
/my-orders

# Track specific order (replace ORDER_ID)
/order/ORDER_ID/tracking

# Example with actual order ID
/order/order_1711276800000_abc123/tracking

# Start new order
/branch-selection

# View cart
/cart

# Profile (to access My Orders link)
/profile
```

---

## 🧪 Test in Browser Console

Open console (`F12`) and paste:

```javascript
// Go to My Orders
window.location.href = '/my-orders';

// Or see all orders in console
console.log('Orders:', localStorage.getItem('echefs_orders'));

// Or use the context
// (only works if you're on a page with AppProvider)
```

---

## 📊 Sample Order IDs (from demo data)

If you have demo/seed data, orders might have IDs like:

```
order_1711276800000_abc123
order_1711190400000_def456
order_1711104000000_ghi789
```

Try accessing:
```
/order/order_1711276800000_abc123/tracking
```

---

## 🔄 After Placing an Order

### What Happens:

1. **You fill checkout form** at `/checkout`
2. **You click "Place Order"**
3. **System creates order** in database
4. **You're redirected to** `/order/{newOrderId}/tracking`
5. **Order appears in** `/my-orders` list

### Automatic Redirect:

The checkout page has this code:
```typescript
// In CheckoutPage.tsx line 304
navigate(`/order/${order.id}/tracking`);
```

So you're **automatically taken to tracking page**!

---

## 🎯 Where is "Order Again" Button?

The **"Order Again"** button appears:

### Location 1: Order Tracking Page
- **When**: Order is completed or cancelled
- **What it does**: Resets session, takes you to branch selection

### Location 2: My Orders Page
- **When**: On past/completed orders
- **What it does**: Same - resets and starts fresh order

---

## 🐛 If You Don't See Any Orders

### Possible Reasons:

1. **No orders placed yet**
   - Solution: Place a test order

2. **Browser cache**
   - Solution: Hard refresh (`Ctrl+Shift+R`)

3. **localStorage cleared**
   - Solution: Place new order

4. **Wrong user/guest mode**
   - Solution: Check if you're logged in

### Create Test Order:

```bash
1. Go to: /branch-selection
2. Select: Any branch
3. Go to menu: Add items
4. Checkout: Complete form
5. Place order: Click submit
6. ✅ Order created!
7. Check: /my-orders
```

---

## 📱 Mobile Navigation

On mobile, "My Orders" might be in:

1. **Bottom Navigation Bar**
   - Look for orders icon (📦)

2. **Hamburger Menu**
   - Top-left or top-right menu
   - Look for "My Orders" / "طلباتي"

3. **Profile Section**
   - Go to Profile
   - Look for "Order History" or "My Orders"

---

## 🌍 Multi-Language

The page supports all languages:

| Language | Title |
|----------|-------|
| **English** | My Orders |
| **Arabic** | طلباتي |
| **Russian** | Мои заказы |
| **Kyrgyz** | Менин буйрутмаларым |

---

## ✅ Quick Verification

To verify orders page works:

1. Open: `http://localhost:5173/my-orders`
2. Should see: Page title and order list (or "No orders yet")
3. If page loads → ✅ Orders page is working!

---

## 🎬 Video Walkthrough (Text Version)

```
1. [Start] → /
2. [Click] Branch Selection
3. [Select] Downtown Branch
4. [Browse] Menu
5. [Add] 3 items to cart
6. [Click] Cart icon
7. [Click] Checkout
8. [Fill] Customer info
9. [Click] Place Order
10. [Redirect] Order Tracking ← YOU'RE HERE!
11. [See] Order details, timeline, items
12. [Click] "Order Again" ← NEW FEATURE!
13. [Or] Navigate to /my-orders
14. [See] All your orders ← HERE TOO!
```

---

## 🔗 Related Pages

| Page | URL | Purpose |
|------|-----|---------|
| **My Orders** | `/my-orders` | See all orders |
| **Order Tracking** | `/order/{id}/tracking` | Track one order |
| **Cart** | `/cart` | Current cart |
| **Checkout** | `/checkout` | Place order |
| **Profile** | `/profile` | User profile |

---

## 🆘 Need Help?

If you still can't find orders page:

1. **Check if route exists**:
   - Look in `/src/app/routes.ts`
   - Search for "MyOrdersPage"
   - Should be around line 35 and 244

2. **Check if component exists**:
   - File: `/src/app/pages/MyOrdersPage.tsx`
   - Should exist and export `MyOrdersPage`

3. **Check browser console**:
   - Press `F12`
   - Look for errors
   - Especially routing errors

4. **Try direct URL**:
   ```
   http://localhost:5173/my-orders
   ```
   If 404 → Route not configured
   If loads → Route works!

---

**Quick Start**: Just go to **`/my-orders`** and you'll see all your orders! 🎉
