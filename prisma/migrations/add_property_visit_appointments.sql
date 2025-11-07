CREATE TABLE IF NOT EXISTS "property_visit_appointments" (
  "id" TEXT PRIMARY KEY,
  "property_id" TEXT NOT NULL REFERENCES "properties"("id") ON DELETE CASCADE,
  "owner_id" BIGINT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "requester_id" BIGINT REFERENCES "users"("id") ON DELETE SET NULL,
  "requester_name" TEXT NOT NULL,
  "requester_email" TEXT,
  "requester_phone" TEXT,
  "visit_type" TEXT NOT NULL,
  "scheduled_date" TIMESTAMPTZ NOT NULL,
  "time_slot" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT DEFAULT 'قيد المراجعة',
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_visit_property" ON "property_visit_appointments"("property_id");
CREATE INDEX IF NOT EXISTS "idx_visit_owner" ON "property_visit_appointments"("owner_id");
CREATE INDEX IF NOT EXISTS "idx_visit_requester" ON "property_visit_appointments"("requester_id");
CREATE INDEX IF NOT EXISTS "idx_visit_date" ON "property_visit_appointments"("scheduled_date");
