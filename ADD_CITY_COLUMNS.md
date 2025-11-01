# Add City, Neighborhood, and Postal Code Columns to Supabase

## What You Need to Do

Your Prisma schema now includes `city`, `neighborhood`, and `postal_code` fields, but these columns need to be added to your Supabase `users` table.

## Step 1: Add Columns to Supabase Table

### Option A: Using Supabase SQL Editor (Recommended)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor** in the left sidebar

2. **Run This SQL Query:**
   ```sql
   ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS city VARCHAR(100),
   ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100),
   ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
   ```

3. **Click "Run"** to execute the query

### Option B: Using Supabase Table Editor

1. **Go to Supabase Dashboard** → **Table Editor**
2. Click on the **users** table
3. Click **Add Column** (or the + icon)
4. Add each column:
   - **Column 1:**
     - Name: `city`
     - Type: `varchar`
     - Length: `100`
     - Nullable: ✅ (checked)
   - **Column 2:**
     - Name: `neighborhood`
     - Type: `varchar`
     - Length: `100`
     - Nullable: ✅ (checked)
   - **Column 3:**
     - Name: `postal_code`
     - Type: `varchar`
     - Length: `20`
     - Nullable: ✅ (checked)
5. Click **Save** for each column

## Step 2: Verify Columns Were Added

Run this query in SQL Editor to verify:
```sql
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('city', 'neighborhood', 'postal_code');
```

You should see all three columns listed.

## Step 3: Test the Signup Form

After adding the columns:

1. Go to your signup form: `http://localhost:3000/signup`
2. Fill in all fields including:
   - City (المدينة)
   - Neighborhood (الحي)
   - Postal Code (الرمز البريدي)
3. Submit the form
4. Check Supabase Table Editor → `users` table
5. Verify that the new user has `city`, `neighborhood`, and `postal_code` values

## Complete SQL Script

If you prefer to run everything at once:

```sql
-- Add city, neighborhood, and postal_code columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Verify the columns were added
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('city', 'neighborhood', 'postal_code');
```

## What's Already Done ✅

- ✅ Prisma schema updated with new fields
- ✅ Signup API updated to save city, neighborhood, postal_code
- ✅ Signup form sends these fields
- ✅ User update API supports these fields
- ✅ User fetch API returns these fields
- ✅ Build successful

## Next Steps

1. **Add columns to Supabase** (use SQL script above)
2. **Test signup form** locally
3. **Deploy to Vercel** - the columns will be used automatically once added to Supabase

After adding the columns in Supabase, everything will work! 🎉

