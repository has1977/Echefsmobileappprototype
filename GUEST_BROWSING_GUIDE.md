# Guest Browsing & Authentication Guide

## Overview
The eChefs platform now supports **full guest browsing** with smart authentication prompts only when necessary.

## Key Features

### ✅ Guest Browsing Enabled
- **Browse all menus** without logging in
- **View menu items** and details
- **Add items to cart**
- **View promotions** and offers
- **Check loyalty programs**
- **Browse all content** freely

### 🔐 Authentication Required For
- **Placing orders** (checkout)
- **Viewing order history**
- **Accessing loyalty points**
- **Profile management**

## Test Users

All demo accounts use password: **demo123**

### Customer Accounts (Test Loyalty Features)
| Email | Points | Tier | Use Case |
|-------|--------|------|----------|
| `customer@echefs.com` | 1,170 | Silver | Regular customer |
| `sarah.johnson@example.com` | 2,800 | Gold | VIP customer |
| `ahmed.hassan@example.com` | 750 | Silver | Active member |
| `maria.garcia@example.com` | 350 | Bronze | New member |

### Staff Accounts (Test Admin Features)
| Email | Role | Access |
|-------|------|--------|
| `waiter@echefs.com` | Waiter | KDS, Orders |
| `manager@echefs.com` | Manager | Reports, Menu |
| `admin@echefs.com` | Admin | Full access |

## User Flow

### Guest User Journey
1. **Open app** → Browse immediately (no login required)
2. **Browse menus** → View items, categories, promotions
3. **Add to cart** → Items added without authentication
4. **Go to checkout** → Authentication prompt appears
5. **Choose action**:
   - Sign in with existing account
   - Register with phone number (+996 Kyrgyzstan)
   - Register with email
   - **Continue as guest** (order without account)

### Authenticated User Journey
1. **Sign in** → Access full features
2. **Browse** → Personalized experience
3. **Cart** → See loyalty points preview
4. **Checkout** → Pre-filled information
5. **Order** → Track history, earn points

## Registration Options

### 1. Phone Registration (OTP)
- **Country**: Kyrgyzstan only (+996)
- **Process**: Enter phone → Receive OTP → Verify → Account created
- **Use case**: Quick registration for local users

### 2. Email Registration
- **Fields**: Name, Email, Phone (optional), Password
- **Process**: Fill form → Account created immediately
- **Use case**: Standard registration

### 3. Email Sign-In
- **Fields**: Email, Password
- **Process**: Credentials → Instant access
- **Use case**: Returning users

### 4. Continue as Guest
- **No registration** required
- **Enter details** at checkout manually
- **No loyalty benefits**
- **Use case**: One-time orders

## Profile Page Behavior

### For Guests (Not Authenticated)
- Shows **welcome screen** with benefits
- Lists **account creation** advantages
- Options to:
  - Create account
  - Sign in
  - Continue browsing

### For Authenticated Users
- Full profile dashboard
- Order statistics
- Loyalty card display
- Settings and preferences
- Sign out option

## Enhanced User Profile

### New Profile Fields
- **Addresses**: Multiple delivery addresses (home, work, other)
- **Payment Methods**: Saved cards and mobile wallets
  - Credit/Debit cards
  - Mobile wallets (MBank, ODengi, Elsom)
- **Preferences**:
  - Language preference
  - Notification settings
  - Dietary restrictions
  - Allergen information
  - Favorite items

### Address Management
```typescript
{
  type: 'home' | 'work' | 'other',
  street: string,
  apartment?: string,
  city: string,
  coordinates?: { latitude, longitude },
  isDefault: boolean,
  deliveryInstructions?: string
}
```

### Payment Methods
```typescript
{
  type: 'card' | 'mobile_wallet' | 'bank_transfer',
  // Card details (last 4 digits only)
  cardNumber?: string,
  cardType?: 'visa' | 'mastercard' | 'amex',
  // Mobile wallet
  walletProvider?: 'mbank' | 'odengi' | 'elsom',
  isDefault: boolean
}
```

## Testing Guide

### Test Guest Browsing
1. Open the app (not logged in)
2. Browse all menus ✓
3. Add items to cart ✓
4. Go to checkout → Auth prompt appears ✓
5. Click "Continue as Guest" ✓
6. Enter order details manually ✓

### Test Phone Registration
1. Go to Profile page
2. Click "Create Account"
3. Enter Kyrgyzstan number: `+996 555 999 888`
4. Click "Send OTP"
5. Enter any 6 digits
6. Click "Verify & Continue"
7. Account created! ✓

### Test Email Sign-In
1. Go to checkout (with items in cart)
2. In auth prompt, click "Sign in with email"
3. Enter: `customer@echefs.com` / `demo123`
4. Click "Sign In"
5. Redirected to checkout with user info ✓

### Test Loyalty Benefits
1. Sign in as: `sarah.johnson@example.com` (Gold tier)
2. Browse menu and add items
3. Go to cart → See points earning preview
4. See Gold tier discount applied
5. Complete order → Points added to balance ✓

## Technical Implementation

### Components Created
- `/src/app/components/auth/AuthPrompt.tsx` - Authentication modal

### Updated Files
- `/src/app/lib/types.ts` - Enhanced User type with addresses, payments, preferences
- `/src/app/pages/CheckoutPage.tsx` - Integrated auth prompt
- `/src/app/pages/ProfilePage.tsx` - Guest welcome screen
- `/src/app/lib/seedData.ts` - Added diverse test users

### Key Features
- **No forced login** - Users can browse freely
- **Smart prompts** - Auth only when necessary (checkout, profile)
- **Multiple registration methods** - Phone OTP, email, guest
- **Enhanced profiles** - Addresses, payments, preferences
- **Multi-language** - English, Arabic, Russian, Kyrgyz

## Best Practices

### For Development
- Always test guest flow first
- Verify auth prompt appears at checkout
- Test all registration methods
- Check loyalty points calculation
- Verify user data persistence

### For Users
- Browse freely without account
- Create account to unlock benefits
- Save addresses and payment methods
- Track order history
- Earn loyalty points

## Support

### Common Issues

**Q: Auth prompt not showing at checkout?**
A: Check if `AuthPrompt` component is imported and used in CheckoutPage.tsx

**Q: Profile page shows nothing for guests?**
A: Verify the guest welcome screen logic in ProfilePage.tsx (lines ~400-460)

**Q: OTP verification fails?**
A: For demo purposes, any 6-digit code works. In production, integrate real OTP service.

**Q: Test users not appearing?**
A: Clear localStorage and refresh to reseed database with `seedDatabase()`

## Summary

✅ **Guest browsing fully functional**
✅ **Authentication only when needed** 
✅ **Multiple registration options**
✅ **Enhanced user profiles**
✅ **Test users with varying loyalty tiers**
✅ **Professional UX matching Airbnb/Uber/Stripe**

The platform now provides a frictionless browsing experience while smartly requesting authentication only for operations that require it, maximizing conversion and user satisfaction.
