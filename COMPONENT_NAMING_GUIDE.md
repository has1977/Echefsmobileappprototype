# eChefs Component Naming Conventions

## 📋 **Purpose**

This guide establishes consistent naming patterns for all components, files, and design tokens in the eChefs platform, following BEM-like methodology adapted for React and Figma.

---

## 🎯 **General Principles**

1. **Be Descriptive**: Names should clearly indicate purpose
2. **Be Consistent**: Follow the same pattern across all files
3. **Be Hierarchical**: Structure reflects component relationships
4. **Be Scalable**: Easy to extend and maintain

---

## 📁 **File Naming**

### **React Components**
```
Format: PascalCase
Pattern: ComponentName.tsx

Examples:
✅ Button.tsx
✅ MenuItemCard.tsx
✅ PaymentMethodSelector.tsx
✅ QRCodeDisplay.tsx

❌ button.tsx (wrong case)
❌ menu-item-card.tsx (wrong format)
❌ PaymentSelector.tsx (not descriptive enough)
```

### **Utility Files**
```
Format: kebab-case
Pattern: utility-name.ts

Examples:
✅ design-tokens.ts
✅ api-client.ts
✅ format-currency.ts

❌ designTokens.ts (wrong case)
❌ APIClient.ts (acronym in PascalCase)
```

### **Style Files**
```
Format: kebab-case
Pattern: style-name.css

Examples:
✅ theme.css
✅ fonts.css
✅ animations.css
```

---

## 🧩 **Component Structure**

### **Atomic Components** (Lowest Level)
```
Pattern: element-name/variant/size/state

Examples:
Button/Primary/Medium/Default
Button/Primary/Medium/Hover
Button/Primary/Medium/Disabled
Input/Text/Large/Focus
Badge/Success/Small/Default
```

### **Composite Components** (Combined Atoms)
```
Pattern: composite-name/variant

Examples:
MenuItemCard/Default
MenuItemCard/Compact
ReviewCard/WithResponse
LoyaltyCard/Gold
PaymentMethodSelector/Default
```

### **Pattern Components** (Complex Layouts)
```
Pattern: pattern-name/layout-variant

Examples:
ProductGrid/TwoColumn
ProductGrid/ThreeColumn
TableMap/SmallVenue
TableMap/LargeVenue
OrderList/Compact
OrderList/Detailed
```

---

## 🎨 **Design Token Naming**

### **Color Tokens**
```
Pattern: color-category-variant

Examples:
--color-primary
--color-primary-dark
--color-primary-light
--color-text-primary
--color-text-secondary
--color-surface-elevated
--color-border-focus
--color-state-hover
```

### **Spacing Tokens**
```
Pattern: spacing-value

Examples:
--spacing-1   (4px)
--spacing-2   (8px)
--spacing-4   (16px)
--spacing-8   (32px)
```

### **Typography Tokens**
```
Pattern: category-property-value

Examples:
--font-size-base
--font-size-lg
--font-weight-medium
--font-weight-bold
--line-height-normal
--line-height-tight
```

### **Shadow Tokens**
```
Pattern: shadow-intensity

Examples:
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
```

### **Radius Tokens**
```
Pattern: radius-size

Examples:
--radius-sm
--radius-md
--radius-lg
--radius-full
```

---

## 📦 **Component Props**

### **Boolean Props**
```
Pattern: is/has/show/enable + Description

Examples:
✅ isOpen
✅ hasError
✅ showBadge
✅ enableAnimation
✅ isLoading
✅ isDisabled

❌ open (not descriptive)
❌ error (ambiguous)
❌ badge (unclear)
```

### **Event Handler Props**
```
Pattern: on + Action

Examples:
✅ onClick
✅ onChange
✅ onSubmit
✅ onClose
✅ onHover
✅ onFocus

❌ handleClick (implementation detail)
❌ click (not clear it's a handler)
```

### **Render Props**
```
Pattern: render + Element

Examples:
✅ renderHeader
✅ renderFooter
✅ renderItem
✅ renderEmpty
```

### **Size/Variant Props**
```
Pattern: size | variant

Examples:
size: 'sm' | 'md' | 'lg'
variant: 'primary' | 'secondary' | 'ghost'
color: 'success' | 'warning' | 'error'
```

---

## 🏷️ **Class Names (CSS)**

### **Tailwind Classes**
```
Pattern: Use utility classes directly

Examples:
✅ "flex items-center gap-4"
✅ "bg-primary text-white rounded-lg"
✅ "hover:bg-primary/90 transition-colors"

❌ Custom class names when Tailwind exists
```

### **Custom CSS Classes** (When Necessary)
```
Pattern: component__element--modifier

Examples:
✅ menu-card__image
✅ menu-card__image--rounded
✅ button--loading
✅ loyalty-card--gold

❌ menuCardImage (use BEM)
❌ btn-load (abbreviated)
```

---

## 📂 **Directory Structure**

```
/src
  /app
    /components
      /shared              ← Used across all pages
        Logo.tsx
        Header.tsx
        BottomNav.tsx
        PageContainer.tsx
        OfflineIndicator.tsx
        
      /menu                ← Domain-specific
        MenuItemCard.tsx
        CategoryFilter.tsx
        
      /reviews
        ReviewCard.tsx
        WriteReviewDialog.tsx
        
      /table
        TableMap.tsx
        QRCodeDisplay.tsx
        
      /payment
        PaymentMethodSelector.tsx
        TipSelector.tsx
        
      /loyalty
        LoyaltyCard.tsx
        RewardsHistory.tsx
        
      /analytics
        RevenueChart.tsx
        StatCard.tsx
        
      /ui                  ← Atomic components
        button.tsx
        input.tsx
        card.tsx
        badge.tsx
        ...
        
    /pages
      WelcomePage.tsx
      BranchSelectionPage.tsx
      MenuPage.tsx
      CartPage.tsx
      ...
      
    /lib
      design-tokens.ts
      i18n.ts
      types.ts
      utils.ts
      
  /styles
    theme.css
    fonts.css
```

