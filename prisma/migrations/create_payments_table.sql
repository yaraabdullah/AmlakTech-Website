-- Create payments table
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
    "status" VARCHAR(50) DEFAULT 'مستحقة', -- مستحقة، مدفوعة، متأخرة
    
    -- Additional details
    "payment_method" VARCHAR(50),
    "notes" TEXT,
    
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "payments" ADD CONSTRAINT IF NOT EXISTS "payments_contract_id_fkey" 
    FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT IF NOT EXISTS "payments_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS "payments_contract_id_idx" ON "payments"("contract_id");
CREATE INDEX IF NOT EXISTS "payments_owner_id_idx" ON "payments"("owner_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "payments_due_date_idx" ON "payments"("due_date");
