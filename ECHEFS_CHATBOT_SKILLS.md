# eChefs Platform - Chatbot Skills & Knowledge Base

## 🎯 Quick Overview
**eChefs** - Multi-branch restaurant management platform
- **Tech Stack**: React 18.3.1 + TypeScript + Tailwind CSS v4 + React Router v7
- **Languages**: Arabic (RTL), English, Russian, Kyrgyz
- **Currencies**: USD, EUR, GBP, KGS, RUB, TRY, SAR, AED
- **Brand Colors**: #667c67 (Primary), #e4dbc4 (Secondary)

---

## 📁 Project Structure

```
/src/app/
├── components/       # UI components (ui/, shared/, admin/, etc.)
├── contexts/         # AuthContext, AppContext, CheckInContext, FavoritesContext
├── design-system/    # Design tokens and reusable components
├── hooks/            # useCurrency.ts, custom hooks
├── layouts/          # RootLayout, MobileLayout, ProvidersWrapper
├── lib/              # Core utilities, i18n, mockData, database
├── pages/            # All page components
│   ├── admin/        # Admin panel pages
│   ├── auth/         # Sign in/up pages
│   ├── inventory/    # Inventory management
│   ├── kds/          # Kitchen Display System
│   ├── loyalty-additions/ # Loyalty features
│   ├── manager/      # Manager dashboard
│   └── waiter/       # Waiter interface
├── services/         # Data services (ordersData, branchLoyaltyData, etc.)
├── types/            # TypeScript types
├── utils/            # currency.ts, clipboard.ts
├── App.tsx           # Root component
└── routes.ts         # React Router configuration
```

---

## 🌍 Multi-Language System

**Implementation**: `i18next` + `react-i18next`
- **Config File**: `/src/app/lib/i18n.ts`
- **Supported**: Arabic (RTL), English, Russian, Kyrgyz
- **Dynamic**: Languages can be added/removed from admin panel

**Usage**:
```tsx
import { useTranslation } from 'react-i18next';
const { t, i18n } = useTranslation();
const isRTL = i18n.language === 'ar';
```

---

## 💰 Multi-Currency System

**8 Supported Currencies**: USD, EUR, GBP, KGS, RUB, TRY, SAR, AED

**Three Currency Types**:
1. **Store Currency**: Business primary currency
2. **Loyalty Currency**: Points currency
3. **Display Currency**: User preference for viewing prices

**Key Files**:
- Hook: `/src/app/hooks/useCurrency.ts` (`useCurrency()`, `useDisplayCurrency()`)
- Utils: `/src/app/utils/currency.ts` (formatting, conversion)
- Admin: `/src/app/pages/admin/AdminCurrency.tsx`

**Features**:
- Exchange rate configuration
- Points earning rates
- Real-time conversion
- LocalStorage persistence

---

## 🏆 Branch-Specific Loyalty System

**Core Principle**: Each branch has independent loyalty program. Points/rewards earned at Branch A can ONLY be used at Branch A.

**Features**:
- Tiered rewards (Bronze, Silver, Gold, Platinum)
- Branch-specific wallets
- Gift catalog
- Check-in bonuses
- Time-limited promotions

**Key Files**:
- Service: `/src/app/services/branchLoyaltyData.ts`
- Admin: `/src/app/pages/admin/AdminLoyalty.tsx`, `AdminGifts.tsx`
- Customer: `/src/app/pages/LoyaltyPage.tsx`
- Details: `/src/app/pages/loyalty-additions/BranchLoyaltyDetailPage.tsx`

---

## 📦 Order Management

**Order Types**: Dine-In, Takeaway, Delivery

**Order States**: 
pending → confirmed → preparing → ready → out-for-delivery → delivered → completed
(can also be cancelled)

**Key Components**:
- My Orders: `/src/app/pages/MyOrdersPage.tsx`
- Tracking: `/src/app/pages/OrderTrackingPage.tsx`
- Active Orders FAB: `/src/app/components/ActiveOrdersButton.tsx`
  - Auto-updates every 10 seconds
  - Shows only when active orders exist
  - Multi-language support

**Mock Data**: `/src/app/services/ordersData.ts` (15+ sample orders)

---

## 🎨 Design System

**Location**: `/src/app/design-system/`
- `tokens.ts` - Design tokens (colors, spacing, typography)
- `components.tsx` - Reusable UI primitives

**UI Components**: `/src/app/components/ui/`
- Based on Radix UI primitives
- Styled with Tailwind CSS v4
- Includes: Button, Card, Dialog, Dropdown, Input, Select, Tabs, etc.

**Styling**:
- Tailwind CSS v4
- Theme: `/src/styles/theme.css`
- Brand utilities: `/src/styles/brand-utilities.css`
- Animations: `/src/styles/animations.css`

---

## 🧭 Key Routes

### Customer Routes
```
/ - Welcome
/branch-selection - Choose branch
/branch/:branchId/menu - Browse menu
/cart - Shopping cart
/checkout - Order checkout
/order/:orderId/tracking - Track order
/loyalty - Loyalty program
/my-orders - Order history
/profile - User profile
/profile/settings - Profile settings
/favorites - Saved items
```

