import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { currentLanguage } = useApp();

  const translations = {
    en: {
      title: '404',
      subtitle: 'Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
      home: 'Go Home',
      back: 'Go Back',
    },
    ar: {
      title: '404',
      subtitle: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      home: 'الرئيسية',
      back: 'العودة',
    },
    ru: {
      title: '404',
      subtitle: 'Страница не найдена',
      description: 'Страница, которую вы ищете, не существует или была перемещена.',
      home: 'Главная',
      back: 'Назад',
    },
    ky: {
      title: '404',
      subtitle: 'Баракча табылган жок',
      description: 'Сиз издеген барак жок же көчүрүлгөн.',
      home: 'Башкы бет',
      back: 'Артка',
    },
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  const isRTL = currentLanguage === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667c67] to-[#8a9d8b] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="text-[120px] font-bold text-white/20"
        >
          {t.title}
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">{t.subtitle}</h1>
          <p className="text-white/80">{t.description}</p>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="bg-white text-[#667c67] hover:bg-white/90"
          >
            <Home className="w-4 h-4 mr-2" />
            {t.home}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}