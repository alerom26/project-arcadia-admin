"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Ensure these environment variables are set in your Vercel project or .env.local file
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

export interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  type: "optional" | "required" | "full_member" | "executive"
  location: string
  zoom_link: string
  agenda: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface MeetingInvitation {
  id: string
  meeting_id: string
  member_id: string
  invited_by: string
  invited_at: string
}

export interface MeetingAttendee {
  id: string
  meeting_id: string
  member_id: string
  status: "pending" | "attending" | "not_attending" | "maybe" | "attended" | "absent"
  responded_at: string | null
  marked_by: string | null
  marked_at: string | null
}

export interface MeetingWithInvitations extends Meeting {
  invitations: MeetingInvitation[]
  invited_members: string[]
  attendees: MeetingAttendee[] // Add attendees to the interface
}
