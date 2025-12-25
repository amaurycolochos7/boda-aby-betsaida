-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- Execute in Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- EVENT_CONFIG POLICIES
-- =====================================================

-- Anyone can read event config
CREATE POLICY "Event config is readable by all"
ON event_config FOR SELECT
TO authenticated, anon
USING (true);

-- Only authenticated users can update
CREATE POLICY "Event config updatable by authenticated users"
ON event_config FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated can insert
CREATE POLICY "Event config insertable by authenticated users"
ON event_config FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- TABLES POLICIES
-- =====================================================

-- Anyone can read tables
CREATE POLICY "Tables are readable by all"
ON tables FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can manage tables
CREATE POLICY "Tables manageable by authenticated users"
ON tables FOR ALL
TO authenticated
USING (true);

-- =====================================================
-- GUEST_PASSES POLICIES
-- =====================================================

-- Anyone can read guest passes (for code verification)
CREATE POLICY "Guest passes readable by all"
ON guest_passes FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can create passes
CREATE POLICY "Guest passes insertable by authenticated"
ON guest_passes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update passes
CREATE POLICY "Guest passes updatable by authenticated"
ON guest_passes FOR UPDATE
TO authenticated, anon
USING (true);

-- Only authenticated can delete
CREATE POLICY "Guest passes deletable by authenticated"
ON guest_passes FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- ENTRY_LOGS POLICIES
-- =====================================================

-- Anyone can read entry logs
CREATE POLICY "Entry logs readable by all"
ON entry_logs FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can insert
CREATE POLICY "Entry logs insertable by authenticated"
ON entry_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- INVITATION_DOWNLOADS POLICIES
-- =====================================================

-- Anyone can insert (track downloads)
CREATE POLICY "Invitation downloads insertable by all"
ON invitation_downloads FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Authenticated can read
CREATE POLICY "Invitation downloads readable by authenticated"
ON invitation_downloads FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- USER_PROFILES POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- =====================================================
-- CREATE INITIAL ADMIN USERS
-- Replace with actual email addresses
-- =====================================================

-- First, create users in Supabase Authentication dashboard
-- Then run this to set their roles:

-- For the groom (Abi):
INSERT INTO user_profiles (id, email, first_name, role)
VALUES ('375c26ed-628d-49bb-a9d9-aee27ea64f45', 'abi@miboda.com', 'Abidan', 'groom')
ON CONFLICT (id) DO UPDATE SET role = 'groom', first_name = 'Abidan';

-- For the bride (Betsaida):
INSERT INTO user_profiles (id, email, first_name, role)
VALUES ('40cb3f00-02af-481c-89ac-6a4127b69100', 'betsi@miboda.com', 'Betsaida', 'bride')
ON CONFLICT (id) DO UPDATE SET role = 'bride', first_name = 'Betsaida';

-- For access control (Recepción):
INSERT INTO user_profiles (id, email, first_name, role)
VALUES ('e1049ca1-3d66-4cf5-ab4e-08d5362c76c1', 'recepcion@miboda.com', 'Recepción', 'access_control')
ON CONFLICT (id) DO UPDATE SET role = 'access_control', first_name = 'Recepción';
