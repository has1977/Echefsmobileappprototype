# eChefs Platform - Technical Skills & Implementation Details

## Core Technologies & Expertise Required

### 1. Frontend Development

#### React & TypeScript
```typescript
// Component Pattern Used
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export function ComponentName() {
  const [state, setState] = useState<Type>(initialValue)
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  return <div>...</div>
}

// Default export required for App.tsx
export default App
```

#### React Router v6+ (Data Mode)
```typescript
// routes.tsx
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "waiter/order/:tableId?", Component: WaiterOrderTaking },
      { path: "kitchen", Component: KitchenDisplay },
      { path: "*", Component: NotFound },
    ],
  },
])

// App.tsx
import { RouterProvider } from 'react-router'
import { router } from './routes'

function App() {
  return <RouterProvider router={router} />
}
```

#### State Management (Context API)
```typescript
// AppContext.tsx
import { createContext, useContext, useState } from 'react'

interface AppContextType {
  branches: Branch[]
  currentBranch: Branch | null
  setCurrentBranch: (branch: Branch) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  
  return (
    <AppContext.Provider value={{ branches, currentBranch, setCurrentBranch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
```

#### Animation (Motion - Framer Motion)
```typescript
import { motion, AnimatePresence } from 'motion/react'

// Install: npm install motion
// Import: import { motion } from 'motion/react'

// Basic Animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// AnimatePresence for mounting/unmounting
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>

// Spring Animation
transition={{ type: 'spring', damping: 25, stiffness: 300 }}

// Stagger Children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div variants={{ hidden: { y: 20 }, show: { y: 0 } }}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

#### Internationalization (i18next)
```typescript
// i18n setup
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ... } },
      ar: { translation: { ... } },
      ru: { translation: { ... } },
      ky: { translation: { ... } }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// Component usage
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()

// Translation
<div>{t('welcome')}</div>

// Language switching
i18n.changeLanguage('ar')

// Current language
i18n.language // 'ar'

// RTL support
<div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

// Conditional text
{i18n.language === 'ar' ? 'نص عربي' : 'English text'}
```

### 2. Styling & Design

#### Tailwind CSS v4.0
```css
/* theme.css - CSS Variables */
@theme {
  --color-primary: #667c67;
  --color-secondary: #e4dbc4;
  --font-sans: system-ui, sans-serif;
}

/* Component usage */
<div className="bg-[#667c67] text-white rounded-xl p-4">
  Styled content
</div>

/* Responsive */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

/* States */
<button className="hover:bg-gray-100 focus:ring-2 active:scale-95">

/* Dark mode */
<div className="bg-white dark:bg-gray-900">

/* RTL support */
<div className="ml-4 rtl:mr-4 rtl:ml-0">
```

#### Design Patterns
```typescript
// Card Component
<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
  <div className="p-6">Content</div>
</div>

// Button Primary
<button className="px-6 py-3 bg-[#667c67] text-white rounded-xl font-bold hover:bg-[#556856] transition-colors shadow-lg">
  Click Me
</button>

// Button Secondary
<button className="px-6 py-3 bg-white border-2 border-[#667c67] text-[#667c67] rounded-xl font-bold hover:bg-[#667c67]/5 transition-colors">
  Secondary
</button>

// Input Field
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#667c67] focus:outline-none transition-colors"
  placeholder="Enter text..."
/>

// Modal Backdrop
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
  <div className="bg-white rounded-t-3xl">Modal Content</div>
</div>
```

### 3. TypeScript Patterns

#### Type Definitions
```typescript
// Basic Types
type MenuType = 'main' | 'drinks' | 'desserts' | 'kids'
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

// Interfaces
interface MenuItem {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  price: number
  category: string
  menu_type: MenuType
  department_id?: string
  image_url?: string
  preparation_time: number
  badges?: string[]
  dietary_tags?: string[]
  stock_status: StockStatus
  available_modifiers?: Modifier[]
}

interface Modifier {
  id: string
  name: string
  name_ar: string
  type: 'add' | 'remove'
  price?: number
}

interface CartItem extends MenuItem {
  menu_item_id: string
  quantity: number
  special_instructions?: string
  modifiers?: SelectedModifier[]
}

