-- Create Property Ratings Table
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS property_ratings (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  contract_id TEXT,
  tenant_user_id BIGINT,
  
  stay_period_from TIMESTAMP WITH TIME ZONE,
  stay_period_to TIMESTAMP WITH TIME ZONE,
  
  overall_property_rating DOUBLE PRECISION NOT NULL,
  property_ratings TEXT, -- JSON: {location: 5, cleanliness: 4, ...}
  owner_ratings TEXT, -- JSON: {responsiveness: 5, professionalism: 4, ...}
  satisfaction_level TEXT, -- excellent, good, neutral, bad, very-bad
  
  positives TEXT,
  negatives TEXT,
  photos TEXT, -- JSON array of base64 images
  
  improve_comment BOOLEAN DEFAULT false,
  correct_grammar BOOLEAN DEFAULT false,
  privacy_option TEXT DEFAULT 'public', -- public, anonymous, private
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL,
  CONSTRAINT fk_tenant_user FOREIGN KEY (tenant_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_ratings_property_id ON property_ratings(property_id);
CREATE INDEX IF NOT EXISTS idx_property_ratings_contract_id ON property_ratings(contract_id);
CREATE INDEX IF NOT EXISTS idx_property_ratings_tenant_user_id ON property_ratings(tenant_user_id);
CREATE INDEX IF NOT EXISTS idx_property_ratings_created_at ON property_ratings(created_at);

