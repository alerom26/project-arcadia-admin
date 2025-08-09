"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Users,
  FileText,
  LinkIcon,
  Shield,
  Crown,
  Star,
  Clock,
  MapPin,
  ExternalLink,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, logout, type Member } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { CodeOfConductModal } from "@/components/code-of-conduct-modal"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ChatSystem } from "@/components/chat-system"

function MemberPortal() {
  const [user, setUser] = useState<Member | null>(null)
  const router = useRouter()
  const [showCodeOfConduct, setShowCodeOfConduct] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Check if user needs to accept code of conduct
    if (currentUser) {
      const sessionData = localStorage.getItem("arcadia_session")
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData)
          if (!session.acceptedCodeOfConduct) {
            setShowCodeOfConduct(true)
          }
        } catch {
          // Handle error silently
        }
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ceo":
        return "bg-purple-600"
      case "executive":
        return "bg-blue-600"
      case "manager":
        return "bg-green-600"
      case "standard":
        return "bg-orange-600"
      case "honorary":
        return "bg-gray-600"
      default:
        return "bg-gray-500"
    }
  }

  const isAdmin = user?.isAdmin || false

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Arcadia
            </h1>
            <Badge variant="secondary" className="ml-2">
              Member Portal
            </Badge>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`transition-colors ${
                activeTab === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`transition-colors ${
                activeTab === "chat" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Chat
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`transition-colors ${
                  activeTab === "admin" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Admin
              </button>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge className={`text-xs ${getRoleColor(user.role)}`}>{user.role.replace("-", " ")}</Badge>
                  {isAdmin && <Badge className="text-xs bg-yellow-600">Admin</Badge>}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showCodeOfConduct && user && (
        <CodeOfConductModal
          user={{
            id: user.id,
            name: user.name,
            role: user.role,
          }}
          onAccept={() => setShowCodeOfConduct(false)}
        />
      )}

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back, {user?.name || "Arcadian"}
                </h2>
                <p className="text-xl text-gray-600">
                  Your central hub for all Project Arcadia activities, updates, and resources.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                    <div className="text-sm text-gray-600">Days Until Meeting</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Rest of dashboard content - meetings, hierarchy, rules, resources sections */}
              {/* (Previous content from the main portal page) */}
              {/* Meetings Section */}
              <section id="meetings" className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                  <div className="flex items-center mb-8">
                    <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Meetings & Events</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Upcoming Meetings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-blue-600" />
                          Upcoming Meetings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-l-4 border-blue-600 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Weekly General Assembly</h4>
                            <Badge>Required</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Friday, Dec 29, 2024 • 7:00 PM EST</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Conference Room A / Zoom Hybrid
                          </p>
                        </div>

                        <div className="border-l-4 border-purple-600 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Project Review Session</h4>
                            <Badge variant="secondary">Optional</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Monday, Jan 2, 2025 • 6:30 PM EST</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Virtual Only
                          </p>
                        </div>

                        {(user?.tier === "ceo" || user?.tier === "executive") && (
                          <div className="border-l-4 border-green-600 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">Leadership Council</h4>
                              <Badge variant="outline">Leadership Only</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Wednesday, Jan 4, 2025 • 8:00 PM EST</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Private Channel
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Meeting Guidelines */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-purple-600" />
                          Meeting Guidelines
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <p className="text-sm">Arrive 5 minutes early for technical setup</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                          <p className="text-sm">Mute microphone when not speaking</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <p className="text-sm">Use raise hand feature for questions</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                          <p className="text-sm">Submit agenda items 24 hours in advance</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                          <p className="text-sm">Attendance is tracked for required meetings</p>
                        </div>
                        <Separator className="my-4" />
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="/calendar">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Meeting Calendar
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Hierarchy Section */}
              <section id="hierarchy" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto max-w-6xl">
                  <div className="flex items-center mb-8">
                    <Crown className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Organizational Hierarchy</h3>
                  </div>

                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {/* CEO */}
                    <Card
                      className={`border-2 ${
                        user?.tier === "ceo" ? "border-purple-400 ring-2 ring-purple-200" : "border-purple-200"
                      }`}
                    >
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <CardTitle className="flex items-center text-sm">
                          <Crown className="h-4 w-4 mr-2" />
                          CEO
                          {user?.tier === "ceo" && <Badge className="ml-2 bg-white text-purple-600 text-xs">You</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Badge className="bg-purple-600">1</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Chief Executive Officer</p>
                      </CardContent>
                    </Card>

                    {/* Executive */}
                    <Card
                      className={`border-2 ${
                        user?.tier === "executive" ? "border-blue-400 ring-2 ring-blue-200" : "border-blue-200"
                      }`}
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <CardTitle className="flex items-center text-sm">
                          <Star className="h-4 w-4 mr-2" />
                          Executive
                          {user?.tier === "executive" && (
                            <Badge className="ml-2 bg-white text-blue-600 text-xs">You</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Badge className="bg-blue-600">2</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Executive leadership</p>
                      </CardContent>
                    </Card>

                    {/* Manager */}
                    <Card
                      className={`border-2 ${
                        user?.tier === "manager" ? "border-green-400 ring-2 ring-green-200" : "border-green-200"
                      }`}
                    >
                      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        <CardTitle className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          Manager
                          {user?.tier === "manager" && (
                            <Badge className="ml-2 bg-white text-green-600 text-xs">You</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Badge className="bg-green-600">3</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Management team</p>
                      </CardContent>
                    </Card>

                    {/* Standard */}
                    <Card
                      className={`border-2 ${
                        user?.tier === "standard" ? "border-orange-400 ring-2 ring-orange-200" : "border-orange-200"
                      }`}
                    >
                      <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                        <CardTitle className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          Standard
                          {user?.tier === "standard" && (
                            <Badge className="ml-2 bg-white text-orange-600 text-xs">You</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Badge className="bg-orange-600">1</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Standard members</p>
                      </CardContent>
                    </Card>

                    {/* Honorary */}
                    <Card
                      className={`border-2 ${
                        user?.tier === "honorary" ? "border-gray-400 ring-2 ring-gray-200" : "border-gray-200"
                      }`}
                    >
                      <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white">
                        <CardTitle className="flex items-center text-sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Honorary
                          {user?.tier === "honorary" && (
                            <Badge className="ml-2 bg-white text-gray-600 text-xs">You</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Badge className="bg-gray-600">1</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Honorary members</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Rules & Guidelines */}
              <section id="rules" className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                  <div className="flex items-center mb-8">
                    <Shield className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Rules & Guidelines</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Core Principles</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-l-4 border-green-600 pl-4">
                          <h4 className="font-semibold mb-2">1. Respect & Professionalism</h4>
                          <p className="text-sm text-gray-600">
                            Treat all members with respect regardless of rank, experience, or background. Maintain
                            professional communication in all channels.
                          </p>
                        </div>
                        <div className="border-l-4 border-blue-600 pl-4">
                          <h4 className="font-semibold mb-2">2. Confidentiality</h4>
                          <p className="text-sm text-gray-600">
                            All internal discussions, projects, and member information must remain confidential. No
                            sharing outside the organization.
                          </p>
                        </div>
                        <div className="border-l-4 border-purple-600 pl-4">
                          <h4 className="font-semibold mb-2">3. Active Participation</h4>
                          <p className="text-sm text-gray-600">
                            Regular attendance at meetings and active contribution to projects is expected. Notify
                            leadership of extended absences.
                          </p>
                        </div>
                        <div className="border-l-4 border-orange-600 pl-4">
                          <h4 className="font-semibold mb-2">4. Quality Standards</h4>
                          <p className="text-sm text-gray-600">
                            All work must meet established quality standards. Seek help when needed and review work
                            before submission.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Disciplinary Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <h4 className="font-semibold text-yellow-800 mb-2">Warning System</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• First violation: Verbal warning</li>
                            <li>• Second violation: Written warning</li>
                            <li>• Third violation: Probationary status</li>
                            <li>• Fourth violation: Membership review</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                          <h4 className="font-semibold text-red-800 mb-2">Immediate Removal</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• Breach of confidentiality</li>
                            <li>• Harassment or discrimination</li>
                            <li>• Sabotage of projects or systems</li>
                            <li>• Sharing credentials or access</li>
                          </ul>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="/code-of-conduct">
                            <FileText className="h-4 w-4 mr-2" />
                            View Complete Code of Conduct
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Resources & Links */}
              <section id="resources" className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto max-w-6xl">
                  <div className="flex items-center mb-8">
                    <LinkIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-3xl font-bold text-gray-900">Important Resources</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Communication */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600">Communication</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://discord.gg/projectarcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Discord Server
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://slack.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Slack Workspace
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="mailto:team@projectarcadia.com">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Team Email
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Project Management */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-600">Project Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://github.com/projectarcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub Organization
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://trello.com/projectarcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Trello Boards
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://notion.so/projectarcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Notion Workspace
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documentation */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Documentation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://docs.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Member Handbook
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://wiki.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Project Wiki
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://tally.so/r/m6zWyk" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Referral Form
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Tools & Systems */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-orange-600">Tools & Systems</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://drive.google.com/drive/folders/arcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Google Drive Folder
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://calendar.google.com/calendar/arcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Project Arcadia Full Calendar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://zoom.us/j/arcadia" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Main Meeting ID
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://form.jotform.com/252191736742056" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            New Vote Request
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Learning & Development */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-indigo-600">Learning & Development</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://learn.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Training Portal
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://mentorship.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Mentorship Program
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link href="https://library.projectarcadia.com" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Resource Library
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Emergency Contacts */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Emergency Contacts</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <p className="font-medium">Leadership Emergency Line:</p>
                          <p className="text-gray-600">+1 (555) 911-HELP</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Technical Support:</p>
                          <p className="text-gray-600">tech@projectarcadia.com</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">HR & Conflicts:</p>
                          <p className="text-gray-600">hr@projectarcadia.com</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "chat" && user && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Team Chat</h2>
                <p className="text-lg text-gray-600">
                  Communicate with your team members in real-time across different channels.
                </p>
              </div>
              <Card>
                <CardContent className="p-0">
                  <ChatSystem user={user} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "admin" && isAdmin && user && (
            <div>
              <AdminDashboard currentUser={user} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <MemberPortal />
    </AuthGuard>
  )
}