// Extending interfaces
interface SelectedModifier extends Modifier {
  quantity?: number
}

// Generic types
interface ApiResponse<T> {
  data: T
  error: string | null
  success: boolean
}

// Function types
type FilterFunction = (item: MenuItem) => boolean
type SortFunction = (a: MenuItem, b: MenuItem) => number
```

### 4. Component Patterns

#### Custom Hooks
```typescript
// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  
  return [value, setValue] as const
}

// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  
  return matches
}
```

#### Modal Pattern
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-black">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 5. Data Management

#### Mock Database Pattern
```typescript
// database.ts
class Database {
  private branches: Branch[] = []
  private menuItems: MenuItem[] = []
  private orders: Order[] = []
  
  // CRUD operations
  getBranches(): Branch[] {
    return this.branches
  }
  
  getBranchById(id: string): Branch | undefined {
    return this.branches.find(b => b.id === id)
  }
  
  createBranch(branch: Omit<Branch, 'id'>): Branch {
    const newBranch = { ...branch, id: `branch-${Date.now()}` }
    this.branches.push(newBranch)
    return newBranch
  }
  
  updateBranch(id: string, updates: Partial<Branch>): Branch | null {
    const index = this.branches.findIndex(b => b.id === id)
    if (index === -1) return null
    this.branches[index] = { ...this.branches[index], ...updates }
    return this.branches[index]
  }
  
  deleteBranch(id: string): boolean {
    const index = this.branches.findIndex(b => b.id === id)
    if (index === -1) return false
    this.branches.splice(index, 1)
    return true
  }
  
  // Complex queries
  getMenuItemsByCategory(category: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === category)
  }
  
  searchMenuItems(query: string): MenuItem[] {
    const lowerQuery = query.toLowerCase()
    return this.menuItems.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.name_ar.includes(query) ||
      item.description.toLowerCase().includes(lowerQuery)
    )
  }
}

export default new Database()
```

#### Supabase Integration (Future)
```typescript
// supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

// CRUD operations
export async function getBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
  
  if (error) throw error
  return data
}

export async function createOrder(order: Omit<Order, 'id'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export function subscribeToOrders(callback: (order: Order) => void) {
  return supabase
    .channel('orders')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => callback(payload.new as Order)
    )
    .subscribe()
}

// Authentication
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}
```

### 6. Advanced Patterns

#### Cart Management
```typescript
// Cart state management
const [cart, setCart] = useState<CartItem[]>([])

// Add to cart
function addToCart(item: MenuItem, modifiers: SelectedModifier[]) {
  const existingIndex = cart.findIndex(ci => 
    ci.menu_item_id === item.id &&
    JSON.stringify(ci.modifiers) === JSON.stringify(modifiers)
  )
  
  if (existingIndex !== -1) {
    // Update quantity
    const newCart = [...cart]
    newCart[existingIndex].quantity += 1
    setCart(newCart)
  } else {
    // Add new item
    const cartItem: CartItem = {
      ...item,
      menu_item_id: item.id,
      quantity: 1,
      modifiers,
    }
    setCart([...cart, cartItem])
  }
}

// Update quantity
function updateQuantity(index: number, newQuantity: number) {
  if (newQuantity <= 0) {
    removeFromCart(index)
  } else {
    const newCart = [...cart]
    newCart[index].quantity = newQuantity
    setCart(newCart)
  }
}

// Remove from cart
function removeFromCart(index: number) {
  setCart(cart.filter((_, i) => i !== index))
}

// Calculate total
function calculateTotal(): number {
  return cart.reduce((sum, item) => {
    const modifiersTotal = (item.modifiers || [])
      .filter(m => m.type === 'add' && m.price)
      .reduce((mSum, m) => mSum + (m.price! * (m.quantity || 1)), 0)
    
    return sum + ((item.price + modifiersTotal) * item.quantity)
  }, 0)
}

