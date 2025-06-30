"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Calendar, Trash2, Edit, Users } from "lucide-react"
import {
  createMeeting,
  getInvitableMembers,
  updateMeetingAttendance,
  type MeetingWithInvitations,
} from "@/lib/meetings"
import type { Member } from "@/lib/auth"
import { getAllMembers } from "@/lib/auth" // Import getAllMembers

interface MeetingManagementProps {
  user: Member
  meetings: MeetingWithInvitations[]
  onMeetingChange: () => void
}

export function MeetingManagement({ user, meetings, onMeetingChange }: MeetingManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)
  const [currentMeetingForAttendance, setCurrentMeetingForAttendance] = useState<MeetingWithInvitations | null>(null)
  const [invitableMembers, setInvitableMembers] = useState<Member[]>([])
  const [allMembers, setAllMembers] = useState<Member[]>([]) // To get names for attendance
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    type: "optional" as "optional" | "required" | "full_member" | "executive",
    location: "",
    zoom_link: "",
    agenda: [""],
  })
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  useEffect(() => {
    setInvitableMembers(getInvitableMembers())
    setAllMembers(getAllMembers())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const meeting = {
      ...formData,
      agenda: formData.agenda.filter((item) => item.trim() !== ""),
      created_by: user.username,
    }

    const success = await createMeeting(meeting, selectedMembers)

    if (success) {
      setIsCreateOpen(false)
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 60,
        type: "optional",
        location: "",
        zoom_link: "",
        agenda: [""],
      })
      setSelectedMembers([])
      onMeetingChange()
    }
  }

  const handleUpdateAttendance = async (
    meetingId: string,
    memberId: string,
    status: "pending" | "attending" | "not_attending" | "maybe" | "attended" | "absent",
  ) => {
    const success = await updateMeetingAttendance(meetingId, memberId, status, user.username)
    if (success) {
      onMeetingChange() // Refresh meetings to show updated attendance
      // Optionally, update currentMeetingForAttendance state directly if needed for immediate UI feedback
      if (currentMeetingForAttendance && currentMeetingForAttendance.id === meetingId) {
        setCurrentMeetingForAttendance((prev) => {
          if (!prev) return null
          const existingAttendee = prev.attendees.find((att) => att.member_id === memberId)
          if (existingAttendee) {
            return {
              ...prev,
              attendees: prev.attendees.map((att) =>
                att.member_id === memberId
                  ? { ...att, status, marked_by: user.username, marked_at: new Date().toISOString() }
                  : att,
              ),
            }
          } else {
            return {
              ...prev,
              attendees: [
                ...prev.attendees,
                {
                  id: `temp-${Date.now()}`, // Temp ID for UI, will be replaced by DB ID
                  meeting_id: meetingId,
                  member_id: memberId,
                  status,
                  responded_at: new Date().toISOString(),
                  marked_by: user.username,
                  marked_at: new Date().toISOString(),
                },
              ],
            }
          }
        })
      }
    }
  }

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [...prev.agenda, ""],
    }))
  }

  const updateAgendaItem = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeAgendaItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }))
  }

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "required":
        return "bg-red-600"
      case "optional":
        return "bg-blue-600"
      case "full_member":
        return "bg-green-600"
      case "executive":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "required":
        return "Mandatory attendance for invited members"
      case "optional":
        return "Voluntary participation for invited members"
      case "full_member":
        return "All members are automatically invited"
      case "executive":
        return "CEO and Executives are automatically invited"
      default:
        return ""
    }
  }

  const shouldShowMemberSelection = formData.type === "optional" || formData.type === "required"

  const getMemberName = (username: string) => {
    return allMembers.find((m) => m.username === username)?.name || username
  }

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case "attending":
      case "attended":
        return "bg-green-100 text-green-800"
      case "not_attending":
      case "absent":
        return "bg-red-100 text-red-800"
      case "maybe":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Meeting Management</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Meeting</DialogTitle>
              <DialogDescription>Create a new meeting and manage invitations.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="full_member">Full Member</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">{getTypeDescription(formData.type)}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Conference Room A / Zoom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zoom_link">Zoom Link</Label>
                  <Input
                    id="zoom_link"
                    value={formData.zoom_link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zoom_link: e.target.value }))}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              </div>

              <div>
                <Label>Agenda Items</Label>
                <div className="space-y-2">
                  {formData.agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                        placeholder={`Agenda item ${index + 1}`}
                      />
                      {formData.agenda.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeAgendaItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </div>
              </div>

              {shouldShowMemberSelection && (
                <div>
                  <Label>Invite Members</Label>
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {invitableMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={member.id}
                            checked={selectedMembers.includes(member.username)}
                            onCheckedChange={() => toggleMemberSelection(member.username)}
                          />
                          <label htmlFor={member.id} className="text-sm flex items-center space-x-2">
                            <span>{member.name}</span>
                            <Badge className={`text-xs ${getTypeColor(member.role)}`}>{member.role}</Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Selected: {selectedMembers.length} members</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Meeting</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => {
          const canManageAttendance = user.isAdmin || meeting.created_by === user.username
          const attendingCount = meeting.attendees.filter(
            (a) => a.status === "attending" || a.status === "attended",
          ).length
          const notAttendingCount = meeting.attendees.filter(
            (a) => a.status === "not_attending" || a.status === "absent",
          ).length
          const maybeCount = meeting.attendees.filter((a) => a.status === "maybe").length
          const pendingCount = meeting.invited_members.length - (attendingCount + notAttendingCount + maybeCount)

          return (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{meeting.title}</span>
                      <Badge className={getTypeColor(meeting.type)}>{meeting.type.replace("_", " ")}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    {canManageAttendance && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentMeetingForAttendance(meeting)
                          setIsAttendanceOpen(true)
                        }}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {meeting.time}
                    </p>
                    <p>
                      <strong>Duration:</strong> {meeting.duration} minutes
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Location:</strong> {meeting.location}
                    </p>
                    <p>
                      <strong>Created by:</strong> {meeting.created_by}
                    </p>
                    {meeting.type === "optional" || meeting.type === "required" ? (
                      <p>
                        <strong>Invited:</strong> {meeting.invited_members.length} members
                      </p>
                    ) : meeting.type === "full_member" ? (
                      <p>
                        <strong>Invited:</strong> All members
                      </p>
                    ) : (
                      <p>
                        <strong>Invited:</strong> All executives
                      </p>
                    )}
                  </div>
                </div>
                {canManageAttendance && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Attendance Summary:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800">Attending: {attendingCount}</Badge>
                      <Badge className="bg-red-100 text-red-800">Not Attending: {notAttendingCount}</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">Maybe: {maybeCount}</Badge>
                      <Badge className="bg-gray-100 text-gray-800">Pending: {pendingCount}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Attendance Management Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Attendance for "{currentMeetingForAttendance?.title}"</DialogTitle>
            <DialogDescription>View and update attendance status for invited members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentMeetingForAttendance?.invited_members.length === 0 && (
              <p className="text-gray-500">No specific members invited to this meeting type.</p>
            )}
            {currentMeetingForAttendance?.invited_members.map((memberId) => {
              const memberName = getMemberName(memberId)
              const currentStatus =
                currentMeetingForAttendance?.attendees.find((att) => att.member_id === memberId)?.status || "pending"
              const markedBy = currentMeetingForAttendance?.attendees.find(
                (att) => att.member_id === memberId,
              )?.marked_by
              const markedAt = currentMeetingForAttendance?.attendees.find(
                (att) => att.member_id === memberId,
              )?.marked_at

              return (
                <div key={memberId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{memberName}</p>
                    <Badge className={`mt-1 ${getAttendanceStatusColor(currentStatus)}`}>
                      {currentStatus.replace("_", " ")}
                    </Badge>
                    {markedBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        {markedBy === memberId ? "Self-responded" : `Marked by ${markedBy}`} on{" "}
                        {new Date(markedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Select
                    value={currentStatus}
                    onValueChange={(value: any) =>
                      handleUpdateAttendance(currentMeetingForAttendance!.id, memberId, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="attending">Attending (RSVP)</SelectItem>
                      <SelectItem value="not_attending">Not Attending (RSVP)</SelectItem>
                      <SelectItem value="maybe">Maybe (RSVP)</SelectItem>
                      <SelectItem value="attended">Attended (Admin)</SelectItem>
                      <SelectItem value="absent">Absent (Admin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
