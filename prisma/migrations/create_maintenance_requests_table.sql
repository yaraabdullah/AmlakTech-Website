-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS "maintenance_requests" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "owner_id" BIGINT NOT NULL,
    
    -- Request details
    "unit" VARCHAR(50),
    "type" VARCHAR(50) NOT NULL, -- كهربائي، سباكة، تكييف، عام
    "priority" VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    "problem_description" TEXT NOT NULL,
    
    -- Contact information
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(20),
    "notify_tenant" BOOLEAN DEFAULT false,
    
    -- Scheduling
    "scheduled_date" TIMESTAMP(3),
    "time_period" VARCHAR(20), -- morning, afternoon, evening
    
    -- Status and cost
    "status" VARCHAR(50) DEFAULT 'قيد الانتظار', -- قيد الانتظار، مجدولة، مكتملة، ملغاة
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "maintenance_requests" ADD CONSTRAINT IF NOT EXISTS "maintenance_requests_property_id_fkey" 
    FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "maintenance_requests" ADD CONSTRAINT IF NOT EXISTS "maintenance_requests_owner_id_fkey" 
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS "maintenance_requests_property_id_idx" ON "maintenance_requests"("property_id");
CREATE INDEX IF NOT EXISTS "maintenance_requests_owner_id_idx" ON "maintenance_requests"("owner_id");
CREATE INDEX IF NOT EXISTS "maintenance_requests_status_idx" ON "maintenance_requests"("status");
