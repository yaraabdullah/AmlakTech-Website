# Environment Variables Setup Guide

## Where to Add Database Credentials

Add your database credentials in a file named `.env` in the **root directory** of your project (same level as `package.json`).

## Step 1: Create the .env File

1. In the root of your project (where `package.json` is located)
2. Create a new file named exactly `.env` (with the dot at the beginning)
3. **Important**: This file is already in `.gitignore`, so it won't be committed to git

## Step 2: Get Your Supabase Connection String

1. Go to your Supabase project dashboard: [supabase.com](https://supabase.com)
2. Click on your project
3. Go to **Settings** (gear icon) → **Database**
4. Scroll down to **Connection string** section
5. Select the **URI** tab
6. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
7. Or you can use the **Connection pooling** version (recommended for serverless/Vercel):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```

## Step 3: Replace the Password

The connection string will have `[YOUR-PASSWORD]` placeholder. Replace it with your actual database password:

**If your password is `MyPassword123!`:**
```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

**Becomes:**
```
postgresql://postgres.abcdefghijklmnop:MyPassword123!@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

**Note**: If your password contains special characters, you may need to URL-encode them:
- `!` becomes `%21`
- `@` becomes `%40`
- `#` becomes `%23`
- etc.

## Step 4: Add to .env File

Create `.env` in your project root and add:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MyPassword123!@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## Step 5: Verify the Setup

After adding the `.env` file:

1. Make sure the file is in the project root (same directory as `package.json`)
2. Restart your development server if it's running:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## For Vercel Deployment

If deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environments**: Production, Preview, Development (check all)
4. Redeploy your application

## Security Notes

- ✅ `.env` is already in `.gitignore` - your credentials are safe
- ✅ Never commit `.env` file to git
- ✅ Never share your connection string publicly
- ✅ Use environment variables in Vercel for production

## Troubleshooting

### Connection Error
- Make sure the password is correct
- Check if special characters are URL-encoded
- Verify the project reference is correct
- Make sure your Supabase project is not paused

### Can't Find Connection String
- Make sure you're in the Database settings, not API settings
- Look for "Connection string" section at the bottom
- Use the "URI" format, not "JDBC" or other formats

### Still Having Issues?
- Try the "Connection pooling" version for better compatibility
- Check Supabase project status (should be active)
- Verify network/firewall isn't blocking connections

