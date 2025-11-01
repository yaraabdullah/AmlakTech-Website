# Property Table Update

## ✅ Issues Fixed

### 1. Table Name Mapping
**Problem:** Prisma was looking for `Property` (PascalCase) but the table is `properties` (lowercase)

**Solution:** Added `@@map("properties")` to Prisma schema to map model name to table name

```prisma
model Property {
  ...
  @@map("properties")  // Maps Property model → properties table
}
```

### 2. Missing Form Fields
**Problem:** Not all form fields were being saved to the database

**Solution:** Added all form fields to:
- Prisma schema (`prisma/schema.prisma`)
- SQL table script (`CREATE_PROPERTIES_TABLE.sql`)
- API endpoint (`pages/api/properties/index.ts`)
- Form component (`components/AddProperty.tsx`)

## 📋 All Fields Now Included

### Basic Details
- ✅ `name` - Property name
- ✅ `type` - Property type (شقة، منزل، فيلا، مكتب، متجر، أرض)
- ✅ `area` - Area in square meters
- ✅ `rooms` - Number of rooms
- ✅ `bathrooms` - Number of bathrooms
- ✅ `constructionYear` - Year of construction
- ✅ `description` - Property description
- ✅ `images` - JSON array of image URLs

### Location Details
- ✅ `address` - Street address
- ✅ `city` - City name
- ✅ `unitNumber` - Unit number
- ✅ `postalCode` - Postal code
- ✅ `country` - Country (default: المملكة العربية السعودية)

### Property Subtype
- ✅ `propertySubType` - Subtype (e.g., استوديو for apartments)

### Features
- ✅ `features` - JSON object containing:
  - parking (موقف سيارات)
  - garden (حديقة)
  - balcony (شرفة)
  - pool (مسبح)
  - elevator (مصعد)
  - gym (صالة رياضية)
  - security (24 ساعة أمن)
  - wifi (واي فاي)
  - ac (تكييف)
  - jacuzzi (جاكوزي)

### Pricing
- ✅ `monthlyRent` - Monthly rent amount
- ✅ `insurance` - Insurance amount
- ✅ `availableFrom` - Available from date
- ✅ `minRentalPeriod` - Minimum rental period
- ✅ `publicDisplay` - Whether to display publicly

### Payment System
- ✅ `paymentEmail` - Payment email
- ✅ `supportPhone` - Support phone number
- ✅ `paymentAccount` - Payment account type (PayPal, Stripe, محلي)

### Status & Timestamps
- ✅ `status` - Property status (متاح، مؤجر، صيانة)
- ✅ `createdAt` - Creation timestamp
- ✅ `updatedAt` - Last update timestamp

## 🚀 Next Steps

### 1. Update Supabase Table

Run the updated SQL script in Supabase SQL Editor:

```sql
-- File: CREATE_PROPERTIES_TABLE.sql
```

This will:
- Create the table if it doesn't exist
- Add all missing columns if the table exists
- Create necessary indexes

**Note:** If the table already exists, you may need to add the missing columns manually:

```sql
-- Add missing columns (if table exists)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS unit_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'المملكة العربية السعودية',
  ADD COLUMN IF NOT EXISTS property_sub_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS features TEXT,
  ADD COLUMN IF NOT EXISTS monthly_rent DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS insurance DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS available_from TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS min_rental_period VARCHAR(50),
  ADD COLUMN IF NOT EXISTS public_display BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS support_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payment_account VARCHAR(100);
```

### 2. Test Property Creation

1. Log in as an owner
2. Go to `/owner/add-property`
3. Fill in all form fields
4. Submit the form
5. All fields should now be saved to the database!

## 📝 Database Schema

The Property model now maps to the `properties` table with snake_case column names:

```
Property (model) → properties (table)
- unitNumber → unit_number
- postalCode → postal_code
- propertySubType → property_sub_type
- monthlyRent → monthly_rent
- availableFrom → available_from
- minRentalPeriod → min_rental_period
- publicDisplay → public_display
- paymentEmail → payment_email
- supportPhone → support_phone
- paymentAccount → payment_account
- createdAt → created_at
- updatedAt → updated_at
```

## ✅ Verification

After updating the table, test that:
1. ✅ Table name is `properties` (lowercase)
2. ✅ All columns exist
3. ✅ Property creation works
4. ✅ All form fields are saved correctly

