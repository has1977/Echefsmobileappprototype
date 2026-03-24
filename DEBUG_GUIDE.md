# 🐛 Debug Dashboard - Complete Guide

## 🚀 Quick Access

### Method 1: Floating Bug Button (Easiest!)
Look for the **orange bug button** 🐛 in the bottom-right corner of any page!
- Fixed position: Bottom-right
- Always visible (except on full-screen pages)
- One click → Debug Dashboard

### Method 2: Direct URL
```
http://localhost:5173/debug-dashboard
```

### Method 3: From Browser Console
```javascript
window.location.href = '/debug-dashboard';
```

---

## 🎯 What Can You Do?

### 1. **View Current Session State**
See all your current session data in real-time:
- ✅ Selected Branch
- ✅ Order Type (dine-in/delivery/takeaway)
- ✅ Selected Table
- ✅ Selected Region
- ✅ Cart Items Count
- ✅ Delivery Address
- ✅ Pickup Time
- ✅ Applied Promotion

### 2. **Create Test Orders**
One-click test order creation:

**Dine-In Order:**
```
- Creates order with table number
- Status: pending
- Type: dine-in
- Items: Burger x2, Fries x1
```

**Delivery Order:**
```
- Creates order with delivery address
- Status: pending
- Type: delivery
- Estimated delivery time: 30 min
```

**Takeaway Order:**
```
- Creates order with pickup time
- Status: pending
- Type: takeaway
- Pickup time: 20 min
```

### 3. **Manage Order Status**
Update any order status with one click:
- Pending → Confirmed
- Confirmed → Preparing
- Preparing → Ready
- Ready → Delivering (delivery only)
- Any → Completed
- Any → Cancelled

### 4. **View All Orders**
See complete list of all orders in database:
- Order ID
- Order Type (with icon)
- Status (with color)
- Branch Name
- Total Amount
- Number of Items

### 5. **Inspect localStorage**
View all eChefs data stored in localStorage:
- JSON formatted
- Syntax highlighted
- Easy to read

### 6. **Clear Data**
Two options:
- **Clear Orders Only**: Removes all orders from database
- **Clear ALL Data**: Removes orders + localStorage (nuclear option)

---

## 📊 Dashboard Sections

### Header Section
```
┌─────────────────────────────────────┐
│ 🐛 Debug Dashboard                 │
│ Business Logic & Data Flow Inspector│
├─────────────────────────────────────┤
│ Total: 5 | Active: 2 | Revenue: $87│
└─────────────────────────────────────┘
```

### Quick Actions
```
┌─────────────────────────────────────┐
│ [My Orders] [Session Test]          │
│ [New Order] [Refresh Data]          │
└─────────────────────────────────────┘
```

### Current Session State
```
┌─────────────────────────────────────┐
│ Selected Branch: Downtown           │
│ Order Type: dine-in                 │
│ Selected Table: Table 5             │
│ Cart Items: 3                       │
└─────────────────────────────────────┘
```

### Create Test Orders
```
┌─────────────────────────────────────┐
│ [Create Dine-In]                    │
│ [Create Delivery]                   │
│ [Create Takeaway]                   │
└─────────────────────────────────────┘
```

### Database Orders
```
┌─────────────────────────────────────┐
│ Order #12345                        │
│ [dine-in] [preparing] Downtown      │
│ $45.50 • 3 items                    │
│ [View] [Confirm] [Prepare] [Ready]  │
└─────────────────────────────────────┘
```

---

## 🎬 Complete Workflow Test

### Scenario: Test Full Order Flow

1. **Open Debug Dashboard**
   - Click orange bug button 🐛

2. **Check Current State**
   - See if any session data exists

3. **Create Test Order**
   - Click "Create Dine-In Order"
   - Order appears in "Database Orders"

4. **Update Order Status**
   - Click "Confirm" → Order is confirmed
   - Click "Prepare" → Order is preparing
   - Click "Ready" → Order is ready
   - Click "Complete" → Order is completed

5. **View Order**
   - Click "View" button
   - Opens Order Tracking page
   - See smart timeline

6. **Test My Orders Page**
   - Click "My Orders" button
   - See all your orders
   - Click any order to view details

7. **Test Order Again**
   - On completed order tracking page
   - Click "Order Again" button
   - Session resets
   - Navigate to branch selection

---

## 🔍 Why No Data in My Orders?

### Common Reasons:

**1. No Orders Created Yet**
```
Solution: Click "Create Dine-In Order" in Debug Dashboard
```

**2. Orders in Different Storage**
```
Check: Database Orders section shows orders
But: My Orders page is empty
Solution: Orders might not be synced to context
```

**3. User Filter Issue**
```
My Orders might filter by user.id
Test orders use 'guest_user'
Your profile might have different user.id
```

**4. Database Not Initialized**
```
Solution: Refresh page, check console for errors
```

