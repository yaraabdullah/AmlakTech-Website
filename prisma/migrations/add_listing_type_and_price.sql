-- AlterTable
-- Add listingType column to properties table
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "listing_type" TEXT DEFAULT 'للإيجار';

-- Add price column to properties table
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;

