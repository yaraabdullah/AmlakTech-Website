# Fix Authentication Error on Vercel

## Current Issue
Authentication is failing - the password in your Vercel environment variable is likely incorrect or not URL-encoded properly.

## Solution Steps

### Step 1: Verify Your Local Connection String

Run this in your terminal to see your exact connection string:
```bash
Get-Content .env | Select-String "DATABASE_URL"
```

### Step 2: Check Password URL Encoding

Your password `[SaudiArabia2030]` needs to be URL-encoded:
- `[` → `%5B`
- `]` → `%5D`

**Correct format**: `%5BSaudiArabia2030%5D`

### Step 3: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click **Edit**
4. **Update the Value** with the exact connection string from your `.env` file
5. Make sure the password is URL-encoded correctly
6. **Save**

### Step 4: Verify Connection String Format

Your `DATABASE_URL` should look like:
```
postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Important parts:**
- Username: `postgres.swnbqometoktlfyraeve`
- Password: `%5BSaudiArabia2030%5D` (URL-encoded)
- Host: `aws-1-ap-southeast-2.pooler.supabase.com`
- Port: `6543`
- Database: `postgres`
- Parameters: `?pgbouncer=true&sslmode=require`

### Step 5: Redeploy

After updating:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete
4. Test the signup form

## Alternative: Verify Database Password in Supabase

If authentication still fails:

1. **Go to Supabase Dashboard**
   - Settings → Database → Database password
2. **Reset or verify your password**
   - Click "Reset database password" if needed
   - **Copy the new password**
3. **URL-encode special characters**
   - Use an online URL encoder: https://www.urlencoder.org/
   - Or manually encode:
     - `[` → `%5B`
     - `]` → `%5D`
     - `@` → `%40`
     - `#` → `%23`
     - etc.
4. **Update Vercel** with the new password (URL-encoded)

## Quick Test

To verify your connection string is correct, you can temporarily test it locally:
```bash
node -e "console.log(process.env.DATABASE_URL)" 
```

This will show what Vercel sees (if you set it locally).

## Common Mistakes

❌ **Wrong**: Using password with `[` and `]` directly
```
postgresql://...:[SaudiArabia2030]@...
```

✅ **Correct**: Using URL-encoded password
```
postgresql://...:%5BSaudiArabia2030%5D@...
```

❌ **Wrong**: Missing `&sslmode=require`
✅ **Correct**: Include `&sslmode=require` for SSL

