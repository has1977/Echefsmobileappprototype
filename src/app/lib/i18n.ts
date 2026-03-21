import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: 'Welcome to eChefs',
      continue: 'Continue',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      
      // Common Actions
      common: {
        back: 'Back',
        changeLanguage: 'Change Language',
        notifications: 'Notifications',
      },
      
      // Navigation
      nav: {
        home: 'Home',
        menu: 'Menu',
        cart: 'Cart',
        promotions: 'Promotions',
        loyalty: 'Loyalty',
      },
      
      // Language Selection
      selectLanguage: 'Select Your Language',
      languages: {
        en: 'English',
        ar: 'العربية',
        ru: 'Русский',
        ky: 'Кыргызча',
      },
      
      // Branch & Table Selection
      selectBranch: 'Select Branch',
      scanQR: 'Scan QR Code',
      scanNFC: 'Tap NFC',
      manualEntry: 'Enter Manually',
      tableNumber: 'Table Number',
      selectRegion: 'Select Region',
      regions: {
        mainHall: 'Main Hall',
        smoking: 'Smoking Area',
        nonSmoking: 'Non-Smoking',
        outdoor: 'Outdoor Terrace',
        vip: 'VIP Room',
      },
      
      // Menu
      menu: 'Menu',
      categories: 'Categories',
      viewMenu: 'View Menu',
      addToCart: 'Add to Cart',
      customize: 'Customize',
      modifiers: 'Modifiers',
      extras: 'Extras',
      spiceLevel: 'Spice Level',
      spiceLevels: {
        none: 'No Spice',
        mild: 'Mild',
        medium: 'Medium',
        hot: 'Hot',
        veryHot: 'Very Hot',
      },
      remove: 'Remove',
      add: 'Add',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      
      // Cart & Checkout
      cart: 'Cart',
      yourCart: 'Your Cart',
      cartEmpty: 'Your cart is empty',
      checkout: 'Checkout',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      grandTotal: 'Grand Total',
      placeOrder: 'Place Order',
      
      // Payment
      payment: 'Payment',
      paymentMethod: 'Payment Method',
      paymentMethods: {
        cash: 'Pay with Waiter (Cash)',
        card: 'Pay with Card',
        pos: 'Custom POS',
        qr: 'QR Payment',
      },
      splitBill: 'Split Bill',
      addTip: 'Add Tip',
      tipPercentage: 'Tip Percentage',
      processingPayment: 'Processing Payment...',
      paymentSuccess: 'Payment Successful!',
      paymentFailed: 'Payment Failed',
      
      // Order Status
      orderStatus: 'Order Status',
      orderStatuses: {
        received: 'Order Received',
        preparing: 'Preparing',
        ready: 'Ready',
        served: 'Served',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      
      // Reviews & Ratings
      reviews: 'Reviews',
      rating: 'Rating',
      writeReview: 'Write a Review',
      submitReview: 'Submit Review',
      reviewPlaceholder: 'Share your experience...',
      
      // Promotions & Loyalty
      promotions: 'Promotions',
      loyaltyCard: 'Loyalty Card',
      points: 'Points',
      rewards: 'Rewards',
      tiers: {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
      },
      
      // Badges
      badges: {
        hot: 'Hot',
        new: 'New',
        discount: 'Discount',
        popular: 'Popular',
        recommended: 'Recommended',
      },
      
      // Waiter Interface
      waiter: {
        title: 'Waiter Dashboard',
        createOrder: 'Create Order',
        modifyOrder: 'Modify Order',
        assignTable: 'Assign Table',
        requestPayment: 'Request Payment',
        viewOrders: 'View Orders',
        quickActions: 'Quick Actions',
      },
      
      // KDS
      kds: {
        title: 'Kitchen Display System',
        newOrder: 'New Order',
        preparing: 'Preparing',
        ready: 'Ready',
        timer: 'Timer',
        priority: 'Priority',
        section: 'Section',
        sections: {
          grill: 'Grill',
          salads: 'Salads',
          desserts: 'Desserts',
          drinks: 'Drinks',
          hot: 'Hot Kitchen',
        },
      },
      
      // Manager Dashboard
      manager: {
        title: 'Manager Dashboard',
        liveOrders: 'Live Orders',
        revenue: 'Revenue',
        menuManagement: 'Menu Management',
        promotions: 'Promotions',
        reports: 'Reports',
        dailyRevenue: 'Daily Revenue',
        topDishes: 'Top Dishes',
        peakHours: 'Peak Hours',
      },
      
      // Admin Dashboard
      admin: {
        title: 'Admin Dashboard',
        multiBranch: 'Multi-Branch Control',
        users: 'Users & Roles',
        analytics: 'Analytics',
        settings: 'System Settings',
        guestMode: 'Guest Browsing',
      },
      
      // Offline
      offline: {
        title: 'You are offline',
        message: 'Your order will sync when connection is restored',
        retry: 'Retry Connection',
      },
      
      // Notifications
      notifications: {
        newOrder: 'New order received',
        orderReady: 'Your order is ready!',
        paymentRequest: 'Payment requested',
      },
    },
  },
  ar: {
    translation: {
      // Common
      welcome: 'مرحباً بك في إي شيفز',
      continue: 'متابعة',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      back: 'رجوع',
      
      // Common Actions
      common: {
        back: 'رجوع',
        changeLanguage: 'تغيير اللغة',
        notifications: 'الإشعارات',
      },
      
      // Navigation
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        cart: 'السلة',
        promotions: 'العروض',
        loyalty: 'الولاء',
      },
      
      // Language Selection
      selectLanguage: 'اختر لغتك',
      languages: {
        en: 'English',
        ar: 'العربية',
        ru: 'Русский',
        ky: 'Кыргызча',
      },
      
      // Branch & Table Selection
      selectBranch: 'اختر الفرع',
      scanQR: 'مسح رمز QR',
      scanNFC: 'اضغط على NFC',
      manualEntry: 'إدخال يدوي',
      tableNumber: 'رقم الطاول��',
      selectRegion: 'اختر المنطقة',
      regions: {
        mainHall: 'الصالة الرئيسية',
        smoking: 'منطقة التدخين',
        nonSmoking: 'غير المدخنين',
        outdoor: 'التراس الخارجي',
        vip: 'غرفة كبار الشخصيات',
      },
      
      // Menu
      menu: 'القائمة',
      categories: 'الفئات',
      viewMenu: 'عرض القائمة',
      addToCart: 'أضف إلى السلة',
      customize: 'تخصيص',
      modifiers: 'الإضافات',
      extras: 'إضافات',
      spiceLevel: 'مستوى التوابل',
      spiceLevels: {
        none: 'بدون توابل',
        mild: 'خفيف',
        medium: 'متوسط',
        hot: 'حار',
        veryHot: 'حار جداً',
      },
      remove: 'إزالة',
      add: 'إضافة',
      quantity: 'الكمية',
      price: 'السعر',
      total: 'المجموع',
      
      // Cart & Checkout
      cart: 'السلة',
      yourCart: 'سلتك',
      cartEmpty: 'سلتك فارغة',
      checkout: 'الدفع',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      discount: 'الخصم',
      grandTotal: 'المجموع الإجمالي',
      placeOrder: 'تقديم الطلب',
      
      // Payment
      payment: 'الدفع',
      paymentMethod: 'طريقة الدفع',
      paymentMethods: {
        cash: 'الدفع نقداً مع النادل',
        card: 'الدفع بالبطاقة',
        pos: 'نقاط البيع المخصصة',
        qr: 'الدفع بواسطة QR',
      },
      splitBill: 'تقسيم الفاتورة',
      addTip: 'إضافة إكرامية',
      tipPercentage: 'نسبة الإكرامية',
      processingPayment: 'جاري معالجة الدفع...',
      paymentSuccess: 'تم الدفع بنجاح!',
      paymentFailed: 'فشل الدفع',
      
      // Order Status
      orderStatus: 'حالة الطلب',
      orderStatuses: {
        received: 'تم استلام الطلب',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        served: 'تم التقديم',
        completed: 'مكتمل',
        cancelled: 'ملغي',
      },
      
      // Reviews & Ratings
      reviews: 'التقييمات',
      rating: 'التقييم',
      writeReview: 'اكتب تقييم',
      submitReview: 'إرسال التقييم',
      reviewPlaceholder: 'شارك تجربتك...',
      
      // Promotions & Loyalty
      promotions: 'العروض',
      loyaltyCard: 'بطاقة الولاء',
      points: 'النقاط',
      rewards: 'المكافآت',
      tiers: {
        bronze: 'برونزي',
        silver: 'فضي',
        gold: 'ذهبي',
      },
      
      // Badges
      badges: {
        hot: 'حار',
        new: 'جديد',
        discount: 'خصم',
        popular: 'مشهور',
        recommended: 'موصى به',
      },
      
      // Waiter Interface
      waiter: {
        title: 'لوحة النادل',
        createOrder: 'إنشاء طلب',
        modifyOrder: 'تعديل الطلب',
        assignTable: 'تعيين طاولة',
        requestPayment: 'طلب الدفع',
        viewOrders: 'عرض الطلبات',
        quickActions: 'إجراءات سريعة',
      },
      
      // KDS
      kds: {
        title: 'نظام عرض المطبخ',
        newOrder: 'طلب جديد',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        timer: 'المؤقت',
        priority: 'الأولوية',
        section: 'القسم',
        sections: {
          grill: 'الشواء',
          salads: 'السلطات',
          desserts: 'الحلويات',
          drinks: 'المشروبات',
          hot: 'المطبخ الساخن',
        },
      },
      
      // Manager Dashboard
      manager: {
        title: 'لوحة المدير',
        liveOrders: 'الطلبات الحية',
        revenue: 'الإيرادات',
        menuManagement: 'إدارة القائمة',
        promotions: 'العروض الترويجية',
        reports: 'التقارير',
        dailyRevenue: 'الإيرادات اليومية',
        topDishes: 'الأطباق الأكثر طلباً',
        peakHours: 'ساعات الذروة',
      },
      
      // Admin Dashboard
      admin: {
        title: 'لوحة الإدارة',
        multiBranch: 'التحكم متعدد الفروع',
        users: 'المستخدمون والأدوار',
        analytics: 'التحليلات',
        settings: 'إعدادات النظام',
        guestMode: 'تصفح الضيف',
      },
      
      // Offline
      offline: {
        title: 'أنت غير متصل',
        message: 'سيتم مزامنة طلبك عند استعادة الاتصال',
        retry: 'إعادة محاولة الاتصال',
      },
      
      // Notifications
      notifications: {
        newOrder: 'تم استلام طلب جديد',
        orderReady: 'طلبك جاهز!',
        paymentRequest: 'طلب الدفع',
      },
    },
  },
  ru: {
    translation: {
      // Common
      welcome: 'Добро пожаловать в eChefs',
      continue: 'Продолжить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      edit: 'Редактировать',
      delete: 'Удалить',
      close: 'Закрыть',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      back: 'Назад',
      
      // Common Actions
      common: {
        back: 'Назад',
        changeLanguage: 'Сменить язык',
        notifications: 'Уведомления',
      },
      
      // Navigation
      nav: {
        home: 'Главная',
        menu: 'Меню',
        cart: 'Корзина',
        promotions: 'Акции',
        loyalty: 'Лояльность',
      },
      
      // Language Selection
      selectLanguage: 'Выберите язык',
      languages: {
        en: 'English',
        ar: 'العربية',
        ru: 'Русский',
        ky: 'Кыргызча',
      },
      
      // Branch & Table Selection
      selectBranch: 'Выбрать филиал',
      scanQR: 'Сканировать QR код',
      scanNFC: 'Коснуться NFC',
      manualEntry: 'Ввести вручную',
      tableNumber: 'Номер столика',
      selectRegion: 'Выбрать зону',
      regions: {
        mainHall: 'Основной зал',
        smoking: 'Зона для курящих',
        nonSmoking: 'Для некурящих',
        outdoor: 'Терраса',
        vip: 'VIP зал',
      },
      
      // Menu
      menu: 'Меню',
      categories: 'Категории',
      viewMenu: 'Просмотр меню',
      addToCart: 'Добавить в корзину',
      customize: 'Настроить',
      modifiers: 'Модификаторы',
      extras: 'Дополнительно',
      spiceLevel: 'Уровень остроты',
      spiceLevels: {
        none: 'Без остроты',
        mild: 'Слабо',
        medium: 'Средне',
        hot: 'Остро',
        veryHot: 'Очень остро',
      },
      remove: 'Удалить',
      add: 'Добавить',
      quantity: 'Количество',
      price: 'Цена',
      total: 'Итого',
      
      // Cart & Checkout
      cart: 'Корзина',
      yourCart: 'Ваша корзина',
      cartEmpty: 'Корзина пуста',
      checkout: 'Оформить заказ',
      subtotal: 'Промежуточный итог',
      tax: 'Налог',
      discount: 'Скидка',
      grandTotal: 'Общая сумма',
      placeOrder: 'Разместить заказ',
      
      // Payment
      payment: 'Оплата',
      paymentMethod: 'Способ оплаты',
      paymentMethods: {
        cash: 'Оплата официанту (наличные)',
        card: 'Оплата картой',
        pos: 'Терминал POS',
        qr: 'QR оплата',
      },
      splitBill: 'Разделить счет',
      addTip: 'Добавить чаевые',
      tipPercentage: 'Процент чаевых',
      processingPayment: 'Обработка платежа...',
      paymentSuccess: 'Оплата прошла успешно!',
      paymentFailed: 'Оплата не прошла',
      
      // Order Status
      orderStatus: 'Статус заказа',
      orderStatuses: {
        received: 'Заказ получен',
        preparing: 'Готовится',
        ready: 'Готов',
        served: 'Подан',
        completed: 'Завершен',
        cancelled: 'Отменен',
      },
      
      // Reviews & Ratings
      reviews: 'Отзывы',
      rating: 'Рейтинг',
      writeReview: 'Написать отзыв',
      submitReview: 'Отправить отзыв',
      reviewPlaceholder: 'Поделитесь впечатлением...',
      
      // Promotions & Loyalty
      promotions: 'Акции',
      loyaltyCard: 'Карта лояльности',
      points: 'Баллы',
      rewards: 'Награды',
      tiers: {
        bronze: 'Бронза',
        silver: 'Серебро',
        gold: 'Золото',
      },
      
      // Badges
      badges: {
        hot: 'Острое',
        new: 'Новинка',
        discount: 'Скидка',
        popular: 'Популярное',
        recommended: 'Рекомендуем',
      },
      
      // Waiter Interface
      waiter: {
        title: 'Панель официанта',
        createOrder: 'Создать заказ',
        modifyOrder: 'Изменить заказ',
        assignTable: 'Назначить столик',
        requestPayment: 'Запросить оплату',
        viewOrders: 'Просмотр заказов',
        quickActions: 'Быстрые действия',
      },
      
      // KDS
      kds: {
        title: 'Система отображения кухни',
        newOrder: 'Новый заказ',
        preparing: 'Готовится',
        ready: 'Готов',
        timer: 'Таймер',
        priority: 'Приоритет',
        section: 'Секция',
        sections: {
          grill: 'Гриль',
          salads: 'Салаты',
          desserts: 'Десерты',
          drinks: 'Напитки',
          hot: 'Горячая кухня',
        },
      },
      
      // Manager Dashboard
      manager: {
        title: 'Панель менеджера',
        liveOrders: 'Текущие заказы',
        revenue: 'Доход',
        menuManagement: 'Упр��вление меню',
        promotions: 'Акции',
        reports: 'Отчеты',
        dailyRevenue: 'Дневной доход',
        topDishes: 'Топ блюд',
        peakHours: 'Часы пик',
      },
      
      // Admin Dashboard
      admin: {
        title: 'Панель администратора',
        multiBranch: 'Управление филиалами',
        users: 'Пользователи и роли',
        analytics: 'Аналитика',
        settings: 'Настройки системы',
        guestMode: 'Гостевой режим',
      },
      
      // Offline
      offline: {
        title: 'Вы не в сети',
        message: 'Ваш заказ синхронизируется при восстановлении соединения',
        retry: 'Повторить подключение',
      },
      
      // Notifications
      notifications: {
        newOrder: 'Получен новый заказ',
        orderReady: 'Ваш заказ готов!',
        paymentRequest: 'Запрошена оплата',
      },
    },
  },
  ky: {
    translation: {
      // Common
      welcome: 'eChefs\'ке кош келиңиз',
      continue: 'Улантуу',
      cancel: 'Жокко чыгаруу',
      confirm: 'Ырастоо',
      save: 'Сактоо',
      edit: 'Өзгөртүү',
      delete: 'Өчүрүү',
      close: 'Жабуу',
      search: 'Издөө',
      filter: 'Чыпкалоо',
      sort: 'Иретке салуу',
      loading: 'Жүктөлүүдө...',
      error: 'Ката',
      success: 'Ийгиликтүү',
      back: 'Кайтуу',
      
      // Common Actions
      common: {
        back: 'Кайтуу',
        changeLanguage: 'Тилди өзгөртүү',
        notifications: 'Билдирүүлөр',
      },
      
      // Navigation
      nav: {
        home: 'Башкы бет',
        menu: 'Меню',
        cart: 'Себет',
        promotions: 'Акциялар',
        loyalty: 'Берилгендик',
      },
      
      // Language Selection
      selectLanguage: 'Тилди тандаңыз',
      languages: {
        en: 'English',
        ar: 'العربية',
        ru: 'Русский',
        ky: 'Кыргызча',
      },
      
      // Branch & Table Selection
      selectBranch: 'Филиалды тандаңыз',
      scanQR: 'QR кодун скандоо',
      scanNFC: 'NFC\'ни басуу',
      manualEntry: 'Кол менен киргизүү',
      tableNumber: 'Столдун номери',
      selectRegion: 'Аймакты тандаңыз',
      regions: {
        mainHall: 'Башкы зал',
        smoking: 'Тамеки т��ртуучулар үчүн',
        nonSmoking: 'Тамеки тартпагандар үчүн',
        outdoor: 'Терраса',
        vip: 'VIP бөлмө',
      },
      
      // Menu
      menu: 'Меню',
      categories: 'Категориялар',
      viewMenu: 'Менюну көрүү',
      addToCart: 'Себетке кошуу',
      customize: 'Ыңгайлаштыруу',
      modifiers: 'Өзгөртүүчүлөр',
      extras: 'Кошумча',
      spiceLevel: 'Ачуулук деңгээли',
      spiceLevels: {
        none: 'Ачуулуксуз',
        mild: 'Аз ачуу',
        medium: 'Орточо',
        hot: 'Ачуу',
        veryHot: 'Өтө ачуу',
      },
      remove: 'Алып салуу',
      add: 'Кошуу',
      quantity: 'Саны',
      price: 'Баасы',
      total: 'Жалпы',
      
      // Cart & Checkout
      cart: 'Себет',
      yourCart: 'Сиздин себет',
      cartEmpty: 'Себет бош',
      checkout: 'Төлөө',
      subtotal: 'Аралык жыйынтык',
      tax: 'Салык',
      discount: 'Арзандатуу',
      grandTotal: 'Жалпы сумма',
      placeOrder: 'Буйрутма берүү',
      
      // Payment
      payment: 'Төлөм',
      paymentMethod: 'Төлөм ыкмасы',
      paymentMethods: {
        cash: 'Официантка төлөө (акча)',
        card: 'Карта менен төлөө',
        pos: 'POS терминал',
        qr: 'QR төлөм',
      },
      splitBill: 'Эсепти бөлүү',
      addTip: 'Чай акча кошуу',
      tipPercentage: 'Чай акча пайызы',
      processingPayment: 'Төлөм иштетилүүдө...',
      paymentSuccess: 'Төлөм ийгиликтүү өттү!',
      paymentFailed: 'Төлөм өткөн жок',
      
      // Order Status
      orderStatus: 'Буйрутманын абалы',
      orderStatuses: {
        received: 'Буйрутма алынды',
        preparing: 'Даярдалууда',
        ready: 'Даяр',
        served: 'Берилди',
        completed: 'Аяктады',
        cancelled: 'Жокко чыгарылды',
      },
      
      // Reviews & Ratings
      reviews: 'Сын-пикирлер',
      rating: 'Баалоо',
      writeReview: 'Сын-пикир жазуу',
      submitReview: 'Сын-пикир жиберүү',
      reviewPlaceholder: 'Тажрыйбаңыз менен бөлүшүңүз...',
      
      // Promotions & Loyalty
      promotions: 'Акциялар',
      loyaltyCard: 'Берилгендик картасы',
      points: 'Упайлар',
      rewards: 'Сыйлыктар',
      tiers: {
        bronze: 'Коло',
        silver: 'Күмүш',
        gold: 'Алтын',
      },
      
      // Badges
      badges: {
        hot: 'Ачуу',
        new: 'Жаңы',
        discount: 'Арзандатуу',
        popular: 'Популярдуу',
        recommended: 'Сунушталат',
      },
      
      // Waiter Interface
      waiter: {
        title: 'Официанттын панели',
        createOrder: 'Буйрутма түзүү',
        modifyOrder: 'Буйрутманы өзгөртүү',
        assignTable: 'Столду дайындоо',
        requestPayment: 'Төлөм суроо',
        viewOrders: 'Буйрутмаларды көрүү',
        quickActions: 'Тез аракеттер',
      },
      
      // KDS
      kds: {
        title: 'Ашканадагы дисплей системасы',
        newOrder: 'Жаңы буйрутма',
        preparing: 'Даярдалууда',
        ready: 'Даяр',
        timer: 'Таймер',
        priority: 'Артыкчылык',
        section: 'Бөлүм',
        sections: {
          grill: 'Гриль',
          salads: 'Салаттар',
          desserts: 'Десерттер',
          drinks: 'Суусундуктар',
          hot: 'Ысык ашкана',
        },
      },
      
      // Manager Dashboard
      manager: {
        title: 'Башкаруучунун панели',
        liveOrders: 'Учурдагы буйрутмалар',
        revenue: 'Киреше',
        menuManagement: 'Менюну башкаруу',
        promotions: 'Акциялар',
        reports: 'Отчеттор',
        dailyRevenue: 'Күндүк киреше',
        topDishes: 'Топ тамактар',
        peakHours: 'Пик саат',
      },
      
      // Admin Dashboard
      admin: {
        title: 'Администратордун панели',
        multiBranch: 'Филиалдарды башкаруу',
        users: 'Колдонуучулар жана ролдор',
        analytics: 'Аналитика',
        settings: 'Системанын тууралоолору',
        guestMode: 'Конок режими',
      },
      
      // Offline
      offline: {
        title: 'Сиз офлайнсыз',
        message: 'Буйрутмаңыз байланыш калыбына келгенде синхрондоштурулат',
        retry: 'Кайра байланууга аракет кылуу',
      },
      
      // Notifications
      notifications: {
        newOrder: 'Жаңы буйрутма алынды',
        orderReady: 'Буйрутмаңыз даяр!',
        paymentRequest: 'Төлөм суралды',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;