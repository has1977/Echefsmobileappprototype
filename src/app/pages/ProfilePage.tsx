import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { db } from '../lib/database';
import { Badge } from '../components/ui/badge';
import { SettingsHighlightBadge } from '../components/SettingsOnboarding';
import { 
  User, Mail, Phone, Edit2, Save, X, LogOut,
  Shield, Star, Gift, Award, TrendingUp, Package, 
  Settings, Lock, Trash2, AlertCircle, CheckCircle,
  Crown, Sparkles, ChevronRight, Camera, MapPin, Calendar,
  Zap, Target, Trophy, Percent, ShoppingBag, Info, Lightbulb
} from 'lucide-react';
import { GlassCard, GradientButton, Chip, StatCard, SectionHeader, motion, AnimatePresence } from '../design-system';
import type { LoyaltyCard } from '../lib/types';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, updateProfile, changePassword, deleteAccount } = useAuth();
  const { orders, currentLanguage, currentBranch, selectedBranch } = useApp();
  
  // OTP Registration State
  const [showOTPRegister, setShowOTPRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isRTL = currentLanguage === 'ar';

  // OTP Timer
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpSent, otpTimer]);

  // Redirect if not authenticated (show OTP register)
  useEffect(() => {
    // Don't auto-show OTP registration, user must come to profile page
  }, []);

  // Load loyalty card
  useEffect(() => {
    if (user) {
      const card = db.getLoyaltyCard(user.id);
      setLoyaltyCard(card);
      // Update form data with current user info
      setFormData({
        name: user.name,
        phone: user.phone || '',
      });
    }
  }, [user]);

  const userOrders = orders.filter(o => o.customerId === user?.id);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = userOrders.filter(o => o.status === 'completed').length;

  const translations = {
    en: {
      title: 'Profile',
      registerTitle: 'Create Account',
      registerSubtitle: 'Enter your phone number to get started',
      phoneNumber: 'Phone Number',
      sendOTP: 'Send OTP',
      enterOTP: 'Enter OTP',
      otpSent: 'OTP sent to',
      resendOTP: 'Resend OTP',
      verifyOTP: 'Verify & Continue',
      resendIn: 'Resend in',
      seconds: 'seconds',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      signOut: 'Sign Out',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      email: 'Email',
      memberSince: 'Member Since',
      orderHistory: 'Order Stats',
      totalOrders: 'Total Orders',
      completedOrders: 'Completed',
      totalSpent: 'Total Spent',
      loyalty: 'Loyalty Rewards',
      points: 'Points',
      tier: 'Tier',
      viewRewards: 'View Rewards',
      security: 'Security & Privacy',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account',
      settings: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      help: 'Help & Support',
      termsAndPrivacy: 'Terms & Privacy',
      kyrgyzstanOnly: 'OTP verification is currently available only for Kyrgyzstan phone numbers (+996)',
      invalidPhone: 'Please enter a valid Kyrgyzstan phone number',
    },
    ar: {
      title: 'الملف الشخصي',
      registerTitle: 'إنشاء حساب',
      registerSubtitle: 'أدخل رقم هاتفك للبدء',
      phoneNumber: 'رقم الهاتف',
      sendOTP: 'إرسال OTP',
      enterOTP: 'أدخل OTP',
      otpSent: 'تم إرسال OTP إلى',
      resendOTP: 'إعادة إرسال OTP',
      verifyOTP: 'تحقق ومتابعة',
      resendIn: 'إعادة الإرسال في',
      seconds: 'ثواني',
      editProfile: 'تعديل الملف',
      saveChanges: 'حفظ التغييرات',
      cancel: 'إلغاء',
      signOut: 'تسجيل الخروج',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      memberSince: 'عضو منذ',
      orderHistory: 'إحصائيات الطلبات',
      totalOrders: 'إجمالي الطلبا��',
      completedOrders: 'مكتمل',
      totalSpent: 'إجمالي الإنفاق',
      loyalty: 'مكافآت الولاء',
      points: 'النقاط',
      tier: 'المستوى',
      viewRewards: 'عرض المكافآت',
      security: 'الأمان والخصوصية',
      changePassword: 'تغيير كلمة المرور',
      deleteAccount: 'حذف الحساب',
      settings: 'الإعدادات',
      language: 'اللغة',
      notifications: 'الإشعارات',
      help: 'المساعدة والدعم',
      termsAndPrivacy: 'الشروط والخصوصية',
      kyrgyzstanOnly: 'التحقق من OTP متاح حاليًا فقط لأرقام هواتف قيرغيزستان (+996)',
      invalidPhone: 'الرجاء إدخال رقم هاتف قيرغيزستان صالح',
    },
    ru: {
      title: 'Профиль',
      registerTitle: 'Создать аккаунт',
      registerSubtitle: 'Введите номер телефона для начала',
      phoneNumber: 'Номер телефона',
      sendOTP: 'Отправить OTP',
      enterOTP: 'Введите OTP',
      otpSent: 'OTP отправлен на',
      resendOTP: 'Отправить повторно',
      verifyOTP: 'Проверить и продолжить',
      resendIn: 'Повторная отправка через',
      seconds: 'секунд',
      editProfile: 'Редактировать профиль',
      saveChanges: 'Сохранить',
      cancel: 'Отмена',
      signOut: 'Выйти',
      personalInfo: 'Личная информация',
      name: 'Полное имя',
      email: 'Email',
      memberSince: 'Участник с',
      orderHistory: 'Статистика заказов',
      totalOrders: 'Всего заказов',
      completedOrders: 'Завершено',
      totalSpent: 'Потрачено',
      loyalty: 'Программа лояльности',
      points: 'Баллы',
      tier: 'Уровень',
      viewRewards: 'Посмотреть награды',
      security: 'Безопасность',
      changePassword: 'Изменить пароль',
      deleteAccount: 'Удалить аккаунт',
      settings: 'Настройки',
      language: 'Язык',
      notifications: 'Уведомления',
      help: 'Помощь и поддержка',
      termsAndPrivacy: 'Условия и конфиденциальность',
      kyrgyzstanOnly: 'OTP верификация доступна только для номеров Кыргызстана (+996)',
      invalidPhone: 'Пожалуйста, введите действительный номер телефона Кыргызстана',
    },
    ky: {
      title: 'Профиль',
      registerTitle: 'Аккаунт түзүү',
      registerSubtitle: 'Телефон номериңизди киргизиңиз',
      phoneNumber: 'Телефон номери',
      sendOTP: 'OTP жөнөтүү',
      enterOTP: 'OTP киргизиңиз',
      otpSent: 'OTP жөнөтүлдү',
      resendOTP: 'Кайра жөнөтүү',
      verifyOTP: 'Текшерүү жана улантуу',
      resendIn: 'Кайра жөнөтүү',
      seconds: 'секунд',
      editProfile: 'Профильди өзгөртүү',
      saveChanges: 'Сактоо',
      cancel: 'Жокко чыгаруу',
      signOut: 'Чыгуу',
      personalInfo: 'Жеке маалымат',
      name: 'Толук аты',
      email: 'Email',
      memberSince: 'Мүчө болгондон бери',
      orderHistory: 'Буйрутмалар статистикасы',
      totalOrders: 'Бардык буйрутмалар',
      completedOrders: 'Аткарылды',
      totalSpent: 'Жумшалды',
      loyalty: 'Лоялдуулук сыйлыктары',
      points: 'Упайлар',
      tier: 'Деңгээл',
      viewRewards: 'Сыйлыктарды көрүү',
      security: 'Коопсуздук',
      changePassword: 'Сырсөздү өзгөртүү',
      deleteAccount: 'Аккаунтту өчүрүү',
      settings: 'Жөндөөлөр',
      language: 'Тил',
      notifications: 'Билдирүүлөр',
      help: 'Жардам жана колдоо',
      termsAndPrivacy: 'Шарттар жана купуялык',
      kyrgyzstanOnly: 'OTP текшерүү азырынча Кыргызстан номерлери үчүн гана жеткиликтүү (+996)',
      invalidPhone: 'Туура Кыргызстан телефон номерин киргизиңиз',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  // OTP Input Handler
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Check if phone number is from Kyrgyzstan (+996)
  const isKyrgyzstanNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it starts with 996 (Kyrgyzstan code)
    return cleaned.startsWith('996') && cleaned.length >= 12; // 996 + 9 digits
  };

  const handleSendOTP = () => {
    // Validate Kyrgyzstan phone number
    if (!isKyrgyzstanNumber(phoneNumber)) {
      setError(t.invalidPhone);
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Simulate sending OTP
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
      setOtpTimer(60);
      // In production, call your OTP API here for Kyrgyzstan numbers only
      console.log('Sending OTP to Kyrgyzstan number:', phoneNumber);
    }
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      // In production, verify OTP with your backend
      console.log('Verifying OTP:', otpCode);
      // For demo, auto-login after verification
      // You would call your auth API here
      setShowOTPRegister(false);
    }
  };

  const handleResendOTP = () => {
    setOtpTimer(60);
    setOtp(['', '', '', '', '', '']);
    handleSendOTP();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    try {
      await updateProfile(formData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  // Guest Welcome Screen (Not Authenticated)
  if (!user && !showOTPRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] flex items-center justify-center p-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard variant="elevated" className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#667c67] to-[#546352] rounded-3xl flex items-center justify-center shadow-xl"
              >
                <User className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-[#1F2933] mb-3">Welcome, Guest!</h1>
              <p className="text-[#6B7280] font-medium text-lg mb-2">
                Browsing as a guest
              </p>
              <p className="text-sm text-[#9CA3AF]">
                Create an account to unlock exclusive benefits, loyalty rewards, and personalized experience
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Star, text: 'Earn loyalty points on every order', color: 'from-yellow-400 to-orange-500' },
                { icon: Gift, text: 'Access exclusive promotions and gifts', color: 'from-purple-400 to-pink-500' },
                { icon: Crown, text: 'Unlock tier benefits and rewards', color: 'from-blue-400 to-indigo-500' },
                { icon: Package, text: 'Track your order history easily', color: 'from-green-400 to-emerald-500' },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5E7EB]"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#374151]">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <GradientButton
                onClick={() => setShowOTPRegister(true)}
                size="xl"
                fullWidth
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                Create Account
              </GradientButton>
              
              <button
                onClick={() => navigate('/sign-in')}
                className="w-full py-3 text-sm font-semibold text-[#667c67] hover:bg-[#F9FAFB] rounded-xl transition-all"
              >
                Already have an account? Sign In
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] rounded-xl transition-all"
              >
                Continue Browsing
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // OTP Registration Screen
  if (showOTPRegister && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3F7F3] via-white to-[#FBF8F4] flex items-center justify-center p-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard variant="elevated" className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#667c67] to-[#546352] rounded-3xl flex items-center justify-center shadow-xl"
              >
                <Phone className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-[#1F2933] mb-2">{t.registerTitle}</h1>
              <p className="text-[#6B7280] font-medium">{t.registerSubtitle}</p>
            </div>

            {/* Phone Input */}
            {!otpSent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Kyrgyzstan Only Notice */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-blue-800 leading-relaxed">
                    {t.kyrgyzstanOnly}
                  </p>
                </motion.div>

                <div>
                  <label className="block text-sm font-bold text-[#374151] mb-2">{t.phoneNumber}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+996 (555) 123-456"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F9FAFB] border-2 ${
                        error ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#667c67]'
                      } focus:bg-white outline-none transition-all text-base font-medium`}
                    />
                  </div>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 flex items-center gap-2 text-red-600"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <GradientButton
                  onClick={handleSendOTP}
                  size="xl"
                  fullWidth
                  disabled={phoneNumber.length < 10}
                >
                  {t.sendOTP}
                </GradientButton>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <p className="text-sm text-[#6B7280] font-medium mb-1">{t.otpSent}</p>
                  <p className="text-lg font-bold text-[#667c67]">{phoneNumber}</p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-bold text-[#374151] mb-3 text-center">{t.enterOTP}</label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className="w-14 h-14 text-center text-2xl font-bold rounded-2xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Timer */}
                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-[#9CA3AF] font-medium">
                      {t.resendIn} <span className="font-bold text-[#667c67]">{otpTimer}</span> {t.seconds}
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-sm font-bold text-[#667c67] hover:underline"
                    >
                      {t.resendOTP}
                    </button>
                  )}
                </div>

                <GradientButton
                  onClick={handleVerifyOTP}
                  size="xl"
                  fullWidth
                  disabled={otp.join('').length < 6}
                >
                  {t.verifyOTP}
                </GradientButton>

                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="w-full text-center text-sm font-semibold text-[#6B7280] hover:text-[#667c67]"
                >
                  {t.cancel}
                </button>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Main Profile Screen
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-5 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[#E5E7EB]"
                >
                  <Camera className="w-5 h-5 text-[#667c67]" />
                </motion.button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-[#1F2933] mb-1">{user.name}</h2>
                <p className="text-[#6B7280] font-medium mb-3">{user.email}</p>
                <div className="flex gap-2">
                  <Chip variant="default" size="sm" icon={<Calendar className="w-3 h-3" />}>
                    {t.memberSince} 2024
                  </Chip>
                  {loyaltyCard && (
                    <Chip variant="success" size="sm" icon={<Crown className="w-3 h-3" />}>
                      {loyaltyCard.tier}
                    </Chip>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(!isEditing)}
                className="w-10 h-10 rounded-xl bg-[#F9FAFB] hover:bg-[#E5E7EB] flex items-center justify-center transition-all"
              >
                <Edit2 className="w-5 h-5 text-[#667c67]" />
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <GlassCard variant="elevated" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#1F2933]">{t.editProfile}</h3>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-all"
                    >
                      <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#374151] mb-2">{t.name}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#374151] mb-2">{t.phoneNumber}</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Profile updated successfully!</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <GradientButton
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        size="lg"
                        className="flex-1"
                        leftIcon={<Save className="w-5 h-5" />}
                      >
                        {isSaving ? 'Saving...' : t.saveChanges}
                      </GradientButton>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#E5E7EB] font-semibold text-[#6B7280] transition-all"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <StatCard
            label={t.totalOrders}
            value={userOrders.length}
            icon={<Package className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            label={t.completedOrders}
            value={completedOrders}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            label={t.totalSpent}
            value={`$${totalSpent.toFixed(2)}`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="default"
          />
        </motion.div>

        {/* Loyalty Card */}
        {loyaltyCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="elevated" className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-[#667c67] via-[#546352] to-[#667c67] p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">{t.loyalty}</h3>
                    <Crown className="w-8 h-8 text-[#E4DBC4]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-white">{loyaltyCard.points}</span>
                    <span className="text-white/80 font-semibold">{t.points}</span>
                  </div>
                  <GradientButton
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      // Navigate to branch-specific loyalty if we have a current branch
                      if (currentBranch?.id || selectedBranch?.id) {
                        const branchId = currentBranch?.id || selectedBranch?.id;
                        navigate(`/loyalty-additions/branch/${branchId}`);
                      } else {
                        // Fallback to general loyalty page if no branch selected
                        navigate('/loyalty');
                      }
                    }}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    {t.viewRewards}
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Section Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.23 }}
          className="flex items-center gap-3 px-1"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
          <Sparkles className="w-5 h-5 text-purple-500" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
        </motion.div>

        {/* Rewards Program Guide - ALWAYS VISIBLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard variant="elevated" className="overflow-hidden border-2 border-purple-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">How Rewards Work</h3>
                  <p className="text-white/90 text-sm">Your complete guide to earning & redeeming</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Loyalty Points */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" fill="white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2933] text-base">Loyalty Points</h4>
                    <p className="text-[#6B7280] text-sm font-medium">Earn with every purchase</p>
                  </div>
                </div>
                <div className="ml-13 space-y-2 pl-3 border-l-2 border-yellow-200">
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Earn 1 point for every $10</span> you spend
                  </p>
                  <p className="text-sm text-[#374151]">
                    • Points are <span className="font-semibold">branch-specific</span> - use them where you earned them
                  </p>
                  <p className="text-sm text-[#374151]">
                    • Points <span className="font-semibold">never expire</span> as long as you stay active
                  </p>
                  <p className="text-sm text-[#374151]">
                    • Redeem points for <span className="font-semibold">exclusive rewards & discounts</span>
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

              {/* Tier System */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2933] text-base">Membership Tiers</h4>
                    <p className="text-[#6B7280] text-sm font-medium">Level up for better rewards</p>
                  </div>
                </div>
                <div className="ml-13 space-y-3 pl-3 border-l-2 border-blue-200">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-gray-900 text-sm">Bronze</span>
                      <span className="text-xs text-gray-500">• 0-99 points</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">Standard benefits, welcome rewards</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-700 text-sm">Silver</span>
                      <span className="text-xs text-gray-500">• 100-299 points</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">10% bonus points, exclusive offers</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="font-bold text-yellow-900 text-sm">Gold</span>
                      <span className="text-xs text-yellow-700">• 300+ points</span>
                    </div>
                    <p className="text-xs text-yellow-800 ml-6">25% bonus points, priority perks, VIP access</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

              {/* Promotions */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Percent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2933] text-base">Exclusive Promotions</h4>
                    <p className="text-[#6B7280] text-sm font-medium">Special offers & discounts</p>
                  </div>
                </div>
                <div className="ml-13 space-y-2 pl-3 border-l-2 border-purple-200">
                  <p className="text-sm text-[#374151]">
                    • Get <span className="font-semibold">personalized promo codes</span> via email & notifications
                  </p>
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Time-limited offers</span> - flash sales & seasonal deals
                  </p>
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Stack promotions</span> with loyalty rewards for maximum savings
                  </p>
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Branch-exclusive deals</span> - unique offers at each location
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

              {/* Gifts Catalog */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2933] text-base">Rewards Catalog</h4>
                    <p className="text-[#6B7280] text-sm font-medium">Redeem points for amazing gifts</p>
                  </div>
                </div>
                <div className="ml-13 space-y-2 pl-3 border-l-2 border-green-200">
                  <p className="text-sm text-[#374151]">
                    • Browse <span className="font-semibold">curated gift catalog</span> with items for all point levels
                  </p>
                  <p className="text-sm text-[#374151]">
                    • Redeem for <span className="font-semibold">free menu items, discounts, or merchandise</span>
                  </p>
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Branch-specific gifts</span> - unique items at each location
                  </p>
                  <p className="text-sm text-[#374151]">
                    • <span className="font-semibold">Limited edition rewards</span> for top-tier members
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

              {/* Pro Tips */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2933] text-base">Pro Tips</h4>
                    <p className="text-[#6B7280] text-sm font-medium">Maximize your rewards</p>
                  </div>
                </div>
                <div className="ml-13 space-y-2 pl-3 border-l-2 border-orange-200">
                  <p className="text-sm text-[#374151]">
                    💡 <span className="font-semibold">Visit regularly</span> to maintain your tier status
                  </p>
                  <p className="text-sm text-[#374151]">
                    💡 <span className="font-semibold">Enable notifications</span> to never miss exclusive deals
                  </p>
                  <p className="text-sm text-[#374151]">
                    💡 <span className="font-semibold">Check promotions page</span> before ordering for best savings
                  </p>
                  <p className="text-sm text-[#374151]">
                    💡 <span className="font-semibold">Combine offers strategically</span> - points + promo codes work together
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-3">
                <div className="p-4 bg-gradient-to-r from-[#667c67]/10 to-[#e4dbc4]/20 rounded-2xl border-2 border-[#667c67]/20">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#667c67] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-bold text-[#667c67] mb-1 text-sm">Remember: Branch-Specific Rewards</h5>
                      <p className="text-xs text-[#374151] leading-relaxed">
                        Each branch has its own loyalty program. Points, gifts, and promotions earned at one branch 
                        can only be used at that same branch. This allows us to offer you location-specific rewards 
                        and personalized experiences tailored to your favorite spots!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-[#1F2933] px-1">{t.settings}</h3>
          
          <GlassCard variant="default" className="divide-y divide-[#E5E7EB]">
            {[
              { icon: Shield, label: t.security, path: '/profile/security' },
              { icon: Settings, label: t.settings, path: '/profile/settings' },
              { icon: Gift, label: t.help, path: '/help' },
            ].map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.path && navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F9FAFB] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="flex-1 text-left font-semibold text-[#1F2933]">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </GlassCard>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GradientButton
            onClick={handleSignOut}
            variant="ghost"
            size="lg"
            fullWidth
            leftIcon={<LogOut className="w-5 h-5" />}
          >
            {t.signOut}
          </GradientButton>
        </motion.div>
      </div>
    </div>
  );
}