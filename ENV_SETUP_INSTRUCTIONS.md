# 🔧 .env File Setup Instructions

Based on your Supabase dashboard, here's exactly what you need to add to your `.env` file:

## ✅ Required Environment Variables

Add these **two** connection strings to your `.env` file:

```env
# Connection Pooling URL (For Application) - Port 6543
DATABASE_URL="postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection URL (For Migrations) - Port 5432
DIRECT_URL="postgresql://postgres.swnbqometoktlfyraeve:%5BSaudiArabia2030%5D@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

## 📝 Important Notes

1. **Password Encoding**: Your password `[SaudiArabia2030]` is already URL-encoded:
   - `[` → `%5B`
   - `]` → `%5D`

2. **Two URLs**:
   - `DATABASE_URL`: For your application (port 6543, with `pgbouncer=true`)
   - `DIRECT_URL`: For Prisma migrations (port 5432)

3. **Region**: Note that your pooler is at `aws-1-ap-southeast-2`, not `aws-0-us-west-1`

## 🔍 How to Verify

After adding these to your `.env`:

```bash
# Validate the schema
npx prisma validate

# Test the connection (this will use DIRECT_URL)
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

If `npx prisma db pull` works, your connection is correct! ✅

## 🎯 What Each Variable Does

- **DATABASE_URL**: Your Next.js app uses this for database queries (connection pooling)
- **DIRECT_URL**: Prisma uses this for migrations and schema introspection (direct connection)

Both are needed because:
- Connection pooling (6543) is faster for queries
- Direct connection (5432) is required for migrations/introspection

