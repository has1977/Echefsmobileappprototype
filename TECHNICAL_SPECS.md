# eChefs - Technical Specifications

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
5. [Component Library](#component-library)
6. [State Management](#state-management)
7. [Routing Architecture](#routing-architecture)
8. [Styling System](#styling-system)
9. [Performance Optimization](#performance-optimization)
10. [Security Considerations](#security-considerations)

---

## 🛠️ Technology Stack

### Core Technologies
```json
{
  "framework": "React 18.3+",
  "language": "TypeScript 5.0+",
  "buildTool": "Vite 5.0+",
  "packageManager": "pnpm",
  "nodeVersion": "18.0+"
}
```

### Key Dependencies
```json
{
  "react": "^18.3.1",
  "react-router": "^7.0.0",
  "tailwindcss": "^4.0.0",
  "motion": "^11.0.0",
  "i18next": "^23.0.0",
  "react-i18next": "^14.0.0",
  "lucide-react": "^0.400.0",
  "recharts": "^2.12.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.5.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "eslint": "^9.0.0",
  "prettier": "^3.0.0"
}
```

---

## 📁 Project Structure

```
eChefs/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/             # Base UI components (buttons, cards, etc.)
│   │   │   ├── layout/         # Layout components
│   │   │   └── features/       # Feature-specific components
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin dashboard pages (16 pages)
│   │   │   ├── customer/       # Customer ordering pages
│   │   │   ├── waiter/         # Waiter interface pages
│   │   │   └── kitchen/        # Kitchen display pages
│   │   │
│   │   ├── services/           # Business logic layer
│   │   │   ├── adminData.ts    # Admin data & operations
│   │   │   ├── inventoryService.ts  # Inventory management
│   │   │   └── orderService.ts # Order processing
│   │   │
│   │   ├── types/              # TypeScript type definitions
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── i18n/               # Internationalization config
│   │   ├── routes.ts           # Route configuration
│   │   └── App.tsx             # Root component
│   │
│   ├── styles/                 # Global styles
│   │   ├── theme.css           # Design tokens & theme
│   │   ├── brand-utilities.css # Brand utility classes
│   │   ├── animations.css      # Animation definitions
│   │   ├── fonts.css           # Font imports
│   │   ├── tailwind.css        # Tailwind imports
│   │   └── index.css           # Style orchestration
│   │
│   ├── imports/                # Figma imports (SVGs, assets)
│   └── main.tsx                # Application entry point
│
├── public/                     # Static assets
├── PROJECT_OVERVIEW.md         # Project documentation
├── TECHNICAL_SPECS.md          # This file
├── DEVELOPER_GUIDE.md          # Development guide
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite configuration
```

---

## 🗄️ Data Models

### Core Entities

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super-admin' | 'manager' | 'waiter' | 'kitchen' | 'customer';
  branchId?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}
```

#### Branch
```typescript
interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  managerId: string;
  settings: {
    currency: string;
    timezone: string;
    taxRate: number;
  };
}
```

#### MenuItem
```typescript
interface MenuItem {
  id: string;
  name: Record<string, string>; // Multi-language
  description: Record<string, string>;
  category: string;
  price: number;
  image?: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
  }[];
  modifiers?: MenuModifier[];
  available: boolean;
  branchIds: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
```

#### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  tableId?: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}
```

#### Ingredient
```typescript
interface Ingredient {
  id: string;
  name: Record<string, string>;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  cost: number;
  supplier?: string;
  branchId: string;
  lastRestocked?: Date;
  autoReorder: boolean;
}
```

#### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  orderCount: number;
  lastVisit?: Date;
  joinedDate: Date;
  preferences?: {
    allergies?: string[];
    favoriteItems?: string[];
  };
}
```

#### Notification
```typescript
interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'system' | 'promotion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  recipientId: string;
  branchId?: string;
}
```

#### LoyaltyGift
```typescript
interface LoyaltyGift {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  pointsCost: number;
  image?: string;
  category: string;
  stock: number;
  active: boolean;
  requiredTier?: string;
}
```

---

## 🔌 API Endpoints (Ready for Backend Integration)

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Branches
```
GET    /api/branches
GET    /api/branches/:id
POST   /api/branches
PUT    /api/branches/:id
DELETE /api/branches/:id
GET    /api/branches/:id/stats
```

### Menu Management
```
GET    /api/menu/items
GET    /api/menu/items/:id
POST   /api/menu/items
PUT    /api/menu/items/:id
DELETE /api/menu/items/:id
GET    /api/menu/categories
POST   /api/menu/categories
```

### Orders
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id/status
DELETE /api/orders/:id
GET    /api/orders/branch/:branchId
GET    /api/orders/stats
```

### Inventory
```
GET    /api/inventory/ingredients
GET    /api/inventory/ingredients/:id
POST   /api/inventory/ingredients
PUT    /api/inventory/ingredients/:id
POST   /api/inventory/restock
GET    /api/inventory/alerts
GET    /api/inventory/usage-history
```

### Customers
```
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
GET    /api/customers/:id/orders
POST   /api/customers/:id/loyalty-points
```

### Analytics
```
GET    /api/analytics/sales
GET    /api/analytics/revenue
GET    /api/analytics/top-items
GET    /api/analytics/customer-behavior
GET    /api/analytics/branch-comparison
```

### Notifications
```
GET    /api/notifications
POST   /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
POST   /api/notifications/broadcast
```

### Loyalty & Promotions
```
GET    /api/loyalty/gifts
POST   /api/loyalty/gifts
GET    /api/loyalty/tiers
GET    /api/promotions
POST   /api/promotions
PUT    /api/promotions/:id
```

---

## 🎨 Component Library

### Base UI Components

#### Button Component
```typescript
interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### Card Component
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}
```

#### Input Component
```typescript
interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
}
```

### Feature Components

#### OrderCard
```typescript
interface OrderCardProps {
  order: Order;
  onStatusChange?: (status: Order['status']) => void;
  onView?: () => void;
  compact?: boolean;
}
```

#### MenuItemCard
```typescript
interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
  onEdit?: () => void;
  viewMode?: 'grid' | 'list';
}
```

#### InventoryAlert
```typescript
interface InventoryAlertProps {
  ingredient: Ingredient;
  onRestock?: () => void;
  onDismiss?: () => void;
}
```

---

## 🔄 State Management

### Context Providers

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
```

#### CartContext
```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
```

#### LanguageContext
```typescript
interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: Language[];
  changeLanguage: (code: string) => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}
```

---

## 🛣️ Routing Architecture

### Route Configuration
```typescript
// /src/app/routes.ts
const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      
      // Customer Routes
      {
        path: 'menu',
        Component: CustomerMenu,
      },
      {
        path: 'order',
        Component: OrderSummary,
      },
      
      // Admin Routes
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'branches', Component: AdminBranches },
          { path: 'branches/:branchId', Component: BranchEditor },
          { path: 'menu', Component: AdminMenu },
          { path: 'inventory', Component: InventoryDashboard },
          { path: 'inventory/ingredients', Component: IngredientList },
          { path: 'inventory/ingredients/:id', Component: IngredientDetail },
          { path: 'orders', Component: AdminOrders },
          { path: 'customers', Component: AdminCustomers },
          { path: 'gifts', Component: AdminGifts },
          { path: 'notifications', Component: AdminNotifications },
          { path: 'table-management', Component: AdminTableManagement },
          { path: 'users', Component: AdminUsers },
          { path: 'analytics', Component: AdminAnalytics },
          { path: 'promotions', Component: AdminPromotions },
          { path: 'loyalty', Component: AdminLoyalty },
          { path: 'languages', Component: AdminLanguages },
          { path: 'settings', Component: AdminSettings },
          { path: 'brand-guide', Component: BrandGuide },
          { path: 'data-test', Component: DataTest },
        ],
      },
      
      // Control Panel (Unified)
      {
        path: 'control-panel',
        Component: ControlPanel,
      },
      
      // Kitchen Routes
      {
        path: 'kitchen',
        Component: KitchenDisplay,
      },
      
      // Waiter Routes
      {
        path: 'waiter',
        Component: WaiterDashboard,
      },
      
      // 404
      { path: '*', Component: NotFound },
    ],
  },
]);
```

---

## 🎨 Styling System

### Design Tokens

#### Colors
```css
/* Primary */
--color-primary-50: #F3F7F3;
--color-primary-200: #CFE3CA;
--color-primary-400: #9FB49A;
--color-primary: #667C67;
--color-primary-600: #546352;
--color-primary-800: #394739;

