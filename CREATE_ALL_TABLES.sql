-- Create All Required Tables in Supabase
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- 1. Units Table
-- ============================================
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  type VARCHAR(50),
  area DOUBLE PRECISION,
  status VARCHAR(50) DEFAULT 'متاح',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_unit_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_units_property_id ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);

-- ============================================
-- 2. Contracts Table
-- ============================================
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_id TEXT,
  owner_id BIGINT NOT NULL,
  tenant_name VARCHAR(255) NOT NULL,
  tenant_email VARCHAR(255),
  tenant_phone VARCHAR(50),
  type VARCHAR(50) NOT NULL, -- إيجار سكني، إيجار تجاري، بيع
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  monthly_rent DOUBLE PRECISION NOT NULL,
  deposit DOUBLE PRECISION,
  status VARCHAR(50) DEFAULT 'نشط', -- نشط، منتهي، معلق
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_contract_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_contract_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
  CONSTRAINT fk_contract_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contracts_property_id ON contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_contracts_owner_id ON contracts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_unit_id ON contracts(unit_id);

-- ============================================
-- 3. Maintenance Requests Table
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  owner_id BIGINT NOT NULL,
  unit VARCHAR(100),
  type VARCHAR(50) NOT NULL, -- كهربائي، سباكة، تكييف، عام
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  problem_description TEXT NOT NULL,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'قيد الانتظار', -- قيد الانتظار، مجدولة، مكتملة، ملغاة
  cost DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_maintenance_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_maintenance_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_maintenance_property_id ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_owner_id ON maintenance_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);

-- ============================================
-- 4. Payments Table
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  contract_id TEXT,
  owner_id BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL, -- إيجار، صيانة، أخرى
  amount DOUBLE PRECISION NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'مستحقة', -- مستحقة، مدفوعة، متأخرة
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_payment_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL,
  CONSTRAINT fk_payment_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_owner_id ON payments(owner_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- ============================================
-- Verify Tables Created
-- ============================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('units', 'contracts', 'maintenance_requests', 'payments')
ORDER BY table_name;

