# eChefs Platform - Multi-Language Translations

## Supported Languages

| Code | Language | Native Name | Direction | Flag |
|------|----------|-------------|-----------|------|
| en   | English  | English     | LTR       | 🇬🇧   |
| ar   | Arabic   | العربية     | RTL       | 🇸🇦   |
| ru   | Russian  | Русский     | LTR       | 🇷🇺   |
| ky   | Kyrgyz   | Кыргызча    | LTR       | 🇰🇬   |

## Translation Keys

### Common UI Elements

```typescript
const translations = {
  en: {
    // Navigation
    home: "Home",
    menu: "Menu",
    orders: "Orders",
    kitchen: "Kitchen",
    settings: "Settings",
    logout: "Logout",
    
    // Actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    close: "Close",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    cancelled: "Cancelled",
    
    // Common phrases
    loading: "Loading...",
    noResults: "No results found",
    error: "An error occurred",
    success: "Success",
    welcome: "Welcome",
    selectLanguage: "Select Language",
  },
  
  ar: {
    // Navigation
    home: "الرئيسية",
    menu: "القائمة",
    orders: "الطلبات",
    kitchen: "المطبخ",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    
    // Actions
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    submit: "إرسال",
    search: "بحث",
    filter: "تصفية",
    clear: "مسح",
    close: "إغلاق",
    
    // Status
    active: "نشط",
    inactive: "غير نشط",
    pending: "قيد الانتظار",
    preparing: "قيد التحضير",
    ready: "جاهز",
    served: "تم التقديم",
    cancelled: "ملغي",
    
    // Common phrases
    loading: "جاري التحميل...",
    noResults: "لا توجد نتائج",
    error: "حدث خطأ",
    success: "نجح",
    welcome: "مرحباً",
    selectLanguage: "اختر اللغة",
  },
  
  ru: {
    // Navigation
    home: "Главная",
    menu: "Меню",
    orders: "Заказы",
    kitchen: "Кухня",
    settings: "Настройки",
    logout: "Выход",
    
    // Actions
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отмена",
    confirm: "Подтвердить",
    back: "Назад",
    next: "Далее",
    submit: "Отправить",
    search: "Поиск",
    filter: "Фильтр",
    clear: "Очистить",
    close: "Закрыть",
    
    // Status
    active: "Активный",
    inactive: "Неактивный",
    pending: "В ожидании",
    preparing: "Готовится",
    ready: "Готов",
    served: "Подан",
    cancelled: "Отменен",
    
    // Common phrases
    loading: "Загрузка...",
    noResults: "Результаты не найдены",
    error: "Произошла ошибка",
    success: "Успех",
    welcome: "Добро пожаловать",
    selectLanguage: "Выберите язык",
  },
  
  ky: {
    // Navigation
    home: "Башкы",
    menu: "Меню",
    orders: "Буйрутмалар",
    kitchen: "Ашкана",
    settings: "Жөндөөлөр",
    logout: "Чыгуу",
    
    // Actions
    add: "Кошуу",
    edit: "Өзгөртүү",
    delete: "Өчүрүү",
    save: "Сактоо",
    cancel: "Жокко чыгаруу",
    confirm: "Ырастоо",
    back: "Артка",
    next: "Кийинки",
    submit: "Жиберүү",
    search: "Издөө",
    filter: "Чыпкалоо",
    clear: "Тазалоо",
    close: "Жабуу",
    
    // Status
    active: "Активдүү",
    inactive: "Активдүү эмес",
    pending: "Күтүүдө",
    preparing: "Даярдалууда",
    ready: "Даяр",
    served: "Берилди",
    cancelled: "Жокко чыгарылды",
    
    // Common phrases
    loading: "Жүктөлүүдө...",
    noResults: "Жыйынтык табылган жок",
    error: "Ката кетти",
    success: "Ийгиликтүү",
    welcome: "Кош келиңиз",
    selectLanguage: "Тилди тандаңыз",
  }
}
```

### Waiter Module Translations