### Quick Fix:
```javascript
// In Debug Dashboard
1. Click "Create Test Order"
2. Go to "My Orders" page
3. If still empty, check browser console
4. Look for errors in red
```

---

## 🎨 Order Status Colors

```
🟡 Pending    - Yellow  (#fbbf24)
🔵 Confirmed  - Blue    (#3b82f6)
🟠 Preparing  - Orange  (#f97316)
🟢 Ready      - Green   (#22c55e)
🟣 Delivering - Purple  (#a855f7)
✅ Completed  - Green   (#16a34a)
❌ Cancelled  - Red     (#dc2626)
```

---

## 🔧 Debug Tools

### Check Order in Database:
```javascript
// In browser console
import { db } from './lib/database';
const orders = await db.orders.getAll();
console.log('All orders:', orders);
```

### Check localStorage:
```javascript
// See all eChefs data
Object.keys(localStorage)
  .filter(k => k.startsWith('echefs_'))
  .forEach(k => console.log(k, localStorage.getItem(k)));
```

### Create Manual Order:
```javascript
const order = {
  id: 'order_test_123',
  branchId: 'branch_1',
  branchName: 'Downtown',
  type: 'dine-in',
  status: 'pending',
  items: [],
  total: 50,
  createdAt: new Date().toISOString(),
  // ... more fields
};

await db.orders.add(order);
```

---

## 📱 Smart Order Tracking

Each order type has **custom timeline**:

### Dine-In Timeline:
```
1. Order Placed
2. Confirmed
3. Preparing
4. Ready
5. Served
```

### Delivery Timeline:
```
1. Order Placed
2. Confirmed
3. Preparing
4. Ready for Pickup
5. On the Way
6. Delivered
```

### Takeaway Timeline:
```
1. Order Placed
2. Confirmed
3. Preparing
4. Ready for Pickup
5. Collected
```

---

## 🚨 Troubleshooting

### Issue: Button Not Visible
**Check:**
- Are you on a full-screen page? (checkout, sign-in, etc.)
- Button only shows on regular pages

**Solution:**
- Navigate to any regular page (menu, cart, etc.)
- Or use direct URL: `/debug-dashboard`

---

### Issue: Can't Create Orders
**Check Console:**
```
F12 → Console → Look for errors
```

**Common Errors:**
- Database not initialized
- Missing branch data
- Invalid order structure

**Solution:**
- Refresh page
- Check `/dev-tools` for database status
- Clear cache and try again

---

### Issue: Orders Not Showing in My Orders
**Diagnosis:**
1. Go to Debug Dashboard
2. Check "Database Orders" section
3. If orders exist there but not in My Orders:
   - User filter issue
   - Context sync issue

**Solution:**
```javascript
// Check user ID
console.log('Current user:', user);

// Check orders
const orders = await db.orders.getAll();
console.log('DB orders:', orders);

// Check context orders
console.log('Context orders:', orders); // from useApp()
```

---

## ✅ Best Practices

### For Testing:
1. ✅ Always start with Debug Dashboard
2. ✅ Create test orders before testing flows
3. ✅ Use different order types to test all scenarios
4. ✅ Check session state before creating orders
5. ✅ Clear old test data regularly

### For Development:
1. ✅ Keep Debug Dashboard open in separate tab
2. ✅ Monitor localStorage changes
3. ✅ Test order status progressions
4. ✅ Verify timeline updates
5. ✅ Check multi-language support

---

## 🎯 Quick Checklist

Before reporting "No Data" issue:

- [ ] Opened Debug Dashboard (`/debug-dashboard`)
- [ ] Checked "Database Orders" section
- [ ] Created at least one test order
- [ ] Refreshed the page
- [ ] Checked browser console for errors
- [ ] Verified localStorage data
- [ ] Tried clearing cache
- [ ] Checked My Orders page (`/my-orders`)

---

## 📍 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Debug Dashboard** | `/debug-dashboard` | Main debug interface |
| **My Orders** | `/my-orders` | All user orders |
| **Session Test** | `/test-session-reset` | Test session reset |
| **Dev Tools** | `/dev-tools` | Developer utilities |
| **Order Tracking** | `/order/{id}/tracking` | Track specific order |

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Orange bug button visible in bottom-right
2. ✅ Debug Dashboard loads with stats
3. ✅ Can create test orders
4. ✅ Orders appear in "Database Orders"
5. ✅ Can update order status
6. ✅ Orders show in My Orders page
7. ✅ Order tracking shows smart timeline

---

## 🆘 Still Having Issues?

Share in this order:

1. **Screenshot** of Debug Dashboard
2. **Browser console** errors (F12 → Console)
3. **localStorage data** (from Debug Dashboard)
4. **Steps to reproduce** the issue
5. **Expected vs Actual** behavior

---

**Quick Start**: Just click the **🐛 orange button** in the bottom-right corner! 🎉