/* Accent */
--color-accent-50: #FBF8F4;
--color-accent-200: #F0E7D7;
--color-accent: #E4DBC4;
--color-accent-600: #C7B99F;
```

#### Spacing Scale (8pt Grid)
```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
```

#### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-3xl: 32px;
```

#### Shadows
```css
--shadow-sm: 0 1px 3px rgba(102, 124, 103, 0.08);
--shadow-md: 0 4px 8px rgba(102, 124, 103, 0.12);
--shadow-lg: 0 12px 24px rgba(102, 124, 103, 0.14);
--shadow-xl: 0 20px 32px rgba(102, 124, 103, 0.16);
```

### Utility Classes
```css
/* Brand Colors */
.bg-brand-primary { background-color: var(--color-primary); }
.text-brand-primary { color: var(--color-primary); }
.bg-brand-accent { background-color: var(--color-accent); }

/* Gradients */
.bg-gradient-primary { background: var(--gradient-primary); }
.bg-gradient-warm { background: var(--gradient-warm); }

/* Semantic */
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }
```

---

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const InventoryDashboard = lazy(() => import('./pages/admin/InventoryDashboard'));
```

### Image Optimization
```typescript
// Use next-gen formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="..." loading="lazy" />
</picture>
```

### Memoization
```typescript
// Memoize expensive calculations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

