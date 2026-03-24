import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  UtensilsCrossed, Truck, ShoppingBag, MapPin, Clock,
  CheckCircle, Package, ChefHat, Bell, Home, Car,
  Users, Navigation, Timer, CalendarClock
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Order } from '../lib/types';

interface SmartOrderTrackingProps {
  order: Order;
  language?: 'en' | 'ar' | 'ru' | 'ky';
}

export function SmartOrderTracking({ order, language = 'en' }: SmartOrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const translations = {
    en: {
      dineIn: {
        title: 'Dine-In Order',
        steps: [
          { label: 'Order Placed', desc: 'Your order has been received' },
          { label: 'Confirmed', desc: 'Kitchen confirmed your order' },
          { label: 'Preparing', desc: 'Chef is preparing your food' },
          { label: 'Ready', desc: 'Your order is ready' },
          { label: 'Served', desc: 'Enjoy your meal!' },
        ],
      },
      delivery: {
        title: 'Delivery Order',
        steps: [
          { label: 'Order Placed', desc: 'Order received successfully' },
          { label: 'Confirmed', desc: 'Restaurant confirmed' },
          { label: 'Preparing', desc: 'Chef is cooking' },
          { label: 'Ready', desc: 'Order is ready for pickup' },
          { label: 'On the Way', desc: 'Driver is coming to you' },
          { label: 'Delivered', desc: 'Enjoy your meal!' },
        ],
      },
      takeaway: {
        title: 'Takeaway Order',
        steps: [
          { label: 'Order Placed', desc: 'Order received' },
          { label: 'Confirmed', desc: 'We got your order' },
          { label: 'Preparing', desc: 'Cooking your food' },
          { label: 'Ready for Pickup', desc: 'Come and collect!' },
          { label: 'Collected', desc: 'Thank you!' },
        ],
      },
    },
    ar: {
      dineIn: {
        title: 'طلب داخل المطعم',
        steps: [
          { label: 'تم الطلب', desc: 'تم استلام طلبك' },
          { label: 'مؤكد', desc: 'المطبخ أكد طلبك' },
          { label: 'قيد التحضير', desc: 'الشيف يحضر طعامك' },
          { label: 'جاهز', desc: 'طلبك جاهز' },
          { label: 'تم التقديم', desc: 'بالهناء والشفاء!' },
        ],
      },
      delivery: {
        title: 'طلب توصيل',
        steps: [
          { label: 'تم الطلب', desc: 'تم استلام الطلب بنجاح' },
          { label: 'مؤكد', desc: 'المطعم أكد الطلب' },
          { label: 'قيد التحضير', desc: 'الشيف يطبخ' },
          { label: 'جاهز', desc: 'الطلب جاهز للتوصيل' },
          { label: 'في الطريق', desc: 'السائق قادم إليك' },
          { label: 'تم التوصيل', desc: 'بالهناء والشفاء!' },
        ],
      },
      takeaway: {
        title: 'طلب خارجي',
        steps: [
          { label: 'تم الطلب', desc: 'تم استلام الطلب' },
          { label: 'مؤكد', desc: 'استلمنا طلبك' },
          { label: 'قيد التحضير', desc: 'نطبخ طعامك' },
          { label: 'جاهز للاستلام', desc: 'تعال واستلم!' },
          { label: 'تم الاستلام', desc: 'شكراً لك!' },
        ],
      },
    },
    ru: {
      dineIn: {
        title: 'Заказ в ресторане',
        steps: [
          { label: 'Заказ размещен', desc: 'Ваш заказ получен' },
          { label: 'Подтвержден', desc: 'Кухня подтвердила заказ' },
          { label: 'Готовится', desc: 'Повар готовит вашу еду' },
          { label: 'Готово', desc: 'Ваш заказ готов' },
          { label: 'Подано', desc: 'Приятного аппетита!' },
        ],
      },
      delivery: {
        title: 'Доставка',
        steps: [
          { label: 'Заказ размещен', desc: 'Заказ успешно получен' },
          { label: 'Подтвержден', desc: 'Ресторан подтвердил' },
          { label: 'Готовится', desc: 'Повар готовит' },
          { label: 'Готово', desc: 'Заказ готов к доставке' },
          { label: 'В пути', desc: 'Водитель едет к вам' },
          { label: 'Доставлено', desc: 'Приятного аппетита!' },
        ],
      },
      takeaway: {
        title: 'Самовывоз',
        steps: [
          { label: 'Заказ размещен', desc: 'Заказ получен' },
          { label: 'Подтвержден', desc: 'Мы получили ваш заказ' },
          { label: 'Готовится', desc: 'Готовим вашу еду' },
          { label: 'Готово к выдаче', desc: 'Приходите забрать!' },
          { label: 'Выдано', desc: 'Спасибо!' },
        ],
      },
    },
    ky: {
      dineIn: {
        title: 'Ресторанда буйрутма',
        steps: [
          { label: 'Буйрутма жасалды', desc: 'Буйрутмаңыз кабыл алынды' },
          { label: 'Ырасталды', desc: 'Ашкана ырастады' },
          { label: 'Даярдалууда', desc: 'Ашпоз даярдап жатат' },
          { label: 'Даяр', desc: 'Буйрутмаңыз даяр' },
          { label: 'Берилди', desc: 'Даамдуу тамактангыла!' },
        ],
      },
      delivery: {
        title: 'Жеткирүү',
        steps: [
          { label: 'Буйрутма жасалды', desc: 'Буйрутма кабыл алынды' },
          { label: 'Ырасталды', desc: 'Ресторан ырастады' },
          { label: 'Даярдалууда', desc: 'Бышырылууда' },
          { label: 'Даяр', desc: 'Жеткирүүгө даяр' },
          { label: 'Жолдо', desc: 'Айдоочу келе жатат' },
          { label: 'Жеткирилди', desc: 'Даамдуу тамактангыла!' },
        ],
      },
      takeaway: {
        title: 'Алып кетүү',
        steps: [
          { label: 'Буйрутма жасалды', desc: 'Буйрутма кабыл алынды' },
          { label: 'Ырасталды', desc: 'Буйрутмаңызды алдык' },
          { label: 'Даярдалууда', desc: 'Даярдап жатабыз' },
          { label: 'Алууга даяр', desc: 'Келип алыңыз!' },
          { label: 'Алынды', desc: 'Рахмат!' },
        ],
      },
    },
  };

  const getSteps = () => {
    const orderType = order.type || 'dine-in';
    return translations[language][orderType as keyof typeof translations[typeof language]].steps;
  };

  const getTitle = () => {
    const orderType = order.type || 'dine-in';
    return translations[language][orderType as keyof typeof translations[typeof language]].title;
  };

  const getStepIndex = (status: Order['status']) => {
    const orderType = order.type || 'dine-in';
    
    if (orderType === 'dine-in') {
      switch (status) {
        case 'pending': return 0;
        case 'confirmed': return 1;
        case 'preparing': return 2;
        case 'ready': return 3;
        case 'completed': return 4;
        default: return 0;
      }
    } else if (orderType === 'delivery') {
      switch (status) {
        case 'pending': return 0;
        case 'confirmed': return 1;
        case 'preparing': return 2;
        case 'ready': return 3;
        case 'delivering': return 4;
        case 'completed': return 5;
        default: return 0;
      }
    } else { // takeaway
      switch (status) {
        case 'pending': return 0;
        case 'confirmed': return 1;
        case 'preparing': return 2;
        case 'ready': return 3;
        case 'completed': return 4;
        default: return 0;
      }
    }
  };

  const getStepIcon = (stepIndex: number, orderType: string) => {
    if (orderType === 'dine-in') {
      const icons = [Package, CheckCircle, ChefHat, Bell, UtensilsCrossed];
      return icons[stepIndex] || Package;
    } else if (orderType === 'delivery') {
      const icons = [Package, CheckCircle, ChefHat, Bell, Car, Home];
      return icons[stepIndex] || Package;
    } else {
      const icons = [Package, CheckCircle, ChefHat, Bell, ShoppingBag];
      return icons[stepIndex] || Package;
    }
  };

  useEffect(() => {
    setCurrentStep(getStepIndex(order.status));
  }, [order.status]);

  const steps = getSteps();
  const orderType = order.type || 'dine-in';

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {orderType === 'dine-in' && (
          <div className="w-12 h-12 rounded-full bg-[#667c67]/10 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-[#667c67]" />
          </div>
        )}
        {orderType === 'delivery' && (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
        )}
        {orderType === 'takeaway' && (
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg">{getTitle()}</h3>
          <p className="text-sm text-gray-500">Order #{order.id.split('_')[1]}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const StepIcon = getStepIcon(index, orderType);
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-[#667c67] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    animate={
                      isCurrent
                        ? {
                            scale: [1, 1.1, 1],
                            transition: { repeat: Infinity, duration: 2 },
                          }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </motion.div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div
                    className={`font-semibold ${
                      isCompleted
                        ? 'text-green-700'
                        : isCurrent
                        ? 'text-[#667c67]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-sm ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.desc}
                  </div>

                  {/* Timestamp */}
                  {order.timeline && order.timeline[index] && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.timeline[index].timestamp).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}

                  {/* Current Status Badge */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <Badge className="bg-[#667c67]">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span>Current Status</span>
                        </div>
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t space-y-3">
        {orderType === 'dine-in' && order.tableNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Table:</span>
            <span className="font-semibold">{order.tableNumber}</span>
          </div>
        )}

        {orderType === 'delivery' && order.deliveryAddress && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-gray-600">Delivery to:</div>
              <div className="font-semibold">{order.deliveryAddress}</div>
            </div>
          </div>
        )}

        {orderType === 'delivery' && order.estimatedDeliveryTime && (
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Estimated:</span>
            <span className="font-semibold">
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {orderType === 'takeaway' && order.pickupTime && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarClock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Pickup at:</span>
            <span className="font-semibold">
              {new Date(order.pickupTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
