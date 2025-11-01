-- Create tenants table
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

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_user_id_key" ON "tenants"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_email_key" ON "tenants"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_phone_number_key" ON "tenants"("phone_number");
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_national_id_key" ON "tenants"("national_id");

-- Create indexes
CREATE INDEX IF NOT EXISTS "tenants_user_id_idx" ON "tenants"("user_id");
CREATE INDEX IF NOT EXISTS "tenants_email_idx" ON "tenants"("email");
CREATE INDEX IF NOT EXISTS "tenants_phone_number_idx" ON "tenants"("phone_number");
CREATE INDEX IF NOT EXISTS "tenants_national_id_idx" ON "tenants"("national_id");

-- Add foreign key to users table
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add tenant_id column to contracts table (if not already exists)
ALTER TABLE "contracts" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;

-- Create index on tenant_id (if not already exists)
CREATE INDEX IF NOT EXISTS "contracts_tenant_id_idx" ON "contracts"("tenant_id");

-- Add foreign key to tenants table (drop first if exists to avoid errors)
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

-- Make tenant fields optional in contracts (for backward compatibility)
-- tenantName, tenantEmail, tenantPhone are already optional (can be NULL)
