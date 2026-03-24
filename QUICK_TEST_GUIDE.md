# 🚀 Quick Test Guide - See Your Changes NOW!

## ⚡ Step 1: Hard Refresh (DO THIS FIRST!)

### Windows/Linux:
Press **`Ctrl + Shift + R`** or **`Ctrl + F5`**

### Mac:
Press **`Cmd + Shift + R`**

---

## 🧪 Step 2: Test Page (Verify Changes)

Navigate to: **`/test-session-reset`**

Example: `http://localhost:5173/test-session-reset`

This page will show you:
- ✅ All session state values
- ✅ localStorage contents
- ✅ Test results (green = clean, red = data present)
- ✅ Button to test resetOrderSession()

---

## 📋 Step 3: Full Workflow Test

### Test Scenario: Dine-In → Delivery

1. **Go to**: `/branch-selection`
2. **Select** any branch
3. **Check-in** to a table (e.g., Table 5)
4. **Add items** to cart
5. **Go to checkout** and complete order
6. **On Order Tracking page**, look for:
   ```
   ┌─────────────────────────────┐
   │ [Back to Home] [Order Again]│ ← Should see TWO buttons
   └─────────────────────────────┘
   ```
7. **Click "Order Again"**
8. **Open browser console** (F12) - should see:
   ```
   ✅ Order session reset - ready for new order
   ```
9. **Try placing a delivery order** - should work!

---

## 👀 What You Should See

### 1. **Order Tracking Page** (Completed Orders)

**Before:**
```
┌──────────────────┐
│ [Back to Home]   │  ← Only one button
└──────────────────┘
```

**After:**
```
┌─────────────────────────────────┐
│ [Back to Home]  [Order Again]  │  ← Two buttons
└─────────────────────────────────┘
```

### 2. **Table Check-In Page**

**Before (Cramped):**
```
[table_dt_2] Table Number Table table_dt_2  ← Hard to read
```

**After (Clear):**
```
┌─────────────────────┐
│   ┌───────────┐    │
│   │ table_dt_2│    │  ← Big badge (80x80px)
│   └───────────┘    │
│                     │
│   TABLE NUMBER      │  ← Small label (14px)
│                     │
│   Table table_dt_2  │  ← Large name (24px)
└─────────────────────┘
```

### 3. **Browser Console**

When clicking "Order Again", you should see:
```javascript
🧪 Testing resetOrderSession()...
✅ Order session reset - ready for new order
🧪 Testing resetCheckIn()...
```

---

## 🔍 Where Are The Changes?

### File Locations:

1. **`/src/app/contexts/AppContext.tsx`**
   - Line 289-303: `resetOrderSession()` function
   - Line 456: Exported in context value

2. **`/src/app/contexts/CheckInContext.tsx`**
   - Line 199-203: `resetCheckIn()` function
   - Line 217: Exported in context value

3. **`/src/app/pages/OrderTrackingPage.tsx`**
   - Line 20: Import `resetOrderSession`
   - Line 21: Import `resetCheckIn`
   - Line 66-73: `handleOrderAgain()` function
   - Line 545: "Order Again" button
   - Lines 101, 139, 177, 215: Translations

4. **`/src/app/pages/TableCheckInPage.tsx`**
   - Improved table info display with larger text

---

## 🐛 If You Still Don't See Changes

### Option 1: Clear Everything
1. Open browser DevTools (`F12`)
2. Go to **Application** tab
3. Click **"Clear site data"**
4. Click **"Clear all"**
5. Refresh page

### Option 2: Incognito Mode
1. Open **Incognito/Private window**
2. Navigate to your app
3. Should see changes immediately

### Option 3: Check Console for Errors
1. Press `F12`
2. Go to **Console** tab
3. Look for **red errors**
4. If you see errors, copy and share them

### Option 4: Manual localStorage Clear
Open console (`F12`) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## ✅ Success Checklist

- [ ] Hard refresh done (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- [ ] Can access `/test-session-reset` page
- [ ] "Order Again" button visible on completed orders
- [ ] Clicking "Order Again" shows console message
- [ ] Table info on check-in page is larger and clearer
- [ ] Can complete dine-in order, then delivery order

---

## 🎯 Quick Links

| Page | URL | What to Test |
|------|-----|--------------|
| **Test Page** | `/test-session-reset` | See all state values |
| **Branch Selection** | `/branch-selection` | Start new order |
| **Table Check-In** | `/table-check-in` | See improved UI |
| **My Orders** | `/my-orders` | See order history |
| **Dev Tools** | `/dev-tools` | Manage mock data |

---

## 💡 Pro Tip

To always see latest changes during development:
1. Keep DevTools open (`F12`)
2. Go to **Network** tab
3. Check **"Disable cache"**
4. Keep DevTools open while testing

---

## 🆘 Still Having Issues?

### Check These:

1. **Is the app running?**
   ```bash
   # Should see in terminal
   Local: http://localhost:5173/
   ```

2. **Any build errors?**
   - Check terminal for red error messages
   - Check browser console for errors

3. **TypeScript errors?**
   - Look for red squiggly lines in VS Code
   - Run: Check terminal output

4. **Are providers loaded?**
   - Open console
   - Look for: `🟢 AppProvider rendering - providers are active!`

---

## 📞 Need More Help?

If nothing works, share:
1. **Browser console errors** (F12 → Console)
2. **Network errors** (F12 → Network → filter by "failed")
3. **Terminal output** (any errors when running app)
4. **Screenshot** of what you see vs what's expected

---

**Last Updated**: March 24, 2026
**Version**: 3.3.2
**Changes**: Order session reset + Table check-in UI improvements
