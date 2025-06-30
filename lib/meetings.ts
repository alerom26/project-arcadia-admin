"use client"

import { supabase, type Meeting, type MeetingInvitation, type MeetingAttendee } from "./supabase"
import { members, type Member } from "./auth"

export interface MeetingWithInvitations extends Meeting {
  invitations: MeetingInvitation[]
  invited_members: string[]
  attendees: MeetingAttendee[]
}

export async function getMeetingsForUser(userId: string, userTier: string): Promise<MeetingWithInvitations[]> {
  try {
    // Get all meetings with their invitations and attendees
    const { data: meetings, error: meetingsError } = await supabase
      .from("meetings")
      .select(`
        *,
        meeting_invitations (*),
        meeting_attendees (*)
      `)
      .order("date", { ascending: true })

    if (meetingsError) {
      console.error("Error fetching meetings:", meetingsError)
      return []
    }

    // Filter meetings based on user access
    const accessibleMeetings =
      meetings?.filter((meeting) => {
        // Full member meetings - all members can see
        if (meeting.type === "full_member") return true

        // Executive meetings - only CEO and executives can see
        if (meeting.type === "executive") {
          return userTier === "ceo" || userTier === "executive"
        }

        // Optional and Required meetings - check specific invitations
        if (meeting.type === "optional" || meeting.type === "required") {
          return meeting.meeting_invitations?.some((inv: any) => inv.member_id === userId)
        }

        return false
      }) || []

    // Transform the data to include invited members list and attendees
    return accessibleMeetings.map((meeting) => ({
      ...meeting,
      invitations: meeting.meeting_invitations || [],
      invited_members: meeting.meeting_invitations?.map((inv: any) => inv.member_id) || [],
      attendees: meeting.meeting_attendees || [], // Include attendees
    }))
  } catch (error) {
    console.error("Error in getMeetingsForUser:", error)
    return []
  }
}

export async function createMeeting(
  meeting: Omit<Meeting, "id" | "created_at" | "updated_at">,
  invitedMembers: string[] = [],
): Promise<boolean> {
  try {
    // Insert the meeting
    const { data: newMeeting, error: meetingError } = await supabase
      .from("meetings")
      .insert([meeting])
      .select()
      .single()

    if (meetingError) {
      console.error("Error creating meeting:", meetingError)
      return false
    }

    // For optional and required meetings, add specific invitations
    if ((meeting.type === "optional" || meeting.type === "required") && invitedMembers.length > 0) {
      const invitations = invitedMembers.map((memberId) => ({
        meeting_id: newMeeting.id,
        member_id: memberId,
        invited_by: meeting.created_by,
      }))

      const { error: invitationError } = await supabase.from("meeting_invitations").insert(invitations)

      if (invitationError) {
        console.error("Error creating invitations:", invitationError)
        return false
      }
    } else if (meeting.type === "full_member") {
      // For full_member meetings, invite all members
      const allMembers = members.map((m) => m.username)
      const invitations = allMembers.map((memberId) => ({
        meeting_id: newMeeting.id,
        member_id: memberId,
        invited_by: meeting.created_by,
      }))
      const { error: invitationError } = await supabase.from("meeting_invitations").insert(invitations)
      if (invitationError) {
        console.error("Error creating full_member invitations:", invitationError)
        return false
      }
    } else if (meeting.type === "executive") {
      // For executive meetings, invite all executives
      const allExecutives = members.filter((m) => m.tier === "ceo" || m.tier === "executive").map((m) => m.username)
      const invitations = allExecutives.map((memberId) => ({
        meeting_id: newMeeting.id,
        member_id: memberId,
        invited_by: meeting.created_by,
      }))
      const { error: invitationError } = await supabase.from("meeting_invitations").insert(invitations)
      if (invitationError) {
        console.error("Error creating executive invitations:", invitationError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in createMeeting:", error)
    return false
  }
}

export async function updateMeetingInvitations(
  meetingId: string,
  invitedMembers: string[],
  invitedBy: string,
): Promise<boolean> {
  try {
    // Delete existing invitations
    await supabase.from("meeting_invitations").delete().eq("meeting_id", meetingId)

    // Add new invitations
    if (invitedMembers.length > 0) {
      const invitations = invitedMembers.map((memberId) => ({
        meeting_id: meetingId,
        member_id: memberId,
        invited_by: invitedBy,
      }))

      const { error } = await supabase.from("meeting_invitations").insert(invitations)

      if (error) {
        console.error("Error updating invitations:", error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateMeetingInvitations:", error)
    return false
  }
}

export async function deleteMeeting(meetingId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("meetings").delete().eq("id", meetingId)

    if (error) {
      console.error("Error deleting meeting:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteMeeting:", error)
    return false
  }
}

export async function updateMeetingAttendance(
  meetingId: string,
  memberId: string,
  status: MeetingAttendee["status"],
  markedBy: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("meeting_attendees").upsert(
      {
        meeting_id: meetingId,
        member_id: memberId,
        status: status,
        responded_at: new Date().toISOString(),
        marked_by: markedBy,
        marked_at: new Date().toISOString(),
      },
      { onConflict: "meeting_id,member_id" }, // Upsert based on these unique columns
    )

    if (error) {
      console.error("Error updating attendance:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error in updateMeetingAttendance:", error)
    return false
  }
}

export async function getMeetingAttendees(meetingId: string): Promise<MeetingAttendee[]> {
  try {
    const { data, error } = await supabase.from("meeting_attendees").select("*").eq("meeting_id", meetingId)

    if (error) {
      console.error("Error fetching meeting attendees:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.error("Error in getMeetingAttendees:", error)
    return []
  }
}

export function getInvitableMembers(): Member[] {
  return members
}

export function getMembersByTier(tier: string): Member[] {
  return members.filter((member) => member.tier === tier)
}

export function getAllExecutives(): Member[] {
  return members.filter((member) => member.tier === "ceo" || member.tier === "executive")
}
