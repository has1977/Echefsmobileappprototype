import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';
import { Globe, ChevronRight, Sparkles, Zap, Gift, LayoutDashboard, Star, TrendingUp, Database } from 'lucide-react';
import { Logo } from '../components/shared/Logo';
import { GlassCard, GradientButton, motion, AnimatePresence } from '../design-system';

export function WelcomePage() {
  const navigate = useNavigate();
  const { languages, currentLanguage, changeLanguage, userRole, setUserRole } = useApp();
  const { isAuthenticated, user } = useAuth();
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  // Auto-redirect if language already selected
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('echefs_welcome_seen');
    if (hasSeenWelcome && currentLanguage) {
      // Auto-navigate based on role - all staff go to unified control panel
      if (userRole === 'admin' || userRole === 'manager' || userRole === 'waiter' || userRole === 'kitchen') {
        navigate('/control-panel');
      } else {
        navigate('/branch-selection');
      }
    }
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    changeLanguage(langCode);
    setShowLangSelect(false);
    localStorage.setItem('echefs_welcome_seen', 'true');
    
    // Navigate directly to branch selection
    setTimeout(() => {
      navigate('/branch-selection');
    }, 300);
  };

  const handleRoleSelect = (role: typeof userRole) => {
    setUserRole(role);
    setShowRoleSelect(false);
    
    // Navigate based on role - all staff go to unified control panel
    setTimeout(() => {
      if (role === 'admin' || role === 'manager' || role === 'waiter' || role === 'kitchen') {
        navigate('/control-panel');
      } else {
        navigate('/branch-selection');
      }
    }, 300);
  };

  const translations = {
    en: {
      welcome: 'Welcome to',
      subtitle: 'Order delicious food with just a tap',
      selectLang: 'Select Your Language',
      selectRole: 'Select User Role',
      continue: 'Continue',
      customer: 'Customer',
      waiter: 'Waiter',
      kitchen: 'Kitchen',
      manager: 'Manager',
      admin: 'Admin',
      availableIn: 'Available in 4 languages',
      managementPortal: 'Management Portal',
      qrOrdering: 'QR Ordering',
      fastService: 'Fast Service',
      rewards: 'Rewards',
      back: 'Back',
      demoNote: 'For demo purposes',
      copyright: 'eChefs © 2026 • Multi-language Restaurant Platform',
    },
    ar: {
      welcome: 'مرحباً بك في',
      subtitle: 'اطلب طعاماً لذيذاً بنقرة واحدة',
      selectLang: 'اختر لغتك',
      selectRole: 'اختر دور المستخدم',
      continue: 'متابعة',
      customer: 'عميل',
      waiter: 'نادل',
      kitchen: 'مطبخ',
      manager: 'مدير',
      admin: 'مسؤول',
      availableIn: 'متوفر بـ 4 لغات',
      managementPortal: 'بوابة الإدارة',
      qrOrdering: 'الطلب عبر QR',
      fastService: 'خدمة سريعة',
      rewards: 'مكافآت',
      back: 'رجوع',
      demoNote: 'لأغراض العرض التوضيحي',
      copyright: 'eChefs © 2026 • منصة مطاعم متعددة اللغات',
    },
    ru: {
      welcome: 'Добро пожаловать в',
      subtitle: 'Закажите вкусную еду одним касанием',
      selectLang: 'Выберите язык',
      selectRole: 'Выберите роль пользователя',
      continue: 'Продолжить',
      customer: 'Клиент',
      waiter: 'Официант',
      kitchen: 'Кухня',
      manager: 'Менеджер',
      admin: 'Администратор',
      availableIn: 'Доступно на 4 языках',
      managementPortal: 'Портал управления',
      qrOrdering: 'QR заказ',
      fastService: 'Быстрое обслуживание',
      rewards: 'Награды',
      back: 'Назад',
      demoNote: 'Для демонстрации',
      copyright: 'eChefs © 2026 • Многоязычная ресторанная платформа',
    },
    ky: {
      welcome: 'Кош келдиңиз',
      subtitle: 'Даамдуу тамакты бир басуу менен буйруңуз',
      selectLang: 'Тилиңизди тандаңыз',
      selectRole: 'Колдонуучу ролун тандаңыз',
      continue: 'Улантуу',
      customer: 'Кардар',
      waiter: 'Даяшы',
      kitchen: 'Ашкана',
      manager: 'Башкаруучу',
      admin: 'Администратор',
      availableIn: '4 тилде жеткиликтүү',
      managementPortal: 'Башкаруу порталы',
      qrOrdering: 'QR буйрутуу',
      fastService: 'Тез тейлөө',
      rewards: 'Сыйлыктар',
      back: 'Артка',
      demoNote: 'Демонстрация үчүн',
      copyright: 'eChefs © 2026 • Көп тилдүү ресторан платформасы',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[#667c67]/20 to-[#E4DBC4]/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-[#E4DBC4]/40 to-[#667c67]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!showLangSelect && !showRoleSelect && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-center space-y-10 z-10 max-w-md w-full"
          >
            {/* Premium Logo Container */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex justify-center"
            >
              <GlassCard 
                variant="elevated" 
                className="w-40 h-40 flex items-center justify-center p-6 relative group"
              >
                <Logo size="xl" showText={false} animate />
                
                {/* Sparkle Badge */}
                <motion.div
                  className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#667c67] to-[#546352] rounded-2xl flex items-center justify-center shadow-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#667c67]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </GlassCard>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-[#667c67]/70 text-lg font-medium tracking-wide">
                {t.welcome}
              </p>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#667c67] via-[#546352] to-[#667c67] bg-clip-text text-transparent drop-shadow-sm">
                eChefs
              </h1>
              <p className="text-[#6B7280] text-base font-medium max-w-sm mx-auto leading-relaxed">
                {t.subtitle}
              </p>
            </motion.div>

            {/* Primary Action */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <GradientButton
                onClick={() => setShowLangSelect(true)}
                size="xl"
                fullWidth
                leftIcon={<Globe className="w-6 h-6" />}
                rightIcon={<ChevronRight className="w-6 h-6" />}
              >
                {t.selectLang}
              </GradientButton>
              
              <p className="text-[#9CA3AF] text-sm font-medium flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
                {t.availableIn}
              </p>
            </motion.div>

            {/* Staff Access Button */}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'waiter' || user?.role === 'kitchen') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GradientButton
                  onClick={() => navigate('/control-panel')}
                  variant="ghost"
                  size="lg"
                  fullWidth
                  leftIcon={<LayoutDashboard className="w-5 h-5" />}
                >
                  {t.managementPortal}
                  <Badge className="ml-auto bg-gradient-to-r from-[#F59E0B] to-[#B76B00] text-white border-none px-3 py-1">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </GradientButton>
              </motion.div>
            )}

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { Icon: Gift, text: t.qrOrdering, gradient: 'from-[#667c67] to-[#546352]' },
                { Icon: Zap, text: t.fastService, gradient: 'from-[#F59E0B] to-[#B76B00]' },
                { Icon: TrendingUp, text: t.rewards, gradient: 'from-[#16A34A] to-[#0F8B3A]' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -5 }}
                >
                  <GlassCard variant="default" className="p-4 text-center group cursor-pointer">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                      <feature.Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-[#374151] text-xs font-semibold">{feature.text}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Language Selection */}
        {showLangSelect && !showRoleSelect && (
          <motion.div
            key="language"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md z-10 space-y-4"
          >
            <GlassCard variant="elevated" className="p-8">
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-[#667c67] to-[#546352] bg-clip-text text-transparent mb-8 text-center"
              >
                {t.selectLang}
              </motion.h3>
              
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all border-2 border-transparent hover:border-[#667c67]/20 hover:bg-[#667c67]/5 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[#1F2933] text-lg">{lang.nativeName}</div>
                      <div className="text-sm text-[#6B7280] font-medium">{lang.name}</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#667c67]/40 group-hover:text-[#667c67] group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            <GradientButton
              onClick={() => setShowLangSelect(false)}
              variant="ghost"
              size="lg"
              fullWidth
            >
              {t.back}
            </GradientButton>
          </motion.div>
        )}

        {/* Role Selection (Demo) */}
        {showRoleSelect && (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md z-10 space-y-4"
          >
            <GlassCard variant="elevated" className="p-8">
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-[#667c67] to-[#546352] bg-clip-text text-transparent mb-2 text-center"
              >
                {t.selectRole}
              </motion.h3>
              <p className="text-center text-sm text-[#9CA3AF] font-medium mb-8">{t.demoNote}</p>
              
              <div className="space-y-3">
                {[
                  { role: 'customer' as const, label: t.customer, icon: '👤' },
                  { role: 'waiter' as const, label: t.waiter, icon: '👔' },
                  { role: 'kitchen' as const, label: t.kitchen, icon: '👨‍🍳' },
                  { role: 'manager' as const, label: t.manager, icon: '📊' },
                  { role: 'admin' as const, label: t.admin, icon: '⚙️' },
                ].map((item, index) => (
                  <motion.button
                    key={item.role}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(item.role)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all border-2 border-transparent hover:border-[#667c67]/20 hover:bg-[#667c67]/5 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[#1F2933] text-lg">{item.label}</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#667c67]/40 group-hover:text-[#667c67] group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-[#9CA3AF] text-sm z-10 font-medium tracking-wide"
      >
        {t.copyright}
      </motion.div>

      {/* Database Check Button - Dev Tool */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => navigate('/quick-db-fix')}
        className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">Fix Database</span>
        <span className="sm:hidden">DB Fix</span>
      </motion.button>
    </div>
  );
}