```typescript
const waiterTranslations = {
  en: {
    // Table Selection
    selectTable: "Select Table",
    tableRegion: "Table Region",
    indoor: "Indoor",
    outdoor: "Outdoor",
    vip: "VIP Section",
    available: "Available",
    occupied: "Occupied",
    reserved: "Reserved",
    
    // Order Taking
    newOrder: "New Order",
    addToCart: "Add to Cart",
    viewCart: "View Cart",
    checkout: "Checkout",
    customerName: "Customer Name",
    specialInstructions: "Special Instructions",
    orderType: "Order Type",
    dineIn: "Dine In",
    takeaway: "Takeaway",
    delivery: "Delivery",
    
    // Menu
    categories: "Categories",
    allCategories: "All Categories",
    mainCourses: "Main Courses",
    appetizers: "Appetizers",
    drinks: "Drinks",
    desserts: "Desserts",
    
    // Modifiers
    addOns: "Add-ons",
    remove: "Remove",
    extraCheese: "Extra Cheese",
    noCheese: "No Cheese",
    spicy: "Make it Spicy",
    noOnions: "No Onions",
    
    // Cart
    items: "Items",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    emptyCart: "Cart is empty",
    removeItem: "Remove Item",
    
    // Messages
    itemAdded: "Item added to cart",
    itemRemoved: "Item removed from cart",
    orderPlaced: "Order placed successfully",
    orderFailed: "Failed to place order",
    selectTableFirst: "Please select a table first",
  },
  
  ar: {
    // Table Selection
    selectTable: "اختر الطاولة",
    tableRegion: "منطقة الطاولات",
    indoor: "داخلي",
    outdoor: "خارجي",
    vip: "قسم VIP",
    available: "متاحة",
    occupied: "مشغولة",
    reserved: "محجوزة",
    
    // Order Taking
    newOrder: "طلب جديد",
    addToCart: "إضافة للسلة",
    viewCart: "عرض السلة",
    checkout: "إتمام الطلب",
    customerName: "اسم العميل",
    specialInstructions: "ملاحظات خاصة",
    orderType: "نوع الطلب",
    dineIn: "تناول هنا",
    takeaway: "سفري",
    delivery: "توصيل",
    
    // Menu
    categories: "الفئات",
    allCategories: "جميع الفئات",
    mainCourses: "الأطباق الرئيسية",
    appetizers: "المقبلات",
    drinks: "المشروبات",
    desserts: "الحلويات",
    
    // Modifiers
    addOns: "إضافات",
    remove: "إزالة",
    extraCheese: "جبنة إضافية",
    noCheese: "بدون جبنة",
    spicy: "حار",
    noOnions: "بدون بصل",
    
    // Cart
    items: "الأصناف",
    subtotal: "المجموع الفرعي",
    tax: "الضريبة",
    total: "الإجمالي",
    emptyCart: "السلة فارغة",
    removeItem: "حذف الصنف",
    
    // Messages
    itemAdded: "تمت الإضافة للسلة",
    itemRemoved: "تمت الإزالة من السلة",
    orderPlaced: "تم إرسال الطلب بنجاح",
    orderFailed: "فشل إرسال الطلب",
    selectTableFirst: "الرجاء اختيار الطاولة أولاً",
  },
  
  ru: {
    // Table Selection
    selectTable: "Выберите столик",
    tableRegion: "Зона столиков",
    indoor: "Внутри",
    outdoor: "На улице",
    vip: "VIP зона",
    available: "Доступен",
    occupied: "Занят",
    reserved: "Зарезервирован",
    
    // Order Taking
    newOrder: "Новый заказ",
    addToCart: "Добавить в корзину",
    viewCart: "Просмотр корзины",
    checkout: "Оформить заказ",
    customerName: "Имя клиента",
    specialInstructions: "Особые пожелания",
    orderType: "Тип заказа",
    dineIn: "В зале",
    takeaway: "С собой",
    delivery: "Доставка",
    
    // Menu
    categories: "Категории",
    allCategories: "Все категории",
    mainCourses: "Основные блюда",
    appetizers: "Закуски",
    drinks: "Напитки",
    desserts: "Десерты",
    
    // Modifiers
    addOns: "Дополнения",
    remove: "Убрать",
    extraCheese: "Доп. сыр",
    noCheese: "Без сыра",
    spicy: "Острое",
    noOnions: "Без лука",
    
    // Cart
    items: "Позиции",
    subtotal: "Промежуточный итог",
    tax: "Налог",
    total: "Итого",
    emptyCart: "Корзина пуста",
    removeItem: "Удалить позицию",
    
    // Messages
    itemAdded: "Добавлено в корзину",
    itemRemoved: "Удалено из корзины",
    orderPlaced: "Заказ успешно размещен",
    orderFailed: "Не удалось разместить заказ",
    selectTableFirst: "Пожалуйста, сначала выберите столик",
  },
  
  ky: {
    // Table Selection
    selectTable: "Столду тандаңыз",
    tableRegion: "Столдордун аймагы",
    indoor: "Ички",
    outdoor: "Сырткы",
    vip: "VIP бөлүм",
    available: "Бош",
    occupied: "Ээлеген",
    reserved: "Броньдолгон",
    
    // Order Taking
    newOrder: "Жаңы буйрутма",
    addToCart: "Себетке кошуу",
    viewCart: "Себетти көрүү",
    checkout: "Буйрутма берүү",
    customerName: "Кардардын аты",
    specialInstructions: "Өзгөчө эскертмелер",
    orderType: "Буйрутманын түрү",
    dineIn: "Залда тамактануу",
    takeaway: "Алып кетүү",
    delivery: "Жеткирүү",
    
    // Menu
    categories: "Категориялар",
    allCategories: "Бардык категориялар",
    mainCourses: "Негизги тамактар",
    appetizers: "Ачуучу тамактар",
    drinks: "Суусундуктар",
    desserts: "Десерттер",
    
    // Modifiers
    addOns: "Кошумчалар",
    remove: "Алып салуу",
    extraCheese: "Кошумча сыр",
    noCheese: "Сырсыз",
    spicy: "Ачуу",
    noOnions: "Пиязсыз",
    
    // Cart
    items: "Буюмдар",
    subtotal: "Аралык сумма",
    tax: "Салык",
    total: "Жалпы",
    emptyCart: "Себет бош",
    removeItem: "Буюмду өчүрүү",
    
    // Messages
    itemAdded: "Себетке кошулду",
    itemRemoved: "Себеттен өчүрүлдү",
    orderPlaced: "Буйрутма ийгиликтүү берилди",
    orderFailed: "Буйрутма берүү бүтпөдү",
    selectTableFirst: "Адегенде столду тандаңыз",
  }
}
```

