import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { GlassCard, GradientButton } from '../design-system';

export function ProfileSecurityPage() {
  const navigate = useNavigate();
  const { changePassword, deleteAccount } = useAuth();
  const { currentLanguage } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const isRTL = currentLanguage === 'ar';

  const t = {
    en: {
      title: 'Security & Privacy',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      updatePassword: 'Update Password',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This action cannot be undone. All your data will be permanently deleted.',
      confirmDelete: 'Confirm Delete',
      cancel: 'Cancel',
    },
    ar: {
      title: 'الأمان والخصوصية',
      changePassword: 'تغيير كلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      updatePassword: 'تحديث كلمة المرور',
      deleteAccount: 'حذف الحساب',
      deleteWarning: 'لا يمكن التراجع عن هذا الإجراء. ستحذف جميع بياناتك نهائيًا.',
      confirmDelete: 'تأكيد الحذف',
      cancel: 'إلغاء',
    },
    ru: {
      title: 'Безопасность и конфиденциальность',
      changePassword: 'Изменить пароль',
      currentPassword: 'Текущий пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Подтвердите пароль',
      updatePassword: 'Обновить пароль',
      deleteAccount: 'Удалить аккаунт',
      deleteWarning: 'Это действие нельзя отменить. Все ваши данные будут удалены навсегда.',
      confirmDelete: 'Подтвердить удаление',
      cancel: 'Отмена',
    },
    ky: {
      title: 'Коопсуздук жана купуялык',
      changePassword: 'Сырсөздү өзгөртүү',
      currentPassword: 'Учурдагы сырсөз',
      newPassword: 'Жаңы сырсөз',
      confirmPassword: 'Сырсөздү тастыктаңыз',
      updatePassword: 'Сырсөздү жаңыртуу',
      deleteAccount: 'Аккаунтту өчүрүү',
      deleteWarning: 'Бул аракетти кайтаруу мүмкүн эмес. Бардык маалыматыңыз биротоло өчүрүлөт.',
      confirmDelete: 'Өчүрүүнү тастыктоо',
      cancel: 'Жокко чыгаруу',
    },
  }[currentLanguage as 'en' | 'ar' | 'ru' | 'ky'] || t.en;

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
        {/* Change Password */}
        <GlassCard variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667c67] to-[#546352] flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#1F2933]">{t.changePassword}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">{t.currentPassword}</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667c67]"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">{t.newPassword}</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#667c67]"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">{t.confirmPassword}</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#667c67] focus:bg-white outline-none transition-all"
              />
            </div>

            <GradientButton
              size="lg"
              fullWidth
              disabled={!formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
            >
              {t.updatePassword}
            </GradientButton>
          </div>
        </GlassCard>

        {/* Delete Account */}
        <GlassCard variant="default" className="p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#1F2933]">{t.deleteAccount}</h2>
          </div>

          <p className="text-sm text-[#6B7280] mb-4">{t.deleteWarning}</p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all"
            >
              {t.deleteAccount}
            </button>
          ) : (
            <div className="space-y-3">
              <GradientButton
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => {
                  deleteAccount();
                  navigate('/');
                }}
                className="!bg-red-600 hover:!bg-red-700 !text-white"
                leftIcon={<Trash2 className="w-5 h-5" />}
              >
                {t.confirmDelete}
              </GradientButton>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3 text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] rounded-xl transition-all"
              >
                {t.cancel}
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