### Admin Routes
```
/admin - Dashboard
/admin/currency - Currency management
/admin/languages - Language management
/admin/branches - Branch management
/admin/menu - Menu management
/admin/promotions - Promotions
/admin/loyalty - Loyalty settings
/admin/orders - Order management
/admin/inventory - Inventory management
/admin/analytics - Analytics
```

### Staff Routes
```
/control-panel - Unified role-based dashboard
/manager/* - Manager-specific pages
/waiter/* - Waiter-specific pages
/kds/* - Kitchen Display System
```

### Developer
```
/dev-tools - Mock data management and utilities
```

---

## 🔐 Authentication & Contexts

**User Roles**: Customer, Waiter, Manager, Admin

**Context Providers** (nested order):
```tsx
<AuthProvider>        // /src/app/contexts/AuthContext.tsx
  <AppProvider>       // /src/app/contexts/AppContext.tsx
    <CheckInProvider> // /src/app/contexts/CheckInContext.tsx
      <FavoritesProvider> // /src/app/contexts/FavoritesContext.tsx
```

**State Persistence**: LocalStorage for cart, favorites, currency, language

---

## 🍽️ Core Features

### 1. QR/NFC Table Check-In
- **Page**: `/src/app/pages/TableCheckInPage.tsx`
- **Context**: `/src/app/contexts/CheckInContext.tsx`
- **QR Generator**: `/src/app/components/admin/TableQRCodeGenerator.tsx`
- Quick menu access without waiter

### 2. Menu Management
- **Admin**: `/src/app/pages/admin/AdminMenuManagement.tsx`
- **Manager**: `/src/app/pages/manager/ManagerMenuManagement.tsx`
- **Customer**: `/src/app/pages/MenuPage.tsx`
- **Detail**: `/src/app/pages/MenuItemDetailPage.tsx`

### 3. Cart & Checkout
- **Cart**: `/src/app/pages/CartPage.tsx`
- **Checkout**: `/src/app/pages/CheckoutPage.tsx`
- **Payment**: `/src/app/components/payment/PaymentMethodSelector.tsx`
- **Tips**: `/src/app/components/payment/TipSelector.tsx`

### 4. Promotions
- **Admin**: `/src/app/pages/admin/AdminPromotionsNew.tsx`
- **Customer**: `/src/app/pages/PromotionsPage.tsx`
- **Types**: Percentage, Fixed Amount, BOGO, Free Item

### 5. Inventory
- **Dashboard**: `/src/app/pages/inventory/InventoryDashboard.tsx`
- **List**: `/src/app/pages/inventory/IngredientList.tsx`
- **Detail**: `/src/app/pages/inventory/IngredientDetail.tsx`

### 6. Analytics
- **Admin**: `/src/app/pages/admin/AdminAnalytics.tsx`
- **Manager**: `/src/app/pages/manager/ManagerReports.tsx`
- **Components**: RevenueChart, StatCard

### 7. Reviews
- **Page**: `/src/app/pages/ReviewsPage.tsx`
- **Card**: `/src/app/components/reviews/ReviewCard.tsx`
- **Dialog**: `/src/app/components/reviews/WriteReviewDialog.tsx`

---

## 📚 External Libraries

**Core**:
- react 18.3.1
- react-router 7.13.0
- i18next 25.8.18
- react-i18next 16.5.8

**UI**:
- tailwindcss 4.1.12
- @radix-ui/* (multiple primitives)
- @mui/material 7.3.5
- lucide-react 0.487.0
- motion 12.23.24

**Utilities**:
- react-hook-form 7.55.0
- recharts 2.15.2
- qrcode.react 4.2.0
- date-fns 3.6.0

---

## 🛠️ Developer Tools

**Page**: `/src/app/pages/DevTools.tsx`
**Route**: `/dev-tools`

**Features**:
- Initialize mock orders (15+ samples)
- View order statistics
- Reset database
- Data integrity checks
- Quick data management

---

## 🎯 Control Panel

**Unified Dashboard**: `/src/app/pages/UnifiedControlPanel.tsx`
**Route**: `/control-panel`

**Role-Based Views**:
- **Admin**: Full access to all modules
- **Manager**: Branch-specific management
- **Waiter**: Order creation and management
- **Kitchen**: KDS and order preparation

---

## 📱 Responsive Design

**Layouts**:
- RootLayout: `/src/app/layouts/RootLayout.tsx`
- MobileLayout: `/src/app/layouts/MobileLayout.tsx`
- ProvidersWrapper: `/src/app/layouts/ProvidersWrapper.tsx`

**Navigation**:
- TopNavBar: `/src/app/components/shared/TopNavBar.tsx`
- BottomNav: `/src/app/components/shared/BottomNav.tsx`
- Header: `/src/app/components/shared/Header.tsx`

**Mobile-First**: Touch-optimized, bottom navigation, responsive breakpoints

---

## 🛡️ Error Handling

**Error Boundary**: `/src/app/components/ErrorBoundary.tsx`
- Catches React errors
- User-friendly messages
- Reload functionality

**Loading States**: `/src/app/components/shared/LoadingState.tsx`
**Offline Indicator**: `/src/app/components/shared/OfflineIndicator.tsx`

---

## 🔄 Recent Fixes (March 2026)

### Context Provider Fix
**Issue**: FavoritesProvider using useAuth outside AuthProvider during HMR
**Solution**: 
- Added ErrorBoundary
- Fixed provider nesting order
- Better HMR handling

**Files Modified**:
- `/src/app/layouts/ProvidersWrapper.tsx`
- `/src/app/components/ErrorBoundary.tsx`
- `/src/app/contexts/FavoritesContext.tsx`

---

## 📊 Mock Data Services

**Location**: `/src/app/services/`

**Files**:
- `adminData.ts` - Admin-specific data
- `branchLoyaltyData.ts` - Loyalty program data
- `inventoryData.ts` - Inventory mock data
- `ordersData.ts` - 15+ sample orders with all types/states
- `promotionsData.ts` - Promotion templates

**Database**: `/src/app/lib/database.ts` (in-memory)

---

## 🎨 Brand Guidelines

**Colors**:
```css
--brand-primary: #667c67;      /* Sage Green */
--brand-secondary: #e4dbc4;    /* Warm Beige */
--brand-accent: #8b9d8b;       /* Light Sage */
--brand-dark: #4a5a4b;         /* Dark Green */
```

**Typography**: System fonts, responsive sizing, RTL-aware
**Spacing Scale**: 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96)

---

## 🚀 Getting Started

```bash
# Install
pnpm install

