-- Add neighborhood column to properties table
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "neighborhood" VARCHAR(100);


