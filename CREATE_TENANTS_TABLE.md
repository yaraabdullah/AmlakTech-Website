# إنشاء جدول المستأجرين (Tenants Table)

## نظرة عامة

تم إنشاء جدول `tenants` لإدارة بيانات المستأجرين. يدعم الجدول حالتين:

1. **المستأجر لديه حساب (User Account)**: عندما يكون `user_id` محدداً، يتم ربط المستأجر بحساب المستخدم في جدول `users`
2. **المستأجر بدون حساب**: عندما يكون `user_id` فارغاً، يتم حفظ بيانات المستأجر فقط في جدول `tenants`

## طريقة العمل

### الحالة 1: المستأجر لديه حساب (Tenant with User Account)
- المستأجر يسجل حساب في النظام كـ `user_type = 'tenant'`
- عند إنشاء عقد إيجار، يتم البحث عن Tenant بالربط مع User ID
- إذا لم يكن موجوداً، يتم إنشاء Tenant جديد وربطه بـ User ID

### الحالة 2: مالك العقار يضيف مستأجر (Owner adds Tenant)
- المالك يضيف مستأجر من صفحة "إضافة مستأجر"
- يتم إنشاء Tenant بدون `user_id` (NULL)
- يتم إنشاء عقد إيجار وربطه بـ Tenant ID

## إجراءات التطبيق

### 1. تشغيل Migration Script

```sql
-- قم بتشغيل هذا الملف على Supabase SQL Editor
-- الملف موجود في: prisma/migrations/create_tenants_table.sql
```

أو قم بتشغيله يدوياً في Supabase Dashboard:
1. اذهب إلى Supabase Dashboard
2. افتح SQL Editor
3. الصق محتوى الملف `create_tenants_table.sql`
4. قم بتشغيله

### 2. تشغيل Prisma Migration (اختياري)

```bash
npx prisma migrate dev --name create_tenants_table
```

أو:

```bash
npx prisma db push
```

## هيكل الجدول

### جدول tenants

- `id`: معرف فريد للمستأجر (String/CUID)
- `user_id`: معرف المستخدم (اختياري، BigInt) - NULL إذا لم يكن لديه حساب
- `first_name`: الاسم الأول (مطلوب)
- `last_name`: الاسم الأخير (مطلوب)
- `email`: البريد الإلكتروني (اختياري، فريد)
- `phone_number`: رقم الجوال (مطلوب، فريد)
- `national_id`: رقم الهوية الوطنية (اختياري، فريد)
- `city`: المدينة (اختياري)
- `address`: العنوان (اختياري)
- `emergency_contact`: جهة الاتصال في حالات الطوارئ (اختياري)
- `emergency_phone`: رقم هاتف الطوارئ (اختياري)
- `status`: الحالة (افتراضي: 'نشط')
- `notes`: ملاحظات (اختياري)

### تحديثات جدول contracts

- إضافة `tenant_id`: معرف المستأجر (اختياري، String)
- الحقول القديمة `tenant_name`, `tenant_email`, `tenant_phone` لا تزال موجودة للتوافق مع الإصدارات السابقة

## API Endpoints

### GET /api/tenants?phoneNumber=...
البحث عن مستأجر برقم الجوال

### GET /api/tenants?email=...
البحث عن مستأجر بالبريد الإلكتروني

### GET /api/tenants?nationalId=...
البحث عن مستأجر برقم الهوية الوطنية

### POST /api/tenants
إنشاء مستأجر جديد أو تحديث مستأجر موجود (إذا كان موجوداً برقم الجوال)

## المميزات

✅ دعم المستأجرين مع حسابات وبدون حسابات
✅ تجنب التكرار - إذا كان المستأجر موجوداً برقم الجوال، يتم استخدامه
✅ ربط العقد بالمستأجر بشكل صحيح
✅ دعم التوافق مع الإصدارات السابقة
