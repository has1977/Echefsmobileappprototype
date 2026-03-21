import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Logo } from '../components/shared/Logo';
import { 
  MapPin, Clock, Phone, ChevronRight, Search, QrCode, 
  Wifi, Star, X, Nfc, Check
} from 'lucide-react';
import { GlassCard, GradientButton, Chip, EmptyState, motion, AnimatePresence } from '../design-system';

export function BranchSelectionPage() {
  const navigate = useNavigate();
  const { branches, selectBranch, currentLanguage, changeLanguage, languages } = useApp();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNFCScanner, setShowNFCScanner] = useState(false);

  const translations = {
    en: {
      title: 'Select Branch',
      subtitle: 'Choose your dining location',
      search: 'Search branches...',
      scanQR: 'Scan QR Code',
      tapNFC: 'Tap NFC Tag',
      nfcTitle: 'Ready to Scan NFC',
      nfcDesc: 'Hold your phone near the NFC tag on your table',
      nfcScanning: 'Scanning for NFC tag...',
      openNow: 'Open Now',
      closed: 'Closed',
      away: 'away',
      scanTitle: 'Scan Table QR Code',
      scanDesc: 'Point your camera at the QR code on your table',
      cancel: 'Cancel',
      or: 'OR',
      browseMenu: 'Browse Menu',
      quickAccess: 'Quick access',
      contactless: 'Contactless',
      online: 'Online',
      branches: 'Branches',
      noResults: 'No branches found',
      tryDifferent: 'Try a different search term',
      openUntil: 'Open until',
      rating: 'Rating',
    },
    ar: {
      title: 'اختر الفرع',
      subtitle: 'اختر موقع تناول الطعام',
      search: 'بحث عن الفروع...',
      scanQR: 'مسح رمز QR',
      tapNFC: 'انقر على علامة NFC',
      nfcTitle: 'جاهز لمسح NFC',
      nfcDesc: 'امسك هاتفك بالقرب من علامة NFC على طاولتك',
      nfcScanning: 'البحث عن علامة NFC...',
      openNow: 'مفتوح الآن',
      closed: 'مغلق',
      away: 'بعيد',
      scanTitle: 'مسح رمز QR للطاولة',
      scanDesc: 'وجه الكاميرا إلى رمز QR على الطاولة',
      cancel: 'إلغاء',
      or: 'أو',
      browseMenu: 'تصفح القائمة',
      quickAccess: 'وصول سريع',
      contactless: 'بدون تلامس',
      online: 'متصل',
      branches: 'الفروع',
      noResults: 'لا توجد فروع',
      tryDifferent: 'جرب مصطلح بحث مختلف',
      openUntil: 'مفتوح حتى',
      rating: 'التقييم',
    },
    ru: {
      title: 'Выберите филиал',
      subtitle: 'Выберите место для обеда',
      search: 'Поиск филиалов...',
      scanQR: 'Сканировать QR',
      tapNFC: 'Коснуться NFC',
      nfcTitle: 'Готов к сканированию NFC',
      nfcDesc: 'Поднесите телефон к NFC метке на столе',
      nfcScanning: 'Поиск NFC метки...',
      openNow: 'Открыто сейчас',
      closed: 'Закрыто',
      away: 'далеко',
      scanTitle: 'Сканировать QR код стола',
      scanDesc: 'Наведите камеру на QR код на столе',
      cancel: 'Отмена',
      or: 'ИЛИ',
      browseMenu: 'Просмотр меню',
      quickAccess: 'Быстрый доступ',
      contactless: 'Бесконтактный',
      online: 'Онлайн',
      branches: 'Филиалы',
      noResults: 'Филиалы не найдены',
      tryDifferent: 'Попробуйте другой поисковый запрос',
      openUntil: 'Открыто до',
      rating: 'Рейтинг',
    },
    ky: {
      title: 'Бөлүмдү тандаңыз',
      subtitle: 'Тамактануу жерин тандаңыз',
      search: 'Бөлүмдөрдү издөө...',
      scanQR: 'QR кодун скандоо',
      tapNFC: 'NFC белгисин басыңыз',
      nfcTitle: 'NFC скандоого даяр',
      nfcDesc: 'Телефонуңузду столдогу NFC белгисине жакындатыңыз',
      nfcScanning: 'NFC белгиси изделүүдө...',
      openNow: 'Азыр ачык',
      closed: 'Жабык',
      away: 'алыста',
      scanTitle: 'Столдун QR кодун скандоо',
      scanDesc: 'Камераңызды столдогу QR кодго багыттаңыз',
      cancel: 'Жокко чыгаруу',
      or: 'ЖЕ',
      browseMenu: 'Менюну карап чыгуу',
      quickAccess: 'Тез кирүү',
      contactless: 'Тийбестен',
      online: 'Онлайн',
      branches: 'Бөлүмдөр',
      noResults: 'Бөлүмдөр табылган жок',
      tryDifferent: 'Башка издөө сөздү колдонуп көрүңүз',
      openUntil: 'Ачык',
      rating: 'Рейтинг',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  const isRTL = currentLanguage === 'ar';

  const filteredBranches = branches.filter(branch =>
    branch.translations[currentLanguage]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.translations[currentLanguage]?.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBranchSelect = (branchId: string, isOpen: boolean) => {
    if (!isOpen) {
      return;
    }
    selectBranch(branchId);
    navigate(`/branch/${branchId}/region-selection`);
  };

  const isOpen = (branch: any) => {
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const hours = branch.hours[day];
    if (!hours) return false;
    
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= hours.open && currentTime <= hours.close;
  };

  const getClosingTime = (branch: any) => {
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    return branch.hours[day]?.close || '00:00';
  };

  const is24Hours = (branch: any) => {
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const hours = branch.hours[day];
    if (!hours) return false;
    return hours.open === '00:00' && hours.close === '23:59';
  };

  const isClosed = (branch: any) => {
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const hours = branch.hours[day];
    return !hours || (!isOpen(branch) && !is24Hours(branch));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-[#667c67] via-[#667c67] to-[#546352] text-white sticky top-0 z-30 shadow-xl">
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <Logo size="sm" showText={false} animate />
            
            <div className="text-center flex-1 px-4">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold tracking-tight"
              >
                {t.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-white/80 font-medium"
              >
                {t.subtitle}
              </motion.p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30"
            >
              <span className="text-sm font-bold uppercase tracking-wider">{currentLanguage}</span>
            </motion.button>
          </div>

          {/* Premium Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 outline-none transition-all text-base font-medium"
            />
          </div>
        </div>

        {/* Language Menu */}
        <AnimatePresence>
          {showLangMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg border-t border-white/20 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      currentLanguage === lang.code 
                        ? 'bg-white text-[#667c67] font-bold shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="flex-1 text-left text-base">{lang.nativeName}</span>
                    {currentLanguage === lang.code && (
                      <Check className="w-5 h-5" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 space-y-6">
        {/* Quick Actions - Premium Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <GlassCard
            variant="elevated"
            className="p-3 cursor-pointer group"
            onClick={() => setShowQRScanner(true)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-[#1F2933] text-sm">{t.scanQR}</div>
                <div className="text-[10px] text-[#6B7280] font-medium mt-0.5">{t.quickAccess}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            variant="elevated"
            className="p-3 cursor-pointer group"
            onClick={() => setShowNFCScanner(true)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#184FC5] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Nfc className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-[#1F2933] text-sm">{t.tapNFC}</div>
                <div className="text-[10px] text-[#6B7280] font-medium mt-0.5">{t.contactless}</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Branches List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-[#1F2933]">
              {filteredBranches.length} {t.branches}
            </h2>
            <Chip variant="success" size="md" icon={<Wifi className="w-4 h-4" />}>
              {t.online}
            </Chip>
          </div>

          {filteredBranches.map((branch, index) => {
            const open = isOpen(branch);
            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={open ? { y: -6 } : {}}
              >
                <GlassCard 
                  variant="elevated"
                  className={`overflow-hidden ${
                    open 
                      ? 'cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => handleBranchSelect(branch.id, open)}
                >
                  {/* Branch Image */}
                  <div className="relative h-48">
                    <img
                      src={branch.imageUrl || 'https://images.unsplash.com/photo-1685040235380-a42a129ade4e?w=800'}
                      alt={branch.translations[currentLanguage]?.name}
                      className={`w-full h-full object-cover ${!open ? 'grayscale' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Chip 
                        variant={open ? 'success' : 'error'} 
                        size="md"
                        icon={<Clock className="w-4 h-4" />}
                      >
                        {open ? t.openNow : t.closed}
                      </Chip>
                      <Chip variant="default" size="md">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="ml-1 font-bold">4.8</span>
                      </Chip>
                    </div>

                    {/* Branch Name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-2xl drop-shadow-2xl tracking-tight">
                        {branch.translations[currentLanguage]?.name}
                      </h3>
                    </div>
                  </div>

                  {/* Branch Details */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#667c67] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#6B7280] font-medium flex-1 leading-relaxed">
                        {branch.translations[currentLanguage]?.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#667c67]" />
                      <p className="text-sm text-[#6B7280] font-medium">{branch.phone}</p>
                    </div>

                    {/* Operating Hours Status */}
                    {is24Hours(branch) ? (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm text-green-800 font-bold">Open 24 Hours</p>
                          <p className="text-xs text-green-600">Available around the clock</p>
                        </div>
                      </div>
                    ) : open ? (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#16A34A]" />
                        <p className="text-sm text-[#16A34A] font-semibold">
                          {t.openUntil} {getClosingTime(branch)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-red-600 font-semibold">
                          {t.closed}
                        </p>
                      </div>
                    )}

                    {/* Weekly Hours Preview */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#667c67] uppercase tracking-wide">Hours</span>
                        {is24Hours(branch) && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-2 py-0.5">24/7</Badge>
                        )}
                      </div>
                      
                      {/* Compact Weekly Grid */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                        <div className="grid grid-cols-7 gap-1.5">
                          {(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map((dayShort, idx) => {
                            const dayFull = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][idx];
                            const dayHours = branch.hours[dayFull];
                            const today = new Date().getDay();
                            const isToday = idx === today;
                            const isDayOpen = dayHours && !(dayHours.open === '00:00' && dayHours.close === '00:00');
                            const is24h = dayHours && dayHours.open === '00:00' && dayHours.close === '23:59';
                            
                            return (
                              <div
                                key={dayFull}
                                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                                  isToday 
                                    ? 'bg-[#667c67] shadow-md' 
                                    : 'bg-white'
                                }`}
                                title={`${dayFull.charAt(0).toUpperCase() + dayFull.slice(1)}: ${isDayOpen ? (is24h ? '24h' : `${dayHours.open}-${dayHours.close}`) : 'Closed'}`}
                              >
                                <span className={`text-[9px] font-bold mb-1 ${
                                  isToday ? 'text-white' : 'text-gray-600'
                                }`}>
                                  {dayShort}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  isToday 
                                    ? 'bg-white' 
                                    : isDayOpen 
                                      ? 'bg-green-500' 
                                      : 'bg-gray-300'
                                }`} />
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Today's Hours */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 mb-1">Today</p>
                            <p className="text-xs font-bold text-[#667c67]">
                              {(() => {
                                const today = new Date().getDay();
                                const todayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today];
                                const todayHours = branch.hours[todayName];
                                if (todayHours?.open === '00:00' && todayHours?.close === '23:59') {
                                  return 'Open 24 hours';
                                } else if (todayHours) {
                                  return `${todayHours.open} - ${todayHours.close}`;
                                }
                                return 'Closed';
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <GradientButton
                      fullWidth
                      size="lg"
                      disabled={!open}
                      rightIcon={<ChevronRight className="w-5 h-5" />}
                    >
                      {t.browseMenu}
                    </GradientButton>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}

          {filteredBranches.length === 0 && (
            <EmptyState
              icon={<Search className="w-12 h-12" />}
              title={t.noResults}
              description={t.tryDifferent}
            />
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Header */}
            <div className="bg-black/50 backdrop-blur-xl text-white p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <h3 className="font-bold text-xl mb-1">{t.scanTitle}</h3>
                <p className="text-sm text-white/70 font-medium">{t.scanDesc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowQRScanner(false)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 relative flex items-center justify-center p-8">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Scanner Frame with Glow */}
                <div className="absolute inset-0 border-4 border-white/20 rounded-3xl" />
                <div className="absolute inset-0 border-4 border-[#667c67]/50 rounded-3xl blur-xl" />
                
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-white rounded-tl-3xl shadow-2xl shadow-white/50" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-white rounded-tr-3xl shadow-2xl shadow-white/50" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-white rounded-bl-3xl shadow-2xl shadow-white/50" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-white rounded-br-3xl shadow-2xl shadow-white/50" />
                
                {/* Scanning Line with Glow */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-2xl shadow-white"
                  animate={{ top: ['10%', '90%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <QrCode className="w-32 h-32 text-white/30" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-black/50 backdrop-blur-xl text-white p-8 space-y-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-bold mb-4 text-white/70">{t.or}</p>
                <GradientButton
                  onClick={() => setShowQRScanner(false)}
                  variant="secondary"
                  size="xl"
                  fullWidth
                >
                  {t.browseMenu}
                </GradientButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NFC Scanner Modal */}
      <AnimatePresence>
        {showNFCScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-[#184FC5] to-[#2563EB] flex flex-col"
          >
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-xl text-white p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <h3 className="font-bold text-xl mb-1">{t.nfcTitle}</h3>
                <p className="text-sm text-white/80 font-medium">{t.nfcDesc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNFCScanner(false)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 relative flex items-center justify-center p-8">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Pulsing Glow */}
                <motion.div 
                  className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* NFC Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Nfc className="w-40 h-40 text-white drop-shadow-2xl" />
                  </motion.div>
                </div>

                {/* Ripple Effect */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-white/30 rounded-full"
                    animate={{
                      scale: [1, 2],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-black/20 backdrop-blur-xl text-white p-8 space-y-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-bold mb-4">{t.or}</p>
                <GradientButton
                  onClick={() => setShowNFCScanner(false)}
                  variant="secondary"
                  size="xl"
                  fullWidth
                >
                  {t.browseMenu}
                </GradientButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}