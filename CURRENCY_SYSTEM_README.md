# نظام العملة المركزي - eChefs Platform

## نظرة عامة

تم تطوير نظام مركزي شامل لإدارة العملة في منصة eChefs، يضمن تحديث جميع الصفحات تلقائياً عند تغيير العملة من لوحة الإدارة. النظام يدعم عملتين منفصلتين:
1. **عملة الولاء (Loyalty Currency)**: العملة المستخدمة في برنامج الولاء
2. **عملة المتجر (Store Currency)**: العملة الرئيسية للمنصة

## الملفات الأساسية

### 1. Hooks المخصصة (`/src/app/hooks/useCurrency.ts`)

يوفر هذا الملف مجموعة من الـhooks لإدارة العملة بشكل ديناميكي:

```typescript
import { useLoyaltyCurrency, useEarningRate, useStoreCurrency } from '../hooks/useCurrency';

// استخدام عملة الولاء
const currency = useLoyaltyCurrency();
// returns: { code: 'KGS', symbol: 'с', name: 'KGS' }

// استخدام معدل الكسب
const earningRate = useEarningRate();
// returns: 100 (100 KGS = 1 point)

// استخدام عملة المتجر
const storeCurrency = useStoreCurrency();
// returns: { code: 'USD', symbol: '$', name: 'USD' }
```

#### Hooks المتوفرة:

- **`useLoyaltyCurrency()`**: يرجع معلومات العملة الحالية لبرنامج الولاء
- **`useEarningRate()`**: يرجع معدل الكسب الحالي (المبلغ المطلوب لكسب نقطة واحدة)
- **`useStoreCurrency()`**: يرجع معلومات العملة الرئيسية للمتجر
- **`getAllCurrencies()`**: يرجع قائمة بجميع العملات المدعومة

### 2. دوال التنسيق (`/src/app/utils/currency.ts`)

مجموعة من الدوال المساعدة لتنسيق وحساب العملات:

```typescript
import {
  formatLoyaltyCurrency,
  calculatePointsEarned,
  getLoyaltyCurrencySymbol
} from '../utils/currency';

// تنسيق عملة الولاء
const formatted = formatLoyaltyCurrency(1500);
// returns: "1,500 с"

// حساب النقاط المكتسبة
const points = calculatePointsEarned(5000);
// returns: 50 (if earning rate is 100 KGS = 1 point)

// الحصول على رمز العملة
const symbol = getLoyaltyCurrencySymbol();
// returns: "с"
```

#### الدوال المتوفرة:

##### `formatLoyaltyCurrency(amount, options?)`
تنسق المبلغ بناءً على إعدادات عملة الولاء.

**المعاملات:**
- `amount: number` - المبلغ المراد تنسيقه
- `options?: { showSymbol?: boolean; decimals?: number }` - خيارات التنسيق

**مثال:**
```typescript
formatLoyaltyCurrency(1234.56) // "1,235 с"
formatLoyaltyCurrency(1234.56, { decimals: 2 }) // "1,234.56 с"
formatLoyaltyCurrency(1234.56, { showSymbol: false }) // "1,235"
```

##### `formatStoreCurrency(amount, options?)`
تنسق المبلغ بناءً على العملة الرئيسية للمتجر.

##### `calculatePointsEarned(amount)`
تحسب عدد النقاط المكتسبة من مبلغ معين.

**مثال:**
```typescript
// If earning rate is 100 KGS = 1 point
calculatePointsEarned(5000) // returns: 50
```

##### `calculateAmountForPoints(points)`
تحسب المبلغ المطلوب للحصول على عدد معين من النقاط.

##### `getLoyaltyCurrencySymbol()`
ترجع رمز عملة الولاء الحالية.

##### `getLoyaltyCurrencyCode()`
ترجع كود عملة الولاء الحالية (مثل 'KGS', 'USD').

##### `getEarningRate()`
ترجع معدل الكسب الحالي.

##### `formatCurrency(amount, symbol, position, decimals)`
دالة عامة لتنسيق العملات بشكل مخصص.

## العملات المدعومة

يدعم النظام 8 عملات مختلفة:

| الكود | الاسم | الرمز | العلم |
|------|------|------|------|
| KGS | Kyrgyzstan Som | с | 🇰🇬 |
| USD | US Dollar | $ | 🇺🇸 |
| RUB | Russian Ruble | ₽ | 🇷🇺 |
| EUR | Euro | € | 🇪🇺 |
| GBP | British Pound | £ | 🇬🇧 |
| TRY | Turkish Lira | ₺ | 🇹🇷 |
| KZT | Kazakhstan Tenge | ₸ | 🇰🇿 |
| UZS | Uzbekistan Som | soʻm | 🇺🇿 |

## التكامل في الصفحات

### مثال 1: صفحة دليل المكافآت (`RewardsGuidePage.tsx`)

```typescript
import { useLoyaltyCurrency, useEarningRate } from '../hooks/useCurrency';

export function RewardsGuidePage() {
  // استخدام الـhooks
  const currency = useLoyaltyCurrency();
  const amountPerPoint = useEarningRate();
  const currencySymbol = currency.symbol;

  // استخدام القيم في الترجمات
  const translations = {
    en: {
      earnRateDesc: `Earn 1 point for every ${amountPerPoint} ${currencySymbol} you spend`,
    },
    ar: {
      earnRateDesc: `اكسب نقطة واحدة لكل ${amountPerPoint} ${currencySymbol} تنفقها`,
    },
  };

  // ...
}
```

