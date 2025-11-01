# How to Get Your Supabase Database Connection String

## Important: You Need DATABASE_URL, Not API Keys

For Prisma to connect to your Supabase database, you need the **database connection string** (DATABASE_URL), not the Supabase API URL or API keys.

## What You Currently Have vs What You Need

### ❌ What you might have added (not correct for Prisma):
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```
These are for Supabase client libraries, not Prisma!

### ✅ What Prisma needs:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## How to Get Your DATABASE_URL from Supabase

### Step 1: Go to Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Click **Settings** (gear icon) in the left sidebar

### Step 2: Go to Database Settings
1. In Settings, click **Database**
2. Scroll down to find **Connection string** section

### Step 3: Get the Connection String
You'll see several connection string options. Use the **URI** format:

1. Find the section titled **Connection string**
2. Look for tabs: `URI`, `JDBC`, `Golang`, etc.
3. Click on the **URI** tab
4. You'll see a connection string like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```
   
   OR (older format):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 4: Replace the Password Placeholder

The connection string will have `[YOUR-PASSWORD]` as a placeholder.

**Example:**
If you see:
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

And your database password is `MyPassword123!`, replace `[YOUR-PASSWORD]`:
```
postgresql://postgres.abcdefgh:MyPassword123!@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

**Important:** If your password contains special characters, URL-encode them:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `*` → `%2A`
- `+` → `%2B`
- `=` → `%3D`

### Step 5: Add to .env File

In your `.env` file, add:
```env
DATABASE_URL="postgresql://postgres.abcdefgh:MyPassword123!@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**Make sure to:**
- Use quotes around the connection string
- Replace `[YOUR-PASSWORD]` with your actual password
- Keep the entire string on one line

## Alternative: Use Connection Pooling (Recommended)

For better performance with serverless functions (Vercel), use the **Connection pooling** string:

1. In Supabase Database settings
2. Look for **Connection pooling** section
3. Use the port `5432` connection string (transaction mode)
4. It will look similar but use `pooler.supabase.com`

## Example .env File Structure

Your `.env` file should contain:

```env
# Database Connection (Required for Prisma)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Optional: Supabase API (if you plan to use Supabase client library)
# NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Verify Your Connection String

After adding DATABASE_URL:

1. Test the connection:
   ```bash
   npx prisma db pull
   ```
   This will verify your connection string is correct.

2. If successful, generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Troubleshooting

### Error: "Can't reach database server"
- Check if your Supabase project is paused (free tier pauses after inactivity)
- Verify the project reference in the connection string
- Make sure password is correctly URL-encoded

### Error: "Authentication failed"
- Double-check your database password
- Make sure special characters are URL-encoded
- Try resetting your database password in Supabase if needed

### Can't find connection string
- Make sure you're in **Settings** → **Database** (not API settings)
- Look for "Connection string" section at the bottom
- If using newer Supabase UI, check both "URI" and "Connection pooling" tabs

## Need Help?

If you're still having trouble:
1. Go to Supabase Dashboard → Settings → Database
2. Look for "Connection string" or "Connection info" section
3. Copy the "URI" format connection string
4. Replace `[YOUR-PASSWORD]` with your actual password
5. Make sure it starts with `postgresql://`

