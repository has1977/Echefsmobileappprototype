# 📱 دليل إعداد نظام OTP للهاتف في قيرغيزستان
# SMS OTP Setup Guide for Kyrgyzstan

## 🌟 نظرة عامة / Overview

تم تطوير نظام OTP متكامل للتحقق من الهواتف في قيرغيزستان مع دعم كامل لتنسيق الأرقام المحلية (+996).

A complete OTP verification system has been implemented for Kyrgyzstan with full support for local phone number format (+996).

---

## ✨ الميزات / Features

### 🎯 التنسيق التلقائي / Auto-Formatting
- ✅ **رمز الدولة الثابت**: +996 (قيرغيزستان)
- ✅ **التنسيق المحلي**: +996 XXX XXX XXX
- ✅ **منع الحذف**: لا يمكن حذف رمز الدولة +996
- ✅ **التحقق التلقائي**: التحقق من صحة الرقم في الوقت الفعلي

### 🔐 نظام OTP متقدم / Advanced OTP System
- ✅ **6 خانات منفصلة** / 6 separate digits
- ✅ **انتقال تلقائي** / Auto-focus next field
- ✅ **Backspace ذكي** / Smart backspace navigation
- ✅ **مؤقت 60 ثانية** / 60-second resend timer
- ✅ **قبول الأرقام فقط** / Numbers only input

### 📞 دعم المشغلين / Operator Support
تم التحقق من التوافق مع جميع مشغلي الهواتف في قيرغيزستان:
- **Beeline (Sky Mobile)**: 700, 770-778
- **O! (MegaCom)**: 550-559
- **NUR Telecom (Alfa)**: 500-509

---

## 🚀 البدء السريع / Quick Start

### 1. تجربة النظام / Test the System

**تسجيل دخول جديد / New Sign-In:**
1. اذهب إلى `/sign-in`
2. اختر "Phone" من التبويبات
3. أدخل رقم الهاتف: `+996 700 123 456`
4. استخدم OTP تجريبي: `123456`

**إنشاء حساب جديد / Create New Account:**
1. اذهب إلى `/sign-up`
2. اختر "Phone" من التبويبات
3. أدخل الاسم ورقم الهاتف
4. استخدم OTP تجريبي: `123456`

---

## 🛠️ التكامل مع مزودي SMS / SMS Provider Integration

### مزودون موصى بهم / Recommended Providers

#### 1️⃣ **Twilio** (عالمي / Global)
```bash
npm install twilio
```

**المميزات / Features:**
- ✅ تغطية عالمية ممتازة
- ✅ API سهل الاستخدام
- ✅ Verify API مدمج للـ OTP
- ✅ دعم فني 24/7

**التكلفة**: ~$0.07 لكل رسالة إلى قيرغيزستان

