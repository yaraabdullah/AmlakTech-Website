# Verify Property Table in Supabase

## Check if Property Table Exists

You need to ensure the `properties` table exists in your Supabase database.

### Step 1: Check in Supabase SQL Editor

Run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'properties';
```

If it returns a row, the table exists. If not, you need to create it.

### Step 2: Create Properties Table (if needed)

If the table doesn't exist, run this SQL in Supabase SQL Editor:

```sql
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
```

### Step 3: Verify Table Structure

Check the columns match:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
```

You should see all columns from the Prisma schema.

