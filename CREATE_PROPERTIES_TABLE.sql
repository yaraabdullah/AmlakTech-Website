-- Create Properties Table in Supabase
-- Run this SQL in Supabase SQL Editor

-- Drop table if exists (for recreation)
-- DROP TABLE IF EXISTS properties CASCADE;

-- Create properties table with all form fields
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
  
  -- Location details
  unit_number VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'المملكة العربية السعودية',
  
  -- Property subtype
  property_sub_type VARCHAR(50),
  
  -- Features (stored as JSON)
  features TEXT, -- JSON: parking, garden, balcony, pool, elevator, gym, security, wifi, ac, jacuzzi
  
  -- Pricing
  monthly_rent DOUBLE PRECISION,
  insurance DOUBLE PRECISION,
  available_from TIMESTAMP WITH TIME ZONE,
  min_rental_period VARCHAR(50),
  public_display BOOLEAN DEFAULT false,
  
  -- Payment system
  payment_email VARCHAR(255),
  support_phone VARCHAR(50),
  payment_account VARCHAR(100),
  
  -- Additional details
  description TEXT,
  images TEXT, -- JSON array of image URLs
  
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
CREATE INDEX IF NOT EXISTS idx_properties_public_display ON properties(public_display);

-- Verify table was created
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
