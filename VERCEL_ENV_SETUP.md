# Add Environment Variables to Vercel

## The Error
Vercel can't find `DATABASE_URL` because environment variables from your `.env` file are **not automatically deployed** to Vercel for security reasons.

## Solution: Add Environment Variables in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your **AmlakTech** project

### Step 2: Navigate to Environment Variables
1. Click **Settings** (in the top navigation)
2. Click **Environment Variables** (in the left sidebar)

### Step 3: Add DATABASE_URL
1. Click **Add New**
2. **Name**: `DATABASE_URL`
3. **Value**: Copy from your `.env` file:
   ```
   postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
   ```
   ⚠️ **Important**: Replace `%5BSaudiArabia2030%5D` with your actual URL-encoded password
4. **Environments**: Check all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### Step 4: Add DIRECT_URL (Optional but Recommended)
1. Click **Add New** again
2. **Name**: `DIRECT_URL`
3. **Value**: Copy from your `.env` file:
   ```
   postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require
   ```
   ⚠️ **Important**: Replace `%5BSaudiArabia2030%5D` with your actual URL-encoded password
4. **Environments**: Check all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### Step 5: Redeploy
After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **three dots** (⋮) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

## Important Notes

### 🔒 Security
- Your `.env` file is in `.gitignore` (correct!)
- Environment variables in Vercel are **encrypted** and secure
- Never commit `.env` files to Git

### 🔑 Password URL Encoding
If your password contains special characters, make sure they're URL-encoded:
- `[` → `%5B`
- `]` → `%5D`
- `@` → `%40`
- etc.

### ✅ Verify
After redeploying, test the signup form:
- Go to `https://your-vercel-url.vercel.app/signup`
- Try creating an account
- If it works, the environment variables are set correctly!

## Troubleshooting

### Still Getting "DATABASE_URL not found"?
1. Make sure you added it to **all environments** (Production, Preview, Development)
2. **Redeploy** after adding variables
3. Check that the variable name is exactly `DATABASE_URL` (case-sensitive)

### Connection Errors?
1. Verify your password is URL-encoded correctly
2. Make sure both `DATABASE_URL` and `DIRECT_URL` are added
3. Check your Supabase database is running and accessible

