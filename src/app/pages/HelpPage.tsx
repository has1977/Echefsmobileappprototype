import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText } from 'lucide-react';
import { GlassCard, GradientButton } from '../design-system';

export function HelpPage() {
  const navigate = useNavigate();
  const { currentLanguage } = useApp();

  const isRTL = currentLanguage === 'ar';

  const t = {
    en: {
      title: 'Help & Support',
      subtitle: 'We\'re here to help you',
      faq: 'Frequently Asked Questions',
      contactUs: 'Contact Us',
      phone: 'Call Us',
      email: 'Email Support',
      chat: 'Live Chat',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      about: 'About eChefs',
    },
    ar: {
      title: 'المساعدة والدعم',
      subtitle: 'نحن هنا لمساعدتك',
      faq: 'الأسئلة الشائعة',
      contactUs: 'اتصل بنا',
      phone: 'اتصل بنا',
      email: 'الدعم عبر البريد',
      chat: 'محادثة مباشرة',
      terms: 'الشروط والأحكام',
      privacy: 'سياسة الخصوصية',
      about: 'عن eChefs',
    },
    ru: {
      title: 'Помощь и поддержка',
      subtitle: 'Мы здесь, чтобы помочь',
      faq: 'Часто задаваемые вопросы',
      contactUs: 'Свяжитесь с нами',
      phone: 'Позвонить',
      email: 'Email поддержка',
      chat: 'Онлайн чат',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      about: 'О eChefs',
    },
    ky: {
      title: 'Жардам жана колдоо',
      subtitle: 'Биз сизге жардам берүүгө даярбыз',
      faq: 'Көп берилүүчү суроолор',
      contactUs: 'Байланышуу',
      phone: 'Чалуу',
      email: 'Email колдоо',
      chat: 'Түздөн-түз баарлашуу',
      terms: 'Шарттар жана талаптар',
      privacy: 'Купуялык саясаты',
      about: 'eChefs жөнүндө',
    },
  }[currentLanguage as 'en' | 'ar' | 'ru' | 'ky'] || t.en;

  const helpOptions = [
    {
      icon: Phone,
      label: t.phone,
      value: '+996 555 000 001',
      action: () => window.location.href = 'tel:+996555000001',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Mail,
      label: t.email,
      value: 'support@echefs.com',
      action: () => window.location.href = 'mailto:support@echefs.com',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: MessageCircle,
      label: t.chat,
      value: 'Available 24/7',
      action: () => console.log('Open chat'),
      color: 'from-purple-400 to-purple-600',
    },
  ];

  const infoLinks = [
    { icon: HelpCircle, label: t.faq, path: '/faq' },
    { icon: FileText, label: t.terms, path: '/terms' },
    { icon: FileText, label: t.privacy, path: '/privacy' },
    { icon: HelpCircle, label: t.about, path: '/about' },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-[#F9FAFB] via-white to-[#FBF8F4]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#667c67] to-[#546352] p-5 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        </div>
        <p className="text-white/80 font-medium text-center">{t.subtitle}</p>
      </div>

      <div className="p-5 space-y-6">
        {/* Contact Options */}
        <div>
          <h3 className="text-lg font-bold text-[#1F2933] mb-4">{t.contactUs}</h3>
          <div className="space-y-3">
            {helpOptions.map((option, index) => (
              <motion.button
                key={index}
                onClick={option.action}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <GlassCard variant="elevated" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[#1F2933]">{option.label}</div>
                      <div className="text-sm text-[#6B7280]">{option.value}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Information Links */}
        <div>
          <GlassCard variant="default" className="divide-y divide-[#E5E7EB]">
            {infoLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F9FAFB] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] flex items-center justify-center">
                  <link.icon className="w-5 h-5 text-[#667c67]" />
                </div>
                <span className="flex-1 text-left font-semibold text-[#374151]">{link.label}</span>
              </button>
            ))}
          </GlassCard>
        </div>

        {/* App Version */}
        <div className="text-center">
          <p className="text-sm text-[#9CA3AF]">
            eChefs v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
