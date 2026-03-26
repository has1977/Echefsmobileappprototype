# eChefs Platform - Complete Project Documentation

## Project Overview
**Project Name:** eChefs Multi-Branch Restaurant Management Platform  
**Version:** 3.3.5  
**Last Updated:** March 26, 2026  
**Type:** Multi-language, Multi-branch Food Ordering & Restaurant Management Platform

## Brand Identity
- **Primary Color:** `#667c67` (Green)
- **Secondary Color:** `#e4dbc4` (Beige)
- **Design Inspiration:** Uber Eats + Airbnb + Stripe (Modern, Clean, Professional)

## Supported Languages (Dynamic - Managed from Admin Panel)
1. **Arabic (ar)** - RTL Support ✓
2. **English (en)** - Default
3. **Russian (ru)**
4. **Kyrgyz (ky)**
- Languages can be dynamically added/removed from the admin panel
- Full i18n support with react-i18next
- Database-driven translations

## Core Features & Modules

### 1. Quick Ordering System
- **QR Code / NFC** ordering inside restaurants
- Reduces waiter workload
- Increases average order value through promotions
- Real-time kitchen coordination

### 2. Multi-Branch Management
- Centralized branch management
- Branch-specific settings and configurations
- Department management per branch
- Analytics and reporting per branch

### 3. Department Management System
Each branch has customizable departments:
- **Examples:** Bar, Grill, Kitchen, Bakery, etc.
- Dedicated users per department
- Menu items linked to specific departments
- Order routing to appropriate departments
- Department-specific order tracking

### 4. Waiter Management System
**Complete waiter workflow:**
- Assign waiters to specific branches
- Professional order-taking interface
- Table selection (Manual or QR/NFC)
- Automatic order distribution to departments
- Order status tracking
- Customer rating system for waiter service
- Real-time order updates

**Waiter Order Taking Features:**
- ✅ Two-step process: Table Selection → Menu Ordering
- ✅ Multiple view modes: Grid, List, Compact
- ✅ Category filtering with icons
- ✅ Menu type switching (Main, Drinks, Desserts, Kids)
- ✅ Advanced search functionality
- ✅ Badge filtering (Popular, New, Spicy, Vegetarian, etc.)
- ✅ Dietary filtering (Vegan, Gluten-free, Halal, etc.)
- ✅ Real-time cart management
- ✅ Special instructions per item
- ✅ Customer name input
- ✅ Order type selection (Dine-in, Takeaway, Delivery)
- ✅ Language selector (4 languages)
- ✅ Modifiers/Add-ons System:
  - Add extra ingredients with prices
  - Remove unwanted ingredients
  - Multiple modifiers per item
  - Price calculation with modifiers
  - Modifiers saved with cart items
  - Sent to kitchen with order details

### 5. Kitchen Management
- Real-time order display
- Department-based order filtering
- Order status updates
- Preparation time tracking
- Kitchen printer integration ready

### 6. Table Management
- Region-based table organization
- Table status tracking (Available, Occupied, Reserved)
- QR code generation per table
- NFC tag support

### 7. Menu Management
- Multi-language menu items
- Category organization
- Department assignment
- Pricing and availability
- Image management
- Preparation time
- Stock status (In Stock, Low Stock, Out of Stock)
- Dietary tags and badges
- Menu types: Main, Drinks, Desserts, Kids

### 8. Order Management
- Order creation and tracking
- Status workflow (Pending → Preparing → Ready → Served)
- Order history
- Customer feedback
- Special instructions handling

### 9. Analytics & Reporting
- Sales analytics per branch
- Department performance
- Waiter performance metrics
- Popular items tracking
- Revenue reports
- Customer satisfaction scores

### 10. User Roles & Permissions
- **Super Admin:** Full system access
- **Branch Manager:** Branch-level management
- **Department Manager:** Department-specific access
- **Waiter:** Order taking and table management
- **Kitchen Staff:** Order preparation and status updates

## Technical Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Routing:** React Router v6+ (Data Mode with RouterProvider)
- **Styling:** Tailwind CSS v4.0
- **State Management:** React Context API
- **Animation:** Motion (Framer Motion)
- **Icons:** Lucide React
- **i18n:** react-i18next (Database-driven translations)
- **Notifications:** Sonner (Toast notifications)
- **Build Tool:** Vite