// Clear cart
function clearCart() {
  setCart([])
}
```

#### Filter & Search Logic
```typescript
// Multi-level filtering
const filteredItems = useMemo(() => {
  let items = menuItems
  
  // Menu type filter
  if (currentMenuType !== 'all') {
    items = items.filter(item => item.menu_type === currentMenuType)
  }
  
  // Category filter
  if (selectedCategory !== 'all') {
    items = items.filter(item => item.category === selectedCategory)
  }
  
  // Search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.name_ar.includes(searchQuery) ||
      item.description.toLowerCase().includes(query)
    )
  }
  
  // Badge filters
  if (selectedFilters.badges.length > 0) {
    items = items.filter(item =>
      selectedFilters.badges.some(badge => item.badges?.includes(badge))
    )
  }
  
  // Dietary filters
  if (selectedFilters.dietary.length > 0) {
    items = items.filter(item =>
      selectedFilters.dietary.some(tag => item.dietary_tags?.includes(tag))
    )
  }
  
  // Price range filter
  if (selectedFilters.priceRange) {
    const [min, max] = selectedFilters.priceRange.split('-').map(Number)
    items = items.filter(item => item.price >= min && item.price <= max)
  }
  
  return items
}, [menuItems, currentMenuType, selectedCategory, searchQuery, selectedFilters])
```

#### Debounced Search
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [debouncedSearch, setDebouncedSearch] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery)
  }, 300)
  
  return () => clearTimeout(timer)
}, [searchQuery])

// Use debouncedSearch for filtering
const filteredItems = menuItems.filter(item =>
  item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
)
```

### 7. Notifications (Sonner)
```typescript
import { toast } from 'sonner'

// Success
toast.success('Order placed successfully')

// Error
toast.error('Failed to submit order')

// Info
toast.info('Table 5 is now available')

// Warning
toast.warning('Low stock on item X')

// Custom
toast.custom((t) => (
  <div className="bg-white p-4 rounded-xl shadow-lg">
    Custom notification content
  </div>
))

// Promise
toast.promise(
  submitOrder(),
  {
    loading: 'Submitting order...',
    success: 'Order submitted!',
    error: 'Failed to submit order'
  }
)

// With action
toast.success('Order ready!', {
  action: {
    label: 'View',
    onClick: () => navigate('/orders')
  }
})
```

### 8. Performance Optimization

#### React Optimization
```typescript
// useMemo for expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => b.price - a.price)
}, [items])

// useCallback for stable function references
const handleSubmit = useCallback((data: FormData) => {
  submitOrder(data)
}, [submitOrder])

// React.memo for preventing re-renders
const MenuItem = React.memo(({ item }: { item: MenuItem }) => {
  return <div>{item.name}</div>
}, (prev, next) => prev.item.id === next.item.id)

// Lazy loading
const AdminPanel = lazy(() => import('./pages/AdminPanel'))

<Suspense fallback={<Loading />}>
  <AdminPanel />
</Suspense>
```

#### List Optimization
```typescript
// Use keys properly
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Virtual scrolling for long lists (react-window)
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

### 9. Error Handling

#### Try-Catch Pattern
```typescript
async function submitOrder(order: Order) {
  try {
    const response = await api.createOrder(order)
    toast.success('Order submitted successfully')
    return response
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    console.error('Order submission error:', error)
    throw error
  }
}
```

#### Error Boundary
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>
    }
    
    return this.props.children
  }
}
```

### 10. Testing Patterns

#### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { MenuItem } from './MenuItem'

describe('MenuItem', () => {
  it('renders item name', () => {
    const item = { id: '1', name: 'Pizza', price: 10 }
    render(<MenuItem item={item} />)
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })
  
  it('calls onAdd when button clicked', () => {
    const onAdd = jest.fn()
    const item = { id: '1', name: 'Pizza', price: 10 }
    render(<MenuItem item={item} onAdd={onAdd} />)
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(onAdd).toHaveBeenCalledWith(item)
  })
})
```

## Build & Deployment

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MOCK=true

# .env.production
VITE_API_URL=https://api.echefs.com
VITE_ENABLE_MOCK=false
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

## Code Quality Standards

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

---

**This document contains all technical skills and patterns used in the eChefs platform for seamless continuation in other development environments.**

**Last Updated:** March 26, 2026
