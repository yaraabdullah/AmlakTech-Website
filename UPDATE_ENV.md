# Quick Fix: Add DATABASE_URL to .env

## Current Issue
Your .env file has the Supabase project URL, but Prisma needs the **database connection string**.

## What to Add

Open your `.env` file and add this line:

```env
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**Replace `[YOUR-PASSWORD]` with your actual Supabase database password.**

## How to Get Your Database Password

1. Go to Supabase Dashboard → Your Project
2. Settings → Database
3. Scroll down to **Connection string** section
4. Select **URI** tab
5. Copy the connection string
6. It will look like:
   ```
   postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual password

## Example .env File

Your `.env` should contain:

```env
# Supabase Project URL (optional - for Supabase client)
SUPABASE_URL=https://swnbqometoktlfyraeve.supabase.co

# Database Connection String (REQUIRED for Prisma)
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## Important Notes

1. **Password Encoding**: If your password has special characters (!, @, #, etc.), URL-encode them:
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`

2. **Quotes**: Make sure the DATABASE_URL is in quotes

3. **No Spaces**: Keep everything on one line

## Test Your Connection

After adding DATABASE_URL, test it:

```bash
npx prisma db pull
```

If this works, your connection string is correct!

