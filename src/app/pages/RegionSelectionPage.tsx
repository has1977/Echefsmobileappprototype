import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Users, Wind, Cigarette, CigaretteOff, 
  Crown, Home, Beer, Trees, Check, MapPin, 
  UtensilsCrossed, ShoppingBag, Truck, Clock 
} from 'lucide-react';

export function RegionSelectionPage() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { selectedBranch, selectTable, selectRegion, currentLanguage, orderType, setOrderType } = useApp();
  const [localRegion, setLocalRegion] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Check if branch is valid
  useEffect(() => {
    if (!selectedBranch || selectedBranch.id !== branchId) {
      navigate('/branch-selection');
    }
  }, [selectedBranch, branchId, navigate]);

  const translations = {
    en: {
      title: 'How would you like to order?',
      subtitle: 'Choose your ordering method',
      dineIn: 'Dine-In',
      dineInDesc: 'Order at table',
      takeaway: 'Takeaway',
      takeawayDesc: 'Pick up your order',
      delivery: 'Delivery',
      deliveryDesc: 'Deliver to address',
      selectRegion: 'Select Region',
      selectTable: 'Select Your Table',
      continue: 'Continue to Menu',
      capacity: 'Capacity',
      tables: 'tables',
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',
      seats: 'seats',
    },
    ar: {
      title: 'كيف تريد الطلب؟',
      subtitle: 'اختر طريقة الطلب',
      dineIn: 'تناول الطعام',
      dineInDesc: 'الطلب على الطاولة',
      takeaway: 'طلب خارجي',
      takeawayDesc: 'استلام طلبك',
      delivery: 'التوصيل',
      deliveryDesc: 'التوصيل إلى العنوان',
      selectRegion: 'اختر المنطقة',
      selectTable: 'اختر طاولتك',
      continue: 'متابعة إلى القائمة',
      capacity: 'السعة',
      tables: 'طاولات',
      available: 'متاح',
      occupied: 'مشغول',
      reserved: 'محجوز',
      seats: 'مقاعد',
    },
    ru: {
      title: 'Как вы хотите заказать?',
      subtitle: 'Выберите способ заказа',
      dineIn: 'В ресторане',
      dineInDesc: 'Заказ за столом',
      takeaway: 'С собой',
      takeawayDesc: 'Заберите заказ',
      delivery: 'Доставка',
      deliveryDesc: 'Доставка по адресу',
      selectRegion: 'Выберите зону',
      selectTable: 'Выберите стол',
      continue: 'Перейти к меню',
      capacity: 'Вместимость',
      tables: 'столов',
      available: 'Доступно',
      occupied: 'Занято',
      reserved: 'Зарезервировано',
      seats: 'мест',
    },
    ky: {
      title: 'Кантип заказ кылгыңыз келет?',
      subtitle: 'Заказ берүү ыкмасын тандаңыз',
      dineIn: 'Ресторанда',
      dineInDesc: 'Столдо заказ',
      takeaway: 'Алып кетүү',
      takeawayDesc: 'Заказды алып кетүү',
      delivery: 'Жеткирүү',
      deliveryDesc: 'Дарегине жеткирүү',
      selectRegion: 'Аймакты тандаңыз',
      selectTable: 'Столуңузду тандаңыз',
      continue: 'Менюга өтүү',
      capacity: 'Сыйымдуулук',
      tables: 'столдор',
      available: 'Бош',
      occupied: 'Ээлик кылынган',
      reserved: 'Резервделген',
      seats: 'орун',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  const isRTL = currentLanguage === 'ar';

  // Return early if no branch - the useEffect will handle navigation
  if (!selectedBranch) {
    return null;
  }

  const regionIcons: Record<string, any> = {
    mainHall: Home,
    smoking: Cigarette,
    nonSmoking: CigaretteOff,
    outdoor: Trees,
    vip: Crown,
    terrace: Wind,
    bar: Beer,
  };

  const regionColors: Record<string, string> = {
    mainHall: 'bg-blue-500',
    smoking: 'bg-gray-600',
    nonSmoking: 'bg-success',
    outdoor: 'bg-emerald-500',
    vip: 'bg-yellow-500',
    terrace: 'bg-sky-500',
    bar: 'bg-purple-500',
  };

  const selectedRegionData = selectedBranch.regions.find(r => r.id === localRegion);

  const handleContinue = () => {
    if (selectedTableId) {
      selectTable(selectedTableId);
      navigate(`/branch/${branchId}/menu`);
    }
  };

  const getTableColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success hover:bg-success/90 border-success';
      case 'occupied':
        return 'bg-destructive border-destructive cursor-not-allowed';
      case 'reserved':
        return 'bg-warning border-warning cursor-not-allowed';
      default:
        return 'bg-gray-300 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667c67] to-[#526250] text-white sticky top-0 z-20 shadow-lg">
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-sm text-white/80">{selectedBranch.translations[currentLanguage]?.name}</p>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Order Type Selection */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">{t.title}</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Dine-In */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0 }}
              onClick={() => setOrderType('dine-in')}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                orderType === 'dine-in'
                  ? 'border-[#667c67] bg-[#667c67]/10'
                  : 'border-gray-200 hover:border-[#667c67]/50'
              }`}
            >
              <UtensilsCrossed className={`w-8 h-8 mx-auto mb-2 ${
                orderType === 'dine-in' ? 'text-[#667c67]' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-semibold mb-1 ${
                orderType === 'dine-in' ? 'text-[#667c67]' : 'text-gray-700'
              }`}>
                {t.dineIn}
              </div>
              <div className="text-xs text-muted-foreground">{t.dineInDesc}</div>
              
              {orderType === 'dine-in' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>

            {/* Takeaway */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => setOrderType('takeaway')}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                orderType === 'takeaway'
                  ? 'border-[#667c67] bg-[#667c67]/10'
                  : 'border-gray-200 hover:border-[#667c67]/50'
              }`}
            >
              <ShoppingBag className={`w-8 h-8 mx-auto mb-2 ${
                orderType === 'takeaway' ? 'text-[#667c67]' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-semibold mb-1 ${
                orderType === 'takeaway' ? 'text-[#667c67]' : 'text-gray-700'
              }`}>
                {t.takeaway}
              </div>
              <div className="text-xs text-muted-foreground">{t.takeawayDesc}</div>
              
              {orderType === 'takeaway' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>

            {/* Delivery */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setOrderType('delivery')}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                orderType === 'delivery'
                  ? 'border-[#667c67] bg-[#667c67]/10'
                  : 'border-gray-200 hover:border-[#667c67]/50'
              }`}
            >
              <Truck className={`w-8 h-8 mx-auto mb-2 ${
                orderType === 'delivery' ? 'text-[#667c67]' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-semibold mb-1 ${
                orderType === 'delivery' ? 'text-[#667c67]' : 'text-gray-700'
              }`}>
                {t.delivery}
              </div>
              <div className="text-xs text-muted-foreground">{t.deliveryDesc}</div>
              
              {orderType === 'delivery' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#667c67] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>

        {/* Takeaway/Delivery Direct to Menu */}
        {(orderType === 'takeaway' || orderType === 'delivery') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => navigate(`/branch/${branchId}/menu`)}
              size="lg"
              className="w-full h-14 text-base bg-[#667c67] hover:bg-[#526250]"
            >
              <Clock className="w-5 h-5 mr-3" />
              {t.continue}
              <ChevronLeft className={`w-5 h-5 ml-auto ${isRTL ? '' : 'rotate-180'}`} />
            </Button>
          </motion.div>
        )}

        {/* Regions Grid - Only for Dine-In */}
        {orderType === 'dine-in' && !localRegion && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">{t.selectRegion}</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {selectedBranch.regions.map((region, index) => {
                const Icon = regionIcons[region.type] || Home;
                const availableTables = region.tables.filter(t => t.status === 'available').length;
                const colorClass = regionColors[region.type] || 'bg-gray-500';

                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-98 border-2 border-transparent hover:border-[#667c67]/30"
                      onClick={() => setLocalRegion(region.id)}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1">
                            {region.translations[currentLanguage]}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{region.capacity} {t.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{region.tables.length} {t.tables}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                              {availableTables} {t.available}
                            </Badge>
                            {region.tables.filter(t => t.status === 'occupied').length > 0 && (
                              <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">
                                {region.tables.filter(t => t.status === 'occupied').length} {t.occupied}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronLeft className={`w-6 h-6 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table Selection */}
        {localRegion && selectedRegionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setLocalRegion(null);
                  setSelectedTableId(null);
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <div>
                <h2 className="font-semibold text-lg">
                  {selectedRegionData.translations[currentLanguage]}
                </h2>
                <p className="text-sm text-muted-foreground">{t.selectTable}</p>
              </div>
            </div>

            {/* Status Legend */}
            <Card className="p-4">
              <div className="flex items-center justify-around text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded" />
                  <span>{t.available}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded" />
                  <span>{t.occupied}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-warning rounded" />
                  <span>{t.reserved}</span>
                </div>
              </div>
            </Card>

            {/* Tables Grid */}
            <div className="grid grid-cols-4 gap-3">
              {selectedRegionData.tables.map((table, index) => {
                const isSelected = selectedTableId === table.id;
                const isAvailable = table.status === 'available';

                return (
                  <motion.button
                    key={table.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => isAvailable && setSelectedTableId(table.id)}
                    disabled={!isAvailable}
                    className={`relative aspect-square rounded-2xl border-2 transition-all ${
                      getTableColor(table.status)
                    } ${
                      isSelected ? 'ring-4 ring-[#667c67] ring-offset-2 scale-105' : ''
                    } flex flex-col items-center justify-center p-2`}
                  >
                    <div className="text-white font-bold text-lg">
                      {table.number}
                    </div>
                    <div className="text-white/90 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {table.seats}
                    </div>
                    
                    {isSelected && isAvailable && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-[#667c67]" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Continue Button */}
      {selectedTableId && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t shadow-lg z-50"
        >
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full h-14 text-base bg-[#667c67] hover:bg-[#526250]"
          >
            {t.continue}
            <ChevronLeft className={`w-5 h-5 ml-auto ${isRTL ? '' : 'rotate-180'}`} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}