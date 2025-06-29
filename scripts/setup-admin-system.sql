-- Add admin fields to existing tables and create new tables for admin functionality

-- Add admin and status fields to members (we'll simulate this in our auth system)
-- In a real app, this would be: ALTER TABLE members ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
-- ALTER TABLE members ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive'));

-- Create custom pages table
CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('all', 'tier_specific', 'custom')),
  allowed_tiers JSONB DEFAULT '[]',
  allowed_members JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat channels table
CREATE TABLE IF NOT EXISTS chat_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('general', 'announcement', 'group')),
  created_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat channel members table
CREATE TABLE IF NOT EXISTS chat_channel_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, member_id)
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_access ON custom_pages(access_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_time ON chat_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_chat_channel_members_channel ON chat_channel_members(channel_id);

-- Insert default chat channels
INSERT INTO chat_channels (name, description, type, created_by) VALUES
('General Discussion', 'Main chat for all members', 'general', 'jasper_shaw'),
('Announcements', 'Official announcements from leadership', 'announcement', 'jasper_shaw');

-- Add all members to general chat
INSERT INTO chat_channel_members (channel_id, member_id)
SELECT c.id, m.member_id
FROM chat_channels c
CROSS JOIN (
  VALUES 
    ('jasper_shaw'),
    ('alex_romanov'),
    ('rupert_mcvey'),
    ('bowen_jiang'),
    ('william_lin'),
    ('harry_lee'),
    ('suri_chun'),
    ('rafael_fok')
) AS m(member_id)
WHERE c.type = 'general';

-- Sample custom page
INSERT INTO custom_pages (title, slug, content, created_by, access_type, allowed_tiers) VALUES
('Executive Resources', 'executive-resources', 
'<h1>Executive Resources</h1><p>This page contains sensitive executive-only information and resources.</p><ul><li>Strategic planning documents</li><li>Financial reports</li><li>Leadership guidelines</li></ul>', 
'jasper_shaw', 'tier_specific', '["ceo", "executive"]');
