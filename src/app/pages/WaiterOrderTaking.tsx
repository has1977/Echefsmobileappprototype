import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, ShoppingCart, X, Check, UtensilsCrossed,
  Coffee, Cake, Users, ChevronLeft, ChevronRight, Send, Trash2, MessageSquare,
  Table2, Grid3x3, List, LayoutGrid, Filter, MapPin, ChevronDown,
  ChevronUp, Edit2, Clock, DollarSign, User, Home, Building2,
  Sparkles, Star, Award, Flame, Leaf, Crown, Package, AlertCircle, Globe,
  Heart, Share2, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import db from '../lib/database';
import type { MenuType } from '../lib/types';

interface Modifier {
  id: string;
  name: string;
  name_ar: string;
  type: 'add' | 'remove';
  price?: number; // For add-ons
}

interface SelectedModifier extends Modifier {
  quantity?: number; // For items like "extra cheese x2"
}

interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  name_ar: string;
  price: number;
  quantity: number;
  special_instructions?: string;
  image_url?: string;
  category: string;
  department_id?: string;
  modifiers?: SelectedModifier[];
}

interface MenuItem {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  image_url?: string;
  category: string;
  menu_type: MenuType;
  department_id?: string;
  preparation_time: number;
  badges?: string[];
  dietary_tags?: string[];
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  available_modifiers?: Modifier[];
}

interface TableRegion {
  id: string;
  name: string;
  icon: string;
  tables: number[];
  color: string;
}