### Virtual Scrolling
For large lists (inventory, orders), implement virtual scrolling for better performance.

---

## 🔒 Security Considerations

### Authentication
- JWT token-based authentication
- Secure token storage (httpOnly cookies recommended)
- Token refresh mechanism
- Session timeout handling

### Authorization
- Role-based access control (RBAC)
- Route protection
- API endpoint authorization
- Component-level permissions

### Data Validation
```typescript
// Input sanitization
import { z } from 'zod';

const orderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().positive(),
  })),
  total: z.number().positive(),
});
```

### Best Practices
- XSS prevention (sanitize user inputs)
- CSRF protection
- SQL injection prevention (parameterized queries)
- Rate limiting on API endpoints
- Secure password hashing (bcrypt)
- HTTPS enforcement
- Environment variable protection

---

## 📊 Performance Metrics

### Target Metrics
```
First Contentful Paint (FCP): < 1.5s
Largest Contentful Paint (LCP): < 2.5s
Time to Interactive (TTI): < 3.5s
Cumulative Layout Shift (CLS): < 0.1
First Input Delay (FID): < 100ms
```

### Bundle Size
```
Main bundle: < 200KB (gzipped)
Vendor bundle: < 300KB (gzipped)
Total initial load: < 500KB (gzipped)
```

---

## 🧪 Testing Strategy

### Unit Tests
- Component testing (React Testing Library)
- Service layer testing (Jest)
- Utility function testing

### Integration Tests
- API integration testing
- Route testing
- Context provider testing

### E2E Tests
- Critical user flows (Playwright/Cypress)
- Cross-browser testing
- Mobile responsiveness testing

---

## 📦 Build & Deployment

### Build Commands
```bash
# Development
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Environment Variables
```env
VITE_API_URL=https://api.echefs.com
VITE_API_KEY=your_api_key
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=your_sentry_dsn
```

### Deployment Platforms
- Vercel (recommended)
- Netlify
- AWS Amplify
- Azure Static Web Apps
- Custom server (Nginx + Node)

---

**Last Updated**: March 2026  
**Version**: 2.0  
**Maintained By**: eChefs Development Team
