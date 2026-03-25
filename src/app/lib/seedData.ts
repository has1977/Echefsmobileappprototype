// Seed data for eChefs platform
import { db } from './database';
import { seedBranches } from './seed-branches';
import type { Branch, Category, MenuItem, MenuType } from './types';

export function seedDatabase() {
  // Check if already seeded
  const existingBranches = db.getBranches();
  if (existingBranches.length > 0) return;

  // Seed branches first
  seedBranches();

  // Seed categories for each menu type
  const categories: Omit<Category, 'id'>[] = [
    // Main Menu
    { translations: { en: 'Appetizers', ar: 'المقبلات', ru: 'Закуски', ky: 'Салкын тамактар' }, menuType: 'main', order: 1, enabled: true },
    { translations: { en: 'Salads', ar: 'السلطات', ru: 'Салаты', ky: 'Салаттар' }, menuType: 'main', order: 2, enabled: true },
    { translations: { en: 'Main Course', ar: 'الطبق الرئيسي', ru: 'Основные блюда', ky: 'Негизги тамактар' }, menuType: 'main', order: 3, enabled: true },
    { translations: { en: 'Pasta & Rice', ar: 'معكرونة وأرز', ru: 'Паста и рис', ky: 'Макарон жана күрүч' }, menuType: 'main', order: 4, enabled: true },
    { translations: { en: 'Seafood', ar: 'المأكولات البحرية', ru: 'Морепродукты', ky: 'Деңиз азыктары' }, menuType: 'main', order: 5, enabled: true },
    
    // Business Menu
    { translations: { en: 'Business Lunch', ar: 'غداء العمل', ru: 'Бизнес ланч', ky: 'Бизнес түшкү тамак' }, menuType: 'business', order: 1, enabled: true },
    { translations: { en: 'Executive Set', ar: 'طقم تنفيذي', ru: 'Исполнительный сет', ky: 'Башкаруучу топтом' }, menuType: 'business', order: 2, enabled: true },
    { translations: { en: 'Quick Meals', ar: 'وجبات سريعة', ru: 'Быстрые блюда', ky: 'Тез тамактар' }, menuType: 'business', order: 3, enabled: true },
    
    // Kids Menu
    { translations: { en: 'Kids Favorites', ar: 'المفضلة للأطفال', ru: 'Детские фавориты', ky: 'Балдар сүйгөн' }, menuType: 'kids', order: 1, enabled: true },
    { translations: { en: 'Healthy Options', ar: 'خيارات صحية', ru: 'Здоровые варианты', ky: 'Дени-соолукка пайдалуу' }, menuType: 'kids', order: 2, enabled: true },
    
    // Drinks
    { translations: { en: 'Hot Beverages', ar: 'مشروبات ساخنة', ru: 'Горячие напитки', ky: 'Ысык суусундуктар' }, menuType: 'drinks', order: 1, enabled: true },
    { translations: { en: 'Cold Beverages', ar: 'مشروبات باردة', ru: 'Холодные напитки', ky: 'Муздак суусундуктар' }, menuType: 'drinks', order: 2, enabled: true },
    { translations: { en: 'Fresh Juices', ar: 'عصائر طازجة', ru: 'Свежие соки', ky: 'Жаңы ширелер' }, menuType: 'drinks', order: 3, enabled: true },
    
    // Desserts Menu
    { translations: { en: 'Cakes & Pastries', ar: 'كعك ومعجنات', ru: 'Торты и выпечка', ky: 'Торттор жана пирогдор' }, menuType: 'desserts', order: 1, enabled: true },
    { translations: { en: 'Ice Cream', ar: 'آيس كريم', ru: 'Мороженое', ky: 'Балмуздак' }, menuType: 'desserts', order: 2, enabled: true },
  ];

  const addedCategories = categories.map(cat => db.addCategory(cat));

  // Seed menu items
  const menuItems: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>[] = [
    // ========================================
    // MAIN MENU - Appetizers
    // ========================================
    {
      translations: {
        en: { name: 'Bruschetta Trio', description: 'Three varieties of toasted bread with fresh toppings' },
        ar: { name: 'ثلاثي بروشيتا', description: 'ثلاثة أنواع من الخبز المحمص مع إضافات طازجة' },
        ru: { name: 'Трио брускетта', description: 'Три вида тостов со свежими начинками' },
        ky: { name: 'Брускетта үчөө', description: 'Жаңы үстүнө кошумча менен үч түрдүү тост' },
      },
      categoryId: addedCategories[0].id,
      menuType: 'main',
      price: 12.99,
      originalPrice: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
      badges: ['popular', 'discount'],
      dietaryTags: ['vegan'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 280,
      prepTime: 10,
    },
    {
      translations: {
        en: { name: 'Garlic Bread', description: 'Crispy baguette with garlic butter and herbs' },
        ar: { name: 'خبز بالثوم', description: 'باغيت مقرمش مع زبدة الثوم والأعشاب' },
        ru: { name: 'Чесночный хлеб', description: 'Хрустящий багет с чесночным маслом и травами' },
        ky: { name: 'Сарымсак нан', description: 'Кытырлаган багет сарымсак майы жана чөп менен' },
      },
      categoryId: addedCategories[0].id,
      menuType: 'main',
      price: 7.99,
      imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24f2cf?w=800',
      badges: ['popular'],
      dietaryTags: ['vegan'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 210,
      prepTime: 8,
    },
    {
      translations: {
        en: { name: 'Mozzarella Sticks', description: 'Breaded mozzarella served with marinara sauce' },
        ar: { name: 'أصابع الموتزاريلا', description: 'موتزاريلا مقلية مع صلصة المارينارا' },
        ru: { name: 'Палочки моцарелла', description: 'Панированная моцарелла с маринарой' },
        ky: { name: 'Моцарелла таякчалары', description: 'Панировкада моцарелла маринара менен' },
      },
      categoryId: addedCategories[0].id,
      menuType: 'main',
      price: 10.99,
      originalPrice: 13.99,
      imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800',
      badges: ['new', 'hot'],
      dietaryTags: ['gluten-free'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 3,
      calories: 340,
      prepTime: 12,
    },
    
    // ========================================
    // MAIN MENU - Salads
    // ========================================
    {
      translations: {
        en: { name: 'Caesar Salad', description: 'Crispy romaine, parmesan, croutons, classic dressing' },
        ar: { name: 'سلطة سيزر', description: 'خس مقرمش، بارميزان، خبز محمص، صلصة كلاسيكية' },
        ru: { name: 'Салат Цезарь', description: 'Хрустящий романо, пармезан, гренки, классическая заправка' },
        ky: { name: 'Цезарь салат', description: 'Кытырлаган салат, пармезан, тост, классикалык соус' },
      },
      categoryId: addedCategories[1].id,
      menuType: 'main',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
      badges: ['popular', 'recommended'],
      calories: 420,
      prepTime: 8,
    },
    {
      translations: {
        en: { name: 'Greek Salad', description: 'Tomatoes, cucumber, feta, olives, red onion' },
        ar: { name: 'السلطة اليونانية', description: 'طماطم، خيار، جبنة فيتا، زيتون، بصل أحمر' },
        ru: { name: 'Греческий салат', description: 'Помидоры, огурец, фета, оливки, красный лук' },
        ky: { name: 'Грек салаты', description: 'Помидор, кыяр, фета, зайтун, кызыл пияз' },
      },
      categoryId: addedCategories[1].id,
      menuType: 'main',
      price: 13.99,
      originalPrice: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      badges: ['recommended', 'discount'],
      dietaryTags: ['vegan', 'gluten-free'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 250,
      prepTime: 7,
    },
    
    // ========================================
    // MAIN MENU - Main Course
    // ========================================
    {
      translations: {
        en: { name: 'Grilled Ribeye Steak', description: 'Premium 12oz ribeye, herb butter, seasonal vegetables' },
        ar: { name: 'ستيك ريب آي مشوي', description: 'ريب آي ممتاز 12 أونصة، زبدة الأعشاب، خضروات موسمية' },
        ru: { name: 'Стейк рибай гриль', description: 'Премиум рибай 340г, травяное масло, сезонные овощи' },
        ky: { name: 'Грильде рибай стейк', description: 'Премиум 340г рибай, чөп май, мезгил жашылча' },
      },
      categoryId: addedCategories[2].id,
      menuType: 'main',
      price: 38.99,
      originalPrice: 45.99,
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
      badges: ['featured', 'hot'],
      dietaryTags: [],
      modifiers: [
        {
          id: 'mod_cook',
          translations: { en: 'Cooking Level', ar: 'مستوى الطهي', ru: 'Прожарка', ky: 'Бышыруу деңгээли' },
          type: 'choice',
          required: true,
          options: [
            { id: 'opt_rare', translations: { en: 'Rare', ar: 'نيء', ru: 'С кровью', ky: 'Канмен' }, price: 0, default: false },
            { id: 'opt_medium', translations: { en: 'Medium', ar: 'متوسط', ru: 'Средняя', ky: 'Орточо' }, price: 0, default: true },
            { id: 'opt_well', translations: { en: 'Well Done', ar: 'جيد الطهي', ru: 'Прожаренный', ky: 'Жакшы' }, price: 0, default: false },
          ],
        },
        {
          id: 'mod_side',
          translations: { en: 'Side Dish', ar: 'طبق جانبي', ru: 'Гарнир', ky: 'Кошумча тамак' },
          type: 'choice',
          required: true,
          options: [
            { id: 'opt_fries', translations: { en: 'French Fries', ar: 'بطاطس مقلية', ru: 'Картофель фри', ky: 'Картошка' }, price: 0, default: true },
            { id: 'opt_mashed', translations: { en: 'Mashed Potatoes', ar: 'بطاطس مهروسة', ru: 'Пюре', ky: 'Картошка пюреси' }, price: 0 },
            { id: 'opt_rice', translations: { en: 'Rice Pilaf', ar: 'أرز بيلاف', ru: 'Плов', ky: 'Күрүч' }, price: 0 },
          ],
        },
      ],
      enabled: true,
      available: true,
      order: 1,
      calories: 850,
      prepTime: 20,
    },
    {
      translations: {
        en: { name: 'Grilled Chicken Breast', description: 'Tender chicken with lemon herbs and vegetables' },
        ar: { name: 'صدر دجاج مشوي', description: 'دجاج طري مع أعشاب الليمون والخضروات' },
        ru: { name: 'Грудка курицы гриль', description: 'Нежная курица с лимонными травами и овощами' },
        ky: { name: 'Грильде тоок төшү', description: 'Жумшак тоок лимон чөптөр жана жашылча менен' },
      },
      categoryId: addedCategories[2].id,
      menuType: 'main',
      price: 22.99,
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 420,
      prepTime: 18,
    },
    {
      translations: {
        en: { name: 'BBQ Ribs', description: 'Slow-cooked baby back ribs with house BBQ sauce' },
        ar: { name: 'أضلاع مشوية', description: 'أضلاع مطبوخة ببطء مع صلصة الشواء المنزلية' },
        ru: { name: 'Ребрышки BBQ', description: 'Томленые ребрышки с домашним соусом BBQ' },
        ky: { name: 'BBQ кабыргалар', description: 'Жай бышырылган кабыргалар үй BBQ соусу менен' },
      },
      categoryId: addedCategories[2].id,
      menuType: 'main',
      price: 32.99,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      badges: ['hot', 'popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 3,
      calories: 720,
      prepTime: 25,
    },
    
    // ========================================
    // MAIN MENU - Pasta & Rice
    // ========================================
    {
      translations: {
        en: { name: 'Spaghetti Carbonara', description: 'Classic pasta with bacon, eggs, parmesan' },
        ar: { name: 'سباغيتي كاربونارا', description: 'معكرونة كلاسيكية مع لحم مقدد، بيض، بارميزان' },
        ru: { name: 'Спагетти Карбонара', description: 'Классическая паста с беконом, яйцами, пармезаном' },
        ky: { name: 'Спагетти Карбонара', description: 'Классикалык паста бекон, жумуртка, пармезан менен' },
      },
      categoryId: addedCategories[3].id,
      menuType: 'main',
      price: 18.99,
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 580,
      prepTime: 15,
    },
    {
      translations: {
        en: { name: 'Seafood Paella', description: 'Spanish rice with shrimp, mussels, and saffron' },
        ar: { name: 'بايلا المأكولات البحرية', description: 'أرز إسباني مع جمبري، بلح البحر، والزعفران' },
        ru: { name: 'Паэлья с морепродуктами', description: 'Испанский рис с креветками, мидиями и шафраном' },
        ky: { name: 'Деңиз азыктары паэльясы', description: 'Испан күрүчү креветка, мидия жана шафран менен' },
      },
      categoryId: addedCategories[3].id,
      menuType: 'main',
      price: 28.99,
      imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
      badges: ['recommended', 'hot'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 650,
      prepTime: 22,
    },
    
    // ========================================
    // MAIN MENU - Seafood
    // ========================================
    {
      translations: {
        en: { name: 'Grilled Salmon', description: 'Atlantic salmon with lemon dill sauce' },
        ar: { name: 'سلمون مشوي', description: 'سلمون أطلسي مع صلصة الليمون والشبت' },
        ru: { name: 'Лосось гриль', description: 'Атлантический лосось с лимонно-укропным соусом' },
        ky: { name: 'Грильде лосось', description: 'Атлантикалык лосось лимон-шибит соусу менен' },
      },
      categoryId: addedCategories[4].id,
      menuType: 'main',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      badges: ['recommended'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 450,
      prepTime: 18,
    },
    {
      translations: {
        en: { name: 'Seafood Platter', description: 'Mixed grilled seafood with garlic butter' },
        ar: { name: 'طبق المأكولات البحرية', description: 'مأكولات بحرية مشوية مختلطة مع زبدة الثوم' },
        ru: { name: 'Ассорти из морепродуктов', description: 'Смешанные морепродукты гриль с чесночным маслом' },
        ky: { name: 'Деңиз азыктары тайгагы', description: 'Аралаш грильденген деңиз азыктары сарымсак майы менен' },
      },
      categoryId: addedCategories[4].id,
      menuType: 'main',
      price: 42.99,
      imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a32cbb6d4?w=800',
      badges: ['hot', 'premium'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 680,
      prepTime: 25,
    },
    
    // ========================================
    // BUSINESS MENU
    // ========================================
    {
      translations: {
        en: { name: 'Executive Lunch Set', description: 'Soup, main course, dessert, coffee' },
        ar: { name: 'طقم غداء تنفيذي', description: 'حساء، طبق رئيسي، حلوى، قهوة' },
        ru: { name: 'Исполнительный бизнес-ланч', description: 'Суп, основное блюдо, десерт, кофе' },
        ky: { name: 'Башкаруучу түшкү тамак', description: 'Шорпо, негизги тамак, десерт, кофе' },
      },
      categoryId: addedCategories[6].id,
      menuType: 'business',
      price: 24.99,
      originalPrice: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      badges: ['discount', 'popular'],
      dietaryTags: ['gluten-free'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 680,
      prepTime: 15,
    },
    {
      translations: {
        en: { name: 'Business Combo', description: 'Salad, sandwich, and drink' },
        ar: { name: 'كومبو العمل', description: 'سلطة، ساندويتش، ومشروب' },
        ru: { name: 'Бизнес комбо', description: 'Салат, сэндвич и напиток' },
        ky: { name: 'Бизнес комбо', description: 'Салат, сэндвич жана суусундук' },
      },
      categoryId: addedCategories[7].id,
      menuType: 'business',
      price: 18.99,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 520,
      prepTime: 10,
    },
    
    // ========================================
    // KIDS MENU
    // ========================================
    {
      translations: {
        en: { name: 'Kids Chicken Nuggets', description: 'Crispy chicken nuggets with fries and juice' },
        ar: { name: 'ناجتس دجاج للأطفال', description: 'ناجتس دجاج مقرمش مع بطاطس مقلية وعصير' },
        ru: { name: 'Детские куриные наггетсы', description: 'Хрустящие куриные наггетсы с картошкой и соком' },
        ky: { name: 'Балдар тоок наггетсы', description: 'Кытырлаган тоок наггетсы картошка жана ширеси менен' },
      },
      categoryId: addedCategories[8].id,
      menuType: 'kids',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
      badges: ['new'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 420,
      prepTime: 12,
    },
    {
      translations: {
        en: { name: 'Kids Mac & Cheese', description: 'Creamy macaroni and cheese' },
        ar: { name: 'معكرونة وجبن للأطفال', description: 'معكرونة كريمية بالجبن' },
        ru: { name: 'Детские макароны с сыром', description: 'Кремовые макароны с сыром' },
        ky: { name: 'Балдар макарон сыр менен', description: 'Кремдүү макарон сыр менен' },
      },
      categoryId: addedCategories[8].id,
      menuType: 'kids',
      price: 7.99,
      imageUrl: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 380,
      prepTime: 10,
    },
    
    // ========================================
    // DRINKS
    // ========================================
    {
      translations: {
        en: { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice' },
        ar: { name: 'عصير برتقال طازج', description: 'عصير برتقال طازج' },
        ru: { name: 'Свежевыжатый апельсиновый сок', description: 'Свежевыжатый апельсиновый сок' },
        ky: { name: 'Жаңы апельсин ширеси', description: 'Жаңы кысылган апельсин ширеси' },
      },
      categoryId: addedCategories[12].id,
      menuType: 'drinks',
      price: 5.99,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
      badges: [],
      modifiers: [
        {
          id: 'mod_size',
          translations: { en: 'Size', ar: 'الحجم', ru: 'Размер', ky: 'Көлөмү' },
          type: 'size',
          required: true,
          options: [
            { id: 'opt_regular', translations: { en: 'Regular', ar: 'عادي', ru: 'Обычный', ky: 'Кадимки' }, price: 0, default: true },
            { id: 'opt_large', translations: { en: 'Large', ar: 'كبير', ru: 'Большой', ky: 'Чоң' }, price: 2.00 },
          ],
        },
      ],
      enabled: true,
      available: true,
      order: 1,
      calories: 120,
      prepTime: 3,
    },
    {
      translations: {
        en: { name: 'Cappuccino', description: 'Espresso with steamed milk and foam' },
        ar: { name: 'كابتشينو', description: 'إسبريسو مع حليب مبخر ورغوة' },
        ru: { name: 'Капучино', description: 'Эспрессо с вспененным молоком' },
        ky: { name: 'Капучино', description: 'Эспрессо көбүкчө жана сүт менен' },
      },
      categoryId: addedCategories[10].id,
      menuType: 'drinks',
      price: 4.99,
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 80,
      prepTime: 5,
    },
    {
      translations: {
        en: { name: 'Iced Latte', description: 'Espresso with cold milk over ice' },
        ar: { name: 'لاتيه مثلج', description: 'إسبريسو مع حليب بارد وثلج' },
        ru: { name: 'Холодный латте', description: 'Эспрессо с холодным молоком и льдом' },
        ky: { name: 'Муздак латте', description: 'Эспрессо муздак сүт жана муз менен' },
      },
      categoryId: addedCategories[11].id,
      menuType: 'drinks',
      price: 5.49,
      imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
      badges: [],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 110,
      prepTime: 4,
    },
    
    // ========================================
    // DESSERTS
    // ========================================
    {
      translations: {
        en: { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with vanilla ice cream' },
        ar: { name: 'كيك شوكولاتة بالحمم', description: 'كيك شوكولاتة دافئ مع آيس كريم الفانيليا' },
        ru: { name: 'Шоколадный лава-кейк', description: 'Теплый шоколадный торт с ванильным мороженым' },
        ky: { name: 'Шоколад лава-торт', description: 'Жылуу шоколад торт ваниль балмуздак менен' },
      },
      categoryId: addedCategories[13].id,
      menuType: 'desserts',
      price: 9.99,
      originalPrice: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
      badges: ['featured', 'popular'],
      dietaryTags: [],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 520,
      prepTime: 8,
    },
    {
      translations: {
        en: { name: 'Tiramisu', description: 'Classic Italian dessert with coffee and mascarpone' },
        ar: { name: 'تيراميسو', description: 'حلوى إيطالية كلاسيكية مع القهوة والماسكاربوني' },
        ru: { name: 'Тирамису', description: 'Классический итальянский десерт с кофе и маскарпоне' },
        ky: { name: 'Тирамису', description: 'Классикалык италиялык десерт кофе жана маскарпоне менен' },
      },
      categoryId: addedCategories[13].id,
      menuType: 'desserts',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      badges: ['popular'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 2,
      calories: 450,
      prepTime: 6,
    },
    {
      translations: {
        en: { name: 'Ice Cream Sundae', description: 'Three scoops with toppings and sauce' },
        ar: { name: 'آيس كريم سونداي', description: 'ثلاث كرات مع الإضافات والصلصة' },
        ru: { name: 'Мороженое сандей', description: 'Три шарика с топпингами и соусом' },
        ky: { name: 'Балмуздак сандей', description: 'Үч шарик кошумчалар жана соус менен' },
      },
      categoryId: addedCategories[14].id,
      menuType: 'desserts',
      price: 7.99,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
      badges: ['new'],
      modifiers: [],
      enabled: true,
      available: true,
      order: 1,
      calories: 380,
      prepTime: 5,
    },
  ];

  menuItems.forEach(item => db.addMenuItem(item));

  // Seed demo users
  const demoUsers = [
    {
      id: 'user_customer_demo',
      name: 'Demo Customer',
      email: 'customer@echefs.com',
      phone: '+996 555 123 456',
      role: 'customer' as const,
      avatar: 'https://ui-avatars.com/api/?name=Demo+Customer&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    },
    {
      id: 'user_sarah_johnson',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+996 555 234 567',
      role: 'customer' as const,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user_ahmed_hassan',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+996 555 345 678',
      role: 'customer' as const,
      avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user_maria_garcia',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+996 555 456 789',
      role: 'customer' as const,
      avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user_waiter_demo',
      name: 'Demo Waiter',
      email: 'waiter@echefs.com',
      phone: '+996 555 200 001',
      role: 'waiter' as const,
      branchId: 'branch_downtown',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Waiter&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user_manager_demo',
      name: 'Demo Manager',
      email: 'manager@echefs.com',
      phone: '+996 555 300 001',
      role: 'manager' as const,
      branchId: 'branch_downtown',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Manager&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'user_admin_demo',
      name: 'Demo Admin',
      email: 'admin@echefs.com',
      phone: '+996 555 400 001',
      role: 'admin' as const,
      avatar: 'https://ui-avatars.com/api/?name=Demo+Admin&background=667c67&color=fff',
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  demoUsers.forEach(user => {
    db.createUser(user);
    // Store demo passwords
    localStorage.setItem(`echefs_password_${user.id}`, 'demo123');
    console.log(`✓ Created demo user: ${user.email} (password: demo123)`);
    // Create loyalty card for customer
    if (user.role === 'customer') {
      const card = db.createLoyaltyCard(user.id);
      // Add varying demo points for different users
      if (user.id === 'user_customer_demo') {
        db.addLoyaltyPoints(user.id, 850, 'Welcome bonus');
        db.addLoyaltyPoints(user.id, 120, 'Order #EC0001');
        db.addLoyaltyPoints(user.id, 200, 'Order #EC0015');
        console.log(`✓ Created loyalty card for ${user.email} with 1170 points`);
      } else if (user.id === 'user_sarah_johnson') {
        db.addLoyaltyPoints(user.id, 2500, 'Welcome bonus');
        db.addLoyaltyPoints(user.id, 300, 'Order #EC0042');
        console.log(`✓ Created loyalty card for ${user.email} with 2800 points (Gold tier)`);
      } else if (user.id === 'user_ahmed_hassan') {
        db.addLoyaltyPoints(user.id, 650, 'Welcome bonus');
        db.addLoyaltyPoints(user.id, 100, 'Order #EC0089');
        console.log(`✓ Created loyalty card for ${user.email} with 750 points (Silver tier)`);
      } else if (user.id === 'user_maria_garcia') {
        db.addLoyaltyPoints(user.id, 350, 'Welcome bonus');
        console.log(`✓ Created loyalty card for ${user.email} with 350 points (Bronze tier)`);
      }
    }
  });

  console.log('✅ Database seeded successfully! Demo accounts ready.');
  console.log('📧 Demo Accounts (All passwords: demo123):');
  console.log('   - customer@echefs.com (Customer - 1170 points)');
  console.log('   - sarah.johnson@example.com (Customer - 2800 points - Gold)');
  console.log('   - ahmed.hassan@example.com (Customer - 750 points - Silver)');
  console.log('   - maria.garcia@example.com (Customer - 350 points - Bronze)');
  console.log('   - waiter@echefs.com (Staff - Waiter)');
  console.log('   - manager@echefs.com (Staff - Manager)');
  console.log('   - admin@echefs.com (Staff - Admin)');
  console.log('');
  console.log('💡 Test the app:');
  console.log('   1. Browse as guest (no login required)');
  console.log('   2. Add items to cart');
  console.log('   3. At checkout, you\'ll be prompted to sign in or continue as guest');
  console.log('   4. Sign in with any customer account above to see loyalty benefits');
}