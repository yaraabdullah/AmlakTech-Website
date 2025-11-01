# Setup Properties Table in Supabase

## ✅ What's Already Done

- ✅ Prisma schema has Property model
- ✅ API route `/api/properties` created and working
- ✅ AddProperty form component updated with error handling
- ✅ Form validation added
- ✅ Success/Error messages added
- ✅ Loading state added

## 📋 Next Step: Create Table in Supabase

You need to create the `properties` table in your Supabase database.

### Method 1: Run SQL Script (Recommended)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor** in the left sidebar

2. **Copy and Run This SQL:**

```sql
-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  area DOUBLE PRECISION,
  rooms VARCHAR(50),
  bathrooms VARCHAR(50),
  construction_year VARCHAR(10),
  status VARCHAR(50) DEFAULT 'متاح',
  description TEXT,
  images TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
```

3. **Click "Run"** to execute

4. **Verify Table Created:**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
```

You should see all columns listed.

### Method 2: Use Supabase Table Editor

1. Go to **Table Editor** → **New Table**
2. Name: `properties`
3. Add columns one by one:
   - `id` (text, primary key)
   - `owner_id` (bigint, foreign key to users.id)
   - `name` (varchar 255)
   - `type` (varchar 50)
   - `address` (varchar 500)
   - `city` (varchar 100)
   - `area` (double precision, nullable)
   - `rooms` (varchar 50, nullable)
   - `bathrooms` (varchar 50, nullable)
   - `construction_year` (varchar 10, nullable)
   - `status` (varchar 50, default: 'متاح')
   - `description` (text, nullable)
   - `images` (text, nullable)
   - `created_at` (timestamp with time zone, default: NOW())
   - `updated_at` (timestamp with time zone, default: NOW())

## ✅ After Creating Table

1. **Test the form:**
   - Go to `/owner/add-property`
   - Fill in all 4 steps
   - Submit the form
   - Should save to database successfully

2. **Verify in Supabase:**
   - Go to Table Editor → `properties`
   - You should see the new property

3. **Check the dashboard:**
   - Go to `/owner/dashboard`
   - The property count should increase
   - Properties should appear in the list

## 📝 Form Fields Saved

The form saves:
- ✅ Property type (شقة، منزل، فيلا، etc.)
- ✅ Rooms, Bathrooms, Area, Construction Year
- ✅ Street Name, Unit Number, City, Postal Code
- ✅ Description
- ✅ Images (as JSON string)
- ✅ Status (defaults to "متاح")

The form is now fully functional! 🎉