### Kitchen Module Translations

```typescript
const kitchenTranslations = {
  en: {
    kitchenDisplay: "Kitchen Display",
    newOrders: "New Orders",
    preparing: "Preparing",
    ready: "Ready",
    orderNumber: "Order #",
    table: "Table",
    waiter: "Waiter",
    startPreparing: "Start Preparing",
    markReady: "Mark as Ready",
    viewDetails: "View Details",
    preparationTime: "Prep Time",
    urgent: "Urgent",
    department: "Department",
  },
  
  ar: {
    kitchenDisplay: "شاشة المطبخ",
    newOrders: "طلبات جديدة",
    preparing: "قيد التحضير",
    ready: "جاهز",
    orderNumber: "طلب رقم",
    table: "طاولة",
    waiter: "نادل",
    startPreparing: "بدء التحضير",
    markReady: "تعليم كجاهز",
    viewDetails: "عرض التفاصيل",
    preparationTime: "وقت التحضير",
    urgent: "عاجل",
    department: "القسم",
  },
  
  ru: {
    kitchenDisplay: "Кухонный дисплей",
    newOrders: "Новые заказы",
    preparing: "Готовится",
    ready: "Готово",
    orderNumber: "Заказ №",
    table: "Столик",
    waiter: "Официант",
    startPreparing: "Начать готовить",
    markReady: "Отметить готовым",
    viewDetails: "Подробности",
    preparationTime: "Время приготовления",
    urgent: "Срочно",
    department: "Отдел",
  },
  
  ky: {
    kitchenDisplay: "Ашкананын экраны",
    newOrders: "Жаңы буйрутмалар",
    preparing: "Даярдалууда",
    ready: "Даяр",
    orderNumber: "Буйрутма №",
    table: "Стол",
    waiter: "Официант",
    startPreparing: "Даярдоону баштоо",
    markReady: "Даяр деп белгилөө",
    viewDetails: "Деталдарды көрүү",
    preparationTime: "Даярдоо убактысы",
    urgent: "Шашылыш",
    department: "Бөлүм",
  }
}
```

### Admin Module Translations

