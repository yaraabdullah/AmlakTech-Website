# Fix DATABASE_URL Connection

## Issue
Your password `[SaudiArabia2030]` contains special characters `[` and `]` that need to be URL-encoded.

## Solution

You have two options:

### Option 1: URL-Encode the Password (Recommended)

Update your `.env` file. Special characters need encoding:
- `[` → `%5B`
- `]` → `%5D`

**Current:**
```
DATABASE_URL=postgresql://postgres:[SaudiArabia2030]@db.swnbqometoktlfyraeve.supabase.co:5432/postgres
```

**Should be:**
```
DATABASE_URL=postgresql://postgres:%5BSaudiArabia2030%5D@db.swnbqometoktlfyraeve.supabase.co:5432/postgres
```

### Option 2: Use Connection Pooling (Better for Production)

1. **Go to Supabase Dashboard**
   - Settings → Database → Connection pooling

2. **Copy the Pooler Connection String**
   - Use the **Session** mode connection string
   - It should look like: `postgresql://postgres.swnbqometoktlfyraeve:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres`

3. **Update `.env`:**
   ```
   DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-0-us-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
   ```

### Option 3: Change Password in Supabase

If you want to avoid encoding, change your database password in Supabase:
1. Go to Settings → Database → Database password
2. Generate a new password (or set one without special characters)
3. Update your `.env` with the new password

## Test After Fixing

```bash
npx prisma db pull
```

If successful, you should see your tables being introspected!

