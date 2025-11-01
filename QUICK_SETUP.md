# Quick Setup: Connect to Your Supabase Users Table

## ✅ What You've Done
- Created users table in Supabase ✓
- Added Supabase credentials to .env ✓

## ❌ What's Missing
Your `.env` file needs `DATABASE_URL` (PostgreSQL connection string), not just the Supabase project URL.

## 🔧 Fix Your .env File

### Current .env might have:
```env
SUPABASE_URL=https://swnbqometoktlfyraeve.supabase.co
SUPABASE_ANON_KEY=your-api-key
```

### You need to ADD this:
```env
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## 📝 Steps to Get DATABASE_URL

1. **Go to Supabase Dashboard**
   - Open your project: https://supabase.com/dashboard/project/swnbqometoktlfyraeve

2. **Get Database Connection String**
   - Click **Settings** (gear icon) in left sidebar
   - Click **Database**
   - Scroll to **Connection string** section
   - Select **URI** tab
   - You'll see: `postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@...`
   - **Copy this entire string**

3. **Replace [YOUR-PASSWORD]**
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - This is the password you set when creating the Supabase project

4. **Add to .env**
   ```env
   # Keep your existing Supabase URL/API key if needed
   SUPABASE_URL=https://swnbqometoktlfyraeve.supabase.co
   SUPABASE_ANON_KEY=your-api-key

   # ADD THIS - Required for Prisma
   DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
   ```

## 🎯 Your Complete .env File Should Look Like:

```env
# Supabase Project Info (optional - for Supabase client library)
SUPABASE_URL=https://swnbqometoktlfyraeve.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection (REQUIRED for Prisma)
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YourPassword123!@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## ⚠️ Important Notes

1. **Password Encoding**: If your password has special characters (!, @, #, etc.), URL-encode them:
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`

2. **Quotes**: Keep quotes around the DATABASE_URL

3. **Connection Pooling**: Use the `pooler.supabase.com` version (port 5432) for better compatibility with Vercel/serverless

## 🧪 Test Your Connection

After adding DATABASE_URL:

```bash
# This will pull your table structure from Supabase
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Test connection
npx prisma studio
```

If `db pull` works, your connection is correct! ✅

## 📊 Your Table Structure is Already Perfect

Your Supabase users table structure matches perfectly:
- ✅ `id` as BIGSERIAL
- ✅ `first_name`, `last_name` 
- ✅ `email`, `phone_number`, `national_id` (unique)
- ✅ `password_hash`
- ✅ `user_type` with CHECK constraint
- ✅ All other fields

The Prisma schema is already configured to match your table!