---

## 🔤 **Variable Naming**

### **Constants**
```
Pattern: SCREAMING_SNAKE_CASE

Examples:
✅ const MAX_CART_ITEMS = 99;
✅ const API_BASE_URL = 'https://api.echefs.com';
✅ const DEFAULT_LANGUAGE = 'en';

❌ const maxCartItems = 99; (not constant style)
```

### **Functions**
```
Pattern: camelCase, verb + noun

Examples:
✅ function formatCurrency(amount: number)
✅ function validateEmail(email: string)
✅ function fetchMenuItems(branchId: string)
✅ function calculateTotal(items: CartItem[])

❌ function currency(amount) (missing verb)
❌ function CheckEmail(email) (wrong case)
```

### **React Hooks**
```
Pattern: use + Description

Examples:
✅ function useAuth()
✅ function useCart()
✅ function useLocalStorage(key: string)
✅ function useDebounce(value: string, delay: number)

❌ function getAuth() (not hook pattern)
❌ function cartHook() (wrong order)
```

### **TypeScript Interfaces/Types**
```
Pattern: PascalCase

Examples:
✅ interface MenuItem { }
✅ type PaymentMethod = 'cash' | 'card' | 'qr';
✅ interface UserProfile { }

❌ interface menuItem { } (wrong case)
❌ type payment_method (wrong case)
```

---

## 🎭 **Component Variants**

### **Variant Naming**
```
Pattern: descriptive-name

Examples:
Button Variants:
  - primary
  - secondary
  - ghost
  - destructive
  - outline

Card Variants:
  - default
  - elevated
  - interactive
  - compact

Badge Variants:
  - success
  - warning
  - error
  - info
  - default
```

### **Size Naming**
```
Standard Sizes:
  - xs (extra small)
  - sm (small)
  - md (medium) ← default
  - lg (large)
  - xl (extra large)

Examples:
✅ size="sm"
✅ size="md"
✅ size="lg"

❌ size="tiny" (use xs)
❌ size="huge" (use xl)
```

---

## 🌐 **Translation Keys**

### **Pattern**
```
Format: namespace.category.key

Examples:
✅ common.cancel
✅ common.save
✅ nav.home
✅ nav.menu
✅ menu.addToCart
✅ cart.subtotal
✅ payment.paymentMethod
✅ reviews.writeReview

❌ cancelButton (no namespace)
❌ home (too generic)
```

### **Nested Keys**
```
Format: namespace.parent.child

Examples:
✅ orderStatus.received
✅ orderStatus.preparing
✅ orderStatus.ready
✅ paymentMethods.cash
✅ paymentMethods.card
```

---

## 📊 **State Management**

### **State Variables**
```
Pattern: descriptive + State/Loading/Error suffix

Examples:
✅ const [isOpen, setIsOpen] = useState(false);
✅ const [isLoading, setIsLoading] = useState(false);
✅ const [error, setError] = useState(null);
✅ const [menuItems, setMenuItems] = useState([]);

❌ const [open, setOpen] (not clear boolean)
❌ const [loading, setLoading] (missing 'is')
```

---

## 🎯 **API Endpoints**

### **REST API Pattern**
```
Format: /api/version/resource/action

Examples:
✅ GET  /api/v1/menu/items
✅ POST /api/v1/orders
✅ GET  /api/v1/orders/:id
✅ PUT  /api/v1/orders/:id/status
✅ GET  /api/v1/branches/:id/tables

❌ /getMenuItems (not RESTful)
❌ /menu-items (inconsistent casing)
```

---

## ✅ **Naming Checklist**

Before committing code, verify:

- [ ] Component names are PascalCase
- [ ] File names match component names
- [ ] Props follow naming conventions
- [ ] CSS classes use BEM or Tailwind
- [ ] Variables are camelCase
- [ ] Constants are SCREAMING_SNAKE_CASE
- [ ] Translation keys are namespaced
- [ ] Design tokens follow token-category-variant pattern
- [ ] No abbreviations (except common: URL, API, ID, QR, NFC)
- [ ] Names are descriptive and clear

---

## 🚫 **Common Mistakes to Avoid**

```
❌ btn instead of Button
❌ handleClick instead of onClick (in props)
❌ MenuItem instead of MenuItemCard (not specific)
❌ data instead of menuItems (too generic)
❌ temp instead of temporaryValue (abbreviated)
❌ x instead of closeButton (unclear)
❌ info instead of userInformation (ambiguous)
❌ utils instead of formatUtils (too broad)
```

---

## 📚 **Examples from eChefs**

### **Good Examples**
```typescript
// Component
export function MenuItemCard({ item, onAdd }: MenuItemCardProps)

// Props interface
interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  showBadges?: boolean;
  isCompact?: boolean;
}

// State
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
const [isProcessing, setIsProcessing] = useState(false);

// Constants
const MAX_QUANTITY = 99;
const DEFAULT_TIP_PERCENTAGE = 15;

// Functions
function calculateDiscountedPrice(price: number, discount: number): number
function formatCurrency(amount: number, currency: string): string

// Translation keys
t('menu.addToCart')
t('payment.selectMethod')
t('loyalty.points')
```

---

## 🎉 **Summary**

Consistent naming makes code:
- **Readable**: Easy to understand at a glance
- **Maintainable**: Changes are straightforward
- **Scalable**: New components fit naturally
- **Professional**: Shows attention to detail

Follow these conventions and your codebase will be clean, organized, and developer-friendly! 🚀
