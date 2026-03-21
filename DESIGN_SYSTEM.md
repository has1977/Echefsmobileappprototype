# eChefs Design System Documentation

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Layout & Grid System](#layout--grid-system)
5. [Accessibility](#accessibility)
6. [Performance Guidelines](#performance-guidelines)
7. [Developer Handoff](#developer-handoff)

---

## 🎨 **Overview**

The eChefs Design System is a comprehensive, production-ready design framework that ensures consistency, scalability, and performance across the entire restaurant ordering platform.

### **Key Principles**
- **Token-Based**: Single source of truth for all design values
- **Component-Driven**: Reusable, atomic components
- **Accessible**: WCAG AA compliant
- **Responsive**: Mobile-first with breakpoints for tablet/desktop
- **Performant**: Optimized for fast loading and smooth interactions
- **Multilingual**: Support for EN, AR (RTL), RU, KY

---

## 🎯 **Design Tokens**

### **Brand Colors**
```css
Primary: #667c67    (Sage Green)
Accent:  #e4dbc4    (Cream)
```

**Contrast Ratios** (WCAG Compliance):
- Primary on White: 4.54:1 (AA ✓)
- Text Primary on Surface: 16.13:1 (AAA ✓)
- Text Secondary on Surface: 4.66:1 (AA ✓)

### **Semantic Colors**
```json
{
  "success": "#16a34a",
  "warning": "#ea580c",
  "error": "#dc2626",
  "info": "#0284c7"
}
```

### **Typography Scale**
```
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Base Size: 16px (1rem)

H1: 1.875rem (30px) - Medium weight
H2: 1.5rem (24px) - Medium weight
H3: 1.25rem (20px) - Medium weight
H4: 1.125rem (18px) - Medium weight
Body: 1rem (16px) - Regular weight
Small: 0.875rem (14px) - Regular weight
Caption: 0.75rem (12px) - Regular weight
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### **Spacing System** (8pt Grid)
```
1:  4px   (0.25rem)
2:  8px   (0.5rem)
3:  12px  (0.75rem)
4:  16px  (1rem)
5:  20px  (1.25rem)
6:  24px  (1.5rem)
8:  32px  (2rem)
10: 40px  (2.5rem)
12: 48px  (3rem)
16: 64px  (4rem)
```

### **Border Radius**
```
sm:  4px   (0.25rem)
md:  8px   (0.5rem)
lg:  12px  (0.75rem)
xl:  16px  (1rem)
2xl: 24px  (1.5rem)
3xl: 32px  (2rem)
full: 9999px (circle)
```

### **Elevation (Shadows)**
```css
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 6px rgba(0,0,0,0.1)
lg:  0 10px 15px rgba(0,0,0,0.1)
xl:  0 20px 25px rgba(0,0,0,0.1)
2xl: 0 25px 50px rgba(0,0,0,0.25)
```

### **Z-Index Layers**
```
base:     0
dropdown: 1000
sticky:   1020
fixed:    1030
overlay:  1040
modal:    1050
popover:  1060
tooltip:  1070
```

---

## 🧩 **Component Library**

### **Atomic Components**

#### **Buttons**
Variants: Primary, Secondary, Tertiary, Ghost, Destructive
Sizes: SM (32px), MD (40px), LG (48px)
States: Default, Hover, Pressed, Disabled, Focus

```tsx
// Usage
<Button variant="primary" size="md">
  Add to Cart
</Button>
```

**Specifications:**
- Minimum touch target: 44x44px
- Border radius: 12px (lg)
- Padding SM: 8px 16px
- Padding MD: 12px 24px
- Padding LG: 16px 32px

#### **Inputs**
Types: Text, Number, Email, Password, Search, Select
States: Default, Focus, Error, Disabled

```tsx
// Usage
<Input 
  type="text" 
  placeholder="Search menu..."
  error={errors.search}
/>
```

#### **Badges**
Variants: Default, Secondary, Success, Warning, Error, Info
Sizes: SM, MD

```tsx
// Usage
<Badge variant="success">New</Badge>
<Badge variant="error">-20%</Badge>
```

### **Composite Components**

#### **Menu Item Card**
- Product image (16:9 aspect ratio)
- Badges (Hot, New, Popular, Discount)
- Star rating (1-5 stars)
- Price display with discount
- Dietary indicators
- Add to cart button

#### **Loyalty Card**
- Tier-based design (Bronze, Silver, Gold)
- Points display
- Progress bar to next tier
- Benefits list
- Member ID

#### **Review Card**
- User avatar
- Star rating
- Review text
- Helpful vote button
- Manager response section

#### **Table Map**
- Visual table layout
- Status indicators (Available, Occupied, Reserved)
- Capacity display
- Region badges

### **Navigation Components**

#### **Bottom Navigation**
- 5 main sections
- Icon + label
- Badge for cart count
- Active state indicator
- Fixed position

#### **Header**
- Logo placement
- Page title
- Language selector
- Notification bell
- Back button (conditional)

---

## 📐 **Layout & Grid System**

### **Breakpoints**
```
Mobile:
  Small:  360px
  Medium: 375px
  Large:  414px

Tablet:
  Small:  768px
  Large:  1024px

Desktop:
  Medium: 1440px
  Large:  1920px
```

### **Container Padding**
```
Mobile:  16px (1rem)
Tablet:  24px (1.5rem)
Desktop: 32px (2rem)
```

### **Grid System**
- 4pt baseline grid
- 8pt spacing system
- Auto-layout for responsive components

---

## ♿ **Accessibility**

### **Touch Targets**
- Minimum: 44x44px
- Recommended: 48x48px
- Spacing between: 8px minimum

### **Color Contrast**
All text meets WCAG AA standards:
- Large text: 3:1 minimum
- Normal text: 4.5:1 minimum
- UI components: 3:1 minimum

### **Keyboard Navigation**
- Tab order follows visual hierarchy
- Focus indicators visible (2px ring)
- Escape closes modals/dialogs

### **Screen Readers**
- ARIA labels on all interactive elements
- Alt text on images
- Semantic HTML structure

### **RTL Support**
- Arabic language full RTL layout
- Mirrored icons and navigation
- Text alignment preserved

---

## ⚡ **Performance Guidelines**

### **Component Optimization**
- Use component instances, not copies
- Limit nesting depth (max 3 levels)
- Flatten complex vectors
- Optimize images (WebP preferred)

### **Asset Export**
```
Icons: SVG (optimized)
Images: WebP/PNG 2x/3x
Logos: SVG with fallback PNG
```

### **File Structure**
```
/public
  /design-tokens.json    ← Token export
  /icons                 ← SVG icon set
  /images                ← Optimized images
  
/src
  /app
    /components          ← Reusable components
    /lib
      /design-tokens.ts  ← TypeScript tokens
  /styles
    /theme.css           ← CSS variables
```

---

## 🚀 **Developer Handoff**

### **Design Tokens Export**
Available in multiple formats:
- **JSON**: `/public/design-tokens.json`
- **TypeScript**: `/src/app/lib/design-tokens.ts`
- **CSS Variables**: `/src/styles/theme.css`

### **Component Props Mapping**

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}
```

#### Card Component
```typescript
interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}
```

### **API Integration Points**

#### Menu Items
```typescript
interface MenuItem {
  id: string;
  name: { [lang: string]: string };
  description: { [lang: string]: string };
  price: number;
  imageUrl: string;
  category: string;
  badges?: ('hot' | 'new' | 'popular' | 'discount')[];
  discount?: number;
  rating?: number;
  reviewCount?: number;
  dietary?: string[];
  available: boolean;
}
```

#### Order
```typescript
interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: 'received' | 'preparing' | 'ready' | 'served' | 'completed';
  tableNumber: number;
  branchId: string;
  timestamp: Date;
}
```

### **Animation Tokens**
```css
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms

--easing-in: cubic-bezier(0.4, 0, 1, 1)
--easing-out: cubic-bezier(0, 0, 0.2, 1)
--easing-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### **State Management**
Component states follow consistent patterns:
- Default
- Hover (8% primary overlay)
- Pressed (12% primary overlay)
- Focus (2px ring)
- Disabled (38% opacity)
- Error (red border + message)

---

## 📚 **Component Variants Table**

| Component | Variants | Sizes | States |
|-----------|----------|-------|--------|
| Button | 5 | 3 (SM, MD, LG) | 5 |
| Input | 6 types | 3 (SM, MD, LG) | 4 |
| Badge | 6 | 2 (SM, MD) | 2 |
| Card | 3 | 3 (SM, MD, LG) | 3 |
| Avatar | 2 | 4 (XS, SM, MD, LG) | 2 |
| Icon | N/A | 4 (XS, SM, MD, LG) | 2 |

---

## 🎨 **Icon Set**

All icons from Lucide React library:
- Home, Menu, Cart, User, Settings
- Star, Heart, Plus, Minus, Check
- Clock, Calendar, MapPin, Phone
- ChevronRight, ChevronLeft, ChevronUp, ChevronDown
- Search, Filter, Sort, Grid, List
- Bell, Message, Info, Alert, Help
- And 50+ more...

---

## 📱 **Mobile-Specific Guidelines**

### Safe Areas
```css
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);
```

### Touch Interactions
- Ripple effect on tap
- Visual feedback within 100ms
- Prevent double-tap zoom
- Touch callout disabled

### Gestures
- Swipe to dismiss modals
- Pull to refresh (where applicable)
- Long press for context menus

---

## 🌍 **Localization Notes**

### Text Expansion
Allow 30-40% expansion for translations:
- Buttons: min-width to prevent overflow
- Cards: flexible height
- Forms: labels above inputs

### RTL Considerations
```css
[dir="rtl"] {
  /* Auto-flip layout */
  /* Mirror icons (except brand assets) */
  /* Right-align text */
}
```

---

## 📊 **Analytics & Metrics**

### Component Usage Tracking
Track which components are most used:
- Button clicks by variant
- Page navigation patterns
- Cart interactions
- Payment method selection

### Performance Metrics
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s
- Lighthouse Score: 90+

---

## ✅ **Checklist for Designers**

- [ ] All components use design tokens
- [ ] Contrast ratios meet WCAG AA
- [ ] Touch targets minimum 44x44px
- [ ] RTL variant created and tested
- [ ] States documented (hover, focus, disabled)
- [ ] Responsive behavior defined
- [ ] Export settings configured
- [ ] Prototypes connected
- [ ] Documentation updated

---

## ✅ **Checklist for Developers**

- [ ] Design tokens imported
- [ ] Component props match specs
- [ ] Accessibility attributes added
- [ ] Keyboard navigation works
- [ ] RTL CSS applied
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Analytics events tracked
- [ ] Performance tested

---

## 📄 **Version History**

**v1.0.0** - Initial Release
- Complete token system
- 40+ components
- RTL support
- Accessibility compliant
- Mobile-first responsive

---

## 🔗 **Resources**

- **Design Tokens**: `/public/design-tokens.json`
- **TypeScript Types**: `/src/app/lib/design-tokens.ts`
- **Component Library**: `/src/app/components/`
- **Theme CSS**: `/src/styles/theme.css`
- **Documentation**: This file

---

## 🎉 **Summary**

The eChefs Design System provides everything needed for a consistent, accessible, and high-performance restaurant ordering platform. All design decisions are token-based, ensuring easy updates and theme variations. Components are built with accessibility, performance, and developer experience in mind.

**Ready for Production** ✅
