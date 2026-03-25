import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../../design-system';
import {
  ChevronLeft, Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff,
  Save, X, UtensilsCrossed, FolderTree, Users, Coffee, Cake,
  Package, Grid3x3, List, Star, Flame, Tag, Heart, Sparkles,
  Upload, Image as ImageIcon, DollarSign, Info, AlertCircle,
  Building2, Globe, MapPin, Download, Filter, CheckCircle,
  ArrowUp, ArrowDown, Percent, Clock, TrendingUp, BarChart3,
  Settings, Target, Zap, ChefHat, Leaf, Wheat, Cookie,
  Pizza, Soup, Drumstick, Fish, Sandwich, IceCream, Apple,
  Wine, Beer, Milk, Salad, Egg, Croissant, Donut, Popcorn,
  CupSoda, GlassWater, Cherry, Citrus, Grape, Carrot, Candy,
  type LucideIcon
} from 'lucide-react';

// Icon picker options
const AVAILABLE_ICONS: { name: string; icon: LucideIcon; category: string }[] = [
  // Food - Main Dishes
  { name: 'Pizza', icon: Pizza, category: 'Main Dishes' },
  { name: 'Drumstick', icon: Drumstick, category: 'Main Dishes' },
  { name: 'Fish', icon: Fish, category: 'Main Dishes' },
  { name: 'Sandwich', icon: Sandwich, category: 'Main Dishes' },
  { name: 'Soup', icon: Soup, category: 'Main Dishes' },
  { name: 'Utensils', icon: UtensilsCrossed, category: 'Main Dishes' },
  
  // Breakfast & Bakery
  { name: 'Croissant', icon: Croissant, category: 'Breakfast' },
  { name: 'Egg', icon: Egg, category: 'Breakfast' },
  { name: 'Coffee', icon: Coffee, category: 'Breakfast' },
  { name: 'Donut', icon: Donut, category: 'Breakfast' },
  
  // Desserts & Sweets
  { name: 'Ice Cream', icon: IceCream, category: 'Desserts' },
  { name: 'Cake', icon: Cake, category: 'Desserts' },
  { name: 'Cookie', icon: Cookie, category: 'Desserts' },
  { name: 'Candy', icon: Candy, category: 'Desserts' },
  
  // Drinks
  { name: 'Wine', icon: Wine, category: 'Drinks' },
  { name: 'Beer', icon: Beer, category: 'Drinks' },
  { name: 'Cup Soda', icon: CupSoda, category: 'Drinks' },
  { name: 'Glass Water', icon: GlassWater, category: 'Drinks' },
  { name: 'Milk', icon: Milk, category: 'Drinks' },
  
  // Healthy & Fresh
  { name: 'Salad', icon: Salad, category: 'Healthy' },
  { name: 'Apple', icon: Apple, category: 'Healthy' },
  { name: 'Cherry', icon: Cherry, category: 'Healthy' },
  { name: 'Citrus', icon: Citrus, category: 'Healthy' },
  { name: 'Grape', icon: Grape, category: 'Healthy' },
  { name: 'Carrot', icon: Carrot, category: 'Healthy' },
  { name: 'Leaf', icon: Leaf, category: 'Healthy' },
  
  // Special Categories
  { name: 'Chef Hat', icon: ChefHat, category: 'Special' },
  { name: 'Star', icon: Star, category: 'Special' },
  { name: 'Heart', icon: Heart, category: 'Special' },
  { name: 'Sparkles', icon: Sparkles, category: 'Special' },
  { name: 'Flame', icon: Flame, category: 'Special' },
  { name: 'Popcorn', icon: Popcorn, category: 'Special' },
  
  // Business
  { name: 'Folder Tree', icon: FolderTree, category: 'Business' },
  { name: 'Users', icon: Users, category: 'Business' },
  { name: 'Package', icon: Package, category: 'Business' },
  { name: 'Target', icon: Target, category: 'Business' },
];

// Helper to get icon component by name
const getIconByName = (iconName: string): LucideIcon => {
  const found = AVAILABLE_ICONS.find(i => i.name === iconName);
  return found?.icon || UtensilsCrossed;
};

