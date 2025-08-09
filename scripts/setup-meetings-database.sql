-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  type TEXT NOT NULL CHECK (type IN ('optional', 'required', 'full_member', 'executive')),
  location TEXT NOT NULL,
  zoom_link TEXT,
  agenda JSONB DEFAULT '[]',
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_invitations table
CREATE TABLE IF NOT EXISTS meeting_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, member_id)
);

-- Create meeting_attendees table for attendance tracking
CREATE TABLE IF NOT EXISTS meeting_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'attending', 'not_attending', 'maybe', 'attended', 'absent')),
  responded_at TIMESTAMP WITH TIME ZONE,
  marked_by TEXT, -- Who marked the attendance (e.g., admin, creator, or self)
  marked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(meeting_id, member_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_type ON meetings(type);
CREATE INDEX IF NOT EXISTS idx_meeting_invitations_member ON meeting_invitations(member_id);
CREATE INDEX IF NOT EXISTS idx_meeting_invitations_meeting ON meeting_invitations(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting ON meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_member ON meeting_attendees(member_id);

-- Insert sample meetings (if not already present, or update if needed)
INSERT INTO meetings (title, description, date, time, duration, type, location, zoom_link, agenda, created_by) VALUES
('Weekly General Assembly', 'Our weekly all-hands meeting where we discuss project progress and address questions.', '2024-12-29', '19:00', 90, 'full_member', 'Conference Room A / Zoom Hybrid', 'https://zoom.us/j/123456789', '["Project updates", "New member introductions", "Q&A session"]', 'jasper_shaw')
ON CONFLICT (title) DO NOTHING;

INSERT INTO meetings (title, description, date, time, duration, type, location, zoom_link, agenda, created_by) VALUES
('Project Review Session', 'Deep dive into current project status and budget allocation.', '2025-01-02', '18:30', 60, 'optional', 'Virtual Only', 'https://zoom.us/j/987654321', '["Project Alpha review", "Budget discussions", "Timeline adjustments"]', 'alex_romanov')
ON CONFLICT (title) DO NOTHING;

INSERT INTO meetings (title, description, date, time, duration, type, location, zoom_link, agenda, created_by) VALUES
('Leadership Council', 'Private leadership meeting for strategic decisions.', '2025-01-04', '20:00', 120, 'executive', 'Private Channel', 'https://zoom.us/j/leadership-private', '["Strategic planning", "Member evaluations", "Policy updates"]', 'jasper_shaw')
ON CONFLICT (title) DO NOTHING;

INSERT INTO meetings (title, description, date, time, duration, type, location, zoom_link, agenda, created_by) VALUES
('Technical Workshop: Advanced Git', 'Hands-on workshop covering advanced Git techniques.', '2025-01-06', '14:00', 180, 'optional', 'Virtual Workshop Room', 'https://zoom.us/j/workshop-git', '["Git branching strategies", "Merge conflict resolution", "Advanced workflows"]', 'bowen_jiang')
ON CONFLICT (title) DO NOTHING;

INSERT INTO meetings (title, description, date, time, duration, type, location, zoom_link, agenda, created_by) VALUES
('Monthly All-Hands', 'Monthly comprehensive meeting covering achievements and future plans.', '2025-01-15', '19:00', 120, 'full_member', 'Main Auditorium / Zoom', 'https://zoom.us/j/monthly-allhands', '["Monthly achievements", "Upcoming initiatives", "Recognition ceremony"]', 'jasper_shaw')
ON CONFLICT (title) DO NOTHING;

-- Insert specific invitations for optional meetings (full_member and executive types are handled automatically)
INSERT INTO meeting_invitations (meeting_id, member_id, invited_by)
SELECT m.id, 'bowen_jiang', 'alex_romanov'
FROM meetings m WHERE m.title = 'Project Review Session'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

INSERT INTO meeting_invitations (meeting_id, member_id, invited_by)
SELECT m.id, 'william_lin', 'alex_romanov'
FROM meetings m WHERE m.title = 'Project Review Session'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

INSERT INTO meeting_invitations (meeting_id, member_id, invited_by)
SELECT m.id, 'harry_lee', 'alex_romanov'
FROM meetings m WHERE m.title = 'Project Review Session'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

INSERT INTO meeting_invitations (meeting_id, member_id, invited_by)
SELECT m.id, 'suri_chun', 'bowen_jiang'
FROM meetings m WHERE m.title = 'Technical Workshop: Advanced Git'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

INSERT INTO meeting_invitations (meeting_id, member_id, invited_by)
SELECT m.id, 'william_lin', 'bowen_jiang'
FROM meetings m WHERE m.title = 'Technical Workshop: Advanced Git'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

-- Insert sample attendance data for existing meetings
-- Jasper Shaw (CEO) for Weekly General Assembly (full_member)
INSERT INTO meeting_attendees (meeting_id, member_id, status, responded_at, marked_by, marked_at)
SELECT m.id, 'jasper_shaw', 'attending', NOW(), 'self', NOW()
FROM meetings m WHERE m.title = 'Weekly General Assembly'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

-- Alex Romanov (Executive) for Project Review Session (optional)
INSERT INTO meeting_attendees (meeting_id, member_id, status, responded_at, marked_by, marked_at)
SELECT m.id, 'alex_romanov', 'attending', NOW(), 'self', NOW()
FROM meetings m WHERE m.title = 'Project Review Session'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

-- Bowen Jiang (Manager) for Project Review Session (optional)
INSERT INTO meeting_attendees (meeting_id, member_id, status, responded_at, marked_by, marked_at)
SELECT m.id, 'bowen_jiang', 'maybe', NOW(), 'self', NOW()
FROM meetings m WHERE m.title = 'Project Review Session'
ON CONFLICT (meeting_id, member_id) DO NOTHING;

-- Rupert McVey (Executive) for Leadership Council (executive)
INSERT INTO meeting_attendees (meeting_id, member_id, status, responded_at, marked_by, marked_at)
SELECT m.id, 'rupert_mcvey', 'attending', NOW(), 'self', NOW()
FROM meetings m WHERE m.title = 'Leadership Council'
ON CONFLICT (meeting_id, member_id) DO NOTHING;