```typescript
const adminTranslations = {
  en: {
    // Branch Management
    branches: "Branches",
    addBranch: "Add Branch",
    editBranch: "Edit Branch",
    branchName: "Branch Name",
    address: "Address",
    phone: "Phone",
    activeStatus: "Active Status",
    
    // Department Management
    departments: "Departments",
    addDepartment: "Add Department",
    departmentName: "Department Name",
    assignedUsers: "Assigned Users",
    
    // Menu Management
    menuItems: "Menu Items",
    addMenuItem: "Add Menu Item",
    itemName: "Item Name",
    description: "Description",
    price: "Price",
    category: "Category",
    preparationTime: "Preparation Time (minutes)",
    stockStatus: "Stock Status",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    
    // User Management
    users: "Users",
    addUser: "Add User",
    userName: "User Name",
    email: "Email",
    role: "Role",
    superAdmin: "Super Admin",
    branchManager: "Branch Manager",
    departmentManager: "Department Manager",
    waiterStaff: "Waiter",
    kitchenStaff: "Kitchen Staff",
    
    // Analytics
    analytics: "Analytics",
    salesReport: "Sales Report",
    topItems: "Top Items",
    waiterPerformance: "Waiter Performance",
    revenue: "Revenue",
    ordersCount: "Orders Count",
    averageOrderValue: "Average Order Value",
  },
  
  ar: {
    // Branch Management
    branches: "الفروع",
    addBranch: "إضافة فرع",
    editBranch: "تعديل الفرع",
    branchName: "اسم الفرع",
    address: "العنوان",
    phone: "الهاتف",
    activeStatus: "حالة النشاط",
    
    // Department Management
    departments: "الأقسام",
    addDepartment: "إضافة قسم",
    departmentName: "اسم القسم",
    assignedUsers: "المستخدمون المعينون",
    
    // Menu Management
    menuItems: "عناصر القائمة",
    addMenuItem: "إضافة عنصر للقائمة",
    itemName: "اسم الصنف",
    description: "الوصف",
    price: "السعر",
    category: "الفئة",
    preparationTime: "وقت التحضير (دقائق)",
    stockStatus: "حالة المخزون",
    inStock: "متوفر",
    lowStock: "مخزون منخفض",
    outOfStock: "غير متوفر",
    
    // User Management
    users: "المستخدمون",
    addUser: "إضافة مستخدم",
    userName: "اسم المستخدم",
    email: "البريد الإلكتروني",
    role: "الدور",
    superAdmin: "مدير عام",
    branchManager: "مدير فرع",
    departmentManager: "مدير قسم",
    waiterStaff: "نادل",
    kitchenStaff: "موظف مطبخ",
    
    // Analytics
    analytics: "التحليلات",
    salesReport: "تقرير المبيعات",
    topItems: "الأصناف الأكثر طلباً",
    waiterPerformance: "أداء النوادل",
    revenue: "الإيرادات",
    ordersCount: "عدد الطلبات",
    averageOrderValue: "متوسط قيمة الطلب",
  },
  
  ru: {
    // Branch Management
    branches: "Филиалы",
    addBranch: "Добавить филиал",
    editBranch: "Редактировать филиал",
    branchName: "Название филиала",
    address: "Адрес",
    phone: "Телефон",
    activeStatus: "Статус активности",
    
    // Department Management
    departments: "Отделы",
    addDepartment: "Добавить отдел",
    departmentName: "Название отдела",
    assignedUsers: "Назначенные пользователи",
    
    // Menu Management
    menuItems: "Позиции меню",
    addMenuItem: "Добавить позицию",
    itemName: "Название блюда",
    description: "Описание",
    price: "Цена",
    category: "Категория",
    preparationTime: "Время приготовления (минуты)",
    stockStatus: "Статус наличия",
    inStock: "В наличии",
    lowStock: "Мало на складе",
    outOfStock: "Нет в наличии",
    
    // User Management
    users: "Пользователи",
    addUser: "Добавить пользователя",
    userName: "Имя пользователя",
    email: "Email",
    role: "Роль",
    superAdmin: "Супер админ",
    branchManager: "Менеджер филиала",
    departmentManager: "Менеджер отдела",
    waiterStaff: "Официант",
    kitchenStaff: "Кухонный работник",
    
    // Analytics
    analytics: "Аналитика",
    salesReport: "Отчет о продажах",
    topItems: "Топ блюд",
    waiterPerformance: "Производительность официантов",
    revenue: "Выручка",
    ordersCount: "Количество заказов",
    averageOrderValue: "Средний чек",
  },
  
  ky: {
    // Branch Management
    branches: "Филиалдар",
    addBranch: "Филиал кошуу",
    editBranch: "Филиалды өзгөртүү",
    branchName: "Филиалдын аты",
    address: "Дарек",
    phone: "Телефон",
    activeStatus: "Активдүүлүк статусу",
    
    // Department Management
    departments: "Бөлүмдөр",
    addDepartment: "Бөлүм кошуу",
    departmentName: "Бөлүмдүн аты",
    assignedUsers: "Дайындалган колдонуучулар",
    
    // Menu Management
    menuItems: "Менюнун пункттары",
    addMenuItem: "Пункт кошуу",
    itemName: "Тамактын аты",
    description: "Сүрөттөмө",
    price: "Баасы",
    category: "Категория",
    preparationTime: "Даярдоо убактысы (мүнөттөр)",
    stockStatus: "Запас статусу",
    inStock: "Бар",
    lowStock: "Аз калды",
    outOfStock: "Жок",
    
    // User Management
    users: "Колдонуучулар",
    addUser: "Колдонуучу кошуу",
    userName: "Колдонуучунун аты",
    email: "Email",
    role: "Ролу",
    superAdmin: "Супер админ",
    branchManager: "Филиал менеджери",
    departmentManager: "Бөлүм менеджери",
    waiterStaff: "Официант",
    kitchenStaff: "Ашкана кызматкери",
    
    // Analytics
    analytics: "Аналитика",
    salesReport: "Сатуу отчету",
    topItems: "Топ тамактар",
    waiterPerformance: "Официанттардын иштеши",
    revenue: "Киреше",
    ordersCount: "Буйрутмалардын саны",
    averageOrderValue: "Орточо чек",
  }
}
```

