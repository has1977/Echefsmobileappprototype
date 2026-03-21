// Mock data for 3 branches with different menus, regions, and promotions

export interface Branch {
  id: string;
  name: string;
  address: string;
  regions: Region[];
  menu: MenuItem[];
  promotions: Promotion[];
}

export interface Region {
  id: string;
  name: string;
  type: 'mainHall' | 'smoking' | 'nonSmoking' | 'outdoor' | 'vip';
  tables: Table[];
  imageUrl?: string;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  qrCode: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  nameRu: string;
  nameKy: string;
  description: string;
  descriptionAr: string;
  descriptionRu: string;
  descriptionKy: string;
  category: string;
  price: number;
  imageUrl: string;
  badges: ('hot' | 'new' | 'discount' | 'popular' | 'recommended')[];
  modifiers: Modifier[];
  section: 'grill' | 'salads' | 'desserts' | 'drinks' | 'hot';
  enabled: boolean;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export interface Modifier {
  id: string;
  name: string;
  nameAr: string;
  nameRu: string;
  nameKy: string;
  type: 'remove' | 'add' | 'spice' | 'extra';
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  nameAr: string;
  nameRu: string;
  nameKy: string;
  price: number;
}

export interface Promotion {
  id: string;
  title: string;
  titleAr: string;
  titleRu: string;
  titleKy: string;
  description: string;
  descriptionAr: string;
  descriptionRu: string;
  descriptionKy: string;
  type: 'discount' | 'happyHour' | 'gift' | 'loyalty';
  discount?: number;
  startDate: string;
  endDate: string;
  enabled: boolean;
  imageUrl: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  response?: {
    text: string;
    date: string;
  };
}

export interface Order {
  id: string;
  branchId: string;
  tableId: string;
  items: OrderItem[];
  status: 'received' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  paymentMethod?: 'cash' | 'card' | 'pos' | 'qr';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  modifiers: { modifierId: string; optionId: string }[];
  price: number;
  notes?: string;
}

export interface LoyaltyCard {
  id: string;
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  transactions: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem';
  points: number;
  date: string;
  description: string;
}

// Mock Branches Data
export const branches: Branch[] = [
  {
    id: 'branch-1',
    name: 'eChefs Downtown',
    address: '123 Main Street, Downtown',
    regions: [
      {
        id: 'region-1-1',
        name: 'Main Hall',
        type: 'mainHall',
        tables: Array.from({ length: 20 }, (_, i) => ({
          id: `table-1-1-${i + 1}`,
          number: i + 1,
          seats: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
          qrCode: `https://echefs.app/branch-1/table/${i + 1}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-1-2',
        name: 'Outdoor Terrace',
        type: 'outdoor',
        tables: Array.from({ length: 10 }, (_, i) => ({
          id: `table-1-2-${i + 1}`,
          number: i + 21,
          seats: 4,
          qrCode: `https://echefs.app/branch-1/table/${i + 21}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-1-3',
        name: 'VIP Room',
        type: 'vip',
        tables: Array.from({ length: 3 }, (_, i) => ({
          id: `table-1-3-${i + 1}`,
          number: i + 31,
          seats: 8,
          qrCode: `https://echefs.app/branch-1/table/${i + 31}`,
          status: 'available' as const,
        })),
      },
    ],
    menu: [
      {
        id: 'item-1-1',
        name: 'Grilled Salmon',
        nameAr: 'سلمون مشوي',
        nameRu: 'Лосось на гриле',
        nameKy: 'Грильде жылмаган балык',
        description: 'Fresh Atlantic salmon grilled to perfection with herbs',
        descriptionAr: 'سلمون أطلسي طازج مشوي بالأعشاب',
        descriptionRu: 'Свежий атлантический лосось, приготовленный на гриле с травами',
        descriptionKy: 'Жашыл чөптөр менен гриль жасалган таза атлантика балык',
        category: 'Main Course',
        price: 28.99,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
        badges: ['popular', 'recommended'],
        modifiers: [
          {
            id: 'mod-1-1-1',
            name: 'Spice Level',
            nameAr: 'مستوى التوابل',
            nameRu: 'Уровень остроты',
            nameKy: 'Ачуулук деңгээли',
            type: 'spice',
            options: [
              { id: 'opt-1', name: 'No Spice', nameAr: 'بدون توابل', nameRu: 'Без остроты', nameKy: 'Ачуулуксуз', price: 0 },
              { id: 'opt-2', name: 'Mild', nameAr: 'خفيف', nameRu: 'Слабо', nameKy: 'Аз ачуу', price: 0 },
              { id: 'opt-3', name: 'Medium', nameAr: 'متوسط', nameRu: 'Средне', nameKy: 'Орточо', price: 0 },
              { id: 'opt-4', name: 'Hot', nameAr: 'حار', nameRu: 'Остро', nameKy: 'Ачуу', price: 0 },
            ],
          },
          {
            id: 'mod-1-1-2',
            name: 'Sides',
            nameAr: 'جوانب',
            nameRu: 'Гарнир',
            nameKy: 'Кошумча',
            type: 'add',
            options: [
              { id: 'opt-5', name: 'Grilled Vegetables', nameAr: 'خضروات مشوية', nameRu: 'Овощи гриль', nameKy: 'Гриль жашылча', price: 3.99 },
              { id: 'opt-6', name: 'Mashed Potatoes', nameAr: 'بطاطس مهروسة', nameRu: 'Картофельное пюре', nameKy: 'Картошка пюреси', price: 2.99 },
              { id: 'opt-7', name: 'Rice Pilaf', nameAr: 'أرز بيلاف', nameRu: 'Рис плов', nameKy: 'Күрүч', price: 2.49 },
            ],
          },
        ],
        section: 'grill',
        enabled: true,
        rating: 4.8,
        reviewCount: 127,
      },
      {
        id: 'item-1-2',
        name: 'Mediterranean Salad',
        nameAr: 'سلطة متوسطية',
        nameRu: 'Средиземноморский салат',
        nameKy: 'Жер ортолук деңиз салаты',
        description: 'Fresh greens with feta, olives, tomatoes, and olive oil',
        descriptionAr: 'خضروات طازجة مع جبن الفيتا والزيتون والطماطم وزيت الزيتون',
        descriptionRu: 'Свежая зелень с фетой, оливками, помидорами и оливковым маслом',
        descriptionKy: 'Фета, зайтун, помидор жана зайтун майы менен жашыл чөп',
        category: 'Salads',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        badges: ['new'],
        modifiers: [
          {
            id: 'mod-1-2-1',
            name: 'Extras',
            nameAr: 'إضافات',
            nameRu: 'Дополнительно',
            nameKy: 'Кошумча',
            type: 'add',
            options: [
              { id: 'opt-8', name: 'Grilled Chicken', nameAr: 'دجاج مشوي', nameRu: 'Курица гриль', nameKy: 'Тоокту грильде', price: 5.99 },
              { id: 'opt-9', name: 'Avocado', nameAr: 'أفوكادو', nameRu: 'Авокадо', nameKy: 'Авокадо', price: 3.99 },
            ],
          },
        ],
        section: 'salads',
        enabled: true,
        rating: 4.6,
        reviewCount: 89,
      },
      {
        id: 'item-1-3',
        name: 'Beef Burger Premium',
        nameAr: 'برجر لحم البقر الفاخر',
        nameRu: 'Премиум говяжий бургер',
        nameKy: 'Премиум уй эт бургер',
        description: 'Juicy beef patty with cheddar, bacon, and special sauce',
        descriptionAr: 'قطعة لحم بقري طرية مع الشيدر والبيكون والصوص الخاص',
        descriptionRu: 'Сочная говяжья котлета с чеддером, беконом и специальным соусом',
        descriptionKy: 'Чеддер, бекон жана атайын соус менен ширелүү уй эт котлет',
        category: 'Burgers',
        price: 16.99,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        badges: ['hot', 'popular'],
        modifiers: [
          {
            id: 'mod-1-3-1',
            name: 'Remove',
            nameAr: 'إزالة',
            nameRu: 'Удалить',
            nameKy: 'Алып салуу',
            type: 'remove',
            options: [
              { id: 'opt-10', name: 'No Onions', nameAr: 'بدون بصل', nameRu: 'Без лука', nameKy: 'Пыязсыз', price: 0 },
              { id: 'opt-11', name: 'No Pickles', nameAr: 'بدون مخلل', nameRu: 'Без огурцов', nameKy: 'Туздуктусуз', price: 0 },
            ],
          },
          {
            id: 'mod-1-3-2',
            name: 'Add Extras',
            nameAr: 'إضافات',
            nameRu: 'Добавить',
            nameKy: 'Кошумча кошуу',
            type: 'add',
            options: [
              { id: 'opt-12', name: 'Extra Cheese', nameAr: 'جبن إضافي', nameRu: 'Доп. сыр', nameKy: 'Кошумча сыр', price: 1.99 },
              { id: 'opt-13', name: 'Bacon', nameAr: 'لحم مقدد', nameRu: 'Бекон', nameKy: 'Бекон', price: 2.99 },
              { id: 'opt-14', name: 'Fried Egg', nameAr: 'بيض مقلي', nameRu: 'Жареное яйцо', nameKy: 'Куурулган жумуртка', price: 1.49 },
            ],
          },
        ],
        section: 'grill',
        enabled: true,
        rating: 4.9,
        reviewCount: 234,
      },
      {
        id: 'item-1-4',
        name: 'Chocolate Lava Cake',
        nameAr: 'كيك شوكولاتة بالحمم',
        nameRu: 'Шоколадный лава-кейк',
        nameKy: 'Шоколад лава-торт',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        descriptionAr: 'كيك شوكولاتة دافئ مع مركز ذائب وآيس كريم الفانيليا',
        descriptionRu: 'Теплый шоколадный торт с расплавленной серединой и ванильным мороженым',
        descriptionKy: 'Эриген ортосу жана ваниль балмуздак менен жылуу шоколад торту',
        category: 'Desserts',
        price: 8.99,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
        badges: ['popular', 'recommended'],
        modifiers: [],
        section: 'desserts',
        enabled: true,
        rating: 4.7,
        reviewCount: 156,
      },
      {
        id: 'item-1-5',
        name: 'Fresh Orange Juice',
        nameAr: 'عصير البرتقال الطازج',
        nameRu: 'Свежевыжатый апельсиновый сок',
        nameKy: 'Жаңы апельсин ширеси',
        description: 'Freshly squeezed orange juice',
        descriptionAr: 'عصير برتقال طازج',
        descriptionRu: 'Свежевыжатый апельсиновый сок',
        descriptionKy: 'Жаңы кысылган апельсин ширеси',
        category: 'Beverages',
        price: 5.99,
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
        badges: [],
        modifiers: [],
        section: 'drinks',
        enabled: true,
        rating: 4.5,
        reviewCount: 67,
      },
    ],
    promotions: [
      {
        id: 'promo-1-1',
        title: 'Happy Hour Special',
        titleAr: 'عرض الساعة السعيدة',
        titleRu: 'Спецпредложение счастливого часа',
        titleKy: 'Бактылуу саат акциясы',
        description: 'Get 25% off all beverages from 3-6 PM',
        descriptionAr: 'احصل على خصم 25٪ على جميع المشروبات من 3-6 مساءً',
        descriptionRu: 'Скидка 25% на все напитки с 15:00 до 18:00',
        descriptionKy: 'Саат 15:00дөн 18:00гө чейин бардык суусундуктарга 25% арзандатуу',
        type: 'happyHour',
        discount: 25,
        startDate: '2026-03-13',
        endDate: '2026-12-31',
        enabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
      },
      {
        id: 'promo-1-2',
        title: 'Weekend Brunch Deal',
        titleAr: 'عرض فطور وغداء عطلة نهاية الأسبوع',
        titleRu: 'Предложение выходного бранча',
        titleKy: 'Дем алыш күн таңки тамак акциясы',
        description: 'Free dessert with any main course on weekends',
        descriptionAr: 'حلوى مجانية مع أي طبق رئيسي في عطلات نهاية الأسبوع',
        descriptionRu: 'Бесплатный десерт к любому основному блюду в выходные',
        descriptionKy: 'Дем алыш күндөрү ар кандай негизги тамакка акысыз десерт',
        type: 'gift',
        startDate: '2026-03-13',
        endDate: '2026-12-31',
        enabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      },
    ],
  },
  {
    id: 'branch-2',
    name: 'eChefs Riverside',
    address: '456 River Road, Waterfront',
    regions: [
      {
        id: 'region-2-1',
        name: 'Main Dining',
        type: 'mainHall',
        tables: Array.from({ length: 15 }, (_, i) => ({
          id: `table-2-1-${i + 1}`,
          number: i + 1,
          seats: i % 2 === 0 ? 4 : 2,
          qrCode: `https://echefs.app/branch-2/table/${i + 1}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-2-2',
        name: 'Smoking Area',
        type: 'smoking',
        tables: Array.from({ length: 8 }, (_, i) => ({
          id: `table-2-2-${i + 1}`,
          number: i + 16,
          seats: 4,
          qrCode: `https://echefs.app/branch-2/table/${i + 16}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-2-3',
        name: 'River View',
        type: 'outdoor',
        tables: Array.from({ length: 12 }, (_, i) => ({
          id: `table-2-3-${i + 1}`,
          number: i + 24,
          seats: 4,
          qrCode: `https://echefs.app/branch-2/table/${i + 24}`,
          status: 'available' as const,
        })),
      },
    ],
    menu: [
      {
        id: 'item-2-1',
        name: 'Seafood Paella',
        nameAr: 'بايلا المأكولات البحرية',
        nameRu: 'Паэлья с морепродуктами',
        nameKy: 'Деңиз азыктары паэлья',
        description: 'Traditional Spanish rice dish with prawns, mussels, and squid',
        descriptionAr: 'طبق أرز إسباني تقليدي مع الجمبري وبلح البحر والحبار',
        descriptionRu: 'Традиционное испанское блюдо из риса с креветками, мидиями и кальмарами',
        descriptionKy: 'Креветка, мидиялар жана кальмар менен испан күрүч тамагы',
        category: 'Seafood',
        price: 32.99,
        imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
        badges: ['new', 'recommended'],
        modifiers: [],
        section: 'hot',
        enabled: true,
        rating: 4.9,
        reviewCount: 98,
      },
      {
        id: 'item-2-2',
        name: 'Caesar Salad',
        nameAr: 'سلطة سيزر',
        nameRu: 'Салат Цезарь',
        nameKy: 'Цезарь салат',
        description: 'Classic Caesar with romaine, parmesan, and croutons',
        descriptionAr: 'سيزر كلاسيكي مع الخس والبارميزان والخبز المحمص',
        descriptionRu: 'Классический Цезарь с романо, пармезаном и гренками',
        descriptionKy: 'Ромейн, пармезан жана гренка менен классикалык Цезарь',
        category: 'Salads',
        price: 11.99,
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
        badges: ['popular'],
        modifiers: [
          {
            id: 'mod-2-2-1',
            name: 'Add Protein',
            nameAr: 'إضافة بروتين',
            nameRu: 'Добавить белок',
            nameKy: 'Белок кошуу',
            type: 'add',
            options: [
              { id: 'opt-15', name: 'Grilled Chicken', nameAr: 'دجاج مشوي', nameRu: 'Курица гриль', nameKy: 'Тоокту грильде', price: 5.99 },
              { id: 'opt-16', name: 'Grilled Shrimp', nameAr: 'جمبري مشوي', nameRu: 'Креветки гриль', nameKy: 'Креветка грильде', price: 7.99 },
            ],
          },
        ],
        section: 'salads',
        enabled: true,
        rating: 4.7,
        reviewCount: 134,
      },
      {
        id: 'item-2-3',
        name: 'Tiramisu',
        nameAr: 'تيراميسو',
        nameRu: 'Тирамису',
        nameKy: 'Тирамису',
        description: 'Classic Italian coffee-flavored dessert',
        descriptionAr: 'حلوى إيطالية كلاسيكية بنكهة القهوة',
        descriptionRu: 'Классический итальянский десерт с кофейным вкусом',
        descriptionKy: 'Кофе даамындагы классикалык италиялык десерт',
        category: 'Desserts',
        price: 9.99,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
        badges: ['popular'],
        modifiers: [],
        section: 'desserts',
        enabled: true,
        rating: 4.8,
        reviewCount: 187,
      },
    ],
    promotions: [
      {
        id: 'promo-2-1',
        title: 'Loyalty Bonus Week',
        titleAr: 'أسبوع مكافأة الولاء',
        titleRu: 'Неделя бонусов лояльности',
        titleKy: 'Берилгендик бонус жумасы',
        description: 'Earn double loyalty points on all orders this week',
        descriptionAr: 'اكسب ضعف نقاط الولاء على جميع الطلبات هذا الأسبوع',
        descriptionRu: 'Зарабатывайте двойные баллы лояльности на все заказы на этой неделе',
        descriptionKy: 'Бул жумада бардык буйрутмаларга эки эселенген берилгендик упайларын казанып алыңыз',
        type: 'loyalty',
        startDate: '2026-03-13',
        endDate: '2026-03-20',
        enabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800',
      },
    ],
  },
  {
    id: 'branch-3',
    name: 'eChefs Garden',
    address: '789 Park Avenue, Green District',
    regions: [
      {
        id: 'region-3-1',
        name: 'Indoor Garden',
        type: 'mainHall',
        tables: Array.from({ length: 18 }, (_, i) => ({
          id: `table-3-1-${i + 1}`,
          number: i + 1,
          seats: i % 3 === 0 ? 6 : 4,
          qrCode: `https://echefs.app/branch-3/table/${i + 1}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-3-2',
        name: 'Non-Smoking',
        type: 'nonSmoking',
        tables: Array.from({ length: 12 }, (_, i) => ({
          id: `table-3-2-${i + 1}`,
          number: i + 19,
          seats: 4,
          qrCode: `https://echefs.app/branch-3/table/${i + 19}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'region-3-3',
        name: 'Garden Terrace',
        type: 'outdoor',
        tables: Array.from({ length: 15 }, (_, i) => ({
          id: `table-3-3-${i + 1}`,
          number: i + 31,
          seats: 4,
          qrCode: `https://echefs.app/branch-3/table/${i + 31}`,
          status: 'available' as const,
        })),
      },
    ],
    menu: [
      {
        id: 'item-3-1',
        name: 'Vegan Buddha Bowl',
        nameAr: 'وعاء بوذا النباتي',
        nameRu: 'Веганская боул Будда',
        nameKy: 'Веган Будда тарелкасы',
        description: 'Quinoa, roasted vegetables, avocado, and tahini dressing',
        descriptionAr: 'كينوا، خضروات محمصة، أفوكادو، وصلصة الطحينة',
        descriptionRu: 'Киноа, жареные овощи, авокадо и заправка тахини',
        descriptionKy: 'Киноа, куурулган жашылча, авокадо жана тахини соус',
        category: 'Healthy',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        badges: ['new', 'recommended'],
        modifiers: [],
        section: 'salads',
        enabled: true,
        rating: 4.6,
        reviewCount: 72,
      },
      {
        id: 'item-3-2',
        name: 'Grilled Lamb Chops',
        nameAr: 'قطع لحم الضأن المشوية',
        nameRu: 'Бараньи отбивные на гриле',
        nameKy: 'Грильде койдун эти',
        description: 'Premium lamb chops with rosemary and garlic',
        descriptionAr: 'قطع لحم الضأن الممتازة مع إكليل الجبل والثوم',
        descriptionRu: 'Премиальные бараньи отбивные с розмарином и чесноком',
        descriptionKy: 'Розмарин жана сарымсак менен премиум койдун эти',
        category: 'Grilled',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
        badges: ['hot', 'popular'],
        modifiers: [],
        section: 'grill',
        enabled: true,
        rating: 4.9,
        reviewCount: 145,
      },
      {
        id: 'item-3-3',
        name: 'Matcha Ice Cream',
        nameAr: 'آيس كريم ماتشا',
        nameRu: 'Мороженое матча',
        nameKy: 'Матча балмуздак',
        description: 'Premium Japanese matcha ice cream',
        descriptionAr: 'آيس كريم ماتشا ياباني فاخر',
        descriptionRu: 'Премиальное японское мороженое матча',
        descriptionKy: 'Премиум япон матча балмуздак',
        category: 'Desserts',
        price: 7.99,
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
        badges: ['new'],
        modifiers: [],
        section: 'desserts',
        enabled: true,
        rating: 4.5,
        reviewCount: 56,
      },
    ],
    promotions: [
      {
        id: 'promo-3-1',
        title: 'Green Tuesday',
        titleAr: 'الثلاثاء الأخضر',
        titleRu: 'Зеленый вторник',
        titleKy: 'Жашыл шейшемби',
        description: '15% off all vegan and vegetarian dishes on Tuesdays',
        descriptionAr: 'خصم 15٪ على جميع الأطباق النباتية أيام الثلاثاء',
        descriptionRu: 'Скидка 15% на все веганские и вегетарианские блюда по вторникам',
        descriptionKy: 'Шейшемби күнү бардык веган жана вегетариан тамактарга 15% арзандатуу',
        type: 'discount',
        discount: 15,
        startDate: '2026-03-13',
        endDate: '2026-12-31',
        enabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      },
    ],
  },
];

// Mock Loyalty Data
export const mockLoyaltyCard: LoyaltyCard = {
  id: 'loyalty-1',
  userId: 'user-1',
  points: 1250,
  tier: 'silver',
  transactions: [
    {
      id: 'trans-1',
      type: 'earn',
      points: 290,
      date: '2026-03-12',
      description: 'Order #1234 at eChefs Downtown',
    },
    {
      id: 'trans-2',
      type: 'earn',
      points: 450,
      date: '2026-03-10',
      description: 'Order #1233 at eChefs Riverside',
    },
    {
      id: 'trans-3',
      type: 'redeem',
      points: -500,
      date: '2026-03-08',
      description: 'Redeemed for free dessert',
    },
  ],
};

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    branchId: 'branch-1',
    tableId: 'table-1-1-5',
    items: [
      {
        id: 'oi-1',
        menuItemId: 'item-1-1',
        quantity: 2,
        modifiers: [
          { modifierId: 'mod-1-1-1', optionId: 'opt-2' },
          { modifierId: 'mod-1-1-2', optionId: 'opt-5' },
        ],
        price: 28.99,
      },
      {
        id: 'oi-2',
        menuItemId: 'item-1-4',
        quantity: 1,
        modifiers: [],
        price: 8.99,
      },
    ],
    status: 'preparing',
    subtotal: 66.97,
    tax: 5.36,
    discount: 0,
    tip: 10.0,
    total: 82.33,
    paymentStatus: 'pending',
    createdAt: '2026-03-13T12:30:00Z',
    updatedAt: '2026-03-13T12:35:00Z',
  },
  {
    id: 'order-2',
    branchId: 'branch-1',
    tableId: 'table-1-1-12',
    items: [
      {
        id: 'oi-3',
        menuItemId: 'item-1-3',
        quantity: 3,
        modifiers: [
          { modifierId: 'mod-1-3-2', optionId: 'opt-12' },
        ],
        price: 16.99,
      },
    ],
    status: 'ready',
    subtotal: 56.94,
    tax: 4.56,
    discount: 0,
    tip: 8.5,
    total: 70.0,
    paymentStatus: 'pending',
    createdAt: '2026-03-13T11:45:00Z',
    updatedAt: '2026-03-13T12:25:00Z',
  },
];
