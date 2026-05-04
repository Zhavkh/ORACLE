-- ========================================
-- MODERATION SYSTEM SETUP
-- Execute in Supabase SQL Editor
-- ========================================

-- 1. Add status column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS 
status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Set all existing agents to approved status
UPDATE agents SET status = 'approved' WHERE status IS NULL;

-- 3. Add owner_email column
ALTER TABLE agents ADD COLUMN IF NOT EXISTS owner_email TEXT;

-- 4. Verify the setup
SELECT 'Setup completed' as status;

-- 5. Check current agents status
SELECT 
    id,
    name,
    status,
    owner_wallet_id,
    owner_email
FROM agents 
LIMIT 5;
