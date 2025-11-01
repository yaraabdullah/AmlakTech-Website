-- Create contracts table
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
    "type" VARCHAR(50) NOT NULL, -- إيجار سكني، إيجار تجاري، بيع
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "monthly_rent" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION,
    
    -- Status
    "status" VARCHAR(50) DEFAULT 'نشط', -- نشط، منتهي، معلق
    "notes" TEXT,
    
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- Create foreign keys
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_property_id_fkey" 
    FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "contracts" ADD CONSTRAINT "contracts_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: unit_id foreign key will be added if units table exists
-- ALTER TABLE "contracts" ADD CONSTRAINT "contracts_unit_id_fkey" 
--     FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note: tenant_id foreign key will be added after tenants table is created
-- This will be done in create_tenants_table.sql

-- Create indexes
CREATE INDEX IF NOT EXISTS "contracts_property_id_idx" ON "contracts"("property_id");
CREATE INDEX IF NOT EXISTS "contracts_owner_id_idx" ON "contracts"("owner_id");
CREATE INDEX IF NOT EXISTS "contracts_tenant_id_idx" ON "contracts"("tenant_id");
CREATE INDEX IF NOT EXISTS "contracts_status_idx" ON "contracts"("status");
CREATE INDEX IF NOT EXISTS "contracts_start_date_idx" ON "contracts"("start_date");
CREATE INDEX IF NOT EXISTS "contracts_end_date_idx" ON "contracts"("end_date");