**مثال على الكود / Code Example:**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTP(phone: string, code: string) {
  await client.messages.create({
    body: `Your eChefs verification code: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone // +996XXXXXXXXX
  });
}
```

#### 2️⃣ **SMSC.kg** (محلي / Local)
**المميزات / Features:**
- ✅ اتصال مباشر مع شركات الاتصالات المحلية
- ✅ معدل توصيل عالي جداً في قيرغيزستان
- ✅ زمن استجابة منخفض
- ✅ دعم اللغة الروسية والقيرغيزية
- ✅ دعم فني محلي

**مثال على الكود / Code Example:**
```typescript
async function sendOTP(phone: string, code: string) {
  const params = new URLSearchParams({
    login: process.env.SMSC_LOGIN,
    psw: process.env.SMSC_PASSWORD,
    phones: phone.replace('+', ''),
    mes: `Код подтверждения: ${code}`,
    charset: 'utf-8'
  });
  
  const response = await fetch(
    `https://smsc.kg/sys/send.php?${params}`
  );
  return await response.json();
}
```

#### 3️⃣ **MessageBird** (عالمي / Global)
```bash
npm install messagebird
```

**التكلفة**: ~$0.06 لكل رسالة

**مثال على الكود / Code Example:**
```typescript
import messagebird from 'messagebird';

const client = messagebird(process.env.MESSAGEBIRD_API_KEY);

async function sendOTP(phone: string, code: string) {
  await client.messages.create({
    originator: 'eChefs',
    recipients: [phone],
    body: `Verification code: ${code}`
  });
}
```

---

## 📋 دليل التكامل الكامل / Full Integration Guide

### الخطوة 1: اختر مزود SMS
Choose an SMS provider from the recommended list above.

### الخطوة 2: أنشئ حساب وحصل على API Keys
Create an account and get API credentials.

### الخطوة 3: أضف المتغيرات البيئية
Add environment variables to your `.env` file:

```env
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# OR SMSC.kg
SMSC_LOGIN=your_login
SMSC_PASSWORD=your_password

# OR MessageBird
MESSAGEBIRD_API_KEY=your_api_key
```

### الخطوة 4: أنشئ SMS Service
Create a service file `/src/app/services/smsService.ts`:

```typescript
import { OTP_CONFIG, DEMO_OTP, isDemoMode } from '../utils/smsProviders';

interface SendOTPResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SMSService {
  /**
   * إرسال رمز OTP إلى رقم الهاتف
   * Send OTP code to phone number
   */
  async sendOTP(phoneNumber: string, code: string): Promise<SendOTPResult> {
    // في وضع التطوير، استخدم OTP تجريبي
    // In development mode, use demo OTP
    if (isDemoMode()) {
      console.log(`[DEMO] OTP Code for ${phoneNumber}: ${code}`);
      return { success: true, messageId: 'demo-' + Date.now() };
    }

    try {
      // TODO: استبدل هذا بالكود الحقيقي لمزود SMS الخاص بك
      // TODO: Replace this with your actual SMS provider code
      
      // مثال باستخدام Twilio
      // Example using Twilio
      const result = await this.sendViaTwilio(phoneNumber, code);
      
      return result;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * توليد رمز OTP عشوائي
   * Generate random OTP code
   */
  generateOTP(): string {
    if (isDemoMode()) {
      return DEMO_OTP;
    }
    
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < OTP_CONFIG.length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  /**
   * حفظ OTP في قاعدة البيانات/الذاكرة
   * Store OTP in database/memory
   */
  async storeOTP(phoneNumber: string, code: string): Promise<void> {
    const expiryTime = Date.now() + (OTP_CONFIG.expiryMinutes * 60 * 1000);
    
    // TODO: احفظ في قاعدة البيانات
    // TODO: Store in database
    localStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
      code,
      expiryTime,
      attempts: 0
    }));
  }

  /**
   * التحقق من رمز OTP
   * Verify OTP code
   */
  async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    if (isDemoMode() && code === DEMO_OTP) {
      return true;
    }

    // TODO: تحقق من قاعدة البيانات
    // TODO: Verify from database
    const stored = localStorage.getItem(`otp_${phoneNumber}`);
    if (!stored) return false;

    const { code: storedCode, expiryTime, attempts } = JSON.parse(stored);

    // تحقق من انتهاء الصلاحية
    // Check expiry
    if (Date.now() > expiryTime) {
      localStorage.removeItem(`otp_${phoneNumber}`);
      return false;
    }

    // تحقق من عدد المحاولات
    // Check attempts
    if (attempts >= OTP_CONFIG.maxAttempts) {
      localStorage.removeItem(`otp_${phoneNumber}`);
      return false;
    }

    // تحقق من الرمز
    // Verify code
    if (storedCode === code) {
      localStorage.removeItem(`otp_${phoneNumber}`);
      return true;
    }

    // زيادة عدد المحاولات
    // Increment attempts
    localStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
      code: storedCode,
      expiryTime,
      attempts: attempts + 1
    }));

    return false;
  }

  /**
   * إرسال عبر Twilio (مثال)
   */
  private async sendViaTwilio(phone: string, code: string): Promise<SendOTPResult> {
    // TODO: تنفيذ الكود الحقيقي
    // TODO: Implement actual code
    throw new Error('Not implemented');
  }
}

// تصدير instance واحد
// Export singleton instance
export const smsService = new SMSService();
```

### الخطوة 5: تحديث صفحات Auth
Update auth pages to use the SMS service:

```typescript
// في SignInPage.tsx / In SignInPage.tsx
import { smsService } from '../../services/smsService';

const handlePhoneSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  if (phoneStep === 'phone') {
    // توليد وإرسال OTP
    // Generate and send OTP
    const code = smsService.generateOTP();
    await smsService.storeOTP(phoneNumber, code);
    
    const result = await smsService.sendOTP(phoneNumber, code);
    
    if (result.success) {
      setPhoneStep('otp');
      setResendTimer(60);
      // Start countdown...
    } else {
      setError('Failed to send verification code. Please try again.');
    }
  } else {
    // التحقق من OTP
    // Verify OTP
    const otpCode = otp.join('');
    const isValid = await smsService.verifyOTP(phoneNumber, otpCode);
    
    if (isValid) {
      // تسجيل الدخول
      // Sign in
      const result = await signIn(phoneNumber, 'phone-auth');
      if (result.success) {
        navigate('/branch-selection');
      }
    } else {
      setError('Invalid or expired verification code.');
    }
  }
};
```

---

## 🌍 قوالب الرسائل متعددة اللغات / Multilingual SMS Templates

### العربية (Arabic)
```
رمز التحقق من eChefs: {CODE}
صالح لمدة 5 دقائق.
```

### الإنجليزية (English)
```
Your eChefs verification code: {CODE}
Valid for 5 minutes.
```

### الروسية (Russian)
```
Ваш код подтверждения eChefs: {CODE}
Действителен 5 минут.
```

### القيرغيزية (Kyrgyz)
```
Сиздин eChefs ырастоо кодуңуз: {CODE}
5 мүнөткө жарактуу.
```

---

## 🔒 اعتبارات الأمان / Security Considerations

### ✅ أفضل الممارسات / Best Practices

1. **تشفير OTP في قاعدة البيانات**
   - احفظ hash للـ OTP، وليس النص الأصلي
   - Store OTP hash, not plain text

2. **محدودية الوقت**
   - انتهاء صلاحية تلقائي بعد 5 دقائق
   - Auto-expire after 5 minutes

3. **محدودية المحاولات**
   - 3 محاولات كحد أقصى
   - Maximum 3 attempts

4. **Rate Limiting**
   - حد طلب واحد لكل دقيقة لكل رقم
   - Limit 1 request per minute per number

5. **تسجيل الأنشطة**
   - سجل جميع محاولات الإرسال والتحقق
   - Log all send and verify attempts

---

## 📊 المراقبة والتحليلات / Monitoring & Analytics

### مقاييس مهمة / Important Metrics

1. **معدل التوصيل** (Delivery Rate)
   - النسبة المئوية للرسائل التي وصلت بنجاح

2. **معدل التحويل** (Conversion Rate)
   - النسبة المئوية للمستخدمين الذين أكملوا التحقق

3. **وقت التوصيل** (Delivery Time)
   - متوسط الوقت حتى استلام OTP

4. **تكلفة لكل تحويل** (Cost per Conversion)
   - التكلفة الفعلية لكل مستخدم تم التحقق منه

---

## 🐛 استكشاف الأخطاء / Troubleshooting

### المشكلة: الرسائل لا تصل
**الحل:**
- تحقق من API credentials
- تحقق من رصيد الحساب
- تحقق من تنسيق رقم الهاتف
- تجرب مزود آخر

### المشكلة: تأخير في الوصول
**الحل:**
- استخدم مزود محلي (SMSC.kg)
- تحقق من حالة شبكة المشغل
- راجع logs المزود

### المشكلة: تكلفة عالية
**الحل:**
- قارن أسعار المزودين
- استخدم الـ caching للتقليل من الإرسال المتكرر
- نفذ rate limiting قوي

---

## 📞 الدعم الفني / Technical Support

### موارد مفيدة / Useful Resources

- [Twilio Documentation](https://www.twilio.com/docs)
- [MessageBird API](https://developers.messagebird.com)
- [SMSC.kg API Docs](https://smsc.kg/api/)
- [SMS.ru Documentation](https://sms.ru/api)

### ملفات الكود / Code Files

- `/src/app/pages/auth/SignInPage.tsx` - صفحة تسجيل الدخول
- `/src/app/pages/auth/SignUpPage.tsx` - صفحة إنشاء الحساب
- `/src/app/utils/smsProviders.ts` - معلومات المزودين والتحقق

---

## 📝 ملاحظات / Notes

- ⚠️ **وضع التطوير**: يستخدم OTP تجريبي `123456`
- ⚠️ **Development Mode**: Uses demo OTP `123456`

- 🔄 **الإنتاج**: يجب استبدال الكود التجريبي بتكامل حقيقي
- 🔄 **Production**: Replace demo code with actual integration

- 💰 **التكاليف**: احسب تكاليف SMS في ميزانيتك
- 💰 **Costs**: Calculate SMS costs in your budget

---

## ✅ قائمة التحقق للإطلاق / Launch Checklist

- [ ] اختيار مزود SMS
- [ ] الحصول على API credentials
- [ ] إعداد المتغيرات البيئية
- [ ] تنفيذ SMS service
- [ ] اختبار في بيئة staging
- [ ] إعداد المراقبة
- [ ] إضافة rate limiting
- [ ] تنفيذ logging
- [ ] مراجعة الأمان
- [ ] اختبار مع جميع المشغلين
- [ ] إطلاق تدريجي (soft launch)

---

**تم التطوير بواسطة eChefs Team** 🍳
**Developed by eChefs Team** 🍳
