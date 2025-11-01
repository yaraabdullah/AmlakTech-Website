-- Create payments table
-- This script creates the payments table with all required fields and relationships

CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT,
    "owner_id" BIGINT NOT NULL,
    
    -- Payment details
    "type" VARCHAR(50) NOT NULL, -- إيجار، صيانة، أخرى
    "amount" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "paid_date" TIMESTAMP(3),
    
    -- Status
    "status" VARCHAR(50) NOT NULL DEFAULT 'مستحقة', -- مستحقة، مدفوعة، متأخرة
    
    -- Additional details
    "payment_method" VARCHAR(100),
    "notes" TEXT,
    
    -- Timestamps
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Drop existing foreign key constraints if they exist (to avoid errors)
DO $$ 
BEGIN
    -- Drop contract_id foreign key if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_contract_id_fkey'
    ) THEN
        ALTER TABLE "payments" DROP CONSTRAINT "payments_contract_id_fkey";
    END IF;
    
    -- Drop owner_id foreign key if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_owner_id_fkey'
    ) THEN
        ALTER TABLE "payments" DROP CONSTRAINT "payments_owner_id_fkey";
    END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE "payments" 
    ADD CONSTRAINT "payments_contract_id_fkey" 
    FOREIGN KEY ("contract_id") 
    REFERENCES "contracts"("id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

ALTER TABLE "payments" 
    ADD CONSTRAINT "payments_owner_id_fkey" 
    FOREIGN KEY ("owner_id") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "payments_contract_id_idx" ON "payments"("contract_id");
CREATE INDEX IF NOT EXISTS "payments_owner_id_idx" ON "payments"("owner_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_due_date_idx" ON "payments"("due_date");

-- Add comment to table
COMMENT ON TABLE "payments" IS 'Table to store payment records for contracts';

