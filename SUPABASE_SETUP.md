# Supabase Setup Guide

Follow these steps to set up Supabase for your AmlakTech application.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `amlak-tech`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - Click "Create new project"

## Step 2: Get Your Database Connection String

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll down to "Connection string"
3. Select **URI** tab
4. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with the password you created in Step 1

## Step 3: Set Up Environment Variable

1. In your project root, create a file named `.env`
2. Add the connection string:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres"
   ```
3. Replace `YOUR_PASSWORD` and `YOUR_PROJECT_REF` with your actual values

## Step 4: Install Required Dependencies

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

## Step 5: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create tables in Supabase
npx prisma migrate dev --name init

# Seed the database (optional - creates a demo owner)
npx prisma db seed
```

## Step 6: Set Up Vercel Environment Variable

If deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
4. Redeploy your application

## Step 7: Verify Connection

Open Prisma Studio to verify:
```bash
npx prisma studio
```

This will open a browser where you can see your tables.

## Troubleshooting

### Connection Error
- Make sure your `.env` file is in the project root
- Verify the password is correct (URL-encode special characters if needed)
- Check if your Supabase project is paused (free tier pauses after inactivity)

### Migration Error
- Make sure you've run `npx prisma generate` first
- Check that the DATABASE_URL is correctly formatted

### Can't Connect from Vercel
- Make sure the environment variable is set in Vercel
- Supabase allows connections from any IP by default, so no whitelist needed