# Run dev server
npm run dev

# Build
npm run build
```

**Access Points**:
- Customer: http://localhost:5173/
- Control Panel: http://localhost:5173/control-panel
- Admin: http://localhost:5173/admin
- Dev Tools: http://localhost:5173/dev-tools

---

## 💡 Common Tasks

### Add New Language
1. Update `/src/app/lib/i18n.ts`
2. Add translations for all keys
3. Test RTL if needed

### Add New Currency
1. Update `/src/app/utils/currency.ts`
2. Add to currency list in `useCurrency` hook
3. Update admin currency page

### Create New Page
1. Create component in `/src/app/pages/`
2. Add route in `/src/app/routes.ts`
3. Import and configure

### Add Translation
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <div>{t('key.path')}</div>;
}
```

### Format Currency
```tsx
import { formatCurrency } from '../utils/currency';

const formatted = formatCurrency(100, 'USD'); // "$100.00"
```

### Use Display Currency
```tsx
import { useDisplayCurrency } from '../hooks/useCurrency';

function Component() {
  const { displayCurrency, setDisplayCurrency, convertPrice } = useDisplayCurrency();
  const convertedPrice = convertPrice(100, 'USD');
}
```

---

## 📖 Key Documentation Files

Available in root directory:
- `ECHEFS_README.md` - Platform overview
- `TECHNICAL_SPECS.md` - Technical details
- `DESIGN_SYSTEM.md` - Design system guide
- `CURRENCY_SYSTEM_README.md` - Currency implementation
- `BRANCH_LOYALTY_SYSTEM.md` - Loyalty details
- `QR_NFC_CHECKIN_GUIDE.md` - Check-in system
- `DEVELOPER_QUICK_REFERENCE.md` - Quick reference
- `ERROR_FIXES.md` - Known fixes

---

## 🎯 Platform Capabilities Summary

✅ **Multi-Language**: 4 languages with RTL support
✅ **Multi-Currency**: 8 currencies with real-time conversion
✅ **Branch Management**: Independent loyalty per branch
✅ **Order System**: Complete order lifecycle management
✅ **QR/NFC**: Table-based quick ordering
✅ **Analytics**: Revenue, customers, inventory insights
✅ **Inventory**: Tracking and auto-ordering
✅ **Promotions**: Multiple promotion types
✅ **Reviews**: Customer feedback system
✅ **KDS**: Kitchen Display System
✅ **Responsive**: Mobile-first design
✅ **Error Handling**: Comprehensive error boundaries

---

## 🔒 Security Notes

**Current**: Client-side authentication, role-based access, input validation
**Future**: When adding backend, implement JWT, rate limiting, HTTPS, CSRF protection

---

## 📞 Platform Info

- **Version**: 3.3.1
- **Last Updated**: March 24, 2026
- **Status**: ✅ Production-ready frontend, requires backend for full deployment

---

## 🧠 Chatbot Instructions

When helping with this project:

1. **File Paths**: Always use absolute paths from `/src/app/`
2. **Imports**: Check existing imports before adding new ones
3. **Styling**: Use Tailwind CSS v4 classes, avoid inline styles
4. **Types**: This is TypeScript - always consider type safety
5. **i18n**: All user-facing text should be translatable
6. **Currency**: Use formatCurrency utility, respect display currency
7. **Context**: Be aware of provider hierarchy
8. **Routes**: Check `/src/app/routes.ts` before adding new routes
9. **Mock Data**: Use existing services for consistent data
10. **RTL**: Consider Arabic RTL layout for UI changes

---

**This is a comprehensive, production-ready restaurant management platform. All features are functional with mock data and ready for backend integration.**
