"use client"

import { Calendar, Clock, MapPin, Users, ArrowLeft, Video, Phone, FileText, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { getMeetingsForUser, type MeetingWithInvitations } from "@/lib/meetings"
import { MeetingManagement } from "@/components/meeting-management"
import { useEffect, useState } from "react"
import type { Member } from "@/lib/auth"

function CalendarPage() {
  const [user, setUser] = useState<Member | null>(null)
  const [meetings, setMeetings] = useState<MeetingWithInvitations[]>([])
  const [loading, setLoading] = useState(true)
  const [showManagement, setShowManagement] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      loadMeetings(currentUser)
    }
  }, [])

  const loadMeetings = async (currentUser: Member) => {
    setLoading(true)
    const userMeetings = await getMeetingsForUser(currentUser.username, currentUser.tier)
    setMeetings(userMeetings)
    setLoading(false)
  }

  const handleMeetingChange = () => {
    if (user) {
      loadMeetings(user)
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm} EST`
  }

  const canManageMeetings = user?.tier === "ceo" || user?.tier === "executive"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {showManagement ? "Meeting Management" : "Meeting Calendar"}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canManageMeetings && (
              <Button variant="outline" size="sm" onClick={() => setShowManagement(!showManagement)}>
                <Settings className="h-4 w-4 mr-2" />
                {showManagement ? "View Calendar" : "Manage Meetings"}
              </Button>
            )}
            <Badge variant="secondary">
              {user?.name} • {user?.role?.replace("-", " ")}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {showManagement && canManageMeetings && user ? (
            <MeetingManagement user={user} meetings={meetings} onMeetingChange={handleMeetingChange} />
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Meetings & Events</h2>
                <p className="text-lg text-gray-600">
                  Meetings you're invited to or have access to. Times shown in Eastern Standard Time.
                </p>
              </div>

              {/* Meeting Type Legend */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Meeting Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-600">Required</Badge>
                      <span className="text-sm text-gray-600">Mandatory attendance for invited members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-600">Optional</Badge>
                      <span className="text-sm text-gray-600">Voluntary participation for invited members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">Full Member</Badge>
                      <span className="text-sm text-gray-600">All members automatically invited</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-600">Executive</Badge>
                      <span className="text-sm text-gray-600">CEO and Executives automatically invited</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Meetings List */}
              <div className="space-y-6">
                {meetings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No meetings found</p>
                        <p className="text-sm text-gray-400">You don't have any upcoming meetings or invitations.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  meetings.map((meeting) => (
                    <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-2">{meeting.title}</CardTitle>
                            <CardDescription className="text-base">{meeting.description}</CardDescription>
                          </div>
                          <Badge className={getTypeColor(meeting.type)}>{meeting.type.replace("_", " ")}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Meeting Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{formatDate(meeting.date)}</p>
                                <p className="text-sm text-gray-600">{formatTime(meeting.time)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium">Duration</p>
                                <p className="text-sm text-gray-600">{meeting.duration} minutes</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-gray-600">{meeting.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Users className="h-5 w-5 text-orange-600" />
                              <div>
                                <p className="font-medium">Attendees</p>
                                <p className="text-sm text-gray-600">
                                  {meeting.type === "full_member"
                                    ? "All members"
                                    : meeting.type === "executive"
                                      ? "All executives"
                                      : `${meeting.invited_members.length} invited members`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Agenda */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Agenda
                          </h4>
                          <ul className="space-y-1">
                            {meeting.agenda.map((item, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {meeting.zoom_link && (
                            <Button size="sm" asChild>
                              <Link href={meeting.zoom_link} target="_blank">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Dial-in Info
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <CalendarPage />
    </AuthGuard>
  )
}
