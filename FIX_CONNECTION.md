# Fix Database Connection

## Current Issue
Authentication is failing for both DATABASE_URL and DIRECT_URL.

## Solution

The connection strings need to match **exactly** what Supabase provides. Here's how to fix it:

### Step 1: Get the Correct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection string**
4. Select **Session mode** (for connection pooling)
5. Copy the **exact** connection string

It should look like:
```
postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2: Update Your .env File

**Important:** Replace `[YOUR-PASSWORD]` with your **actual** database password and URL-encode special characters.

#### URL-Encode Special Characters:
- `[` → `%5B`
- `]` → `%5D`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

#### Example:
If your password is `[SaudiArabia2030]`, it should be `%5BSaudiArabia2030%5D`

### Step 3: Update .env File

```env
# Connection Pooling (Port 6543) - For Application Queries
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (Port 5432) - For Migrations
DIRECT_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

### Step 4: Verify Database Password

1. Go to **Settings** → **Database**
2. Find **Database password** section
3. If you don't remember it, click **Reset database password**
4. **Copy the new password** (you'll need it)
5. Update your `.env` with the new password (URL-encoded)

### Step 5: Test Connection

After updating:
```bash
node test-connection.js
```

If it works, you'll see:
```
✓ Connection successful!
✓ Found X user(s) in the database
```

## Alternative: Use Connection Pooling Only

If DIRECT_URL keeps failing, you can use DATABASE_URL for both:

```env
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.swnbqometoktlfyraeve:YOUR_URL_ENCODED_PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Note: This uses port 6543 for both, which works for queries but might have issues with migrations.

