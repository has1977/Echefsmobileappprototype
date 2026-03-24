import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { db } from '../lib/database';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Edit2, LogOut, MapPin, Calendar, 
  Package, Clock, Heart, Star, Gift, ShoppingBag, 
  ChevronRight, Plus, Trash2, Check, X, Camera,
  Crown, TrendingUp, Award, Settings, Shield, RefreshCw,
  Home, Briefcase, Building, CreditCard, History, Loader2,
  Eye, EyeOff, MapPinned, Truck, UtensilsCrossed, ArrowLeft,
  Sparkles, Zap, Lightbulb, Trophy, Percent, Target, Info
} from 'lucide-react';
import type { Order, CartItem, UserAddress, UserPaymentMethod } from '../lib/types';

export function EnhancedProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, updateProfile } = useAuth();
  const { orders, currentLanguage, addToCart, menuItems, cart, loyaltyCard } = useApp();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tracking' | 'addresses' | 'cards' | 'favorites'>('overview');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Profile Edit State
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Saved Addresses - Sync with database
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  
  // Payment Cards - Sync with database
  const [savedCards, setSavedCards] = useState<UserPaymentMethod[]>([]);
  
  // Favorites - Sync with database
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      // Load from database
      setSavedAddresses(user?.addresses || []);
      setSavedCards(user?.paymentMethods || []);
      setFavoriteItems(user?.preferences?.favoriteItems || []);
    }
  }, [user]);

  const [newAddress, setNewAddress] = useState<Partial<UserAddress>>({
    type: 'home',
    label: '',
    street: '',
    city: 'Bishkek',
    country: 'Kyrgyzstan',
    isDefault: false,
  });

  const [newCard, setNewCard] = useState<Partial<UserPaymentMethod & { cvv?: string }>>({
    type: 'card',
    label: '',
    cardholderName: user?.name || '',
    cardNumber: '',
    expiryMonth: undefined,
    expiryYear: undefined,
    cardType: 'visa',
    isDefault: false,
    cvv: '',
  });

  const [showCardNumber, setShowCardNumber] = useState(false);

  const isRTL = currentLanguage === 'ar';
  
  const userOrders = orders.filter(o => o.customerId === user?.id);
  const activeOrders = userOrders.filter(o => 
    ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)
  );
  const completedOrders = userOrders.filter(o => o.status === 'completed');
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  const translations = {
    en: {
      title: 'Profile',
      overview: 'Overview',
      orders: 'Orders',
      tracking: 'Active',
      addresses: 'Addresses',
      cards: 'Cards',
      favorites: 'Favorites',
      orderHistory: 'Order History',
      activeOrders: 'Active Orders',
      noOrders: 'No orders yet',
      noActiveOrders: 'No active orders',
      startOrdering: 'Start Ordering',
      reorder: 'Reorder',
      viewDetails: 'View Details',
      trackOrder: 'Track Order',
      savedAddresses: 'Saved Addresses',
      addNewAddress: 'Add New Address',
      noAddresses: 'No saved addresses',
      paymentMethods: 'Payment Methods',
      addNewCard: 'Add New Card',
      noCards: 'No payment cards',
      favoriteItems: 'Favorite Items',
      noFavorites: 'No favorite items yet',
      addToCart: 'Add to Cart',
      stats: 'Your Stats',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      loyaltyPoints: 'Loyalty Points',
      memberSince: 'Member Since',
      editProfile: 'Edit Profile',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      accountSettings: 'Account Settings',
      security: 'Security',
      settings: 'Settings',
      help: 'Help & Support',
      signOut: 'Sign Out',
      delete: 'Delete',
      edit: 'Edit',
      setDefault: 'Set as Default',
      default: 'Default',
      cancel: 'Cancel',
      save: 'Save',
      addressType: 'Address Type',
      addressLabel: 'Label (Optional)',
      streetAddress: 'Street Address',
      apartment: 'Apartment/Suite',
      city: 'City',
      postalCode: 'Postal Code (Optional)',
      deliveryInstructions: 'Delivery Instructions (Optional)',
      cardholderName: 'Cardholder Name',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardType: 'Card Type',
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivering: 'Delivering',
      completed: 'Completed',
      cancelled: 'Cancelled',
      home: 'Home',
      work: 'Work',
      other: 'Other',
      items: 'items',
      viewRewards: 'View Rewards',
      expiresOn: 'Expires',
      endsIn: 'Ends in',
      showNumber: 'Show Number',
      hideNumber: 'Hide Number',
      addCard: 'Add Card',
      month: 'Month',
      year: 'Year',
      estimatedTime: 'Est. time',
      minutes: 'min',
      updateProfile: 'Update Profile',
      profileUpdated: 'Profile updated successfully!',
      welcomeBack: 'Welcome back',
      quickActions: 'Quick Actions',
      myAccount: 'My Account',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      browseMenu: 'Browse Menu',
    },
    ar: {
      title: 'الملف الشخصي',
      overview: 'نظرة عامة',
      orders: 'الطلبات',
      tracking: 'نشطة',
      addresses: 'العناوين',
      cards: 'البطاقات',
      favorites: 'المفضلة',
      orderHistory: 'سجل الطلبات',
      activeOrders: 'الطلبات النشطة',
      noOrders: 'لا توجد طلبات بعد',
      noActiveOrders: 'لا توجد طلبات نشطة',
      startOrdering: 'ابدأ الطلب',
      reorder: 'إعادة الطلب',
      viewDetails: 'عرض التفاصيل',
      trackOrder: 'تتبع الطلب',
      savedAddresses: 'العناوين المحفوظة',
      addNewAddress: 'إضافة عنوان جديد',
      noAddresses: 'لا توجد عناوين محفوظة',
      paymentMethods: 'طرق الدفع',
      addNewCard: 'إضافة بطاقة جديدة',
      noCards: 'لا توجد بطاقات',
      favoriteItems: 'الأصناف المفضلة',
      noFavorites: 'لا توجد أصناف مفضلة بعد',
      addToCart: 'إضافة للسلة',
      stats: 'إحصائياتك',
      totalOrders: 'إجمالي الطلبات',
      totalSpent: 'إجمالي الإنفاق',
      loyaltyPoints: 'نقاط الولاء',
      memberSince: 'عضو منذ',
      editProfile: 'تعديل الملف',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phoneNumber: 'رقم الهاتف',
      accountSettings: 'إعدادات الحساب',
      security: 'الأمان',
      settings: 'الإعدادات',
      help: 'المساعدة والدعم',
      signOut: 'تسجيل الخروج',
      delete: 'حذف',
      edit: 'تعديل',
      setDefault: 'تعيين كافتراضي',
      default: 'افتراضي',
      cancel: 'إلغاء',
      save: 'حفظ',
      addressType: 'نوع العنوان',
      addressLabel: 'التسمية (اختياري)',
      streetAddress: 'عنوان الشارع',
      apartment: 'شقة/جناح',
      city: 'المدينة',
      postalCode: 'الرمز البريدي (اختياري)',
      deliveryInstructions: 'تعليمات التوصيل (اختياري)',
      cardholderName: 'اسم حامل البطاقة',
      cardNumber: 'رقم البطاقة',
      expiryDate: 'تاريخ الانتهاء',
      cvv: 'CVV',
      cardType: 'نوع البطاقة',
      visa: 'فيزا',
      mastercard: 'ماستركارد',
      amex: 'أمريكان إكسبريس',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivering: 'قيد التوصيل',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      home: 'المنزل',
      work: 'العمل',
      other: 'أخرى',
      items: 'أصناف',
      viewRewards: 'عرض المكافآت',
      expiresOn: 'ينتهي في',
      endsIn: 'ينتهي خلال',
      showNumber: 'إظهار الرقم',
      hideNumber: 'إخفاء الرقم',
      addCard: 'إضافة بطاقة',
      month: 'الشهر',
      year: 'السنة',
      estimatedTime: 'الوقت المقدر',
      minutes: 'دقيقة',
      updateProfile: 'تحديث الملف',
      profileUpdated: 'تم تحديث الملف بنجاح!',
      welcomeBack: 'مرحبا بعودتك',
      quickActions: 'إجراءات سريعة',
      myAccount: 'حسابي',
      recentActivity: 'النشاط الأخير',
      viewAll: 'عرض الكل',
      browseMenu: 'تصفح القائمة',
    },
    ru: {
      title: 'Профиль',
      overview: 'Обзор',
      orders: 'Заказы',
      tracking: 'Активные',
      addresses: 'Адреса',
      cards: 'Карты',
      favorites: 'Избранное',
      orderHistory: 'История заказов',
      activeOrders: 'Активные заказы',
      noOrders: 'Нет заказов',
      noActiveOrders: 'Нет активных заказов',
      startOrdering: 'Начать заказ',
      reorder: 'Повторить',
      viewDetails: 'Подробности',
      trackOrder: 'Отследить',
      savedAddresses: 'Сохраненные адреса',
      addNewAddress: 'Добавить адрес',
      noAddresses: 'Нет адресов',
      paymentMethods: 'Способы оплаты',
      addNewCard: 'Добавить карту',
      noCards: 'Нет карт',
      favoriteItems: 'Избранные блюда',
      noFavorites: 'Нет избранных',
      addToCart: 'В корзину',
      stats: 'Ваша статистика',
      totalOrders: 'Всего заказов',
      totalSpent: 'Потрачено',
      loyaltyPoints: 'Баллы',
      memberSince: 'Участник с',
      editProfile: 'Редактировать',
      personalInfo: 'Личная информация',
      name: 'Полное имя',
      email: 'Email',
      phoneNumber: 'Телефон',
      accountSettings: 'Настройки аккаунта',
      security: 'Безопасность',
      settings: 'Настройки',
      help: 'Помощь',
      signOut: 'Выход',
      delete: 'Удалить',
      edit: 'Изменить',
      setDefault: 'По умолчанию',
      default: 'По умолчанию',
      cancel: 'Отмена',
      save: 'Сохранить',
      addressType: 'Тип адреса',
      addressLabel: 'Название (необязательно)',
      streetAddress: 'Улица и дом',
      apartment: 'Квартира/офис',
      city: 'Город',
      postalCode: 'Индекс (необязательно)',
      deliveryInstructions: 'Инструкции по доставке (необязательно)',
      cardholderName: 'Имя владельца',
      cardNumber: 'Номер карты',
      expiryDate: 'Срок действия',
      cvv: 'CVV',
      cardType: 'Тип карты',
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      pending: 'Ожидание',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов',
      delivering: 'Доставляется',
      completed: 'Завершен',
      cancelled: 'Отменен',
      home: 'Дом',
      work: 'Работа',
      other: 'Другое',
      items: 'позиций',
      viewRewards: 'Награды',
      expiresOn: 'Истекает',
      endsIn: 'Заканчивается',
      showNumber: 'Показать',
      hideNumber: 'Скрыть',
      addCard: 'Добавить',
      month: 'Месяц',
      year: 'Год',
      estimatedTime: 'Время',
      minutes: 'мин',
      updateProfile: 'Обновить',
      profileUpdated: 'Профиль обновлен!',
      welcomeBack: 'С возвращением',
      quickActions: 'Быстрые действия',
      myAccount: 'Мой аккаунт',
      recentActivity: 'Недавняя активность',
      viewAll: 'Все',
      browseMenu: 'Меню',
    },
    ky: {
      title: 'Профиль',
      overview: 'Көрүнүш',
      orders: 'Буйруткалар',
      tracking: 'Активдүү',
      addresses: 'Дареги',
      cards: 'Карталар',
      favorites: 'Тандалмалар',
      orderHistory: 'Буйруткалар тарыхы',
      activeOrders: 'Активдүү буйруткалар',
      noOrders: 'Буйруткалар жок',
      noActiveOrders: 'Активдүү буйруткалар жок',
      startOrdering: 'Буйрутууну баштоо',
      reorder: 'Кайталоо',
      viewDetails: 'Толук маалымат',
      trackOrder: 'Көзөмөлдөө',
      savedAddresses: 'Сакталган дареги',
      addNewAddress: 'Дарек кошуу',
      noAddresses: 'Дареги жок',
      paymentMethods: 'Төлөм ыкмалары',
      addNewCard: 'Карта кошуу',
      noCards: 'Карталар жок',
      favoriteItems: 'Сүйүктүү тамактар',
      noFavorites: 'Сүйүктүү тамактар жок',
      addToCart: 'Себетке кошуу',
      stats: 'Сиздин статистика',
      totalOrders: 'Бардыгы буйруткалар',
      totalSpent: 'Жумшалды',
      loyaltyPoints: 'Упай',
      memberSince: 'Мүчөлүк',
      editProfile: 'Өзгөртүү',
      personalInfo: 'Жеке маалымат',
      name: 'Толук аты',
      email: 'Email',
      phoneNumber: 'Телефон',
      accountSettings: 'Аккаунт жөндөөлөрү',
      security: 'Коопсуздук',
      settings: 'Жөндөөлөр',
      help: 'Жардам',
      signOut: 'Чыгуу',
      delete: 'Өчүрүү',
      edit: 'Өзгөртүү',
      setDefault: 'Негизги',
      default: 'Негизги',
      cancel: 'Жокко чыгаруу',
      save: 'Сактоо',
      addressType: 'Дарек түрү',
      addressLabel: 'Аталышы (тандоо боюнча)',
      streetAddress: 'Көчө дареги',
      apartment: 'Квартира/офис',
      city: 'Шаар',
      postalCode: 'Почта индекси (тандоо боюнча)',
      deliveryInstructions: 'Жеткирүү көрсөтмөлөрү (тандоо боюнча)',
      cardholderName: 'Ээсинин аты',
      cardNumber: 'Карта номери',
      expiryDate: 'Жарактуулук мөөнөтү',
      cvv: 'CVV',
      cardType: 'Карта түрү',
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      pending: 'Күтүүдө',
      confirmed: 'Ырасталды',
      preparing: 'Даярдалууда',
      ready: 'Даяр',
      delivering: 'Жеткирилүүдө',
      completed: 'Аяктады',
      cancelled: 'Жокко чыгарылды',
      home: 'Үй',
      work: 'Иш',
      other: 'Башка',
      items: 'позиция',
      viewRewards: 'Сыйлыктар',
      expiresOn: 'Бүтөт',
      endsIn: 'Бүтөт',
      showNumber: 'Көрсөтүү',
      hideNumber: 'Жашыруу',
      addCard: 'Кошуу',
      month: 'Ай',
      year: 'Жыл',
      estimatedTime: 'Убакыт',
      minutes: 'мүн',
      updateProfile: 'Жаңыртуу',
      profileUpdated: 'Профиль жаңыртылды!',
      welcomeBack: 'Кайра келиңиз',
      quickActions: 'Тез аракеттер',
      myAccount: 'Менин аккаунтум',
      recentActivity: 'Акыркы активдүүлүк',
      viewAll: 'Бардыгы',
      browseMenu: 'Меню',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations];

  const addressTypeIcons = {
    home: Home,
    work: Briefcase,
    other: Building,
  };

  const cardTypeIcons = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    preparing: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    ready: 'bg-green-500/10 text-green-700 border-green-500/20',
    delivering: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    completed: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
  };

  // Sync with database when data changes
  useEffect(() => {
    if (user && (savedAddresses.length > 0 || savedCards.length > 0 || favoriteItems.length > 0)) {
      updateProfile({
        ...user,
        addresses: savedAddresses,
        paymentMethods: savedCards,
        preferences: {
          ...user.preferences,
          favoriteItems,
        },
      });
    }
  }, [savedAddresses, savedCards, favoriteItems]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city) {
      const address: UserAddress = {
        id: Date.now().toString(),
        type: newAddress.type as 'home' | 'work' | 'other',
        label: newAddress.label,
        street: newAddress.street,
        apartment: newAddress.apartment,
        city: newAddress.city,
        postalCode: newAddress.postalCode,
        country: newAddress.country || 'Kyrgyzstan',
        deliveryInstructions: newAddress.deliveryInstructions,
        isDefault: newAddress.isDefault || false,
      };
      
      let updatedAddresses = [...savedAddresses, address];
      if (address.isDefault) {
        updatedAddresses = updatedAddresses.map(a => ({
          ...a,
          isDefault: a.id === address.id,
        }));
      }
      
      setSavedAddresses(updatedAddresses);
      setShowAddAddress(false);
      setNewAddress({ 
        type: 'home', 
        street: '', 
        city: 'Bishkek', 
        country: 'Kyrgyzstan', 
        isDefault: false 
      });
    }
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.cardholderName && newCard.expiryMonth && newCard.expiryYear && (newCard as any).cvv) {
      // In production, this would tokenize the card with a payment processor
      const card: UserPaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        label: newCard.label,
        cardNumber: newCard.cardNumber.slice(-4), // Store only last 4 digits
        cardholderName: newCard.cardholderName,
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        cardType: newCard.cardType as 'visa' | 'mastercard' | 'amex',
        isDefault: newCard.isDefault || false,
      };
      
      let updatedCards = [...savedCards, card];
      if (card.isDefault) {
        updatedCards = updatedCards.map(c => ({
          ...c,
          isDefault: c.id === card.id,
        }));
      }
      
      setSavedCards(updatedCards);
      setShowAddCard(false);
      setNewCard({
        type: 'card',
        label: '',
        cardholderName: user?.name || '',
        cardNumber: '',
        expiryMonth: undefined,
        expiryYear: undefined,
        cardType: 'visa',
        isDefault: false,
        cvv: '',
      } as any);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter(a => a.id !== id));
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards(savedCards.filter(c => c.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  const handleSetDefaultCard = (id: string) => {
    setSavedCards(savedCards.map(c => ({
      ...c,
      isDefault: c.id === id,
    })));
  };

  const toggleFavorite = (itemId: string) => {
    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(favoriteItems.filter(id => id !== itemId));
    } else {
      setFavoriteItems([...favoriteItems, itemId]);
    }
  };

  const handleReorder = (order: Order) => {
    // Add all items from the order to cart
    order.items.forEach(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (menuItem) {
        addToCart({
          menuItemId: item.menuItemId,
          menuItem: menuItem,
          quantity: item.quantity,
          modifiers: item.modifiers || [],
          price: item.price,
        });
      }
    });
    navigate('/cart');
  };

  const handleUpdateProfile = () => {
    if (user) {
      updateProfile({
        ...user,
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
      });
      setShowEditProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E4DBC4]/20 to-white pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-[#667c67] via-[#667c67] to-[#546352] text-white overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E4DBC4] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative px-4 pt-6 pb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E4DBC4] to-white flex items-center justify-center shadow-xl">
                <User className="w-10 h-10 text-[#667c67]" />
              </div>
              {loyaltyCard?.tier && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-2 border-white">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user?.name || 'Guest User'}</h1>
              <p className="text-white/80 text-sm mb-2">{user?.email}</p>
              <div className="flex gap-2">
                {loyaltyCard?.tier && (
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {loyaltyCard.tier.charAt(0).toUpperCase() + loyaltyCard.tier.slice(1)} Member
                  </Badge>
                )}
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {t.memberSince} 2024
                </Badge>
              </div>
            </div>

            <button
              onClick={() => setShowEditProfile(true)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: t.totalOrders, value: userOrders.length, icon: Package },
              { label: t.totalSpent, value: `$${totalSpent.toFixed(0)}`, icon: TrendingUp },
              { label: t.loyaltyPoints, value: loyaltyCard?.points || 0, icon: Award },
              { label: t.activeOrders, value: activeOrders.length, icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-[#E4DBC4]" />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-2 p-4">
          {[
            { id: 'overview' as const, label: t.overview },
            { id: 'orders' as const, label: t.orders },
            { id: 'tracking' as const, label: t.tracking },
            { id: 'favorites' as const, label: t.favorites },
            { id: 'addresses' as const, label: t.addresses },
            { id: 'cards' as const, label: t.cards },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#667c67] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Quick Actions */}
              <Card className="overflow-hidden border-2 border-[#E4DBC4]/30">
                <div className="bg-gradient-to-r from-[#E4DBC4]/20 to-transparent p-4 border-b border-[#E4DBC4]/30">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#667c67]" />
                    {t.quickActions}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  <button
                    onClick={() => navigate('/my-orders')}
                    className="p-4 rounded-xl bg-gradient-to-br from-[#667c67] to-[#526250] text-white hover:shadow-lg transition-all active:scale-95"
                  >
                    <Package className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{t.orders}</div>
                  </button>
                  <button
                    onClick={() => navigate('/branch-selection')}
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{t.browseMenu}</div>
                  </button>
                  <button
                    onClick={() => navigate('/loyalty')}
                    className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:shadow-lg transition-all active:scale-95"
                  >
                    <Gift className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{t.viewRewards}</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white hover:shadow-lg transition-all active:scale-95"
                  >
                    <Heart className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{t.favorites}</div>
                  </button>
                </div>
              </Card>

              {/* Rewards Program Guide */}
              <Card className="overflow-hidden border-2 border-purple-200 shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">How Rewards Work</h3>
                      <p className="text-white/90 text-sm">Your complete guide to earning & redeeming</p>
                    </div>
                    <button
                      onClick={() => navigate('/rewards-guide')}
                      className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Loyalty Points */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-white" fill="white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Loyalty Points</h4>
                        <p className="text-gray-600 text-xs">Earn with every purchase</p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-1.5 pl-3 border-l-2 border-yellow-200">
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Earn 1 point for every $10</span> you spend
                      </p>
                      <p className="text-xs text-gray-700">
                        • Points are <span className="font-semibold">branch-specific</span> - use them where you earned them
                      </p>
                      <p className="text-xs text-gray-700">
                        • Points <span className="font-semibold">never expire</span> as long as you stay active
                      </p>
                      <p className="text-xs text-gray-700">
                        • Redeem points for <span className="font-semibold">exclusive rewards & discounts</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Tier System */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Membership Tiers</h4>
                        <p className="text-gray-600 text-xs">Level up for better rewards</p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-2 pl-3 border-l-2 border-blue-200">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Award className="w-3 h-3 text-gray-600" />
                          <span className="font-bold text-gray-900 text-xs">Bronze</span>
                          <span className="text-[10px] text-gray-500">• 0-99 points</span>
                        </div>
                        <p className="text-[10px] text-gray-600 ml-5">Standard benefits, welcome rewards</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Award className="w-3 h-3 text-gray-400" />
                          <span className="font-bold text-gray-700 text-xs">Silver</span>
                          <span className="text-[10px] text-gray-500">• 100-299 points</span>
                        </div>
                        <p className="text-[10px] text-gray-600 ml-5">10% bonus points, exclusive offers</p>
                      </div>
                      <div className="p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Crown className="w-3 h-3 text-yellow-600" />
                          <span className="font-bold text-yellow-900 text-xs">Gold</span>
                          <span className="text-[10px] text-yellow-700">• 300+ points</span>
                        </div>
                        <p className="text-[10px] text-yellow-800 ml-5">25% bonus points, priority perks, VIP access</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Promotions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Percent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Exclusive Promotions</h4>
                        <p className="text-gray-600 text-xs">Special offers & discounts</p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-1.5 pl-3 border-l-2 border-purple-200">
                      <p className="text-xs text-gray-700">
                        • Get <span className="font-semibold">personalized promo codes</span> via email & notifications
                      </p>
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Time-limited offers</span> - flash sales & seasonal deals
                      </p>
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Stack promotions</span> with loyalty rewards for maximum savings
                      </p>
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Branch-exclusive deals</span> - unique offers at each location
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Gifts Catalog */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Rewards Catalog</h4>
                        <p className="text-gray-600 text-xs">Redeem points for amazing gifts</p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-1.5 pl-3 border-l-2 border-green-200">
                      <p className="text-xs text-gray-700">
                        • Browse <span className="font-semibold">curated gift catalog</span> with items for all point levels
                      </p>
                      <p className="text-xs text-gray-700">
                        • Redeem for <span className="font-semibold">free menu items, discounts, or merchandise</span>
                      </p>
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Branch-specific gifts</span> - unique items at each location
                      </p>
                      <p className="text-xs text-gray-700">
                        • <span className="font-semibold">Limited edition rewards</span> for top-tier members
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Pro Tips */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Pro Tips</h4>
                        <p className="text-gray-600 text-xs">Maximize your rewards</p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-1.5 pl-3 border-l-2 border-orange-200">
                      <p className="text-xs text-gray-700">
                        💡 <span className="font-semibold">Visit regularly</span> to maintain your tier status
                      </p>
                      <p className="text-xs text-gray-700">
                        💡 <span className="font-semibold">Enable notifications</span> to never miss exclusive deals
                      </p>
                      <p className="text-xs text-gray-700">
                        💡 <span className="font-semibold">Check promotions page</span> before ordering for best savings
                      </p>
                      <p className="text-xs text-gray-700">
                        💡 <span className="font-semibold">Combine offers strategically</span> - points + promo codes work together
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <div className="p-3 bg-gradient-to-r from-[#667c67]/10 to-[#e4dbc4]/20 rounded-xl border-2 border-[#667c67]/20">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-[#667c67] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-bold text-[#667c67] mb-1 text-xs">Remember: Branch-Specific Rewards</h5>
                          <p className="text-[10px] text-gray-700 leading-relaxed">
                            Each branch has its own loyalty program. Points, gifts, and promotions earned at one branch 
                            can only be used at that same branch. This allows us to offer you location-specific rewards 
                            and personalized experiences tailored to your favorite spots!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* View Full Guide Button */}
                    <button
                      onClick={() => navigate('/rewards-guide')}
                      className="w-full mt-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      View Complete Rewards Guide
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              {userOrders.length > 0 && (
                <Card className="border-2 border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-lg">{t.recentActivity}</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-[#667c67] font-semibold hover:underline"
                    >
                      {t.viewAll}
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {userOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#667c67]" />
                            <span className="font-semibold text-sm">Order #{order.orderNumber}</span>
                          </div>
                          <Badge className={statusColors[order.status]}>
                            {t[order.status as keyof typeof t]}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.length} {t.items} • ${order.total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Account Settings */}
              <Card className="divide-y divide-gray-200 border-2 border-gray-200">
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3">{t.myAccount}</h3>
                </div>
                {[
                  { icon: Shield, label: t.security, path: '/profile/security' },
                  { icon: Settings, label: t.settings, path: '/profile/settings' },
                  { icon: Gift, label: t.help, path: '/help' },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E4DBC4]/30 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#667c67]" />
                    </div>
                    <span className="flex-1 text-left font-semibold">{item.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </Card>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-lg px-1">{t.orderHistory}</h3>
              
              {userOrders.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t.noOrders}</h3>
                  <p className="text-gray-600 mb-4">Start your first order today</p>
                  <Button onClick={() => navigate('/branch-selection')} className="bg-[#667c67] hover:bg-[#546352]">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t.startOrdering}
                  </Button>
                </Card>
              ) : (
                userOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-all border-2 border-gray-200 hover:border-[#667c67]/30">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <UtensilsCrossed className="w-4 h-4 text-[#667c67]" />
                              <span className="font-bold">Order #{order.orderNumber}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={`${statusColors[order.status]} font-semibold`}>
                            {t[order.status as keyof typeof t]}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.slice(0, 2).map((item, idx) => {
                            const menuItem = menuItems.find(m => m.id === item.menuItemId);
                            return (
                              <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#667c67]" />
                                {item.quantity}x {menuItem?.translations[currentLanguage]?.name || 'Item'}
                              </div>
                            );
                          })}
                          {order.items.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{order.items.length - 2} more {t.items}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="font-bold text-lg text-[#667c67]">${order.total.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorder(order)}
                              className="border-[#667c67] text-[#667c67] hover:bg-[#667c67] hover:text-white"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              {t.reorder}
                            </Button>
                            {['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(order.status) && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/order/${order.id}/tracking`)}
                                className="bg-[#667c67] hover:bg-[#546352]"
                              >
                                {t.trackOrder}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Active Orders Tab */}
          {activeTab === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-lg px-1">{t.activeOrders}</h3>
              
              {activeOrders.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t.noActiveOrders}</h3>
                  <p className="text-gray-600 mb-4">You have no orders in progress</p>
                  <Button onClick={() => navigate('/branch-selection')} className="bg-[#667c67] hover:bg-[#546352]">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t.startOrdering}
                  </Button>
                </Card>
              ) : (
                activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden border-2 border-[#667c67]/30 shadow-lg">
                      <div className="bg-gradient-to-r from-[#667c67] to-[#546352] text-white p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold">Order #{order.orderNumber}</span>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {t[order.status as keyof typeof t]}
                          </Badge>
                        </div>
                        <div className="text-sm text-white/80">
                          {order.items.length} {t.items} • ${order.total.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#E4DBC4]/30 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#667c67] animate-pulse" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-700">
                              {order.status === 'preparing' ? 'Your food is being prepared' : 
                               order.status === 'ready' ? 'Your order is ready!' :
                               order.status === 'delivering' ? 'On the way to you' : 
                               'We received your order'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t.estimatedTime}: 15-25 {t.minutes}
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => navigate(`/order/${order.id}/tracking`)}
                          className="w-full bg-[#667c67] hover:bg-[#546352]"
                        >
                          <MapPinned className="w-4 h-4 mr-2" />
                          {t.trackOrder}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-lg px-1">{t.favoriteItems}</h3>

              {favoriteItems.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t.noFavorites}</h3>
                  <p className="text-gray-600 mb-4">Save your favorite items for quick access</p>
                  <Button onClick={() => navigate('/branch-selection')} className="bg-[#667c67] hover:bg-[#546352]">
                    {t.browseMenu}
                  </Button>
                </Card>
              ) : (
                menuItems.filter(item => favoriteItems.includes(item.id)).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all border-2 border-gray-200 hover:border-[#667c67]/30">
                      <div className="flex gap-4 p-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.translations[currentLanguage]?.name}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold mb-1 truncate">{item.translations[currentLanguage]?.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.translations[currentLanguage]?.description}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-lg text-[#667c67]">${item.price.toFixed(2)}</span>
                            <Button
                              size="sm"
                              onClick={() => {
                                addToCart({
                                  menuItemId: item.id,
                                  menuItem: item,
                                  quantity: 1,
                                  modifiers: [],
                                  price: item.price,
                                });
                              }}
                              className="bg-[#667c67] hover:bg-[#546352]"
                            >
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              {t.addToCart}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-lg">{t.savedAddresses}</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddAddress(true)}
                  className="bg-[#667c67] hover:bg-[#546352]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addNewAddress}
                </Button>
              </div>

              {savedAddresses.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t.noAddresses}</h3>
                  <p className="text-gray-600 mb-4">Add delivery addresses for faster checkout</p>
                  <Button onClick={() => setShowAddAddress(true)} className="bg-[#667c67] hover:bg-[#546352]">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addNewAddress}
                  </Button>
                </Card>
              ) : (
                savedAddresses.map((address, index) => {
                  const Icon = addressTypeIcons[address.type];
                  return (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-4 hover:shadow-md transition-all border-2 ${
                        address.isDefault 
                          ? 'border-[#667c67] bg-[#E4DBC4]/10' 
                          : 'border-gray-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            address.isDefault 
                              ? 'bg-[#667c67] text-white' 
                              : 'bg-[#E4DBC4]/30 text-[#667c67]'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold capitalize">{address.label || t[address.type]}</span>
                              {address.isDefault && (
                                <Badge className="bg-[#667c67] text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  {t.default}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{address.street}</p>
                            {address.apartment && (
                              <p className="text-sm text-gray-600">{address.apartment}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.country}
                            </p>
                            {address.deliveryInstructions && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                {address.deliveryInstructions}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="w-8 h-8 rounded-lg hover:bg-[#667c67]/10 flex items-center justify-center"
                              >
                                <Star className="w-4 h-4 text-[#667c67]" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-lg">{t.paymentMethods}</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddCard(true)}
                  className="bg-[#667c67] hover:bg-[#546352]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addNewCard}
                </Button>
              </div>

              {savedCards.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t.noCards}</h3>
                  <p className="text-gray-600 mb-4">Add a payment method for faster checkout</p>
                  <Button onClick={() => setShowAddCard(true)} className="bg-[#667c67] hover:bg-[#546352]">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addNewCard}
                  </Button>
                </Card>
              ) : (
                savedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`overflow-hidden hover:shadow-lg transition-all ${
                      card.isDefault 
                        ? 'bg-gradient-to-br from-[#667c67] to-[#546352] text-white border-2 border-[#667c67]' 
                        : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white border-2 border-gray-700'
                    }`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="text-3xl">{cardTypeIcons[card.cardType]}</div>
                          <div className="flex gap-1">
                            {!card.isDefault && (
                              <button
                                onClick={() => handleSetDefaultCard(card.id)}
                                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center"
                              >
                                <Star className="w-4 h-4 text-white" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="text-2xl font-mono tracking-wider">
                            •••• •••• •••• {card.cardNumber}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-white/70">{t.cardholderName}</div>
                              <div className="font-semibold">{card.cardholderName}</div>
                            </div>
                            <div>
                              <div className="text-xs text-white/70">{t.expiresOn}</div>
                              <div className="font-semibold">
                                {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                              </div>
                            </div>
                          </div>
                          {card.isDefault && (
                            <Badge className="bg-white/20 text-white border-white/30">
                              <Check className="w-3 h-3 mr-1" />
                              {t.default}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Out Button */}
        <Button
          onClick={() => {
            signOut();
            navigate('/');
          }}
          variant="outline"
          className="w-full h-12 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t.signOut}
        </Button>
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddAddress(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-6 border-2 border-[#667c67]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{t.addNewAddress}</h3>
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.addressType}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['home', 'work', 'other'] as const).map((type) => {
                        const Icon = addressTypeIcons[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setNewAddress({ ...newAddress, type })}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              newAddress.type === type
                                ? 'border-[#667c67] bg-[#667c67]/10'
                                : 'border-gray-300 hover:border-[#667c67]/50'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-1 text-[#667c67]" />
                            <div className="font-semibold text-xs capitalize">{t[type]}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.addressLabel}</label>
                    <input
                      type="text"
                      value={newAddress.label || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      placeholder="e.g., My Home, Office"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.streetAddress}</label>
                    <input
                      type="text"
                      value={newAddress.street || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.apartment}</label>
                    <input
                      type="text"
                      value={newAddress.apartment || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                      placeholder="Apt 4B"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.city}</label>
                      <input
                        type="text"
                        value={newAddress.city || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Bishkek"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.postalCode}</label>
                      <input
                        type="text"
                        value={newAddress.postalCode || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        placeholder="720000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.deliveryInstructions}</label>
                    <textarea
                      value={newAddress.deliveryInstructions || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, deliveryInstructions: e.target.value })}
                      placeholder="e.g., Ring the doorbell, leave at door, etc."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none resize-none transition-colors"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault || false}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 accent-[#667c67]"
                    />
                    <span className="text-sm font-semibold">Make this my default address</span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleAddAddress}
                      className="flex-1 bg-[#667c67] hover:bg-[#546352]"
                      disabled={!newAddress.street || !newAddress.city}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {t.save}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAddress(false)}
                      className="flex-1"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddCard(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-6 border-2 border-[#667c67]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{t.addNewCard}</h3>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.cardType}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['visa', 'mastercard', 'amex'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setNewCard({ ...newCard, cardType: type })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            newCard.cardType === type
                              ? 'border-[#667c67] bg-[#667c67]/10'
                              : 'border-gray-300 hover:border-[#667c67]/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{cardTypeIcons[type]}</div>
                          <div className="font-semibold text-xs capitalize">{t[type]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.cardholderName}</label>
                    <input
                      type="text"
                      value={newCard.cardholderName || ''}
                      onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.cardNumber}</label>
                    <input
                      type="text"
                      value={newCard.cardNumber || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^\d{0,16}$/.test(value)) {
                          setNewCard({ ...newCard, cardNumber: value });
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none font-mono transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.month}</label>
                      <select
                        value={newCard.expiryMonth || ''}
                        onChange={(e) => setNewCard({ ...newCard, expiryMonth: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">{t.year}</label>
                      <select
                        value={newCard.expiryYear || ''}
                        onChange={(e) => setNewCard({ ...newCard, expiryYear: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.cvv}</label>
                    <input
                      type="text"
                      value={(newCard as any).cvv || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const maxLength = newCard.cardType === 'amex' ? 4 : 3;
                        if (/^\d{0,4}$/.test(value) && value.length <= maxLength) {
                          setNewCard({ ...newCard, cvv: value } as any);
                        }
                      }}
                      placeholder={newCard.cardType === 'amex' ? '1234' : '123'}
                      maxLength={newCard.cardType === 'amex' ? 4 : 3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none font-mono transition-colors"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={newCard.isDefault || false}
                      onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 accent-[#667c67]"
                    />
                    <span className="text-sm font-semibold">Make this my default payment method</span>
                  </label>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900">
                      🔒 Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleAddCard}
                      className="flex-1 bg-[#667c67] hover:bg-[#546352]"
                      disabled={
                        !newCard.cardNumber || 
                        !newCard.cardholderName || 
                        !newCard.expiryMonth || 
                        !newCard.expiryYear ||
                        newCard.cardNumber.length !== 16 ||
                        !(newCard as any).cvv ||
                        ((newCard as any).cvv.length < 3) ||
                        ((newCard.cardType === 'amex' && (newCard as any).cvv.length !== 4) || 
                         (newCard.cardType !== 'amex' && (newCard as any).cvv.length !== 3))
                      }
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {t.addCard}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddCard(false)}
                      className="flex-1"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowEditProfile(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="p-6 border-2 border-[#667c67]/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{t.editProfile}</h3>
                  <button
                    onClick={() => setShowEditProfile(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.name}</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.email}</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.phoneNumber}</label>
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#667c67] outline-none transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleUpdateProfile}
                      className="flex-1 bg-[#667c67] hover:bg-[#546352]"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      {t.updateProfile}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEditProfile(false)}
                      className="flex-1"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
