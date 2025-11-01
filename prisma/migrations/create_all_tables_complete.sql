-- Complete migration script to create all tables in the correct order
-- Run this script in Supabase SQL Editor

-- Step 1: Create contracts table (before tenants, as it doesn't depend on tenants initially)
CREATE TABLE IF NOT EXISTS "contracts" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "unit_id" TEXT,
    "owner_id" BIGINT NOT NULL,
    "tenant_id" TEXT,
    
    -- Legacy tenant fields (for backward compatibility)
    "tenant_name" VARCHAR(255),
    "tenant_email" VARCHAR(255),
    "tenant_phone" VARCHAR(20),
    
    -- Contract details
    "type" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "monthly_rent" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION,
    
    -- Status
    "status" VARCHAR(50) DEFAULT 'نشط',
    "notes" TEXT,
    
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- Foreign keys for contracts
ALTER TABLE "contracts" ADD CONSTRAINT IF NOT EXISTS "contracts_property_id_fkey" 
    FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contracts" ADD CONSTRAINT IF NOT EXISTS "contracts_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes for contracts
CREATE INDEX IF NOT EXISTS "contracts_property_id_idx" ON "contracts"("property_id");
CREATE INDEX IF NOT EXISTS "contracts_owner_id_idx" ON "contracts"("owner_id");
CREATE INDEX IF NOT EXISTS "contracts_tenant_id_idx" ON "contracts"("tenant_id");
CREATE INDEX IF NOT EXISTS "contracts_status_idx" ON "contracts"("status");
CREATE INDEX IF NOT EXISTS "contracts_start_date_idx" ON "contracts"("start_date");
CREATE INDEX IF NOT EXISTS "contracts_end_date_idx" ON "contracts"("end_date");

-- Step 2: Create tenants table
CREATE TABLE IF NOT EXISTS "tenants" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone_number" VARCHAR(20) NOT NULL,
    "national_id" VARCHAR(20),
    "city" VARCHAR(100),
    "address" TEXT,
    "emergency_contact" VARCHAR(255),
    "emergency_phone" VARCHAR(20),
    "status" VARCHAR(50) DEFAULT 'نشط',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- Unique constraints for tenants
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_user_id_key" ON "tenants"("user_id") WHERE "user_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_email_key" ON "tenants"("email") WHERE "email" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_phone_number_key" ON "tenants"("phone_number");
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_national_id_key" ON "tenants"("national_id") WHERE "national_id" IS NOT NULL;

-- Indexes for tenants
CREATE INDEX IF NOT EXISTS "tenants_user_id_idx" ON "tenants"("user_id");
CREATE INDEX IF NOT EXISTS "tenants_email_idx" ON "tenants"("email");
CREATE INDEX IF NOT EXISTS "tenants_phone_number_idx" ON "tenants"("phone_number");
CREATE INDEX IF NOT EXISTS "tenants_national_id_idx" ON "tenants"("national_id");

-- Foreign key from tenants to users
ALTER TABLE "tenants" ADD CONSTRAINT IF NOT EXISTS "tenants_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 3: Add tenant_id foreign key to contracts (after tenants table is created)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'contracts_tenant_id_fkey'
    ) THEN
        ALTER TABLE "contracts" DROP CONSTRAINT "contracts_tenant_id_fkey";
    END IF;
END $$;

ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_fkey" 
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('contracts', 'tenants')
ORDER BY table_name;