### مثال 2: صفحة السلة (`CartPage.tsx`)

```typescript
import { useLoyaltyCurrency } from '../hooks/useCurrency';
import { calculatePointsEarned } from '../utils/currency';

export function CartPage() {
  // حساب النقاط المكتسبة
  const currency = useLoyaltyCurrency();
  const pointsToEarn = calculatePointsEarned(cartSubtotal);

  return (
    <Card className=\"p-5\">
      <h3>You'll earn</h3>
      <p>
        <span className=\"font-bold\">{pointsToEarn}</span> loyalty points
      </p>
    </Card>
  );
}
```

## صفحة إعدادات الولاء

توجد صفحة إدارة مخصصة في `/src/app/pages/admin/AdminLoyaltySettings.tsx` تسمح للمدير بتغيير:

1. **العملة المستخدمة في برنامج الولاء**: اختيار من بين 8 عملات مدعومة
2. **معدل كسب النقاط**: تحديد المبلغ المطلوب لكسب نقطة واحدة

### كيفية الوصول:
Control Panel → Loyalty Settings (or `/control-panel/loyalty-settings`)

### الميزات:
- اختيار العملة بواجهة مرئية تفاعلية
- إعدادات سريعة مسبقة (Quick Presets) لكل عملة
- معاينة فورية لحساب النقاط
- حفظ الإعدادات مع تأكيد مرئي

## آلية التحديث التلقائي

يستخدم النظام polling كل 500ms للتحقق من التغييرات في الإعدادات:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const settings = db.getSettings();
    const newCurrency = {
      code: settings.loyalty.currency,
      symbol: settings.loyalty.currencySymbol,
      name: settings.loyalty.currency,
    };
    
    if (newCurrency.code !== currency.code) {
      setCurrency(newCurrency);
    }
  }, 500);

  return () => clearInterval(interval);
}, [currency]);
```

هذا يضمن أن جميع المكونات التي تستخدم `useLoyaltyCurrency()` أو `useEarningRate()` ستتحدث تلقائياً عند تغيير الإعدادات.

## الصفحات المحدثة

تم تحديث الصفحات التالية لاستخدام النظام المركزي:

1. ✅ **RewardsGuidePage** (`/src/app/pages/RewardsGuidePage.tsx`)
   - يعرض معلومات ديناميكية عن معدل الكسب
   - يدعم جميع اللغات الأربع مع العملة المختارة

2. ✅ **CartPage** (`/src/app/pages/CartPage.tsx`)
   - يحسب النقاط المكتسبة بشكل ديناميكي
   - يعرض النقاط بناءً على العملة الحالية

3. ✅ **AdminLoyaltySettings** (`/src/app/pages/admin/AdminLoyaltySettings.tsx`)
   - صفحة الإدارة الرئيسية لتغيير العملة ومعدل الكسب

## الصفحات التي يمكن تحديثها لاحقاً

للتكامل الكامل، يمكن تحديث الصفحات التالية:

- **EnhancedProfilePage**: عرض النقاط ورصيد الولاء
- **LoyaltyPage**: عرض المكافآت وتكلفتها بالنقاط
- **CheckoutPage**: عرض النقاط التي سيتم كسبها
- **OrderHistoryPage**: عرض النقاط المكتسبة من كل طلب

## أفضل الممارسات

### 1. استخدم الـHooks دائماً
```typescript
// ✅ صحيح
const currency = useLoyaltyCurrency();

// ❌ خطأ
const settings = db.getSettings();
const currency = settings.loyalty.currency;
```

### 2. استخدم دوال التنسيق للعرض
```typescript
// ✅ صحيح
const formatted = formatLoyaltyCurrency(amount);

// ❌ خطأ
const formatted = `${amount} ${currency.symbol}`;
```

### 3. استخدم دوال الحساب للنقاط
```typescript
// ✅ صحيح
const points = calculatePointsEarned(amount);

// ❌ خطأ
const points = Math.floor(amount / earningRate);
```

## الدعم متعدد اللغات

النظام يدعم 4 لغات بشكل كامل:
- 🇬🇧 الإنجليزية (English)
- 🇸🇦 العربية (Arabic) - مع دعم RTL
- 🇷🇺 الروسية (Russian)
- 🇰🇬 القيرغيزية (Kyrgyz)

جميع النصوص والرموز تتكيف تلقائياً مع العملة المختارة في كل لغة.

## الخلاصة

النظام المركزي للعملة يوفر:
- ✅ تحديث تلقائي عبر جميع الصفحات
- ✅ دعم 8 عملات مختلفة
- ✅ دوال تنسيق وحساب موحدة
- ✅ واجهة إدارة سهلة الاستخدام
- ✅ دعم كامل للغات الأربع
- ✅ فصل واضح بين عملة الولاء وعملة المتجر
- ✅ أداء محسّن مع polling ذكي

التغيير من صفحة الإعدادات سينعكس فوراً على جميع الصفحات التي تعرض العملة أو تحسب النقاط.
