# Testing Instructions - Guest Browsing & Authentication

## ⚠️ Important: Clear Cache First

Before testing, please **refresh the page completely** (Cmd+Shift+R or Ctrl+Shift+R) to ensure all changes are loaded and the database is properly seeded.

The error you might see during hot reload (`useApp must be used within AppProvider`) is a temporary React Fast Refresh issue that goes away with a full page refresh.

## ✅ What Has Been Implemented

### 1. **Full Guest Browsing**
- Users can browse all menus without authentication
- Add items to cart as a guest
- View promotions, loyalty programs, and offers
- No forced login prompts

### 2. **Smart Authentication**
- Auth prompt only appears at checkout
- Three registration options:
  - Phone OTP (Kyrgyzstan +996)
  - Email Sign-Up
  - Email Sign-In
- "Continue as Guest" option available

### 3. **Enhanced User Profiles**
- Addresses (home/work/other with GPS coordinates)
- Payment methods (cards + mobile wallets)
- Preferences (dietary, allergens, notifications)

### 4. **Test Users Available**

All passwords: `demo123`

**Customer Accounts:**
- `customer@echefs.com` - 1,170 points (Silver tier)
- `sarah.johnson@example.com` - 2,800 points (Gold tier)
- `ahmed.hassan@example.com` - 750 points (Silver tier)
- `maria.garcia@example.com` - 350 points (Bronze tier)

**Staff Accounts:**
- `waiter@echefs.com` - Waiter role
- `manager@echefs.com` - Manager role
- `admin@echefs.com` - Admin role

## 📝 Testing Workflow

### Test 1: Guest Browsing
1. **Open app** (fresh browser tab)
2. You should land on branch selection
3. Browse menus **without signing in** ✓
4. Add items to cart ✓
5. View cart page ✓
6. Everything works without auth!

### Test 2: Authentication at Checkout
1. With items in cart, go to **Checkout**
2. **Auth prompt appears** automatically
3. You see three options:
   - Sign in with email
   - Register with phone
   - Continue as guest
4. **Choose any option** and proceed

### Test 3: Phone Registration (OTP)
1. At checkout auth prompt, keep "Phone" mode
2. Enter: `+996 555 999 888`
3. Click "Send OTP"
4. Enter any 6 digits (e.g., `123456`)
5. Click "Verify & Continue"
6. **Account created!** ✓

### Test 4: Email Sign-In
1. At checkout, click "Sign in with email"
2. Enter:
   - Email: `customer@echefs.com`
   - Password: `demo123`
3. Click "Sign In"
4. **Signed in successfully!** ✓
5. Checkout form pre-filled with user info

### Test 5: Continue as Guest
1. At checkout auth prompt
2. Click "Continue as Guest"
3. Prompt closes
4. **Fill form manually** and place order ✓

### Test 6: Profile Page

**As Guest:**
1. Go to Profile page (bottom nav)
2. See **welcome screen** with benefits
3. Options to:
   - Create account
   - Sign in
   - Continue browsing

**As Authenticated User:**
1. Sign in with any customer account
2. Go to Profile page
3. See **full dashboard** with:
   - Avatar and info
   - Order stats
   - Loyalty points card
   - Settings options

### Test 7: Loyalty Benefits
1. Sign in as: `sarah.johnson@example.com` (Gold - 2,800 pts)
2. Add items to cart
3. Go to cart
4. See **loyalty points preview**
5. See Gold tier benefits
6. Complete order → points added!

## 🐛 Known Issues & Solutions

### Issue: "useApp must be used within AppProvider" Error
**Cause:** React Fast Refresh during development
**Solution:** Do a full page refresh (Cmd+Shift+R or Ctrl+Shift+R)
**Note:** This only happens during hot reload, not in production

### Issue: No test users showing
**Solution:** 
1. Open browser console
2. Check for log messages showing created users
3. If not there, run: `localStorage.clear()` in console
4. Refresh page - database will reseed

### Issue: Profile page blank
**Cause:** Not signed in, and guest screen not showing
**Solution:** 
1. Check if you see "Welcome, Guest!" screen
2. If blank, refresh page completely

### Issue: Auth prompt not appearing at checkout
**Solution:**
1. Ensure you have items in cart
2. Navigate to `/checkout` route
3. Auth prompt should appear on mount