// Icon Picker Component
function IconPicker({ 
  selectedIcon, 
  onSelect, 
  color 
}: { 
  selectedIcon: string; 
  onSelect: (iconName: string) => void;
  color?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(AVAILABLE_ICONS.map(i => i.category)))];

  const filteredIcons = AVAILABLE_ICONS.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const SelectedIconComponent = getIconByName(selectedIcon);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-24 rounded-xl border-2 border-gray-300 hover:border-[#667c67] flex items-center justify-center transition-all bg-white"
        style={{ borderColor: isOpen ? color || '#667c67' : undefined }}
      >
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color || '#667c67'}20` }}
        >
          <SelectedIconComponent 
            className="w-10 h-10" 
            style={{ color: color || '#667c67' }}
          />
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 max-h-96 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#667c67] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-6 gap-2 overflow-y-auto">
              {filteredIcons.map(({ name, icon: IconComponent }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onSelect(name);
                    setIsOpen(false);
                  }}
                  className={`relative p-3 rounded-lg hover:bg-gray-100 transition-all group ${
                    selectedIcon === name ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                  }`}
                  title={name}
                >
                  <IconComponent className="w-6 h-6 mx-auto text-gray-700" />
                  {selectedIcon === name && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {name}
                  </div>
                </button>
              ))}
            </div>

            {filteredIcons.length === 0 && (
              <div className="py-8 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No icons found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Types
interface MenuType {
  id: string;
  name: string;
  icon: string; // Now stores icon name like "Pizza" instead of emoji
  color: string;
  enabled: boolean;
  display_order: number;
  translations: {
    en: { name: string; description?: string };
    ar: { name: string; description?: string };
    ru: { name: string; description?: string };
    ky: { name: string; description?: string };
  };
  branch_specific: boolean;
  branch_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

interface Category {
  id: string;
  menu_type_id: string;
  name: string;
  icon: string; // Now stores icon name
  color: string;
  display_order: number;
  enabled: boolean;
  translations: {
    en: { name: string; description?: string };
    ar: { name: string; description?: string };
    ru: { name: string; description?: string };
    ky: { name: string; description?: string };
  };
  branch_specific: boolean;
  branch_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

interface MenuItem {
  id: string;
  category_id: string;
  menu_type_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url?: string;
  enabled: boolean;
  featured: boolean;
  display_order: number;
  preparation_time: number;
  calories?: number;
  badges: string[];
  dietary_tags: string[];
  allergens: string[];
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  department_id?: string; // Link to department for kitchen routing
  translations: {
    en: { name: string; description: string };
    ar: { name: string; description: string };
    ru: { name: string; description: string };
    ky: { name: string; description: string };
  };
  branch_specific: boolean;
  branch_ids?: string[];
  created_at: Date;
  updated_at: Date;
}

export function AdminMenuManagementNew() {
  const navigate = useNavigate();
  const { branches } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'menu-types' | 'categories' | 'items'>('menu-types');
  const [selectedMenuTypeId, setSelectedMenuTypeId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [showAddMenuType, setShowAddMenuType] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingMenuType, setEditingMenuType] = useState<MenuType | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Data
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = () => {
    // Load Menu Types
    const savedMenuTypes = localStorage.getItem('echefs_menu_types');
    if (savedMenuTypes) {
      const parsed = JSON.parse(savedMenuTypes);
      const withDates = parsed.map((mt: any) => ({
        ...mt,
        created_at: new Date(mt.created_at),
        updated_at: new Date(mt.updated_at),
      }));
      setMenuTypes(withDates);
    } else {
      // Default menu types with icon names
      const defaultMenuTypes: MenuType[] = [
        {
          id: 'main',
          name: 'Main Menu',
          icon: 'Utensils', // Icon name instead of emoji
          color: '#667c67',
          enabled: true,
          display_order: 1,
          translations: {
            en: { name: 'Main Menu', description: 'Our full menu selection' },
            ar: { name: 'القائمة الرئيسية', description: 'قائمتنا الكاملة' },
            ru: { name: 'Основное меню', description: 'Полное меню' },
            ky: { name: 'Негизги меню', description: 'Толук меню' },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'business',
          name: 'Business Lunch',
          icon: 'Folder Tree',
          color: '#3b82f6',
          enabled: true,
          display_order: 2,
          translations: {
            en: { name: 'Business Lunch', description: 'Quick lunch options for busy professionals' },
            ar: { name: 'غداء العمل', description: 'خيارات سريعة للمحترفين' },
            ru: { name: 'Бизнес-ланч', description: 'Быстрые обеды для профессионалов' },
            ky: { name: 'Бизнес түшкү тамак', description: 'Ишкерлер үчүн тез тамак' },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'kids',
          name: 'Kids Menu',
          icon: 'Users',
          color: '#f59e0b',
          enabled: true,
          display_order: 3,
          translations: {
            en: { name: 'Kids Menu', description: 'Special meals for children' },
            ar: { name: 'قائمة الأطفال', description: 'وجبات خاصة للأطفال' },
            ru: { name: 'Детское меню', description: 'Специальные блюда для детей' },
            ky: { name: 'Балдар менюсу', description: 'Балдар үчүн атайын тамактар' },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      setMenuTypes(defaultMenuTypes);
      localStorage.setItem('echefs_menu_types', JSON.stringify(defaultMenuTypes));
    }

    // Load Categories
    const savedCategories = localStorage.getItem('echefs_categories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      const withDates = parsed.map((c: any) => ({
        ...c,
        created_at: new Date(c.created_at),
        updated_at: new Date(c.updated_at),
      }));
      setCategories(withDates);
    } else {
      // Default categories with icon names
      const defaultCategories: Category[] = [
        {
          id: 'starters',
          menu_type_id: 'main',
          name: 'Starters',
          icon: 'Salad',
          color: '#10b981',
          display_order: 1,
          enabled: true,
          translations: {
            en: { name: 'Starters', description: 'Appetizers and small plates' },
            ar: { name: 'المقبلات', description: 'المشهيات والأطباق الصغيرة' },
            ru: { name: 'Закуски', description: 'Холодные и горячие закуски' },
            ky: { name: 'Тамак алдындагы', description: 'Аппетит ачуучу тамактар' },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'main-courses',
          menu_type_id: 'main',
          name: 'Main Courses',
          icon: 'Drumstick',
          color: '#dc2626',
          display_order: 2,
          enabled: true,
          translations: {
            en: { name: 'Main Courses', description: 'Our signature dishes' },
            ar: { name: 'الأطباق الرئيسية', description: 'أطباقنا المميزة' },
            ru: { name: 'Основные блюда', description: 'Наши фирменные блюда' },
            ky: { name: 'Негизги тамактар', description: 'Биздин өзгөчө тамактар' },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('echefs_categories', JSON.stringify(defaultCategories));
    }

    // Load Menu Items
    const savedItems = localStorage.getItem('echefs_menu_items');
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      const withDates = parsed.map((i: any) => ({
        ...i,
        created_at: new Date(i.created_at),
        updated_at: new Date(i.updated_at),
      }));
      setMenuItems(withDates);
    } else {
      // Default items
      const defaultItems: MenuItem[] = [
        {
          id: 'item-1',
          category_id: 'starters',
          menu_type_id: 'main',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan and croutons',
          price: 12.99,
          enabled: true,
          featured: true,
          display_order: 1,
          preparation_time: 10,
          calories: 350,
          badges: ['popular', 'new'],
          dietary_tags: ['vegetarian'],
          allergens: ['dairy', 'gluten'],
          stock_status: 'in_stock',
          translations: {
            en: { 
              name: 'Caesar Salad', 
              description: 'Fresh romaine lettuce with parmesan and croutons' 
            },
            ar: { 
              name: 'سلطة سيزر', 
              description: 'خس روماني طازج مع البارميزان والخبز المحمص' 
            },
            ru: { 
              name: 'Салат Цезарь', 
              description: 'Свежий салат романо с пармезаном и гренками' 
            },
            ky: { 
              name: 'Цезарь салаты', 
              description: 'Жаңы салат, пармезан жана гренкалар менен' 
            },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'item-2',
          category_id: 'main-courses',
          menu_type_id: 'main',
          name: 'Grilled Salmon',
          description: 'Atlantic salmon with seasonal vegetables',
          price: 24.99,
          original_price: 29.99,
          enabled: true,
          featured: true,
          display_order: 1,
          preparation_time: 25,
          calories: 520,
          badges: ['hot', 'discount', 'recommended'],
          dietary_tags: ['gluten-free', 'dairy-free'],
          allergens: ['fish'],
          stock_status: 'in_stock',
          translations: {
            en: { 
              name: 'Grilled Salmon', 
              description: 'Atlantic salmon with seasonal vegetables' 
            },
            ar: { 
              name: 'سلمون مشوي', 
              description: 'سلمون أتلانتي مع خضروات الموسم' 
            },
            ru: { 
              name: 'Лосось на гриле', 
              description: 'Атлантический лосось с сезонными овощами' 
            },
            ky: { 
              name: 'Гриль лосось', 
              description: 'Атлантикалык лосось сезондук жашылчалар менен' 
            },
          },
          branch_specific: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('echefs_menu_items', JSON.stringify(defaultItems));
    }
  };

  const saveMenuTypes = (updated: MenuType[]) => {
    setMenuTypes(updated);
    localStorage.setItem('echefs_menu_types', JSON.stringify(updated));
  };

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem('echefs_categories', JSON.stringify(updated));
  };

  const saveMenuItems = (updated: MenuItem[]) => {
    setMenuItems(updated);
    localStorage.setItem('echefs_menu_items', JSON.stringify(updated));
  };

  // Filter data by branch
  const filteredMenuTypes = selectedBranchId === 'all'
    ? menuTypes
    : menuTypes.filter(mt => {
        if (!mt.branch_specific) return true;
        if (mt.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredCategories = selectedBranchId === 'all'
    ? categories
    : categories.filter(c => {
        if (!c.branch_specific) return true;
        if (c.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  const filteredMenuItems = selectedBranchId === 'all'
    ? menuItems
    : menuItems.filter(i => {
        if (!i.branch_specific) return true;
        if (i.branch_ids?.includes(selectedBranchId)) return true;
        return false;
      });

  // Search filters
  const searchedMenuTypes = filteredMenuTypes.filter(mt =>
    mt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mt.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedCategories = selectedMenuTypeId
    ? filteredCategories.filter(c => 
        c.menu_type_id === selectedMenuTypeId &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredCategories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const searchedMenuItems = selectedCategoryId
    ? filteredMenuItems.filter(i =>
        i.category_id === selectedCategoryId &&
        (i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         i.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : selectedMenuTypeId
    ? filteredMenuItems.filter(i =>
        i.menu_type_id === selectedMenuTypeId &&
        (i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         i.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredMenuItems.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.translations.en.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  // Stats
  const stats = {
    menuTypes: filteredMenuTypes.filter(mt => mt.enabled).length,
    categories: filteredCategories.filter(c => c.enabled).length,
    items: filteredMenuItems.filter(i => i.enabled).length,
    featured: filteredMenuItems.filter(i => i.enabled && i.featured).length,
    outOfStock: filteredMenuItems.filter(i => i.stock_status === 'out_of_stock').length,
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        if (editingItem) {
          setEditingItem({
            ...editingItem,
            image_url: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Menu Type functions
  const createNewMenuType = (): MenuType => ({
    id: `menu-type-${Date.now()}`,
    name: '',
    icon: 'Utensils',
    color: '#667c67',
    enabled: true,
    display_order: menuTypes.length + 1,
    translations: {
      en: { name: '', description: '' },
      ar: { name: '', description: '' },
      ru: { name: '', description: '' },
      ky: { name: '', description: '' },
    },
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const toggleMenuType = (id: string) => {
    const updated = menuTypes.map(mt =>
      mt.id === id ? { ...mt, enabled: !mt.enabled, updated_at: new Date() } : mt
    );
    saveMenuTypes(updated);
  };

  const deleteMenuType = (id: string) => {
    if (confirm('Are you sure? This will also delete all categories and items in this menu type.')) {
      saveMenuTypes(menuTypes.filter(mt => mt.id !== id));
      saveCategories(categories.filter(c => c.menu_type_id !== id));
      saveMenuItems(menuItems.filter(i => i.menu_type_id !== id));
    }
  };

  const duplicateMenuType = (mt: MenuType) => {
    const duplicated: MenuType = {
      ...mt,
      id: `menu-type-${Date.now()}`,
      name: `${mt.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveMenuTypes([...menuTypes, duplicated]);
  };

  // Category functions
  const createNewCategory = (): Category => ({
    id: `category-${Date.now()}`,
    menu_type_id: selectedMenuTypeId || menuTypes[0]?.id || '',
    name: '',
    icon: 'Package',
    color: '#667c67',
    display_order: categories.filter(c => c.menu_type_id === selectedMenuTypeId).length + 1,
    enabled: true,
    translations: {
      en: { name: '', description: '' },
      ar: { name: '', description: '' },
      ru: { name: '', description: '' },
      ky: { name: '', description: '' },
    },
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const toggleCategory = (id: string) => {
    const updated = categories.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled, updated_at: new Date() } : c
    );
    saveCategories(updated);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Are you sure? This will also delete all items in this category.')) {
      saveCategories(categories.filter(c => c.id !== id));
      saveMenuItems(menuItems.filter(i => i.category_id !== id));
    }
  };

  const duplicateCategory = (category: Category) => {
    const duplicated: Category = {
      ...category,
      id: `category-${Date.now()}`,
      name: `${category.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveCategories([...categories, duplicated]);
  };

  // Item functions
  const createNewItem = (): MenuItem => ({
    id: `item-${Date.now()}`,
    category_id: selectedCategoryId || categories[0]?.id || '',
    menu_type_id: selectedMenuTypeId || menuTypes[0]?.id || '',
    name: '',
    description: '',
    price: 0,
    enabled: true,
    featured: false,
    display_order: menuItems.filter(i => i.category_id === selectedCategoryId).length + 1,
    preparation_time: 15,
    badges: [],
    dietary_tags: [],
    allergens: [],
    stock_status: 'in_stock',
    translations: {
      en: { name: '', description: '' },
      ar: { name: '', description: '' },
      ru: { name: '', description: '' },
      ky: { name: '', description: '' },
    },
    branch_specific: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const toggleItem = (id: string) => {
    const updated = menuItems.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled, updated_at: new Date() } : i
    );
    saveMenuItems(updated);
  };

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      saveMenuItems(menuItems.filter(i => i.id !== id));
    }
  };

  const duplicateItem = (item: MenuItem) => {
    const duplicated: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (Copy)`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    saveMenuItems([...menuItems, duplicated]);
  };

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, any> = {
      hot: Flame,
      new: Sparkles,
      discount: Tag,
      popular: Star,
      recommended: Heart,
      spicy: Flame,
    };
    return icons[badge] || Tag;
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      hot: '#dc2626',
      new: '#2563eb',
      discount: '#16a34a',
      popular: '#f59e0b',
      recommended: '#ec4899',
      spicy: '#dc2626',
    };
    return colors[badge] || '#667c67';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4] pb-20">
      {/* Header - Continuing exactly as before but using icon components */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#667c67] to-[#526250] text-white shadow-xl">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/admin')}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-sm flex items-center gap-2">
                  <ChefHat className="w-7 h-7" />
                  Menu Management System
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  Complete control over menu types, categories, and items
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white/70" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#667c67] text-white">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id} className="bg-[#667c67] text-white">
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  const exportData = {
                    branch: selectedBranch?.name || 'All Branches',
                    menuTypes: filteredMenuTypes,
                    categories: filteredCategories,
                    items: filteredMenuItems,
                    stats,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `menu-data-${selectedBranch?.name || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Menu Types', value: stats.menuTypes, icon: Package, color: 'bg-blue-500/20' },
              { label: 'Categories', value: stats.categories, icon: Grid3x3, color: 'bg-green-500/20' },
              { label: 'Menu Items', value: stats.items, icon: UtensilsCrossed, color: 'bg-purple-500/20' },
              { label: 'Featured', value: stats.featured, icon: Star, color: 'bg-yellow-500/20' },
              { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'bg-red-500/20' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className={`${stat.color} backdrop-blur-sm rounded-xl p-3 text-center`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white/70" />
                    <div className="text-white/70 text-xs font-medium">{stat.label}</div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t border-white/20 pt-4 mt-4">
            {[
              { id: 'menu-types', label: 'Menu Types', icon: Package },
              { id: 'categories', label: 'Categories', icon: Grid3x3 },
              { id: 'items', label: 'Menu Items', icon: UtensilsCrossed },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#667c67] shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Branch Info Banner */}
        {selectedBranchId !== 'all' && selectedBranch && (
          <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Viewing: {selectedBranch.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Showing menu data for this branch (including global items)
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Search and Actions */}
        <GlassCard variant="elevated" className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab === 'menu-types' ? 'menu types' : activeTab === 'categories' ? 'categories' : 'items'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === 'items' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#667c67] text-white' : ''}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#667c67] text-white' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Button
              onClick={() => {
                if (activeTab === 'menu-types') {
                  const newMT = createNewMenuType();
                  if (selectedBranchId !== 'all') {
                    newMT.branch_specific = true;
                    newMT.branch_ids = [selectedBranchId];
                  }
                  setEditingMenuType(newMT);
                  setShowAddMenuType(true);
                } else if (activeTab === 'categories') {
                  const newCat = createNewCategory();
                  if (selectedBranchId !== 'all') {
                    newCat.branch_specific = true;
                    newCat.branch_ids = [selectedBranchId];
                  }
                  setEditingCategory(newCat);
                  setShowAddCategory(true);
                } else {
                  const newItem = createNewItem();
                  if (selectedBranchId !== 'all') {
                    newItem.branch_specific = true;
                    newItem.branch_ids = [selectedBranchId];
                  }
                  setEditingItem(newItem);
                  setUploadedImage(null);
                  setShowAddItem(true);
                }
              }}
              className="bg-[#667c67] hover:bg-[#526250]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === 'menu-types' ? 'Menu Type' : activeTab === 'categories' ? 'Category' : 'Item'}
            </Button>
          </div>
        </GlassCard>

        {/* MENU TYPES TAB */}
        {activeTab === 'menu-types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedMenuTypes.length === 0 ? (
              <GlassCard variant="default" className="col-span-full p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">No menu types found</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search' : 'Create your first menu type to get started'}
                </p>
              </GlassCard>
            ) : (
              searchedMenuTypes.map((menuType, index) => {
                const IconComponent = getIconByName(menuType.icon);
                return (
                  <motion.div
                    key={menuType.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard 
                      variant="elevated" 
                      className={`p-6 ${menuType.enabled ? 'border-2' : 'opacity-60'}`}
                      style={{ borderColor: menuType.enabled ? menuType.color : '#e5e7eb' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${menuType.color}20` }}
                          >
                            <IconComponent 
                              className="w-10 h-10" 
                              style={{ color: menuType.color }}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: menuType.color }}>
                              {menuType.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Order: #{menuType.display_order}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMenuType(menuType.id)}
                            className={menuType.enabled ? 'text-green-600' : 'text-gray-400'}
                          >
                            {menuType.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingMenuType(menuType);
                              setShowAddMenuType(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => duplicateMenuType(menuType)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMenuType(menuType.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Branch Assignment */}
                      {menuType.branch_specific && menuType.branch_ids && menuType.branch_ids.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                            <Building2 className="w-4 h-4" />
                            {menuType.branch_ids.map(id => 
                              branches.find(b => b.id === id)?.name
                            ).join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold" style={{ color: menuType.color }}>
                            {categories.filter(c => c.menu_type_id === menuType.id && c.enabled).length}
                          </div>
                          <div className="text-xs text-gray-600">Categories</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold" style={{ color: menuType.color }}>
                            {menuItems.filter(i => i.menu_type_id === menuType.id && i.enabled).length}
                          </div>
                          <div className="text-xs text-gray-600">Items</div>
                        </div>
                      </div>

                      {/* Translations Preview */}
                      <div className="mt-4 pt-4 border-t text-xs space-y-1 text-gray-600">
                        <div><span className="font-semibold">EN:</span> {menuType.translations.en.name}</div>
                        <div><span className="font-semibold">AR:</span> {menuType.translations.ar.name}</div>
                        <div><span className="font-semibold">RU:</span> {menuType.translations.ru.name}</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Categories and Items tabs will use the same icon rendering pattern */}
        {/* For brevity, I'll show the key parts that change for Categories */}
        
        {activeTab === 'categories' && (
          <>
            {!selectedMenuTypeId && (
              <GlassCard variant="elevated" className="p-4">
                <div className="flex flex-wrap gap-2">
                  {filteredMenuTypes.filter(mt => mt.enabled).map(menuType => {
                    const IconComponent = getIconByName(menuType.icon);
                    return (
                      <Button
                        key={menuType.id}
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMenuTypeId(menuType.id)}
                        className="gap-2"
                        style={{ borderColor: menuType.color }}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: menuType.color }} />
                        {menuType.name}
                      </Button>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {selectedMenuTypeId && (
              <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const menuType = filteredMenuTypes.find(mt => mt.id === selectedMenuTypeId);
                      const IconComponent = menuType ? getIconByName(menuType.icon) : Package;
                      return (
                        <>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${menuType?.color || '#667c67'}20` }}>
                            <IconComponent className="w-7 h-7" style={{ color: menuType?.color || '#667c67' }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {menuType?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {searchedCategories.length} categories
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMenuTypeId('')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filter
                  </Button>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchedCategories.length === 0 ? (
                <GlassCard variant="default" className="col-span-full p-12 text-center">
                  <Grid3x3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No categories found</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first category to get started'}
                  </p>
                </GlassCard>
              ) : (
                searchedCategories.map((category, index) => {
                  const menuType = filteredMenuTypes.find(mt => mt.id === category.menu_type_id);
                  const CategoryIcon = getIconByName(category.icon);
                  const MenuTypeIcon = menuType ? getIconByName(menuType.icon) : Package;
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard 
                        variant="elevated" 
                        className={`p-6 ${category.enabled ? 'border-l-4' : 'opacity-60'}`}
                        style={{ borderLeftColor: category.enabled ? category.color : '#e5e7eb' }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <CategoryIcon 
                                className="w-8 h-8" 
                                style={{ color: category.color }}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold" style={{ color: category.color }}>
                                {category.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MenuTypeIcon className="w-4 h-4" style={{ color: menuType?.color }} />
                                <span>{menuType?.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCategory(category.id)}
                              className={category.enabled ? 'text-green-600' : 'text-gray-400'}
                            >
                              {category.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCategory(category);
                                setShowAddCategory(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => duplicateCategory(category)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Branch Assignment */}
                        {category.branch_specific && category.branch_ids && category.branch_ids.length > 0 && (
                          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                              <Building2 className="w-3 h-3" />
                              {category.branch_ids.map(id => 
                                branches.find(b => b.id === id)?.name
                              ).join(', ')}
                            </div>
                          </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold" style={{ color: category.color }}>
                            {menuItems.filter(i => i.category_id === category.id && i.enabled).length}
                          </div>
                          <div className="text-xs text-gray-600">Menu Items</div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-3"
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setActiveTab('items');
                          }}
                        >
                          View Items
                        </Button>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* MENU ITEMS TAB - Similar pattern but showing items */}
        {activeTab === 'items' && (
          <>
            {!selectedCategoryId && !selectedMenuTypeId && (
              <GlassCard variant="elevated" className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Filter by Menu Type</label>
                    <div className="flex flex-wrap gap-2">
                      {filteredMenuTypes.filter(mt => mt.enabled).map(menuType => {
                        const IconComponent = getIconByName(menuType.icon);
                        return (
                          <Button
                            key={menuType.id}
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMenuTypeId(menuType.id)}
                            className="gap-2"
                          >
                            <IconComponent className="w-4 h-4" style={{ color: menuType.color }} />
                            {menuType.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {(selectedCategoryId || selectedMenuTypeId) && (
              <GlassCard variant="elevated" className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedCategoryId ? (
                      (() => {
                        const category = filteredCategories.find(c => c.id === selectedCategoryId);
                        const IconComponent = category ? getIconByName(category.icon) : Package;
                        return (
                          <>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category?.color || '#667c67'}20` }}>
                              <IconComponent className="w-7 h-7" style={{ color: category?.color || '#667c67' }} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {category?.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {searchedMenuItems.length} items
                              </p>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      (() => {
                        const menuType = filteredMenuTypes.find(mt => mt.id === selectedMenuTypeId);
                        const IconComponent = menuType ? getIconByName(menuType.icon) : Package;
                        return (
                          <>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${menuType?.color || '#667c67'}20` }}>
                              <IconComponent className="w-7 h-7" style={{ color: menuType?.color || '#667c67' }} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {menuType?.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {searchedMenuItems.length} items
                              </p>
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategoryId('');
                      setSelectedMenuTypeId('');
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filter
                  </Button>
                </div>
              </GlassCard>
            )}

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {searchedMenuItems.length === 0 ? (
                <GlassCard variant="default" className={`${viewMode === 'grid' ? 'col-span-full' : ''} p-12 text-center`}>
                  <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No menu items found</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first menu item to get started'}
                  </p>
                </GlassCard>
              ) : (
                searchedMenuItems.map((item, index) => {
                  const category = filteredCategories.find(c => c.id === item.category_id);
                  const CategoryIcon = category ? getIconByName(category.icon) : Package;
                  const hasDiscount = item.original_price && item.original_price > item.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((item.original_price! - item.price) / item.original_price!) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <GlassCard 
                        variant="elevated" 
                        className={`${item.enabled ? '' : 'opacity-60'} hover:shadow-xl transition-all overflow-hidden`}
                      >
                        {/* Image */}
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UtensilsCrossed className="w-16 h-16 text-gray-300" />
                            </div>
                          )}
                          
                          {/* Badges Overlay */}
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {item.badges.map(badge => {
                              const Icon = getBadgeIcon(badge);
                              const color = getBadgeColor(badge);
                              return (
                                <div
                                  key={badge}
                                  className="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm"
                                  style={{ 
                                    backgroundColor: `${color}dd`,
                                    color: 'white'
                                  }}
                                >
                                  <Icon className="w-3 h-3" />
                                  {badge}
                                </div>
                              );
                            })}
                          </div>

                          {/* Stock Status */}
                          {item.stock_status !== 'in_stock' && (
                            <div className="absolute top-2 right-2">
                              <Badge className={
                                item.stock_status === 'out_of_stock' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-yellow-500 text-white'
                              }>
                                {item.stock_status === 'out_of_stock' ? '✕ Out' : '⚠ Low'}
                              </Badge>
                            </div>
                          )}

                          {/* Featured Star */}
                          {item.featured && (
                            <div className="absolute bottom-2 right-2">
                              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                                <Star className="w-5 h-5 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="mb-3">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-900 flex-1">
                                {item.name}
                              </h3>
                              {item.enabled ? (
                                <Badge className="bg-green-100 text-green-700">● Active</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-700">○ Hidden</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <CategoryIcon className="w-4 h-4" style={{ color: category?.color }} />
                              <span>{category?.name}</span>
                            </div>
                          </div>

                          {/* Branch Assignment */}
                          {item.branch_specific && item.branch_ids && item.branch_ids.length > 0 && (
                            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
                                <Building2 className="w-3 h-3" />
                                {item.branch_ids.map(id => 
                                  branches.find(b => b.id === id)?.name
                                ).filter(Boolean).join(', ')}
                              </div>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold text-[#667c67]">
                                ${item.price.toFixed(2)}
                              </div>
                              {hasDiscount && (
                                <>
                                  <div className="text-lg text-gray-400 line-through">
                                    ${item.original_price!.toFixed(2)}
                                  </div>
                                  <Badge className="bg-green-500 text-white">
                                    -{discountPercent}%
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <Clock className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                              <div className="text-xs font-semibold">{item.preparation_time}m</div>
                            </div>
                            {item.calories && (
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <Flame className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                                <div className="text-xs font-semibold">{item.calories} cal</div>
                              </div>
                            )}
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <Target className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                              <div className="text-xs font-semibold">#{item.display_order}</div>
                            </div>
                          </div>

                          {/* Dietary Tags */}
                          {item.dietary_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.dietary_tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag === 'vegan' && <Leaf className="w-3 h-3 mr-1" />}
                                  {tag === 'gluten-free' && <Wheat className="w-3 h-3 mr-1" />}
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleItem(item.id)}
                              className={item.enabled ? 'border-red-200 text-red-600' : 'border-green-200 text-green-600'}
                            >
                              {item.enabled ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                              {item.enabled ? 'Hide' : 'Show'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item);
                                setUploadedImage(item.image_url || null);
                                setShowAddItem(true);
                              }}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => duplicateItem(item)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Menu Type Modal */}
      <AnimatePresence>
        {showAddMenuType && editingMenuType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowAddMenuType(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8"
            >
              <GlassCard variant="elevated" className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {menuTypes.find(mt => mt.id === editingMenuType.id) ? 'Edit' : 'Create'} Menu Type
                  </h3>
                  <button
                    onClick={() => setShowAddMenuType(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Name (English) *</label>
                      <Input
                        value={editingMenuType.name}
                        onChange={(e) => setEditingMenuType({ 
                          ...editingMenuType, 
                          name: e.target.value,
                          translations: {
                            ...editingMenuType.translations,
                            en: { ...editingMenuType.translations.en, name: e.target.value }
                          }
                        })}
                        placeholder="e.g., Main Menu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Icon *</label>
                      <IconPicker
                        selectedIcon={editingMenuType.icon}
                        onSelect={(iconName) => setEditingMenuType({ ...editingMenuType, icon: iconName })}
                        color={editingMenuType.color}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Color *</label>
                      <Input
                        type="color"
                        value={editingMenuType.color}
                        onChange={(e) => setEditingMenuType({ ...editingMenuType, color: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Display Order</label>
                      <Input
                        type="number"
                        value={editingMenuType.display_order}
                        onChange={(e) => setEditingMenuType({ 
                          ...editingMenuType, 
                          display_order: parseInt(e.target.value) || 1 
                        })}
                      />
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-bold mb-3">Translations</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Arabic Name</label>
                        <Input
                          value={editingMenuType.translations.ar.name}
                          onChange={(e) => setEditingMenuType({
                            ...editingMenuType,
                            translations: {
                              ...editingMenuType.translations,
                              ar: { ...editingMenuType.translations.ar, name: e.target.value }
                            }
                          })}
                          placeholder="القائمة الرئيسية"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Russian Name</label>
                        <Input
                          value={editingMenuType.translations.ru.name}
                          onChange={(e) => setEditingMenuType({
                            ...editingMenuType,
                            translations: {
                              ...editingMenuType.translations,
                              ru: { ...editingMenuType.translations.ru, name: e.target.value }
                            }
                          })}
                          placeholder="Основное меню"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Kyrgyz Name</label>
                        <Input
                          value={editingMenuType.translations.ky.name}
                          onChange={(e) => setEditingMenuType({
                            ...editingMenuType,
                            translations: {
                              ...editingMenuType.translations,
                              ky: { ...editingMenuType.translations.ky, name: e.target.value }
                            }
                          })}
                          placeholder="Негизги меню"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branch Assignment */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingMenuType.branch_specific}
                        onChange={(e) => setEditingMenuType({ 
                          ...editingMenuType, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked ? [] : undefined
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Branch Specific</span>
                      <Info className="w-4 h-4 text-gray-400" />
                    </label>
                    {editingMenuType.branch_specific && (
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingMenuType.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingMenuType.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingMenuType({
                                  ...editingMenuType,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = menuTypes.find(mt => mt.id === editingMenuType.id);
                        if (existing) {
                          const updated = menuTypes.map(mt => 
                            mt.id === editingMenuType.id 
                              ? { ...editingMenuType, updated_at: new Date() }
                              : mt
                          );
                          saveMenuTypes(updated);
                        } else {
                          saveMenuTypes([...menuTypes, editingMenuType]);
                        }
                        setShowAddMenuType(false);
                        setEditingMenuType(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Menu Type
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddMenuType(false);
                        setEditingMenuType(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Category Modal - Similar pattern with IconPicker */}
      <AnimatePresence>
        {showAddCategory && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowAddCategory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8"
            >
              <GlassCard variant="elevated" className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {categories.find(c => c.id === editingCategory.id) ? 'Edit' : 'Create'} Category
                  </h3>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Menu Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Menu Type *</label>
                    <select
                      value={editingCategory.menu_type_id}
                      onChange={(e) => setEditingCategory({ 
                        ...editingCategory, 
                        menu_type_id: e.target.value 
                      })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                    >
                      {filteredMenuTypes.filter(mt => mt.enabled).map(mt => {
                        const IconComponent = getIconByName(mt.icon);
                        return (
                          <option key={mt.id} value={mt.id}>
                            {mt.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Name (English) *</label>
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ 
                          ...editingCategory, 
                          name: e.target.value,
                          translations: {
                            ...editingCategory.translations,
                            en: { ...editingCategory.translations.en, name: e.target.value }
                          }
                        })}
                        placeholder="e.g., Starters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Icon *</label>
                      <IconPicker
                        selectedIcon={editingCategory.icon}
                        onSelect={(iconName) => setEditingCategory({ ...editingCategory, icon: iconName })}
                        color={editingCategory.color}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Color *</label>
                      <Input
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Display Order</label>
                      <Input
                        type="number"
                        value={editingCategory.display_order}
                        onChange={(e) => setEditingCategory({ 
                          ...editingCategory, 
                          display_order: parseInt(e.target.value) || 1 
                        })}
                      />
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-bold mb-3">Translations</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Arabic Name</label>
                        <Input
                          value={editingCategory.translations.ar.name}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            translations: {
                              ...editingCategory.translations,
                              ar: { ...editingCategory.translations.ar, name: e.target.value }
                            }
                          })}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Russian Name</label>
                        <Input
                          value={editingCategory.translations.ru.name}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            translations: {
                              ...editingCategory.translations,
                              ru: { ...editingCategory.translations.ru, name: e.target.value }
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Kyrgyz Name</label>
                        <Input
                          value={editingCategory.translations.ky.name}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            translations: {
                              ...editingCategory.translations,
                              ky: { ...editingCategory.translations.ky, name: e.target.value }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branch Assignment */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingCategory.branch_specific}
                        onChange={(e) => setEditingCategory({ 
                          ...editingCategory, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked ? [] : undefined
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Branch Specific</span>
                    </label>
                    {editingCategory.branch_specific && (
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingCategory.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingCategory.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingCategory({
                                  ...editingCategory,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = categories.find(c => c.id === editingCategory.id);
                        if (existing) {
                          const updated = categories.map(c => 
                            c.id === editingCategory.id 
                              ? { ...editingCategory, updated_at: new Date() }
                              : c
                          );
                          saveCategories(updated);
                        } else {
                          saveCategories([...categories, editingCategory]);
                        }
                        setShowAddCategory(false);
                        setEditingCategory(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Category
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddCategory(false);
                        setEditingCategory(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Menu Item Modal - Using the same modal from before with image upload */}
      <AnimatePresence>
        {showAddItem && editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto"
            onClick={() => setShowAddItem(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl my-8"
            >
              <GlassCard variant="elevated" className="p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {menuItems.find(i => i.id === editingItem.id) ? 'Edit' : 'Create'} Menu Item
                  </h3>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Item Image</label>
                    <div className="flex gap-4">
                      <div 
                        className="w-48 h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#667c67] transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage || editingItem.image_url ? (
                          <img 
                            src={uploadedImage || editingItem.image_url} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <div className="text-xs text-gray-500">Click to upload</div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-2">
                          Upload a high-quality image (recommended: 800x600px, max 2MB)
                        </div>
                        {(uploadedImage || editingItem.image_url) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUploadedImage(null);
                              setEditingItem({ ...editingItem, image_url: undefined });
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Type & Category */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Menu Type *</label>
                      <select
                        value={editingItem.menu_type_id}
                        onChange={(e) => {
                          setEditingItem({ 
                            ...editingItem, 
                            menu_type_id: e.target.value,
                            category_id: ''
                          });
                        }}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        {filteredMenuTypes.filter(mt => mt.enabled).map(mt => (
                          <option key={mt.id} value={mt.id}>
                            {mt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category *</label>
                      <select
                        value={editingItem.category_id}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          category_id: e.target.value 
                        })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        {filteredCategories
                          .filter(c => c.menu_type_id === editingItem.menu_type_id && c.enabled)
                          .map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Department</label>
                      <select
                        value={editingItem.department_id || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          department_id: e.target.value || undefined
                        })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        <option value="">No Department</option>
                        {(() => {
                          const departments = JSON.parse(localStorage.getItem('echefs_departments') || '[]');
                          return departments.map((dept: any) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ));
                        })()}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Route orders to specific kitchen department</p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Item Name (English) *</label>
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          name: e.target.value,
                          translations: {
                            ...editingItem.translations,
                            en: { ...editingItem.translations.en, name: e.target.value }
                          }
                        })}
                        placeholder="e.g., Grilled Salmon"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Description (English) *</label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          description: e.target.value,
                          translations: {
                            ...editingItem.translations,
                            en: { ...editingItem.translations.en, description: e.target.value }
                          }
                        })}
                        placeholder="Describe your dish..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price * ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          price: parseFloat(e.target.value) || 0 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Original Price ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.original_price || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          original_price: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        placeholder="For discounts"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Prep Time (min)</label>
                      <Input
                        type="number"
                        value={editingItem.preparation_time}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          preparation_time: parseInt(e.target.value) || 15 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Calories</label>
                      <Input
                        type="number"
                        value={editingItem.calories || ''}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          calories: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Badges</label>
                    <div className="flex flex-wrap gap-2">
                      {['hot', 'new', 'discount', 'popular', 'recommended', 'spicy'].map(badge => {
                        const Icon = getBadgeIcon(badge);
                        const color = getBadgeColor(badge);
                        const isSelected = editingItem.badges.includes(badge);
                        return (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => {
                              const newBadges = isSelected
                                ? editingItem.badges.filter(b => b !== badge)
                                : [...editingItem.badges, badge];
                              setEditingItem({ ...editingItem, badges: newBadges });
                            }}
                            className={`px-3 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                              isSelected 
                                ? 'text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={isSelected ? { backgroundColor: color } : {}}
                          >
                            <Icon className="w-4 h-4" />
                            {badge}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary Tags */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Dietary Information</label>
                    <div className="flex flex-wrap gap-2">
                      {['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal', 'kosher'].map(tag => {
                        const isSelected = editingItem.dietary_tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const newTags = isSelected
                                ? editingItem.dietary_tags.filter(t => t !== tag)
                                : [...editingItem.dietary_tags, tag];
                              setEditingItem({ ...editingItem, dietary_tags: newTags });
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tag === 'vegan' && <Leaf className="w-4 h-4 inline mr-1" />}
                            {tag === 'gluten-free' && <Wheat className="w-4 h-4 inline mr-1" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Stock Status</label>
                      <select
                        value={editingItem.stock_status}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          stock_status: e.target.value as any 
                        })}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-white focus:border-[#667c67] outline-none"
                      >
                        <option value="in_stock">✓ In Stock</option>
                        <option value="low_stock">⚠ Low Stock</option>
                        <option value="out_of_stock">✕ Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Display Order</label>
                      <Input
                        type="number"
                        value={editingItem.display_order}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          display_order: parseInt(e.target.value) || 1 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 opacity-0">Featured</label>
                      <label className="flex items-center gap-2 cursor-pointer p-2 border-2 border-gray-200 rounded-lg hover:border-[#667c67]">
                        <input
                          type="checkbox"
                          checked={editingItem.featured}
                          onChange={(e) => setEditingItem({ 
                            ...editingItem, 
                            featured: e.target.checked 
                          })}
                          className="w-5 h-5"
                        />
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-semibold">Featured Item</span>
                      </label>
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-bold mb-3">Translations</h4>
                    <div className="space-y-4">
                      {['ar', 'ru', 'ky'].map((lang) => (
                        <div key={lang} className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              {lang.toUpperCase()} Name
                            </label>
                            <Input
                              value={editingItem.translations[lang as keyof typeof editingItem.translations].name}
                              onChange={(e) => setEditingItem({
                                ...editingItem,
                                translations: {
                                  ...editingItem.translations,
                                  [lang]: { 
                                    ...editingItem.translations[lang as keyof typeof editingItem.translations], 
                                    name: e.target.value 
                                  }
                                }
                              })}
                              className={lang === 'ar' ? 'text-right' : ''}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              {lang.toUpperCase()} Description
                            </label>
                            <Input
                              value={editingItem.translations[lang as keyof typeof editingItem.translations].description}
                              onChange={(e) => setEditingItem({
                                ...editingItem,
                                translations: {
                                  ...editingItem.translations,
                                  [lang]: { 
                                    ...editingItem.translations[lang as keyof typeof editingItem.translations], 
                                    description: e.target.value 
                                  }
                                }
                              })}
                              className={lang === 'ar' ? 'text-right' : ''}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branch Assignment */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.branch_specific}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          branch_specific: e.target.checked,
                          branch_ids: e.target.checked ? [] : undefined
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Branch Specific</span>
                      <Info className="w-4 h-4 text-gray-400" />
                    </label>
                    {editingItem.branch_specific && (
                      <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 space-y-2">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={editingItem.branch_ids?.includes(branch.id) || false}
                              onChange={(e) => {
                                const currentBranches = editingItem.branch_ids || [];
                                const newBranches = e.target.checked
                                  ? [...currentBranches, branch.id]
                                  : currentBranches.filter(id => id !== branch.id);
                                setEditingItem({
                                  ...editingItem,
                                  branch_ids: newBranches
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1 bg-[#667c67] hover:bg-[#526250]"
                      onClick={() => {
                        const existing = menuItems.find(i => i.id === editingItem.id);
                        if (existing) {
                          const updated = menuItems.map(i => 
                            i.id === editingItem.id 
                              ? { ...editingItem, updated_at: new Date() }
                              : i
                          );
                          saveMenuItems(updated);
                        } else {
                          saveMenuItems([...menuItems, editingItem]);
                        }
                        setShowAddItem(false);
                        setEditingItem(null);
                        setUploadedImage(null);
                      }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Menu Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddItem(false);
                        setEditingItem(null);
                        setUploadedImage(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