## Translation Patterns

### Conditional Translation
```typescript
// Pattern 1: Using i18n.language
{i18n.language === 'ar' ? 'نص عربي' : 'English text'}

// Pattern 2: Multi-language conditional
{i18n.language === 'ar' ? 'العربية' : 
 i18n.language === 'ru' ? 'Русский' : 
 i18n.language === 'ky' ? 'Кыргызча' : 'English'}

// Pattern 3: Object-based
const texts = {
  ar: 'النص العربي',
  en: 'English text',
  ru: 'Русский текст',
  ky: 'Кыргыз тексти'
}
{texts[i18n.language as keyof typeof texts]}
```

### Database-driven Translations
```typescript
// Fetch translations from database
const translations = await supabase
  .from('translations')
  .select('*')
  .eq('language_code', i18n.language)

// Use translations
const t = (key: string) => {
  const translation = translations.find(t => t.key === key)
  return translation?.value || key
}
```

### Pluralization
```typescript
// Pattern with count
const itemCount = 5
const text = i18n.language === 'ar' 
  ? `${itemCount} عناصر` 
  : i18n.language === 'ru'
  ? `${itemCount} ${itemCount === 1 ? 'элемент' : itemCount < 5 ? 'элемента' : 'элементов'}`
  : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
```

### Number Formatting
```typescript
// Currency
const price = 1250.50
const formattedPrice = new Intl.NumberFormat(i18n.language, {
  style: 'currency',
  currency: 'USD' // or 'KGS', 'RUB', 'SAR'
}).format(price)

// Number
const count = 1234567
const formattedNumber = new Intl.NumberFormat(i18n.language).format(count)
```

### Date Formatting
```typescript
const date = new Date()
const formattedDate = new Intl.DateTimeFormat(i18n.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(date)
```

## RTL Support Guidelines

### CSS for RTL
```css
/* Automatic direction based on language */
html[dir="rtl"] {
  direction: rtl;
}

/* Margin/Padding flip */
.ml-4 { margin-left: 1rem; }
.rtl\:mr-4:where([dir="rtl"], [dir="rtl"] *) { 
  margin-right: 1rem; 
  margin-left: 0; 
}

/* Tailwind RTL classes */
<div className="ml-4 rtl:mr-4 rtl:ml-0">
```

### Flexbox for RTL
```typescript
// Use justify-between instead of specific margins
<div className="flex justify-between items-center">
  <div>Left/Right content</div>
  <div>Right/Left content</div>
</div>
```

### Icons for RTL
```typescript
// Mirror icons in RTL
<ChevronLeft className={i18n.language === 'ar' ? 'rotate-180' : ''} />

// Or use logical directions
<ChevronLeft className="rtl:rotate-180" />
```

## Best Practices

1. **Always provide all 4 languages** for every text in the UI
2. **Use semantic keys** for translations (e.g., 'menu.addItem' not 'button1')
3. **Test RTL layout** for Arabic thoroughly
4. **Store multi-language data** in database with separate columns (name, name_ar, name_ru, name_ky)
5. **Use i18n.language** for conditionals, not hardcoded language checks
6. **Format numbers and dates** using Intl API for localization
7. **Provide fallback** to English if translation missing
8. **Keep strings short** - Arabic text is typically 20-30% longer than English
9. **Avoid string concatenation** - use template strings with proper grammar for each language
10. **Test with real content** in all languages before deployment

---

**This document provides all translation resources needed for the eChefs multi-language platform.**

**Last Updated:** March 26, 2026