export function WaiterOrderTaking() {
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId?: string }>();
  const { branches } = useApp();
  const { t, i18n } = useTranslation();

  // Step system
  const [currentStep, setCurrentStep] = useState<'table' | 'menu'>('table');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState(tableId || '');
  
  // Menu state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMenuType, setCurrentMenuType] = useState<MenuType>('main');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    badges: string[];
    dietary: string[];
    priceRange: string | null;
  }>({
    badges: [],
    dietary: [],
    priceRange: null,
  });
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  
  // Language and modifiers
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Table regions
  const tableRegions: TableRegion[] = [
    { id: 'indoor', name: 'Indoor Dining', icon: 'home', tables: Array.from({length: 20}, (_, i) => i + 1), color: '#667c67' },
    { id: 'outdoor', name: 'Outdoor Terrace', icon: 'building', tables: Array.from({length: 15}, (_, i) => i + 21), color: '#8b9d8b' },
    { id: 'vip', name: 'VIP Section', icon: 'crown', tables: Array.from({length: 8}, (_, i) => i + 36), color: '#d4af37' },
    { id: 'bar', name: 'Bar Area', icon: 'coffee', tables: Array.from({length: 10}, (_, i) => i + 44), color: '#a67c52' },
  ];

  useEffect(() => {
    loadMenuItems();
    loadCategories();
    loadLanguages();
  }, []);

  const loadLanguages = () => {
    const languages = db.getLanguages();
    const enabledLanguages = languages.filter(lang => lang.enabled);
    setAvailableLanguages(enabledLanguages);
  };

  const loadMenuItems = () => {
    const saved = localStorage.getItem('echefs_menu_items');
    if (saved) {
      const items = JSON.parse(saved);
      // Check if we have enough items, if not reload defaults
      if (items.length < 10) {
        console.log('⚠️ Not enough menu items in localStorage, loading defaults...');
        // Fall through to load defaults
      } else {
        setMenuItems(items);
        return;
      }
    } 
    
    // Load default items
    const exampleItems: MenuItem[] = [
        {
          id: '1',
          name: 'Ribeye Steak',
          name_ar: 'ستيك ريب آي',
          description: 'Premium ribeye steak grilled to perfection with herbs',
          description_ar: 'ستيك ريب آي فاخر مشوي بالأعشاب',
          price: 28.99,
          image_url: 'https://images.unsplash.com/photo-1619719015339-133a130520f6?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'grill-1',
          preparation_time: 25,
          badges: ['Popular', 'Chef Special'],
          stock_status: 'in_stock',
          available_modifiers: [
            { id: 'm1', name: 'Extra Sauce', name_ar: 'صلصة إضافية', type: 'add', price: 2.00 },
            { id: 'm2', name: 'Add Mushrooms', name_ar: 'إضافة فطر', type: 'add', price: 3.50 },
            { id: 'm3', name: 'No Garlic', name_ar: 'بدون ثوم', type: 'remove' },
            { id: 'm4', name: 'Add Cheese', name_ar: 'إضافة جبن', type: 'add', price: 2.50 },
          ],
        },
        {
          id: '2',
          name: 'Grilled Salmon',
          name_ar: 'سلمون مشوي',
          description: 'Fresh Atlantic salmon with lemon butter sauce',
          description_ar: 'سلمون أطلسي طازج مع صلصة الزبدة والليمون',
          price: 24.99,
          image_url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'grill-1',
          preparation_time: 20,
          badges: ['New', 'Recommended'],
          dietary_tags: ['Gluten Free'],
          stock_status: 'in_stock',
        },
        {
          id: '3',
          name: 'Caesar Salad',
          name_ar: 'سلطة سيزر',
          description: 'Fresh romaine lettuce with parmesan and croutons',
          description_ar: 'خس طازج مع جبن بارميزان والخبز المحمص',
          price: 12.50,
          image_url: 'https://images.unsplash.com/photo-1574926054530-540288c8e678?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'cold-kitchen-1',
          preparation_time: 10,
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '4',
          name: 'Bruschetta',
          name_ar: 'بروشيتا',
          description: 'Toasted bread with tomatoes, basil and garlic',
          description_ar: 'خبز محمص مع الطماطم والريحان والثوم',
          price: 9.99,
          image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'appetizers-1',
          preparation_time: 8,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian', 'Vegan'],
          stock_status: 'in_stock',
        },
        {
          id: '5',
          name: 'Margherita Pizza',
          name_ar: 'بيتزا مارغريتا',
          description: 'Classic pizza with fresh mozzarella and basil',
          description_ar: 'بيتزا كلاسيكية مع موزاريلا طازجة وريحان',
          price: 16.99,
          image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'pizza-1',
          preparation_time: 15,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
          available_modifiers: [
            { id: 'm5', name: 'Extra Cheese', name_ar: 'جبن إضافي', type: 'add', price: 3.00 },
            { id: 'm6', name: 'Add Olives', name_ar: 'إضافة زيتون', type: 'add', price: 2.00 },
            { id: 'm7', name: 'No Onions', name_ar: 'بدون بصل', type: 'remove' },
            { id: 'm8', name: 'Add Peppers', name_ar: 'إضافة فلفل', type: 'add', price: 2.50 },
          ],
        },
        {
          id: '6',
          name: 'Pepperoni Pizza',
          name_ar: 'بيتزا ببروني',
          description: 'Loaded with pepperoni and mozzarella cheese',
          description_ar: 'محملة بالببروني وجبن الموزاريلا',
          price: 18.99,
          image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'pizza-1',
          preparation_time: 15,
          badges: ['Popular', 'Chef Special'],
          stock_status: 'in_stock',
        },
        {
          id: '7',
          name: 'Beef Burger',
          name_ar: 'برجر لحم',
          description: 'Juicy beef patty with cheese, lettuce and tomato',
          description_ar: 'لحم بقري عصير مع الجبن والخس والطماطم',
          price: 14.99,
          image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'grill-1',
          preparation_time: 18,
          badges: ['Popular'],
          stock_status: 'in_stock',
        },
        {
          id: '8',
          name: 'Chicken Wings',
          name_ar: 'أجنحة دجاج',
          description: 'Crispy wings with BBQ or buffalo sauce',
          description_ar: 'أجنحة مقرمشة مع صلصة باربكيو أو بافلو',
          price: 13.50,
          image_url: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'grill-1',
          preparation_time: 20,
          badges: ['Popular'],
          stock_status: 'in_stock',
        },
        {
          id: '9',
          name: 'Tiramisu',
          name_ar: 'تيراميسو',
          description: 'Traditional Italian coffee-flavored dessert',
          description_ar: 'حلوى إيطالية تقليدية بنكهة القهوة',
          price: 8.50,
          image_url: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?w=400',
          category: 'desserts',
          menu_type: 'dessert',
          department_id: 'desserts-1',
          preparation_time: 5,
          badges: ['Chef Special'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '10',
          name: 'Chocolate Lava Cake',
          name_ar: 'كيكة الشوكولاتة السائلة',
          description: 'Warm chocolate cake with molten center',
          description_ar: 'كيكة شوكولاتة دافئة مع مركز ذائب',
          price: 9.99,
          image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
          category: 'desserts',
          menu_type: 'dessert',
          department_id: 'desserts-1',
          preparation_time: 8,
          badges: ['Popular', 'Recommended'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '11',
          name: 'Cheesecake',
          name_ar: 'تشيز كيك',
          description: 'Creamy New York style cheesecake',
          description_ar: 'تشيز كيك كريمي على طريقة نيويورك',
          price: 7.99,
          image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
          category: 'desserts',
          menu_type: 'dessert',
          department_id: 'desserts-1',
          preparation_time: 5,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '12',
          name: 'Ice Cream Sundae',
          name_ar: 'آيس كريم صنداي',
          description: 'Three scoops with toppings and sauce',
          description_ar: 'ثلاث كرات مع الإضافات والصلصة',
          price: 6.99,
          image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
          category: 'desserts',
          menu_type: 'dessert',
          department_id: 'desserts-1',
          preparation_time: 5,
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '13',
          name: 'Espresso',
          name_ar: 'إسبريسو',
          description: 'Strong Italian coffee shot',
          description_ar: 'قهوة إيطالية قوية',
          price: 3.50,
          image_url: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?w=400',
          category: 'drinks',
          menu_type: 'main',
          department_id: 'bar-1',
          preparation_time: 3,
          dietary_tags: ['Vegan'],
          stock_status: 'in_stock',
        },
        {
          id: '14',
          name: 'Cappuccino',
          name_ar: 'كابتشينو',
          description: 'Espresso with steamed milk and foam',
          description_ar: 'إسبريسو مع حليب مبخر ورغوة',
          price: 4.50,
          image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
          category: 'drinks',
          menu_type: 'main',
          department_id: 'bar-1',
          preparation_time: 5,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '15',
          name: 'Fresh Orange Juice',
          name_ar: 'عصير برتقال طازج',
          description: 'Freshly squeezed orange juice',
          description_ar: 'عصير برتقال طازج معصور',
          price: 5.99,
          image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
          category: 'drinks',
          menu_type: 'breakfast',
          department_id: 'bar-1',
          preparation_time: 3,
          dietary_tags: ['Vegan', 'Gluten Free'],
          stock_status: 'in_stock',
        },
        {
          id: '16',
          name: 'Mojito (Non-Alcoholic)',
          name_ar: 'موهيتو (بدون كحول)',
          description: 'Refreshing mint and lime drink',
          description_ar: 'مشروب منعش بالنعناع والليمون',
          price: 6.50,
          image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
          category: 'drinks',
          menu_type: 'main',
          department_id: 'bar-1',
          preparation_time: 5,
          badges: ['New', 'Recommended'],
          dietary_tags: ['Vegan'],
          stock_status: 'in_stock',
        },
        {
          id: '17',
          name: 'Pancakes',
          name_ar: 'بان كيك',
          description: 'Fluffy pancakes with maple syrup and berries',
          description_ar: 'بان كيك طري مع شراب القيقب والتوت',
          price: 11.99,
          image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
          category: 'mains',
          menu_type: 'breakfast',
          department_id: 'appetizers-1',
          preparation_time: 12,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '18',
          name: 'Eggs Benedict',
          name_ar: 'بيض بنديكت',
          description: 'Poached eggs with hollandaise sauce',
          description_ar: 'بيض مسلوق مع صلصة هولنديز',
          price: 13.99,
          image_url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
          category: 'mains',
          menu_type: 'breakfast',
          department_id: 'appetizers-1',
          preparation_time: 15,
          badges: ['Chef Special'],
          stock_status: 'in_stock',
        },
        {
          id: '19',
          name: 'French Toast',
          name_ar: 'توست فرنسي',
          description: 'Golden French toast with powdered sugar',
          description_ar: 'توست فرنسي ذهبي مع سكر بودرة',
          price: 10.99,
          image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
          category: 'mains',
          menu_type: 'breakfast',
          department_id: 'appetizers-1',
          preparation_time: 10,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '20',
          name: 'Avocado Toast',
          name_ar: 'توست أفوكادو',
          description: 'Sourdough toast with smashed avocado',
          description_ar: 'توست بالأفوكادو المهروس',
          price: 12.50,
          image_url: 'https://images.unsplash.com/photo-1603046891726-36bfd957e19d?w=400',
          category: 'mains',
          menu_type: 'breakfast',
          department_id: 'appetizers-1',
          preparation_time: 8,
          badges: ['New', 'Recommended'],
          dietary_tags: ['Vegan'],
          stock_status: 'in_stock',
        },
        {
          id: '21',
          name: 'Chicken Nuggets',
          name_ar: 'ناجتس دجاج',
          description: 'Crispy chicken nuggets with fries',
          description_ar: 'ناجتس دجاج مقرمش مع بطاطس',
          price: 8.99,
          image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
          category: 'mains',
          menu_type: 'kids',
          department_id: 'grill-1',
          preparation_time: 12,
          badges: ['Popular'],
          stock_status: 'in_stock',
        },
        {
          id: '22',
          name: 'Mini Cheeseburger',
          name_ar: 'برجر صغير بالجبن',
          description: 'Kid-sized burger with cheese',
          description_ar: 'برجر بحجم الأطفال مع الجبن',
          price: 9.99,
          image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
          category: 'mains',
          menu_type: 'kids',
          department_id: 'grill-1',
          preparation_time: 10,
          badges: ['Popular'],
          stock_status: 'in_stock',
        },
        {
          id: '23',
          name: 'Mac & Cheese',
          name_ar: 'مكرونة بالجبن',
          description: 'Creamy macaroni and cheese',
          description_ar: 'مكرونة كريمية بالجبن',
          price: 7.99,
          image_url: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400',
          category: 'mains',
          menu_type: 'kids',
          department_id: 'appetizers-1',
          preparation_time: 10,
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '24',
          name: 'Fish Fingers',
          name_ar: 'أصابع السمك',
          description: 'Crispy fish fingers with tartar sauce',
          description_ar: 'أصابع سمك مقرمشة مع صلصة تارتار',
          price: 9.50,
          image_url: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400',
          category: 'mains',
          menu_type: 'kids',
          department_id: 'grill-1',
          preparation_time: 12,
          stock_status: 'in_stock',
        },
        {
          id: '25',
          name: 'Pasta Bolognese',
          name_ar: 'باستا بولونيز',
          description: 'Spaghetti with rich meat sauce',
          description_ar: 'سباغيتي مع صلصة اللحم الغنية',
          price: 15.99,
          image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
          category: 'mains',
          menu_type: 'main',
          department_id: 'appetizers-1',
          preparation_time: 18,
          badges: ['Popular'],
          stock_status: 'in_stock',
        },
        {
          id: '26',
          name: 'Greek Salad',
          name_ar: 'سلطة يونانية',
          description: 'Fresh vegetables with feta cheese',
          description_ar: 'خضروات طازجة مع جبن الفيتا',
          price: 11.50,
          image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'cold-kitchen-1',
          preparation_time: 8,
          dietary_tags: ['Vegetarian', 'Gluten Free'],
          stock_status: 'in_stock',
        },
        {
          id: '27',
          name: 'Tomato Soup',
          name_ar: 'شوربة طماطم',
          description: 'Creamy tomato soup with basil',
          description_ar: 'شوربة طماطم كريمية مع الريحان',
          price: 8.99,
          image_url: 'https://images.unsplash.com/photo-1692776407523-8f3c4678ad36?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'appetizers-1',
          preparation_time: 10,
          dietary_tags: ['Vegetarian', 'Vegan'],
          stock_status: 'in_stock',
        },
        {
          id: '28',
          name: 'Onion Rings',
          name_ar: 'حلقات البصل',
          description: 'Crispy battered onion rings',
          description_ar: 'حلقات بصل مقرمشة',
          price: 6.99,
          image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'grill-1',
          preparation_time: 8,
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '29',
          name: 'Garlic Bread',
          name_ar: 'خبز بالثوم',
          description: 'Toasted bread with garlic butter',
          description_ar: 'خبز محمص مع زبدة الثوم',
          price: 5.99,
          image_url: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400',
          category: 'appetizers',
          menu_type: 'main',
          department_id: 'appetizers-1',
          preparation_time: 5,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
        {
          id: '30',
          name: 'Milkshake',
          name_ar: 'ميلك شيك',
          description: 'Thick and creamy milkshake - vanilla, chocolate or strawberry',
          description_ar: 'ميلك شيك كريمي - فانيلا، شوكولاتة أو فراولة',
          price: 5.99,
          image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
          category: 'drinks',
          menu_type: 'dessert',
          department_id: 'bar-1',
          preparation_time: 5,
          badges: ['Popular'],
          dietary_tags: ['Vegetarian'],
          stock_status: 'in_stock',
        },
    ];
    setMenuItems(exampleItems);
    // Save to localStorage so it's available across pages
    localStorage.setItem('echefs_menu_items', JSON.stringify(exampleItems));
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('echefs_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaultCategories = [
        { id: 'appetizers', name: 'Appetizers', name_ar: 'المقبلات', icon: 'utensils' },
        { id: 'mains', name: 'Main Dishes', name_ar: 'الأطباق الرئيسية', icon: 'chef-hat' },
        { id: 'desserts', name: 'Desserts', name_ar: 'الحلويات', icon: 'ice-cream' },
        { id: 'drinks', name: 'Drinks', name_ar: 'المشروبات', icon: 'coffee' },
      ];
      setCategories(defaultCategories);
      // Save to localStorage
      localStorage.setItem('echefs_categories', JSON.stringify(defaultCategories));
    }
  };

  const menuTypes: Array<{ id: MenuType; name: string; icon: any }> = [
    { id: 'main', name: 'Main', icon: UtensilsCrossed },
    { id: 'breakfast', name: 'Breakfast', icon: Coffee },
    { id: 'dessert', name: 'Desserts', icon: Cake },
    { id: 'kids', name: 'Kids', icon: Users },
  ];

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (item.menu_type !== currentMenuType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(query) || item.name_ar?.toLowerCase().includes(query);
      const matchesDesc = item.description?.toLowerCase().includes(query) || item.description_ar?.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc) return false;
    }
    if (selectedFilters.badges.length > 0 && (!item.badges || !selectedFilters.badges.some(b => item.badges?.includes(b)))) return false;
    if (selectedFilters.dietary.length > 0 && (!item.dietary_tags || !selectedFilters.dietary.some(d => item.dietary_tags?.includes(d)))) return false;
    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange === 'budget' ? [0, 15] : selectedFilters.priceRange === 'mid' ? [15, 30] : [30, 999];
      if (item.price < min || item.price > max) return false;
    }
    return true;
  });

  const availableCategories = categories.filter(cat => {
    return menuItems.some(item => item.category === cat.id && item.menu_type === currentMenuType);
  });

  const addToCart = (item: MenuItem, modifiers: SelectedModifier[] = []) => {
    // Calculate total price with modifiers
    let totalPrice = item.price;
    modifiers.forEach(mod => {
      if (mod.type === 'add' && mod.price) {
        totalPrice += mod.price * (mod.quantity || 1);
      }
    });

    const existingItem = cart.find(ci => 
      ci.menu_item_id === item.id && 
      JSON.stringify(ci.modifiers) === JSON.stringify(modifiers)
    );
    
    if (existingItem) {
      setCart(cart.map(ci => 
        ci.id === existingItem.id 
          ? { ...ci, quantity: ci.quantity + 1 } 
          : ci
      ));
    } else {
      const cartItem: CartItem = {
        id: `cart-${Date.now()}`,
        menu_item_id: item.id,
        name: item.name,
        name_ar: item.name_ar || item.name,
        price: totalPrice,
        quantity: 1,
        image_url: item.image_url,
        category: item.category,
        department_id: item.department_id,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
      };
      setCart([...cart, cartItem]);
    }
    setAddedItems(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 1500);
    toast.success(`${item.name} added to order`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === cartItemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter(item => item.id !== cartItemId));
    toast.success('Item removed');
  };

  const addSpecialInstructions = (cartItemId: string, instructions: string) => {
    setCart(cart.map(item => item.id === cartItemId ? { ...item, special_instructions: instructions } : item));
  };

  const submitOrder = () => {
    if (!selectedTable && orderType === 'dine-in') {
      toast.error('Please select a table');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const order = {
      id: `order-${Date.now()}`,
      order_number: `#${Math.floor(Math.random() * 1000)}`,
      table_number: orderType === 'dine-in' ? selectedTable : undefined,
      customer_name: customerName || undefined,
      order_type: orderType,
      status: 'pending',
      items: cart.map(item => ({
        id: item.menu_item_id,
        name: item.name,
        name_ar: item.name_ar,
        quantity: item.quantity,
        price: item.price,
        notes: item.special_instructions,
        department_id: item.department_id,
        modifiers: item.modifiers, // Send modifiers to kitchen
      })),
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      created_at: new Date().toISOString(),
      waiter_id: 'current-waiter',
    };

    const orders = JSON.parse(localStorage.getItem('echefs_waiter_orders') || '[]');
    orders.push(order);
    localStorage.setItem('echefs_waiter_orders', JSON.stringify(orders));

    toast.success(`Order ${order.order_number} submitted successfully!`);
    setCart([]);
    setCustomerName('');
    setShowCart(false);
    setTimeout(() => navigate('/waiter/dashboard'), 1500);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearFilters = () => {
    setSelectedFilters({ badges: [], dietary: [], priceRange: null });
  };

  const hasActiveFilters = selectedFilters.badges.length > 0 || selectedFilters.dietary.length > 0 || selectedFilters.priceRange !== null;

  const proceedToMenu = () => {
    if (orderType === 'dine-in' && !selectedTable) {
      toast.error('Please select a table');
      return;
    }
    setCurrentStep('menu');
  };

  // Table Selection Screen
  if (currentStep === 'table') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e4dbc4] to-[#d4c9b0]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/waiter/dashboard')}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">New Order</h1>
              <p className="text-sm text-gray-600 font-semibold">Select table or order type</p>
            </div>
          </div>

          {/* Order Type Selection */}
          <div className="flex gap-2">
            {(['dine-in', 'takeaway', 'delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setOrderType(type);
                  setSelectedTable('');
                  setSelectedRegion('');
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  orderType === type
                    ? 'bg-[#667c67] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'dine-in' ? '🍽️ Dine-in' : type === 'takeaway' ? '📦 Takeaway' : '🚚 Delivery'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          {orderType === 'dine-in' ? (
            <>
              {/* Select Region First */}
              {!selectedRegion ? (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={24} className="text-[#667c67]" />
                    Select Area
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {tableRegions.map(region => (
                      <motion.button
                        key={region.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRegion(region.id)}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                        style={{ borderTop: `4px solid ${region.color}` }}
                      >
                        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${region.color}20` }}>
                          {region.icon === 'home' && <Home size={32} style={{ color: region.color }} />}
                          {region.icon === 'building' && <Building2 size={32} style={{ color: region.color }} />}
                          {region.icon === 'crown' && <Crown size={32} style={{ color: region.color }} />}
                          {region.icon === 'coffee' && <Coffee size={32} style={{ color: region.color }} />}
                        </div>
                        <h3 className="font-black text-gray-900 mb-1">{region.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold">{region.tables.length} tables</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Select Table Number */
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => {
                        setSelectedRegion('');
                        setSelectedTable('');
                      }}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-md"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Table2 size={24} className="text-[#667c67]" />
                        Select Table
                      </h2>
                      <p className="text-sm text-gray-600 font-semibold">
                        {tableRegions.find(r => r.id === selectedRegion)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {tableRegions.find(r => r.id === selectedRegion)?.tables.map(tableNum => (
                      <motion.button
                        key={tableNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTable(String(tableNum))}
                        className={`aspect-square rounded-2xl font-black text-lg transition-all shadow-lg ${
                          selectedTable === String(tableNum)
                            ? 'bg-[#667c67] text-white scale-110'
                            : 'bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {tableNum}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Customer Name for Takeaway/Delivery */
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-[#667c67]" />
                Customer Name (Optional)
              </h2>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-0 font-semibold text-lg"
              />
            </div>
          )}
        </div>

        {/* Continue Button */}
        {((orderType === 'dine-in' && selectedTable) || orderType !== 'dine-in') && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl"
          >
            <button
              onClick={proceedToMenu}
              className="w-full px-6 py-4 rounded-xl bg-[#667c67] text-white font-black text-lg hover:bg-[#556856] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Menu
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Menu Screen (Full Screen Design)
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Collapsible Header */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: -100 }}
            className="bg-white border-b border-gray-200 shadow-sm relative z-30"
          >
            <div className="px-4 py-3">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('table')}
                    className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900">
                        {orderType === 'dine-in' ? `Table ${selectedTable}` : orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}
                      </span>
                      <button onClick={() => setCurrentStep('table')} className="text-[#667c67] text-sm font-bold">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <button
                    onClick={() => setShowLanguageSelector(true)}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-sm flex items-center gap-1 transition-colors"
                  >
                    <Globe size={16} />
                    <span className="hidden sm:inline">{i18n.language.toUpperCase()}</span>
                  </button>
                  <button
                    onClick={() => setShowFilters(true)}
                    className={`px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1 ${
                      hasActiveFilters ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search size={18} className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
                <input
                  type="text"
                  placeholder={i18n.language === 'ar' ? 'ابحث في القائمة...' : 'Search menu...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${i18n.language === 'ar' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#667c67] focus:ring-0 font-semibold text-sm`}
                  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={18} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Menu Types */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                {menuTypes.map(type => {
                  const Icon = type.icon;
                  const count = menuItems.filter(item => item.menu_type === type.id).length;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setCurrentMenuType(type.id);
                        setSelectedCategory('all');
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                        currentMenuType === type.id
                          ? 'bg-[#667c67] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      {type.name}
                      <span className="text-xs">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full font-bold text-xs ${
                    selectedCategory === 'all' ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All ({filteredItems.length})
                </button>
                {availableCategories.map(cat => {
                  const count = filteredItems.filter(item => item.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full font-bold text-xs ${
                        selectedCategory === cat.id ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hide/Show Header Toggle */}
            <button
              onClick={() => setShowHeader(false)}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200"
            >
              <ChevronUp size={16} className="text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Header Button (when hidden) */}
      {!showHeader && (
        <button
          onClick={() => setShowHeader(true)}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-white rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm border-2 border-gray-200"
        >
          <ChevronDown size={16} />
          {i18n.language === 'ar' ? 'إظهار الفلاتر' : 'Show Filters'}
        </button>
      )}

      {/* Menu Items (Full Screen) */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {i18n.language === 'ar' ? 'لا توجد عناصر' : 'No items found'}
            </h3>
            <p className="text-gray-500">
              {i18n.language === 'ar' ? 'حاول تعديل الفلاتر' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item, index) => {
              const isAdded = addedItems.has(item.id);
              const inCart = cart.find(ci => ci.menu_item_id === item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  {/* Image - Clickable */}
                  <div 
                    className="relative aspect-square bg-gray-100 cursor-pointer group"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowItemDetail(true);
                    }}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed size={48} className="text-gray-300" />
                      </div>
                    )}
                    
                    {/* View Details Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                          <Info size={14} />
                          View Details
                        </span>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    {item.badges && item.badges.length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.badges.slice(0, 2).map(badge => {
                          const badgeColors = {
                            'Popular': 'bg-orange-500',
                            'New': 'bg-green-500',
                            'Chef Special': 'bg-purple-500',
                            'Recommended': 'bg-blue-500'
                          };
                          return (
                            <span 
                              key={badge} 
                              className={`px-2 py-0.5 ${badgeColors[badge as keyof typeof badgeColors] || 'bg-gray-500'} text-white backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1`}
                            >
                              {badge === 'Popular' && <Flame size={10} />}
                              {badge === 'New' && <Sparkles size={10} />}
                              {badge === 'Chef Special' && <Award size={10} />}
                              {badge === 'Recommended' && <Star size={10} />}
                              {badge}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Dietary Tags */}
                    {item.dietary_tags && item.dietary_tags.length > 0 && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {item.dietary_tags.slice(0, 1).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-green-500 text-white backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1">
                            <Leaf size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Add Button */}
                    {!inCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className={`absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all z-10 ${
                          isAdded ? 'bg-green-500 text-white' : 'bg-white text-[#667c67] hover:bg-[#667c67] hover:text-white'
                        }`}
                      >
                        {isAdded ? <Check size={20} /> : <Plus size={20} />}
                      </button>
                    )}
                    
                    {/* Preparation Time */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Clock size={10} />
                        {item.preparation_time}m
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                      {i18n.language === 'ar' ? item.name_ar : item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {i18n.language === 'ar' ? item.description_ar : item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#667c67]">${item.price.toFixed(2)}</span>
                      {inCart && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(inCart.id, -1)}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm min-w-[20px] text-center">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(inCart.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#667c67] text-white flex items-center justify-center hover:bg-[#556856]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#667c67] text-white shadow-2xl flex items-center justify-center z-50"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </motion.button>
      )}

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    {i18n.language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                  </h3>
                  <p className="text-sm text-gray-600 font-semibold">
                    {totalItems} {i18n.language === 'ar' ? 'عناصر' : 'items'} • 
                    {orderType === 'dine-in' ? ` ${i18n.language === 'ar' ? 'طاولة' : 'Table'} ${selectedTable}` : 
                     orderType === 'takeaway' ? ` ${i18n.language === 'ar' ? 'سفري' : 'Takeaway'}` : 
                     ` ${i18n.language === 'ar' ? 'توصيل' : 'Delivery'}`}
                  </p>
                </div>
                <button onClick={() => setShowCart(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {i18n.language === 'ar' ? 'السلة فارغة' : 'Cart is Empty'}
                    </h4>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                      {i18n.language === 'ar' 
                        ? 'ابدأ بإضافة عناصر من القائمة' 
                        : 'Start adding items from the menu'}
                    </p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 mb-3">
                      <div className="flex gap-3 mb-3">
                        {item.image_url && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1 truncate">
                            {i18n.language === 'ar' ? item.name_ar : item.name}
                          </h4>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="text-xs text-gray-600 mb-1 space-y-0.5">
                              {item.modifiers.map((mod, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className={mod.type === 'add' ? 'text-green-600' : 'text-red-600'}>
                                    {mod.type === 'add' ? '+' : '-'}
                                  </span>
                                  <span>
                                    {i18n.language === 'ar' ? mod.name_ar : mod.name}
                                    {mod.quantity && mod.quantity > 1 && ` x${mod.quantity}`}
                                    {mod.type === 'add' && mod.price && ` (+$${(mod.price * (mod.quantity || 1)).toFixed(2)})`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-600 font-semibold">${item.price.toFixed(2)} each</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg bg-[#667c67] text-white flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                            <Trash2 size={18} />
                          </button>
                          <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder={i18n.language === 'ar' ? 'ملاحظات خاصة...' : 'Special instructions...'}
                        value={item.special_instructions || ''}
                        onChange={(e) => addSpecialInstructions(item.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-700">
                    {i18n.language === 'ar' ? 'المجموع' : 'Total'}
                  </span>
                  <span className="text-2xl font-black text-[#667c67]">${totalAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={submitOrder}
                  disabled={cart.length === 0}
                  className={`w-full px-6 py-4 rounded-xl text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg ${
                    cart.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#667c67] hover:bg-[#556856]'
                  }`}
                >
                  <Send size={20} />
                  {i18n.language === 'ar' ? 'إرسال الطلب' : 'Submit Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">
                  {i18n.language === 'ar' ? 'الفلاتر' : 'Filters'}
                </h3>
                <button onClick={() => setShowFilters(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    {i18n.language === 'ar' ? 'الوسوم الشائعة' : 'Popular Tags'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Popular', 'New', 'Chef Special', 'Recommended'].map(badge => (
                      <button
                        key={badge}
                        onClick={() => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            badges: prev.badges.includes(badge) ? prev.badges.filter(b => b !== badge) : [...prev.badges, badge]
                          }));
                        }}
                        className={`px-4 py-2 rounded-full font-bold text-sm ${
                          selectedFilters.badges.includes(badge) ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    {i18n.language === 'ar' ? 'النظام الغذائي' : 'Dietary'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarian', 'Vegan', 'Gluten Free', 'Halal'].map(diet => (
                      <button
                        key={diet}
                        onClick={() => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            dietary: prev.dietary.includes(diet) ? prev.dietary.filter(d => d !== diet) : [...prev.dietary, diet]
                          }));
                        }}
                        className={`px-4 py-2 rounded-full font-bold text-sm ${
                          selectedFilters.dietary.includes(diet) ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    {i18n.language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'budget', label: '$0-$15' },
                      { id: 'mid', label: '$15-$30' },
                      { id: 'premium', label: '$30+' },
                    ].map(range => (
                      <button
                        key={range.id}
                        onClick={() => {
                          setSelectedFilters(prev => ({ ...prev, priceRange: prev.priceRange === range.id ? null : range.id }));
                        }}
                        className={`px-4 py-2 rounded-full font-bold text-sm ${
                          selectedFilters.priceRange === range.id ? 'bg-[#667c67] text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button onClick={clearFilters} className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold">
                  {i18n.language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
                <button onClick={() => setShowFilters(false)} className="flex-1 px-6 py-3 rounded-xl bg-[#667c67] text-white font-bold">
                  {i18n.language === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {showItemDetail && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] flex items-end"
            onClick={() => {
              setShowItemDetail(false);
              setSelectedModifiers([]); // Reset modifiers on close
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-64 bg-gray-100">
                {selectedItem.image_url ? (
                  <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed size={80} className="text-gray-300" />
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowItemDetail(false);
                    setSelectedModifiers([]); // Reset modifiers
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                >
                  <X size={20} />
                </button>
                
                {/* Badges on Image */}
                {selectedItem.badges && selectedItem.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {selectedItem.badges.map(badge => {
                      const badgeColors = {
                        'Popular': 'bg-orange-500',
                        'New': 'bg-green-500',
                        'Chef Special': 'bg-purple-500',
                        'Recommended': 'bg-blue-500'
                      };
                      return (
                        <span 
                          key={badge} 
                          className={`px-3 py-1 ${badgeColors[badge as keyof typeof badgeColors] || 'bg-gray-500'} text-white backdrop-blur-sm rounded-full text-sm font-bold flex items-center gap-1`}
                        >
                          {badge === 'Popular' && <Flame size={14} />}
                          {badge === 'New' && <Sparkles size={14} />}
                          {badge === 'Chef Special' && <Award size={14} />}
                          {badge === 'Recommended' && <Star size={14} />}
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Title and Price */}
                <div className="mb-4">
                  <h2 className="text-2xl font-black text-gray-900 mb-2">
                    {i18n.language === 'ar' ? selectedItem.name_ar : selectedItem.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {i18n.language === 'ar' ? selectedItem.description_ar : selectedItem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#667c67]">${selectedItem.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span className="font-semibold">{selectedItem.preparation_time} min</span>
                    </div>
                  </div>
                </div>

                {/* Dietary Tags */}
                {selectedItem.dietary_tags && selectedItem.dietary_tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      {i18n.language === 'ar' ? 'معلومات غذائية' : 'Dietary Information'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.dietary_tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-semibold flex items-center gap-1">
                          <Leaf size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Clock size={20} className="text-[#667c67] mx-auto mb-1" />
                    <div className="text-xs text-gray-600 font-semibold">
                      {i18n.language === 'ar' ? 'وقت التحضير' : 'Prep Time'}
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedItem.preparation_time}m</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <DollarSign size={20} className="text-[#667c67] mx-auto mb-1" />
                    <div className="text-xs text-gray-600 font-semibold">
                      {i18n.language === 'ar' ? 'السعر' : 'Price'}
                    </div>
                    <div className="text-sm font-bold text-gray-900">${selectedItem.price}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <UtensilsCrossed size={20} className="text-[#667c67] mx-auto mb-1" />
                    <div className="text-xs text-gray-600 font-semibold">
                      {i18n.language === 'ar' ? 'الفئة' : 'Category'}
                    </div>
                    <div className="text-sm font-bold text-gray-900 capitalize">{selectedItem.category}</div>
                  </div>
                </div>

                {/* Modifiers / Customizations */}
                {selectedItem.available_modifiers && selectedItem.available_modifiers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {i18n.language === 'ar' ? 'خيارات التخصيص' : 'Customize Your Order'}
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.available_modifiers.map(modifier => {
                        const isSelected = selectedModifiers.some(m => m.id === modifier.id);
                        const selectedMod = selectedModifiers.find(m => m.id === modifier.id);
                        
                        return (
                          <div key={modifier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">
                                  {i18n.language === 'ar' ? modifier.name_ar : modifier.name}
                                </span>
                                {modifier.type === 'add' && modifier.price && (
                                  <span className="text-sm font-bold text-[#667c67]">
                                    +${modifier.price.toFixed(2)}
                                  </span>
                                )}
                                {modifier.type === 'remove' && (
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">
                                    {i18n.language === 'ar' ? 'إزالة' : 'Remove'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {modifier.type === 'add' && isSelected && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedModifiers(prev => {
                                        const existing = prev.find(m => m.id === modifier.id);
                                        if (existing && (existing.quantity || 1) > 1) {
                                          return prev.map(m => 
                                            m.id === modifier.id 
                                              ? { ...m, quantity: (m.quantity || 1) - 1 }
                                              : m
                                          );
                                        }
                                        return prev.filter(m => m.id !== modifier.id);
                                      });
                                    }}
                                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-sm font-bold min-w-[20px] text-center">
                                    {selectedMod?.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedModifiers(prev => {
                                        const existing = prev.find(m => m.id === modifier.id);
                                        if (existing) {
                                          return prev.map(m => 
                                            m.id === modifier.id 
                                              ? { ...m, quantity: (m.quantity || 1) + 1 }
                                              : m
                                          );
                                        }
                                        return prev;
                                      });
                                    }}
                                    className="w-7 h-7 rounded-lg bg-[#667c67] text-white flex items-center justify-center hover:bg-[#556856]"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
                                  } else {
                                    setSelectedModifiers(prev => [...prev, { ...modifier, quantity: 1 }]);
                                  }
                                }}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-[#667c67] text-white'
                                    : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-[#667c67] hover:text-[#667c67]'
                                }`}
                              >
                                {isSelected ? <Check size={18} /> : <Plus size={18} />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">
                      {i18n.language === 'ar' ? 'الكمية' : 'Quantity'}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const cartItem = cart.find(ci => ci.menu_item_id === selectedItem.id);
                          if (cartItem && cartItem.quantity > 1) {
                            updateQuantity(cartItem.id, -1);
                          }
                        }}
                        className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-xl min-w-[40px] text-center">
                        {cart.find(ci => ci.menu_item_id === selectedItem.id)?.quantity || 1}
                      </span>
                      <button
                        onClick={() => {
                          const cartItem = cart.find(ci => ci.menu_item_id === selectedItem.id);
                          if (cartItem) {
                            updateQuantity(cartItem.id, 1);
                          } else {
                            addToCart(selectedItem, selectedModifiers);
                          }
                        }}
                        className="w-10 h-10 rounded-xl bg-[#667c67] text-white flex items-center justify-center hover:bg-[#556856]"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      {i18n.language === 'ar' ? 'ملاحظات خاصة (اختياري)' : 'Special Instructions (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={i18n.language === 'ar' ? 'مثال: بدون بصل، صلصة إضافية...' : 'e.g., No onions, extra sauce...'}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#667c67] focus:ring-0 text-sm"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      value={cart.find(ci => ci.menu_item_id === selectedItem.id)?.special_instructions || ''}
                      onChange={(e) => {
                        const cartItem = cart.find(ci => ci.menu_item_id === selectedItem.id);
                        if (cartItem) {
                          addSpecialInstructions(cartItem.id, e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {cart.find(ci => ci.menu_item_id === selectedItem.id) ? (
                    <>
                      <button
                        onClick={() => {
                          const cartItem = cart.find(ci => ci.menu_item_id === selectedItem.id);
                          if (cartItem) {
                            removeFromCart(cartItem.id);
                          }
                          setShowItemDetail(false);
                          setSelectedModifiers([]); // Reset modifiers
                        }}
                        className="flex-1 px-6 py-4 rounded-xl bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={20} />
                        {i18n.language === 'ar' ? 'إزالة' : 'Remove'}
                      </button>
                      <button
                        onClick={() => {
                          setShowItemDetail(false);
                          setSelectedModifiers([]); // Reset modifiers
                        }}
                        className="flex-1 px-6 py-4 rounded-xl bg-[#667c67] text-white font-bold text-lg hover:bg-[#556856] transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={20} />
                        {i18n.language === 'ar' ? 'تم' : 'Done'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(selectedItem, selectedModifiers);
                        setSelectedModifiers([]); // Reset modifiers
                        setShowItemDetail(false);
                        toast.success(i18n.language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
                      }}
                      className="w-full px-6 py-4 rounded-xl bg-[#667c67] text-white font-bold text-lg hover:bg-[#556856] transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingCart size={20} />
                      {i18n.language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selector Modal */}
      <AnimatePresence>
        {showLanguageSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70] flex items-end"
            onClick={() => setShowLanguageSelector(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">
                  {i18n.language === 'ar' ? 'اختر اللغة' : i18n.language === 'ru' ? 'Выберите язык' : i18n.language === 'ky' ? 'Тилди тандаңыз' : 'Select Language'}
                </h3>
                <button
                  onClick={() => setShowLanguageSelector(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-3">
                {availableLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setShowLanguageSelector(false);
                      toast.success(`Language changed to ${lang.nativeName}`);
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      i18n.language === lang.code
                        ? 'border-[#667c67] bg-[#667c67]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">{lang.nativeName}</div>
                        <div className="text-sm text-gray-600">{lang.name}</div>
                      </div>
                    </div>
                    {i18n.language === lang.code && (
                      <Check size={24} className="text-[#667c67]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}