### Database Schema (Supabase Ready)
```typescript
// Core Tables Structure

// Branches
branches {
  id: string
  name: string
  name_ar: string
  address: string
  phone: string
  is_active: boolean
  settings: object
}

// Departments
departments {
  id: string
  branch_id: string
  name: string
  name_ar: string
  description: string
  is_active: boolean
}

// Users
users {
  id: string
  name: string
  email: string
  role: string
  branch_id: string
  department_id: string
  is_active: boolean
}

// Menu Items
menu_items {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  price: number
  category: string
  menu_type: 'main' | 'drinks' | 'desserts' | 'kids'
  department_id: string
  branch_id: string
  image_url: string
  preparation_time: number
  badges: string[]
  dietary_tags: string[]
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  available_modifiers: Modifier[]
  is_active: boolean
}

// Modifiers (Add-ons/Removals)
modifiers {
  id: string
  name: string
  name_ar: string
  type: 'add' | 'remove'
  price: number (for add-ons)
  menu_item_id: string
}

// Orders
orders {
  id: string
  order_number: string
  branch_id: string
  table_number: string
  waiter_id: string
  customer_name: string
  order_type: 'dine-in' | 'takeaway' | 'delivery'
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  special_instructions: string
  created_at: timestamp
  updated_at: timestamp
}

// Order Items
order_items {
  id: string
  order_id: string
  menu_item_id: string
  name: string
  name_ar: string
  quantity: number
  price: number
  department_id: string
  special_instructions: string
  modifiers: SelectedModifier[]
  status: string
}

// Tables
tables {
  id: string
  branch_id: string
  table_number: string
  region: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  qr_code: string
}

// Languages (Dynamic)
languages {
  id: string
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
  is_active: boolean
  is_default: boolean
}

// Translations (Dynamic)
translations {
  id: string
  key: string
  language_code: string
  value: string
  category: string
}
```

### Key Technologies & Libraries
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-router": "^7.x",
    "motion": "latest",
    "lucide-react": "latest",
    "sonner": "latest",
    "react-i18next": "latest",
    "i18next": "latest"
  }
}
```

## Application Structure

```
/src
  /app
    /components
      /figma
        - ImageWithFallback.tsx (Protected)
      - [Reusable components]
    /contexts
      - AppContext.tsx (Global state)
      - LanguageContext.tsx (i18n management)
    /lib
      - database.ts (Mock database)
      - types.ts (TypeScript interfaces)
    /pages
      - Dashboard.tsx
      - WaiterOrderTaking.tsx ✅ (Latest: v3.3.5)
      - KitchenDisplay.tsx
      - BranchManagement.tsx
      - DepartmentManagement.tsx
      - MenuManagement.tsx
      - TableManagement.tsx
      - OrderHistory.tsx
      - Settings.tsx
      - LanguageManagement.tsx
    /routes
      - routes.tsx (React Router configuration)
    - App.tsx (Main component with RouterProvider)
  /styles
    - fonts.css (Font imports only)
    - theme.css (Tailwind v4 theme tokens)
  /imports
    - [Figma imported assets]
```

## Design System

### Colors (CSS Variables in theme.css)
```css
--color-primary: #667c67;
--color-secondary: #e4dbc4;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography
- Default font styling in theme.css for h1, h2, h3, etc.
- Use Tailwind classes for overrides only
- Avoid Tailwind font-size, font-weight, line-height classes unless necessary

### Components Style Guide
- **Buttons:** Rounded corners (rounded-xl), shadow-lg, hover states
- **Cards:** White background, border-gray-200, shadow-sm
- **Modals:** Backdrop blur, slide-up animation, rounded-t-3xl
- **Tables:** Hover states, striped rows, sticky headers
- **Forms:** Input groups, validation states, floating labels

### RTL Support
- Full RTL support for Arabic
- Text alignment auto-switches
- Icon positions mirror for RTL
- Layout direction handled by i18n

## Key Features Implementation Status

### ✅ Completed Features
1. Multi-language system (4 languages, database-driven)
2. Department management per branch
3. Waiter order taking system with modifiers
4. Table selection (Manual + QR/NFC ready)
5. Cart management with special instructions
6. Order distribution to departments
7. Menu categorization and filtering
8. Advanced search and filters
9. Language selector modal
10. Modifiers/Add-ons system in order taking
11. Real-time cart updates
12. Order type selection
13. Professional UI inspired by Uber Eats/Airbnb

### 🚧 Planned Features
1. Supabase integration for real data
2. Kitchen display real-time updates
3. Waiter performance analytics
4. Customer rating system
5. QR code generation for tables
6. NFC tag integration
7. Payment integration
8. Receipt printing
9. Inventory management
10. Loyalty program
11. Push notifications
12. Mobile app version (Flutter)

## Important Development Notes

### Protected Files (DO NOT MODIFY)
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

### Image Handling
**Figma Assets:**
```typescript
// Raster images (PNG, JPG)
import img from "figma:asset/abc123.png"

// SVGs
import svgPaths from "../imports/svg-wg56ef214f"
```

