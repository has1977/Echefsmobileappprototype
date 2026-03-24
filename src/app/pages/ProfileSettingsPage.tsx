import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bell, Globe, Moon, Volume2, CheckCircle, Sun, DollarSign } from 'lucide-react';
import { GlassCard, Switch } from '../design-system';
import { toast } from 'sonner';
import { useDisplayCurrency, getAllCurrencies } from '../hooks/useCurrency';

export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useApp();
  const { displayCurrency, setDisplayCurrency, isCustomCurrency } = useDisplayCurrency();
  const availableCurrencies = getAllCurrencies();
  
  // Initialize from user preferences if available
  const [notifications, setNotifications] = useState({
    orders: user?.preferences?.notifications?.orderUpdates ?? true,
    promotions: user?.preferences?.notifications?.promotions ?? true,
    newsletter: user?.preferences?.notifications?.newsletter ?? false,
    email: user?.preferences?.notifications?.email ?? true,
    sms: user?.preferences?.notifications?.sms ?? false,
    push: user?.preferences?.notifications?.push ?? true,
  });

  // Load from localStorage for appearance settings
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('echefs_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [soundEffects, setSoundEffects] = useState(() => {
    const saved = localStorage.getItem('echefs_soundEffects');
    return saved ? JSON.parse(saved) : true;
  });

  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const isRTL = currentLanguage === 'ar';

  const t = {
    en: {
      title: 'Settings',
      language: 'Language',
      currency: 'Display Currency',
      currencyDesc: 'Choose your preferred currency for prices',
      currencyNote: 'Note: This is for display only. Payments will be in store currency.',
      notifications: 'Notifications',
      orderUpdates: 'Order Updates',
      promotions: 'Promotions & Offers',
      newsletter: 'Newsletter',
      emailNotifications: 'Email Notifications',
      smsNotifications: 'SMS Notifications',
      pushNotifications: 'Push Notifications',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      sounds: 'Sound Effects',
      settingsSaved: 'Settings saved successfully!',
      languageChanged: 'Language changed!',
      currencyChanged: 'Currency changed!',
      comingSoon: 'Coming soon',
    },
    ar: {
      title: 'الإعدادات',
      language: 'اللغة',
      currency: 'عملة العرض',
      currencyDesc: 'اختر عملتك المفضلة لعرض الأسعار',
      currencyNote: 'ملاحظة: هذا للعرض فقط. الدفعات ستكون بعملة المتجر.',
      notifications: 'الإشعارات',
      orderUpdates: 'تحديثات الطلبات',
      promotions: 'العروض والترويجات',
      newsletter: 'النشرة الإخبارية',
      emailNotifications: 'إشعارات البريد الإلكتروني',
      smsNotifications: 'إشعارات SMS',
      pushNotifications: 'الإشعارات الفورية',
      appearance: 'المظهر',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      sounds: 'المؤثرات الصوتية',
      settingsSaved: 'تم حفظ الإعدادات بنجاح!',
      languageChanged: 'تم تغيير اللغة!',
      currencyChanged: 'تم تغيير العملة!',
      comingSoon: 'قريباً',
    },
    ru: {
      title: 'Настройки',
      language: 'Язык',
      currency: 'Валюта отображения',
      currencyDesc: 'Выберите предпочитаемую валюту для цен',
      currencyNote: 'Примечание: Это только для отображения. Оплата будет в валюте магазина.',
      notifications: 'Уведомления',
      orderUpdates: 'Обновления заказов',
      promotions: 'Акции и предложения',
      newsletter: 'Рассылка',
      emailNotifications: 'Email уведомления',
      smsNotifications: 'SMS уведомления',
      pushNotifications: 'Push уведомления',
      appearance: 'Внешний вид',
      darkMode: 'Темная тема',
      lightMode: 'Светлая тема',
      sounds: 'Звуковые эффекты',
      settingsSaved: 'Настройки сохранены!',
      languageChanged: 'Язык изменен!',
      currencyChanged: 'Валюта изменена!',
      comingSoon: 'Скоро',
    },
    ky: {
      title: 'Жөндөөлөр',
      language: 'Тил',
      currency: 'Көрсөтүлүү валюта',
      currencyDesc: 'Башкаруу үчүн сүрөттөөчү валютаны танданыз',
      currencyNote: 'Эсептөөлөр магазындын валютасында болот. Бул көрсөтүлүү үчүн.',
      notifications: 'Билдирүүлөр',
      orderUpdates: 'Буйрутмалар жаңыртуулары',
      promotions: 'Акциялар жана сунуштар',
      newsletter: 'Жаңылыктар',
      emailNotifications: 'Email билдирүүлөр',
      smsNotifications: 'SMS билдирүүлөр',
      pushNotifications: 'Push билдирүүлөр',
      appearance: 'Көрүнүш',
      darkMode: 'Караңгы режим',
      lightMode: 'Жарык режим',
      sounds: 'Үн эффектилери',
      settingsSaved: 'Жөндөөлөр сакталды!',
      languageChanged: 'Тил өзгөртүлдү!',
      currencyChanged: 'Валюта өзгөртүлдү!',
      comingSoon: 'Жакында',
    },
  }[currentLanguage as 'en' | 'ar' | 'ru' | 'ky'] || t.en;

  // Save notification settings when they change
  useEffect(() => {
    if (user) {
      const saveNotifications = async () => {
        try {
          await updateUserPreferences({
            notifications: {
              email: notifications.email,
              sms: notifications.sms,
              push: notifications.push,
              orderUpdates: notifications.orders,
              promotions: notifications.promotions,
              newsletter: notifications.newsletter,
            },
          });
        } catch (error) {
          console.error('Failed to save notification preferences:', error);
        }
      };
      
      // Debounce saves
      const timer = setTimeout(saveNotifications, 500);
      return () => clearTimeout(timer);
    }
  }, [notifications, user, updateUserPreferences]);

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('echefs_darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save sound effects to localStorage
  useEffect(() => {
    localStorage.setItem('echefs_soundEffects', JSON.stringify(soundEffects));
  }, [soundEffects]);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    toast.success(t.languageChanged);
    
    // Play sound effect if enabled
    if (soundEffects) {
      playSound('success');
    }
  };

  const handleCurrencyChange = (currency: typeof availableCurrencies[0]) => {
    setDisplayCurrency(currency);
    toast.success(t.currencyChanged);
    
    // Play sound effect if enabled
    if (soundEffects) {
      playSound('success');
    }
  };

  const handleToggleChange = (setting: string, value: boolean) => {
    // Play sound effect if enabled
    if (soundEffects) {
      playSound(value ? 'on' : 'off');
    }
  };

  const playSound = (type: 'success' | 'on' | 'off') => {
    if (!soundEffects) return;
    
    // Create simple beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different sounds
    const frequencies: Record<string, number> = {
      success: 800,
      on: 600,
      off: 400,
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#667c67] to-[#546352] p-5 pb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#1F2933]">{t.language}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    currentLanguage === lang.code
                      ? 'border-[#667c67] bg-[#667c67]/5 shadow-lg'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className="font-semibold text-sm text-[#1F2933]">{lang.nativeName}</div>
                  {currentLanguage === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <CheckCircle className="w-5 h-5 text-[#667c67] mx-auto" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Currency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F2933]">{t.currency}</h2>
                <p className="text-xs text-gray-600 mt-0.5">{t.currencyDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {availableCurrencies.map((curr) => (
                <motion.button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    displayCurrency.code === curr.code
                      ? 'border-green-600 bg-green-50 shadow-lg'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl mb-2">{curr.flag}</div>
                  <div className="font-bold text-lg text-[#1F2933]">{curr.symbol} {curr.code}</div>
                  <div className="text-xs text-gray-600 mt-1">{curr.name}</div>
                  {displayCurrency.code === curr.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                {t.currencyNote}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#1F2933]">{t.notifications}</h2>
            </div>

            <div className="space-y-4">
              {/* Order Updates */}
              <Switch
                checked={notifications.orders}
                onChange={(value) => {
                  handleToggleChange('orders', value);
                  setNotifications({ ...notifications, orders: value });
                }}
                label={t.orderUpdates}
                showStatus={true}
                size="md"
              />

              {/* Promotions */}
              <Switch
                checked={notifications.promotions}
                onChange={(value) => {
                  handleToggleChange('promotions', value);
                  setNotifications({ ...notifications, promotions: value });
                }}
                label={t.promotions}
                showStatus={true}
                size="md"
              />

              {/* Newsletter */}
              <Switch
                checked={notifications.newsletter}
                onChange={(value) => {
                  handleToggleChange('newsletter', value);
                  setNotifications({ ...notifications, newsletter: value });
                }}
                label={t.newsletter}
                showStatus={true}
                size="md"
              />

              {/* Divider */}
              <div className="border-t border-[#E5E7EB] my-4" />

              {/* Email Notifications */}
              <Switch
                checked={notifications.email}
                onChange={(value) => {
                  handleToggleChange('email', value);
                  setNotifications({ ...notifications, email: value });
                }}
                label={t.emailNotifications}
                showStatus={true}
                size="md"
              />

              {/* SMS Notifications */}
              <Switch
                checked={notifications.sms}
                onChange={(value) => {
                  handleToggleChange('sms', value);
                  setNotifications({ ...notifications, sms: value });
                }}
                label={t.smsNotifications}
                showStatus={true}
                size="md"
              />

              {/* Push Notifications */}
              <Switch
                checked={notifications.push}
                onChange={(value) => {
                  handleToggleChange('push', value);
                  setNotifications({ ...notifications, push: value });
                }}
                label={t.pushNotifications}
                showStatus={true}
                size="md"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <h2 className="text-lg font-bold text-[#1F2933]">{t.appearance}</h2>
            </div>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#374151]">
                    {darkMode ? t.darkMode : t.lightMode}
                  </span>
                  <span className="text-xs text-[#9CA3AF] bg-blue-100 px-2 py-1 rounded-full">
                    {t.comingSoon}
                  </span>
                </div>
                <Switch
                  checked={darkMode}
                  onChange={(value) => {
                    handleToggleChange('darkMode', value);
                    setDarkMode(value);
                  }}
                  size="md"
                />
              </div>

              {/* Sound Effects */}
              <Switch
                checked={soundEffects}
                onChange={(value) => {
                  handleToggleChange('sounds', value);
                  setSoundEffects(value);
                }}
                label={t.sounds}
                showStatus={true}
                size="md"
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}