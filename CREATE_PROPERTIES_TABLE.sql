-- Create Properties Table in Supabase
-- Run this SQL in Supabase SQL Editor

-- Create properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  owner_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  area DOUBLE PRECISION,
  rooms VARCHAR(50),
  bathrooms VARCHAR(50),
  construction_year VARCHAR(10),
  status VARCHAR(50) DEFAULT 'متاح',
  description TEXT,
  images TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);

-- Verify table was created
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;