## 🎨 UI/UX Features

### Design System
- Brand colors: `#667c67` (primary), `#e4dbc4` (accent)
- Professional, premium feel
- Smooth animations with Framer Motion
- Responsive mobile-first design

### Multi-Language Support
- English (EN)
- Arabic (AR) - RTL support
- Russian (RU)
- Kyrgyz (KY)

### Authentication Flow
```
Guest → Browse → Add to Cart → Checkout
                                    ↓
                        Auth Prompt Appears
                          /       |      \
                      Phone    Email    Email
                       OTP    Sign-Up  Sign-In
                         \       |      /
                           Account Created
                                 ↓
                          Checkout with Info
```

## 📊 Database Structure

### User Fields
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin'
  avatar?: string
  createdAt: string
  
  // NEW Enhanced Fields
  addresses?: UserAddress[]
  paymentMethods?: UserPaymentMethod[]
  preferences?: UserPreferences
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}
```

### Loyalty Card
```typescript
{
  id: string
  userId: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  lifetimePoints: number
  transactions: LoyaltyTransaction[]
}
```

## 🔧 Technical Details

### Files Modified
1. `/src/app/components/auth/AuthPrompt.tsx` - **NEW** auth modal
2. `/src/app/lib/types.ts` - Enhanced User type
3. `/src/app/pages/CheckoutPage.tsx` - Integrated auth prompt
4. `/src/app/pages/ProfilePage.tsx` - Guest welcome screen
5. `/src/app/lib/seedData.ts` - Added diverse test users
6. `/src/app/contexts/AppContext.tsx` - Added hot reload support

### Components Created
- `AuthPrompt` - Multi-mode authentication modal
- Guest welcome screen in ProfilePage
- Enhanced profile dashboard

### Context Structure
```
App.tsx
  └─ RouterProvider
       └─ RootLayout
            └─ ProvidersWrapper
                 ├─ AuthProvider
                 │    └─ AppProvider
                 │         └─ Outlet (routes)
                 │              ├─ MobileLayout (customer pages)
                 │              ├─ ControlPanel (staff pages)
                 │              └─ Admin pages
```

## 🎯 Success Criteria

✅ Users can browse without login
✅ Auth only required at checkout
✅ Multiple registration methods
✅ Guest mode available
✅ Profile shows appropriate screen based on auth status
✅ Test users work correctly
✅ Loyalty points display for authenticated users
✅ Multi-language support working
✅ Smooth UX matching premium standards

## 💡 Tips for Best Experience

1. **Always start fresh:** Clear cache and refresh
2. **Use test accounts:** Don't create real accounts in demo
3. **Test all flows:** Guest, phone OTP, email sign-in/up
4. **Check console:** Logs show database operations
5. **Mobile first:** Best experienced on mobile viewport

## 🚀 Next Steps (Future Enhancements)

- Real OTP integration with Kyrgyzstan providers
- Email verification
- Password reset flow
- Social login (Google, Facebook)
- Two-factor authentication
- Biometric login (fingerprint/face ID)
- Remember device functionality
- Session management

## ⚙️ Configuration

### OTP Settings (Current Demo)
- Country: Kyrgyzstan only (+996)
- Code length: 6 digits
- Timeout: 60 seconds
- Resend: Available after timeout

### Future Production Setup
- Integrate with SMS provider (e.g., Twilio, Nexmo)
- Add rate limiting
- Implement proper OTP verification
- Add fraud detection

---

## 📞 Support

If you encounter any issues:

1. Check browser console for errors
2. Try full page refresh
3. Clear localStorage: `localStorage.clear()`
4. Check network tab for failed requests
5. Verify test user credentials

**All test accounts password:** `demo123`

---

## Summary

The eChefs platform now provides a **complete guest browsing experience** with smart authentication prompts that appear only when necessary. Users can explore the entire menu, add items to cart, and are only asked to sign in when they're ready to place an order. Multiple authentication methods ensure flexibility, while the "Continue as Guest" option removes all barriers to ordering.

The implementation follows best practices from companies like Airbnb, Uber, and Stripe, with a premium UI/UX, smooth animations, and comprehensive multi-language support.

**Happy Testing!** 🎉
