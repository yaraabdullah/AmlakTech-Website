# Fix Local Database Connection

## Issue
Authentication is failing locally - your `.env` password doesn't match Supabase's database password.

## Solution: Update Your Local .env File

### Step 1: Get Your Actual Database Password from Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Check Database Password**
   - **Settings** → **Database** → Scroll to **Database password**
   - If you see your password, verify it
   - **OR** click **Reset database password** to create a new one
   - **Copy the password** (you'll need it)

### Step 2: URL-Encode the Password

Your password needs to be URL-encoded in the connection string.

**Example:**
- If password is: `[SaudiArabia2030]`
- URL-encoded: `%5BSaudiArabia2030%5D`

**Use this tool**: https://www.urlencoder.org/

Or manually:
- `[` → `%5B`
- `]` → `%5D`
- `@` → `%40`
- `#` → `%23`
- etc.

### Step 3: Update Your .env File

Replace the password in your `.env` file:

**DATABASE_URL:**
```
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

**DIRECT_URL:**
```
DIRECT_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
```

Replace `YOUR_URL_ENCODED_PASSWORD` with your actual URL-encoded password.

### Step 4: Test the Connection

After updating `.env`:
```bash
node test-connection.js
```

If successful, you'll see:
```
✅ Connection successful!
✅ Found X user(s) in the database
🎉 All tests passed!
```

### Step 5: Copy to Vercel

Once local connection works:
1. Copy the exact `DATABASE_URL` value from your `.env` file
2. Paste it into Vercel Environment Variables
3. Redeploy

## Quick Example

If your Supabase password is `MyPass123!`:
- URL-encoded: `MyPass123%21`
- Connection string:
  ```
  postgresql://postgres.swnbqometoktlfyraeve:MyPass123%21@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
  ```

## Alternative: Use Supabase Connection String

1. **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Connection string** → Select **Session mode**
3. Copy the **URI** connection string
4. Replace `[YOUR-PASSWORD]` with your actual password (URL-encoded)
5. Paste into your `.env` file

This ensures you're using the exact format Supabase expects!

