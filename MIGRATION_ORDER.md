# ترتيب تشغيل Migration Scripts

## ترتيب إنشاء الجداول

يجب تشغيل Migration Scripts بالترتيب التالي لأن بعض الجداول تعتمد على جداول أخرى:

### 1. جدول Users (users)
**يجب أن يكون موجوداً بالفعل** - هذا الجدول الأساسي في Supabase

### 2. جدول Properties (properties)
**يجب أن يكون موجوداً بالفعل** - راجع `CREATE_PROPERTIES_TABLE.sql`

### 3. جدول Contracts (contracts)
**يجب إنشاؤه أولاً قبل جدول Tenants**

```sql
-- قم بتشغيل: prisma/migrations/create_contracts_table.sql
```

هذا الجدول يعتمد على:
- `properties` (property_id)
- `users` (owner_id)

### 4. جدول Tenants (tenants)
**يجب إنشاؤه بعد جدول Contracts**

```sql
-- قم بتشغيل: prisma/migrations/create_tenants_table.sql
```

هذا الجدول يعتمد على:
- `users` (user_id - اختياري)

**ملاحظة:** بعد إنشاء جدول tenants، سيتم إضافة foreign key من contracts إلى tenants تلقائياً.

### 5. جدول Payments (payments)
**يجب إنشاؤه بعد جدول Contracts**

```sql
-- قم بتشغيل: prisma/migrations/create_payments_table.sql
```

هذا الجدول يعتمد على:
- `contracts` (contract_id - اختياري)
- `users` (owner_id)

### 6. جدول Maintenance Requests (maintenance_requests)
**يجب إنشاؤه بعد جدول Properties**

```sql
-- قم بتشغيل: prisma/migrations/create_maintenance_requests_table.sql
```

هذا الجدول يعتمد على:
- `properties` (property_id)
- `users` (owner_id)

## الطريقة السريعة (كل شيء معاً)

إذا كنت تريد تشغيل كل شيء دفعة واحدة، استخدم:

```sql
-- قم بتشغيل: prisma/migrations/create_all_tables_complete.sql
```

هذا الملف يحتوي على جميع الجداول بالترتيب الصحيح.

## التحقق من الجداول

بعد تشغيل جميع الـ migrations، يمكنك التحقق من أن الجداول تم إنشاؤها بشكل صحيح:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('contracts', 'tenants', 'payments', 'maintenance_requests')
ORDER BY table_name;
```

## ملاحظات مهمة

1. **جدول Units**: إذا كان موجوداً، سيتم ربطه تلقائياً بجدول contracts
2. **Backward Compatibility**: جدول contracts يحتفظ بالحقول القديمة (tenant_name, tenant_email, tenant_phone) للتوافق مع البيانات الموجودة
3. **Foreign Keys**: جميع الـ foreign keys تستخدم `ON DELETE CASCADE` أو `ON DELETE SET NULL` حسب المنطق
