import type { Order } from '../lib/types';

/**
 * Sample orders data for demonstration
 * Includes examples of different order types:
 * - Dine-in (inside restaurant)
 * - Takeaway (pickup)
 * - Delivery
 * With various statuses and realistic scenarios
 */

export const sampleOrders: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>[] = [
  // ==================== DINE-IN ORDERS ====================
  
  // Active dine-in order - Currently being prepared
  {
    userId: 'user_customer_1',
    branchId: 'branch_1',
    tableNumber: 'A5',
    type: 'dine-in',
    status: 'preparing',
    items: [
      {
        id: 'item_1',
        menuItemId: 'menu_item_1',
        name: { en: 'Margherita Pizza', ar: 'بيتزا مارغريتا', ru: 'Пицца Маргарита', ky: 'Маргарита пиццасы' },
        price: 12.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_1',
            groupName: { en: 'Size', ar: 'الحجم', ru: 'Размер', ky: 'Өлчөмү' },
            option: {
              id: 'mod_opt_1',
              name: { en: 'Large', ar: 'كبير', ru: 'Большой', ky: 'Чоң' },
              price: 3.00
            }
          },
          {
            groupId: 'mod_group_2',
            groupName: { en: 'Extra Toppings', ar: 'إضافات', ru: 'Доп. начинка', ky: 'Кошумча' },
            option: {
              id: 'mod_opt_2',
              name: { en: 'Extra Cheese', ar: 'جبن إضافي', ru: 'Доп. сыр', ky: 'Кошумча сыр' },
              price: 2.50
            }
          }
        ],
        notes: 'Please make it extra crispy'
      },
      {
        id: 'item_2',
        menuItemId: 'menu_item_2',
        name: { en: 'Caesar Salad', ar: 'سلطة سيزر', ru: 'Салат Цезарь', ky: 'Цезарь салаты' },
        price: 8.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_3',
        menuItemId: 'menu_item_3',
        name: { en: 'Cola', ar: 'كولا', ru: 'Кола', ky: 'Кола' },
        price: 2.99,
        quantity: 3,
        modifiers: [
          {
            groupId: 'mod_group_3',
            groupName: { en: 'Ice', ar: 'الثلج', ru: 'Лед', ky: 'Муз' },
            option: {
              id: 'mod_opt_3',
              name: { en: 'No Ice', ar: 'بدون ثلج', ru: 'Без льда', ky: 'Музсуз' },
              price: 0
            }
          }
        ],
        notes: ''
      }
    ],
    subtotal: 48.94,
    tax: 3.92,
    total: 52.86,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: 'Please bring ketchup',
    estimatedTime: 25,
    menuType: 'regular'
  },

  // Completed dine-in order from yesterday
  {
    userId: 'user_customer_1',
    branchId: 'branch_1',
    tableNumber: 'B12',
    type: 'dine-in',
    status: 'completed',
    items: [
      {
        id: 'item_4',
        menuItemId: 'menu_item_4',
        name: { en: 'Grilled Chicken', ar: 'دجاج مشوي', ru: 'Курица гриль', ky: 'Гриль тоок' },
        price: 15.99,
        quantity: 1,
        modifiers: [
          {
            groupId: 'mod_group_4',
            groupName: { en: 'Side Dish', ar: 'طبق جانبي', ru: 'Гарнир', ky: 'Кошумча тамак' },
            option: {
              id: 'mod_opt_4',
              name: { en: 'French Fries', ar: 'بطاطس مقلية', ru: 'Картофель фри', ky: 'Картошка фри' },
              price: 3.50
            }
          }
        ],
        notes: ''
      },
      {
        id: 'item_5',
        menuItemId: 'menu_item_5',
        name: { en: 'Lemonade', ar: 'عصير ليمون', ru: 'Лимонад', ky: 'Лимонад' },
        price: 3.99,
        quantity: 2,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 27.47,
    tax: 2.20,
    total: 29.67,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: '',
    estimatedTime: 20,
    menuType: 'regular'
  },

  // Another dine-in order - Ready to be served
  {
    userId: 'user_customer_2',
    branchId: 'branch_2',
    tableNumber: 'C3',
    type: 'dine-in',
    status: 'ready',
    items: [
      {
        id: 'item_6',
        menuItemId: 'menu_item_6',
        name: { en: 'Beef Burger', ar: 'برجر لحم', ru: 'Бургер с говядиной', ky: 'Уй эти бургер' },
        price: 10.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_5',
            groupName: { en: 'Cheese', ar: 'الجبن', ru: 'Сыр', ky: 'Сыр' },
            option: {
              id: 'mod_opt_5',
              name: { en: 'Double Cheese', ar: 'جبن مضاعف', ru: 'Двойной сыр', ky: 'Эки сыр' },
              price: 1.50
            }
          }
        ],
        notes: 'Well done please'
      },
      {
        id: 'item_7',
        menuItemId: 'menu_item_7',
        name: { en: 'Onion Rings', ar: 'حلقات البصل', ru: 'Луковые кольца', ky: 'Пияз шакектери' },
        price: 5.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 30.96,
    tax: 2.48,
    total: 33.44,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: '',
    estimatedTime: 15,
    menuType: 'regular'
  },

  // ==================== TAKEAWAY ORDERS ====================

  // Active takeaway order - Confirmed and preparing
  {
    userId: 'user_customer_3',
    branchId: 'branch_1',
    type: 'takeaway',
    status: 'preparing',
    items: [
      {
        id: 'item_8',
        menuItemId: 'menu_item_8',
        name: { en: 'Pepperoni Pizza', ar: 'بيتزا بيبروني', ru: 'Пицца Пепперони', ky: 'Пепперони пиццасы' },
        price: 14.99,
        quantity: 3,
        modifiers: [
          {
            groupId: 'mod_group_1',
            groupName: { en: 'Size', ar: 'الحجم', ru: 'Размер', ky: 'Өлчөмү' },
            option: {
              id: 'mod_opt_6',
              name: { en: 'Medium', ar: 'وسط', ru: 'Средний', ky: 'Орто' },
              price: 0
            }
          }
        ],
        notes: ''
      },
      {
        id: 'item_9',
        menuItemId: 'menu_item_9',
        name: { en: 'Garlic Bread', ar: 'خبز بالثوم', ru: 'Чесночный хлеб', ky: 'Саримсак нан' },
        price: 4.99,
        quantity: 2,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_10',
        menuItemId: 'menu_item_10',
        name: { en: 'Sprite', ar: 'سبرايت', ru: 'Спрайт', ky: 'Спрайт' },
        price: 2.99,
        quantity: 4,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 66.89,
    tax: 5.35,
    total: 72.24,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: 'Please pack napkins and utensils',
    estimatedTime: 30,
    menuType: 'regular'
  },

  // Takeaway order - Ready for pickup
  {
    userId: 'user_customer_1',
    branchId: 'branch_2',
    type: 'takeaway',
    status: 'ready',
    items: [
      {
        id: 'item_11',
        menuItemId: 'menu_item_11',
        name: { en: 'Sushi Combo', ar: 'سوشي مشكل', ru: 'Суши комбо', ky: 'Суши комбо' },
        price: 22.99,
        quantity: 1,
        modifiers: [
          {
            groupId: 'mod_group_6',
            groupName: { en: 'Sauce', ar: 'الصوص', ru: 'Соус', ky: 'Соус' },
            option: {
              id: 'mod_opt_7',
              name: { en: 'Extra Soy Sauce', ar: 'صوص الصويا الإضافي', ru: 'Доп. соевый соус', ky: 'Кошумча соя соусу' },
              price: 0.50
            }
          }
        ],
        notes: 'Extra wasabi please'
      },
      {
        id: 'item_12',
        menuItemId: 'menu_item_12',
        name: { en: 'Miso Soup', ar: 'شوربة ميسو', ru: 'Мисо суп', ky: 'Мисо шорпо' },
        price: 3.99,
        quantity: 2,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 31.47,
    tax: 2.52,
    total: 33.99,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: '',
    estimatedTime: 10,
    menuType: 'regular'
  },

  // Completed takeaway order
  {
    userId: 'user_customer_2',
    branchId: 'branch_1',
    type: 'takeaway',
    status: 'completed',
    items: [
      {
        id: 'item_13',
        menuItemId: 'menu_item_13',
        name: { en: 'Chicken Wings', ar: 'أجنحة دجاج', ru: 'Куриные крылышки', ky: 'Тоок канаттары' },
        price: 9.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_7',
            groupName: { en: 'Flavor', ar: 'النكهة', ru: 'Вкус', ky: 'Даамы' },
            option: {
              id: 'mod_opt_8',
              name: { en: 'BBQ', ar: 'باربكيو', ru: 'Барбекю', ky: 'Барбекю' },
              price: 0
            }
          }
        ],
        notes: ''
      }
    ],
    subtotal: 19.98,
    tax: 1.60,
    total: 21.58,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: '',
    estimatedTime: 15,
    menuType: 'regular'
  },

  // ==================== DELIVERY ORDERS ====================

  // Active delivery order - Out for delivery
  {
    userId: 'user_customer_3',
    branchId: 'branch_1',
    type: 'delivery',
    status: 'preparing',
    deliveryAddress: {
      street: '123 Main Street',
      city: 'Bishkek',
      country: 'Kyrgyzstan',
      zipCode: '720000',
      coordinates: { lat: 42.8746, lng: 74.5698 },
      isDefault: true,
      deliveryInstructions: 'Ring doorbell twice, Apartment 4B'
    },
    items: [
      {
        id: 'item_14',
        menuItemId: 'menu_item_14',
        name: { en: 'Family Meal Deal', ar: 'وجبة عائلية', ru: 'Семейный набор', ky: 'Үй-бүлө тамагы' },
        price: 35.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_15',
        menuItemId: 'menu_item_15',
        name: { en: 'Chocolate Cake', ar: 'كيكة شوكولاتة', ru: 'Шоколадный торт', ky: 'Шоколад торт' },
        price: 6.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_16',
        menuItemId: 'menu_item_16',
        name: { en: 'Orange Juice', ar: 'عصير برتقال', ru: 'Апельсиновый сок', ky: 'Апельсин ширеси' },
        price: 3.99,
        quantity: 3,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 54.95,
    tax: 4.40,
    deliveryFee: 3.50,
    total: 62.85,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: 'Please call when you arrive',
    estimatedTime: 35,
    menuType: 'regular'
  },

  // Delivery order - Being prepared
  {
    userId: 'user_customer_1',
    branchId: 'branch_2',
    type: 'delivery',
    status: 'confirmed',
    deliveryAddress: {
      street: '456 Oak Avenue',
      city: 'Bishkek',
      country: 'Kyrgyzstan',
      zipCode: '720001',
      coordinates: { lat: 42.8800, lng: 74.5800 },
      isDefault: false,
      deliveryInstructions: 'Leave at the door'
    },
    items: [
      {
        id: 'item_17',
        menuItemId: 'menu_item_17',
        name: { en: 'Vegetarian Pizza', ar: 'بيتزا نباتية', ru: 'Вегетарианская пицца', ky: 'Өсүмдүк пиццасы' },
        price: 13.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_1',
            groupName: { en: 'Size', ar: 'الحجم', ru: 'Размер', ky: 'Өлчөмү' },
            option: {
              id: 'mod_opt_9',
              name: { en: 'Large', ar: 'كبير', ru: 'Большой', ky: 'Чоң' },
              price: 3.00
            }
          }
        ],
        notes: 'No olives'
      },
      {
        id: 'item_18',
        menuItemId: 'menu_item_18',
        name: { en: 'Greek Salad', ar: 'سلطة يونانية', ru: 'Греческий салат', ky: 'Грек салаты' },
        price: 7.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 41.97,
    tax: 3.36,
    deliveryFee: 2.50,
    total: 47.83,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: 'Please include extra dressing',
    estimatedTime: 40,
    menuType: 'regular'
  },

  // Completed delivery order
  {
    userId: 'user_customer_2',
    branchId: 'branch_1',
    type: 'delivery',
    status: 'completed',
    deliveryAddress: {
      street: '789 Elm Street',
      city: 'Bishkek',
      country: 'Kyrgyzstan',
      zipCode: '720002',
      coordinates: { lat: 42.8650, lng: 74.5600 },
      isDefault: true,
      deliveryInstructions: 'Gate code: 1234'
    },
    items: [
      {
        id: 'item_19',
        menuItemId: 'menu_item_19',
        name: { en: 'Pasta Carbonara', ar: 'باستا كاربونارا', ru: 'Паста Карбонара', ky: 'Паста Карбонара' },
        price: 12.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_8',
            groupName: { en: 'Extra', ar: 'إضافي', ru: 'Дополнительно', ky: 'Кошумча' },
            option: {
              id: 'mod_opt_10',
              name: { en: 'Extra Bacon', ar: 'لحم مقدد إضافي', ru: 'Доп. бекон', ky: 'Кошумча бекон' },
              price: 2.00
            }
          }
        ],
        notes: ''
      },
      {
        id: 'item_20',
        menuItemId: 'menu_item_20',
        name: { en: 'Tiramisu', ar: 'تيراميسو', ru: 'Тирамису', ky: 'Тирамису' },
        price: 5.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 35.97,
    tax: 2.88,
    deliveryFee: 3.00,
    total: 41.85,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: '',
    estimatedTime: 30,
    menuType: 'regular'
  },

  // ==================== MORE VARIED EXAMPLES ====================

  // Breakfast order - Dine-in
  {
    userId: 'user_customer_1',
    branchId: 'branch_1',
    tableNumber: 'D8',
    type: 'dine-in',
    status: 'served',
    items: [
      {
        id: 'item_21',
        menuItemId: 'menu_item_21',
        name: { en: 'Full Breakfast', ar: 'فطور كامل', ru: 'Полный завтрак', ky: 'Толук эртең мененки тамак' },
        price: 11.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_9',
            groupName: { en: 'Eggs', ar: 'البيض', ru: 'Яйца', ky: 'Жумуртка' },
            option: {
              id: 'mod_opt_11',
              name: { en: 'Scrambled', ar: 'مخفوق', ru: 'Взбитые', ky: 'Чайылган' },
              price: 0
            }
          }
        ],
        notes: 'Toast well done'
      },
      {
        id: 'item_22',
        menuItemId: 'menu_item_22',
        name: { en: 'Coffee', ar: 'قهوة', ru: 'Кофе', ky: 'Кофе' },
        price: 2.99,
        quantity: 2,
        modifiers: [
          {
            groupId: 'mod_group_10',
            groupName: { en: 'Milk', ar: 'الحليب', ru: 'Молоко', ky: 'Сүт' },
            option: {
              id: 'mod_opt_12',
              name: { en: 'Oat Milk', ar: 'حليب الشوفان', ru: 'Овсяное молоко', ky: 'Сулу сүт' },
              price: 0.50
            }
          }
        ],
        notes: ''
      }
    ],
    subtotal: 31.96,
    tax: 2.56,
    total: 34.52,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: '',
    estimatedTime: 15,
    menuType: 'breakfast'
  },

  // Late night delivery order
  {
    userId: 'user_customer_3',
    branchId: 'branch_2',
    type: 'delivery',
    status: 'confirmed',
    deliveryAddress: {
      street: '321 Pine Road',
      city: 'Bishkek',
      country: 'Kyrgyzstan',
      zipCode: '720003',
      coordinates: { lat: 42.8500, lng: 74.5500 },
      isDefault: false,
      deliveryInstructions: 'Night delivery - please be quiet'
    },
    items: [
      {
        id: 'item_23',
        menuItemId: 'menu_item_23',
        name: { en: 'Shawarma', ar: 'شاورما', ru: 'Шаурма', ky: 'Шаурма' },
        price: 7.99,
        quantity: 3,
        modifiers: [
          {
            groupId: 'mod_group_11',
            groupName: { en: 'Spice Level', ar: 'مستوى التوابل', ru: 'Острота', ky: 'Ачуу деңгээли' },
            option: {
              id: 'mod_opt_13',
              name: { en: 'Extra Spicy', ar: 'حار جدا', ru: 'Очень острый', ky: 'Өтө ачуу' },
              price: 0
            }
          }
        ],
        notes: 'Extra garlic sauce'
      },
      {
        id: 'item_24',
        menuItemId: 'menu_item_24',
        name: { en: 'Falafel', ar: 'فلافل', ru: 'Фалафель', ky: 'Фалафель' },
        price: 5.99,
        quantity: 2,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 35.95,
    tax: 2.88,
    deliveryFee: 4.00,
    total: 42.83,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    notes: 'Late night order',
    estimatedTime: 45,
    menuType: 'regular'
  },

  // Cancelled takeaway order
  {
    userId: 'user_customer_2',
    branchId: 'branch_1',
    type: 'takeaway',
    status: 'cancelled',
    items: [
      {
        id: 'item_25',
        menuItemId: 'menu_item_25',
        name: { en: 'Fish and Chips', ar: 'سمك وبطاطس', ru: 'Рыба с картофелем', ky: 'Балык жана картошка' },
        price: 13.99,
        quantity: 1,
        modifiers: [],
        notes: ''
      }
    ],
    subtotal: 13.99,
    tax: 1.12,
    total: 15.11,
    paymentMethod: 'cash',
    paymentStatus: 'cancelled',
    notes: 'Customer cancelled - took too long',
    estimatedTime: 20,
    menuType: 'regular'
  },

  // Large group dine-in order
  {
    userId: 'user_customer_1',
    branchId: 'branch_2',
    tableNumber: 'VIP-1',
    type: 'dine-in',
    status: 'confirmed',
    items: [
      {
        id: 'item_26',
        menuItemId: 'menu_item_26',
        name: { en: 'Mix Grill Platter', ar: 'طبق مشاوي مشكلة', ru: 'Мясное ассорти', ky: 'Аралаш гриль' },
        price: 45.99,
        quantity: 2,
        modifiers: [],
        notes: 'For 8 people'
      },
      {
        id: 'item_27',
        menuItemId: 'menu_item_27',
        name: { en: 'Hummus', ar: 'حمص', ru: 'Хумус', ky: 'Хумус' },
        price: 5.99,
        quantity: 3,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_28',
        menuItemId: 'menu_item_28',
        name: { en: 'Pita Bread', ar: 'خبز بيتا', ru: 'Пита', ky: 'Пита нан' },
        price: 1.99,
        quantity: 5,
        modifiers: [],
        notes: ''
      },
      {
        id: 'item_29',
        menuItemId: 'menu_item_29',
        name: { en: 'Fresh Juice', ar: 'عصير طازج', ru: 'Свежий сок', ky: 'Жаңы ширe' },
        price: 4.99,
        quantity: 8,
        modifiers: [],
        notes: 'Mixed flavors'
      }
    ],
    subtotal: 159.85,
    tax: 12.79,
    total: 172.64,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    notes: 'Birthday celebration - please bring candles',
    estimatedTime: 35,
    menuType: 'regular'
  }
];

/**
 * Function to initialize sample orders in the database
 * This adds realistic order examples with timestamps
 */
export function initializeSampleOrders() {
  const now = new Date();
  const orders: Order[] = [];

  sampleOrders.forEach((order, index) => {
    // Create different timestamps for different orders
    let createdAt = new Date(now);
    
    if (order.status === 'completed') {
      // Completed orders are from 1-3 days ago
      createdAt.setDate(now.getDate() - (1 + Math.floor(index / 3)));
    } else if (order.status === 'cancelled') {
      // Cancelled orders are from yesterday
      createdAt.setDate(now.getDate() - 1);
    } else if (order.status === 'confirmed' || order.status === 'preparing') {
      // Active orders are from 10-60 minutes ago
      createdAt.setMinutes(now.getMinutes() - (10 + (index * 5)));
    } else if (order.status === 'ready') {
      // Ready orders are from 5-15 minutes ago
      createdAt.setMinutes(now.getMinutes() - (5 + index));
    } else if (order.status === 'served') {
      // Served orders are from 2-4 hours ago
      createdAt.setHours(now.getHours() - (2 + Math.floor(index / 2)));
    }

    const fullOrder: Order = {
      ...order,
      id: `order_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD${(1000 + index).toString()}`,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };

    orders.push(fullOrder);
  });

  return orders;
}
