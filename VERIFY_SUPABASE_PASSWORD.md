# Verify and Fix Supabase Password on Vercel

## Current Issue
Authentication is failing - the password in Vercel doesn't match Supabase's database password.

## Step-by-Step Fix

### Step 1: Get the ACTUAL Database Password from Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Open your project: `swnbqometoktlfyraeve`

2. **Navigate to Database Settings**
   - Click **Settings** (gear icon) in left sidebar
   - Click **Database**

3. **Check Database Password**
   - Scroll to **Database password** section
   - If you see your password, verify it matches `[SaudiArabia2030]`
   - If you don't remember or see it, click **Reset database password**
   - **Copy the new password** (you'll need it)

### Step 2: URL-Encode the Password

Once you have the password, URL-encode it:

**For password `[SaudiArabia2030]`:**
- `[` → `%5B`
- `]` → `%5D`
- Result: `%5BSaudiArabia2030%5D`

**For other passwords with special characters:**
- Use https://www.urlencoder.org/
- Or manually encode:
  - `!` → `%21`
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `[` → `%5B`
  - `]` → `%5D`

### Step 3: Build Connection Strings

**DATABASE_URL** (Connection Pooling - Port 6543):
```
postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**DIRECT_URL** (Direct Connection - Port 5432):
```
postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require
```

Replace `YOUR_URL_ENCODED_PASSWORD` with your URL-encoded password.

### Step 4: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click your **AmlakTech** project

2. **Go to Environment Variables**
   - **Settings** → **Environment Variables**

3. **Update DATABASE_URL**
   - Find `DATABASE_URL`
   - Click **Edit**
   - **Paste the connection string** (from Step 3)
   - Make sure:
     - No quotes around it
     - No spaces before/after
     - Password is URL-encoded correctly
   - **Select all environments**: Production, Preview, Development
   - Click **Save**

4. **Update DIRECT_URL** (if it exists)
   - Same steps as above
   - Use the DIRECT_URL connection string

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **three dots** (⋮) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 6: Test

1. Go to your Vercel URL: `https://your-app.vercel.app/signup`
2. Try creating an account
3. If it works → ✅ Success!
4. If it still fails → Check the password again

## Alternative: Get Connection String from Supabase

Supabase provides ready-made connection strings:

1. **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **Session mode** (for connection pooling)
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual password (URL-encoded)
6. Paste into Vercel `DATABASE_URL`

**Example from Supabase:**
```
postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Replace `[YOUR-PASSWORD]` with URL-encoded password (e.g., `%5BSaudiArabia2030%5D`)

## Troubleshooting

### Still Failing?

1. **Double-check password**
   - Make sure it's the **exact** password from Supabase
   - No typos or extra spaces

2. **Verify URL encoding**
   - Test your URL-encoded password:
   - `[SaudiArabia2030]` should become `%5BSaudiArabia2030%5D`
   - Use https://www.urlencoder.org/ to verify

3. **Test connection locally**
   - Make sure your local `.env` works
   - If local works, copy the exact connection string to Vercel

4. **Reset database password**
   - If you're unsure, reset it in Supabase
   - Update both local `.env` and Vercel with the new password

## Quick Test Script

To verify your connection string locally:

```bash
# In your terminal
node -e "console.log(process.env.DATABASE_URL)"
```

This shows what your local environment sees. Copy this exact value to Vercel (without quotes).