**New Images:**
```typescript
import { ImageWithFallback } from './components/figma/ImageWithFallback'
<ImageWithFallback src="..." alt="..." />
```

### Font Imports
- ALL font imports go in `/src/styles/fonts.css` ONLY
- Add imports at the top of the file
- Never add font imports in other CSS files

### Tailwind CSS v4 Guidelines
- Use inline Tailwind classes for overrides
- Base styles in `/src/styles/theme.css`
- No `tailwind.config.js` file (using v4.0)
- Avoid font-size, font-weight, line-height Tailwind classes

### React Router Pattern
- Use Data Mode with `createBrowserRouter`
- RouterProvider in App.tsx
- Route configuration in `/src/app/routes/routes.tsx`

### i18n Pattern
```typescript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()

// Usage
<div>{t('key')}</div>
<div>{i18n.language === 'ar' ? 'نص عربي' : 'English text'}</div>

// Change language
i18n.changeLanguage('ar')
```

### Database Pattern (Mock → Supabase Migration Ready)
```typescript
import db from '../lib/database'

// Current: Mock data
const branches = db.getBranches()

// Future: Supabase
const { data: branches } = await supabase
  .from('branches')
  .select('*')
```

## Performance Optimization

### Best Practices
1. **Lazy loading:** Use React.lazy for route components
2. **Memoization:** useMemo, useCallback for expensive operations
3. **Virtual scrolling:** For long lists of menu items
4. **Image optimization:** WebP format, lazy loading
5. **Bundle splitting:** Code splitting per route
6. **Caching:** Service worker for offline support

### Target Metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s
- **API Response Time:** < 200ms

## Security & Compliance

### Authentication
- Role-based access control (RBAC)
- JWT tokens for API authentication
- Session management
- Password hashing (bcrypt)

### Data Protection
- HTTPS only
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting

### PCI Compliance (Future)
- Never store card data
- Use Stripe hosted checkout
- PCI DSS compliance for payment processing

### GDPR Compliance
- Data residency controls
- User consent management
- Right to deletion
- Data export functionality
- Privacy policy
- Cookie consent

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Function/utility testing with Jest
- Mock API responses

### Integration Tests
- Route navigation
- Form submissions
- API integrations
- State management

### E2E Tests
- Critical user flows
- Order placement
- Payment processing
- Multi-language support

## Deployment

### Environment Setup
```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Environment Variables
```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLIC_KEY=
```

### Deployment Targets
- **Development:** Local/Staging
- **Production:** Vercel/Netlify/Cloud Run
- **CDN:** Cloudflare for static assets

## Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- Console error logging
- API error tracking

### Analytics
- User behavior tracking
- Order completion rates
- Popular menu items
- Revenue analytics
- Waiter performance metrics

### Performance Monitoring
- Web Vitals tracking
- API response times
- Database query performance
- Real-time order updates latency

## Migration Path to Production

### Phase 1: Current (Frontend Only)
- ✅ Complete UI/UX
- ✅ Mock data system
- ✅ Multi-language support
- ✅ Full feature set

### Phase 2: Backend Integration
- [ ] Supabase setup
- [ ] Database migration
- [ ] Authentication system
- [ ] Real-time subscriptions
- [ ] API integration

### Phase 3: Advanced Features
- [ ] Payment integration
- [ ] Kitchen display real-time
- [ ] Mobile app (Flutter)
- [ ] Analytics dashboard
- [ ] Customer app

### Phase 4: Scale & Optimize
- [ ] Performance optimization
- [ ] Load testing
- [ ] CDN setup
- [ ] Multi-region deployment
- [ ] Advanced analytics

## Support & Maintenance

### Version History
- **v3.3.5** - Current: Waiter Order Taking with Modifiers System
- **v3.3.0** - Department Management System
- **v3.2.0** - Multi-language Dynamic System
- **v3.1.0** - Waiter Management System
- **v3.0.0** - Core Platform Launch

### Known Issues
- None in current version

### Future Enhancements
1. Voice ordering
2. AI-powered recommendations
3. Predictive inventory
4. Advanced analytics with ML
5. Customer loyalty program
6. Social media integration
7. Third-party delivery integration (Uber Eats, etc.)
8. Multi-currency support
9. Tax calculation per region
10. Advanced reporting & BI

## Contact & Team
- **Project Manager:** [TBD]
- **Lead Developer:** [TBD]
- **Design Lead:** [TBD]
- **QA Lead:** [TBD]

---

**This documentation serves as the complete reference for the eChefs platform and should be updated with each major version release.**

**Last Updated:** March 26, 2026 | **Build Version:** 3.3.5
